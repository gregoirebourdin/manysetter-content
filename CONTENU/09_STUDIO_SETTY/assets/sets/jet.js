// Set "jet": a private jet cabin at golden hour (reel10, the big coaches' DMs). The coach rented it for one hour to live
// like the big coaches: cream leather club seats facing each other, a walnut table with two champagne flutes and a bottle
// on ice, walnut trim along the cabin wall, oval windows on a sea of clouds lit by a low sun, warm light pouring in.
// He sits on the left seat, phone in hand; Setty sits on the seat across, on a plump cushion (he is small, the seat is not).
// build() adds the cabin and its lights to the scene and returns where the characters go and the camera shots.
// The cabin pieces (club seat, flute, oval window, clouds view) live here: no other set uses them yet.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4; // the cabin wall (windows side)
const CEIL = 7.25; // the flat part of the ceiling (wall 5.0 + 0.25 + the 2.0 curve)
const LEN = 26; // cabin length along x

// ---------------- the view: a sea of clouds at golden hour (canvas painter, see K.VIEWS) ----------------
function cloudsView(c, W, H, R) {
  const sky = c.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#4f7fc0");
  sky.addColorStop(0.3, "#93b2d8");
  sky.addColorStop(0.5, "#f1cfb0");
  sky.addColorStop(0.6, "#ffbd7a");
  sky.addColorStop(1, "#ffa766");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  // the low sun, on the horizon, with its halo
  const sx = W * 0.62, sy = H * 0.55;
  const halo = c.createRadialGradient(sx, sy, 0, sx, sy, W * 0.42);
  halo.addColorStop(0, "rgba(255, 250, 228, 1)");
  halo.addColorStop(0.06, "rgba(255, 236, 190, 0.95)");
  halo.addColorStop(0.3, "rgba(255, 186, 110, 0.4)");
  halo.addColorStop(1, "rgba(255, 160, 90, 0)");
  c.fillStyle = halo;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#fffbe8";
  c.beginPath();
  c.arc(sx, sy, W * 0.022, 0, Math.PI * 2);
  c.fill();
  // high thin streaks
  for (let i = 0; i < 9; i++) {
    c.fillStyle = `rgba(255, 232, 205, ${0.12 + R() * 0.18})`;
    c.beginPath();
    c.ellipse(R() * W, H * (0.12 + R() * 0.28), W * (0.05 + R() * 0.09), 3 + R() * 5, 0, 0, Math.PI * 2);
    c.fill();
  }
  // the sea of clouds: rows of soft domes, far and pale to near and big. Each dome is lit gold on top (more on the
  // sun's side), the body of the layer covers their lower halves, so only the rounded tops show. (No canvas
  // `filter` here: the headless Chrome that renders ignores it and leaves the canvas black.)
  const rows = [
    { y: 0.6, r: [16, 30], lit: "#ffe6c4", mid: "#f2cbaa", dark: "#cfb2bd" },
    { y: 0.67, r: [26, 46], lit: "#ffeed6", mid: "#f3cfae", dark: "#c2a6b7" },
    { y: 0.77, r: [42, 74], lit: "#fff3e2", mid: "#f2cfb1", dark: "#b39aae" },
    { y: 0.9, r: [70, 120], lit: "#fff6e8", mid: "#f0ccb1", dark: "#a48da4" },
  ];
  rows.forEach((row, k) => {
    const base = H * row.y;
    let x = -60;
    while (x < W + 60) {
      const r = row.r[0] + R() * (row.r[1] - row.r[0]);
      const y = base - r * (0.05 + R() * 0.4);
      const toward = Math.max(0, 1 - Math.abs(x - sx) / (W * 0.45)); // brighter near the sun
      const g = c.createLinearGradient(x + (x < sx ? -r : r) * 0.4, y - r, x, y + r * 0.5);
      g.addColorStop(0, toward > 0.35 ? "#fffaf0" : row.lit);
      g.addColorStop(0.5, row.lit);
      g.addColorStop(1, row.mid);
      c.fillStyle = g;
      c.beginPath();
      c.ellipse(x, y, r * 1.25, r, 0, 0, Math.PI * 2);
      c.fill();
      x += r * (0.9 + R() * 0.7);
    }
    const body = c.createLinearGradient(0, base - row.r[0] * 0.2, 0, H);
    body.addColorStop(0, row.mid);
    body.addColorStop(1, row.dark);
    c.fillStyle = body;
    c.fillRect(0, base, W, H - base);
    if (k < rows.length - 1) { // haze over the farther layers
      c.fillStyle = "rgba(255, 210, 168, 0.18)";
      c.fillRect(0, base - row.r[1] * 1.2, W, H - base + row.r[1] * 1.2);
    }
  });
  // a warm glow over everything near the horizon
  const haze = c.createLinearGradient(0, H * 0.45, 0, H * 0.7);
  haze.addColorStop(0, "rgba(255, 200, 140, 0)");
  haze.addColorStop(0.5, "rgba(255, 200, 140, 0.25)");
  haze.addColorStop(1, "rgba(255, 200, 140, 0)");
  c.fillStyle = haze;
  c.fillRect(0, 0, W, H);
}

