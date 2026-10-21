// Set "park": a city park at sunset, in October (reel19, the follow-up). A cast-iron and wood-slat bench at the back edge
// of a gravel path, autumn trees in gold and rust (the low sun behind them), a green iron street lamp just lit, a dark
// hedge and evergreens on the right, a few pigeons pecking at crumbs by his sneakers, and the city's towers rising above
// the tree line in a pink and gold sky. He sits on the left half of the bench, phone in hand, a paper bag of bread next
// to him; Setty perches on the top rail of the backrest, at the right end. The joke of the set: the pigeons.
// Setty's side of the frame stays green and violet (hedge, evergreens, sky): never orange behind him.
// build() adds the park and its lights to the scene and returns where the characters go and the camera shots.
// The furniture only this set uses (bench, lamp post, trees, hedge, pigeons, paper bag, the painted skyline) stays here.
import * as THREE from "three";
import * as K from "./kit.js";

// ---------------- textures ----------------
/** autumn grass, warm in the low sun: short strokes in greens and straw */
function grassTex(seed = 3) {
  const R = K.rng(seed);
  return K.canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = "#58743a";
    c.fillRect(0, 0, W, H);
    const cols = ["#4a6531", "#6a8640", "#7f9447", "#93934b", "#3f5a2c", "#a39a55"];
    for (let i = 0; i < 5200; i++) {
      const x = R() * W, y = R() * H, l = 4 + R() * 9, a = -Math.PI / 2 + (R() - 0.5) * 0.9;
      c.strokeStyle = cols[Math.floor(R() * cols.length)];
      c.globalAlpha = 0.55 + R() * 0.45;
      c.lineWidth = 1 + R() * 1.4;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      c.stroke();
    }
    c.globalAlpha = 1;
  }, { repeat: [16, 12] });
}

/** fine park gravel, beige with darker and lighter pebbles */
function gravelTex(seed = 5) {
  const R = K.rng(seed);
  return K.canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = "#c2ad8e";
    c.fillRect(0, 0, W, H);
    const cols = ["#a8937a", "#d8c8ad", "#8f7c66", "#e6dac6", "#b39c80"];
    for (let i = 0; i < 4200; i++) {
      c.fillStyle = cols[Math.floor(R() * cols.length)];
      c.globalAlpha = 0.5 + R() * 0.5;
      const r = 0.8 + R() * 2.4;
      c.beginPath();
      c.ellipse(R() * W, R() * H, r, r * (0.6 + R() * 0.4), R() * 3, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
  }, { repeat: [14, 2] });
}

