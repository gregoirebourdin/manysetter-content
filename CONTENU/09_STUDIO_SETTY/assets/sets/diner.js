// Set "diner": an American diner at 1 a.m. (reel20, the hot lead). A long teal vinyl banquette under a window on a wet
// night street (a pink "MOTEL" neon and a teal "VACANCY" across the road, a street lamp, a traffic light, rain on the
// glass), a stainless pillar with a wall clock at 1:04, a red "EAT" neon hanging in the window, chrome pendants, a black
// and cream checker floor. He sits on the banquette behind a cream formica table, phone in hand, behind the order he could
// not resist (pancakes, fries, a milkshake, a coffee) and a paper bag "TO GO": tomorrow's burger (the joke of the reel:
// he is the hungry guy from the study). Setty sits on the table next to the napkin dispenser. No orange behind Setty: his
// side of the room is teal, chrome and the cool street.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
// The diner pieces (banquette, formica table, food, to-go bag, clock, window strip) live here: no other set uses them yet.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4; // the window wall
const SEAT = 0.66; // top of the banquette cushion
const TOP = 1.45; // top of the table
const WIN = { y0: 3.0, y1: 5.75, x0: -5.4, x1: 5.2 }; // the window strip (world units)
const TEAL = 0x2f9e98;
const chrome = () => K.mat(0xd3d7de, { roughness: 0.22, metalness: 1 });
const steel = () => K.mat(0xaab0b8, { roughness: 0.38, metalness: 0.9 });
const china = () => K.mat(0xf6f3ee, { roughness: 0.2, clearcoat: 0.8 });
const vinyl = (color = TEAL) => K.mat(color, { roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.25, sheen: 0.3 });

// ---------------------------------------------------------------- textures

/** black and cream checker, laid on the diagonal (the texture is rotated 45° on the floor), worn a little */
function checkerTex({ a = "#ece6da", b = "#17181c", seed = 23 } = {}) {
  const R = K.rng(seed);
  const t = K.canvasTex(512, 512, (c, W, H) => {
    const s = W / 2;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      c.fillStyle = (i + j) % 2 ? b : a;
      c.fillRect(i * s, j * s, s, s);
    }
    for (let k = 0; k < 2600; k++) { // scuffs and grain
      c.fillStyle = `rgba(${R() < 0.5 ? "255,255,255" : "0,0,0"}, ${0.02 + R() * 0.05})`;
      c.fillRect(R() * W, R() * H, 1 + R() * 3, 1 + R() * 2);
    }
    c.strokeStyle = "rgba(30, 28, 26, 0.35)";
    c.lineWidth = 3;
    for (const v of [0, s, W]) {
      c.beginPath(); c.moveTo(v, 0); c.lineTo(v, H); c.stroke();
      c.beginPath(); c.moveTo(0, v); c.lineTo(W, v); c.stroke();
    }
  });
  t.center.set(0.5, 0.5);
  t.rotation = Math.PI / 4;
  return t;
}

/** cream formica with little red and teal boomerangs and a speckle */
function formicaTex(seed = 8) {
  const R = K.rng(seed);
  return K.canvasTex(1024, 512, (c, W, H) => {
    c.fillStyle = "#f1e9d8";
    c.fillRect(0, 0, W, H);
    for (let k = 0; k < 900; k++) {
      c.fillStyle = `rgba(90, 80, 70, ${0.06 + R() * 0.1})`;
      c.fillRect(R() * W, R() * H, 2, 2);
    }
    const cols = ["rgba(214, 64, 70, 0.55)", "rgba(47, 158, 152, 0.55)", "rgba(40, 40, 46, 0.35)"];
    c.lineCap = "round";
    for (let k = 0; k < 46; k++) { // boomerangs: a bent stroke
      const x = R() * W, y = R() * H, a = R() * Math.PI * 2, L = 18 + R() * 16;
      c.strokeStyle = cols[k % 3];
      c.lineWidth = 6;
      c.beginPath();
      c.moveTo(x + Math.cos(a) * L, y + Math.sin(a) * L);
      c.lineTo(x, y);
      c.lineTo(x + Math.cos(a + 1.9) * L, y + Math.sin(a + 1.9) * L);
      c.stroke();
    }
  }, { repeat: [2, 1] });
}

/** stainless steel: fine vertical brushing */
function brushedTex(seed = 4) {
  const R = K.rng(seed);
  return K.canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = "#b9bec6";
    c.fillRect(0, 0, W, H);
    for (let k = 0; k < 700; k++) {
      c.fillStyle = `rgba(${R() < 0.5 ? "255,255,255" : "40,44,52"}, ${0.04 + R() * 0.08})`;
      c.fillRect(R() * W, 0, 1 + R() * 2, H);
    }
  }, { repeat: [3, 1] });
}

// ---------------------------------------------------------------- the street through the window

/** a wet street at 1 a.m., one panorama for the whole window strip: a motel with its pink "MOTEL" neon and a teal
 *  "VACANCY" (left, behind the coach), a closed laundromat, a cool street lamp, a parked car, a traffic light (right,
 *  behind Setty: nothing orange there), the neon reflected on the wet road, rain on the glass */