// ---------------- materials ----------------
const leather = (color = 0xefe2cb) => K.mat(color, { roughness: 0.46, clearcoat: 0.35, clearcoatRoughness: 0.4, sheen: 0.4, sheenColor: 0xfff4e6 });
function walnutTex() {
  const R = K.rng(12);
  return K.canvasTex(1024, 256, (c, W, H) => {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#6a3f22");
    g.addColorStop(0.5, "#7b4a28");
    g.addColorStop(1, "#5f381e");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) { // flowing grain
      const y0 = R() * H, amp = 4 + R() * 14, f = 0.004 + R() * 0.01, ph = R() * 6;
      c.strokeStyle = R() < 0.5 ? "rgba(40, 20, 8, 0.32)" : "rgba(160, 104, 60, 0.28)";
      c.lineWidth = 0.8 + R() * 2.2;
      c.beginPath();
      for (let x = 0; x <= W; x += 16) c.lineTo(x, y0 + Math.sin(x * f + ph) * amp + Math.sin(x * f * 3.1) * amp * 0.25);
      c.stroke();
    }
  }, { repeat: [1, 1] });
}
const walnut = () => K.mat(0xffffff, { map: walnutTex(), roughness: 0.28, clearcoat: 0.9, clearcoatRoughness: 0.12 });
const brass = () => K.mat(0xd7ae6a, { metalness: 0.9, roughness: 0.28 });
const chrome = () => K.mat(0xdfe3e8, { metalness: 1, roughness: 0.16 });

function carpetTex() {
  const R = K.rng(23);
  return K.canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = "#4f4137";
    c.fillRect(0, 0, W, H);
    const img = c.getImageData(0, 0, W, H);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (R() - 0.5) * 18;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    c.putImageData(img, 0, 0);
    c.strokeStyle = "rgba(214, 186, 140, 0.06)"; // a discreet diamond weave
    c.lineWidth = 2;
    for (let k = -W; k < W * 2; k += 24) {
      c.beginPath(); c.moveTo(k, 0); c.lineTo(k + H, H); c.stroke();
      c.beginPath(); c.moveTo(k, H); c.lineTo(k + H, 0); c.stroke();
    }
  }, { repeat: [10, 10] });
}

// ---------------- cabin pieces ----------------
/** a soft oval (superellipse) shape, centred */
function ovalShape(w, h, n = 2.5, seg = 72) {
  const s = new THREE.Shape();
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
    const x = (w / 2) * Math.sign(ca) * Math.pow(Math.abs(ca), 2 / n), y = (h / 2) * Math.sign(sa) * Math.pow(Math.abs(sa), 2 / n);
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  return s;
}

