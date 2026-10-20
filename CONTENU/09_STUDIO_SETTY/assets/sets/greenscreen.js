// Set "greenscreen": a rented film studio at night (reel13, the 24-hour rule). A green cyclorama (the wall curving into
// the floor) lit flat and bright, tracking crosses taped on it, black velvet drapes and a black studio around it, a pipe
// grid with cyc lights, a big softbox and a fresnel on stands, a C-stand with a black flag, sandbags, cables and
// gaffer-tape marks. In the middle, a playback monitor on a cart shows the coach keyed onto a fake dusk with a white
// sports car: the promo he wants to "blast" to 10,000 contacts (the punchline). The coach sits on an apple box in front
// of the green, phone in hand, a clapperboard at his feet; Setty sits on a road case on the right, against the green
// (orange on green, never on orange).
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4; // the cyc wall
const COVE = 1.3; // radius of the curve between the wall and the floor
const CYC = { x0: -4.8, x1: 4.2, h: 10, front: 7 }; // the green: from x0 to x1, up to h, its floor to z = front
const BOX_H = 0.68; // the apple box (his seat: between the gym bench and the podcast chair, his feet on the floor)
const CASE_H = 1.0 + 0.85; // two road cases stacked (Setty's seat)

// ---- the characters' spots (a set file owns them; the seats are placed from them)
const COACH = { x: -1.7, y: -0.46, z: -0.8, turn: 0.55 };
const SETTY = { x: 2.15, y: CASE_H - 0.31, z: -1.2, turn: -0.45, scale: 0.66 };
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

/** a cylinder from a to b (Vector3) */
function rod(a, b, r, material, seg = 12) {
  const d = new THREE.Vector3().subVectors(b, a);
  const m = K.cyl(r, r, d.length(), material, seg);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
  return m;
}

/** the cyc's green paint (gradients only, never a canvas blur). wall: brighter up top where the cyc lights hit, a soft
 *  falloff to the sides and toward the cove, faint roller streaks; cove and floor: a touch darker, scuffed by shoes */
function greenTex(part) {
  const R = K.rng(part === "wall" ? 3 : part === "cove" ? 5 : 8);
  return K.canvasTex(1024, 1024, (c, W, H) => {
    const v = c.createLinearGradient(0, 0, 0, H);
    if (part === "wall") { v.addColorStop(0, "#36b55c"); v.addColorStop(0.55, "#2aa24f"); v.addColorStop(1, "#218f43"); }
    else if (part === "cove") { v.addColorStop(0, "#218f43"); v.addColorStop(1, "#1f8a41"); }
    else { v.addColorStop(0, "#1f8a41"); v.addColorStop(1, "#1d8540"); }
    c.fillStyle = v;
    c.fillRect(0, 0, W, H);
    const side = c.createLinearGradient(0, 0, W, 0); // the sides fall off
    side.addColorStop(0, "rgba(0,30,8,0.34)");
    side.addColorStop(0.22, "rgba(0,30,8,0)");
    side.addColorStop(0.78, "rgba(0,30,8,0)");
    side.addColorStop(1, "rgba(0,30,8,0.34)");
    c.fillStyle = side;
    c.fillRect(0, 0, W, H);
    if (part === "wall") for (let i = 0; i < 70; i++) { // roller streaks
      c.fillStyle = `rgba(${R() < 0.5 ? "255,255,255" : "0,40,10"},${0.004 + R() * 0.008})`;
      c.fillRect(R() * W, 0, 20 + R() * 60, H);
    }
    else for (let i = 0; i < (part === "floor" ? 40 : 14); i++) { // scuffs and shoe marks
      c.fillStyle = `rgba(40,48,40,${0.025 + R() * 0.04})`;
      c.beginPath();
      c.ellipse(R() * W, R() * H, 6 + R() * 22, 2 + R() * 6, R() * 3, 0, Math.PI * 2);
      c.fill();
    }
  });
}