function street(c, W, H, R) {
  const sky = c.createLinearGradient(0, 0, 0, H * 0.6);
  sky.addColorStop(0, "#070a1a");
  sky.addColorStop(1, "#1d2142");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  const haze = c.createRadialGradient(W * 0.24, H * 0.45, 0, W * 0.24, H * 0.45, W * 0.22); // neon haze in the drizzle
  haze.addColorStop(0, "rgba(255, 79, 163, 0.28)");
  haze.addColorStop(1, "rgba(255, 79, 163, 0)");
  c.fillStyle = haze;
  c.fillRect(0, 0, W, H);

  const GROUND = H * 0.64;
  const lit = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  // far skyline: dark blocks, a few lit windows
  for (let x = -20; x < W; x += 60 + R() * 90) {
    const w = 70 + R() * 110, h = H * (0.18 + R() * 0.28);
    lit(x, GROUND - h, w, h, R() < 0.5 ? "#10142a" : "#151a33");
    for (let k = 0; k < 7; k++) if (R() < 0.55) lit(x + 8 + R() * (w - 20), GROUND - h + 10 + R() * (h - 30), 6, 8,
      R() < 0.7 ? "rgba(255, 214, 150, 0.7)" : "rgba(170, 210, 255, 0.7)");
  }
  // the motel: a long two-storey block, a walkway, doors under little lamps
  const mx = W * 0.06, mw = W * 0.34, mh = H * 0.26;
  lit(mx, GROUND - mh, mw, mh, "#1b2033");
  lit(mx, GROUND - mh * 0.5 - 6, mw, 6, "#2a3150");
  for (let k = 0; k < 9; k++) {
    const dx = mx + 20 + k * (mw - 40) / 9;
    for (const fy of [GROUND - mh + 14, GROUND - mh * 0.5 + 12]) {
      lit(dx, fy, 22, mh * 0.5 - 26, "#0f1222");
      c.fillStyle = "rgba(255, 226, 170, 0.85)";
      c.beginPath();
      c.arc(dx + 30, fy + 6, 3, 0, Math.PI * 2);
      c.fill();
    }
  }
  // the pole sign: MOTEL (pink script) over VACANCY (teal box), a bulb arrow
  const neonText = (txt, x, y, size, col, font = "italic 700") => {
    c.font = `${font} ${size}px Nohemi, Inter, sans-serif`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    for (const [blur, a] of [[40, 0.5], [18, 0.8]]) {
      c.shadowColor = col;
      c.shadowBlur = blur;
      c.globalAlpha = a;
      c.fillStyle = col;
      c.fillText(txt, x, y);
    }
    c.shadowBlur = 6;
    c.globalAlpha = 1;
    c.fillStyle = "#ffeaf4";
    c.fillText(txt, x, y);
    c.shadowBlur = 0;
  };
  const px = W * 0.23;
  lit(px - 5, H * 0.3, 10, GROUND - H * 0.3, "#0d0f1b");
  c.fillStyle = "#151a2e";
  c.beginPath();
  c.roundRect(px - 120, H * 0.13, 240, 92, 18);
  c.fill();
  neonText("Motel", px, H * 0.13 + 46, 74, "#ff4fa3");
  c.fillStyle = "#11172a";
  c.fillRect(px - 92, H * 0.13 + 104, 184, 42);
  c.strokeStyle = "rgba(46, 230, 214, 0.9)";
  c.lineWidth = 3;
  c.strokeRect(px - 92, H * 0.13 + 104, 184, 42);
  neonText("VACANCY", px, H * 0.13 + 126, 30, "#2ee6d6", "800");
  for (let k = 0; k < 9; k++) { // the bulb arrow pointing down to the lot
    c.fillStyle = "rgba(255, 240, 200, 0.95)";
    c.shadowColor = "#fff0c8";
    c.shadowBlur = 10;
    c.beginPath();
    c.arc(px + 140 + Math.sin(k * 0.5) * 12, H * 0.14 + k * 15, 4, 0, Math.PI * 2);
    c.fill();
  }
  c.shadowBlur = 0;

  // the laundromat (cool light) and a dark lot
  const lx = W * 0.58, lw = W * 0.16, lh = H * 0.2;
  lit(lx, GROUND - lh, lw, lh, "#151b2c");
  const inside = c.createLinearGradient(0, GROUND - lh * 0.75, 0, GROUND);
  inside.addColorStop(0, "#cfe2ff");
  inside.addColorStop(1, "#8fb2e8");
  c.fillStyle = inside;
  c.fillRect(lx + 14, GROUND - lh * 0.72, lw - 28, lh * 0.72 - 6);
  for (let k = 0; k < 6; k++) { // the machines: round doors
    c.fillStyle = "rgba(30, 40, 60, 0.85)";
    c.beginPath();
    c.arc(lx + 34 + k * (lw - 60) / 5, GROUND - lh * 0.28, 13, 0, Math.PI * 2);
    c.fill();
  }
  neonText("LAUNDRY", lx + lw / 2, GROUND - lh * 0.88, 26, "#9fd2ff", "800");

  // our sidewalk side: a street lamp (cool LED), a traffic light on green, a parked car with red tail lights
  const sl = W * 0.69;
  lit(sl - 4, H * 0.16, 8, H, "#0b0d16");
  lit(sl - 4, H * 0.16, 70, 7, "#0b0d16");
  const cone = c.createRadialGradient(sl + 62, H * 0.2, 0, sl + 62, H * 0.2, H * 0.55);
  cone.addColorStop(0, "rgba(210, 232, 255, 0.55)");
  cone.addColorStop(1, "rgba(210, 232, 255, 0)");
  c.fillStyle = cone;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#eaf4ff";
  c.fillRect(sl + 46, H * 0.19, 34, 6);
  const tl = W * 0.92;
  lit(tl - 3, H * 0.22, 6, H, "#0b0d16");
  c.fillStyle = "#0d0f18";
  c.beginPath();
  c.roundRect(tl - 16, H * 0.22, 32, 86, 6);
  c.fill();
  for (const [k, col] of [[0, "#3a1418"], [1, "#2c2a12"], [2, "#3cff9a"]]) {
    c.fillStyle = col;
    if (k === 2) { c.shadowColor = col; c.shadowBlur = 18; }
    c.beginPath();
    c.arc(tl, H * 0.22 + 16 + k * 26, 9, 0, Math.PI * 2);
    c.fill();
    c.shadowBlur = 0;
  }
  const cx = W * 0.82, cy = GROUND + H * 0.1; // the car: a dark silhouette, two red tail lights
  c.fillStyle = "#0b0e18";
  c.beginPath();
  c.roundRect(cx - 120, cy - 44, 240, 44, 12);
  c.fill();
  c.beginPath();
  c.roundRect(cx - 70, cy - 78, 150, 40, [20, 26, 4, 4]);
  c.fill();
  for (const tx of [cx - 112, cx + 98]) {
    c.fillStyle = "#ff3048";
    c.shadowColor = "#ff3048";
    c.shadowBlur = 14;
    c.fillRect(tx, cy - 36, 14, 8);
    c.shadowBlur = 0;
  }

  // the wet road: dark asphalt, the neon smeared in long vertical reflections, the far curb
  lit(0, GROUND, W, H * 0.03, "#22263a");
  const road = c.createLinearGradient(0, GROUND + H * 0.03, 0, H);
  road.addColorStop(0, "#0e1120");
  road.addColorStop(1, "#06070d");
  c.fillStyle = road;
  c.fillRect(0, GROUND + H * 0.03, W, H);
  const smear = (x, w, col, a) => {
    const g = c.createLinearGradient(0, GROUND + H * 0.03, 0, H);
    g.addColorStop(0, col.replace("A", a));
    g.addColorStop(1, col.replace("A", "0"));
    c.fillStyle = g;
    c.fillRect(x - w / 2, GROUND + H * 0.03, w, H);
  };
  smear(px, 120, "rgba(255, 79, 163, A)", 0.45);
  smear(px, 70, "rgba(46, 230, 214, A)", 0.3);
  smear(lx + lw / 2, 140, "rgba(160, 200, 255, A)", 0.28);
  smear(sl + 62, 60, "rgba(220, 236, 255, A)", 0.35);
  smear(tl, 22, "rgba(60, 255, 154, A)", 0.35);
  smear(cx - 105, 16, "rgba(255, 48, 72, A)", 0.4);
  smear(cx + 105, 16, "rgba(255, 48, 72, A)", 0.4);
  c.fillStyle = "rgba(200, 210, 240, 0.08)"; // the lane line, barely there in the rain
  for (let x = 20; x < W; x += 110) c.fillRect(x, GROUND + H * 0.17, 56, 4);

  // rain on the glass: beads with a highlight, a few runs
  for (let k = 0; k < 340; k++) {
    const x = R() * W, y = R() * H, r = 1.2 + R() * 3.2;
    c.fillStyle = `rgba(190, 210, 255, ${0.12 + R() * 0.16})`;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "rgba(255, 255, 255, 0.5)";
    c.fillRect(x - r * 0.4, y - r * 0.5, 1.2, 1.2);
  }
  c.strokeStyle = "rgba(200, 220, 255, 0.16)";
  c.lineWidth = 1.6;
  for (let k = 0; k < 46; k++) {
    const x = R() * W, y = R() * H * 0.8, L = 30 + R() * 90;
    c.beginPath();
    c.moveTo(x, y);
    c.bezierCurveTo(x + 3, y + L * 0.3, x - 3, y + L * 0.6, x + 1, y + L);
    c.stroke();
  }
}

