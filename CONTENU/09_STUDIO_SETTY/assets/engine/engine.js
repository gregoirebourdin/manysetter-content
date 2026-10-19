// Setty reel engine: everything a reel shares (stage, Setty, camera, captions, flash, render loop).
// A reel = DATA (written by build.py from the voice timing) + a scene script (reelN/src/scenes.js)
// that acts Setty with K(...) and places props from props.js. See CLAUDE.md § 7.
import * as THREE from "three";
import { createSetty, setupStage, pose, basePose } from "../setty/setty.js";

export const W = 1080, H = 1920;

// Paint order of the props inside each layer, whatever order the scene script mounts them in.
// A new prop gets a slot here (unknown slots go on top of their layer).
export const ORDER = {
  back: ["marquee", "ring", "clock", "bed"],
  front: ["live", "ecg", "rain", "info", "hand", "moon", "tapes", "cable", "mc", "spark", "cardsw", "confetti", "comment", "notif"],
  root: ["caps", "endcta", "flash"],
  cards: ["pb", "thread", "booked", "cal"],
};

// Camera framings (Setty at the origin): hook close-up, centred, high (UI cards under him), end/loop.
export const CAMS = {
  HOOK: { z: 9.2, ly: 1.85, x: 0, lx: 0 },
  MID: { z: 14, ly: 0.25, x: 0, lx: 0 },
  TOP: { z: 19, ly: -1.2, x: 0, lx: 0 },
  END: { z: 14, ly: 1.05, x: 0, lx: 0 },
};

const FACE_SKIP = new Set(["x", "y", "z", "scale", "squash", "turn", "tilt", "lean", "dotsPhase"]);

export async function createReel(DATA, opts = {}) {
  const C = DATA.cues, TOTAL = C.total;
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
  const stage = await setupStage(renderer, scene, { shadowOpacity: opts.shadowOpacity ?? 0.42 });
  const setty = createSetty();
  scene.add(setty.root);
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);

  const face = (name, extra = {}) => {
    const p = pose(name), o = {};
    for (const k in p) if (!FACE_SKIP.has(k)) o[k] = p[k];
    return Object.assign(o, extra);
  };
  // frame 0 is the thumbnail: Setty in close-up, smug
  const P = Object.assign(basePose(), face(opts.face ?? "smug"), opts.pose ?? { turn: 0.15, dotsBounce: 1 });
  const CAM = Object.assign({ z: 9.2, ly: 1.85, x: 0, roll: 0, lx: 0 }, opts.cam);
  const LIGHT = { key: 2.5, rim: 3.0, red: 0 };
  const SHAKES = [];
  const shake = (t, amp = 1, dec = 9) => SHAKES.push({ t, amp, dec });

  const act = gsap.timeline({ paused: true });
  const K = (t, d, vars, ease = "power3.out") => {
    const { cam, light, ...p } = vars;
    // lazy: false — the pose is read right after seek(), so every tween must apply immediately
    if (Object.keys(p).length) act.to(P, { ...p, duration: d, ease, lazy: false }, t);
    if (cam) act.to(CAM, { ...cam, duration: d, ease, lazy: false }, t);
    if (light) act.to(LIGHT, { ...light, duration: d, ease, lazy: false }, t);
  };
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
    camera.position.set(CAM.x + sx, CAM.ly + 0.35 + sy, CAM.z);
    camera.lookAt(CAM.lx + sx, CAM.ly + sy, 0);
    camera.rotateZ(CAM.roll + sr);
    camera.updateMatrixWorld();
    stage.key.intensity = LIGHT.key;
    stage.rim.intensity = LIGHT.rim;
    stage.rim.color.setRGB(1, 0.54 - 0.3 * LIGHT.red, 0.3 - 0.22 * LIGHT.red, THREE.SRGBColorSpace);
    // idle life: a float, a sway, the typing dots
    const bob = Math.sin(t * 2.7) * 0.06;
    setty.apply({ ...P, y: P.y + bob, lean: P.lean + Math.sin(t * 1.9) * 0.02, dotsPhase: t * 10 });
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

  function start() {
    tl.to({}, { duration: TOTAL }, 0);
    window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
    renderAt(window.__hfThreeTime || 0);
    return tl;
  }

  return {
    W, H, C, TOTAL, DATA, root, $, ico, rnd, mount, THREE, renderer, scene, stage, setty, camera,
    P, CAM, LIGHT, face, pose, basePose, K, shake, beat, act, CAMS, tl, flash, bg, captions, toScreen,
    onFrame: (fn) => FRAME.push(fn), start,
  };
}