/** leafy canopy: a base colour with lighter and darker leaf dabs */
function leafTex(base, light, dark, seed = 9) {
  const R = K.rng(seed);
  return K.canvasTex(256, 256, (c, W, H) => {
    c.fillStyle = base;
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) {
      c.fillStyle = R() < 0.55 ? light : dark;
      c.globalAlpha = 0.18 + R() * 0.3;
      const r = 1.5 + R() * 3;
      c.beginPath();
      c.ellipse(R() * W, R() * H, r, r * 0.6, R() * 3, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
  }, { repeat: [2, 2] });
}

/** one leaf (white, tinted per instance): a pointed oval with a vein, on a transparent ground */
function leafShape() {
  return K.canvasTex(128, 128, (c, W) => {
    c.translate(W / 2, W / 2);
    c.fillStyle = "#ffffff";
    c.beginPath();
    c.moveTo(0, -W * 0.44);
    c.bezierCurveTo(W * 0.34, -W * 0.2, W * 0.3, W * 0.22, 0, W * 0.38);
    c.bezierCurveTo(-W * 0.3, W * 0.22, -W * 0.34, -W * 0.2, 0, -W * 0.44);
    c.fill();
    c.strokeStyle = "rgba(90,50,20,0.45)";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(0, -W * 0.36);
    c.lineTo(0, W * 0.46);
    c.stroke();
  });
}

// ---------------- the skyline (a big painted backdrop beyond the park) ----------------
// The painting spans world y -6 → 34 at z -46 (fraction f from the top: y = 34 - 40 f) and x -50 → 50.
function parkSkyline(c, W, H, R) {
  const fy = (y) => H * ((34 - y) / 40); // world height → painting row
  // sky: violet at the top, pink, then gold over the trees
  const sky = c.createLinearGradient(0, 0, 0, fy(1));
  sky.addColorStop(0, "#2d2f6b");
  sky.addColorStop(0.3, "#61477f");
  sky.addColorStop(0.55, "#c46c8c");
  sky.addColorStop(0.78, "#f39a72");
  sky.addColorStop(1, "#ffd08a");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  // the sun, low on the left, half behind the trees, and its glow
  const sx = W * 0.3, sy = fy(5.6), sr = W * 0.018;
  const g = c.createRadialGradient(sx, sy, 0, sx, sy, W * 0.36);
  g.addColorStop(0, "rgba(255,240,196,1)");
  g.addColorStop(0.08, "rgba(255,198,120,0.75)");
  g.addColorStop(0.35, "rgba(255,140,110,0.22)");
  g.addColorStop(1, "rgba(255,140,110,0)");
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#fff6dc";
  c.beginPath();
  c.arc(sx, sy, sr, 0, Math.PI * 2);
  c.fill();
  // long thin clouds, lit pink and gold from below
  for (let i = 0; i < 14; i++) {
    const cy = fy(12 + R() * 20), cx = W * R(), cw = W * (0.08 + R() * 0.2), ch = H * (0.006 + R() * 0.008);
    const near = 1 - Math.min(1, Math.abs(cx - sx) / (W * 0.55));
    c.fillStyle = `rgba(255,${160 + Math.round(60 * near)},${150 + Math.round(20 * near)},${0.2 + 0.3 * near})`;
    c.beginPath();
    c.ellipse(cx, cy, cw / 2, ch, 0, 0, Math.PI * 2);
    c.fill();
  }
  // the towers above the tree line: slim, flat-topped, a few setbacks; the side facing the sun catches it
  const tower = (x, w, top, color, { win = 0.25, setback = 0, crown = 0 } = {}) => {
    const base = fy(4), y0 = fy(top);
    c.fillStyle = color;
    c.fillRect(x, y0, w, base - y0);
    if (setback) {
      c.fillRect(x + w * 0.18, y0 - H * setback, w * 0.64, H * setback + 2);
    }
    if (crown) {
      c.fillRect(x + w * 0.42, y0 - H * (setback + crown), w * 0.16, H * (setback + crown));
    }
    const lit = x + w / 2 > sx ? x : x + w - Math.max(2, w * 0.12); // the edge that faces the sun
    c.fillStyle = "rgba(255,180,130,0.4)";
    c.fillRect(lit, y0, Math.max(2, w * 0.12), base - y0);
    const cols = Math.max(2, Math.round(w / 9)), rows = Math.round((base - y0) / 9);
    for (let i = 0; i < cols; i++) for (let j = 1; j < rows; j++) {
      if (R() > win) continue;
      c.fillStyle = `rgba(255,${205 + Math.round(R() * 35)},${130 + Math.round(R() * 60)},${0.4 + R() * 0.5})`;
      c.fillRect(x + (i + 0.3) * (w / cols), y0 + j * 9, (w / cols) * 0.42, 3);
    }
  };
  // far row (hazy), then the near row (darker, taller)
  let x = W * 0.02;
  while (x < W) {
    const w = W * (0.012 + R() * 0.02);
    tower(x, w, 9 + R() * 7, "rgba(150,110,160,0.75)", { win: 0.1 });
    x += w + W * (0.004 + R() * 0.01);
  }
  const near = [
    [0.12, 0.02, 15], [0.17, 0.016, 19], [0.36, 0.022, 17], [0.41, 0.014, 26, 0.02, 0.015], [0.455, 0.025, 21, 0.03],
    [0.5, 0.012, 29, 0, 0.03], [0.535, 0.03, 18], [0.58, 0.016, 24, 0.02], [0.62, 0.022, 20], [0.66, 0.014, 27, 0, 0.02],
    [0.7, 0.026, 16], [0.75, 0.018, 22, 0.025], [0.8, 0.02, 14], [0.86, 0.016, 19], [0.9, 0.024, 13],
  ];
  for (const [u, w, top, setback = 0, crown = 0] of near) tower(W * u, W * w, top, "#45365e", { win: 0.28, setback, crown });
  // the far tree line: rounded crowns, dark olive and teal, lit gold on top on the sun's side
  for (let k = 0; k < 2; k++) {
    const yTop = fy(k ? 6.2 : 7.4), col = k ? "#2e3b2c" : "#46523a";
    for (let i = 0; i < 90; i++) {
      const cx = W * (i / 90) + (R() - 0.5) * W * 0.02, r = W * (0.012 + R() * 0.016), cy = yTop + R() * H * 0.03;
      c.fillStyle = col;
      c.beginPath();
      c.arc(cx, cy, r, 0, Math.PI * 2);
      c.fill();
      const near = 1 - Math.min(1, Math.abs(cx - sx) / (W * 0.4));
      c.fillStyle = `rgba(255,170,90,${0.12 + 0.3 * near})`;
      c.beginPath();
      c.arc(cx - r * 0.15, cy - r * 0.35, r * 0.6, Math.PI, 0);
      c.fill();
    }
    c.fillStyle = col;
    c.fillRect(0, yTop + H * 0.02, W, fy(1) - yTop);
  }
  // below the tree line: a warm haze that melts into the scene's fog
  const haze = c.createLinearGradient(0, fy(3.4), 0, H);
  haze.addColorStop(0, "rgba(201,150,124,0)");
  haze.addColorStop(0.35, "rgba(201,150,124,0.9)");
  haze.addColorStop(1, "#c9967c");
  c.fillStyle = haze;
  c.fillRect(0, fy(3.4), W, H - fy(3.4));
}

// ---------------- the furniture of this set ----------------
const iron = () => K.mat(0x1d2a24, { roughness: 0.42, metalness: 0.65 });
const slatWood = () => K.mat(0xffffff, { roughness: 0.6, clearcoat: 0.2, map: K.woodTex({ base: "#a7713f", planks: 2, seed: 44, w: 512, h: 256 }) });

/** a classic park bench: two cast-iron ends (legs, scrolled armrests), wood slats for the seat and the reclined back, a
 *  flat top rail (Setty's perch). Origin: the middle of the seat's front edge on the ground; +z = the way it faces. */
function parkBench({ L = 4.6, seat = 0.58, depth = 0.8, recline = 0.2 } = {}) {
  const g = new THREE.Group(), fe = iron(), wood = slatWood();
  const ends = [-(L / 2 - 0.22), L / 2 - 0.22];
  for (const ex of ends) {
    const front = K.box(0.12, seat - 0.06, 0.12, 0.03, fe);
    front.position.set(ex, (seat - 0.06) / 2, -0.08);
    const back = K.box(0.12, seat + 0.16, 0.12, 0.03, fe);
    back.position.set(ex, (seat + 0.16) / 2, -depth + 0.02);
    const rail = K.box(0.12, 0.1, depth + 0.1, 0.03, fe);
    rail.position.set(ex, seat - 0.11, -depth / 2);
    const foot = K.box(0.2, 0.06, depth + 0.3, 0.03, fe);
    foot.position.set(ex, 0.03, -depth / 2);
    const arm = K.box(0.13, 0.09, depth + 0.02, 0.04, fe);
    arm.position.set(ex, 1.0, -depth / 2 + 0.06);
    const curl = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.035, 10, 24, Math.PI * 1.5), fe);
    curl.position.set(ex, 0.93, 0.08);
    curl.rotation.y = Math.PI / 2;
    curl.castShadow = true;
    const post = K.box(0.09, 0.42, 0.09, 0.03, fe);
    post.position.set(ex, 0.78, 0.04);
    g.add(front, back, rail, foot, arm, curl, post);
  }
  const posts = ends.map((ex) => {
    const p = K.box(0.11, 1.02, 0.11, 0.03, fe);
    p.position.set(ex, 0.47, -0.07);
    return p;
  });
  // seat slats (a small gap between each)
  for (let i = 0; i < 4; i++) {
    const s = K.box(L, 0.07, depth / 4 - 0.035, 0.025, wood);
    s.position.set(0, seat - 0.035, -0.08 - (i + 0.5) * (depth / 4) + 0.04);
    g.add(s);
  }
  // back slats on a reclined frame
  const backG = new THREE.Group();
  backG.position.set(0, seat + 0.12, -depth + 0.02);
  backG.rotation.x = -recline;
  for (let i = 0; i < 3; i++) {
    const s = K.box(L - 0.08, 0.2, 0.06, 0.025, wood);
    s.position.set(0, 0.16 + i * 0.29, 0);
    backG.add(s);
  }
  const cap = K.box(L + 0.06, 0.08, 0.34, 0.03, wood); // the top rail: wide and flat
  cap.position.set(0, 0.98, -0.06);
  backG.add(cap, ...posts);
  g.add(backG);
  backG.updateMatrix();
  const capTop = new THREE.Vector3(0, 0.98 + 0.04, -0.06).applyMatrix4(backG.matrix);
  g.userData = { seat, depth, capTop };
  return g;
}

