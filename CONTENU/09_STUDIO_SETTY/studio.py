#!/usr/bin/env python3
"""Setty reel studio: one command per step, from the validated script to the post ready to publish.

    python3 studio.py doctor                     tools, browser, voice key, models (what to install, exactly)
    python3 studio.py new reel2 webinar          scaffold a reel from templates/reel (hook + CTA already acted)
    python3 studio.py voice reel2 --yes          PAID (Gemini, a few cents): 3 Charon takes in parallel, Whisper
                                                 check, tight pauses, word timing; picks the best take
    python3 studio.py build reel2                captions + cues + index.html (from the voice timing)
    python3 studio.py snap reel2 [--at 0.3,4.2]  frames → contact sheet to look at (default: one every 1.2 s)
    python3 studio.py audio reel2                beat + SFX + mix (-14 LUFS), then Whisper on the mix
    python3 studio.py check reel2                HyperFrames check (layout, motion, contrast) + house rules
    python3 studio.py go reel2                   build → audio → snap → check (everything between voice and render)
    python3 studio.py render reel2 [--fps 60]    MP4 in renders/ (30 fps preview by default, 60 fps final)
    python3 studio.py deliver reel2 [file.mp4]   two MP4s (with / without music) + QA + post folder in 07_PRET_A_PUBLIER
    python3 studio.py regress [--before]         kit changes: reel1 frames before/after must stay identical
    python3 studio.py cut reel2 0 [5 …]          drop whole lines from the validated voice (free, no new take)

Run it from anywhere with any python3: the steps that need numpy/torch use the repo's .venv.
"""
import argparse
import concurrent.futures as cf
import datetime
import glob
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys

STUDIO = pathlib.Path(__file__).resolve().parent
REPO = STUDIO.parents[1]
VENV_PY = REPO / ".venv/bin/python"
PY = str(VENV_PY if VENV_PY.exists() else sys.executable)
HF = ["npx", "--yes", "hyperframes@0.8.114"]
KEY_FILE = pathlib.Path.home() / ".config/manysetter/gemini.env"
PUBLISH = REPO / "CONTENU/07_PRET_A_PUBLIER"
TARGET = (25.5, 29.5)  # default seconds of tightened voice (reel = voice + 1.6 s); a reel sets "voice_s" in reel.json


def say(msg=""):
    print(msg, flush=True)


def run(cmd, **kw):
    kw.setdefault("cwd", STUDIO)
    kw.setdefault("env", env())
    return subprocess.run(cmd, **kw)


def browser():
    """A Chrome that launches on this Mac (the puppeteer 121 build crashes on macOS 26)."""
    if os.environ.get("HYPERFRAMES_BROWSER_PATH"):
        return os.environ["HYPERFRAMES_BROWSER_PATH"]
    home = pathlib.Path.home()
    cands = sorted(glob.glob(str(home / "Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell")),
                   key=lambda p: int(re.search(r"shell-(\d+)", p).group(1)), reverse=True)
    cands += ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
    return next((c for c in cands if os.path.exists(c)), None)


def env():
    e = dict(os.environ)
    b = browser()
    if b:
        e["HYPERFRAMES_BROWSER_PATH"] = b
    return e


def reel_dir(reel):
    d = STUDIO / reel
    if not (d / "build.py").exists():
        sys.exit(f"{reel}: no {reel}/build.py (create it with: python3 studio.py new {reel} <slug>)")
    return d


def target(reel):
    f = STUDIO / reel / "reel.json"
    return tuple(json.loads(f.read_text()).get("voice_s", TARGET)) if f.exists() else TARGET


def has_key():
    if os.environ.get("GEMINI_API_KEY"):
        return True
    return KEY_FILE.exists() and "GEMINI_API_KEY=" in KEY_FILE.read_text()


# ---------------------------------------------------------------- doctor

