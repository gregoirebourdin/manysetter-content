// Setty reel engine: everything a reel shares (stage, Setty, camera, captions, flash, render loop).
// A reel = DATA (written by build.py from the voice timing) + a scene script (reelN/src/scenes.js)
// that acts Setty with K(...) and places props from props.js. See CLAUDE.md § 7.
import * as THREE from "three";
import { createSetty, setupStage, pose, basePose } from "../setty/setty.js";
import { createCoach, pose as coachPose, basePose as coachBase } from "../coach/coach.js";
import { shot as frameShot } from "../sets/kit.js";

export const W = 1080, H = 1920;

// Paint order of the props inside each layer, whatever order the scene script mounts them in.
// A new prop gets a slot here (unknown slots go on top of their layer).
export const ORDER = {
  back: ["marquee", "ring", "clock", "bed", "stage"],
  front: ["live", "ecg", "rain", "info", "hand", "moon", "tapes", "cable", "mc", "spark", "cardsw", "confetti", "chat", "toast", "comment", "notif"],
  root: ["caps", "endcta", "title", "flash"],
  cards: ["pb", "thread", "booked", "cal"],
};

// Camera framings (Setty at the origin): hook close-up, centred, high (UI cards under him), end/loop.
export const CAMS = {
  HOOK: { z: 9.2, ly: 1.85, x: 0, lx: 0 },
  MID: { z: 14, ly: 0.25, x: 0, lx: 0 },
  TOP: { z: 19, ly: -1.2, x: 0, lx: 0 },
  END: { z: 14, ly: 1.05, x: 0, lx: 0 },
  STAGE: { z: 33, ly: 6.9, x: 0, lx: 0 }, // layout "stage": Setty small at the bottom (dots ≈ y 1320, body to ≈ 1650)
};
// where Setty stands in the stage layout (pose x): bottom left, centre, right (clear of the IG buttons)
export const SPOT = { L: -2.0, C: 0, R: 2.0 };

const FACE_SKIP = new Set(["x", "y", "z", "scale", "squash", "turn", "tilt", "lean", "dotsPhase"]);

