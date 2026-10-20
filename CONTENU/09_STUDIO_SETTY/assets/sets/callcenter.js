// Set "callcenter": a setting agency's open space at dusk (reel16, the $600 setter). Rows of empty workstations with
// low fabric partitions, sleeping monitors and headsets left on the desks, a drop ceiling with light strips, an LED
// board (calls waiting, longest wait, agents available 0), a wall clock past seven, a water cooler, and a glass curtain
// wall on the city at dusk. Everybody went home. The coach sits in his setter's task chair, swiveled toward Setty, phone
// in hand; behind him, the setter's desk (headset, mug, a sticky note on the locked monitor). Setty perches on the end
// panel of the front row. Its new pieces (workstation, task chair, headset, LED board, clock, water cooler) live here.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -11; // the glass wall
const CEIL = 10; // the drop ceiling
const SANS = "'Helvetica Neue', Arial, sans-serif"; // system fonts: the set is built before the web fonts load
const MONO = "Menlo, 'Courier New', monospace";

// ---------------- textures ----------------
/** carpet tiles, the pile direction alternating tile to tile */
function carpetTex({ base = "#2a313e", seed = 61 } = {}) {
  const R = K.rng(seed);
  return K.canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = base;
    c.fillRect(0, 0, W, H);
    const n = 2, s = W / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      c.fillStyle = (i + j) % 2 ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.03)";
      c.fillRect(i * s, j * s, s, s);
      c.strokeStyle = "rgba(255,255,255,0.025)";
      c.lineWidth = 1;
      for (let k = 0; k < 40; k++) {
        c.beginPath();
        if ((i + j) % 2) { c.moveTo(i * s, j * s + (k + 0.5) * (s / 40)); c.lineTo(i * s + s, j * s + (k + 0.5) * (s / 40)); }
        else { c.moveTo(i * s + (k + 0.5) * (s / 40), j * s); c.lineTo(i * s + (k + 0.5) * (s / 40), j * s + s); }
        c.stroke();
      }
    }
    for (let k = 0; k < 14000; k++) {
      c.fillStyle = R() < 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)";
      c.fillRect(R() * W, R() * H, 1.4, 1.4);
    }
    c.strokeStyle = "rgba(0,0,0,0.16)";
    c.lineWidth = 2;
    for (let i = 0; i <= n; i++) {
      c.beginPath(); c.moveTo(i * s, 0); c.lineTo(i * s, H); c.stroke();
      c.beginPath(); c.moveTo(0, i * s); c.lineTo(W, i * s); c.stroke();
    }
  });
}

/** acoustic ceiling tiles in a thin grid */
function ceilingTex({ seed = 63 } = {}) {
  const R = K.rng(seed);
  return K.canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = "#c9cbd0";
    c.fillRect(0, 0, W, H);
    for (let k = 0; k < 9000; k++) {
      c.fillStyle = R() < 0.6 ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.08)";
      c.fillRect(R() * W, R() * H, 1.6, 1.6);
    }
    c.strokeStyle = "#8d9097";
    c.lineWidth = 5;
    c.strokeRect(0, 0, W, H);
  }, { repeat: [1, 1] });
}

/** the city at dusk from a high floor: violet sky, the afterglow low on the left (never orange behind Setty, who sits on
 *  the right), towers with lit windows, the lower city sparkling under the horizon, car lights on an avenue. Sizes are
 *  relative to the canvas (glassWall paints it at 4096 px wide). */
