// Set "serverroom": the cold aisle of a data center at night (reel15, AI in 2 seconds). Two rows of tall black server
// racks face each other across a perforated raised floor, hundreds of status LEDs blinking (green, blue, white), yellow
// fiber ducts and cable trays overhead, cool LED strips on the ceiling, the aisle running back to the glass doors of the
// containment. The coach sits on a black flight case in front of his own rack (its label screen: "AUTO-REPLY 2.0 s"),
// phone in hand, a crash cart further down the aisle; Setty sits on a server pulled out of its rack on its rails, across
// the aisle. No orange behind Setty: the right row only blinks green, blue and white.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots. The LEDs
// blink with the reel's time (hf-seek), so a frame always shows the same LEDs whatever order the frames render in.
// Every piece of this set lives in this file (lot 12 to 21: nobody edits kit.js).
import * as THREE from "three";
import * as K from "./kit.js";

const AISLE = 2.9; // half-width of the cold aisle: the rack fronts stand at x = ±AISLE
const RACK = { d: 2.4, h: 5.2, w: 1.55 }; // depth (across the aisle), height, width (along the aisle)
const ROW0 = -0.2, N = 10; // centre (z) of the first rack of each row, racks per row
const ROW_END = ROW0 - (N - 0.5) * RACK.w; // back end of the rows
const BACK = ROW_END - 2.4; // the containment wall and its glass doors
const TILE = 1.52; // raised floor tiles (60 cm)
const COACH = { x: -1.5, y: -0.46, z: -0.3, turn: 0.7 };
const SRV = { y: 2.25, t: 0.24, out: 1.3, d: 2.2 }; // Setty's server: centre height, thickness, slid out, depth
const SETTY = { x: AISLE - SRV.out + 0.62, y: SRV.y + SRV.t / 2 - 0.3, z: ROW0, turn: -0.55, scale: 0.62 };
const fwd = (turn) => new THREE.Vector3(Math.sin(turn), 0, Math.cos(turn));
const hash = (x) => { const s = Math.sin(x * 12.9898) * 43758.5453; return s - Math.floor(s); };

// ---------------- textures ----------------

/** one raised-floor tile: light grey, a dark seam (repeat it with room({ floorMap, floorTile: TILE })) */
function tileTex() {
  return K.canvasTex(256, 256, (c, W, H) => {
    c.fillStyle = "#6f757e";
    c.fillRect(0, 0, W, H);
    const R = K.rng(12);
    for (let i = 0; i < 900; i++) {
      c.fillStyle = R() < 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
      c.fillRect(R() * W, R() * H, 2, 2);
    }
    c.strokeStyle = "#30343b";
    c.lineWidth = 5;
    c.strokeRect(2.5, 2.5, W - 5, H - 5);
  });
}

/** a perforated tile: the same grey, a grid of round holes */
function perfTex() {
  return K.canvasTex(256, 256, (c, W, H) => {
    c.fillStyle = "#666c75";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#1a1d22";
    for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) {
      c.beginPath();
      c.arc(22 + i * 14.2, 22 + j * 14.2, 4.2, 0, Math.PI * 2);
      c.fill();
    }
    c.strokeStyle = "#30343b";
    c.lineWidth = 5;
    c.strokeRect(2.5, 2.5, W - 5, H - 5);
  }, { repeat: [2, 1] });
}

/** yellow and black safety tape */
function tapeTex() {
  return K.canvasTex(32, 256, (c, W, H) => { // narrow across the tape, long along it
    c.fillStyle = "#f2c200";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#15161a";
    for (let y = -W; y < H + W; y += 32) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(0, y + 16);
      c.lineTo(W, y + 16 + W);
      c.lineTo(W, y + W);
      c.fill();
    }
  });
}

/** a soft strip of light (additive), bright on one edge: the blue glow the racks throw on the floor */
function stripTex(color) {
  return K.canvasTex(64, 256, (c, W, H) => {
    const g = c.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
  });
}