/** the green cyclorama: back wall, the cove (a quarter cylinder) and the green floor, one flat-lit paint */
function cyclorama() {
  const g = new THREE.Group();
  const w = CYC.x1 - CYC.x0, cx = (CYC.x0 + CYC.x1) / 2;
  const paint = (map) => new THREE.MeshStandardMaterial({ map, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 0.2,
    roughness: 0.95, side: THREE.DoubleSide });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(w, CYC.h - COVE), paint(greenTex("wall")));
  wall.position.set(cx, COVE + (CYC.h - COVE) / 2, BACK);
  // the cove: the quadrant of a cylinder (axis along x) between the wall (z = BACK) and the floor (y = 0)
  const cg = new THREE.CylinderGeometry(COVE, COVE, w, 40, 1, true, Math.PI, Math.PI / 2);
  cg.rotateZ(Math.PI / 2);
  const cove = new THREE.Mesh(cg, paint(greenTex("cove")));
  cove.position.set(cx, COVE, BACK + COVE);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, CYC.front - (BACK + COVE)), paint(greenTex("floor")));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(cx, 0.004, (BACK + COVE + CYC.front) / 2);
  [wall, cove, floor].forEach((m) => (m.receiveShadow = true));
  g.add(wall, cove, floor);
  // the edge of the painted floor: scuffed, a strip of black tape where it meets the studio concrete
  const edge = K.box(w, 0.012, 0.08, 0.004, K.mat(0x111113, { roughness: 0.7 }), false);
  edge.position.set(cx, 0.01, CYC.front);
  g.add(edge);
  // tracking crosses taped on the wall (kept away from Setty's head and the coach's)
  const tape = K.mat(0xd9f2dc, { roughness: 0.8 });
  for (const [x, y] of [[-4.4, 3.3], [-4.4, 6.4], [-2.3, 7.6], [-0.2, 3.1], [-0.2, 6.2], [1.9, 7.8], [3.6, 5.4], [-3.3, 9.0], [0.9, 9.2]]) {
    const a = K.box(0.34, 0.06, 0.01, 0.005, tape, false), b = K.box(0.06, 0.34, 0.01, 0.005, tape, false);
    a.position.set(x, y, BACK + 0.01);
    b.position.set(x, y, BACK + 0.012);
    g.add(a, b);
  }
  return g;
}

/** black velvet drape: a wavy plane (folds), hung from the grid */
function drape({ w = 3, h = 11, folds = 7, color = 0x0c0c0f } = {}) {
  const geo = new THREE.PlaneGeometry(w, h, folds * 10, 1);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin((p.getX(i) / w) * folds * Math.PI * 2) * 0.14);
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, K.mat(color, { roughness: 1, sheen: 1, sheenRoughness: 0.5, sheenColor: new THREE.Color(0x4a4a58) }));
  m.position.y = h / 2;
  m.receiveShadow = true;
  return m;
}

/** a light stand: a column on three splayed legs, a sandbag on one leg; the head goes at y = h */
function stand(h, { spread = 0.8, bag = true } = {}) {
  const g = new THREE.Group();
  const metal = K.mat(0x1b1c20, { metalness: 0.7, roughness: 0.35 });
  const col = K.cyl(0.035, 0.045, h, metal, 14);
  col.position.y = h / 2;
  const collar = K.cyl(0.07, 0.07, 0.12, metal, 14);
  collar.position.y = 1.05;
  g.add(col, collar);
  for (let i = 0; i < 3; i++) {
    const a = 0.4 + (i / 3) * Math.PI * 2;
    g.add(rod(V(0, 1.05, 0), V(Math.sin(a) * spread, 0.03, Math.cos(a) * spread), 0.024, metal));
  }
  if (bag) {
    const sb = K.soft(0.62, 0.2, 0.36, K.mat(0x2f3326, { roughness: 1 }), { puff: 0.25, seed: 5 });
    sb.position.set(Math.sin(0.4) * spread * 0.6, 0.16, Math.cos(0.4) * spread * 0.6);
    sb.rotation.y = 0.4 + Math.PI / 2;
    g.add(sb);
  }
  return g;
}

/** a big square softbox: a black fabric frustum, the white diffusion glowing at the front (+z) */
function softbox({ s = 1.9, depth = 1.1 } = {}) {
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(s * 0.7071, s * 0.2, depth, 4, 1, true);
  geo.rotateY(Math.PI / 4);
  geo.rotateX(Math.PI / 2); // the axis along z, the wide end at +z
  const body = new THREE.Mesh(geo, K.mat(0x121215, { roughness: 0.95, side: THREE.DoubleSide }));
  body.castShadow = true;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(s * 0.97, s * 0.97), K.glow(0xfdfbf6));
  face.position.z = depth / 2 + 0.005;
  const rim = K.box(s + 0.06, s + 0.06, 0.05, 0.02, K.mat(0x0e0e10, { roughness: 0.8 }), false);
  rim.position.z = depth / 2 - 0.02;
  const head = K.cyl(0.22, 0.22, 0.5, K.mat(0x1d1e22, { metalness: 0.5, roughness: 0.4 }), 20);
  head.rotation.x = Math.PI / 2;
  head.position.z = -depth / 2 - 0.2;
  g.add(body, rim, face, head);
  return g;
}