def cmd_doctor(a):
    ok = True

    def line(good, what, fix=""):
        nonlocal ok
        ok &= good
        say(f"  {'✓' if good else '✗'} {what}" + (f"\n      → {fix}" if fix and not good else ""))

    say("Setty studio: tools")
    line(shutil.which("node") is not None, f"Node.js {subprocess.run(['node', '--version'], capture_output=True, text=True).stdout.strip() if shutil.which('node') else ''}", "brew install node")
    line(shutil.which("ffmpeg") is not None, "FFmpeg", "brew install ffmpeg")
    line(VENV_PY.exists(), f"Python venv {VENV_PY}", "python3 -m venv .venv (from the repo root)")
    if VENV_PY.exists():
        r = subprocess.run([PY, "-c", "import numpy, scipy, soundfile, torch, torchaudio, faster_whisper, requests; "
                            "import torchaudio.functional as F; assert hasattr(F, 'forced_align')"], capture_output=True, text=True)
        line(r.returncode == 0, "Python packages (numpy, scipy, soundfile, torch, torchaudio, faster-whisper, requests)",
             f'{VENV_PY} -m pip install "torch==2.8.0" "torchaudio==2.8.0" scipy soundfile num2words faster-whisper requests')
    b = browser()
    line(b is not None, f"Chrome for rendering: {b}", "npx playwright install chromium-headless-shell (or install Google Chrome)")
    w2v = pathlib.Path.home() / ".cache/torch/hub/checkpoints/wav2vec2_fairseq_base_ls960_asr_ls960.pth"
    line(w2v.exists(), "wav2vec2 alignment model (downloads once, 360 MB, on the first voice step)", "nothing to do")
    fw = list((pathlib.Path.home() / ".cache/huggingface/hub").glob("models--Systran--faster-whisper-small.en"))
    line(bool(fw), "Whisper small.en (voice check)", "downloads on first use")
    line(has_key(), "Gemini key (Charon voice) in ~/.config/manysetter/gemini.env",
         "Grégoire runs, in his own terminal (the key is typed, never shown or saved in the repo):\n"
         "        mkdir -p ~/.config/manysetter && read -s \"k?Clé Gemini : \" && printf 'GEMINI_API_KEY=%s\\n' \"$k\" "
         "> ~/.config/manysetter/gemini.env && chmod 600 ~/.config/manysetter/gemini.env && unset k")
    du = shutil.disk_usage(STUDIO)
    line(du.free > 5e9, f"Disk: {du.free / 1e9:.1f} GB free", "free some space (renders need ~2 GB of frames)")
    say("\nall good" if ok else "\nfix the ✗ lines above")


# ---------------------------------------------------------------- new