/** the front of a rack: rails, a stack of servers, switches and blank panels, each LED drawn dim on the face and
 *  bright on one of three glow layers (steady, slow blink, fast flicker). warm: amber LEDs allowed (never on the row
 *  behind Setty). Returns { face, glow: [steady, slow, fast] }. */
function rackFace(seed, warm) {
  const R = K.rng(seed);
  const W = 512, H = 1716, TOP = 22, U = (H - 2 * TOP) / 42, X0 = 44, X1 = W - 44;
  const COLORS = warm ? ["#4dff88", "#4dff88", "#4aa3ff", "#eaf3ff", "#ffb43a"] : ["#4dff88", "#4dff88", "#4aa3ff", "#eaf3ff", "#7fd8ff"];
  const leds = [];
  const led = (c, x, y, { r = 4.5, color, group } = {}) => {
    color = color || COLORS[Math.floor(R() * COLORS.length)];
    group = group ?? (R() < 0.38 ? 0 : R() < 0.55 ? 1 : 2);
    leds.push({ x, y, r, color, group });
    c.globalAlpha = 0.45;
    c.fillStyle = color;
    c.beginPath();
    c.arc(x, y, r * 0.7, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = 1;
  };
  const plate = (c, x, y, w, h, a = "#30343c", b = "#1d2026") => {
    const g = c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, a);
    g.addColorStop(1, b);
    c.fillStyle = g;
    c.fillRect(x, y, w, h);
    c.fillStyle = "rgba(255,255,255,0.08)";
    c.fillRect(x, y, w, 1.5);
  };
  const ears = (c, x, y, w, h) => {
    for (const ex of [x, x + w - 16]) {
      c.fillStyle = "#3b4049";
      c.fillRect(ex, y, 16, h);
      c.fillStyle = "#15171b";
      c.beginPath();
      c.arc(ex + 8, y + Math.min(h / 2, 14), 3.2, 0, Math.PI * 2);
      c.fill();
    }
  };
  const bay = (c, x, y, w, h) => {
    c.fillStyle = "#121418";
    c.fillRect(x, y, w, h);
    c.fillStyle = "#2c3038";
    c.fillRect(x + 2, y + 2, w - 4, h - 4);
    c.fillStyle = "#1a1d22";
    for (let k = 4; k < w - 14; k += 5) c.fillRect(x + k, y + 4, 2, h - 8);
    led(c, x + w - 7, y + h / 2, { r: 3.4 });
  };
  const draw = {
    blank(c, x, y, w, h) {
      c.fillStyle = "#101216";
      c.fillRect(x, y, w, h);
      c.fillStyle = "#171a1f";
      for (let k = 4; k < h - 2; k += 7) c.fillRect(x + 4, y + k, w - 8, 2);
    },
    switch(c, x, y, w, h) {
      plate(c, x, y, w, h, "#22252b", "#16181c");
      ears(c, x, y, w, h);
      const n = 24, pw = (w - 120) / n;
      for (let i = 0; i < n; i++) {
        const px = x + 24 + i * pw;
        c.fillStyle = "#050607";
        c.fillRect(px, y + h - 17, pw - 3, 12);
        c.fillStyle = "#3a3e46";
        c.fillRect(px, y + h - 17, pw - 3, 1.5);
        led(c, px + pw / 2 - 1.5, y + 8, { r: 2.6, color: R() < 0.8 || !warm ? "#4dff88" : "#ffb43a", group: R() < 0.2 ? 0 : R() < 0.5 ? 1 : 2 });
      }
      led(c, x + w - 60, y + h / 2, { r: 4, color: "#4aa3ff", group: 0 });
      led(c, x + w - 42, y + h / 2, { r: 4, color: "#4dff88" });
    },
    s1(c, x, y, w, h) {
      plate(c, x, y, w, h);
      ears(c, x, y, w, h);
      c.fillStyle = "#15171b";
      for (let i = 0; i < 18; i++) for (let j = 0; j < 3; j++) {
        c.beginPath();
        c.arc(x + 30 + i * 7, y + 9 + j * 10, 2, 0, Math.PI * 2);
        c.fill();
      }
      for (let k = 0; k < 4; k++) bay(c, x + 170 + k * 50, y + 6, 46, h - 12);
      led(c, x + w - 40, y + h / 2, { r: 4.5, color: "#4aa3ff", group: 0 });
    },
    s2(c, x, y, w, h) {
      plate(c, x, y, w, h);
      ears(c, x, y, w, h);
      const cols = 4, rows = 3, bw = (w - 110) / cols, bh = (h - 12) / rows;
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) bay(c, x + 24 + i * bw, y + 6 + j * bh, bw - 4, bh - 3);
      led(c, x + w - 46, y + 18, { r: 4.5, color: "#4aa3ff", group: 0 });
      led(c, x + w - 46, y + 36, { r: 4, color: "#4dff88" });
    },
    s4(c, x, y, w, h) {
      plate(c, x, y, w, h, "#2c3037", "#1a1c21");
      ears(c, x, y, w, h);
      const cols = 6, rows = 4, bw = (w - 90) / cols, bh = (h - 14) / rows;
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) bay(c, x + 24 + i * bw, y + 7 + j * bh, bw - 4, bh - 4);
      led(c, x + w - 36, y + 20, { r: 5, color: "#4aa3ff", group: 0 });
    },
  };
  const face = K.canvasTex(W, H, (c) => {
    c.fillStyle = "#08090b";
    c.fillRect(0, 0, W, H);
    for (const x0 of [12, W - 38]) { // the mounting rails and their square holes
      c.fillStyle = "#282b31";
      c.fillRect(x0, 0, 26, H);
      c.fillStyle = "#08090b";
      for (let i = 0; i < 126; i++) c.fillRect(x0 + 9, TOP + (i * U) / 3 + 4, 8, 6);
    }
    let u = 0;
    while (u < 42) {
      const r = R();
      let kind = r < 0.13 ? "blank" : r < 0.3 ? "switch" : r < 0.58 ? "s1" : r < 0.88 ? "s2" : "s4";
      let n = { blank: R() < 0.5 ? 1 : 2, switch: 1, s1: 1, s2: 2, s4: 4 }[kind];
      if (n > 42 - u) { kind = "s1"; n = 1; }
      draw[kind](c, X0, TOP + u * U + 1, X1 - X0, n * U - 2);
      u += n;
    }
  });
  const glow = [0, 1, 2].map((g) => K.canvasTex(256, 858, (c) => {
    c.clearRect(0, 0, 256, 858);
    for (const l of leds) {
      if (l.group !== g) continue;
      const x = l.x / 2, y = l.y / 2, r = l.r * 1.6;
      const gr = c.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(255,255,255,1)");
      gr.addColorStop(0.25, l.color);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = gr;
      c.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
  }));
  return { face, glow };
}