/** an oval cabin window: a deep cream bezel, the view (a crop of `tex` at u0..u1), a shade pulled down by `shade` */
function ovalWindow({ w = 1.4, h = 1.8, tex, u0 = 0, u1 = 0.3, shade = 0.18 }) {
  const g = new THREE.Group();
  const outer = ovalShape(w + 0.5, h + 0.5);
  outer.holes.push(ovalShape(w, h));
  const bezel = new THREE.Mesh(new THREE.ExtrudeGeometry(outer, { depth: 0.24, bevelEnabled: true, bevelThickness: 0.06,
    bevelSize: 0.06, bevelSegments: 4, curveSegments: 64 }), K.mat(0xf1ebe1, { roughness: 0.42, clearcoat: 0.3 }));
  bezel.receiveShadow = true;
  const vg = new THREE.ShapeGeometry(ovalShape(w, h), 64);
  const p = vg.attributes.position, uv = vg.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, u0 + ((p.getX(i) + w / 2) / w) * (u1 - u0), (p.getY(i) + h / 2) / h);
  const view = new THREE.Mesh(vg, K.glow(0xffffff, { map: tex }));
  view.position.z = 0.02; // in front of the wall plane (the bezel stands out of it)
  g.add(bezel, view);
  if (shade > 0) { // the window shade, pulled down a little, with its handle
    const sh = K.box(w * 1.02, h * shade + 0.1, 0.03, 0.01, K.mat(0xe9e0d2, { roughness: 0.7 }), false);
    sh.position.set(0, h / 2 - (h * shade) / 2 + 0.05, 0.04);
    const handle = K.box(0.34, 0.05, 0.05, 0.02, brass(), false);
    handle.position.set(0, h / 2 - h * shade + 0.02, 0.08);
    g.add(sh, handle);
  }
  // a faint glare on the glass
  const glare = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.22, h * 0.9), K.glow(0xffffff, { transparent: true, opacity: 0.07,
    blending: THREE.AdditiveBlending, depthWrite: false }));
  glare.position.set(-w * 0.12, 0.02, 0.01);
  glare.rotation.z = -0.35;
  g.add(glare);
  return g;
}

/** a cream leather club seat: plinth, seat cushion, tall back with a headrest, two armrests capped in walnut.
 *  Faces +z; the cushion top is at `seat`. */
function clubSeat({ seat = 0.62, color = 0xefe2cb } = {}) {
  const g = new THREE.Group();
  const L = leather(color), Ld = leather(0xe4d3b8);
  const plinth = K.soft(2.0, 0.5, 1.75, Ld, { P: 4, puff: 0.02, seed: 2 });
  plinth.position.set(0, 0.26, 0);
  const cushion = K.soft(1.62, 0.34, 1.6, L, { P: 3.2, puff: 0.16, wrinkle: 0.012, seed: 3 });
  cushion.position.set(0, seat - 0.16, 0.06);
  const back = K.soft(1.86, 2.45, 0.56, L, { P: 3.4, puff: 0.1, wrinkle: 0.01, seed: 4 });
  back.position.set(0, seat + 1.12, -0.66);
  back.rotation.x = -0.14;
  const head = K.soft(1.2, 0.56, 0.36, Ld, { P: 3, puff: 0.22, seed: 5 });
  head.position.set(0, seat + 2.22, -0.62);
  head.rotation.x = -0.14;
  g.add(plinth, cushion, back, head);
  // channel stitching on the back: three slightly darker welts
  for (const y of [0.55, 1.05, 1.55]) {
    const welt = K.box(1.6, 0.035, 0.03, 0.012, K.mat(0xd9c6a8, { roughness: 0.6 }), false);
    welt.position.set(0, seat + y - 0.04, -0.66 + 0.29 - y * 0.14);
    welt.rotation.x = -0.14;
    g.add(welt);
  }
  const wal = walnut();
  for (const sx of [-1, 1]) {
    const arm = K.soft(0.36, 0.86, 1.62, L, { P: 3.6, puff: 0.08, seed: 6 + sx });
    arm.position.set(sx * 0.98, seat + 0.1, -0.02);
    const cap = K.box(0.4, 0.07, 1.3, 0.03, wal, false);
    cap.position.set(sx * 0.98, seat + 0.56, 0.08);
    g.add(arm, cap);
  }
  g.userData.top = seat;
  return g;
}