/** a fresnel spot: black housing along z, the warm-white lens at +z, four barn doors opened around it */
function fresnel({ r = 0.4, len = 0.85 } = {}) {
  const g = new THREE.Group();
  const black = K.mat(0x18191d, { metalness: 0.4, roughness: 0.45 });
  const geo = new THREE.CylinderGeometry(r, r * 1.05, len, 28);
  geo.rotateX(Math.PI / 2);
  const housing = new THREE.Mesh(geo, black);
  housing.castShadow = true;
  const lens = new THREE.Mesh(new THREE.CircleGeometry(r * 0.86, 36), K.glow(0xfff3dc));
  lens.position.z = len / 2 + 0.01;
  g.add(housing, lens);
  for (let k = 0; k < 6; k++) { // cooling fins
    const fin = K.cyl(r * 1.08, r * 1.08, 0.025, black, 28);
    fin.rotation.x = Math.PI / 2;
    fin.position.z = -len / 2 + 0.1 + k * 0.1;
    g.add(fin);
  }
  for (let k = 0; k < 4; k++) { // barn doors, hinged on the front ring, opened forward
    const around = new THREE.Group();
    around.rotation.z = (k * Math.PI) / 2;
    around.position.z = len / 2 + 0.02;
    const hinge = new THREE.Group();
    hinge.position.y = r;
    hinge.rotation.x = 0.55;
    const leaf = K.box(r * 1.9, 0.5, 0.02, 0.01, black);
    leaf.position.y = 0.25;
    hinge.add(leaf);
    around.add(hinge);
    g.add(around);
  }
  // the yoke
  const yoke = new THREE.Mesh(new THREE.TorusGeometry(r * 1.25, 0.03, 8, 24, Math.PI), black);
  yoke.rotation.set(Math.PI / 2, 0, Math.PI);
  g.add(yoke);
  return g;
}

/** a bi-colour LED panel: a black frame, the glowing face at +z, a small control screen on the back */
function ledPanel({ w = 1.25, h = 0.82 } = {}) {
  const g = new THREE.Group();
  const black = K.mat(0x17181b, { metalness: 0.4, roughness: 0.45 });
  const frame = K.box(w, h, 0.14, 0.04, black);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, h - 0.1), K.glow(0xf6f8ff));
  face.position.z = 0.072;
  const ctrl = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.16), K.glow(0x6fd0ff));
  ctrl.position.set(0.3, -0.18, -0.072);
  ctrl.rotation.y = Math.PI;
  const yoke = new THREE.Mesh(new THREE.TorusGeometry(h * 0.62, 0.025, 8, 24, Math.PI), black);
  yoke.rotation.set(0, Math.PI / 2, Math.PI);
  g.add(frame, face, ctrl, yoke);
  return g;
}

/** a C-stand: a turtle base, the column, a gobo arm out to the side holding a black flag */
function cStand({ h = 5.4, arm = 2.1 } = {}) {
  const g = stand(h, { spread: 0.75 });
  const metal = K.mat(0x9aa0a8, { metalness: 0.9, roughness: 0.3 });
  const knuckle = K.cyl(0.08, 0.08, 0.14, K.mat(0x202125, { metalness: 0.6 }), 14);
  knuckle.position.y = h - 0.1;
  g.add(knuckle, rod(V(-0.2, h - 0.1, 0), V(arm, h - 0.35, 0.15), 0.025, metal));
  const flag = new THREE.Group();
  const cloth = K.box(1.25, 0.95, 0.025, 0.01, K.mat(0x0b0b0d, { roughness: 1 }));
  const frame = K.box(1.3, 1.0, 0.012, 0.01, K.mat(0x8f959c, { metalness: 0.9, roughness: 0.3 }), false);
  frame.position.z = -0.012;
  flag.add(frame, cloth);
  flag.position.set(arm + 0.55, h - 0.6, 0.15);
  flag.rotation.set(0.1, -0.5, 0.06);
  g.add(flag);
  return g;
}

/** the promo on the playback monitor: the coach keyed onto a fake dusk with a white sports car (no orange in it:
 *  Setty sits near), REC, a timecode at 00:24, "TAKE 47" */