/** the window strip on the back wall: one street panorama, each pane shows its own slice; chrome frames and mullions.
 *  `panes`: [[x0, x1, mullions], …] in world x; the panorama spans WIN.x0 → WIN.x1. */
function windowStrip(panes) {
  const span = WIN.x1 - WIN.x0, h = WIN.y1 - WIN.y0;
  const pano = K.canvasTex(2560, Math.round((2560 * h) / span), (c, W, H) => street(c, W, H, K.rng(61)));
  const g = new THREE.Group();
  const fm = chrome();
  for (const [x0, x1, mull] of panes) {
    const w = x1 - x0, tex = pano.clone();
    tex.needsUpdate = true;
    tex.repeat.set(w / span, 1);
    tex.offset.set((x0 - WIN.x0) / span, 0);
    const v = new THREE.Mesh(new THREE.PlaneGeometry(w, h), K.glow(0xffffff, { map: tex }));
    v.material.color.setScalar(0.92);
    v.position.set((x0 + x1) / 2, (WIN.y0 + WIN.y1) / 2, BACK + 0.012);
    g.add(v);
    const bars = [[(x0 + x1) / 2, WIN.y1, w + 0.14, 0.09], [(x0 + x1) / 2, WIN.y0, w + 0.14, 0.09], [x0, (WIN.y0 + WIN.y1) / 2, 0.09, h],
      [x1, (WIN.y0 + WIN.y1) / 2, 0.09, h]];
    for (let i = 1; i <= mull; i++) bars.push([x0 + (i * w) / (mull + 1), (WIN.y0 + WIN.y1) / 2, 0.05, h]);
    for (const [x, y, bw, bh] of bars) {
      const b = K.box(bw, bh, 0.1, 0.012, fm, false);
      b.position.set(x, y, BACK + 0.05);
      g.add(b);
    }
  }
  return g;
}