export async function createReel(DATA, opts = {}) {
  // a cue missing from cues.json (a typo, a cue swallowed by a "#" in build.py) used to drop its card at the end of the
  // reel without a word (reel21, 21/10): each missing cue is now a console error, shown by `studio.py check`
  const MISSING = new Set(), QUIET = new Set(["then", "toJSON", "constructor", "valueOf", "toString"]);
  const C = new Proxy(DATA.cues, { get(o, k) {
    if (typeof k === "string" && !(k in o) && !QUIET.has(k) && !MISSING.has(k)) {
      MISSING.add(k);
      console.error(`missing cue C.${k}: it is not in cues.json (build.py)`);
    }
    return o[k];
  } }), TOTAL = DATA.cues.total;
  const root = document.getElementById("root");
  const $ = (s) => document.querySelector(s);
  const LUCIDE = DATA.icons;
  const ico = (name, cls = "ms-ico") => {
    if (!LUCIDE[name]) throw new Error(`icon "${name}" missing from DATA.icons (assets/ui/lucide.json)`);
    return `<svg class="${cls}" viewBox="0 0 24 24">${LUCIDE[name]}</svg>`;
  };

  // mount a prop's HTML in its slot (see ORDER); returns the root element. Lucide icons in [data-ico] are inlined.
  function mount(layer, slot, html, parent) {
    const box = parent || (layer === "root" ? root : document.getElementById(layer));
    const order = ORDER[layer] || [];
    const rank = order.indexOf(slot);
    const tmp = document.createElement("div");
    tmp.innerHTML = html.trim();
    const node = tmp.firstElementChild;
    node.dataset.slot = slot;
    let before = null;
    if (rank >= 0) {
      for (const c of box.children) {
        if (order.indexOf(c.dataset.slot) > rank) { before = c; break; }
      }
    }
    box.insertBefore(node, before);
    const icoEls = [...(node.matches("[data-ico]") ? [node] : []), ...node.querySelectorAll("[data-ico]")];
    icoEls.forEach((el) => el.insertAdjacentHTML("afterbegin", ico(el.dataset.ico)));
    return node;
  }

  // the kit's two faces, loaded before anything is measured (rain bubbles, thread scroll)
  await Promise.all([document.fonts.load('600 100px "Nohemi"'), document.fonts.load('400 40px "Inter"')]);
  await document.fonts.ready;

  // deterministic randomness (shared stream: captions, then props in call order)
  let seed = opts.seed ?? 1337;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);

  // ================= THREE: Setty =================
  const renderer = new THREE.WebGLRenderer({ canvas: $("#three"), alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(W, H, false);
  renderer.setPixelRatio(1);
  const scene = new THREE.Scene();
  // layout "set" (19/10): a styled 3D set (assets/sets/<name>.js) fills the frame, the coach and Setty talk in it
  const SETL = DATA.layout === "set";
  const set = SETL ? await (await import(`../sets/${DATA.set || "bedroom"}.js`)).build({ renderer, scene, mood: DATA.mood }) : null;
  const stage = SETL ? { key: set.key, rim: set.rim } : await setupStage(renderer, scene, { shadowOpacity: opts.shadowOpacity ?? 0.42 });
  const setty = createSetty();
  scene.add(setty.root);
  const coach = SETL ? createCoach() : null;
  if (coach) scene.add(coach.root);
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);

  const face = (name, extra = {}) => {
    const p = pose(name), o = {};
    for (const k in p) if (!FACE_SKIP.has(k)) o[k] = p[k];
    return Object.assign(o, extra);
  };
  // frame 0 is the thumbnail: Setty in close-up, smug
  const P = SETL ? Object.assign(basePose(), face(opts.face ?? "smug"), { dotsBounce: 1 }, set.setty, opts.pose)
    : Object.assign(basePose(), face(opts.face ?? "smug"), opts.pose ?? { turn: 0.15, dotsBounce: 1 });
  // the coach's pose (layout "set"): his spot in the set, then his acting (KC, faceC)
  const Q = SETL ? Object.assign(coachBase(), set.coach, opts.coachPose) : null;
  const camOf = (name, o = {}) => {
    const f = set.frames?.[name];
    const s = f ? frameShot(f.target, { ...f, ...o }) : set.shots[name];
    return { px: s.pos[0], py: s.pos[1], pz: s.pos[2], ax: s.at[0], ay: s.at[1], az: s.at[2], fov: s.fov };
  };
  if (SETL) {
    // aim the close-ups at the real heads (posed and seated), not at estimates: the face sits above the captions
    setty.apply(P);
    coach.apply(Q);
    scene.updateMatrixWorld(true);
    const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
    set.frames.coach.target = coach.head.getWorldPosition(v3()).add(v3(0, 0.18, 0)); // head + beanie
    set.frames.setty.target = v3(P.x, P.y + 1.7 * (P.scale ?? 1) + 0.04, P.z);
    const [a1, a2] = coach.ankles.map((a) => a.getWorldPosition(v3()));
    set.frames.shoes = { target: a1.add(a2).multiplyScalar(0.5).add(v3(0, 0.02, 0.12)), dist: 5.2, yaw: 0.45, pitch: 0.32, y: 900 };
  }
  const CAM = SETL ? Object.assign({ roll: 0 }, camOf("wide"), opts.cam)
    : Object.assign({ z: 9.2, ly: 1.85, x: 0, roll: 0, lx: 0 }, DATA.layout === "stage" ? CAMS.STAGE : {}, opts.cam);
  if (DATA.layout) root.classList.add(`layout-${DATA.layout}`);
  // stage layout: the modules live in a box the "stage camera" can zoom (the title and the captions never zoom)
  const ZO = { x: 540, y: 840 }; // zoom origin: the centre of the stage
  if (DATA.layout === "stage" || SETL) {
    const clip = document.createElement("div"); // fades the zoomed stage out under the hook title
    clip.id = "stageclip";
    clip.className = "layer";
    clip.dataset.slot = "stage";
    const sb = document.createElement("div");
    sb.id = "stagebox";
    sb.className = "layer";
    clip.appendChild(sb);
    document.getElementById(SETL ? "front" : "back").appendChild(clip); // over the 3D set: the cards pop over the scene
    gsap.set(sb, { transformOrigin: `${ZO.x}px ${ZO.y}px` });
  }
  const LIGHT = SETL ? { key: set.key.intensity, rim: set.rim.intensity, red: 0 } : { key: 2.5, rim: 3.0, red: 0 };
  const SHAKES = [];
  const shake = (t, amp = 1, dec = 9) => SHAKES.push({ t, amp, dec });

  const act = gsap.timeline({ paused: true });
  // camera track (reel.json "cam_track": true, 20/10): each camera move takes over from the one before it, which stops
  // where it was. Without it, overlapping "to" tweens fight in a frame-by-frame render: when the newer move ends, the
  // older one takes the camera back (the hook jumped back at ~0.85 s, a cutaway inside a line lasted 3 frames).
  const CAMQ = DATA.cam_track ? [] : null;
  const K = (t, d, vars, ease = "power3.out") => {
    const { cam, light, ...p } = vars;
    // lazy: false — the pose is read right after seek(), so every tween must apply immediately
    if (Object.keys(p).length) act.to(P, { ...p, duration: d, ease, lazy: false }, t);
    if (cam && CAMQ) CAMQ.push({ t, d, cam, ease, i: CAMQ.length });
    else if (cam) act.to(CAM, { ...cam, duration: d, ease, lazy: false }, t);
    if (light) act.to(LIGHT, { ...light, duration: d, ease, lazy: false }, t);
  };
  // the coach (layout "set"): KC tweens his pose like K does Setty's; faceC = an expression without his placement
  const KC = (t, d, vars, ease = "power3.out") => { if (Q) act.to(Q, { ...vars, duration: d, ease, lazy: false }, t); };
  const COACH_SKIP = new Set(["x", "y", "z", "turn", "scale", "squash", "sit", "spread", "talk"]);
  const faceC = (name, extra = {}) => {
    const p = coachPose(name), o = {};
    for (const k in p) if (!COACH_SKIP.has(k)) o[k] = p[k];
    return Object.assign(o, extra);
  };
  // the camera goes to whoever talks (shot / reverse shot): a fast push to his close-up; o = { x, y, dist, yaw } framing
  const shotTo = (t, name, { dur = 0.3, ease = "power3.inOut", ...o } = {}) => K(t, dur, { cam: camOf(name, o) }, ease);

  // acting shortcuts for new reels (reel1 writes them out by hand)
  const beat = {
    // a slam on a word: squash, elastic back, camera shake
    slam: (t, { squash = -0.12, amp = 1.2, extra = {} } = {}) => {
      K(t - 0.02, 0.08, { squash, ...extra }, "power2.out");
      K(t + 0.08, 0.5, { squash: 0 }, "elastic.out(1, 0.35)");
      shake(t, amp);
    },
    // a swear: censor bar on the mouth for the word, a little squash and shake
    bleep: (t, end, { squash = 0.06, amp = 0.6, zoom } = {}) => {
      K(t - 0.04, 0.12, { censor: 1, squash, ...(zoom ? { cam: { z: zoom } } : {}) }, "back.out(3)");
      shake(t, amp);
      K(end + 0.05, 0.1, { censor: 0, squash: 0 });
    },
    // a hop to another spot (stage layout): x travels, y arcs up and lands with a squash
    hop: (t, x, { dur = 0.42, h = 1.1, turn = 0.25 } = {}) => {
      K(t, dur, { x }, "power1.inOut");
      K(t, dur * 0.5, { y: h, squash: -0.06, turn: Math.sign(x) * turn }, "power2.out");
      K(t + dur * 0.5, dur * 0.5, { y: 0, turn: 0 }, "power2.in");
      K(t + dur, 0.08, { squash: 0.12 }, "power2.out");
      K(t + dur + 0.08, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");
    },
    // a hard pose change with a squash pop
    pop: (t, faceName, extra = {}, { squash = -0.1 } = {}) => {
      K(t, 0.18, { ...face(faceName, extra), squash }, "back.out(2.6)");
      K(t + 0.18, 0.45, { squash: 0 }, "elastic.out(1, 0.4)");
    },
  };

  // ================= DOM timeline =================
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });
  const flash = (at, o = 0.85, d = 0.16) =>
    tl.fromTo("#flash", { opacity: o }, { opacity: 0, duration: d, ease: "power2.out", immediateRender: false }, at);
  // backgrounds of the stage: warm (default), hot, night, black; glow and spot
  const bg = (name, opacity, at, dur = 0.2) => tl.to(name.startsWith("#") ? name : `#bg-${name}`, { opacity, duration: dur }, at);
  // the stage camera: zoom toward a point of the screen ([x, y] in px stays in place), back out, slow drift. Seek-safe.
  const zoom = (at, { to = [ZO.x, ZO.y], s = 1.2, dur = 0.22, ease = "power3.out" } = {}) =>
    tl.to("#stagebox", { scale: s, x: -(s - 1) * (to[0] - ZO.x), y: -(s - 1) * (to[1] - ZO.y), duration: dur, ease }, at);
  const unzoom = (at, dur = 0.24, ease = "power3.inOut") => tl.to("#stagebox", { scale: 1, x: 0, y: 0, duration: dur, ease }, at);
  const drift = (at, { to, s = 1.08, dur = 1.6 } = {}) => zoom(at, { to, s, dur, ease: "sine.inOut" });

  // captions: words pop on their own cue (every spoken word on screen)
  const COUNTS = [];
  function captions() {
    const caps = $("#caps");
    for (const ch of DATA.chunks) {
      if (ch.hide) continue;
      const el = document.createElement("div");
      el.className = "chunk" + (ch.hero ? " hero" : "");
      el.innerHTML = ch.tokens.map((k) => `<span class="tok${k.accent ? " accent" : ""}${k.bleep ? " bleep" : ""}${k.count ? " count" : ""}">${k.text}</span>`).join("");
      caps.appendChild(el);
      const toks = el.querySelectorAll(".tok");
      tl.set(el, { visibility: "visible" }, ch.start - 0.02);
      ch.tokens.forEach((k, j) => {
        const r = (rnd() - 0.5) * 8;
        tl.fromTo(toks[j], { opacity: 0, scale: 0.35, y: 60, rotation: r },
          { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 0.24, ease: "back.out(3)" }, k.t - 0.03);
        if (k.count) COUNTS.push({ el: toks[j], t: k.t, until: k.countUntil, to: k.countTo });
      });
      const out = Math.min(ch.end, ch.next - 0.02);
      tl.to(el, { opacity: 0, scale: 0.9, duration: 0.08, ease: "power2.in" }, out - 0.08);
      tl.set(el, { visibility: "hidden" }, out);
    }
  }
  if (opts.captions !== false) captions();

  // ================= per-frame render (three + anchors + props' frame hooks) =================
  const v = new THREE.Vector3();
  const toScreen = (x, y, z) => {
    v.set(x, y, z).project(camera);
    return [(v.x * 0.5 + 0.5) * W, (-v.y * 0.5 + 0.5) * H];
  };
  const FRAME = [];
  // lip-sync (DATA.lips, from the voice envelope, per speaker) and automatic blinks (every 2.4–4.6 s, seeded per character)
  const lip = (who, t) => {
    const L = DATA.lips?.[who];
    if (!L) return 0;
    const f = t * DATA.lips.fps, i = Math.floor(f);
    const a = +(L[i] || 0) / 9, b = +(L[i + 1] || 0) / 9;
    return a + (b - a) * (f - i);
  };
  const BLINKS = {};
  const blink = (t, seed) => {
    if (!BLINKS[seed]) {
      let s = seed * 9301 + 49297, tt = 0.8 + (seed % 1) * 2;
      const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
      BLINKS[seed] = [];
      while (tt < TOTAL + 5) { BLINKS[seed].push(tt); tt += 2.4 + r() * 2.2; }
    }
    for (const b of BLINKS[seed]) {
      const d = t - b;
      if (d >= 0 && d < 0.16) return d < 0.06 ? d / 0.06 : 1 - (d - 0.06) / 0.1;
    }
    return 0;
  };
  function renderAt(t) {
    act.seek(t, false);
    // camera + shakes
    let sx = 0, sy = 0, sr = 0;
    for (const s of SHAKES) {
      if (t < s.t) continue;
      const k = s.amp * Math.exp(-(t - s.t) * s.dec);
      sx += Math.sin((t - s.t) * 63) * 0.09 * k;
      sy += Math.cos((t - s.t) * 57) * 0.07 * k;
      sr += Math.sin((t - s.t) * 41) * 0.025 * k;
    }
    if (SETL) {
      camera.position.set(CAM.px + sx, CAM.py + sy, CAM.pz);
      camera.lookAt(CAM.ax + sx * 0.5, CAM.ay + sy * 0.5, CAM.az);
      camera.fov = CAM.fov;
      camera.updateProjectionMatrix();
    } else {
      camera.position.set(CAM.x + sx, CAM.ly + 0.35 + sy, CAM.z);
      camera.lookAt(CAM.lx + sx, CAM.ly + sy, 0);
    }
    camera.rotateZ(CAM.roll + sr);
    camera.updateMatrixWorld();
    stage.key.intensity = LIGHT.key;
    stage.rim.intensity = LIGHT.rim;
    if (!SETL) stage.rim.color.setRGB(1, 0.54 - 0.3 * LIGHT.red, 0.3 - 0.22 * LIGHT.red, THREE.SRGBColorSpace);
    // idle life: a float, a sway, the typing dots (in a set: a smaller float, blinks, the mouth follows the voice)
    const bob = Math.sin(t * 2.7) * (SETL ? 0.025 : 0.06);
    if (SETL) {
      const ls = lip("setty", t), lc = lip("coach", t), bs = blink(t, 1.3), bc = blink(t, 2.1);
      setty.apply({ ...P, y: P.y + bob, lean: P.lean + Math.sin(t * 1.9) * 0.015, dotsPhase: t * 10,
        mouthOpen: Math.min(1, P.mouthOpen + ls * 0.55), squash: P.squash + ls * 0.025,
        lidL: P.happyL > 0.5 ? P.lidL : Math.max(P.lidL, bs), lidR: P.happyR > 0.5 ? P.lidR : Math.max(P.lidR, bs) });
      coach.apply({ ...Q, talk: Math.max(Q.talk, lc), nod: Q.nod + lc * 0.05 + Math.sin(t * 1.3) * 0.012,
        headTilt: Q.headTilt + Math.sin(t * 0.9) * 0.015, bend: Q.bend + Math.sin(t * 1.7) * 0.008,
        lidL: Q.happyL > 0.5 ? Q.lidL : Math.max(Q.lidL, bc), lidR: Q.happyR > 0.5 ? Q.lidR : Math.max(Q.lidR, bc) });
    } else {
      setty.apply({ ...P, y: P.y + bob, lean: P.lean + Math.sin(t * 1.9) * 0.02, dotsPhase: t * 10 });
    }
    renderer.render(scene, camera);

    // anchors for the DOM props that follow Setty (ring light): --sx/--sy centre, --su one body unit in px
    const [cx, cy] = toScreen(P.x, P.y + bob + 1.7, 0);
    const [ux] = toScreen(P.x + 1, P.y + bob + 1.7, 0);
    root.style.setProperty("--sx", cx.toFixed(1));
    root.style.setProperty("--sy", cy.toFixed(1));
    root.style.setProperty("--su", (ux - cx).toFixed(2));
    for (const fn of FRAME) fn(t, { bob });
    // number counters in the captions (e.g. 0 → 400)
    for (const c of COUNTS) {
      const k = Math.min(1, Math.max(0, (t - c.t) / (c.until + 0.2 - c.t)));
      c.el.textContent = String(Math.round(c.to * (1 - Math.pow(1 - k, 3))));
    }
  }

  /** the camera track, per property: the move that started last owns the camera; an earlier move is cut where it was,
   *  with its own ease kept (explicit from/to values: right in sequential renders and in jumping snapshots alike) */
  function camTrack() {
    const props = new Set(CAMQ.flatMap((q) => Object.keys(q.cam)));
    for (const k of props) {
      const qs = CAMQ.filter((q) => q.cam[k] != null).sort((a, b) => a.t - b.t || a.i - b.i);
      let v = CAM[k];
      qs.forEach((q, j) => {
        const span = Math.min(q.d, (j + 1 < qs.length ? qs[j + 1].t : Infinity) - q.t);
        if (span <= 1e-4) return; // replaced by a move that starts at the same time
        const ez = gsap.parseEase(q.ease) || ((x) => x), c = span / q.d, ec = ez(c);
        const to = v + (q.cam[k] - v) * ec;
        act.fromTo(CAM, { [k]: v }, { [k]: to, duration: span, ease: (x) => (ec ? ez(x * c) / ec : x), lazy: false, immediateRender: false }, q.t);
        v = to;
      });
    }
  }

  function start() {
    if (CAMQ) camTrack();
    tl.to({}, { duration: TOTAL }, 0);
    window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
    renderAt(window.__hfThreeTime || 0);
    return tl;
  }

  return {
    W, H, C, TOTAL, DATA, root, $, ico, rnd, mount, THREE, renderer, scene, stage, setty, camera,
    P, CAM, LIGHT, face, pose, basePose, K, shake, beat, act, CAMS, SPOT, tl, flash, bg, zoom, unzoom, drift, captions, toScreen,
    set, coach, Q, KC, faceC, shotTo, camOf, lip,
    place: (vars) => { const { cam, ...p } = vars; Object.assign(P, p); if (cam) Object.assign(CAM, cam); }, // frame 0, before any K
    onFrame: (fn) => FRAME.push(fn), start,
  };
}