/** a champagne flute (glass + champagne), its base at y 0 */
function flute({ h = 0.86, fill = 0.62 } = {}) {
  const g = new THREE.Group();
  const prof = [[0, 0], [0.15, 0], [0.16, 0.012], [0.03, 0.03], [0.022, 0.05], [0.022, h * 0.42], [0.06, h * 0.5],
    [0.1, h * 0.62], [0.112, h * 0.82], [0.108, h]].map(([r, y]) => new THREE.Vector2(r, y));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), K.mat(0xffffff, { roughness: 0.04, transparent: true,
    opacity: 0.3, clearcoat: 1, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false }));
  const top = h * 0.5 + (h * 0.5) * fill;
  const lp = [[0, h * 0.5], [0.055, h * 0.5], [0.095, h * 0.62], [0.104, Math.min(top, h * 0.82)], [0.104, top], [0, top]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const wine = new THREE.Mesh(new THREE.LatheGeometry(lp, 32), K.mat(0xf2cf73, { roughness: 0.15, transmission: 0, transparent: true,
    opacity: 0.86, emissive: 0x7a5a10, emissiveIntensity: 0.35 }));
  g.add(wine, glass);
  return g;
}

/** a bottle on ice in a silver bucket */
function iceBucket() {
  const g = new THREE.Group();
  const bucket = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.24, 0], [0.27, 0.06], [0.3, 0.52], [0.32, 0.56], [0.3, 0.57]]
    .map(([r, y]) => new THREE.Vector2(r, y)), 40), chrome());
  bucket.castShadow = true;
  const ice = new THREE.Mesh(new THREE.CircleGeometry(0.29, 32), K.mat(0xeef6ff, { roughness: 0.2, clearcoat: 1 }));
  ice.rotation.x = -Math.PI / 2;
  ice.position.y = 0.5;
  const bottle = new THREE.Group();
  const glassG = K.mat(0x163a24, { roughness: 0.18, clearcoat: 1 });
  const body = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.15, 0], [0.16, 0.05], [0.16, 0.62], [0.12, 0.78], [0.06, 0.92],
    [0.055, 1.12]].map(([r, y]) => new THREE.Vector2(r, y)), 32), glassG);
  const foil = K.cyl(0.062, 0.066, 0.2, K.mat(0xe0b44d, { metalness: 0.8, roughness: 0.3 }), 24);
  foil.position.y = 1.07;
  const label = K.cyl(0.163, 0.163, 0.22, K.mat(0xf3ead6, { roughness: 0.6 }), 32);
  label.position.y = 0.42;
  bottle.add(body, foil, label);
  bottle.position.set(0.02, 0.1, 0);
  bottle.rotation.z = -0.24;
  g.add(bucket, ice, bottle);
  return g;
}

/** the walnut table between the seats, on a brass pedestal */
function cabinTable({ w = 1.7, d = 1.45, h = 1.48 } = {}) {
  const g = new THREE.Group();
  const top = K.box(w, 0.1, d, 0.05, walnut());
  top.position.y = h - 0.05;
  const edge = K.box(w + 0.03, 0.03, d + 0.03, 0.015, brass(), false);
  edge.position.y = h - 0.1;
  const post = K.cyl(0.08, 0.1, h - 0.1, brass());
  post.position.y = (h - 0.1) / 2;
  const foot = K.cyl(0.42, 0.46, 0.05, brass());
  foot.position.y = 0.025;
  g.add(top, edge, post, foot);
  g.userData.top = h;
  return g;
}

/** a ribbon surface along x from a (z, y) profile (the curve where the cabin wall becomes the ceiling) */
function ribbon(profile, len, material) {
  const pos = [], idx = [];
  profile.forEach(([z, y]) => pos.push(-len / 2, y, z, len / 2, y, z));
  for (let i = 0; i < profile.length - 1; i++) {
    const a = i * 2;
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, material);
  m.receiveShadow = true;
  return m;
}