// ---------------------------------------------------------------- furniture

/** the long banquette under the window: teal channel-tufted rolls on a stainless back panel, a chrome cap, a long
 *  cushion, a recessed stainless base. Its cushion top is at SEAT; the rolls' front face is at z ≈ -2.8. */
function banquette({ x0 = -6, x1 = 6 } = {}) {
  const g = new THREE.Group();
  const L = x1 - x0, cx = (x0 + x1) / 2;
  const panel = K.box(L, 2.75, 0.12, 0.01, K.mat(0xffffff, { map: brushedTex(), roughness: 0.4, metalness: 0.8 }), false);
  panel.position.set(cx, 1.375, BACK + 0.08);
  const base = K.box(L, 0.38, 1.15, 0.02, K.mat(0xffffff, { map: brushedTex(9), roughness: 0.4, metalness: 0.8 }));
  base.position.set(cx, 0.19, -2.6);
  const kick = K.box(L, 0.06, 0.04, 0.01, chrome(), false);
  kick.position.set(cx, 0.06, -2.02);
  const cushion = K.soft(L, 0.3, 1.08, vinyl(), { P: 4, puff: 0.12, wrinkle: 0.008, seed: 3 });
  cushion.position.set(cx, SEAT - 0.15, -2.3);
  const welt = K.cyl(0.025, 0.025, L, K.mat(0x23807b, { roughness: 0.4 }), 10); // the piping along the cushion's nose
  welt.rotation.z = Math.PI / 2;
  welt.position.set(cx, SEAT - 0.05, -1.77);
  g.add(panel, base, kick, cushion, welt);
  const n = Math.round(L / 0.44), rw = L / n;
  for (let i = 0; i < n; i++) {
    const roll = K.soft(rw * 1.02, 1.9, 0.42, vinyl(i % 2 ? TEAL : 0x2c968f), { P: 3.4, puff: 0.18, seed: 10 + (i % 5) });
    roll.position.set(x0 + rw * (i + 0.5), SEAT + 1.0, -3.02);
    roll.rotation.x = -0.06;
    g.add(roll);
  }
  const cap = K.box(L, 0.1, 0.5, 0.04, chrome(), false);
  cap.position.set(cx, SEAT + 2.02, -3.05);
  g.add(cap);
  return g;
}

/** a long formica table with a ribbed chrome edge, on two chrome pedestals (top at TOP) */
function dinerTable({ w = 4.2, d = 1.4, legs = [-1.5, 1.5] } = {}) {
  const g = new THREE.Group();
  const top = K.box(w, 0.07, d, 0.02, K.mat(0xffffff, { map: formicaTex(), roughness: 0.32, clearcoat: 0.6 }));
  top.position.y = TOP - 0.035;
  const fm = chrome();
  const edge = (len, x, z, ry) => {
    for (const dy of [-0.025, 0.012]) { // two ribs = the ribbed aluminium band
      const r = K.cyl(0.028, 0.028, len, fm, 12);
      r.rotation.set(0, ry, Math.PI / 2);
      r.position.set(x, TOP - 0.045 + dy, z);
      g.add(r);
    }
  };
  edge(w + 0.04, 0, d / 2, 0);
  edge(w + 0.04, 0, -d / 2, 0);
  edge(d, w / 2, 0, Math.PI / 2);
  edge(d, -w / 2, 0, Math.PI / 2);
  g.add(top);
  for (const x of legs) {
    const col = K.cyl(0.07, 0.07, TOP - 0.1, fm, 24);
    col.position.set(x, (TOP - 0.1) / 2, 0);
    const foot = K.cyl(0.08, 0.4, 0.06, fm, 40);
    foot.position.set(x, 0.03, 0);
    const cup = K.cyl(0.28, 0.12, 0.06, fm, 32);
    cup.position.set(x, TOP - 0.1, 0);
    g.add(col, foot, cup);
  }
  return g;
}