function promoShot(c, W, H) {
  const sky = c.createLinearGradient(0, 0, 0, H * 0.7);
  sky.addColorStop(0, "#151a46");
  sky.addColorStop(0.55, "#5b2b8c");
  sky.addColorStop(1, "#f06aa8");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#ffd3ea";
  c.beginPath();
  c.arc(W * 0.62, H * 0.66, H * 0.11, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#1a1438";
  c.fillRect(0, H * 0.7, W, H * 0.3);
  // a city skyline on the horizon
  c.fillStyle = "#2a1f55";
  let x = 0, k = 0;
  while (x < W) {
    const bw = 26 + ((k * 37) % 40), bh = 30 + ((k * 53) % 110);
    c.fillRect(x, H * 0.7 - bh, bw, bh);
    x += bw + 4;
    k++;
  }
  // palms
  const palm = (px, ph, lean) => {
    c.strokeStyle = "#0d0b20";
    c.lineWidth = 9;
    c.beginPath();
    c.moveTo(px, H * 0.78);
    c.quadraticCurveTo(px + lean * 0.4, H * 0.78 - ph * 0.6, px + lean, H * 0.78 - ph);
    c.stroke();
    c.fillStyle = "#0d0b20";
    for (let f = 0; f < 7; f++) {
      const a = -Math.PI / 2 + (f - 3) * 0.48;
      c.beginPath();
      c.ellipse(px + lean + Math.cos(a) * 42, H * 0.78 - ph + Math.sin(a) * 26 + 8, 50, 9, a, 0, Math.PI * 2);
      c.fill();
    }
  };
  palm(W * 0.08, H * 0.42, 22);
  palm(W * 0.9, H * 0.48, -26);
  // the white sports car: low, a long hood, the cabin set back, a rear wing
  const cx = W * 0.62, cy = H * 0.88;
  c.fillStyle = "#f4f2f7";
  c.beginPath();
  c.moveTo(cx - 262, cy - 4);
  c.lineTo(cx - 250, cy - 26);
  c.lineTo(cx - 70, cy - 46);
  c.lineTo(cx + 30, cy - 80);
  c.lineTo(cx + 130, cy - 70);
  c.lineTo(cx + 236, cy - 46);
  c.lineTo(cx + 252, cy - 4);
  c.closePath();
  c.fill();
  c.fillRect(cx + 170, cy - 82, 92, 12); // the wing
  c.fillRect(cx + 200, cy - 72, 10, 26);
  c.fillStyle = "#1c2230"; // the side window
  c.beginPath();
  c.moveTo(cx - 40, cy - 50);
  c.lineTo(cx + 34, cy - 74);
  c.lineTo(cx + 120, cy - 64);
  c.lineTo(cx + 110, cy - 48);
  c.closePath();
  c.fill();
  c.fillStyle = "#c9cbd6";
  c.fillRect(cx - 200, cy - 22, 380, 5); // the shoulder line
  for (const wx of [cx - 150, cx + 160]) {
    c.fillStyle = "#101014";
    c.beginPath();
    c.arc(wx, cy, 38, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#b8bcc8";
    c.beginPath();
    c.arc(wx, cy, 18, 0, Math.PI * 2);
    c.fill();
  }
  // the coach, keyed in on the left: white tank, black beanie, pointing at the lens
  const bx = W * 0.24, by = H;
  c.fillStyle = "#c48a64";
  c.beginPath();
  c.arc(bx, by - 300, 62, 0, Math.PI * 2); // head
  c.fill();
  c.fillRect(bx - 24, by - 250, 48, 40); // neck
  c.beginPath();
  c.ellipse(bx + 120, by - 190, 70, 26, -0.35, 0, Math.PI * 2); // the arm pointing out
  c.fill();
  c.fillStyle = "#f3f1ec";
  c.beginPath();
  c.moveTo(bx - 105, by);
  c.lineTo(bx - 92, by - 200);
  c.quadraticCurveTo(bx, by - 238, bx + 92, by - 200);
  c.lineTo(bx + 105, by);
  c.closePath();
  c.fill();
  c.fillStyle = "#141416";
  c.beginPath();
  c.arc(bx, by - 318, 64, Math.PI, Math.PI * 2); // beanie
  c.fill();
  c.fillRect(bx - 66, by - 322, 132, 22);
  c.fillStyle = "#3a2a20";
  c.beginPath();
  c.ellipse(bx, by - 262, 44, 20, 0, 0, Math.PI); // stubble
  c.fill();
  c.fillStyle = "#1a1210"; // eyes, and his promo grin
  for (const ex of [bx - 22, bx + 22]) { c.beginPath(); c.arc(ex, by - 300, 7, 0, Math.PI * 2); c.fill(); }
  c.fillStyle = "#fbf8f2";
  c.beginPath();
  c.ellipse(bx, by - 270, 24, 11, 0, 0, Math.PI);
  c.fill();
  // the monitor overlay: safe-frame corners, REC, timecode, take
  c.strokeStyle = "rgba(255,255,255,0.85)";
  c.lineWidth = 5;
  const m = 36, L = 60;
  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const ox = sx > 0 ? m : W - m, oy = sy > 0 ? m : H - m;
    c.beginPath();
    c.moveTo(ox, oy + sy * L);
    c.lineTo(ox, oy);
    c.lineTo(ox + sx * L, oy);
    c.stroke();
  }
  c.fillStyle = "#ff2a2a";
  c.beginPath();
  c.arc(80, 86, 14, 0, Math.PI * 2);
  c.fill();
  c.font = "800 40px Inter, sans-serif";
  c.textBaseline = "middle";
  c.fillStyle = "#ffffff";
  c.fillText("REC", 104, 88);
  c.textAlign = "right";
  c.fillText("00:24:00:00", W - 66, 88);
  c.font = "700 30px Inter, sans-serif";
  c.fillText("PROMO · TAKE 47", W - 66, H - 70);
}

/** a playback monitor on a rolling cart, its screen drawn by `draw` */
function monitorCart(draw, { w = 2.5, h = 1.42, y = 3.7 } = {}) {
  const g = new THREE.Group();
  const black = K.mat(0x111114, { roughness: 0.35, clearcoat: 0.6 });
  const metal = K.mat(0x26272c, { metalness: 0.7, roughness: 0.3 });
  const frame = K.box(w, h, 0.09, 0.03, black);
  frame.position.y = y;
  const tex = K.canvasTex(1024, 580, draw);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.08, h - 0.08), K.glow(0xffffff, { map: tex }));
  scr.position.set(0, y, 0.047);
  const post = K.box(0.14, y - 0.3, 0.1, 0.03, metal);
  post.position.set(0, (y - 0.3) / 2 + 0.15, -0.12);
  const base = K.box(1.3, 0.08, 0.9, 0.03, metal);
  base.position.y = 0.2;
  const shelf = K.box(0.9, 0.05, 0.6, 0.02, metal);
  shelf.position.set(0, 1.3, -0.08);
  const deck = K.box(0.6, 0.18, 0.45, 0.03, K.mat(0x1a1b1f, { roughness: 0.5 })); // a recorder on the shelf
  deck.position.set(0, 1.42, -0.08);
  const led = K.box(0.05, 0.03, 0.01, 0.004, K.glow(0xff2a2a), false);
  led.position.set(0.2, 1.46, 0.15);
  g.add(frame, scr, post, base, shelf, deck, led);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const wheel = K.cyl(0.08, 0.08, 0.06, K.mat(0x0d0d0f, { roughness: 0.8 }), 16);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(sx * 0.55, 0.08, sz * 0.36);
    g.add(wheel);
  }
  g.userData.screen = scr;
  return g;
}

