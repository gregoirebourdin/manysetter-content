"""Sound kit for Setty reels: Charon voice chain + bleeps, an original half-time trap beat, SFX, ducking, master.

A reel's audio.py only places its sounds on its cues; this module does the rest:

    M = Mix(__file__)                  # reads <reel>/cues.json and ../vo/<reel>/vo.wav (bleeps + dialogue chain)
    M.trap(SECTIONS)                   # the beat, with sections that stop on the comedic beats
    M.drone(t0, t1)                    # low drone under a dead-serious line on black
    M.word_ticks()                     # a soft tick under every caption word
    place(M.sfx, impact(44), 0.0, 0.5) # every motion gets its SFX (synth.py), never on a word onset
    M.finish()                         # duck, mix, master → audio/mix.wav and audio/mix_nomusic.wav (-14 LUFS)

Same calls in the same order = the same file, bit for bit (the random stream of synth.py is seeded).
"""
import json
import pathlib
import subprocess
import tempfile

import numpy as np
import soundfile as sf

from synth import *  # noqa: F403  (SR, rng, place, instruments, SFX)
from synth import SR, bell, bp, clap, env_adsr, hat, kick, lp, midi, noise_swell, place, rng, t_, thump, blip

STUDIO = pathlib.Path(__file__).resolve().parents[1]

# ---------------------------------------------------------------- extra SFX (reel1)


def boing(f0=180, f1=520, dur=0.35):
    t = t_(dur)
    f = f0 + (f1 - f0) * (1 - np.exp(-t * 18)) + 40 * np.sin(2 * np.pi * 16 * t) * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)


def zap(dur=0.35):
    t = t_(dur)
    buzz = np.sign(np.sin(2 * np.pi * 120 * t)) * 0.3 + bp(rng.standard_normal(len(t)), 2000, 9000) * 0.7
    return buzz * np.exp(-t * 12) * (0.6 + 0.4 * np.sin(2 * np.pi * 37 * t))


def hum(dur=0.9):
    t = t_(dur)
    s = sum(np.sin(2 * np.pi * 60 * k * t) / k for k in (1, 2, 3, 5))
    return lp(s, 900) * np.minimum(1, t * 8) * np.exp(-t * 2.5) * 0.4


def beep(f=880, dur=0.1):
    t = t_(dur)
    return np.sin(2 * np.pi * f * t) * env_adsr(len(t), 0.003, 0.01, 1, 0.01)


def key_click():
    n = int(0.04 * SR)
    return bp(rng.standard_normal(n), 2500, 8000) * np.exp(-np.arange(n) / SR * 220) * 0.7 + thump(260)[:n] * 0.3


def riser(dur):
    return noise_swell(dur, 300, 6000, up=True)


# ---------------------------------------------------------------- the founder's sounds (assets/sounds, 19/10)

SOUNDS = STUDIO / "assets/sounds"
# where each sound "hits" (s into the file): its transient, its climax or its first syllable
HIT = {"boom": 0.0, "clic": 0.29, "riser": 7.03, "fahhh": 0.17}
# his music and riser stay well under the voices (Grégoire 20/10: "trop forts"): music ≈ 20 dB under a line once ducked
MUSIC_BED_GAIN, RISER_GAIN = 0.17, 0.1
_CACHE = {}


def sample(name):
    """One of Grégoire's sounds (assets/sounds/<name>.mp3), stereo float at SR."""
    if name not in _CACHE:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(SOUNDS / f"{name}.mp3"), "-f", "f32le", "-ac", "2",
                              "-ar", str(SR), "-"], capture_output=True, check=True).stdout
        _CACHE[name] = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)
    return _CACHE[name]