export async function build({ renderer, scene, mood = "golden" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;
  scene.background = new THREE.Color(0x3a2e26);
  void mood;

  const set = new THREE.Group();
  scene.add(set);

  // ---- floor (mocha carpet), the cabin wall, the valance, the curve into the ceiling
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(LEN, 30), K.mat(0xffffff, { map: carpetTex(), roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, BACK + 15);
  floor.receiveShadow = true;
  const wallH = 5.0;
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(LEN, wallH), K.mat(0xffffff, { map: K.noiseTex("#ddd2c1", 6, 14), roughness: 0.9 }));
  wall.material.map.repeat.set(12, 3);
  wall.position.set(0, wallH / 2, BACK);
  wall.receiveShadow = true;
  const R0 = 2.0, arc = [];
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI / 2; arc.push([BACK + R0 - R0 * Math.cos(a), wallH + 0.25 + R0 * Math.sin(a)]); }
  arc.unshift([BACK, wallH]);
  arc.push([BACK + 24, wallH + 0.25 + R0]);
  const ceiling = ribbon(arc, LEN, K.mat(0xeae1d3, { roughness: 0.85, side: THREE.DoubleSide, emissive: 0x6b5236, emissiveIntensity: 0.55 }));
  const wal = walnut();
  const kick = K.box(LEN, 0.42, 0.14, 0.03, wal, false); // walnut kick panel along the floor
  kick.position.set(0, 0.21, BACK + 0.07);
  const ledge = K.box(LEN, 0.12, 0.58, 0.04, wal, false); // the side ledge under the windows (walnut, brass edge)
  ledge.position.set(0, 2.42, BACK + 0.29);
  const ledgeEdge = K.box(LEN, 0.035, 0.03, 0.012, brass(), false);
  ledgeEdge.position.set(0, 2.42, BACK + 0.59);
  const valance = K.box(LEN, 0.22, 0.42, 0.06, wal, false); // the upper valance hiding the cove light
  valance.position.set(0, wallH + 0.05, BACK + 0.21);
  const cove = new THREE.Mesh(new THREE.PlaneGeometry(LEN, 0.5), K.glow(0xffd29a, { transparent: true, opacity: 0.3,
    blending: THREE.AdditiveBlending, depthWrite: false }));
  cove.position.set(0, wallH + 0.42, BACK + 0.08);
  const coveWash = K.wallGlow({ w: LEN, h: 1.6, color: "#ffcf96", strength: 0.2 });
  K.at(coveWash, 0, wallH + 0.55, BACK + 0.05);
  set.add(floor, wall, ceiling, kick, ledge, ledgeEdge, valance, cove, coveWash);

  // ---- the oval windows on the clouds (one panorama, each window shows its own slice)
  const clouds = K.canvasTex(3072, 1024, (c, W, H) => cloudsView(c, W, H, K.rng(51)));
  const WX = [-7.8, -5.2, -2.6, 0, 2.6, 5.2, 7.8], WY = 3.75;
  WX.forEach((x, i) => {
    const u0 = 0.03 + i * 0.115; // a slice as wide as the window (no stretch): a quarter of the panorama
    const win = ovalWindow({ w: 1.36, h: 1.78, tex: clouds, u0, u1: u0 + 0.25, shade: [0.32, 0.2, 0.14, 0.24, 0.18, 0.3, 0.2][i] });
    K.at(win, x, WY, BACK + 0.01);
    const halo = K.wallGlow({ w: 3.2, h: 3.4, color: "#ffc98a", strength: 0.36 });
    K.at(halo, x, WY, BACK + 0.005);
    set.add(halo, win);
  });
  // the sun pouring in: shafts from the windows toward the aisle, warm patches on the table, the seats and the carpet
  for (const [x, rz] of [[-2.6, 0.35], [0, 0.32], [2.6, 0.3]]) {
    const shaft = K.lightShaft({ w: 1.5, h: 5.4, color: 0xffd6a0, strength: 0.08 });
    shaft.position.set(x - 0.9, 2.5, -1.8);
    shaft.rotation.set(-0.95, 0, rz);
    set.add(shaft);
  }
  const patch = K.sunPatch({ w: 4.8, d: 2.2, color: 0xffcf96, strength: 0.32 });
  patch.position.set(-0.6, 0.02, 0.9);
  patch.rotation.z = 0.35;
  set.add(patch);

  // ceiling: a row of warm downlights over the seats, gaspers above the windows
  for (const x of [-6.5, -3.25, 0, 3.25, 6.5]) {
    const ring = K.cyl(0.2, 0.2, 0.04, chrome(), 32);
    ring.position.set(x, CEIL - 0.02, 0.6);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), K.glow(0xfff0d8));
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, CEIL - 0.045, 0.6);
    set.add(ring, lens);
  }

  // ---- the club seats, the table, the flutes, the bottle on ice
  const seatL = clubSeat({ seat: 0.62 });
  K.at(seatL, -2.35, 0, -1.25, 0.72);
  const seatR = clubSeat({ seat: 0.62 });
  K.at(seatR, 2.35, 0, -1.3, -0.72);
  const table = cabinTable({ h: 1.5 });
  K.at(table, 0.05, 0, -1.75);
  const f1 = flute();
  K.at(f1, -0.4, 1.5, -1.5);
  const f2 = flute({ fill: 0.5 });
  K.at(f2, 0.42, 1.5, -1.85);
  const ice = iceBucket();
  K.at(ice, 0.12, 1.5, -2.25);
  // Setty's booster: two plump cushions stacked on his seat (he is small, the seat is not)
  const booster = K.soft(1.3, 0.42, 1.2, leather(0xf6efe4), { P: 3.2, puff: 0.22, seed: 9 });
  booster.position.set(2.32, 0.62 + 0.15, -1.24);
  booster.rotation.y = -0.72;
  const booster2 = K.soft(1.12, 0.38, 1.02, leather(0xd9c8ad), { P: 3.2, puff: 0.24, seed: 10 });
  booster2.position.set(2.3, 0.62 + 0.48, -1.22);
  booster2.rotation.y = -0.6;
  set.add(seatL, seatR, table, f1, f2, ice, booster, booster2);

  // ---- lights: golden hour at altitude. The low sun behind the windows is the warm rim (it casts the long shadows
  // toward the aisle), a soft front key for the faces, a warm ambient from the cream cabin; the cove and the
  // downlights add warm practical accents.
  set.add(new THREE.HemisphereLight(0xffeedb, 0x5a4434, 1.2));
  const key = new THREE.DirectionalLight(0xfff2e6, 1.45);
  key.position.set(-3, 9, 10);
  key.target.position.set(0.2, 2, -1.5);
  const rim = new THREE.DirectionalLight(0xffb468, 3.0);
  rim.position.set(7, 5.2, -10);
  rim.target.position.set(0, 1.5, 0);
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
    winL: pl(0xffcf96, 4, -2.6, 3.8, BACK + 1.2, 6),
    winC: pl(0xffcf96, 3.5, 0, 3.8, BACK + 1.2, 6),
    winR: pl(0xffcf96, 4, 2.6, 3.8, BACK + 1.2, 6),
    table: pl(0xffe0b0, 3, 0, 5.5, -1.2, 6),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(-2.05, 4.05, -0.95);
  const settyFace = new THREE.Vector3(2.25, 2.25, -1.2);
  return {
    key, rim, lights, root: set,
    coach: { x: -2.3, y: -0.46, z: -1.1, turn: 0.72, sit: 1, phone: 1 },
    setty: { x: 2.28, y: 0.98, z: -1.18, turn: -0.42, scale: 0.68 },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 },
    },
    shots: {
      wide: { pos: [0.05, 4.1, 15.0], at: [0.05, 2.5, -1.5], fov: 42 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 }),
    },
  };
}