def cmd_new(a):
    reel, slug = a.reel, a.slug
    d = STUDIO / reel
    if d.exists():
        sys.exit(f"{reel} already exists")
    tpl = STUDIO / "templates/reel"
    shutil.copytree(tpl, d, symlinks=True, ignore=shutil.ignore_patterns("writing.md", "segments.json", "README.md"))
    (d / "assets").symlink_to("../assets")
    (d / "audio").mkdir(exist_ok=True)
    meta = json.loads((d / "reel.json").read_text())
    meta.update({"id": reel, "slug": slug, "created": datetime.date.today().isoformat()})
    (d / "reel.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False) + "\n")
    seg = STUDIO / f"vo/{reel}_segments.json"
    if not seg.exists():
        shutil.copy(tpl / "segments.json", seg)
    w = STUDIO / f"writing/{reel}_{slug}.md"
    if not w.exists():
        w.write_text((tpl / "writing.md").read_text().replace("{{REEL}}", reel).replace("{{SLUG}}", slug))
    say(f"created {reel}/ (build.py, src/scenes.js, audio.py, reel.json), vo/{reel}_segments.json, writing/{w.name}")
    say(f"next: write the script in writing/{w.name} → validation ✋ → vo/{reel}_segments.json → python3 studio.py voice {reel} --yes")


# ---------------------------------------------------------------- voice

def check_vo(wav, script, optional=""):
    cmd = [PY, "scripts/check_vo.py", str(wav), str(script), "--json"] + (["--optional", optional] if optional else [])
    r = run(cmd, capture_output=True, text=True)
    out = [l for l in r.stdout.splitlines() if l.startswith("{")]
    return json.loads(out[-1]) if out else {"errors": 99, "problems": [["error", r.stderr[-300:], ""]], "heard": ""}


def wav_dur(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def cmd_voice(a):
    reel = a.reel
    seg = STUDIO / f"vo/{reel}_segments.json"
    if not seg.exists():
        sys.exit(f"missing {seg.relative_to(STUDIO)} (one segment per line, each with its delivery direction)")
    segs = json.loads(seg.read_text())
    if any("who" in sg for sg in segs):
        return voice_dialogue(a, reel, segs)
    script = STUDIO / f"vo/{reel}_script.txt"
    script.write_text(" ".join(s["text"] for s in segs) + "\n")
    takes_dir = STUDIO / "vo/takes"
    takes_dir.mkdir(parents=True, exist_ok=True)
    words = sum(len(s["text"].split()) for s in segs)
    lo, hi = target(reel)
    say(f"{reel}: {len(segs)} lines, {words} words (~{words / 3.15:.0f} s of voice; target {lo}–{hi} s)")

    if a.take:
        takes = [takes_dir / f"{reel}_try{a.take}.wav"]
    else:
        if not has_key():
            sys.exit("no Gemini key: run `python3 studio.py doctor` for the one command Grégoire types himself")
        if not a.yes:
            sys.exit(f"the voice is paid (Gemini TTS, {a.takes} takes, a few cents): rerun with --yes once Grégoire has said go")
        start = max([int(m.group(1)) for p in takes_dir.glob(f"{reel}_try*.wav") if (m := re.search(r"_try(\d+)", p.name))] or [0]) + 1
        takes = [takes_dir / f"{reel}_try{start + k}.wav" for k in range(a.takes)]
        say(f"generating {len(takes)} Charon takes in parallel…")
        with cf.ThreadPoolExecutor(len(takes)) as ex:
            futs = {ex.submit(run, [PY, "scripts/tts_gemini.py", "--voice", a.voice, "--segments", str(seg), "--out", str(t),
                                    "--no-fallback"], capture_output=True, text=True): t for t in takes}
            for f in cf.as_completed(futs):
                r = f.result()
                say(f"  {futs[f].name}: " + (r.stdout.strip() or r.stderr.strip()[-300:]))
        takes = [t for t in takes if t.exists()]
        if not takes:
            sys.exit("no take was generated (see the errors above)")

    # Whisper check of every take, in parallel
    say("checking every word with Whisper…")
    with cf.ThreadPoolExecutor(min(3, len(takes))) as ex:
        checks = dict(zip(takes, ex.map(lambda t: check_vo(t, script), takes)))
    best_err = min(c["errors"] for c in checks.values())
    cands = [t for t in takes if checks[t]["errors"] == best_err]

    # tighten the pauses of the candidates, keep the one closest to the target length
    res = {}
    for t in cands:
        out = STUDIO / f"vo/_cand/{reel}/{t.stem}"
        gap = json.loads((STUDIO / reel / "reel.json").read_text()).get("line_gap", 0) if (STUDIO / reel / "reel.json").exists() else 0
        r = run([PY, "scripts/voice.py", str(seg), str(t), str(out), "--rate", str(a.rate), "--gap", str(gap)], capture_output=True, text=True)
        if r.returncode:
            say(f"  {t.name}: alignment failed: {r.stderr.strip()[-400:]}")
            continue
        tim = json.loads((out / "timing.json").read_text())
        weak = [w["w"] for w in tim["words"] if w["score"] < 0.35]
        res[t] = {"dir": out, "dur": tim["duration"], "weak": weak}
    if not res:
        sys.exit("no take could be aligned")
    lo, hi = target(reel)
    mid = (lo + hi) / 2
    pick = min(res, key=lambda t: (not (lo <= res[t]["dur"] <= hi), abs(res[t]["dur"] - mid), len(res[t]["weak"])))

    say(f"\n  {'take':<16}{'raw':>7}{'tight':>8}  errors / weak alignments")
    for t in takes:
        c = checks[t]
        r = res.get(t)
        mark = "  ← kept" if t == pick else ""
        probs = "; ".join(f"{p[0]} {p[1]!r}→{p[2]!r}" for p in c["problems"][:3])
        say(f"  {t.name:<16}{wav_dur(t):>6.1f}s{(r['dur'] if r else 0):>7.1f}s  {c['errors']} {probs} {('weak: ' + ', '.join(r['weak'])) if r and r['weak'] else ''}{mark}")

    dest = STUDIO / f"vo/{reel}"
    dest.mkdir(parents=True, exist_ok=True)
    for f in ("vo.wav", "timing.json"):
        shutil.copy(res[pick]["dir"] / f, dest / f)
    final = check_vo(dest / "vo.wav", script)
    say(f"\nvo/{reel}/vo.wav: {res[pick]['dur']:.2f}s (reel ≈ {res[pick]['dur'] + 1.6:.1f}s), Whisper on the tightened voice: "
        + ("OK" if final["errors"] == 0 else f"{final['errors']} issue(s): {final['problems'][:4]}"))
    if not (lo <= res[pick]["dur"] <= hi):
        say(f"  ! outside {lo}–{hi} s: cut or add words, or --rate 1.05 (never slower than 1.0)")
    say(f"next: python3 studio.py go {reel}")


def voice_dialogue(a, reel, segs):
    """Dialogue reels (segments carry "who"): one voice per speaker, takes per speaker and per candidate voice, each
    checked by Whisper and tightened (voice.py), then the lines laid in script order (scripts/dialogue.py). With several
    candidates for a speaker (casting), every combination is assembled in vo/_dialogue/<reel>/ and --pick installs one."""
    cfg = {}
    for part in (a.voices or "").split(","):
        if part.strip():
            who, vs = part.split("=")
            cfg[who.strip()] = [v.strip() for v in vs.split("|") if v.strip()]
    whos = list(dict.fromkeys(sg["who"] for sg in segs))
    for w in whos:
        cfg.setdefault(w, ["Charon"] if w == "setty" else [])
    if missing := [w for w in whos if not cfg[w]]:
        sys.exit(f"no voice for {missing}: --voices \"{missing[0]}=Puck|Fenrir\" (casting) or one fixed voice")
    work = STUDIO / f"vo/_dialogue/{reel}"
    work.mkdir(parents=True, exist_ok=True)
    takes_dir = STUDIO / "vo/takes"
    takes_dir.mkdir(parents=True, exist_ok=True)
    (STUDIO / f"vo/{reel}_script.txt").write_text(" ".join(sg["text"] for sg in segs) + "\n")
    for w in whos:
        sub = [{"text": sg["text"], "style": sg.get("style", "")} for sg in segs if sg["who"] == w]
        (work / f"{w}_segments.json").write_text(json.dumps(sub, indent=1, ensure_ascii=False))
        (work / f"{w}_script.txt").write_text(" ".join(x["text"] for x in sub) + "\n")
    jobs = [(w, v) for w in whos for v in cfg[w]]
    takes = {}
    for w, v in jobs:
        have = sorted(takes_dir.glob(f"{reel}_{w}_{v}_try*.wav"))
        if a.take or a.reuse:
            takes[(w, v)] = have
        else:
            n0 = len(have)
            takes[(w, v)] = [takes_dir / f"{reel}_{w}_{v}_try{n0 + k + 1}.wav" for k in range(a.takes)]
    todo = [(w, v, t) for (w, v), ts in takes.items() for t in ts if not t.exists()]
    if todo:
        if not has_key():
            sys.exit("no Gemini key: run `python3 studio.py doctor` for the one command Grégoire types himself")
        if not a.yes:
            sys.exit(f"the voices are paid (Gemini TTS, {len(todo)} takes, a few cents): rerun with --yes once Grégoire has said go")
        say(f"generating {len(todo)} takes ({', '.join(f'{w}={v}' for w, v in jobs)}), 4 at a time…")
        with cf.ThreadPoolExecutor(4) as ex:
            futs = {ex.submit(run, [PY, "scripts/tts_gemini.py", "--voice", v, "--segments", str(work / f"{w}_segments.json"),
                                    "--out", str(t), "--no-fallback"], capture_output=True, text=True): t for w, v, t in todo}
            for f in cf.as_completed(futs):
                r = f.result()
                say(f"  {futs[f].name}: " + (r.stdout.strip() or r.stderr.strip()[-300:]))
    best = {}
    for (w, v), ts in takes.items():
        ts = [t for t in ts if t.exists()]
        if not ts:
            sys.exit(f"no take for {w}={v}")
        with cf.ThreadPoolExecutor(min(3, len(ts))) as ex:
            checks = dict(zip(ts, ex.map(lambda t: check_vo(t, work / f"{w}_script.txt"), ts)))
        res = {}
        for t in ts:
            out = work / f"{w}_{v}" / t.stem
            r = run([PY, "scripts/voice.py", str(work / f"{w}_segments.json"), str(t), str(out), "--gap", "0.3"],
                    capture_output=True, text=True)
            if r.returncode:
                say(f"  {t.name}: alignment failed: {r.stderr.strip()[-300:]}")
                continue
            tim = json.loads((out / "timing.json").read_text())
            res[t] = {"dir": out, "dur": tim["duration"], "weak": [x["w"] for x in tim["words"] if x["score"] < 0.35],
                      "err": checks[t]["errors"], "probs": checks[t]["problems"][:3]}
        if not res:
            sys.exit(f"no take of {w}={v} could be aligned")
        pick = min(res, key=lambda t: (res[t]["err"], len(res[t]["weak"]), res[t]["dur"]))
        best[(w, v)] = res[pick]["dir"]
        for t, r in res.items():
            say(f"  {t.name:<34}{r['dur']:>6.1f}s  errors {r['err']} {r['probs'] if r['err'] else ''}"
                f"{(' weak: ' + ', '.join(r['weak'])) if r['weak'] else ''}{'  ← kept' if t == pick else ''}")
    # every combination of the candidate voices
    import itertools
    rj = json.loads((STUDIO / reel / "reel.json").read_text()) if (STUDIO / reel / "reel.json").exists() else {}
    combos = list(itertools.product(*[[(w, v) for v in cfg[w]] for w in whos]))
    labels = {}
    for combo in combos:
        label = "_".join(f"{w}-{v}" for w, v in combo)
        out = work / "mix" / label
        r = run([PY, "scripts/dialogue.py", str(STUDIO / f"vo/{reel}_segments.json"), str(out),
                 *[f"{w}={best[(w, v)]}" for w, v in combo], "--turn-gap", str(rj.get("turn_gap", 0.2))],
                capture_output=True, text=True)
        if r.returncode:
            sys.exit(r.stderr[-600:])
        labels[label] = out
        say(f"  {label}: {json.loads((out / 'timing.json').read_text())['duration']:.1f}s → {out.relative_to(STUDIO)}/vo.wav")
    choice = a.pick or next(iter(labels))
    choice = next((l for l in labels if a.pick and a.pick in l), choice)
    dest = STUDIO / f"vo/{reel}"
    dest.mkdir(parents=True, exist_ok=True)
    for f in ("vo.wav", "timing.json"):
        shutil.copy(labels[choice] / f, dest / f)
    final = check_vo(dest / "vo.wav", STUDIO / f"vo/{reel}_script.txt")
    say(f"\ninstalled {choice} in vo/{reel}/ ({json.loads((dest / 'timing.json').read_text())['duration']:.1f}s), Whisper: "
        + ("OK" if final["errors"] == 0 else f"{final['errors']} issue(s): {final['problems'][:4]}"))
    if len(labels) > 1:
        say(f"other versions in vo/_dialogue/{reel}/mix/; install one with: python3 studio.py voice {reel} --reuse --pick <voice>")


# ---------------------------------------------------------------- build / audio / snap / check

def cmd_build(a):
    r = run([PY, f"{reel_dir(a.reel).name}/build.py"])
    if r.returncode:
        sys.exit(r.returncode)


def cmd_audio(a):
    d = reel_dir(a.reel)
    if not (d / "cues.json").exists():
        cmd_build(a)
    r = run([PY, f"{d.name}/audio.py"])
    if r.returncode:
        sys.exit(r.returncode)
    data = json.loads((d / "cues.json").read_text())
    swears = ",".join(data["words"][b["i"]]["w"] for b in data["bleeps"])
    script = STUDIO / f"vo/{a.reel}_script.txt"
    if script.exists() and not a.no_whisper:
        c = check_vo(d / "audio/mix.wav", script, swears)
        if c["errors"]:
            say(f"  ! Whisper on the mix: {c['problems']} (listen: a word masked by an SFX or the beat?)")
        else:
            say("  Whisper on the mix: every word understood")


def snap_times(d, every=1.2):
    total = json.loads((d / "cues.json").read_text())["cues"]["total"]
    ts, t = [0.3], 0.3 + every
    while t < total - 0.1:
        ts.append(round(t, 2))
        t += every
    ts.append(round(total - 0.2, 2))
    return ts


def cmd_snap(a):
    d = reel_dir(a.reel)
    if not (d / "index.html").exists():
        cmd_build(a)
    at = a.at or ",".join(str(t) for t in snap_times(d, a.every))
    out = d / "snapshots"
    shutil.rmtree(out, ignore_errors=True)
    r = run(HF + ["snapshot", d.name, "--at", at, "--no-end", "--describe", "false", "--timeout", "60000"], capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stdout[-800:] + r.stderr[-800:])
    sheets = sorted(out.glob("contact-sheet*.jpg"))
    say(f"{len(list(out.glob('frame-*.png')))} frames → " + ", ".join(str(s.relative_to(STUDIO)) for s in sheets))


def cmd_check(a):
    d = reel_dir(a.reel)
    r = run(HF + ["check", d.name], capture_output=True, text=True)
    txt = re.sub(r"\x1b\[[0-9;]*m", "", r.stdout + r.stderr)
    keep = [l for l in txt.splitlines() if l.strip() and not l.startswith("[hyperframes]")]
    say("\n".join(keep[-40:]))
    data = json.loads((d / "cues.json").read_text())
    sys.path.insert(0, str(STUDIO / "scripts"))
    from reelkit import lint
    warn = lint(data, max_total=target(a.reel)[1] + 2.1)
    say("house rules: " + ("OK" if not warn else ""))
    for w in warn:
        say(f"  ! {w}")


def cmd_go(a):
    cmd_build(a)
    cmd_audio(a)
    cmd_snap(a)
    if not a.no_check:
        cmd_check(a)


# ---------------------------------------------------------------- render / deliver

def cmd_render(a):
    d = reel_dir(a.reel)
    cmd_build(a)
    if not (d / "audio/mix.wav").exists():
        cmd_audio(a)
    (STUDIO / "renders").mkdir(exist_ok=True)
    n = len(list((STUDIO / "renders").glob(f"{a.reel}_v*_{a.fps}fps.mp4"))) + 1
    out = STUDIO / f"renders/{a.reel}_v{n}_{a.fps}fps.mp4"
    say(f"rendering {out.relative_to(STUDIO)} ({a.fps} fps, {a.workers} workers)… (M1: several minutes, run it in the background)")
    r = run(HF + ["render", d.name, "--fps", str(a.fps), "-o", str(out), "--workers", str(a.workers), "--quality", a.quality])
    if r.returncode:
        sys.exit(r.returncode)
    say(f"next: python3 studio.py deliver {a.reel} {out.relative_to(STUDIO)}")


def probe(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate:format=duration",
                        "-of", "json", str(path)], capture_output=True, text=True)
    return json.loads(r.stdout)


def loudness(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True)
    summ = r.stderr.split("Summary:")[-1]
    return float(summ.split("I:")[1].split("LUFS")[0]), float(summ.split("Peak:")[1].split("dBFS")[0])


def frame0_luma(path):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-frames:v", "1", "-vf", "scale=54:96,format=gray",
                        "-f", "rawvideo", "-"], capture_output=True)
    return sum(r.stdout) / max(1, len(r.stdout))