function duskView(c, W, H, R) {
  const hz = H * 0.62; // the horizon, at eye level
  const sky = c.createLinearGradient(0, 0, 0, hz);
  sky.addColorStop(0, "#10143a");
  sky.addColorStop(0.45, "#2c2a68");
  sky.addColorStop(0.8, "#6a3f88");
  sky.addColorStop(1, "#b05a86");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, hz);
  const glowL = c.createRadialGradient(W * 0.08, hz, 0, W * 0.08, hz, W * 0.42);
  glowL.addColorStop(0, "rgba(255,172,112,0.95)");
  glowL.addColorStop(0.4, "rgba(238,118,112,0.5)");
  glowL.addColorStop(1, "rgba(238,118,112,0)");
  c.fillStyle = glowL;
  c.fillRect(0, 0, W, hz);
  const cool = c.createLinearGradient(0, 0, W, 0); // the right side stays cool
  cool.addColorStop(0.4, "rgba(36,40,112,0)");
  cool.addColorStop(1, "rgba(36,40,112,0.62)");
  c.fillStyle = cool;
  c.fillRect(0, 0, W, hz);
  const u = W / 4096; // one canvas pixel at 4096 px
  c.fillStyle = "rgba(255,255,255,0.85)";
  for (let i = 0; i < 160; i++) c.fillRect(R() * W, R() * hz * 0.45, 3 * u, 3 * u);
  c.fillStyle = "#f4ecff"; // a thin crescent
  c.beginPath(); c.arc(W * 0.86, H * 0.13, 30 * u, 0, Math.PI * 2); c.fill();
  c.fillStyle = "#151a46";
  c.beginPath(); c.arc(W * 0.86 + 11 * u, H * 0.13 - 7 * u, 28 * u, 0, Math.PI * 2); c.fill();
  // the lower city, under the horizon
  const low = c.createLinearGradient(0, hz, 0, H);
  low.addColorStop(0, "#2a2350");
  low.addColorStop(1, "#0e1022");
  c.fillStyle = low;
  c.fillRect(0, hz, W, H - hz);
  for (let i = 0; i < 9000; i++) {
    const y = hz + Math.pow(R(), 0.75) * (H - hz);
    c.fillStyle = R() < 0.72 ? `rgba(255,${190 + R() * 50},${110 + R() * 60},${0.3 + R() * 0.6})` : `rgba(160,210,255,${0.3 + R() * 0.5})`;
    c.fillRect(R() * W, y, (3 + R() * 3) * u, 3 * u);
  }
  const tower = (x, w, h, col, lit, step = 15) => {
    c.fillStyle = col;
    c.fillRect(x, hz - h, w, h + 8 * u);
    for (let yy = hz - h + 14 * u; yy < hz - 6 * u; yy += step * 1.25 * u) for (let xx = x + 8 * u; xx < x + w - 10 * u; xx += step * u) {
      if (R() < lit) {
        c.fillStyle = R() < 0.78 ? `rgba(255,${200 + R() * 40},${120 + R() * 50},${0.45 + R() * 0.55})` : "rgba(170,215,255,0.7)";
        c.fillRect(xx, yy, 6 * u, 8 * u);
      }
    }
  };
  for (let i = 0; i < 46; i++) tower(R() * W, W * (0.012 + R() * 0.02), H * (0.05 + R() * 0.14), "#29244f", 0.22, 13); // far
  for (let i = 0; i < 30; i++) tower(R() * W, W * (0.018 + R() * 0.03), H * (0.1 + R() * 0.26), "#191a3a", 0.42); // near
  const tall = [[0.27, 0.026, 0.5], [0.47, 0.03, 0.36], [0.69, 0.034, 0.44], [0.9, 0.024, 0.3]];
  for (const [x, w, h] of tall) {
    tower(W * x, W * w, H * h, "#13142e", 0.5);
    c.fillStyle = "#ff3b3b"; // aviation light
    c.fillRect(W * (x + w / 2) - 3 * u, hz - H * h - 9 * u, 6 * u, 6 * u);
  }
  for (let i = 0; i < 700; i++) { // the avenue: white lights one way, red the other
    const x = (i / 700) * W, y = H * 0.87 + Math.sin(i * 0.05) * 6 * u;
    c.fillStyle = i % 2 ? "rgba(255,245,225,0.9)" : "rgba(255,70,60,0.85)";
    c.fillRect(x, y + (i % 2 ? 0 : 12 * u), 5 * u, 3 * u);
  }
}