/** the label screen on the coach's rack: a green LCD, "AUTO-REPLY" over a big "2.0 s" */
function lcdTex() {
  return K.canvasTex(512, 220, (c, W, H) => {
    c.fillStyle = "#03110a";
    c.fillRect(0, 0, W, H);
    c.strokeStyle = "#1d5a34";
    c.lineWidth = 6;
    c.strokeRect(8, 8, W - 16, H - 16);
    c.fillStyle = "#6bff98";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "700 44px Menlo, Monaco, 'Courier New', monospace";
    c.fillText("AUTO-REPLY", W / 2, 58);
    c.font = "800 108px Menlo, Monaco, 'Courier New', monospace";
    c.fillText("2.0 s", W / 2, 148);
  });
}

/** the crash cart's screen: a terminal, his upgrade at 47 % */
function termTex() {
  return K.canvasTex(640, 400, (c, W, H) => {
    c.fillStyle = "#040806";
    c.fillRect(0, 0, W, H);
    c.font = "600 30px Menlo, Monaco, 'Courier New', monospace";
    c.fillStyle = "#5dff8f";
    const lines = ["$ autoreply --delay 0", "avg reply: 2.0 s", "$ upgrade --target 1s", "upgrading servers..."];
    lines.forEach((l, i) => c.fillText(l, 26, 56 + i * 52));
    c.strokeStyle = "#5dff8f";
    c.lineWidth = 3;
    c.strokeRect(26, 278, W - 52, 40);
    c.fillRect(30, 282, (W - 60) * 0.47, 32);
    c.fillText("47%", W - 110, 360);
  });
}

