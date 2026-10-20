// Set "kitchen": the coach's kitchen in the morning (reel7, the Comment GUIDE flow). A bright modern kitchen: a white
// marble island in front, deep green shaker cabinets with brass pulls along the back wall, white zellige tiles, open oak
// shelves (jars, plates, the juicer still in its box), an espresso machine, a black steel window on a sunny garden, two
// glass globe pendants. He stands behind the island, phone in hand, the blender full of green smoothie next to him;
// Setty sits on the island by the fruit bowl.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
// The kitchen furniture lives here (only this set uses it); move a piece to kit.js the day a second set needs it.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4;
const TOP = 1.78; // counter height (the coach's hips: the island hides his legs)
const GREEN = 0x2f4b40, BRASS = 0xc9a14e;

const brass = () => K.mat(BRASS, { metalness: 1, roughness: 0.28 });
const steel = () => K.mat(0xd9dce0, { metalness: 0.95, roughness: 0.22 });
const glass = (o = {}) => K.mat(0xffffff, { roughness: 0.05, transmission: 0.92, thickness: 0.05, transparent: true, opacity: 0.35, ...o });

// ---------------- textures ----------------
/** white marble: soft grey veins */
function marbleTex({ seed = 5 } = {}) {
  const R = K.rng(seed);
  return K.canvasTex(1024, 1024, (c, W, H) => {
    c.fillStyle = "#f3f1ec";
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) {
      c.strokeStyle = `rgba(${120 + R() * 40}, ${122 + R() * 40}, ${128 + R() * 40}, ${0.08 + R() * 0.22})`;
      c.lineWidth = 0.6 + R() * (i < 5 ? 5 : 2.2);
      c.filter = `blur(${R() < 0.5 ? 0 : 1.2}px)`;
      c.beginPath();
      let x = R() * W, y = -20;
      c.moveTo(x, y);
      while (y < H + 20) {
        const nx = x + (R() - 0.35) * 160, ny = y + 60 + R() * 120;
        c.quadraticCurveTo(x + (R() - 0.5) * 120, (y + ny) / 2, nx, ny);
        x = nx;
        y = ny;
      }
      c.stroke();
    }
    c.filter = "none";
  });
}

/** handmade white tiles (zellige), 2:1, slightly uneven, light grout */
function tileTex({ seed = 11, rows = 10, cols = 5 } = {}) {
  const R = K.rng(seed);
  return K.canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = "#d8d2c8";
    c.fillRect(0, 0, W, H);
    const th = H / rows, tw = W / cols;
    for (let r = 0; r < rows; r++) for (let k = -1; k < cols + 1; k++) {
      const x = k * tw + (r % 2 ? tw / 2 : 0), y = r * th;
      const v = 238 + R() * 14;
      const gr = c.createLinearGradient(x, y, x + tw, y + th);
      gr.addColorStop(0, `rgb(${v}, ${v - 3}, ${v - 9})`);
      gr.addColorStop(0.5, `rgb(${v - 8}, ${v - 11}, ${v - 16})`);
      gr.addColorStop(1, `rgb(${v - 2}, ${v - 5}, ${v - 10})`);
      c.fillStyle = gr;
      c.beginPath();
      c.roundRect(x + 2.5, y + 2.5, tw - 5, th - 5, 3);
      c.fill();
      c.fillStyle = "rgba(255,255,255,0.35)"; // the glaze catching the light
      c.fillRect(x + 6, y + 5, tw * (0.3 + R() * 0.4), 2);
    }
  }, { repeat: [1, 1] });
}