/** his seat: a "full apple" box, birch plywood, a hand hole on each side */
function appleBox({ w = 1.3, h = BOX_H, d = 0.86, label = "FULL" } = {}) {
  const g = new THREE.Group();
  const ply = K.mat(0xffffff, { map: K.woodTex({ base: "#c8a273", planks: 2, seed: 12 }), roughness: 0.6 });
  const b = K.box(w, h, d, 0.03, ply);
  b.position.y = h / 2;
  g.add(b);
  const hole = K.mat(0x2a1d12, { roughness: 1 });
  for (const sx of [-1, 1]) {
    const hh = K.box(0.012, 0.13, 0.34, 0.03, hole, false);
    hh.position.set(sx * (w / 2 + 0.002), h * 0.72, 0);
    g.add(hh);
  }
  const stencil = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.22), new THREE.MeshStandardMaterial({ transparent: true,
    roughness: 0.8, map: K.canvasTex(512, 128, (c, W, H) => {
      c.font = "900 92px Inter, sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = "rgba(24,20,16,0.82)";
      c.fillText(label, W / 2, H / 2 + 4);
    }) }));
  stencil.position.set(0, h * 0.42, d / 2 + 0.004);
  stencil.scale.setScalar(Math.min(1, h / 0.8));
  g.add(stencil);
  return g;
}