/** the glass curtain wall: the dusk view at high resolution, mullions and two transoms */
function glassWall({ w = 30, h = 9.1, cols = 10, seed = 41 } = {}) {
  const g = new THREE.Group(), R = K.rng(seed);
  const tex = K.canvasTex(4096, Math.round((4096 * h) / w), (c, W, H) => duskView(c, W, H, R));
  const v = new THREE.Mesh(new THREE.PlaneGeometry(w, h), K.glow(0xffffff, { map: tex }));
  const fm = K.mat(0x1b1d24, { roughness: 0.4, metalness: 0.4 });
  const bars = [[0, h / 2, w + 0.2, 0.16], [0, -h / 2, w + 0.2, 0.2], [0, -h / 2 + 1.1, w, 0.07], [0, h / 2 - 1.6, w, 0.07]];
  for (let i = 0; i <= cols; i++) bars.push([-w / 2 + (i * w) / cols, 0, 0.1, h]);
  for (const [x, y, bw, bh] of bars) {
    const b = K.box(bw, bh, 0.14, 0.01, fm);
    b.position.set(x, y, 0.05);
    g.add(b);
  }
  g.add(v);
  return g;
}

/** a monitor screen: "sleep" (dark navy), "away" (a dim screensaver) or the setter's lock screen */
function screenTex(kind) {
  return K.canvasTex(512, 312, (c, W, H) => {
    if (kind === "lock") {
      const g = c.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#1f2a5e");
      g.addColorStop(1, "#4a2c6e");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      c.fillStyle = "#ffffff";
      c.textAlign = "center";
      c.font = `200 112px ${SANS}`;
      c.fillText("7:12", W / 2, H * 0.52);
      c.font = `500 26px ${SANS}`;
      c.fillStyle = "rgba(255,255,255,0.8)";
      c.fillText("PM", W / 2 + 128, H * 0.52 - 64);
      c.fillText("Locked", W / 2, H * 0.75);
      return;
    }
    const g = c.createRadialGradient(W * 0.5, H * 0.45, 10, W * 0.5, H * 0.5, W * 0.7);
    g.addColorStop(0, kind === "away" ? "#1d2a52" : "#121a33");
    g.addColorStop(1, "#070a14");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    if (kind === "away") {
      c.fillStyle = "rgba(120,170,255,0.35)";
      c.beginPath(); c.arc(W * 0.66, H * 0.38, 22, 0, Math.PI * 2); c.fill();
      c.fillStyle = "rgba(255,255,255,0.35)";
      c.font = `500 22px ${SANS}`;
      c.fillText("Away", W * 0.66 - 24, H * 0.62);
    }
  });
}

/** the LED board: calls waiting, longest wait, agents available (amber dots on black) */
function boardTex() {
  return K.canvasTex(1024, 384, (c, W, H) => {
    c.fillStyle = "#07080b";
    c.fillRect(0, 0, W, H);
    const rows = [["CALLS WAITING", "47", "#ffb23a"], ["LONGEST WAIT", "3:03:12", "#ff5a4a"], ["AGENTS AVAILABLE", "0", "#ffb23a"]];
    c.font = `700 62px ${MONO}`;
    c.textBaseline = "middle";
    rows.forEach(([k, v, col], i) => {
      const y = 70 + i * 120;
      c.fillStyle = col;
      c.textAlign = "left";
      c.fillText(k, 40, y);
      c.textAlign = "right";
      c.fillText(v, W - 40, y);
    });
    c.fillStyle = "#07080b"; // the dot matrix: a black grid over the letters
    for (let x = 0; x < W; x += 6) c.fillRect(x, 0, 2, H);
    for (let y = 0; y < H; y += 6) c.fillRect(0, y, W, 2);
  });
}