/** a sunny garden in the morning: hills, trees, a lemon tree, a hedge */
function gardenView(c, W, H, R) {
  const sky = c.createLinearGradient(0, 0, 0, H * 0.7);
  sky.addColorStop(0, "#8ec8f2");
  sky.addColorStop(0.6, "#cfe8f7");
  sky.addColorStop(1, "#fff1d2");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  const sx = W * 0.78, sy = H * 0.2;
  const halo = c.createRadialGradient(sx, sy, 0, sx, sy, W * 0.6);
  halo.addColorStop(0, "rgba(255, 253, 240, 1)");
  halo.addColorStop(0.07, "rgba(255, 244, 214, 0.95)");
  halo.addColorStop(0.3, "rgba(255, 228, 180, 0.35)");
  halo.addColorStop(1, "rgba(255, 228, 180, 0)");
  c.fillStyle = halo;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "rgba(255,255,255,0.7)";
  for (const [x, y, s] of [[0.18, 0.16, 1], [0.42, 0.1, 0.7], [0.3, 0.26, 0.55]]) {
    for (let i = 0; i < 5; i++) {
      c.beginPath();
      c.ellipse(W * x + (i - 2) * 38 * s, H * y + (i % 2) * 8, 60 * s, 26 * s, 0, 0, Math.PI * 2);
      c.fill();
    }
  }
  const hill = (y0, amp, color, seed) => {
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(0, H);
    for (let x = 0; x <= W; x += 16) c.lineTo(x, H * y0 - amp * Math.sin(x / W * 3.1 + seed) - amp * 0.4 * Math.sin(x / W * 7 + seed * 2));
    c.lineTo(W, H);
    c.fill();
  };
  hill(0.56, 30, "#a9cfa2", 1);
  hill(0.64, 24, "#86b882", 4);
  const tree = (x, y, r, col) => {
    c.fillStyle = "#6b4a33";
    c.fillRect(x - r * 0.08, y, r * 0.16, r * 1.1);
    c.fillStyle = col;
    for (let i = 0; i < 6; i++) {
      c.beginPath();
      c.arc(x + (R() - 0.5) * r * 0.9, y - r * 0.2 + (R() - 0.5) * r * 0.6, r * (0.45 + R() * 0.2), 0, Math.PI * 2);
      c.fill();
    }
  };
  tree(W * 0.1, H * 0.58, 70, "#4f8f5a");
  tree(W * 0.86, H * 0.6, 90, "#467f50");
  tree(W * 0.6, H * 0.62, 55, "#5a9a62");
  // the lemon tree, close
  tree(W * 0.32, H * 0.66, 120, "#3f7a4c");
  c.fillStyle = "#ffd84a";
  for (let i = 0; i < 22; i++) {
    c.beginPath();
    c.ellipse(W * 0.32 + (R() - 0.5) * 190, H * 0.62 + (R() - 0.5) * 120, 9, 12, R(), 0, Math.PI * 2);
    c.fill();
  }
  // the hedge
  c.fillStyle = "#355f3c";
  c.beginPath();
  c.moveTo(0, H);
  for (let x = 0; x <= W; x += 24) c.lineTo(x, H * 0.8 - 14 * Math.abs(Math.sin(x * 0.05)) - R() * 8);
  c.lineTo(W, H);
  c.fill();
}