def cmd_deliver(a):
    d = reel_dir(a.reel)
    src = pathlib.Path(a.file) if a.file else max((STUDIO / "renders").glob(f"{a.reel}_v*.mp4"), key=os.path.getmtime)
    src = src if src.is_absolute() else STUDIO / src
    out = STUDIO / f"deliverables/{a.reel}"
    out.mkdir(parents=True, exist_ok=True)
    files = {"": d / "audio/mix.wav", "_nomusic": d / "audio/mix_nomusic.wav"}
    for suffix, wav in files.items():
        dst = out / f"{a.reel}{suffix}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-i", str(wav), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                        "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart", "-shortest", str(dst)], check=True)

    # QA of the delivered file
    main = out / f"{a.reel}.mp4"
    p = probe(main)
    v = next(s for s in p["streams"] if s["codec_type"] == "video")
    dur = float(p["format"]["duration"])
    I, TP = loudness(main)
    luma = frame0_luma(main)
    qa = [
        (v["width"] == 1080 and v["height"] == 1920, f"1080×1920 ({v['width']}×{v['height']}, {v['r_frame_rate']} fps)"),
        (target(a.reel)[0] - 1 <= dur <= target(a.reel)[1] + 2.1, f"duration {dur:.1f}s (voice {target(a.reel)[0]}–{target(a.reel)[1]} s + tail)"),
        (abs(I + 14) <= 0.7, f"loudness {I:.1f} LUFS (−14)"),
        (TP <= -0.9, f"true peak {TP:.1f} dBTP (≤ −1)"),
        (luma > 18, f"frame 0 is not black (mean luma {luma:.0f}/255): it is the thumbnail"),
    ]
    for good, what in qa:
        say(f"  {'✓' if good else '✗'} {what}")

    # the post folder (07_PRET_A_PUBLIER/<id>/): reel.mp4 (outside Git), caption.txt, post.json
    meta = json.loads((d / "reel.json").read_text())
    pub = meta.get("pub_id")
    if not pub:
        say("reel.json has no pub_id yet (AAMMJJ_REEL_S?_AV?_slug): post folder not created")
        return
    pdir = PUBLISH / pub
    pdir.mkdir(parents=True, exist_ok=True)
    shutil.copy(main, pdir / "reel.mp4")
    shutil.copy(out / f"{a.reel}_nomusic.mp4", pdir / "reel_nomusic.mp4")
    if meta.get("caption"):
        (pdir / "caption.txt").write_text(meta["caption"].rstrip() + "\n")
    post = {k: meta[k] for k in ("funnel", "segment", "avatar", "hook", "biais", "verbatims", "cta") if k in meta}
    post.update({
        "id": pub, "format": "reel Setty (mascotte 3D en code, voix Charon générée par IA)",
        "source": {"studio": f"CONTENU/09_STUDIO_SETTY/{a.reel}", "script": f"CONTENU/09_STUDIO_SETTY/writing/{a.reel}_{meta.get('slug', '')}.md"},
        "etiquette_ia": "« AI info » à activer à la publication (voix réaliste générée par IA)",
        "fichiers": {"video": "reel.mp4 (hors Git)", "sans_musique": "reel_nomusic.mp4 (hors Git, pour un son tendance ajouté dans l'appli)"},
        "qa": {"duree_s": round(dur, 2), "lufs": I, "true_peak_dbtp": TP},
        "statut": meta.get("statut", "à valider"),
    })
    (pdir / "post.json").write_text(json.dumps(post, indent=2, ensure_ascii=False) + "\n")
    say(f"post folder: {pdir.relative_to(REPO)}")