// ---------------- furniture ----------------
const LAMINATE = K.mat(0xd8d5ce, { roughness: 0.45, clearcoat: 0.25 });
const FABRIC = K.mat(0xffffff, { map: K.noiseTex("#47546c", 14, 71), roughness: 0.95 });
const RAIL = K.mat(0xb9bec6, { metalness: 0.75, roughness: 0.3 });
const DARK = K.mat(0x22252b, { roughness: 0.45 });
const METAL = K.mat(0x2a2c31, { metalness: 0.7, roughness: 0.3 });

/** a mesh task chair, facing +z (its back toward -z), seat top at `seat` (same as gamingChair: the coach sits at y -0.46) */
function taskChair({ seat = 0.5, color = 0x24272e } = {}) {
  const g = new THREE.Group();
  const fab = K.mat(color, { roughness: 0.8 });
  const mesh = K.mat(0x1a1c21, { roughness: 0.7, clearcoat: 0.2 });
  const cushion = K.soft(1.08, 0.22, 1.02, fab, { P: 3.4, puff: 0.12, seed: 8 });
  cushion.position.y = seat - 0.11;
  const back = K.soft(1.02, 1.5, 0.16, mesh, { P: 3.8, puff: 0.06, seed: 9 });
  back.position.set(0, seat + 1.0, -0.52);
  back.rotation.x = -0.1;
  const frame = K.box(0.08, 1.15, 0.08, 0.03, METAL); // the spine that holds the back
  frame.position.set(0, seat + 0.35, -0.6);
  frame.rotation.x = -0.1;
  const post = K.cyl(0.055, 0.055, seat - 0.2, METAL);
  post.position.y = (seat - 0.2) / 2 + 0.1;
  g.add(cushion, back, frame, post);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = K.box(0.58, 0.06, 0.1, 0.03, METAL);
    leg.position.set(Math.sin(a) * 0.29, 0.12, Math.cos(a) * 0.29);
    leg.rotation.y = a + Math.PI / 2;
    const wheel = K.ball(0.06, K.mat(0x111113, { roughness: 0.5 }), 14);
    wheel.position.set(Math.sin(a) * 0.58, 0.06, Math.cos(a) * 0.58);
    g.add(leg, wheel);
  }
  for (const sx of [-1, 1]) {
    const pad = K.box(0.12, 0.07, 0.5, 0.03, DARK);
    pad.position.set(sx * 0.6, seat + 0.42, -0.08);
    const strut = K.box(0.06, 0.42, 0.06, 0.02, METAL);
    strut.position.set(sx * 0.6, seat + 0.2, -0.14);
    g.add(pad, strut);
  }
  return g;
}

/** a call center headset lying on the desk: the band, two cups, the boom mic */
function headset({ color = 0x1c1d22, ring = 0x4f8cff } = {}) {
  const g = new THREE.Group();
  const m = K.mat(color, { roughness: 0.4, clearcoat: 0.4 });
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.022, 10, 30, Math.PI), m);
  band.castShadow = true;
  g.add(band);
  for (const sx of [-1, 1]) {
    const cup = K.cyl(0.085, 0.085, 0.06, m, 24);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(sx * 0.2, -0.02, 0);
    const pad = K.cyl(0.07, 0.07, 0.02, K.glow(ring), 24);
    pad.rotation.z = Math.PI / 2;
    pad.position.set(sx * 0.17, -0.02, 0);
    g.add(cup, pad);
  }
  const boom = K.cyl(0.01, 0.01, 0.3, m, 8);
  boom.rotation.x = Math.PI / 2 - 0.25;
  boom.position.set(-0.25, -0.06, 0.15);
  const mic = K.ball(0.025, m, 12);
  mic.position.set(-0.25, -0.1, 0.3);
  g.add(boom, mic);
  g.rotation.x = -Math.PI / 2 + 0.18; // lying on its side
  const holder = new THREE.Group();
  g.position.y = 0.09;
  holder.add(g);
  return holder;
}