/** the row's name on the end panel of its first rack */
function rowSign(letter) {
  return K.canvasTex(256, 256, (c, W, H) => {
    c.fillStyle = "#16365f";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#e8f1ff";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "700 46px Inter, sans-serif";
    c.fillText("ROW", W / 2, 70);
    c.font = "800 130px Inter, sans-serif";
    c.fillText(letter, W / 2, 160);
  });
}

// ---------------- pieces ----------------

let bodyM;
const BODY = () => (bodyM ||= K.mat(0x121318, { roughness: 0.42, metalness: 0.35, clearcoat: 0.3 }));

/** one rack, its front toward local +z: the black cabinet, the face with its LEDs, a blue LED line along the top.
 *  slot: the height of a server slid out (a dark gap in the face). Its blinking glow materials go into `blinkers`. */
function rack(v, blinkers, seed, { slot } = {}) {
  const g = new THREE.Group();
  const body = K.box(RACK.w - 0.04, RACK.h, RACK.d, 0.035, BODY());
  body.position.y = RACK.h / 2;
  g.add(body);
  const fw = RACK.w - 0.2, fh = RACK.h - 0.24, fz = RACK.d / 2;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), K.mat(0xffffff, { map: v.face, roughness: 0.5, metalness: 0.3 }));
  face.position.set(0, RACK.h / 2, fz + 0.004);
  face.receiveShadow = true;
  g.add(face);
  v.glow.forEach((tex, i) => {
    const m = K.glow(0xffffff, { map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const p = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), m);
    p.position.set(0, RACK.h / 2, fz + 0.01 + i * 0.002);
    g.add(p);
    if (i) blinkers.push({ m, rate: i === 1 ? 2.3 : 6.1, phase: hash(seed + i) * 10, seed: seed * 7 + i, lo: i === 1 ? 0.1 : 0.22 });
  });
  for (const [y, w] of [[RACK.h - 0.07, RACK.w - 0.18], [0.12, RACK.w - 0.18]]) { // the frame's top and bottom lips
    const lip = K.box(w, 0.1, 0.06, 0.02, BODY());
    lip.position.set(0, y, fz + 0.02);
    g.add(lip);
  }
  const strip = K.box(RACK.w - 0.2, 0.035, 0.035, 0.01, K.glow(0x3f8cff), false);
  strip.position.set(0, RACK.h - 0.17, fz + 0.04);
  g.add(strip);
  if (slot) { // the gap the server slid out of
    const gap = new THREE.Mesh(new THREE.PlaneGeometry(fw - 0.1, SRV.t + 0.06), K.mat(0x050506, { roughness: 1 }));
    gap.position.set(0, slot, fz + 0.03);
    g.add(gap);
  }
  return g;
}

/** a row of racks along -z from (x, ROW0), fronts toward the aisle */
function row(x, front, variants, blinkers, seed, slot0) {
  const g = new THREE.Group();
  for (let k = 0; k < N; k++) {
    const r = rack(variants[(k * 2 + seed) % variants.length], blinkers, seed * 31 + k, k === 0 && slot0 ? { slot: slot0 } : {});
    K.at(r, x, 0, ROW0 - k * RACK.w, front > 0 ? Math.PI / 2 : -Math.PI / 2);
    g.add(r);
  }
  return g;
}