// ---------------------------------------------------------------- the order

/** a stack of pancakes on a plate: butter pat, syrup on top and running down, a pool of syrup */
function pancakes() {
  const g = new THREE.Group();
  const plate = K.cyl(0.46, 0.4, 0.04, china(), 48);
  plate.position.y = 0.02;
  g.add(plate);
  const cake = K.mat(0xd6923f, { roughness: 0.6 }), cakeTop = K.mat(0xe5ad5e, { roughness: 0.55 });
  for (let k = 0; k < 4; k++) {
    const p = K.cyl(0.31 - k * 0.006, 0.31 - k * 0.006, 0.075, k === 3 ? cakeTop : cake, 40);
    p.position.set(Math.sin(k * 2.1) * 0.015, 0.075 + k * 0.074, Math.cos(k * 1.7) * 0.015);
    g.add(p);
  }
  const syrup = K.mat(0x6e3410, { roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.92 });
  const glaze = K.cyl(0.25, 0.27, 0.014, syrup, 40);
  glaze.position.y = 0.075 + 3 * 0.074 + 0.044;
  g.add(glaze);
  for (const a of [0.4, 1.9, 3.3, 4.8]) { // drips down the side
    const d = K.ball(0.035, syrup, 12);
    d.scale.set(1, 2.6, 1);
    d.position.set(Math.cos(a) * 0.305, 0.2 + (a % 1) * 0.06, Math.sin(a) * 0.305);
    g.add(d);
  }
  const pool = K.cyl(0.38, 0.38, 0.006, syrup, 40);
  pool.position.y = 0.043;
  const butter = K.box(0.13, 0.07, 0.11, 0.015, K.mat(0xffe9a3, { roughness: 0.35 }));
  butter.position.y = 0.075 + 3 * 0.074 + 0.08;
  butter.rotation.y = 0.5;
  g.add(pool, butter);
  return g;
}

/** fries in a red plastic basket on red and white checked paper */
function friesBasket() {
  const g = new THREE.Group();
  const red = K.mat(0xd12b2f, { roughness: 0.4, clearcoat: 0.5 });
  const base = K.box(0.62, 0.05, 0.42, 0.02, red);
  base.position.y = 0.025;
  g.add(base);
  for (const [w, d, x, z] of [[0.62, 0.04, 0, 0.21], [0.62, 0.04, 0, -0.21], [0.04, 0.42, 0.31, 0], [0.04, 0.42, -0.31, 0]]) {
    const wall = K.box(w, 0.14, d, 0.012, red, false);
    wall.position.set(x, 0.09, z);
    g.add(wall);
  }
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), K.mat(0xffffff, { roughness: 0.9, map: K.canvasTex(128, 128, (c, W) => {
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { c.fillStyle = (i + j) % 2 ? "#d33" : "#fff"; c.fillRect(i * W / 8, j * W / 8, W / 8, W / 8); }
  }) }));
  paper.rotation.x = -Math.PI / 2;
  paper.position.y = 0.052;
  g.add(paper);
  const fry = K.mat(0xf1c04e, { roughness: 0.55 });
  const R = K.rng(19);
  for (let k = 0; k < 26; k++) {
    const f = K.box(0.04, 0.04, 0.26 + R() * 0.12, 0.01, fry, false);
    f.position.set((R() - 0.5) * 0.44, 0.08 + R() * 0.12, (R() - 0.5) * 0.26);
    f.rotation.set((R() - 0.5) * 0.9, R() * Math.PI, (R() - 0.5) * 0.6);
    g.add(f);
  }
  return g;
}

/** a tall strawberry milkshake: flared glass, whipped cream, a cherry, a striped straw */
function milkshake() {
  const g = new THREE.Group();
  const prof = [[0, 0], [0.13, 0], [0.13, 0.03], [0.06, 0.06], [0.06, 0.16], [0.11, 0.2], [0.16, 0.66], [0.17, 0.7]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), K.mat(0xffffff, { roughness: 0.05, transmission: 0.9,
    transparent: true, opacity: 0.35, thickness: 0.1, side: THREE.DoubleSide }));
  const shake = K.cyl(0.15, 0.1, 0.48, K.mat(0xf3a6bf, { roughness: 0.5 }), 32);
  shake.position.y = 0.43;
  const cream = K.mat(0xfffaf2, { roughness: 0.6 });
  g.add(glass, shake);
  [[0, 0.72, 0, 0.15], [0.05, 0.82, 0.02, 0.11], [-0.02, 0.9, -0.01, 0.08]].forEach(([x, y, z, r]) => {
    const b = K.ball(r, cream, 20);
    b.position.set(x, y, z);
    g.add(b);
  });
  const cherry = K.ball(0.05, K.mat(0xc8102e, { roughness: 0.15, clearcoat: 1 }), 16);
  cherry.position.set(-0.01, 0.99, 0);
  const stem = K.cyl(0.006, 0.006, 0.1, K.mat(0x5a3a1a), 6);
  stem.position.set(0.0, 1.06, 0);
  stem.rotation.z = -0.3;
  const straw = K.cyl(0.018, 0.018, 0.75, K.mat(0xffffff, { roughness: 0.4, map: K.canvasTex(64, 256, (c, W, H) => {
    c.fillStyle = "#fff";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#e23b4a";
    for (let y = -W; y < H; y += 36) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + W); c.lineTo(W, y + W + 14); c.lineTo(0, y + 14); c.fill(); }
  }) }), 12);
  straw.position.set(0.07, 0.95, -0.02);
  straw.rotation.z = -0.22;
  g.add(cherry, stem, straw);
  return g;
}