def cut_sample(name, start=0.0, length=None, fade_in=0.004, fade_out=0.25):
    """A slice of a sound, with short fades so it never clicks."""
    x = sample(name)
    a = max(0, int(start * SR))
    b = len(x) if length is None else min(len(x), a + int(length * SR))
    y = x[a:b].copy()
    fi, fo = int(fade_in * SR), int(min(fade_out, len(y) / SR / 2) * SR)
    if fi:
        y[:fi] *= np.linspace(0, 1, fi)[:, None]
    if fo:
        y[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return y


def pop():
    b, th = blip("recv"), thump(320)
    out = np.zeros(max(len(b), len(th)))
    out[: len(b)] += b * 0.6
    out[: len(th)] += th * 0.4
    return out


# ---------------------------------------------------------------- the beat's instruments


def b808(f, dur, glide_to=None):
    t = t_(dur)
    ff = f if glide_to is None else f * (glide_to / f) ** np.clip((t - dur * 0.6) / (dur * 0.4), 0, 1)
    s = np.sin(2 * np.pi * np.cumsum(ff) / SR)
    s = np.tanh(2.2 * s) * 0.8
    return s * env_adsr(len(t), 0.004, 0.2, 0.75, 0.12)


def snare():
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.6
    return body + clap(0.3)[:n]


def bell_note(f, dur=0.5):
    return bell(f, dur, 1.4, 3.0) * 0.5


# ---------------------------------------------------------------- the mix


class Mix:
    def __init__(self, audio_file):
        self.here = pathlib.Path(audio_file).resolve().parent
        self.id = self.here.name
        D = json.loads((self.here / "cues.json").read_text())
        self.C, self.WORDS, self.BLEEPS = D["cues"], D["words"], D["bleeps"]
        self.TOTAL = self.C["total"]
        self.N = int(self.TOTAL * SR) + SR // 2
        self.OUT = self.here / "audio"
        self.voice, self.VOX = self._voice()
        self.music = self.buf()
        self.sfx = self.buf()
        self.events = []  # (sound, time of its hit): audio/sfx.json, read by studio.py's lint (an SFX on a word onset)

    def buf(self):
        return np.zeros((self.N, 2))

    def _voice(self):
        N, WORDS, TOTAL = self.N, self.WORDS, self.TOTAL
        vo, sr = sf.read(STUDIO / f"vo/{self.id}/vo.wav", dtype="float64")
        assert sr == SR
        vo = vo if vo.ndim == 1 else vo.mean(axis=1)
        voice = np.zeros(N)
        voice[: len(vo)] = vo
        bleep_track = np.zeros(N)
        peak = np.percentile(np.abs(vo), 99.5)
        for b in self.BLEEPS:
            # let the first consonant through ("b—", "f—", "sh—"), then the classic 1 kHz bleep;
            # never into the next word ("…ing challenge")
            nxt = WORDS[b["i"] + 1]["t"] if b["i"] + 1 < len(WORDS) else TOTAL
            a, z = b["t"] + 0.07, min(b["end"] + 0.04, nxt - 0.015)
            i, j = int(a * SR), int(z * SR)
            f = int(0.006 * SR)
            voice[i - f : i] *= np.linspace(1, 0, f)
            voice[i:j] = 0
            tt = np.arange(j - i) / SR
            tone = np.sin(2 * np.pi * 1000 * tt) * env_adsr(j - i, 0.004, 0.01, 1, 0.01) * peak * 0.55
            bleep_track[i:j] += tone
        # reel dialogue chain: a little less box, a little more presence, gentle glue
        with tempfile.TemporaryDirectory() as td:
            src, dst = pathlib.Path(td) / "v.wav", pathlib.Path(td) / "o.wav"
            sf.write(src, voice.astype(np.float32), SR, subtype="FLOAT")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-af",
                            "highpass=f=80:poles=2,equalizer=f=260:t=q:w=1:g=-3,equalizer=f=3000:t=q:w=1:g=3,"
                            "highshelf=f=8000:g=2,deesser=i=0.3:m=0.5:f=0.5,"
                            "acompressor=threshold=-20dB:ratio=3:attack=6:release=120:knee=6",
                            "-c:a", "pcm_f32le", str(dst)], check=True)
            voice, _ = sf.read(dst, dtype="float64")
        voice = voice[:N] + bleep_track[:N]
        return voice, np.stack([voice, voice], axis=1)

    # ---- music
    def trap(self, sections, bpm=150, bass=(30, 30, 26, 28), melo=(78, 81, 78, 76, 73, 76, 78, 73)):
        """Original half-time trap: kick, snare, hats with rolls, 808 with glides, a bell motif.
        sections: [(start, end, "full"|"lite")]; outside them the beat stops (the comedic beats)."""
        music, BEAT = self.music, 60 / bpm
        BASS = [midi(n) for n in bass]
        MELO = list(melo)

        def in_section(t):
            for a, z, kind in sections:
                if a <= t < z:
                    return kind
            return None

        nb = int(self.TOTAL / BEAT) + 2
        for k in range(nb):
            t = k * BEAT
            kind = in_section(t)
            if not kind:
                continue
            bar, pos = divmod(k, 4)
            if pos == 0:
                place(music, kick(0.45), t, 0.9)
                place(music, b808(BASS[bar % 4], BEAT * 3.6, BASS[(bar + 1) % 4] if bar % 2 else None), t, 0.55)
            if pos == 2 and kind == "full":
                place(music, kick(0.4, 0.6), t + BEAT * 0.75, 0.55)
            if pos == 2:
                place(music, snare(), t, 0.55)
            if kind == "full":
                # hats on 8ths, a 32nd roll at the end of every other bar
                for h in range(2):
                    place(music, hat(0.05), t + h * BEAT / 2, 0.16 + 0.06 * (h == 0), pan=0.25)
                if pos == 3 and bar % 2 == 1:
                    for r in range(6):
                        place(music, hat(0.03), t + BEAT / 2 + r * BEAT / 12, 0.1 + 0.02 * r, pan=-0.2)
                # the cheeky bell motif, once every 2 bars
                if pos in (0, 1, 2, 3) and bar % 2 == 0:
                    n = MELO[(bar // 2 * 4 + pos) % len(MELO)]
                    place(music, bell_note(midi(n), 0.45), t + BEAT * 0.5, 0.11, pan=0.3)

    def drone(self, t0, t1, gain=1.0):
        """Low drone (41 Hz) under a dead-serious line on black, from t0 to t1."""
        dr = t_(t1 - t0)
        d = (np.sin(2 * np.pi * 41.2 * dr) + 0.3 * np.sin(2 * np.pi * 82.4 * dr)) * np.minimum(1, dr * 3) * 0.35
        place(self.music, lp(d, 300), t0, gain)

    # ---- SFX patterns (reel1)
    def word_ticks(self, gain=0.1):
        """A soft tick under every caption word, 0.07 s before it (never on the onset)."""
        for w in self.WORDS:
            place(self.sfx, tick_soft(), w["t"] - 0.07, gain, pan=((len(w["w"]) * 3) % 7 - 3) / 6)  # noqa: F405

    def ping_storm(self, t0, t1, n=40):
        """n notification pings accelerating from t0 to t1 (DM rain)."""
        for k in range(n):
            at = t0 + (k / n) ** 0.75 * (t1 - t0)
            place(self.sfx, ping(midi(84 + (k * 5) % 9)), at, 0.12 + 0.002 * k, pan=((k * 37) % 11 - 5) / 6)  # noqa: F405

    def ecg_beeps(self, voice_t, dead_t):
        """Heart monitor: three beeps while the ECG line draws, then the flatline at dead_t."""
        span = dead_t - voice_t + 0.1
        for x in (120, 360, 600):
            place(self.sfx, beep(880, 0.09), voice_t - 0.05 + span * (x + 35) / 1000, 0.2)
        place(self.sfx, beep(880, 0.55), dead_t, 0.22)

    # ---- Grégoire's patterns (19/10): his riser into the hook, his BOOM on every "dinguerie", "Fahhh" on every roast,
    # his click when something pops on screen, his music under it all (no synthesized beat in new reels)
    def riser_into(self, hit, gain=RISER_GAIN, tail=1.0):
        """His riser, cut so its climax lands exactly on `hit` (it starts at frame 0 when the hook is short), then a BOOM."""
        lead = min(hit, HIT["riser"] - 0.2)
        place(self.sfx, cut_sample("riser", HIT["riser"] - lead, lead + tail, fade_in=0.01, fade_out=0.4), hit - lead, gain)
        self.boom(hit)

    def boom(self, t, gain=0.85, length=3.2):
        """His BOOM (sub, below the voice) on the word that lands."""
        place(self.sfx, cut_sample("boom", 0, length, fade_out=1.2), t - HIT["boom"], gain)
        self.events.append(("boom", round(t, 3), gain))

    def fahhh(self, t, gain=0.8):
        """'Fahhh' once a roast has landed: give the line a pause in vo/<reel>_segments.json so it never covers a word."""
        place(self.sfx, cut_sample("fahhh", 0, 1.6, fade_out=0.4), t - HIT["fahhh"], gain)
        self.events.append(("fahhh", round(t, 3), gain))

    def clic(self, t, gain=0.9):
        """His click on something that pops on screen (a card, the inbox, a typed letter)."""
        place(self.sfx, cut_sample("clic", 0.2, 0.5, fade_out=0.15), t - (HIT["clic"] - 0.2), gain)
        self.events.append(("clic", round(t, 3), gain))

    def music_bed(self, name="music_01", drop=0.0, src_drop=136.2, play=None, gain=1.0):
        """His music: the track's own drop (src_drop, s) lands on `drop`; silent before it (the riser alone).
        play: [(t0, t1)] where it plays (it keeps its own time, like a mute), default from drop to the end."""
        x = sample(name)
        for t0, t1 in play or [(drop, self.TOTAL + 0.5)]:
            a = src_drop + (t0 - drop)
            seg = cut_sample(name, a, t1 - t0, fade_in=0.03, fade_out=0.08)
            place(self.music, seg, t0, gain)
        self.music_peak = np.abs(x).max()

    def suck(self, t, dur=0.45, gain=0.4):
        """Reverse swell ending at t (before a punchline or a hard cut)."""
        place(self.sfx, noise_swell(dur, 6000, 400, up=True), t - dur, gain)

    def tape_stop(self, t, dur=0.5):
        """The music dies like a tape stop at t: put it at the end of a music_bed play section (t1 - dur)."""
        i, n = int(t * SR), int(dur * SR)
        seg = self.music[i : i + int(dur * 2.2 * SR)].copy()
        if len(seg) < 4:
            return
        stopped = tape_stop(seg, dur) * np.linspace(1, 0, n)[:, None] ** 0.5  # noqa: F405
        self.music[i : i + n] = stopped[: len(self.music) - i]

    # ---- duck, mix, master
    def finish(self, music_gain=0.42, sfx_gain=0.5, duck_music=0.64, duck_sfx=0.3, tp_max=-1.0):
        """tp_max: true-peak ceiling of the WAV. AAC encoding adds ~0.3 dB: new reels use -1.5 so the MP4 stays ≤ -1 dBTP."""
        voice, music, sfx = self.voice, self.music, self.sfx
        # duck the music under the voice (look-ahead envelope)
        env = np.sqrt(np.convolve(voice**2, np.ones(int(0.03 * SR)) / int(0.03 * SR), "same"))
        env = env / (env.max() + 1e-9)
        la = int(0.06 * SR)
        env = np.concatenate([env[la:], np.zeros(la)])
        sm = np.convolve(env, np.ones(int(0.12 * SR)) / int(0.12 * SR), "same")
        duck = 1 - duck_music * np.clip(sm * 3, 0, 1)
        music *= duck[:, None]
        # SFX also step back a little while Setty talks
        sfx *= (1 - duck_sfx * np.clip(sm * 3, 0, 1))[:, None]
        self.OUT.mkdir(exist_ok=True)
        mix = self.VOX * 1.0 + music * music_gain + sfx * sfx_gain
        master(mix, self.OUT / "mix.wav", tp_max=tp_max)
        master(self.VOX * 1.0 + sfx * sfx_gain, self.OUT / "mix_nomusic.wav", tp_max=tp_max)
        (self.OUT / "sfx.json").write_text(json.dumps(self.events))


def master(stem, path, target=-14.0, limit=-1.5, tp_max=-1.0):
    """Constant gain to -14 LUFS + alimiter (never loudnorm in dynamic mode). If the true peak still lands
    above tp_max (inter-sample peaks), the limiter is lowered and the file redone."""
    with tempfile.TemporaryDirectory() as td:
        raw = pathlib.Path(td) / "raw.wav"
        sf.write(raw, stem.astype(np.float32), SR, subtype="FLOAT")
        r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(raw), "-af", "ebur128", "-f", "null", "-"],
                           capture_output=True, text=True)
        I = float(r.stderr.split("Integrated loudness:")[1].split("I:")[1].split("LUFS")[0])
        gain = target - I
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af",
                        f"volume={gain:.2f}dB,alimiter=limit={limit}dB:attack=2:release=60:level=disabled:latency=1",
                        "-c:a", "pcm_s16le", str(path)], check=True)
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True)
    summ = r.stderr.split("Summary:")[1]
    I2 = summ.split("I:")[1].split("LUFS")[0].strip()
    P2 = summ.split("Peak:")[1].split("dBFS")[0].strip()
    if float(P2) > tp_max and limit > -4.0:
        return master(stem, path, target, limit - 1.0, tp_max)
    print(f"{path.name}: {I2} LUFS, true peak {P2} dBTP")