/** Setty's seat: a 2U server slid halfway out of its rack on its rails (its front toward the aisle, -x) */
function pulledServer() {
  const g = new THREE.Group();
  const steel = K.mat(0x8e959f, { metalness: 0.85, roughness: 0.32 });
  const lid = K.mat(0xffffff, { map: K.canvasTex(512, 320, (c, W, H) => { // the lid: brushed steel, a vent grid
    c.fillStyle = "#7d848e";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "rgba(255,255,255,0.06)";
    for (let y = 0; y < H; y += 3) c.fillRect(0, y, W, 1);
    c.fillStyle = "#3d4249";
    for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) c.fillRect(300 + i * 20, 40 + j * 64, 10, 44);
  }), metalness: 0.7, roughness: 0.38 });
  const body = K.box(SRV.d, SRV.t, RACK.w - 0.3, 0.02, [steel, steel, lid, steel, steel, steel]);
  body.position.set(SRV.d / 2, 0, 0);
  g.add(body);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(RACK.w - 0.3, SRV.t - 0.02), K.mat(0xffffff, { map: K.canvasTex(512, 80, (c, W, H) => {
    c.fillStyle = "#2a2e35";
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 8; i++) {
      c.fillStyle = "#121418";
      c.fillRect(40 + i * 52, 10, 46, H - 20);
      c.fillStyle = "#2f333b";
      c.fillRect(42 + i * 52, 12, 42, H - 24);
    }
    c.fillStyle = "#4aa3ff";
    c.beginPath();
    c.arc(W - 30, H / 2, 6, 0, Math.PI * 2);
    c.fill();
  }), roughness: 0.5, metalness: 0.3 }));
  face.rotation.y = -Math.PI / 2;
  face.position.set(-0.005, 0, 0);
  g.add(face);
  const dot = K.ball(0.03, K.glow(0x4aa3ff), 10);
  dot.position.set(-0.01, 0, -(RACK.w - 0.3) / 2 + 0.12);
  g.add(dot);
  for (const sz of [-1, 1]) { // the rails it slides on
    const rail = K.box(SRV.d + SRV.out * 0.4, 0.07, 0.05, 0.01, steel);
    rail.position.set(SRV.d / 2 + 0.2, -SRV.t / 2 + 0.02, sz * ((RACK.w - 0.3) / 2 + 0.04));
    g.add(rail);
    const handle = K.box(0.05, SRV.t * 0.7, 0.16, 0.015, steel);
    handle.position.set(-0.04, 0, sz * ((RACK.w - 0.3) / 2 - 0.12));
    g.add(handle);
  }
  return g;
}