/** a kraft paper bag "TO GO", top folded twice, a receipt stapled on: tomorrow's burger (the joke of the set) */
function toGoBag() {
  const g = new THREE.Group();
  const w = 0.46, h = 0.56, d = 0.3;
  const front = K.canvasTex(256, 320, (c, W, H) => {
    c.fillStyle = "#b98a58";
    c.fillRect(0, 0, W, H);
    const R = K.rng(31);
    for (let k = 0; k < 500; k++) { c.fillStyle = `rgba(80, 50, 20, ${0.04 + R() * 0.06})`; c.fillRect(R() * W, R() * H, 1 + R() * 6, 1); }
    c.fillStyle = "#c2272d";
    c.font = "900 64px Inter, sans-serif";
    c.textAlign = "center";
    c.fillText("TO GO", W / 2, H * 0.42);
    c.font = "600 22px Inter, sans-serif";
    c.fillText("THANK YOU!", W / 2, H * 0.53);
    c.fillStyle = "#fbfaf6"; // the stapled receipt
    c.fillRect(W * 0.5, H * 0.6, W * 0.4, H * 0.36);
    c.fillStyle = "#333";
    c.font = "600 15px Inter, sans-serif";
    c.textAlign = "left";
    ["1 CHEESEBURGER", "TO GO", "1:02 AM"].forEach((l, k) => c.fillText(l, W * 0.53, H * 0.67 + k * 22));
    c.fillStyle = "#888";
    c.fillRect(W * 0.66, H * 0.605, 20, 4);
  });
  const paper = K.mat(0xb98a58, { roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [paper, paper, paper, paper, K.mat(0xffffff, { map: front, roughness: 0.9 }), paper]);
  body.castShadow = body.receiveShadow = true;
  body.position.y = h / 2;
  const fold = K.box(w, 0.06, d * 0.9, 0.01, K.mat(0xa97b4b, { roughness: 0.9 }));
  fold.position.set(0, h + 0.02, 0.02);
  fold.rotation.x = 0.25;
  g.add(body, fold);
  return g;
}

/** a chrome napkin dispenser */
function napkins() {
  const g = new THREE.Group();
  const box = K.box(0.3, 0.32, 0.2, 0.03, chrome());
  box.position.y = 0.16;
  const tissue = K.box(0.2, 0.2, 0.01, 0.005, K.mat(0xffffff, { roughness: 0.9 }), false);
  tissue.position.set(0, 0.17, 0.103);
  g.add(box, tissue);
  return g;
}

/** a squeeze bottle (ketchup red, mustard yellow) */
function squeeze(color) {
  const g = new THREE.Group();
  const m = K.mat(color, { roughness: 0.3, clearcoat: 0.6 });
  const b = K.cyl(0.075, 0.08, 0.36, m, 24);
  b.position.y = 0.18;
  const cap = K.cyl(0.05, 0.075, 0.07, m, 24);
  cap.position.y = 0.395;
  const tip = K.cyl(0.008, 0.03, 0.09, m, 12);
  tip.position.y = 0.475;
  g.add(b, cap, tip);
  return g;
}

/** a glass sugar pourer with a chrome top */
function sugar() {
  const g = new THREE.Group();
  const glass = K.cyl(0.08, 0.09, 0.22, K.mat(0xffffff, { roughness: 0.05, transmission: 0.85, transparent: true, opacity: 0.4 }), 24);
  glass.position.y = 0.11;
  const fill = K.cyl(0.07, 0.08, 0.12, K.mat(0xfbfaf5, { roughness: 0.9 }), 20);
  fill.position.y = 0.07;
  const top = K.cyl(0.03, 0.085, 0.09, chrome(), 24);
  top.position.y = 0.265;
  g.add(fill, glass, top);
  return g;
}

/** the wall clock: chrome ring, white face, hands at 1:04 (the time in the script) */
function wallClock({ r = 0.4 } = {}) {
  const face = K.canvasTex(512, 512, (c, W) => {
    const m = W / 2;
    c.fillStyle = "#fbfaf6";
    c.beginPath();
    c.arc(m, m, m, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#16171b";
    for (let k = 0; k < 60; k++) {
      const a = (k / 60) * Math.PI * 2, big = k % 5 === 0;
      c.save();
      c.translate(m, m);
      c.rotate(a);
      c.fillRect(-(big ? 6 : 2), -m + 22, big ? 12 : 4, big ? 40 : 18);
      c.restore();
    }
    c.font = "800 64px Inter, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    [[12, 0], [3, 1], [6, 2], [9, 3]].forEach(([n, k]) => {
      const a = (k / 4) * Math.PI * 2;
      c.fillText(String(n), m + Math.sin(a) * (m - 110), m - Math.cos(a) * (m - 110));
    });
    const hand = (a, len, wd, col) => {
      c.save();
      c.translate(m, m);
      c.rotate(a);
      c.fillStyle = col;
      c.beginPath();
      c.roundRect(-wd / 2, -len, wd, len + 26, wd / 2);
      c.fill();
      c.restore();
    };
    hand(((1 + 4 / 60) / 12) * Math.PI * 2, m * 0.5, 18, "#16171b"); // 1:04
    hand((4 / 60) * Math.PI * 2, m * 0.78, 12, "#16171b");
    hand((38 / 60) * Math.PI * 2, m * 0.82, 4, "#d6363c");
    c.fillStyle = "#d6363c";
    c.beginPath();
    c.arc(m, m, 14, 0, Math.PI * 2);
    c.fill();
  });
  const g = new THREE.Group();
  const ring = K.cyl(r + 0.06, r + 0.06, 0.1, chrome(), 64);
  ring.rotation.x = Math.PI / 2;
  const dial = new THREE.Mesh(new THREE.CircleGeometry(r, 64), K.mat(0xffffff, { map: face, roughness: 0.4 }));
  dial.position.z = 0.052;
  const glass = new THREE.Mesh(new THREE.CircleGeometry(r, 64), K.mat(0xffffff, { roughness: 0.02, transparent: true, opacity: 0.08, clearcoat: 1 }));
  glass.position.z = 0.07;
  g.add(ring, dial, glass);
  return g;
}