/** a green cast-iron street lamp, its lantern just lit */
function lampPost({ h = 5.6 } = {}) {
  const g = new THREE.Group(), fe = K.mat(0x203a2e, { roughness: 0.4, metalness: 0.6 });
  const base = K.cyl(0.26, 0.32, 0.55, fe, 24);
  base.position.y = 0.275;
  const ring = K.cyl(0.2, 0.24, 0.16, fe, 24);
  ring.position.y = 0.63;
  const pole = K.cyl(0.075, 0.1, h - 1.2, fe, 20);
  pole.position.y = 0.7 + (h - 1.2) / 2;
  const collar = K.cyl(0.13, 0.11, 0.14, fe, 20);
  collar.position.y = h - 0.5;
  const glass = K.cyl(0.26, 0.2, 0.62, K.glow(0xffd696), 6);
  glass.position.y = h - 0.12;
  const frame = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2, bar = K.box(0.035, 0.66, 0.035, 0.01, fe);
    bar.position.set(Math.cos(a) * 0.255, 0, Math.sin(a) * 0.255);
    bar.rotation.set(Math.sin(a) * 0.09, 0, -Math.cos(a) * 0.09);
    frame.add(bar);
  }
  frame.position.y = h - 0.12;
  const cap = K.cyl(0.04, 0.36, 0.26, fe, 6);
  cap.position.y = h + 0.31;
  const finial = K.ball(0.06, fe, 12);
  finial.position.y = h + 0.48;
  g.add(base, ring, pole, collar, glass, frame, cap, finial);
  g.userData.lamp = new THREE.Vector3(0, h - 0.12, 0);
  return g;
}