# ---------------------------------------------------------------- regress

def cmd_regress(a):
    """Before touching assets/engine or scripts/sound.py: `regress --before`; after: `regress` (reel1 must not move)."""
    at = (STUDIO / "templates/regress_reel1_at.txt").read_text().strip()
    base = STUDIO / "renders/regress"
    out = base / ("before" if a.before else "after")
    shutil.rmtree(out, ignore_errors=True)
    run([PY, "reel1/build.py"], check=True, capture_output=True)
    r = run(HF + ["snapshot", "reel1", "--at", at, "--no-end", "--describe", "false", "--timeout", "60000", "-o", str(out)],
            capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stdout[-800:] + r.stderr[-800:])
    if a.before:
        say(f"reference saved: {out.relative_to(STUDIO)} ({len(list(out.glob('frame-*.png')))} frames of reel1)")
        return
    if not (base / "before").exists():
        sys.exit("no reference: run `python3 studio.py regress --before` before changing the kit")
    sys.exit(run([PY, "scripts/imgdiff.py", str(base / "before"), str(out)]).returncode)


# ---------------------------------------------------------------- cut

def cmd_cut(a):
    r = run([PY, "scripts/cutvo.py", a.reel, *[str(n) for n in a.lines]])
    if r.returncode:
        sys.exit(r.returncode)