/** a chrome dome pendant (add its PointLight in the set) */
function domePendant({ cord = 2.4, color = 0xffe0b4 } = {}) {
  const g = new THREE.Group();
  const c = K.cyl(0.012, 0.012, cord, K.mat(0x1a1a1a), 6);
  c.position.y = cord / 2;
  const shade = new THREE.Mesh(new THREE.SphereGeometry(0.42, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), K.mat(0xd8dde4, {
    roughness: 0.18, metalness: 1, side: THREE.DoubleSide }));
  shade.scale.y = 0.75;
  shade.position.y = -0.3;
  const bulb = K.ball(0.13, K.glow(color), 20);
  bulb.position.y = -0.3;
  const lip = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.42, 40), K.glow(color, { transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  lip.rotation.x = Math.PI / 2;
  lip.position.y = -0.31;
  g.add(c, shade, bulb, lip);
  return g;
}

// ---------------------------------------------------------------- build

export async function build({ renderer, scene, mood = "night" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.4;
  scene.background = new THREE.Color(0x14151c);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 20, h: 11, d: 18, backZ: BACK, wall: "#ebe3d3", floorMap: checkerTex(), floorTile: 1.7,
    floorRough: 0.58, baseboard: false }));

  // ---- the window wall: the street strip, the stainless pillar with the clock, the bands above
  const strip = windowStrip([[WIN.x0, -0.95, 2], [-0.05, WIN.x1, 2]]);
  set.add(strip);
  const pillar = K.box(0.9, WIN.y1 - WIN.y0 + 0.2, 0.12, 0.01, K.mat(0xffffff, { map: brushedTex(12), roughness: 0.35, metalness: 0.85 }), false);
  K.at(pillar, -0.5, (WIN.y0 + WIN.y1) / 2, BACK + 0.06);
  const clock = wallClock({ r: 0.36 });
  K.at(clock, -0.5, 4.55, BACK + 0.14);
  const band = K.box(20, 0.2, 0.06, 0.01, K.mat(TEAL, { roughness: 0.4, clearcoat: 0.5 }), false);
  K.at(band, 0, WIN.y1 + 0.32, BACK + 0.04);
  const trim = K.box(20, 0.05, 0.08, 0.01, chrome(), false);
  K.at(trim, 0, WIN.y1 + 0.47, BACK + 0.05);
  set.add(pillar, clock, band, trim);

  // the red EAT neon hanging in the left window (faces in), on two thin chains
  const eat = K.neonSign("EAT", { color: "#ff2f45", w: 1.5, h: 0.56, font: "800 240px 'Nohemi', Inter, sans-serif" });
  K.at(eat, -3.35, 5.05, BACK + 0.3);
  for (const sx of [-0.5, 0.5]) {
    const ch = K.cyl(0.006, 0.006, 0.55, K.mat(0x9aa0a8, { metalness: 1, roughness: 0.3 }), 6);
    ch.position.set(-3.35 + sx, 5.6, BACK + 0.3);
    set.add(ch);
  }
  const eatWash = K.wallGlow({ w: 3.0, h: 1.8, color: "#ff2f45", strength: 0.35 });
  K.at(eatWash, -3.35, 5.05, BACK + 0.2);
  set.add(eat, eatWash);

  // ---- the banquette, his table and the order, a second table for depth
  set.add(banquette({ x0: -6.2, x1: 6.2 }));
  const table = dinerTable({ w: 4.2, d: 1.4, legs: [-1.6, 1.25] });
  K.at(table, -0.35, 0, -1.15);
  const cakes = pancakes();
  K.at(cakes, -1.45, TOP, -1.15);
  const fries = friesBasket();
  K.at(fries, -0.55, TOP, -1.2, 0.25);
  const shake = milkshake();
  K.at(shake, -2.25, TOP, -1.45);
  const cup = K.mug(0xf4f1ea, TEAL);
  cup.scale.setScalar(1.45);
  K.at(cup, -0.55, TOP, -0.68, 2.4);
  const bag = toGoBag();
  K.at(bag, -0.05, TOP, -1.62, -0.25);
  const nap = napkins();
  K.at(nap, 0.62, TOP, -1.66, -0.15);
  const ketchup = squeeze(0xc8202a);
  K.at(ketchup, 1.42, TOP, -1.6);
  const mustard = squeeze(0xf2c230);
  K.at(mustard, 1.58, TOP, -1.4);
  const check = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.34), K.mat(0xfbf7ea, { roughness: 0.9 })); // the check, face down
  check.rotation.set(-Math.PI / 2, 0, 0.4);
  check.position.set(-0.85, TOP + 0.004, -0.62);
  set.add(table, cakes, fries, shake, cup, bag, nap, ketchup, mustard, check);
  const table2 = dinerTable({ w: 2.0, d: 1.4, legs: [0] });
  K.at(table2, 4.35, 0, -1.15);
  const nap2 = napkins();
  K.at(nap2, 4.05, TOP, -1.55, 0.2);
  const sug = sugar();
  K.at(sug, 4.5, TOP, -1.5);
  const ket2 = squeeze(0xc8202a);
  K.at(ket2, 4.75, TOP, -1.62);
  set.add(table2, nap2, sug, ket2);

  // chrome dome pendants over the tables
  const PX = [-1.35, 1.0, 4.35];
  for (const x of PX) {
    const p = domePendant({ cord: 3 });
    K.at(p, x, 7.45, -1.15);
    set.add(p);
  }

  // ---- lights: night in a bright diner. The ceiling light is the key (it casts the shadows back onto the banquette),
  // a cool rim from the street through the glass, warm pendants over the tables; the neon outside (pink, teal) and the
  // red EAT add colour on the window side. Nothing orange on Setty's side.
  set.add(new THREE.HemisphereLight(0xeef0ff, 0x2a2228, 1.15));
  const key = new THREE.DirectionalLight(0xfff3e4, 1.7);
  key.position.set(-2.5, 11, 8);
  key.target.position.set(0, 1.8, -1.6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 7;
  key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -6, near: 1, far: 30 });
  const rim = new THREE.DirectionalLight(0x9cc4ff, 1.9);
  rim.position.set(3, 5.5, -11);
  rim.target.position.set(0, 2, 0);
  set.add(key, key.target, rim, rim.target);
  const pl = (color, intensity, x, y, z, distance = 6) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lights = {
    pendA: pl(0xffdcae, 3.2, PX[0], 6.6, -1.15, 6.5),
    pendB: pl(0xffe6c8, 2.4, PX[1], 6.6, -1.15, 6.5),
    pendC: pl(0xffdcae, 2.6, PX[2], 6.6, -1.15, 6.5),
    eat: pl(0xff2f45, 3, -3.35, 5.0, BACK + 0.9, 5),
    motel: pl(0xff4fa3, 2.2, -2.6, 4.4, BACK + 0.6, 5),
    street: pl(0x9fd2ff, 2.2, 2.6, 4.2, BACK + 0.6, 5.5),
  };

  // the insert targets in the world
  set.updateMatrixWorld(true);
  const bagAt = bag.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.3, 0));
  const clockAt = clock.getWorldPosition(new THREE.Vector3());

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(-1.25, 3.85, -2.2);
  const settyFace = new THREE.Vector3(1.0, 2.25, -1.0);
  return {
    key, rim, lights, root: set,
    coach: { x: -1.4, y: SEAT - 1.08, z: -2.32, turn: 0.32, sit: 1, phone: 1 },
    setty: { x: 1.0, y: TOP - 0.3, z: -1.0, turn: -0.42, scale: 0.6 },
    heads: { coach: coachHead, setty: settyFace, bag: bagAt, clock: clockAt },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 860 }, // lower: the hook title runs on 3 lines
      setty: { target: settyFace, dist: 10.5, yaw: -0.32, pitch: 0.06, y: 860 },
      bag: { target: bagAt, dist: 4.2, yaw: -0.25, pitch: 0.22, y: 860 }, // from the left: Setty stays out of it
      clock: { target: clockAt, dist: 5.0, yaw: 0.35, pitch: -0.05, y: 860 }, // from the right: the coach's head stays out of it
    },
    shots: {
      wide: { pos: [-0.2, 3.7, 12.8], at: [-0.2, 2.45, -1.6], fov: 44 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 860 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 860 }),
      bag: K.shot(bagAt, { dist: 4.2, yaw: -0.25, pitch: 0.22, y: 860 }),
      clock: K.shot(clockAt, { dist: 5.0, yaw: 0.35, pitch: -0.05, y: 860 }),
    },
  };
}