/** a deciduous tree in autumn: a tapered trunk, a few limbs, a crown of leafy balls */
function autumnTree({ h = 8, spread = 2.6, colors = ["#d99a35", "#f2c25a", "#9a5a1e"], seed = 1, n = 11 } = {}) {
  const R = K.rng(seed), g = new THREE.Group();
  const bark = K.mat(0x3b2e26, { roughness: 0.9, map: K.noiseTex("#3b2e26", 18, seed + 3, 256) });
  const trunkH = h * 0.55;
  const trunk = K.cyl(0.16, 0.3, trunkH, bark, 14);
  trunk.position.y = trunkH / 2;
  g.add(trunk);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + R(), len = h * (0.22 + R() * 0.1), tilt = 0.6 + R() * 0.3;
    const limb = K.cyl(0.05, 0.11, len, bark, 10);
    const piv = new THREE.Group();
    piv.position.y = trunkH * (0.75 + R() * 0.2);
    piv.rotation.set(Math.cos(a) * tilt, 0, -Math.sin(a) * tilt);
    limb.position.y = len / 2;
    piv.add(limb);
    g.add(piv);
  }
  const mats = colors.map((col, k) => K.mat(0xffffff, { roughness: 0.85, map: leafTex(col, colors[(k + 1) % colors.length], "#5a3418", seed * 7 + k) }));
  const geo = new THREE.IcosahedronGeometry(1, 2);
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2, r = spread * Math.sqrt(R()) * 0.75, s = spread * (0.38 + R() * 0.3);
    const m = new THREE.Mesh(geo, mats[i % mats.length]);
    m.scale.set(s, s * (0.8 + R() * 0.2), s);
    m.position.set(Math.cos(a) * r, trunkH + spread * 0.35 + R() * spread * 0.7, Math.sin(a) * r);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
  }
  return g;
}