# ---------------------------------------------------------------- cli

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("doctor")
    p = sub.add_parser("new"); p.add_argument("reel"); p.add_argument("slug")
    p = sub.add_parser("voice"); p.add_argument("reel"); p.add_argument("--yes", action="store_true")
    p.add_argument("--takes", type=int, default=3); p.add_argument("--voice", default="Charon")
    p.add_argument("--rate", type=float, default=1.0); p.add_argument("--take", help="reuse an existing take number instead of generating")
    p.add_argument("--voices", help='dialogue reels: "coach=Puck|Fenrir|Zubenelgenubi,setty=Charon" (several = casting)')
    p.add_argument("--pick", help="dialogue reels: the voice combination to install (e.g. Fenrir)")
    p.add_argument("--reuse", action="store_true", help="dialogue reels: reuse the existing takes, generate nothing")
    for name in ("build", "check"):
        p = sub.add_parser(name); p.add_argument("reel")
    p = sub.add_parser("audio"); p.add_argument("reel"); p.add_argument("--no-whisper", action="store_true")
    p = sub.add_parser("snap"); p.add_argument("reel"); p.add_argument("--at"); p.add_argument("--every", type=float, default=1.2)
    p = sub.add_parser("go"); p.add_argument("reel"); p.add_argument("--at"); p.add_argument("--every", type=float, default=1.2)
    p.add_argument("--no-whisper", action="store_true"); p.add_argument("--no-check", action="store_true")
    p = sub.add_parser("render"); p.add_argument("reel"); p.add_argument("--fps", type=int, default=30)
    p.add_argument("--workers", default="2"); p.add_argument("--quality", default="looks"); p.add_argument("--no-whisper", action="store_true")
    p = sub.add_parser("deliver"); p.add_argument("reel"); p.add_argument("file", nargs="?")
    p = sub.add_parser("regress"); p.add_argument("--before", action="store_true")
    p = sub.add_parser("cut"); p.add_argument("reel"); p.add_argument("lines", nargs="+", type=int)
    a = ap.parse_args()
    {"doctor": cmd_doctor, "new": cmd_new, "voice": cmd_voice, "build": cmd_build, "audio": cmd_audio, "snap": cmd_snap,
     "check": cmd_check, "go": cmd_go, "render": cmd_render, "deliver": cmd_deliver, "regress": cmd_regress,
     "cut": cmd_cut}[a.cmd](a)


if __name__ == "__main__":
    main()