/** a black road case: aluminium edges, ball corners, two latches, a word stencilled on the front (Setty sits on two) */
function roadCase({ w = 1.7, h = 1.0, d = 1.15, label = "FRAGILE", lidAt = 0.3 } = {}) {
  const g = new THREE.Group();
  const shell = K.box(w, h, d, 0.02, K.mat(0x17181b, { roughness: 0.55, clearcoat: 0.25 }));
  shell.position.y = h / 2;
  g.add(shell);
  const alu = K.mat(0xb9bec6, { metalness: 0.95, roughness: 0.28 });
  const e = 0.05;
  for (const sy of [0, h]) for (const sz of [-d / 2, d / 2]) { const r = K.box(w + 0.02, e, e, 0.01, alu); r.position.set(0, sy, sz); g.add(r); }
  for (const sx of [-w / 2, w / 2]) for (const sz of [-d / 2, d / 2]) { const r = K.box(e, h, e, 0.01, alu); r.position.set(sx, h / 2, sz); g.add(r); }
  for (const sx of [-w / 2, w / 2]) for (const sy of [0, h]) { const r = K.box(e, e, d, 0.01, alu); r.position.set(sx, sy, 0); g.add(r); }
  for (const sx of [-1, 1]) for (const sy of [0, 1]) for (const sz of [-1, 1]) {
    const ball = K.ball(0.06, alu, 14);
    ball.position.set((sx * w) / 2, sy * h, (sz * d) / 2);
    g.add(ball);
  }
  // the lid line, two butterfly latches
  const lid = K.box(w + 0.03, 0.035, d + 0.03, 0.01, alu);
  lid.position.y = h - lidAt;
  g.add(lid);
  for (const sx of [-0.45, 0.45]) {
    const latch = K.box(0.2, 0.14, 0.035, 0.015, alu);
    latch.position.set(sx, h - lidAt, d / 2 + 0.02);
    g.add(latch);
  }
  const stencil = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.32), new THREE.MeshStandardMaterial({ transparent: true,
    roughness: 0.8, map: K.canvasTex(640, 164, (c, W, H) => {
      c.font = "900 112px Inter, sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = "rgba(236,234,228,0.9)";
      c.fillText(label, W / 2, H / 2 + 6);
    }) }));
  stencil.position.set(0, (h - lidAt) * 0.48, d / 2 + 0.004);
  stencil.scale.setScalar(Math.min(1, (h - lidAt) / 0.85));
  g.add(stencil);
  return g;
}

/** the clapperboard: black slate, the striped clapper slightly open */
function clapper() {
  const g = new THREE.Group();
  const slateTex = K.canvasTex(600, 460, (c, W, H) => {
    c.fillStyle = "#141416";
    c.fillRect(0, 0, W, H);
    c.strokeStyle = "#e9e7e2";
    c.lineWidth = 5;
    c.strokeRect(14, 14, W - 28, H - 28);
    [150, 270, 370].forEach((y) => { c.beginPath(); c.moveTo(14, y); c.lineTo(W - 14, y); c.stroke(); });
    c.beginPath(); c.moveTo(W / 2, 270); c.lineTo(W / 2, 370); c.stroke();
    c.fillStyle = "#e9e7e2";
    c.font = "700 30px Inter, sans-serif";
    c.fillText("PROD.", 34, 56);
    c.fillText("SCENE", 34, 302);
    c.fillText("TAKE", W / 2 + 20, 302);
    c.font = "800 50px Inter, sans-serif";
    c.fillText("BLACK FRIDAY BLAST", 34, 120);
    c.font = "800 52px Inter, sans-serif";
    c.fillText("10K", 34, 352);
    c.fillText("47", W / 2 + 20, 352);
  });
  const slate = K.box(0.9, 0.7, 0.04, 0.01, [0, 0, 0, 0, 0, 0].map((_, i) => (i === 4 ? K.mat(0xffffff, { map: slateTex, roughness: 0.7 }) : K.mat(0x141416))));
  slate.position.y = 0.35;
  const stripes = K.canvasTex(512, 80, (c, W, H) => {
    c.fillStyle = "#f2f0eb";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#141416";
    for (let x = -H; x < W + H; x += 70) { c.beginPath(); c.moveTo(x, H); c.lineTo(x + 35, H); c.lineTo(x + 35 + H, 0); c.lineTo(x + H, 0); c.closePath(); c.fill(); }
  });
  const stickM = [0, 0, 0, 0, 0, 0].map((_, i) => (i === 4 ? K.mat(0xffffff, { map: stripes, roughness: 0.6 }) : K.mat(0x141416)));
  const low = K.box(0.92, 0.13, 0.05, 0.01, stickM);
  low.position.y = 0.76;
  const hinge = new THREE.Group();
  hinge.position.set(-0.46, 0.83, 0);
  const top = K.box(0.92, 0.13, 0.05, 0.01, stickM);
  top.position.set(0.46, 0.065, 0);
  hinge.add(top);
  hinge.rotation.z = 0.28;
  g.add(slate, low, hinge);
  return g;
}

/** a cable lying on the floor through the given [x, z] points */
function cable(points, r = 0.035) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => V(x, r + 0.006, z)));
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, r, 8), K.mat(0x0d0d0f, { roughness: 0.6 }));
  m.receiveShadow = true;
  return m;
}