/** a dark evergreen: stacked cones */
function evergreen({ h = 7, r = 1.6, seed = 2 } = {}) {
  const g = new THREE.Group(), R = K.rng(seed);
  const m = K.mat(0xffffff, { roughness: 0.85, map: leafTex("#22402f", "#2f5640", "#142a1e", seed) });
  const trunk = K.cyl(0.12, 0.16, h * 0.25, K.mat(0x3b2e26, { roughness: 0.9 }), 10);
  trunk.position.y = h * 0.125;
  g.add(trunk);
  for (let i = 0; i < 4; i++) {
    const k = i / 4, cr = r * (1 - k * 0.62), ch = h * 0.42;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(cr, ch, 18, 1), m);
    cone.position.y = h * 0.2 + k * h * 0.6 + ch / 2;
    cone.rotation.y = R() * 3;
    cone.castShadow = true;
    g.add(cone);
  }
  return g;
}

/** a clipped hedge: a long puffy block of dark leaves */
function hedge({ w = 6, h = 1.7, d = 1.2, seed = 4 } = {}) {
  const m = K.mat(0xffffff, { roughness: 0.9, map: leafTex("#2c4a2f", "#3d6440", "#1a2f1e", seed) });
  m.map.repeat.set(6, 2);
  const b = K.soft(w, h, d, m, { P: 4, puff: 0.12, wrinkle: 0.05, seed });
  b.position.y = h / 2;
  return b;
}

/** a city pigeon: blue-grey body, darker wings with two black bars, a green and purple sheen on the neck, orange
 *  eyes, pink feet. +z = its beak; peck tips it forward, head to the ground */
function pigeon({ peck = 0, seed = 1 } = {}) {
  const R = K.rng(seed), g = new THREE.Group(), body = new THREE.Group();
  const grey = K.mat(0x9aa0ae, { roughness: 0.7 }), dark = K.mat(0x7a8090, { roughness: 0.7 }), head = K.mat(0x7f8696, { roughness: 0.6 });
  const sheen = K.mat(0x6f8f86, { roughness: 0.3, clearcoat: 0.8, iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [250, 700] });
  const torso = K.ball(0.22, grey, 20);
  torso.scale.set(0.82, 0.8, 1.18);
  torso.position.set(0, 0.3, 0);
  const chest = K.ball(0.16, grey, 16);
  chest.position.set(0, 0.36, 0.13);
  const neck = K.ball(0.1, sheen, 16); // the shiny collar, mostly hidden under the head
  neck.scale.set(1, 0.9, 0.8);
  neck.position.set(0, 0.47, 0.17);
  for (const s of [-1, 1]) {
    const wing = K.ball(0.18, dark, 16);
    wing.scale.set(0.32, 0.58, 1.12);
    wing.position.set(s * 0.15, 0.34, -0.06);
    wing.rotation.x = 0.22;
    body.add(wing);
    for (const z of [-0.02, 0.06]) {
      const bar = K.box(0.01, 0.025, 0.07, 0.005, K.mat(0x454852), false);
      bar.position.set(s * 0.205, 0.31, z - 0.06);
      bar.rotation.x = 0.22;
      body.add(bar);
    }
  }
  const tail = K.box(0.15, 0.035, 0.26, 0.015, dark);
  tail.position.set(0, 0.29, -0.33);
  tail.rotation.x = -0.3;
  const tip = K.box(0.15, 0.036, 0.05, 0.012, K.mat(0x3a3d45), false);
  tip.position.set(0, 0.24, -0.45);
  tip.rotation.x = -0.3;
  const hd = new THREE.Group();
  hd.position.set(0, 0.55, 0.24);
  const skull = K.ball(0.105, head, 18);
  skull.scale.set(0.95, 1, 1.05);
  const beak = K.cyl(0.006, 0.024, 0.08, K.mat(0x3a3a3e), 8);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, -0.015, 0.14);
  const cere = K.ball(0.024, K.mat(0xeeece6), 8);
  cere.scale.set(1, 0.8, 1.2);
  cere.position.set(0, 0.008, 0.1);
  hd.add(skull, beak, cere);
  for (const s of [-1, 1]) {
    const eye = K.ball(0.024, K.mat(0xff7a1a, { roughness: 0.2, clearcoat: 1 }), 10);
    eye.position.set(s * 0.068, 0.025, 0.05);
    const pupil = K.ball(0.011, K.mat(0x111111), 8);
    pupil.position.set(s * 0.088, 0.027, 0.06);
    hd.add(eye, pupil);
  }
  body.add(torso, chest, neck, tail, tip, hd);
  if (peck) {
    body.rotation.x = 0.5;
    body.position.z = -0.08;
    hd.position.set(0, 0.42, 0.3);
  } else {
    hd.rotation.y = (R() - 0.5) * 1.2; // looking around
  }
  const foot = K.mat(0xd9727a, { roughness: 0.5 });
  for (const s of [-1, 1]) {
    const leg = K.cyl(0.014, 0.014, 0.16, foot, 6);
    leg.position.set(s * 0.06, 0.08, 0.02);
    const toes = K.box(0.05, 0.015, 0.1, 0.005, foot);
    toes.position.set(s * 0.06, 0.008, 0.05);
    g.add(leg, toes);
  }
  g.add(body);
  g.scale.setScalar(1.25 + R() * 0.15);
  return g;
}