/** the juicer still in its box (line 9: "like the juicer you bought in January") */
function boxArt(c, W, H) {
  c.fillStyle = "#f1ece3";
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#79b84a";
  c.fillRect(0, H * 0.78, W, H * 0.22);
  c.fillStyle = "#1d1d1f";
  c.font = "800 92px Inter, sans-serif";
  c.textAlign = "center";
  c.fillText("JUICER", W / 2, H * 0.3);
  c.font = "600 36px Inter, sans-serif";
  c.fillText("NEW YEAR, NEW YOU", W / 2, H * 0.42);
  // the machine on the box: a chrome body, the press cone, a glass of juice, two oranges
  c.fillStyle = "#c9ced4";
  c.beginPath();
  c.roundRect(W * 0.3, H * 0.56, W * 0.26, H * 0.2, 16);
  c.fill();
  c.fillStyle = "#e9edf1";
  c.beginPath();
  c.ellipse(W * 0.43, H * 0.56, W * 0.15, H * 0.035, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#b8bec6";
  c.beginPath();
  c.moveTo(W * 0.36, H * 0.555); c.lineTo(W * 0.43, H * 0.45); c.lineTo(W * 0.5, H * 0.555);
  c.fill();
  c.fillStyle = "rgba(255, 196, 60, 0.9)";
  c.fillRect(W * 0.62, H * 0.6, W * 0.08, H * 0.16);
  c.strokeStyle = "#8a9099";
  c.lineWidth = 3;
  c.strokeRect(W * 0.62, H * 0.56, W * 0.08, H * 0.2);
  c.fillStyle = "#ff9a1f";
  for (const [x, y] of [[0.78, 0.7], [0.86, 0.72]]) {
    c.beginPath();
    c.arc(W * x, H * y, 22, 0, Math.PI * 2);
    c.fill();
  }
}

// ---------------- furniture ----------------
/** a run of shaker cabinets (doors facing +z), marble top; returns { group } with the doors drawn */
function cabinetRun({ w = 6, d = 1.2, h = TOP, n = 4, color = GREEN, top = true, overhang = 0.08, marble } = {}) {
  const g = new THREE.Group();
  const paint = K.mat(color, { roughness: 0.48, clearcoat: 0.35, clearcoatRoughness: 0.4 });
  const plinth = K.box(w - 0.1, 0.14, d - 0.14, 0.01, K.mat(0x1d2622, { roughness: 0.7 }));
  plinth.position.set(0, 0.07, -0.06);
  const body = K.box(w, h - 0.2, d - 0.04, 0.02, paint);
  body.position.set(0, 0.14 + (h - 0.2) / 2, -0.02);
  g.add(plinth, body);
  const dw = w / n, dh = h - 0.34;
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + dw * (i + 0.5);
    const door = K.box(dw - 0.06, dh, 0.06, 0.02, paint);
    door.position.set(x, 0.16 + dh / 2, d / 2 - 0.02);
    const panel = K.box(dw - 0.34, dh - 0.32, 0.03, 0.01, K.mat(color, { roughness: 0.55, clearcoat: 0.2 }));
    panel.position.set(x, 0.16 + dh / 2, d / 2 - 0.005);
    const pull = K.box(0.04, 0.34, 0.05, 0.015, brass());
    pull.position.set(x + (i % 2 ? -1 : 1) * (dw / 2 - 0.16), 0.16 + dh - 0.32, d / 2 + 0.05);
    g.add(door, panel, pull);
  }
  if (top) {
    const slab = K.box(w + overhang * 2, 0.12, d + overhang, 0.025, K.mat(0xffffff, { map: marble || marbleTex(), roughness: 0.18, clearcoat: 0.8, clearcoatRoughness: 0.12 }));
    slab.position.set(0, h - 0.06, overhang / 2);
    g.add(slab);
  }
  g.userData.top = h;
  return g;
}

function espresso() {
  const g = new THREE.Group();
  const st = steel();
  const body = K.box(0.95, 0.72, 0.62, 0.06, st);
  body.position.y = 0.36;
  const tray = K.box(0.82, 0.04, 0.42, 0.01, K.mat(0x2a2a2e, { metalness: 0.6, roughness: 0.4 }));
  tray.position.set(0, 0.06, 0.36);
  const head = K.cyl(0.11, 0.11, 0.12, st, 24);
  head.position.set(0, 0.5, 0.32);
  const pf = K.box(0.06, 0.05, 0.36, 0.02, K.mat(0x141416, { roughness: 0.5 }));
  pf.position.set(0.02, 0.43, 0.52);
  pf.rotation.y = 0.35;
  const gauge = new THREE.Mesh(new THREE.CircleGeometry(0.09, 32), K.mat(0xf6f1e6, { roughness: 0.3, clearcoat: 1 }));
  gauge.position.set(-0.26, 0.56, 0.312);
  const needle = K.box(0.008, 0.07, 0.004, 0.002, K.mat(0xd2341c), false);
  needle.position.set(-0.24, 0.575, 0.316);
  needle.rotation.z = -0.6;
  const cup = K.mug(0xf4f0e8, 0xf4f0e8);
  cup.scale.setScalar(0.6);
  cup.position.set(-0.02, 0.08, 0.34);
  const cups = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cp = K.mug(0xf4f0e8, 0x2f4b40);
    cp.scale.setScalar(0.55);
    cp.position.set(-0.24 + i * 0.22, 0.72, -0.05);
    cups.add(cp);
  }
  g.add(body, tray, head, pf, gauge, needle, cup, cups);
  return g;
}

function grinder() {
  const g = new THREE.Group();
  const base = K.box(0.34, 0.5, 0.42, 0.05, K.mat(0x17171a, { roughness: 0.4, clearcoat: 0.6 }));
  base.position.y = 0.25;
  const hopper = K.cyl(0.15, 0.08, 0.36, glass({ opacity: 0.5 }), 24);
  hopper.position.y = 0.68;
  const beans = K.cyl(0.12, 0.08, 0.2, K.mat(0x3a2212, { roughness: 0.7 }), 24);
  beans.position.y = 0.6;
  const lid = K.cyl(0.155, 0.155, 0.04, K.mat(0x17171a, { roughness: 0.4 }), 24);
  lid.position.y = 0.88;
  g.add(base, hopper, beans, lid);
  return g;
}