/** a gaffer-tape mark on the floor: a T in orange tape */
function tapeT(color = 0xff611d) {
  const m = K.mat(color, { roughness: 0.7 });
  const a = K.box(0.5, 0.008, 0.07, 0.003, m, false), b = K.box(0.07, 0.008, 0.36, 0.003, m, false);
  b.position.z = 0.2;
  return K.group(a, b);
}

/** a cyc light hung from the grid: a black box, its glowing face aimed down at the green */
function cycLight() {
  const g = new THREE.Group();
  const body = K.box(1.1, 0.55, 0.5, 0.05, K.mat(0x17181b, { metalness: 0.4, roughness: 0.5 }));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.45), K.glow(0xf4fff6));
  face.position.z = 0.252;
  const clamp = K.box(0.08, 0.5, 0.08, 0.02, K.mat(0x9aa0a8, { metalness: 0.9 }));
  clamp.position.y = 0.45;
  g.add(body, face, clamp);
  return g;
}

export async function build({ renderer, scene, mood = "night" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.3;
  scene.background = new THREE.Color(0x0d0e11);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  // the black studio: concrete floor, black walls, the cyc in front of the back wall
  set.add(K.room({ w: 26, h: 12, d: 22, wall: "#111215", backZ: BACK - 0.6, floorMap: K.noiseTex("#2a2b2f", 12, 19),
    floorTile: 5, floorRough: 0.42, baseboard: false }));
  set.add(cyclorama());

  // black drapes on both sides of the cyc
  const dl = drape({ w: 4.2, folds: 9 });
  K.at(dl, CYC.x0 - 2.0, 0, BACK + 0.4, 0.12);
  const dr = drape({ w: 4.2, folds: 9 });
  K.at(dr, CYC.x1 + 2.0, 0, BACK + 0.4, -0.12);
  set.add(dl, dr);

  // the pipe grid and the cyc lights aimed down at the green
  const pipeM = K.mat(0x3a3c42, { metalness: 0.8, roughness: 0.35 });
  for (const z of [-2.0, 0.8]) set.add(rod(V(-9, 10.6, z), V(9, 10.6, z), 0.05, pipeM, 10));
  [-3.9, -1.3, 1.3, 3.6].forEach((x) => {
    const cl = cycLight();
    cl.position.set(x, 9.9, -2.0);
    cl.lookAt(x, 4.5, BACK); // the face toward the wall and down
    set.add(cl);
  });

  // ---- the lights on stands: the softbox (his key) front left, the fresnel (the rim) back right, a C-stand + flag
  const sbStand = stand(3.9);
  K.at(sbStand, -4.3, 0, 0.9);
  const sbx = softbox({ s: 1.9 });
  sbx.position.set(-4.3, 4.3, 0.9);
  sbx.lookAt(COACH.x, 3.6, COACH.z);
  const frStand = stand(4.9, { spread: 0.7 });
  K.at(frStand, 4.7, 0, -2.0);
  const fr = fresnel();
  fr.position.set(4.7, 5.25, -2.0);
  fr.lookAt(0.2, 3.2, -0.6);
  // an LED panel on a short stand behind him, his hair light (it glows behind him in his close-ups)
  const ledStand = stand(2.7, { spread: 0.6 });
  K.at(ledStand, -3.7, 0, -2.0);
  const led = ledPanel();
  led.position.set(-3.7, 3.05, -2.0);
  led.lookAt(COACH.x, 4.0, COACH.z);
  // behind Setty: a stack of apple boxes and sandbags at the foot of the fresnel
  const ab2 = appleBox({ w: 1.1, h: 0.42, d: 0.75, label: "HALF" });
  K.at(ab2, 3.75, 0, -1.9, -0.4);
  const ab3 = appleBox({ w: 1.1, h: 0.42, d: 0.75, label: "HALF" });
  K.at(ab3, 3.7, 0.42, -1.95, -0.15);
  const bag1 = K.soft(0.62, 0.22, 0.36, K.mat(0x2f3326, { roughness: 1 }), { puff: 0.25, seed: 9 });
  K.at(bag1, 3.0, 0.12, -2.0, 0.5);
  set.add(ledStand, led, ab2, ab3, bag1);
  const cs = cStand({ h: 5.6, arm: 1.6 });
  K.at(cs, -5.5, 0, -1.6, 0.3);
  set.add(sbStand, sbx, frStand, fr, cs);

  // ---- the playback monitor between them: the promo he wants to blast (the punchline)
  const mon = monitorCart(promoShot, { y: 3.85 });
  K.at(mon, 0.25, 0, -1.75, 0.12);
  set.add(mon);

  // ---- the seats, the slate, the floor
  const fwd = V(Math.sin(COACH.turn), 0, Math.cos(COACH.turn));
  const ab = appleBox();
  K.at(ab, COACH.x - fwd.x * 0.08, 0, COACH.z - fwd.z * 0.08, COACH.turn);
  const rc = roadCase({ w: 1.85, h: 1.0, d: 1.2, label: "CAM B", lidAt: 0.26 });
  K.at(rc, SETTY.x + 0.05, 0, SETTY.z - 0.05, SETTY.turn * 0.5);
  const rc2 = roadCase({ w: 1.5, h: 0.85, d: 1.0, label: "FRAGILE", lidAt: 0.24 });
  K.at(rc2, SETTY.x + 0.02, 1.0, SETTY.z - 0.02, SETTY.turn * 0.75);
  set.add(rc2);
  const slate = clapper();
  K.at(slate, COACH.x - 0.95, 0, COACH.z + 0.55, 0.9);
  slate.rotation.x = -0.18;
  const mark1 = tapeT();
  K.at(mark1, COACH.x + fwd.x * 1.25, 0.006, COACH.z + fwd.z * 1.25, COACH.turn);
  const mark2 = tapeT(0xf2efe8);
  K.at(mark2, 0.9, 0.006, 0.9, -0.3);
  set.add(ab, rc, slate, mark1, mark2);
  set.add(cable([[-4.3, 0.9], [-3.6, 1.6], [-2.2, 1.9], [-0.6, 1.4], [0.25, -1.4]]));
  set.add(cable([[4.7, -2.0], [4.1, -0.6], [3.4, 0.6], [1.6, 1.3], [0.4, -1.2]], 0.03));
  set.add(cable([[-5.5, -1.6], [-6.4, 0.4], [-7.0, 2.4]], 0.03));
  // a water bottle and a coffee by the apple box (the long shoot)
  const cup = K.mug(0xeeeae4, 0x2b2c31);
  K.at(cup, COACH.x + 0.95, 0, COACH.z + 0.35, 0.3);
  set.add(cup);

  // ---- lights: night, artificial. A cool-white key from the softbox side, a warm-white rim from the fresnel (it
  // casts the shadows), the cyc lit flat, a faint green spill on the backs (real green screens do that).
  set.add(new THREE.HemisphereLight(0xe2e9ff, 0x0d0e10, 0.62));
  const key = new THREE.DirectionalLight(0xf6f8ff, 1.7);
  key.position.set(-6.5, 7.5, 9.5);
  key.target.position.set(0, 2.4, -1);
  const rim = new THREE.DirectionalLight(0xfff0dc, 2.3);
  rim.position.set(6.5, 8.5, -8.5);
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
    softbox: pl(0xf7f9ff, 6, -3.4, 4.0, 0.6, 7.5),
    fresnel: pl(0xfff1da, 5, 4.0, 4.9, -1.6, 6.5),
    spill: pl(0x5cff86, 1.6, 0.2, 2.2, -2.6, 5.5),
    monitor: pl(0xb07cff, 1.2, 0.25, 3.8, -1.0, 3.5),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const cf = V(Math.sin(COACH.turn), 0, Math.cos(COACH.turn));
  const coachHead = V(COACH.x, 4.05, COACH.z).addScaledVector(cf, 0.28);
  const settyFace = V(SETTY.x, SETTY.y + 1.7 * SETTY.scale + 0.04, SETTY.z);
  const screen = V(0.25, 3.85, -1.7);
  return {
    key, rim, lights, root: set,
    coach: { x: COACH.x, y: COACH.y, z: COACH.z, turn: COACH.turn, sit: 1, phone: 1 },
    setty: { x: SETTY.x, y: SETTY.y, z: SETTY.z, turn: SETTY.turn, scale: SETTY.scale },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      // lower than the gym: the hook title takes 3 lines (like the poolside set)
      coach: { target: coachHead, dist: 12, yaw: 0.55, y: 880 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.45, pitch: 0.06, y: 900 },
    },
    shots: {
      wide: { pos: [0.2, 4.6, 15.6], at: [0.2, 3.2, -1.4], fov: 44 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.55, y: 880 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.45, pitch: 0.06, y: 900 }),
      // the punchline: the fake promo on the monitor, the screen filling the width between the title and the captions
      promo: K.shot(screen, { dist: 9.5, yaw: -0.12, pitch: 0.02, y: 920 }),
    },
  };
}