/** a kraft paper bag of bread, its top rolled down, a baguette sticking out */
function breadBag() {
  const g = new THREE.Group(), kraft = K.mat(0xd2ab7c, { roughness: 0.95, map: K.noiseTex("#d2ab7c", 16, 8, 128) });
  const bag = K.soft(0.42, 0.46, 0.28, kraft, { P: 6, puff: 0.06, wrinkle: 0.025, seed: 3 });
  bag.position.y = 0.23;
  const roll = K.soft(0.44, 0.08, 0.3, kraft, { P: 3, puff: 0.1, wrinkle: 0.02, seed: 5 });
  roll.position.y = 0.45;
  const crust = K.mat(0xc98a45, { roughness: 0.7, clearcoat: 0.2 });
  const baguette = new THREE.Group();
  const loaf = new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 0.78, 8, 16), crust);
  loaf.castShadow = true;
  baguette.add(loaf);
  for (let i = 0; i < 4; i++) { // the scores on top
    const cut = K.box(0.05, 0.1, 0.02, 0.008, K.mat(0xf0d39a, { roughness: 0.9 }), false);
    cut.position.set(0.06, -0.22 + i * 0.16, 0.05);
    cut.rotation.set(0.6, 0.6, 0);
    baguette.add(cut);
  }
  baguette.position.set(0.12, 0.62, -0.02);
  baguette.rotation.set(-0.15, 0, -0.5);
  g.add(bag, roll, baguette);
  return g;
}