/** a slim agent monitor (lower than kit.monitor, so it stays under the partition) */
function agentMonitor(screen, { w = 1.32, h = 0.8 } = {}) {
  const g = new THREE.Group();
  const black = K.mat(0x101012, { roughness: 0.35, clearcoat: 0.6 });
  const frame = K.box(w, h, 0.06, 0.025, black);
  frame.position.y = 0.42 + h / 2;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, h - 0.06), K.glow(0xffffff, { map: screen }));
  scr.position.set(0, 0.42 + h / 2, 0.032);
  const neck = K.box(0.1, 0.45, 0.05, 0.02, METAL);
  neck.position.set(0, 0.24, -0.05);
  const foot = K.box(0.46, 0.03, 0.3, 0.012, METAL);
  foot.position.y = 0.015;
  g.add(frame, scr, neck, foot);
  g.userData.top = 0.42 + h;
  return g;
}

/** one workstation, the agent facing -z (the screen faces +z, toward the camera): desk, partition behind, a side panel
 *  on the left (and on the right with `right`), monitor, keyboard, headset, mug, the chair pushed in */
function workstation({ screen, chair = true, set = true, right = false, mugColor = 0xf2eee8, seed = 1 } = {}) {
  const R = K.rng(seed), g = new THREE.Group(), H = 1.35, W = 2.5, D = 1.3;
  const top = K.box(W, 0.08, D, 0.02, LAMINATE);
  top.position.y = H - 0.04;
  const part = K.box(W + 0.1, 2.75, 0.1, 0.03, FABRIC);
  part.position.set(0, 1.375, -D / 2 - 0.05);
  const rail = K.box(W + 0.12, 0.06, 0.14, 0.02, RAIL);
  rail.position.set(0, 2.78, -D / 2 - 0.05);
  g.add(top, part, rail);
  for (const sx of right ? [-1, 1] : [-1]) {
    const side = K.box(0.1, 2.2, D + 0.1, 0.03, FABRIC);
    side.position.set(sx * (W / 2 + 0.05), 1.1, 0);
    const srail = K.box(0.14, 0.06, D + 0.12, 0.02, RAIL);
    srail.position.set(sx * (W / 2 + 0.05), 2.23, 0);
    g.add(side, srail);
  }
  const pedestal = K.box(0.7, H - 0.12, 1.0, 0.03, K.mat(0x9aa0aa, { metalness: 0.4, roughness: 0.45 })); // drawers
  pedestal.position.set(W / 2 - 0.45, (H - 0.12) / 2, -0.05);
  g.add(pedestal);
  if (set) {
    const mon = agentMonitor(screen);
    mon.position.set(-0.15 + (R() - 0.5) * 0.2, H, -0.32);
    mon.rotation.y = (R() - 0.5) * 0.12;
    const kb = K.keyboard();
    kb.scale.setScalar(0.85);
    kb.position.set(-0.15, H, 0.18);
    const hs = headset();
    hs.position.set(0.72, H, 0.05);
    hs.rotation.y = (R() - 0.5) * 1.2;
    const mg = K.mug(mugColor, 0x4f8cff);
    mg.position.set(-0.95, H, 0.0);
    g.add(mon, kb, hs, mg);
    g.userData.monitor = mon;
  }
  if (chair) {
    const ch = taskChair();
    K.at(ch, -0.1 + (R() - 0.5) * 0.4, 0, D / 2 + 0.25 + R() * 0.3, Math.PI + (R() - 0.5) * 0.6);
    g.add(ch);
  }
  return g;
}