/** blender: black base, glass jar full of green smoothie */
function blender() {
  const g = new THREE.Group();
  const base = K.box(0.5, 0.36, 0.5, 0.08, K.mat(0x18181b, { roughness: 0.35, clearcoat: 0.7 }));
  base.position.y = 0.18;
  const knob = K.cyl(0.07, 0.07, 0.04, steel(), 24);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0, 0.18, 0.26);
  const jar = K.cyl(0.26, 0.19, 0.86, glass(), 32);
  jar.position.y = 0.36 + 0.43;
  jar.castShadow = false;
  const smoothie = K.cyl(0.235, 0.185, 0.6, K.mat(0x7fb43a, { roughness: 0.55, clearcoat: 0.3 }), 32);
  smoothie.position.y = 0.38 + 0.3;
  const lid = K.cyl(0.27, 0.27, 0.07, K.mat(0x18181b, { roughness: 0.4 }), 32);
  lid.position.y = 0.36 + 0.86 + 0.03;
  const handle = K.box(0.06, 0.6, 0.12, 0.03, K.mat(0x18181b, { roughness: 0.4 }));
  handle.position.set(0.3, 0.78, 0);
  g.add(base, knob, smoothie, jar, lid, handle);
  return g;
}

/** a tall glass of green smoothie with a striped paper straw */
function smoothieGlass() {
  const g = new THREE.Group();
  const gl = K.cyl(0.14, 0.12, 0.5, glass(), 28);
  gl.position.y = 0.25;
  gl.castShadow = false;
  const drink = K.cyl(0.125, 0.11, 0.38, K.mat(0x86b53f, { roughness: 0.5, clearcoat: 0.4 }), 28);
  drink.position.y = 0.2;
  const straw = K.cyl(0.018, 0.018, 0.62, K.mat(0xffffff, { map: K.canvasTex(32, 256, (c, W, H) => {
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#ff611d";
    for (let y = 0; y < H; y += 32) c.fillRect(0, y, W, 14);
  }), roughness: 0.6 }), 12);
  straw.position.set(0.05, 0.5, 0);
  straw.rotation.z = -0.22;
  g.add(gl, drink, straw);
  return g;
}

function banana(rot = 0) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 12, 24, 1.7), K.mat(0xf3d23a, { roughness: 0.5, clearcoat: 0.3 }));
  m.castShadow = true;
  m.rotation.set(Math.PI / 2, 0, rot);
  return m;
}

/** wooden fruit bowl: green apples, red apples, lemons, bananas */
function fruitBowl() {
  const g = new THREE.Group();
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const a = (i / 12) * Math.PI * 0.5;
    pts.push(new THREE.Vector2(0.12 + Math.sin(a) * 0.46, 0.02 + (1 - Math.cos(a)) * 0.26));
  }
  const bowl = new THREE.Mesh(new THREE.LatheGeometry(pts, 48), K.mat(0x8a5a36, { roughness: 0.45, clearcoat: 0.5, side: THREE.DoubleSide }));
  bowl.castShadow = bowl.receiveShadow = true;
  const foot = K.cyl(0.18, 0.2, 0.04, K.mat(0x7a4d2c, { roughness: 0.5 }), 32);
  foot.position.y = 0.02;
  g.add(bowl, foot);
  const fruit = [[-0.18, 0.24, 0.02, 0x8ccf4a, 0.15], [0.17, 0.24, -0.08, 0xc8352c, 0.15], [0.02, 0.26, 0.16, 0xffd84a, 0.12],
    [0.05, 0.38, -0.05, 0x8ccf4a, 0.14], [-0.1, 0.22, -0.2, 0xc8352c, 0.14], [0.22, 0.25, 0.16, 0xffd84a, 0.11]];
  for (const [x, y, z, col, r] of fruit) {
    const f = K.ball(r, K.mat(col, { roughness: 0.38, clearcoat: 0.6 }), 24);
    if (col === 0xffd84a) f.scale.set(1.25, 1, 1);
    f.position.set(x, y, z);
    g.add(f);
  }
  const b1 = banana(0.3);
  b1.position.set(-0.05, 0.47, 0.02);
  const b2 = banana(0.6);
  b2.position.set(0.0, 0.5, 0.06);
  g.add(b1, b2);
  return g;
}