export async function build({ renderer, scene, mood = "sunset" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.4;
  scene.background = new THREE.Color(0x2d2f6b);
  scene.fog = new THREE.Fog(0xc9967c, 24, 62); // the warm evening haze over the far lawn
  void mood;

  const set = new THREE.Group();
  scene.add(set);

  // ---- the ground: lawn, the gravel path in front of the bench, stone curbs
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(110, 70), K.mat(0xffffff, { map: grassTex(), roughness: 0.95 }));
  lawn.material.map.repeat.set(36, 24);
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(0, 0, -10);
  lawn.receiveShadow = true;
  const PATH = { z: 0.7, w: 3.6 };
  const path = new THREE.Mesh(new THREE.PlaneGeometry(60, PATH.w), K.mat(0xffffff, { map: gravelTex(), roughness: 1 }));
  path.material.map.repeat.set(30, 2);
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.012, PATH.z);
  path.receiveShadow = true;
  const curbM = K.mat(0xb9b2a6, { roughness: 0.9, map: K.noiseTex("#b9b2a6", 10, 15, 128) });
  const curb = K.box(60, 0.08, 0.16, 0.02, curbM); // the front edge only: the bench's back feet stand on the lawn
  curb.position.set(0, 0.04, PATH.z + PATH.w / 2 + 0.08);
  set.add(curb);
  set.add(lawn, path);

  // ---- the painted skyline far beyond the park
  const sky = K.canvasTex(2048, 820, (c, W, H) => parkSkyline(c, W, H, K.rng(53)));
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(100, 40), K.glow(0xffffff, { map: sky, fog: false }));
  backdrop.position.set(0, 14, -46);
  set.add(backdrop);

  // ---- the bench: at the back edge of the path, turned a little toward the right
  const BENCH = { x: 0.15, z: PATH.z - PATH.w / 2 + 1.0, ry: 0.22 };
  const bench = parkBench();
  K.at(bench, BENCH.x, 0, BENCH.z, BENCH.ry);
  set.add(bench);
  const local = (x, y, z) => new THREE.Vector3(x, y, z).applyAxisAngle(new THREE.Vector3(0, 1, 0), BENCH.ry).add(new THREE.Vector3(BENCH.x, 0, BENCH.z));
  const { seat, capTop } = bench.userData;
  const bag = breadBag();
  const bagP = local(0.5, seat, -0.42);
  K.at(bag, bagP.x, bagP.y, bagP.z, BENCH.ry + 0.3);
  set.add(bag);

  // ---- a second bench, far on the left, empty
  const far = parkBench({ L: 4.0 });
  K.at(far, -9.5, 0, -6.5, 0.55);
  set.add(far);

  // ---- the street lamp, behind the bench on the left
  const lamp = lampPost();
  K.at(lamp, -0.5, 0, -3.3); // between them, behind the bench: never behind a head in the close-ups
  set.add(lamp);
  const haloTex = K.canvasTex(128, 128, (c, W) => {
    const gr = c.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
    gr.addColorStop(0, "rgba(255,226,170,1)");
    gr.addColorStop(0.3, "rgba(255,190,110,0.45)");
    gr.addColorStop(1, "rgba(255,170,90,0)");
    c.fillStyle = gr;
    c.fillRect(0, 0, W, W);
  });
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(2.2);
  halo.position.copy(lamp.userData.lamp).add(lamp.position);
  set.add(halo);

  // ---- trees: autumn gold and rust on the left (the sun behind them), evergreens and a hedge on the right (behind Setty)
  const trees = [
    [autumnTree({ h: 9.5, spread: 3.0, colors: ["#d9902e", "#f0bf55", "#b5551f"], seed: 3, n: 13 }), -8.6, -5.4],
    [autumnTree({ h: 11, spread: 3.4, colors: ["#c4562a", "#e0883a", "#8e2f1d"], seed: 7, n: 14 }), -4.8, -11],
    [autumnTree({ h: 8.5, spread: 2.6, colors: ["#e6b04a", "#f4d27a", "#c07a2a"], seed: 11, n: 11 }), -11.5, -9],
    [autumnTree({ h: 10, spread: 3.0, colors: ["#b8492a", "#d9773a", "#7d2a1c"], seed: 13, n: 12 }), -15, -3.5],
    [autumnTree({ h: 9, spread: 2.8, colors: ["#6f8a3a", "#93a64a", "#4f6a2c"], seed: 17, n: 12 }), 11.5, -8], // still green
  ];
  for (const [t, x, z] of trees) set.add(K.at(t, x, 0, z));
  for (const [x, z, h, r, s] of [[4.4, -4.6, 7.5, 1.7, 2], [6.6, -7.4, 9, 2.0, 5], [2.6, -8.6, 8.2, 1.8, 8], [9.2, -4.2, 6.5, 1.5, 12], [-0.4, -7.4, 8, 1.9, 14]]) {
    set.add(K.at(evergreen({ h, r, seed: s }), x, 0, z));
  }
  const hg = hedge({ w: 7.5, h: 1.8, d: 1.3, seed: 4 });
  K.at(hg, 4.6, 0, -2.75, 0.06);
  const hg2 = hedge({ w: 5.0, h: 1.5, d: 1.1, seed: 9 });
  K.at(hg2, -6.8, 0, -1.9, -0.1);
  set.add(hg, hg2);

  // ---- fallen leaves on the lawn and the path (instanced, tinted one by one)
  {
    const R = K.rng(71), n = 520;
    const leaves = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.26, 0.26),
      K.mat(0xffffff, { map: leafShape(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.85 }), n);
    const pal = ["#d9902e", "#c4562a", "#e6b04a", "#9e3324", "#b8792e", "#e0883a"].map((c) => new THREE.Color(c));
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < n; i++) {
      const x = (R() - 0.5) * 26, z = -9 + R() * 15;
      e.set(-Math.PI / 2 + (R() - 0.5) * 0.3, 0, R() * Math.PI * 2);
      q.setFromEuler(e);
      const s = 0.7 + R() * 0.7;
      m.compose(new THREE.Vector3(x, 0.02 + R() * 0.01, z), q, new THREE.Vector3(s, s, s));
      leaves.setMatrixAt(i, m);
      leaves.setColorAt(i, pal[Math.floor(R() * pal.length)]);
    }
    leaves.receiveShadow = true;
    set.add(leaves);
  }

  // ---- the pigeons on the path by his sneakers, and the crumbs he threw
  const P = [[1.2, 1.55, -0.6, 1, 1], [2.1, 1.0, 2.6, 0, 2], [0.15, 2.05, 0.3, 1, 3], [2.9, 1.75, -1.9, 0, 4], [-1.9, 1.85, 1.1, 1, 5]];
  for (const [x, z, ry, peck, seed] of P) set.add(K.at(pigeon({ peck, seed }), x, 0.012, z, ry));
  {
    const R = K.rng(29), crumbM = K.mat(0xe2c08a, { roughness: 0.9 });
    for (let i = 0; i < 26; i++) {
      const cr = K.box(0.05 + R() * 0.05, 0.03, 0.04 + R() * 0.04, 0.01, crumbM, false);
      cr.position.set(-0.4 + R() * 3.4, 0.03, 0.8 + R() * 1.4);
      cr.rotation.y = R() * 3;
      set.add(cr);
    }
  }

  // ---- low sun on the path through the trees
  const patch = K.sunPatch({ w: 7, d: 3.2, color: 0xffb070, strength: 0.28 });
  patch.position.set(1.2, 0.03, 1.4);
  patch.rotation.z = 0.5;
  set.add(patch);

  // ---- lights: sunset. The low sun behind the autumn trees (left, far back) is the warm rim and casts the long shadows
  // toward the camera; a pink and violet sky fill from above, a soft warm key from the front for the faces, the lamp
  // as a warm practical.
  set.add(new THREE.HemisphereLight(0xf0bcd0, 0x4f5a30, 1.05));
  const key = new THREE.DirectionalLight(0xfff0e2, 1.45);
  key.position.set(-2, 8, 11);
  key.target.position.set(0.2, 2, -1);
  const rim = new THREE.DirectionalLight(0xffa04a, 3.0);
  rim.position.set(-13, 6, -16);
  rim.target.position.set(0, 1, 0);
  rim.castShadow = true;
  rim.shadow.mapSize.set(2048, 2048);
  rim.shadow.radius = 8;
  rim.shadow.bias = -0.0005;
  Object.assign(rim.shadow.camera, { left: -11, right: 11, top: 10, bottom: -6, near: 1, far: 50 });
  const fill = new THREE.DirectionalLight(0xb8a8ff, 0.45);
  fill.position.set(9, 4, 7);
  set.add(key, key.target, rim, rim.target, fill);
  const pl = (color, intensity, x, y, z, distance = 6) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lampW = lamp.userData.lamp.clone().add(lamp.position);
  const lights = {
    lamp: pl(0xffc985, 5, lampW.x, lampW.y - 0.3, lampW.z + 0.4, 7.5),
    sunL: pl(0xffb066, 2.5, -4.5, 3.5, -3.5, 7),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  // the coach: on the left half of the seat, hips a little forward so his knees clear the front edge
  const cP = local(-0.95, 0, -0.28);
  const coach = { x: cP.x, y: seat - 1.0 - 0.04, z: cP.z, turn: BENCH.ry + 0.3, sit: 1, phone: 1 };
  // Setty: perched on the top rail of the backrest, at the right end
  const sP = local(1.5, 0, capTop.z);
  const setty = { x: sP.x, y: capTop.y - 0.32, z: sP.z, turn: -0.45, scale: 0.6 };
  const coachHead = new THREE.Vector3(coach.x + 0.15, coach.y + 4.5, coach.z + 0.2);
  const settyFace = new THREE.Vector3(setty.x, setty.y + 1.7 * setty.scale + 0.04, setty.z);
  const pigeons = new THREE.Vector3(1.3, 0.35, 1.5);
  return {
    key, rim, lights, root: set,
    coach, setty,
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: 0.2, pitch: 0.06, y: 800 }, // from the front right: the coach never between
      pigeons: { target: pigeons, dist: 6.2, yaw: 0.3, pitch: 0.3, y: 900 }, // the cut-in, as a frame so a push can change its dist
    },
    shots: {
      wide: { pos: [0.3, 4.0, 14.6], at: [0.3, 2.3, -1.5], fov: 44 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: 0.2, pitch: 0.06, y: 800 }),
      // cut-in: the pigeons pecking at the crumbs by his sneakers (the punchline)
      pigeons: K.shot(pigeons, { dist: 6.2, yaw: 0.3, pitch: 0.3, y: 900 }),
    },
  };
}