/** the setter's sticky note */
function stickyNote() {
  const tex = K.canvasTex(256, 256, (c, W, H) => {
    c.fillStyle = "#ffe27a";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "rgba(0,0,0,0.06)";
    c.fillRect(0, 0, W, 34);
    c.fillStyle = "#23232a";
    c.textAlign = "center";
    c.font = `italic 600 40px ${SANS}`;
    c.fillText("back", W / 2, 92);
    c.fillText("tomorrow", W / 2, 140);
    c.font = `italic 800 52px ${SANS}`;
    c.fillText("9 AM :)", W / 2, 204);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.36), K.mat(0xffffff, { map: tex, roughness: 0.9, side: THREE.DoubleSide }));
  return m;
}

function wallClock({ r = 0.55 } = {}) {
  const g = new THREE.Group();
  const rim = K.cyl(r, r, 0.08, K.mat(0x17181c, { roughness: 0.4 }), 48);
  rim.rotation.x = Math.PI / 2;
  const face = new THREE.Mesh(new THREE.CircleGeometry(r * 0.9, 48), K.mat(0xffffff, { roughness: 0.6, map: K.canvasTex(256, 256, (c, W) => {
    c.fillStyle = "#f6f5f1";
    c.fillRect(0, 0, W, W);
    c.translate(W / 2, W / 2);
    c.fillStyle = "#1c1c20";
    for (let i = 0; i < 12; i++) {
      c.save(); c.rotate((i / 12) * Math.PI * 2); c.fillRect(-3, -W * 0.46, 6, i % 3 ? 14 : 24); c.restore();
    }
    const hand = (a, len, wd, col) => { c.save(); c.rotate(a); c.fillStyle = col; c.fillRect(-wd / 2, -len, wd, len + 12); c.restore(); };
    hand(((7 + 12 / 60) / 12) * Math.PI * 2, W * 0.24, 9, "#1c1c20"); // 7:12
    hand((12 / 60) * Math.PI * 2, W * 0.36, 6, "#1c1c20");
    hand((40 / 60) * Math.PI * 2, W * 0.38, 2.5, "#e23b2e");
    c.beginPath(); c.arc(0, 0, 8, 0, Math.PI * 2); c.fill();
  }) }));
  face.position.z = 0.045;
  g.add(rim, face);
  return g;
}

function waterCooler() {
  const g = new THREE.Group();
  const body = K.box(0.75, 2.0, 0.7, 0.06, K.mat(0xeceef1, { roughness: 0.4, clearcoat: 0.3 }));
  body.position.y = 1.0;
  const panel = K.box(0.5, 0.5, 0.02, 0.02, K.mat(0x2b2e35, { roughness: 0.4 }));
  panel.position.set(0, 1.45, 0.36);
  const tapB = K.box(0.08, 0.1, 0.08, 0.02, K.mat(0x3d7bff, { roughness: 0.3 }));
  tapB.position.set(-0.12, 1.42, 0.39);
  const tapR = K.box(0.08, 0.1, 0.08, 0.02, K.mat(0xe2433a, { roughness: 0.3 }));
  tapR.position.set(0.12, 1.42, 0.39);
  const water = K.mat(0x7fb8ff, { roughness: 0.05, transmission: 0.6, thickness: 0.4, transparent: true, opacity: 0.75, clearcoat: 1 });
  const bottle = K.cyl(0.33, 0.33, 1.0, water, 32);
  bottle.position.y = 2.55;
  const neck = K.cyl(0.12, 0.3, 0.2, water, 32);
  neck.position.y = 2.0 + 0.04;
  const cap = K.ball(0.33, water, 24);
  cap.scale.y = 0.35;
  cap.position.y = 3.05;
  g.add(body, panel, tapB, tapR, bottle, neck, cap);
  return g;
}

/** the LED board, hanging from the ceiling on two cables */
function ledBoard({ w = 3.4, h = 1.28, hang = 1.6 } = {}) {
  const g = new THREE.Group();
  const frame = K.box(w + 0.16, h + 0.16, 0.18, 0.04, K.mat(0x121316, { roughness: 0.4, metalness: 0.4 }));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), K.glow(0xffffff, { map: boardTex() }));
  face.position.z = 0.095;
  g.add(frame, face);
  for (const sx of [-1, 1]) {
    const cable = K.cyl(0.012, 0.012, hang, METAL, 6);
    cable.position.set(sx * w * 0.38, h / 2 + hang / 2, 0);
    g.add(cable);
  }
  return g;
}