/** a cutting board with an avocado cut open and a knife */
function cuttingBoard() {
  const g = new THREE.Group();
  const board = K.box(0.9, 0.06, 0.55, 0.02, K.mat(0xffffff, { map: K.woodTex({ base: "#c69563", planks: 3, seed: 8 }), roughness: 0.5 }));
  board.position.y = 0.03;
  const skin = K.mat(0x2f4a22, { roughness: 0.7 }), flesh = K.mat(0xd7e27a, { roughness: 0.5 }), pit = K.mat(0x7a4a26, { roughness: 0.4, clearcoat: 0.6 });
  for (const [x, rot] of [[-0.18, 0.2], [0.08, -0.3]]) {
    const half = new THREE.Group();
    const s = K.ball(0.13, skin, 24);
    s.scale.set(1, 0.5, 1.35);
    const f = new THREE.Mesh(new THREE.CircleGeometry(0.12, 24), flesh);
    f.rotation.x = -Math.PI / 2;
    f.scale.set(1, 1.3, 1);
    f.position.y = 0.066;
    half.add(s, f);
    if (rot > 0) {
      const p = K.ball(0.05, pit, 16);
      p.position.set(0, 0.07, 0.02);
      half.add(p);
    }
    half.position.set(x, 0.08, 0.02);
    half.rotation.y = rot;
    g.add(half);
  }
  const blade = K.box(0.36, 0.01, 0.06, 0.004, steel(), false);
  blade.position.set(0.26, 0.07, 0.17);
  blade.rotation.y = -0.4;
  const hnd = K.box(0.2, 0.03, 0.05, 0.012, K.mat(0x1a1a1c, { roughness: 0.5 }));
  hnd.position.set(0.48, 0.075, 0.26);
  hnd.rotation.y = -0.4;
  g.add(board, blade, hnd);
  return g;
}

/** gooseneck brass faucet over the sink */
function faucet() {
  const g = new THREE.Group();
  const b = brass();
  const col = K.cyl(0.05, 0.06, 0.9, b, 20);
  col.position.y = 0.45;
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.045, 12, 32, Math.PI), b);
  arc.position.set(0, 0.9, 0.28);
  arc.rotation.y = Math.PI / 2;
  arc.castShadow = true;
  const tip = K.cyl(0.05, 0.045, 0.16, b, 16);
  tip.position.set(0, 0.84, 0.56);
  const lever = K.box(0.04, 0.04, 0.24, 0.015, b);
  lever.position.set(0.1, 0.3, 0.05);
  lever.rotation.x = -0.6;
  const sink = K.box(1.5, 0.03, 0.75, 0.02, steel(), false);
  sink.position.set(0, 0.005, 0.5);
  g.add(col, arc, tip, lever, sink);
  return g;
}

function jar(fill = 0xe8c25a, h = 0.5) {
  const g = new THREE.Group();
  const gl = K.cyl(0.15, 0.15, h, glass({ opacity: 0.4 }), 24);
  gl.position.y = h / 2;
  gl.castShadow = false;
  const c = K.cyl(0.13, 0.13, h * 0.68, K.mat(fill, { roughness: 0.85 }), 24);
  c.position.y = h * 0.36;
  const lid = K.cyl(0.155, 0.155, 0.07, K.mat(0xb98a5e, { roughness: 0.5 }), 24);
  lid.position.y = h + 0.035;
  g.add(gl, c, lid);
  return g;
}

/** an open oak shelf with its brass brackets; things are added by the caller */
function openShelf(w) {
  const g = new THREE.Group();
  const board = K.box(w, 0.1, 0.55, 0.02, K.mat(0xffffff, { map: K.woodTex({ base: "#c79a68", planks: 2, seed: 12 }), roughness: 0.5, clearcoat: 0.25 }));
  g.add(board);
  for (const sx of [-1, 1]) {
    const br = K.box(0.05, 0.3, 0.05, 0.01, brass());
    br.position.set(sx * (w / 2 - 0.3), -0.2, -0.2);
    g.add(br);
  }
  return g;
}