/** the coach's seat: a black flight case, aluminium edges, orange latches; top at y 0.78 */
function flightCase({ w = 1.7, h = 0.78, d = 1.1 } = {}) {
  const g = new THREE.Group();
  const shell = K.box(w, h, d, 0.06, K.mat(0x17181c, { roughness: 0.55, clearcoat: 0.2 }));
  shell.position.y = h / 2;
  g.add(shell);
  const alu = K.mat(0xb9bec6, { metalness: 0.9, roughness: 0.28 });
  for (const y of [0.03, h - 0.03, h * 0.62]) { // the edge trims and the lid seam
    for (const sz of [-1, 1]) {
      const t = K.box(w + 0.02, 0.05, 0.05, 0.012, alu);
      t.position.set(0, y, sz * d / 2);
      g.add(t);
    }
    for (const sx of [-1, 1]) {
      const t = K.box(0.05, 0.05, d + 0.02, 0.012, alu);
      t.position.set(sx * w / 2, y, 0);
      g.add(t);
    }
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { // the corner caps
    const cap = K.ball(0.07, alu, 12);
    cap.position.set(sx * w / 2, h - 0.03, sz * d / 2);
    g.add(cap);
  }
  for (const sx of [-0.5, 0.5]) { // latches on the front
    const latch = K.box(0.16, 0.12, 0.05, 0.02, K.mat(0xff611d, { roughness: 0.4 }));
    latch.position.set(sx * w * 0.6, h * 0.62, d / 2 + 0.03);
    g.add(latch);
  }
  return g;
}

/** a crash cart: a steel cart on casters, a small monitor on a terminal, a keyboard on the middle shelf */
function crashCart() {
  const g = new THREE.Group();
  const steel = K.mat(0x9aa1ab, { metalness: 0.85, roughness: 0.3 });
  for (const y of [0.5, 1.45, 2.4]) {
    const s = K.box(1.3, 0.05, 0.85, 0.02, steel);
    s.position.y = y;
    g.add(s);
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const p = K.cyl(0.03, 0.03, 2.3, steel, 10);
    p.position.set(sx * 0.6, 1.4, sz * 0.38);
    const wheel = K.cyl(0.09, 0.09, 0.06, K.mat(0x111114, { roughness: 0.6 }), 16);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(sx * 0.6, 0.11, sz * 0.38);
    g.add(p, wheel);
  }
  const mon = K.monitor({ w: 1.2, h: 0.78, screen: termTex() });
  mon.scale.setScalar(0.9);
  mon.position.set(0, 2.42, -0.05);
  const kb = K.keyboard();
  kb.position.set(0, 1.48, 0.05);
  g.add(mon, kb);
  return g;
}

/** overhead: a wire tray of cables and a yellow fiber duct along a row, hung from the ceiling */
function overhead(x, len, zMid) {
  const g = new THREE.Group();
  const steel = K.mat(0x8f969f, { metalness: 0.8, roughness: 0.35 });
  const trayY = 6.2;
  for (const sx of [-0.55, 0.55]) {
    const rail = K.box(0.04, 0.12, len, 0.01, steel, false);
    rail.position.set(x + sx, trayY, zMid);
    g.add(rail);
  }
  const R = K.rng(Math.round(Math.abs(x) * 10));
  const cableColors = [0x2f6fd6, 0x2f6fd6, 0x8a9099, 0x3d4450, 0x1f7a5a];
  for (let i = 0; i < 9; i++) {
    const cbl = K.cyl(0.045, 0.045, len, K.mat(cableColors[i % cableColors.length], { roughness: 0.55 }), 8);
    cbl.rotation.x = Math.PI / 2;
    cbl.position.set(x - 0.45 + i * 0.11, trayY + 0.03 + R() * 0.05, zMid);
    cbl.castShadow = false;
    g.add(cbl);
  }
  const yellow = K.mat(0xf2c200, { roughness: 0.45, clearcoat: 0.3 });
  const duct = K.box(0.55, 0.36, len, 0.06, yellow, false);
  duct.position.set(x + (x > 0 ? 0.9 : -0.9), 7.0, zMid);
  g.add(duct);
  for (let k = 0; k < N; k += 3) { // drops into a rack top
    const drop = K.box(0.26, 1.62, 0.26, 0.05, yellow, false);
    drop.position.set(x + (x > 0 ? 0.9 : -0.9), 6.02, ROW0 - k * RACK.w);
    g.add(drop);
  }
  for (let z = zMid + len / 2 - 0.6; z > zMid - len / 2; z -= 3.2) { // hangers
    for (const sx of [-0.55, 0.55]) {
      const rod = K.cyl(0.015, 0.015, 3.6, steel, 6);
      rod.position.set(x + sx, trayY + 1.8, z);
      g.add(rod);
    }
  }
  return g;
}

export async function build({ renderer, scene, mood = "night" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.3;
  scene.background = new THREE.Color(0x070b12);
  scene.fog = new THREE.Fog(0x070b12, 21, 48); // the aisle fades into the dark; the characters stay clear
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  const floorW = 16 * TILE, floorD = 24 * TILE;
  set.add(K.room({ w: floorW, h: 12, d: floorD, backZ: BACK, floorMap: tileTex(), floorTile: TILE, floorRough: 0.62,
    wallMap: K.noiseTex("#161b23", 8, 9), baseboard: false }));
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(floorW, floorD), K.mat(0x0b0e14, { roughness: 0.95 }));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, 9.8, BACK + floorD / 2);
  set.add(ceil);

  // ---- the floor of the aisle: perforated tiles down the middle, safety tape along the rack fronts
  const rowLen = N * RACK.w, rowMid = ROW0 + RACK.w / 2 - rowLen / 2;
  const perf = new THREE.Mesh(new THREE.PlaneGeometry(2 * TILE, rowLen), K.mat(0xffffff, { map: perfTex(), roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  perf.material.map.repeat.set(2, rowLen / TILE);
  perf.rotation.x = -Math.PI / 2;
  perf.position.set(0, 0.005, rowMid);
  perf.receiveShadow = true;
  set.add(perf);
  for (const sx of [-1, 1]) {
    const tape = new THREE.Mesh(new THREE.PlaneGeometry(0.13, rowLen), K.mat(0xffffff, { map: tapeTex(), roughness: 0.5,
      polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
    tape.material.map.wrapS = tape.material.map.wrapT = THREE.RepeatWrapping;
    tape.material.map.repeat.set(1, rowLen / 1.0);
    tape.rotation.x = -Math.PI / 2;
    tape.position.set(sx * (AISLE - 0.16), 0.008, rowMid);
    tape.receiveShadow = true;
    // the blue glow the racks throw on the floor
    const wash = new THREE.Mesh(new THREE.PlaneGeometry(1.4, rowLen), K.glow(0xffffff, { map: stripTex("rgba(70,140,255,0.55)"),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    wash.rotation.set(-Math.PI / 2, 0, sx > 0 ? Math.PI : 0);
    wash.position.set(sx * (AISLE - 0.7), 0.012, rowMid);
    set.add(tape, wash);
  }

  // ---- the two rows of racks (the left one may blink amber; the right one, behind Setty, never)
  const blinkers = [];
  const warm = [11, 23, 37].map((s) => rackFace(s, true));
  const cool = [41, 53, 67].map((s) => rackFace(s, false));
  const left = row(-(AISLE + RACK.d / 2), 1, warm, blinkers, 1);
  const right = row(AISLE + RACK.d / 2, -1, cool, blinkers, 2, SRV.y);
  set.add(left, right);
  for (const [x, letter] of [[-(AISLE + RACK.d / 2), "A"], [AISLE + RACK.d / 2, "B"]]) { // the row signs on the end panels
    const s = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), K.mat(0xffffff, { map: rowSign(letter), roughness: 0.4 }));
    s.position.set(x, 4.3, ROW0 + RACK.w / 2 + 0.005);
    set.add(s);
  }
  // his rack (the first of row A): the label screen
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.41), K.glow(0xffffff, { map: lcdTex() }));
  lcd.rotation.y = Math.PI / 2;
  lcd.position.set(-AISLE + 0.055, 3.55, ROW0 + 0.42);
  const lcdFrame = K.box(0.06, 0.5, 1.04, 0.02, K.mat(0x0d0e11, { roughness: 0.4 }));
  lcdFrame.position.set(-AISLE + 0.01, 3.55, ROW0 + 0.42);
  set.add(lcdFrame, lcd);

  // ---- Setty's server, slid out of the first rack of row B
  const srv = pulledServer();
  srv.position.set(AISLE - SRV.out, SRV.y, ROW0);
  set.add(srv);

  // ---- the coach's flight case, the crash cart down the aisle, the overhead trays, the ceiling lights
  const fc = fwd(COACH.turn);
  const caseG = flightCase();
  K.at(caseG, COACH.x - fc.x * 0.12, 0, COACH.z - fc.z * 0.12, COACH.turn);
  const cart = crashCart();
  K.at(cart, -1.75, 0, -5.4, 0.5);
  set.add(caseG, cart);
  set.add(overhead(-(AISLE + RACK.d / 2), rowLen + 1.2, rowMid), overhead(AISLE + RACK.d / 2, rowLen + 1.2, rowMid));
  for (let z = ROW0 + 1.2; z > BACK + 1; z -= 3.3) { // LED troffers down the aisle
    const t = K.box(0.3, 0.05, 2.2, 0.02, K.glow(0xa9c9ff), false);
    t.position.set(0, 9.74, z);
    set.add(t);
  }

  // ---- the end of the aisle: the containment wall, two glass sliding doors lit from behind, an EXIT sign
  const doorGlow = K.wallGlow({ w: 9, h: 7, color: "#9fd0ff", strength: 0.75 });
  K.at(doorGlow, 0, 2.8, BACK + 0.02);
  set.add(doorGlow);
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xcfe6ff, transmission: 0.6, roughness: 0.08, transparent: true, opacity: 0.35 });
  const frameM = K.mat(0x9aa1ab, { metalness: 0.85, roughness: 0.3 });
  for (const sx of [-1, 1]) {
    const lit = new THREE.Mesh(new THREE.PlaneGeometry(1.86, 4.56), K.glow(0xbfe0ff, { transparent: true, opacity: 0.55 }));
    lit.position.set(sx * 0.98, 2.3, BACK + 0.05);
    const pane = K.box(1.9, 4.6, 0.04, 0.01, glass, false);
    pane.position.set(sx * 0.98, 2.3, BACK + 0.14);
    set.add(lit, pane);
    for (const [x, y, w, h] of [[0, 4.62, 2.0, 0.08], [0, 0.02, 2.0, 0.06], [-0.97, 2.3, 0.07, 4.66], [0.97, 2.3, 0.07, 4.66]]) {
      const bar = K.box(w, h, 0.1, 0.02, frameM, false);
      bar.position.set(sx * 0.98 + x, y, BACK + 0.14);
      set.add(bar);
    }
  }
  const exit = K.box(0.9, 0.34, 0.12, 0.03, K.glow(0x22d16b), false);
  exit.position.set(0, 5.25, BACK + 0.12);
  set.add(exit);

  // ---- lights: a cool night of LEDs. A neutral key from the front for the faces, a cold rim from the doors (the
  // shadows), blue down the aisle, a white glow from the doors, a hint of green from the LEDs.
  set.add(new THREE.HemisphereLight(0x9cc2ff, 0x141a24, 0.6));
  const key = new THREE.DirectionalLight(0xfff0e4, 1.55);
  key.position.set(1.2, 8, 13);
  key.target.position.set(0, 2.6, -0.6);
  const rim = new THREE.DirectionalLight(0x86ccff, 2.3);
  rim.position.set(-1.5, 9.5, BACK - 2);
  rim.target.position.set(0, 1.5, 0);
  rim.castShadow = true;
  rim.shadow.mapSize.set(2048, 2048);
  rim.shadow.radius = 6;
  rim.shadow.bias = -0.0005;
  Object.assign(rim.shadow.camera, { left: -8, right: 8, top: 9, bottom: -4, near: 1, far: 40 });
  set.add(key, key.target, rim, rim.target);
  const pl = (color, intensity, x, y, z, distance = 8) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lights = {
    aisle: [-1.5, -6.5, -11.5].map((z) => pl(0x3d7dff, 3.4, 0, 7.6, z, 9)),
    door: pl(0xbfe0ff, 6, 0, 3.2, BACK + 1.2, 10),
    leds: [pl(0x5dffb0, 1.1, -AISLE + 0.6, 2.6, -1.6, 4.5), pl(0x5fa8ff, 1.1, AISLE - 0.6, 2.6, -1.6, 4.5)],
  };

  // the LEDs blink with the reel's time: a frame shows the same LEDs whatever order it renders in
  const blinkAt = (t) => {
    for (const b of blinkers) b.m.opacity = hash(Math.floor(t * b.rate + b.phase) + b.seed) > 0.42 ? 1 : b.lo;
  };
  blinkAt(window.__hfThreeTime || 0);
  window.addEventListener("hf-seek", (e) => blinkAt(e.detail.time));

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(COACH.x, 4.05, COACH.z).addScaledVector(fc, 0.28);
  const settyFace = new THREE.Vector3(SETTY.x, SETTY.y + 1.7 * SETTY.scale + 0.04, SETTY.z);
  return {
    key, rim, lights, root: set, blinkAt,
    coach: { x: COACH.x, y: COACH.y, z: COACH.z, turn: COACH.turn, sit: 1, phone: 1 },
    setty: { x: SETTY.x, y: SETTY.y, z: SETTY.z, turn: SETTY.turn, scale: SETTY.scale },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.62, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.5, pitch: 0.06, y: 800 },
    },
    shots: {
      wide: { pos: [0.2, 3.9, 16.4], at: [0.2, 3.0, -1.5], fov: 43 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.62, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.5, pitch: 0.06, y: 800 }),
      // insert: his rack's "2.0 s" label
      label: K.shot(new THREE.Vector3(-AISLE, 3.55, ROW0 + 0.42), { dist: 4.2, yaw: 0.9, pitch: 0.02, y: 900 }),
    },
  };
}