/** a ceiling light strip (lit or off) */
function lightStrip({ l = 4, on = true } = {}) {
  const g = new THREE.Group();
  const housing = K.box(0.34, 0.06, l + 0.1, 0.02, K.mat(0xdfe1e5, { roughness: 0.5 }), false);
  const diff = K.box(0.26, 0.02, l, 0.008, on ? K.glow(0xeef3ff) : K.mat(0xb7bac0, { roughness: 0.6 }), false);
  diff.position.y = -0.035;
  g.add(housing, diff);
  return g;
}

export async function build({ renderer, scene, mood = "dusk" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.36;
  scene.background = new THREE.Color(0x141a2a);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 32, h: CEIL, d: 30, backZ: BACK, wall: "#2a3040", floorMap: carpetTex(), floorTile: 2.6, floorRough: 0.95,
    baseboard: false }));
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(32, 30), K.mat(0xffffff, { map: ceilingTex(), roughness: 0.95 }));
  ceil.material.map.repeat.set(32 / 2, 30 / 2);
  ceil.material.map.wrapS = ceil.material.map.wrapT = THREE.RepeatWrapping;
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, CEIL, BACK + 15);
  set.add(ceil);
  // light strips in rows; the far ones are off (everybody went home)
  for (const z of [1.5, -2.5, -6.5]) for (const x of [-6, 0, 6]) {
    const s = lightStrip({ l: 4.6, on: z > -5 || x === 0 });
    K.at(s, x, CEIL - 0.03, z, Math.PI / 2);
    set.add(s);
  }

  // ---- the glass wall on the city at dusk
  const win = glassWall({ w: 30, h: 9.1 });
  K.at(win, 0, 4.85, BACK + 0.02);
  const winGlow = K.wallGlow({ w: 16, h: 5, color: "#ff9a7a", strength: 0.18 });
  K.at(winGlow, -6, 3.2, BACK + 0.08);
  set.add(win, winGlow);

  // ---- the rows of empty workstations (screens toward the camera, the chairs pushed in, backs to us)
  const sleep = screenTex("sleep"), away = screenTex("away");
  const rows = [
    { z: -5.3, xs: [-6.6, -3.95, -1.3, 1.35, 4.0, 6.65] },
    { z: -8.2, xs: [-5.3, -2.65, 0, 2.65, 5.3] },
  ];
  rows.forEach((r, ri) => r.xs.forEach((x, i) => {
    const ws = workstation({ screen: (i + ri) % 3 === 1 ? away : sleep, chair: ri === 0 || i % 2 === 0, right: i === r.xs.length - 1,
      mugColor: [0xf2eee8, 0x2c3a5a, 0xe9e4da][(i + ri) % 3], seed: 11 + ri * 10 + i });
    K.at(ws, x, 0, r.z);
    set.add(ws);
  }));

  // ---- the front row: the setter's desk (the coach rolled his chair out of it) and the next one, its end panel = Setty's perch
  const lock = screenTex("lock");
  const mine = workstation({ screen: lock, chair: false, seed: 5 });
  K.at(mine, -2.35, 0, -2.45);
  const note = stickyNote(); // on the monitor's top right corner
  note.position.set(0.5, 1.06, 0.04);
  note.rotation.z = -0.12;
  mine.userData.monitor.add(note);
  const plantS = K.plant({ h: 0.55, n: 6, seed: 33, pot: 0x2c3a5a });
  plantS.scale.setScalar(0.45);
  K.at(plantS, -3.25, 1.35, -2.75);
  const next = workstation({ screen: sleep, chair: false, right: true, seed: 6 });
  K.at(next, 0.25, 0, -2.45);
  const farL = workstation({ screen: away, chair: true, seed: 7 });
  K.at(farL, -4.95, 0, -2.45);
  set.add(mine, plantS, next, farL);

  // ---- the room's details: a column with the clock past seven, the LED board, the water cooler, plants
  const col = K.box(1.0, CEIL, 1.0, 0.03, K.mat(0xffffff, { map: K.noiseTex("#3a4152", 8, 75), roughness: 0.9 }));
  col.position.set(-6.4, CEIL / 2, -3.9);
  const clock = wallClock();
  K.at(clock, -6.4, 6.4, -3.38);
  const board = ledBoard({ w: 3.2, h: 1.2, hang: CEIL - 6.0 - 0.68 });
  K.at(board, 0.25, 6.0, -7.4);
  const cooler = waterCooler();
  K.at(cooler, 3.75, 0, -3.3, -0.35);
  const plantR = K.plant({ h: 2.6, seed: 23, pot: 0xe4e1db });
  K.at(plantR, 5.6, 0, -1.6);
  const plantL = K.plant({ h: 2.2, seed: 29, pot: 0xe4e1db });
  K.at(plantL, -5.6, 0, 0.6);
  set.add(col, clock, board, cooler, plantR, plantL);

  // ---- the coach's chair, swiveled toward Setty
  const COACH = { x: -1.25, z: -0.45, turn: 0.55 };
  const chair = taskChair();
  K.at(chair, COACH.x, 0, COACH.z - 0.03, COACH.turn);
  set.add(chair);

  // ---- lights: dusk. The afterglow behind the glass wall is the warm rim (long shadows toward us), a cool ceiling fill,
  // a soft front key for the faces; the monitors, the LED board and the strips add practical accents.
  set.add(new THREE.HemisphereLight(0xbccbff, 0x2a2430, 1.05));
  const key = new THREE.DirectionalLight(0xfff0e4, 1.6);
  key.position.set(-2, 9, 10);
  key.target.position.set(0.3, 2.4, -1.5);
  const rim = new THREE.DirectionalLight(0xffa27a, 2.5);
  rim.position.set(-9, 6.5, -24);
  rim.target.position.set(0, 1, 0);
  rim.castShadow = true;
  rim.shadow.mapSize.set(2048, 2048);
  rim.shadow.radius = 8;
  rim.shadow.bias = -0.0005;
  Object.assign(rim.shadow.camera, { left: -12, right: 12, top: 10, bottom: -4, near: 1, far: 40 });
  set.add(key, key.target, rim, rim.target);
  const pl = (color, intensity, x, y, z, distance = 6) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lights = {
    ceilingFront: pl(0xe8efff, 6, -0.5, CEIL - 1.2, 0.5, 9),
    monitor: pl(0x7d8fff, 3, -2.4, 2.3, -1.9, 4),
    board: pl(0xffb23a, 3, 0.25, 5.8, -6.6, 5),
    window: pl(0xff9c86, 5, -4.5, 4.0, BACK + 1.6, 9),
    cooler: pl(0x9cc4ff, 2, 3.8, 2.6, -2.4, 4),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const PERCH = 2.23; // top of the front row's right end panel
  const coachHead = new THREE.Vector3(-1.05, 4.05, -0.25);
  const settyFace = new THREE.Vector3(1.55, PERCH + 1.1, -2.45);
  return {
    key, rim, lights, root: set,
    coach: { x: COACH.x, y: -0.46, z: COACH.z, turn: COACH.turn, sit: 1, phone: 1 },
    setty: { x: 1.55, y: PERCH - 0.3, z: -2.45, turn: -0.3, scale: 0.62 },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 },
    },
    shots: {
      wide: { pos: [0.2, 4.1, 15.0], at: [0.2, 2.5, -2.0], fov: 44 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 }),
    },
  };
}