function plates(n = 5, color = 0xf4f0e8) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const p = K.cyl(0.3, 0.24, 0.04, K.mat(color, { roughness: 0.3, clearcoat: 0.8 }), 32);
    p.position.y = 0.02 + i * 0.045;
    g.add(p);
  }
  return g;
}

/** glass globe pendant on a brass rod (add its PointLight in the set) */
function globePendant({ rod = 3.2, color = 0xfff0d6 } = {}) {
  const g = new THREE.Group();
  const b = brass();
  const r = K.cyl(0.02, 0.02, rod, b, 10);
  r.position.y = rod / 2;
  const cap = K.cyl(0.08, 0.16, 0.14, b, 24);
  cap.position.y = -0.02;
  const globe = K.ball(0.38, K.mat(0xfffaf0, { roughness: 0.25, clearcoat: 1, emissive: new THREE.Color(color), emissiveIntensity: 0.35 }), 32);
  globe.position.y = -0.42;
  globe.castShadow = false;
  const bulb = K.ball(0.09, K.glow(color), 16);
  bulb.position.y = -0.4;
  g.add(r, cap, globe, bulb);
  return g;
}

/** the morning sun through the window panes, laid on the floor (additive, soft edges) */
function windowLight({ w = 4, d = 2.4, cols = 3, rows = 2, color = 0xffe3b6, strength = 0.4 } = {}) {
  const tex = K.canvasTex(512, 320, (c, W, H) => {
    c.filter = "blur(7px)";
    c.fillStyle = "#ffffff";
    const pw = (W - 40) / cols, ph = (H - 40) / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) c.fillRect(20 + i * pw + 5, 20 + j * ph + 5, pw - 10, ph - 10);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), K.glow(color, { map: tex, transparent: true, opacity: strength,
    blending: THREE.AdditiveBlending, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

/** a long woven runner rug: cream, thin green and terracotta borders, a little fringe */
function runner({ w = 6.2, d = 1.5 } = {}) {
  const tex = K.canvasTex(1024, 256, (c, W, H) => {
    c.fillStyle = "#ece2d2";
    c.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 3) { // the weave
      c.fillStyle = `rgba(120, 96, 70, ${0.05 + (y % 9 === 0 ? 0.06 : 0)})`;
      c.fillRect(0, y, W, 1);
    }
    c.strokeStyle = "#2f4b40";
    c.lineWidth = 10;
    c.strokeRect(34, 30, W - 68, H - 60);
    c.strokeStyle = "#c8643a";
    c.lineWidth = 4;
    c.strokeRect(54, 48, W - 108, H - 96);
    c.fillStyle = "#c8643a";
    for (let x = 120; x < W - 100; x += 90) {
      c.beginPath();
      c.moveTo(x, H / 2 - 22); c.lineTo(x + 22, H / 2); c.lineTo(x, H / 2 + 22); c.lineTo(x - 22, H / 2);
      c.fill();
    }
    c.fillStyle = "#e3d7c3";
    for (let y = 8; y < H - 8; y += 10) { c.fillRect(0, y, 18, 4); c.fillRect(W - 18, y, 18, 4); }
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), K.mat(0xffffff, { map: tex, roughness: 1, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.015;
  m.receiveShadow = true;
  return m;
}

function stool() { // a bar stool (unused in the reel7 framing, kept for another angle)
  const g = new THREE.Group();
  const seat = K.cyl(0.42, 0.4, 0.14, K.mat(0xffffff, { map: K.woodTex({ base: "#c79a68", planks: 3, seed: 14 }), roughness: 0.45, clearcoat: 0.4 }), 32);
  seat.position.y = 1.3;
  g.add(seat);
  const black = K.mat(0x17171a, { roughness: 0.4, metalness: 0.5 });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const leg = K.cyl(0.03, 0.035, 1.34, black, 10);
    leg.position.set(Math.cos(a) * 0.26, 0.64, Math.sin(a) * 0.26);
    leg.rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12);
    g.add(leg);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 8, 32), black);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.45;
  g.add(ring);
  return g;
}

export async function build({ renderer, scene, mood = "morning" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;
  scene.background = new THREE.Color(0xe9e3da);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 18, h: 11, d: 18, backZ: BACK, wall: "#ece6dc", floor: "#cfa77a", baseboard: false }));
  const marble = marbleTex();

  // ---- the back wall: tiles, the counter run, the window, the shelves
  const tiles = new THREE.Mesh(new THREE.PlaneGeometry(14, 4.6), K.mat(0xffffff, { map: tileTex(), roughness: 0.25, clearcoat: 0.6 }));
  tiles.material.map.wrapS = tiles.material.map.wrapT = THREE.RepeatWrapping;
  tiles.material.map.repeat.set(14 / 1.6, 4.6 / 1.6);
  tiles.position.set(0, TOP + 2.3, BACK + 0.01);
  tiles.receiveShadow = true;
  const run = cabinetRun({ w: 13, d: 1.25, n: 8, marble });
  K.at(run, 0, 0, BACK + 0.62);
  set.add(tiles, run);

  const win = K.cityWindow({ w: 3.9, h: 3.0, view: gardenView, blinds: 0, panes: [3, 2], frame: 0x1c1d1f, bright: 1.0 });
  K.at(win, 2.35, 4.75, BACK + 0.03);
  const winGlow = K.wallGlow({ w: 8, h: 6, color: "#fff0cf", strength: 0.38 });
  K.at(winGlow, 2.35, 4.6, BACK + 0.07);
  const tap = faucet();
  K.at(tap, 2.35, TOP, BACK + 0.32);
  const herbs = [0, 1, 2].map((i) => {
    const p = K.plant({ h: 0.7, pot: [0xe9e3da, 0xd06a3a, 0xe9e3da][i], n: 7, seed: 40 + i });
    p.scale.setScalar(0.42);
    K.at(p, 1.2 + i * 0.55, 3.26, BACK + 0.18);
    return p;
  });
  set.add(win, winGlow, tap, ...herbs);

  const coffee = espresso();
  K.at(coffee, -2.55, TOP, BACK + 0.6);
  const grind = grinder();
  K.at(grind, -1.6, TOP, BACK + 0.55, -0.2);
  set.add(coffee, grind);

  const shelf1 = openShelf(3.6), shelf2 = openShelf(3.6);
  K.at(shelf1, -2.1, 4.35, BACK + 0.3);
  K.at(shelf2, -2.1, 5.55, BACK + 0.3);
  const pl1 = plates(6);
  pl1.position.set(-3.3, 4.4, BACK + 0.3);
  const j1 = jar(0xe8c25a, 0.55), j2 = jar(0x5a3a22, 0.45), j3 = jar(0xe6dccb, 0.5);
  j1.position.set(-2.3, 4.4, BACK + 0.3);
  j2.position.set(-1.9, 4.4, BACK + 0.3);
  j3.position.set(-1.5, 4.4, BACK + 0.3);
  const juicer = K.box(1.0, 0.8, 0.5, 0.02, [0, 0, 0, 0, 0, 0].map((_, i) => i === 4
    ? K.mat(0xffffff, { map: K.canvasTex(512, 410, boxArt), roughness: 0.8 }) : K.mat(0xd9c7a6, { roughness: 0.85 })));
  juicer.position.set(-2.95, 5.6 + 0.4, BACK + 0.3);
  juicer.rotation.y = 0.12;
  const books = new THREE.Group();
  [0x2f4b40, 0xff611d, 0xe8dfd2, 0x1f2937].forEach((col, i) => {
    const b = K.box(0.13, 0.62 - i * 0.04, 0.42, 0.01, K.mat(col, { roughness: 0.7 }));
    b.position.set(i * 0.15, 0.31 - i * 0.02, 0);
    books.add(b);
  });
  books.position.set(-1.9, 5.6, BACK + 0.3);
  const cup2 = K.mug(0xf4f0e8, 0xff611d);
  cup2.position.set(-1.0, 5.6, BACK + 0.3);
  set.add(shelf1, shelf2, pl1, j1, j2, j3, juicer, books, cup2);

  // a tall fiddle leaf at the far right, on the floor
  const tall = K.plant({ h: 3.4, pot: 0xe9e3da, n: 11, seed: 23 });
  K.at(tall, 5.5, 0, -2.2);
  set.add(tall);

  // ---- the island: green shaker base, marble top; the blender, his smoothie, the fruit bowl, the board
  const island = cabinetRun({ w: 6.6, d: 1.7, n: 4, marble, overhang: 0.14 });
  K.at(island, 0.15, 0, 0.15);
  const bl = blender();
  K.at(bl, -2.25, TOP, 0.05, 0.3);
  const glassS = smoothieGlass();
  K.at(glassS, -0.15, TOP, 0.55);
  const bowl = fruitBowl();
  K.at(bowl, 3.0, TOP, -0.45, 0.4);
  const board = cuttingBoard();
  K.at(board, -1.2, TOP, 0.5, 0.15);
  set.add(island, bl, glassS, bowl, board);

  // the two globe pendants over the island
  const pend1 = globePendant({ rod: 3.0 }), pend2 = globePendant({ rod: 3.0 });
  K.at(pend1, -1.5, 8.0, 0.1);
  K.at(pend2, 1.9, 8.0, 0.1);
  set.add(pend1, pend2);

  // the morning sun: on the island, on the floor, through the air
  const sunIsland = K.sunPatch({ w: 3.2, d: 1.4, color: 0xffe2b0, strength: 0.32 });
  sunIsland.position.set(0.9, TOP + 0.012, 0.25);
  sunIsland.rotation.z = 0.5;
  const patch = K.sunPatch({ w: 4.2, d: 2.6, color: 0xffdcae, strength: 0.32 });
  patch.position.set(1.8, 0.02, 2.2);
  patch.rotation.z = 0.45;
  const rug = runner();
  rug.position.set(0.2, 0.015, 2.35);
  const panes = windowLight({ w: 4.6, d: 2.6, strength: 0.34 });
  panes.position.set(-0.6, 0.03, 3.1);
  panes.rotation.z = 0.32;
  set.add(rug, panes);
  const shaft = K.lightShaft({ w: 3.0, h: 6.0, color: 0xffeccc, strength: 0.1 });
  shaft.position.set(1.8, 3.4, -1.6);
  shaft.rotation.set(-0.55, 0, 0.32);
  set.add(sunIsland, patch, shaft);

  // ---- lights: a bright morning. The low sun behind the window is the warm rim (long shadows across the marble),
  // a cool sky fill, a soft front key for the faces; the two globes add a warm practical touch.
  set.add(new THREE.HemisphereLight(0xeaf4ff, 0x8a7560, 1.2));
  const key = new THREE.DirectionalLight(0xfff6ee, 1.5);
  key.position.set(-3, 9, 10);
  key.target.position.set(0.3, 2.4, -1.2);
  const rim = new THREE.DirectionalLight(0xffd6a0, 2.6);
  rim.position.set(7, 7.5, -9);
  rim.target.position.set(0.3, 1.5, 0);
  rim.castShadow = true;
  rim.shadow.mapSize.set(2048, 2048);
  rim.shadow.radius = 8;
  rim.shadow.bias = -0.0005;
  Object.assign(rim.shadow.camera, { left: -9, right: 9, top: 9, bottom: -5, near: 1, far: 34 });
  set.add(key, key.target, rim, rim.target);
  const pl = (color, intensity, x, y, z, distance = 6) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lights = {
    pend1: pl(0xffe2b8, 4, -1.5, 7.3, 0.1, 6),
    pend2: pl(0xffe2b8, 4, 1.9, 7.3, 0.1, 6),
    window: pl(0xfff0d6, 5, 2.35, 4.6, BACK + 1.2, 7),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(-0.85, 4.45, -1.2);
  const settyFace = new THREE.Vector3(1.85, TOP + 1.25, -0.05);
  return {
    key, rim, lights, root: set,
    coach: { x: -0.85, y: 0, z: -1.35, turn: 0.18, phone: 1 },
    setty: { x: 1.85, y: TOP - 0.3, z: -0.05, turn: -0.3, scale: 0.62 },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.36, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.3, pitch: 0.08, y: 800 },
    },
    shots: {
      wide: { pos: [0.2, 3.7, 12.8], at: [0.2, 2.7, -1.2], fov: 46 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.36, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.3, pitch: 0.08, y: 800 }),
      // inserts for the gags: the juicer still in its box (line 9), his green smoothie (line 15)
      juicer: K.shot(new THREE.Vector3(-2.95, 6.0, BACK + 0.3), { dist: 6.5, yaw: 0.2, pitch: -0.12, y: 760 }),
      smoothie: K.shot(new THREE.Vector3(-0.15, TOP + 0.3, 0.55), { dist: 3.4, yaw: 0.1, pitch: 0.16, y: 860 }),
    },
  };
}
