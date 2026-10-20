// Set "boxing": a boxing ring at night (reel21, human setter or AI setter). The coach stages a fight, "human versus AI,
// winner gets my inbox": a raised ring with a worn grey-blue canvas, white ropes on padded corner posts (his corner red
// on the left, Setty's corner blue on the right), a black truss of spotlights over the ring with light cones in the haze;
// beyond the ropes, the dark gym (painted block wall, heavy bags on chains, a "HUMAN vs AI" fight poster, a round timer,
// the ring bell on the timekeeper's table). He sits on his corner stool, phone in hand, his red gloves hanging on the side rope by the
// laces, a bucket and a water bottle at his feet; Setty sits across on his own stool, on a stack of folded towels (he is
// small, the stool is not), the blue pad behind him.
// build() adds the ring, the gym and their lights to the scene and returns where the characters go and the camera shots.
// The ring pieces (corner post and pad, rope, corner stool, folded towels, gloves, bucket, bottle, heavy bag, bell, timer, truss)
// live here: no other set uses them yet.
import * as THREE from "three";
import * as K from "./kit.js";

const PL = { x: -3.85, z: -4.3 }; // his corner post (red), behind his head in his close-up
const PR = { x: 3.35, z: -4.3 }; // Setty's corner post (blue), behind Setty in his close-up
const ROPES = [1.25, 2.45, 3.65]; // rope heights above the canvas
const APRON = 0.75; // canvas beyond the ropes, then the drop
const DROP = 2.6; // ring height above the gym floor
const FLOOR = -DROP;
const WALL = -13; // the gym's back wall

// ---------------- textures (canvas painters; never ctx.filter: the headless Chrome renders it black) ----------------
function canvasMat() { // worn grey-blue ring canvas: mottled, scuffed, a faint centre circle
  const R = K.rng(77);
  return K.canvasTex(1024, 1024, (c, W, H) => {
    c.fillStyle = "#5b6d8c";
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) { // soft mottling
      const x = R() * W, y = R() * H, r = 20 + R() * 90;
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      const d = R() < 0.5;
      g.addColorStop(0, d ? "rgba(40, 52, 70, 0.10)" : "rgba(220, 230, 240, 0.07)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      c.fillStyle = g;
      c.fillRect(x - r, y - r, r * 2, r * 2);
    }
    for (let i = 0; i < 140; i++) { // scuffs (sneaker and shoe marks)
      c.strokeStyle = `rgba(30, 36, 46, ${0.05 + R() * 0.09})`;
      c.lineWidth = 1 + R() * 3;
      const x = R() * W, y = R() * H, a = R() * Math.PI, l = 10 + R() * 50;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + (R() - 0.5) * 10, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
      c.stroke();
    }
    const img = c.getImageData(0, 0, W, H); // canvas weave grain
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (R() - 0.5) * 10;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    c.putImageData(img, 0, 0);
  }, { repeat: [1, 1] });
}

function blockWallTex() { // painted cinder blocks, dark slate
  const R = K.rng(19);
  return K.canvasTex(1024, 1024, (c, W, H) => {
    c.fillStyle = "#1b1f27";
    c.fillRect(0, 0, W, H);
    const rows = 8, cols = 4, bh = H / rows, bw = W / cols, m = 6;
    for (let r = 0; r < rows; r++) {
      const off = r % 2 ? bw / 2 : 0;
      for (let k = -1; k <= cols; k++) {
        const x = k * bw + off, v = 40 + Math.floor(R() * 10);
        c.fillStyle = `rgb(${v}, ${v + 5}, ${v + 14})`;
        c.fillRect(x + m / 2, r * bh + m / 2, bw - m, bh - m);
        c.fillStyle = "rgba(255, 255, 255, 0.035)";
        c.fillRect(x + m / 2, r * bh + m / 2, bw - m, 3);
        for (let n = 0; n < 60; n++) {
          c.fillStyle = `rgba(0, 0, 0, ${R() * 0.18})`;
          c.fillRect(x + m / 2 + R() * (bw - m - 4), r * bh + m / 2 + R() * (bh - m - 4), 2 + R() * 3, 2 + R() * 3);
        }
      }
    }
  });
}

function posterArt(c, W, H) { // an old-school fight poster: HUMAN vs AI
  c.fillStyle = "#eadcbf";
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#b8232c";
  c.fillRect(0, 0, W, H * 0.13);
  c.fillRect(0, H * 0.9, W, H * 0.1);
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillStyle = "#eadcbf";
  c.font = "800 52px Inter, sans-serif";
  c.fillText("FIGHT NIGHT", W / 2, H * 0.065);
  c.fillStyle = "#16233f";
  c.font = "900 132px Inter, sans-serif";
  c.fillText("HUMAN", W / 2, H * 0.3);
  c.fillStyle = "#b8232c";
  c.font = "italic 800 92px Inter, sans-serif";
  c.fillText("vs", W / 2, H * 0.46);
  c.fillStyle = "#16233f";
  c.font = "900 210px Inter, sans-serif";
  c.fillText("AI", W / 2, H * 0.63);
  c.fillStyle = "#3a3a3a";
  c.font = "700 34px Inter, sans-serif";
  c.fillText("WINNER GETS THE INBOX", W / 2, H * 0.8);
  c.fillStyle = "#eadcbf";
  c.font = "800 40px Inter, sans-serif";
  c.fillText("TONIGHT", W / 2, H * 0.95);
  const g = c.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.95); // aged edges
  g.addColorStop(0, "rgba(90, 60, 20, 0)");
  g.addColorStop(1, "rgba(90, 60, 20, 0.35)");
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
}

// ---------------- materials ----------------
const steel = (color = 0x2a2c31) => K.mat(color, { metalness: 0.7, roughness: 0.32, clearcoat: 0.3 });
const vinyl = (color) => K.mat(color, { roughness: 0.38, clearcoat: 0.55, clearcoatRoughness: 0.3 });
const ropeMat = () => K.mat(0xf4f3ef, { roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 });
const leather = (color) => K.mat(color, { roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.25 });

// ---------------- ring pieces ----------------
/** a straight rope (or strap, or chain) from a to b */
function rope(a, b, r = 0.075, material = ropeMat(), seg = 18) {
  const v = new THREE.Vector3().subVectors(b, a), len = v.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), material);
  m.position.copy(a).addScaledVector(v, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.normalize());
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** a corner post: the steel post and its tall turnbuckle pad (turned to face the ring), a cap on top */
function cornerPost(color, face) {
  const g = new THREE.Group();
  const post = K.cyl(0.13, 0.13, 4.4, steel(), 24);
  post.position.y = 4.4 / 2 - 0.3;
  const pad = K.box(0.62, 3.1, 0.62, 0.13, vinyl(color));
  pad.position.y = 0.95 + 1.55;
  pad.rotation.y = face;
  const cap = K.cyl(0.16, 0.18, 0.1, steel(0x1a1b1f), 24);
  cap.position.y = 4.12;
  // two thin white bands on the pad (the classic piping)
  for (const y of [1.12, 3.88]) {
    const band = K.box(0.66, 0.05, 0.66, 0.03, K.mat(0xf2f0ea, { roughness: 0.5 }), false);
    band.position.y = y;
    band.rotation.y = face;
    g.add(band);
  }
  g.add(post, pad, cap);
  return g;
}

/** the classic boxer's corner stool: a padded black seat on a steel frame; its seat top at `seat` */
function cornerStool({ seat = 0.62 } = {}) {
  const g = new THREE.Group();
  const top = K.soft(1.1, 0.16, 0.95, vinyl(0x17181c), { P: 3.6, puff: 0.14, seed: 4 });
  top.position.y = seat - 0.08;
  const frame = steel(0x1f2025);
  const rail = K.box(1.0, 0.06, 0.86, 0.02, frame);
  rail.position.y = seat - 0.2;
  g.add(top, rail);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const leg = rope(new THREE.Vector3(sx * 0.42, seat - 0.2, sz * 0.36), new THREE.Vector3(sx * 0.5, 0, sz * 0.44), 0.035, frame, 10);
    const foot = K.cyl(0.06, 0.06, 0.03, K.mat(0x0d0d0f, { roughness: 0.9 }), 12);
    foot.position.set(sx * 0.5, 0.015, sz * 0.44);
    g.add(leg, foot);
  }
  const brace = rope(new THREE.Vector3(-0.46, 0.22, 0.4), new THREE.Vector3(0.46, 0.22, 0.4), 0.025, frame, 8);
  const brace2 = rope(new THREE.Vector3(-0.46, 0.22, -0.4), new THREE.Vector3(0.46, 0.22, -0.4), 0.025, frame, 8);
  g.add(brace, brace2);
  g.userData.top = seat;
  return g;
}

/** a stack of folded towels (Setty's booster); its top at `top` */
function towelStack({ n = 3, base = 0.62 } = {}) {
  const g = new THREE.Group();
  const cols = [0xf6f4ef, 0xeeeae2, 0xf6f4ef, 0xe9e6de];
  let y = base;
  for (let i = 0; i < n; i++) {
    const h = 0.17;
    const t = K.soft(1.0 - i * 0.04, h, 0.78 - i * 0.03, K.mat(cols[i % cols.length], { roughness: 1, sheen: 1,
      sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.9 }), { P: 2.8, puff: 0.22, wrinkle: 0.015, seed: 11 + i });
    t.position.set((i % 2 ? 0.03 : -0.02), y + h / 2, (i % 2 ? -0.02 : 0.02));
    t.rotation.y = (i % 2 ? 0.06 : -0.05);
    g.add(t);
    y += h - 0.01;
  }
  g.userData.top = y;
  return g;
}

/** a boxing glove (laced), hanging thumb forward; origin at the cuff top */
function glove(color = 0xc4161f) {
  const g = new THREE.Group();
  const L = leather(color);
  const fist = K.soft(0.5, 0.66, 0.5, L, { P: 2.6, puff: 0.18, seed: 21 });
  fist.position.y = -0.62;
  const thumb = K.soft(0.17, 0.36, 0.2, L, { P: 2.4, puff: 0.2, seed: 22 });
  thumb.position.set(0.2, -0.5, 0.18);
  thumb.rotation.z = -0.35;
  const cuff = K.cyl(0.19, 0.22, 0.4, L, 24);
  cuff.position.y = -0.18;
  const white = K.cyl(0.225, 0.225, 0.06, K.mat(0xf2f0ea, { roughness: 0.5 }), 24);
  white.position.y = -0.33;
  g.add(fist, thumb, cuff, white);
  return g;
}

/** the corner bucket: white with a red rim, a sponge on top */
function bucket() {
  const g = new THREE.Group();
  const prof = [[0, 0], [0.26, 0], [0.3, 0.05], [0.34, 0.58], [0.36, 0.62], [0.33, 0.62]].map(([r, y]) => new THREE.Vector2(r, y));
  const b = new THREE.Mesh(new THREE.LatheGeometry(prof, 36), K.mat(0xf1efe9, { roughness: 0.45, clearcoat: 0.4, side: THREE.DoubleSide }));
  b.castShadow = true;
  b.receiveShadow = true;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.025, 8, 40), K.mat(0xc4161f, { roughness: 0.4 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.62;
  const water = new THREE.Mesh(new THREE.CircleGeometry(0.31, 32), K.mat(0x9fb6c9, { roughness: 0.1, clearcoat: 1 }));
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.5;
  const sponge = K.soft(0.32, 0.12, 0.2, K.mat(0xf2c94c, { roughness: 1 }), { P: 3, puff: 0.2, seed: 31 });
  sponge.position.set(0.05, 0.58, 0.02);
  sponge.rotation.set(0.2, 0.5, 0.1);
  g.add(b, rim, water, sponge);
  return g;
}

/** a squeeze water bottle (white, a black cap) */
function bottle() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.12, 0], [0.13, 0.04], [0.13, 0.5], [0.11, 0.58], [0.06, 0.62]]
    .map(([r, y]) => new THREE.Vector2(r, y)), 28), K.mat(0xf3f2ee, { roughness: 0.35, clearcoat: 0.6 }));
  body.castShadow = true;
  const cap = K.cyl(0.055, 0.06, 0.12, K.mat(0x17181c, { roughness: 0.5 }), 16);
  cap.position.y = 0.67;
  const nozzle = K.cyl(0.02, 0.03, 0.08, K.mat(0x17181c, { roughness: 0.5 }), 12);
  nozzle.position.y = 0.77;
  g.add(body, cap, nozzle);
  return g;
}

/** a heavy bag on chains, its top at y 0 of the group (hang the group from the ceiling height) */
function heavyBag({ h = 3.0, r = 0.52, color = 0x16171a, band = 0xb8232c, chain = 2.4 } = {}) {
  const g = new THREE.Group();
  const prof = [];
  for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI / 2; prof.push([r * Math.sin(a), -h + r * 0.35 * (1 - Math.cos(a))]); }
  for (let i = 12; i >= 0; i--) { const a = (i / 12) * Math.PI / 2; prof.push([r * Math.sin(a), -r * 0.25 * (1 - Math.cos(a))]); }
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(Math.max(0.001, x), y)), 36), leather(color));
  body.castShadow = true;
  const b1 = K.cyl(r + 0.012, r + 0.012, 0.22, leather(band), 36);
  b1.position.y = -h * 0.3;
  const b2 = K.cyl(r + 0.012, r + 0.012, 0.08, K.mat(0xf2f0ea, { roughness: 0.5 }), 36);
  b2.position.y = -h * 0.3 - 0.17;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 8, 20), steel(0x8a8d93));
  ring.position.y = chain * 0.25;
  g.add(body, b1, b2, ring);
  for (let k = 0; k < 3; k++) { // three chains up to the swivel, one up to the ceiling
    const a = (k / 3) * Math.PI * 2;
    g.add(rope(new THREE.Vector3(Math.cos(a) * r * 0.75, -0.02, Math.sin(a) * r * 0.75), new THREE.Vector3(0, chain * 0.25, 0), 0.018, steel(0x6d7076), 6));
  }
  g.add(rope(new THREE.Vector3(0, chain * 0.25, 0), new THREE.Vector3(0, chain, 0), 0.02, steel(0x6d7076), 6));
  return g;
}

/** the ring bell on its wooden plaque */
function ringBell() {
  const g = new THREE.Group();
  const plaque = K.box(0.7, 0.9, 0.08, 0.03, K.mat(0x5b3a22, { roughness: 0.5, clearcoat: 0.6 }));
  plaque.position.y = 0.45;
  const brass = K.mat(0xd6a94e, { metalness: 0.95, roughness: 0.22 });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.27, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), brass);
  dome.rotation.x = Math.PI / 2;
  dome.position.set(0, 0.48, 0.06);
  const knob = K.ball(0.05, brass, 16);
  knob.position.set(0, 0.48, 0.34);
  g.add(plaque, dome, knob);
  return g;
}

/** the timekeeper's table: a small dark wood table */
function table({ w = 1.8, d = 0.8, h = 2.5 } = {}) {
  const g = new THREE.Group();
  const top = K.box(w, 0.08, d, 0.02, K.mat(0x2a211c, { roughness: 0.5, clearcoat: 0.3 }));
  top.position.y = h - 0.04;
  g.add(top);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const leg = K.cyl(0.04, 0.04, h - 0.08, steel(0x1c1d21), 10);
    leg.position.set(sx * (w / 2 - 0.1), (h - 0.08) / 2, sz * (d / 2 - 0.08));
    g.add(leg);
  }
  g.userData.top = h;
  return g;
}

/** the gym's round timer: a black LED panel, "ROUND 1" over red digits "3:00" */
function roundTimer({ w = 1.7, h = 0.86 } = {}) {
  const g = new THREE.Group();
  const body = K.box(w, h, 0.14, 0.04, K.mat(0x0c0d10, { roughness: 0.4, clearcoat: 0.5 }));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, h - 0.1), K.glow(0xffffff, { map: K.canvasTex(512, 256, (c, W, H) => {
    c.fillStyle = "#050506";
    c.fillRect(0, 0, W, H);
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#d9dbe0";
    c.font = "800 34px Inter, sans-serif";
    c.fillText("ROUND 1", W / 2, H * 0.17);
    for (const [blur, a] of [[24, 0.55], [8, 0.9], [0, 1]]) { // LED glow with shadows, never ctx.filter
      c.shadowColor = "#ff2d2d";
      c.shadowBlur = blur;
      c.globalAlpha = a;
      c.fillStyle = "#ff3b3b";
      c.font = "800 150px Inter, sans-serif";
      c.fillText("3:00", W / 2, H * 0.62);
    }
  }) }));
  face.position.z = 0.072;
  g.add(body, face);
  return g;
}

/** a spotlight can hanging from the truss, pointing down, its lens glowing */
function spotCan() {
  const g = new THREE.Group();
  const can = K.cyl(0.24, 0.3, 0.55, steel(0x111214), 24);
  can.position.y = -0.3;
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.25, 28), K.glow(0xfff4e2));
  lens.rotation.x = Math.PI / 2;
  lens.position.y = -0.58;
  const yoke = K.box(0.66, 0.06, 0.08, 0.02, steel(0x111214), false);
  yoke.position.y = 0.02;
  g.add(can, lens, yoke);
  return g;
}

export async function build({ renderer, scene, mood = "night" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.32;
  scene.background = new THREE.Color(0x0a0c11);
  scene.fog = new THREE.Fog(0x0a0c11, 22, 46);
  void mood;

  const set = new THREE.Group();
  scene.add(set);

  // ---- the ring: the raised platform, its canvas, the apron skirt
  const x0 = PL.x - APRON, x1 = PR.x + APRON, zb = PL.z - APRON, zf = 10;
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, zf - zb), K.mat(0xffffff, { map: canvasMat(), roughness: 0.95 }));
  canvas.rotation.x = -Math.PI / 2;
  canvas.position.set((x0 + x1) / 2, 0, (zb + zf) / 2);
  canvas.receiveShadow = true;
  set.add(canvas);
  // the canvas edge, padded and wrapped, then the skirt down to the gym floor (navy with a white stripe)
  const skirtTex = K.canvasTex(512, 256, (c, W, H) => {
    c.fillStyle = "#18213a";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#e9e6de";
    c.fillRect(0, H * 0.12, W, H * 0.05);
  }, { repeat: [1, 1] });
  const skirt = (w, x, z, ry) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, DROP), K.mat(0xffffff, { map: skirtTex, roughness: 0.9 }));
    m.position.set(x, -DROP / 2, z);
    m.rotation.y = ry;
    m.receiveShadow = true;
    return m;
  };
  set.add(skirt(x1 - x0, (x0 + x1) / 2, zb, 0), skirt(zf - zb, x0, (zb + zf) / 2, -Math.PI / 2), skirt(zf - zb, x1, (zb + zf) / 2, Math.PI / 2));
  const edgeMat = vinyl(0x18213a);
  const edgeB = K.box(x1 - x0 + 0.16, 0.16, 0.16, 0.06, edgeMat);
  edgeB.position.set((x0 + x1) / 2, 0.02, zb);
  const edgeL = K.box(0.16, 0.16, zf - zb, 0.06, edgeMat);
  edgeL.position.set(x0, 0.02, (zb + zf) / 2);
  const edgeR = K.box(0.16, 0.16, zf - zb, 0.06, edgeMat);
  edgeR.position.set(x1, 0.02, (zb + zf) / 2);
  set.add(edgeB, edgeL, edgeR);

  // ---- the corner posts (his red, Setty's blue) and the ropes: the back side, the two sides toward the camera
  const postL = cornerPost(0xc4161f, Math.PI / 4);
  K.at(postL, PL.x, 0, PL.z);
  const postR = cornerPost(0x1f4fc4, -Math.PI / 4);
  K.at(postR, PR.x, 0, PR.z);
  set.add(postL, postR);
  const rm = ropeMat();
  for (const h of ROPES) {
    set.add(rope(new THREE.Vector3(PL.x, h, PL.z), new THREE.Vector3(PR.x, h, PR.z), 0.075, rm));
    set.add(rope(new THREE.Vector3(PL.x, h, PL.z), new THREE.Vector3(PL.x, h, zf), 0.075, rm));
    set.add(rope(new THREE.Vector3(PR.x, h, PR.z), new THREE.Vector3(PR.x, h, zf), 0.075, rm));
  }
  // rope spacers: navy straps tying the ropes together, at the thirds of the back side
  const strapMat = K.mat(0x18213a, { roughness: 0.8 });
  for (const f of [1 / 3, 2 / 3]) {
    const x = PL.x + (PR.x - PL.x) * f;
    set.add(rope(new THREE.Vector3(x, ROPES[0] - 0.05, PL.z), new THREE.Vector3(x, ROPES[2] + 0.05, PL.z), 0.06, strapMat, 4));
  }
  for (const [x, z] of [[PL.x, PL.z + 4.2], [PR.x, PR.z + 4.2]]) {
    set.add(rope(new THREE.Vector3(x, ROPES[0] - 0.05, z), new THREE.Vector3(x, ROPES[2] + 0.05, z), 0.06, strapMat, 4));
  }

  // ---- his corner: the stool, the bucket, the bottle, his red gloves hanging on the top rope by the laces
  const stoolC = cornerStool({ seat: 0.62 });
  K.at(stoolC, -2.6, 0, -2.1, 0.6);
  const bk = bucket();
  K.at(bk, -3.35, 0, -1.0);
  const bt = bottle();
  K.at(bt, -1.55, 0, -2.95, 0.3);
  const g1 = glove();
  g1.position.set(-1.95, ROPES[2] - 0.02, PL.z + 0.1);
  g1.rotation.set(0.06, 0.25, 0.06);
  const g2 = glove();
  g2.position.set(-1.5, ROPES[2] - 0.14, PL.z + 0.12);
  g2.rotation.set(-0.05, -0.3, -0.08);
  const lace = rope(new THREE.Vector3(-1.95, ROPES[2] + 0.07, PL.z + 0.02), new THREE.Vector3(-1.5, ROPES[2] + 0.07, PL.z + 0.02), 0.015, K.mat(0xf2f0ea), 6);
  set.add(stoolC, bk, bt, g1, g2, lace);
  // ---- Setty's corner: his stool and the stack of towels he sits on
  const stoolS = cornerStool({ seat: 0.62 });
  K.at(stoolS, 2.3, 0, -2.3, -0.4);
  const stack = towelStack({ n: 4, base: 0.62 });
  K.at(stack, 2.3, 0, -2.3, -0.4);
  set.add(stoolS, stack);

  // ---- the gym beyond the ropes: the floor, the block walls, the poster, the heavy bags, the timekeeper's table
  const gymFloor = new THREE.Mesh(new THREE.PlaneGeometry(44, 30), K.mat(0xffffff, { map: K.rubberTex({ base: "#141518",
    fleck: ["#3a3d44", "#24262b", "#4a4f5a"] }), roughness: 0.85 }));
  gymFloor.material.map.repeat.set(20, 14);
  gymFloor.rotation.x = -Math.PI / 2;
  gymFloor.position.set(0, FLOOR, -2);
  gymFloor.receiveShadow = true;
  const wallTex = blockWallTex();
  wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.repeat.set(9, 4);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(44, 18), K.mat(0xffffff, { map: wallTex, roughness: 0.95 }));
  back.position.set(0, FLOOR + 9, WALL);
  back.receiveShadow = true;
  const sideTex = blockWallTex();
  sideTex.wrapS = sideTex.wrapT = THREE.RepeatWrapping;
  sideTex.repeat.set(5, 4);
  const sideL = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), K.mat(0xffffff, { map: sideTex, roughness: 0.95 }));
  sideL.position.set(-14, FLOOR + 9, 0);
  sideL.rotation.y = Math.PI / 2;
  const sideR = sideL.clone();
  sideR.position.set(14, FLOOR + 9, 0);
  sideR.rotation.y = -Math.PI / 2;
  set.add(gymFloor, back, sideL, sideR);
  // the fight poster, lit by a small warm wall lamp
  const poster = K.poster({ w: 2.3, h: 3.2, draw: posterArt, frame: 0x101114 });
  K.at(poster, -0.35, 4.1, WALL + 0.05);
  const posterGlow = K.wallGlow({ w: 5.5, h: 5.5, color: "#ffcf96", strength: 0.32 });
  K.at(posterGlow, -0.35, 4.3, WALL + 0.02);
  const lampArm = K.box(0.08, 0.08, 0.6, 0.02, steel(0x111214), false);
  lampArm.position.set(-0.35, 6.05, WALL + 0.3);
  const lampHood = K.cyl(0.08, 0.26, 0.24, steel(0x111214), 20);
  lampHood.position.set(-0.35, 6.0, WALL + 0.62);
  lampHood.rotation.x = 0.5;
  set.add(poster, posterGlow, lampArm, lampHood);
  // a second poster, far right, and the gym's round timer (red LED digits)
  const poster2 = K.poster({ w: 1.6, h: 2.2, frame: 0x101114, draw: (c, W, H) => {
    c.fillStyle = "#1e2a44"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "#e9e6de"; c.lineWidth = 10; c.strokeRect(24, 24, W - 48, H - 48);
    c.fillStyle = "#e9e6de"; c.textAlign = "center"; c.font = "900 92px Inter, sans-serif";
    c.fillText("TRAIN", W / 2, H * 0.44); c.fillText("HARD", W / 2, H * 0.6);
  } });
  K.at(poster2, 6.2, 3.2, WALL + 0.05);
  const timer = roundTimer();
  K.at(timer, 4.6, 5.0, WALL + 0.08);
  set.add(poster2, timer);
  // heavy bags hanging between the ring and the wall
  const CEIL = 12;
  for (const [x, z, h, band] of [[-7.2, -8.6, 3.1, 0xb8232c], [-3.1, -9.6, 2.8, 0x1f4fc4], [4.6, -9.0, 3.1, 0xb8232c], [8.4, -7.8, 2.9, 0x1f4fc4]]) {
    const bag = heavyBag({ h, band, chain: CEIL - (FLOOR + 1.0 + h) });
    bag.position.set(x, FLOOR + 1.0 + h, z);
    bag.rotation.y = x * 0.3;
    set.add(bag);
  }
  // the timekeeper's table at ringside, the bell on it (its top just above the canvas)
  const tk = table({ w: 2.0, d: 0.9, h: DROP + 0.12 });
  K.at(tk, 0.7, FLOOR, zb - 1.0);
  const bell = ringBell();
  K.at(bell, 0.85, 0.12, zb - 1.15, -0.15);
  set.add(tk, bell);

  // ---- the lighting truss over the ring: four black beams, six spot cans, light cones in the haze
  const TY = 9.6, tx0 = PL.x - 0.4, tx1 = PR.x + 0.4, tz0 = PL.z + 0.2, tz1 = 4.5;
  const beam = (a, b) => rope(a, b, 0.17, steel(0x0f1012), 8);
  set.add(beam(new THREE.Vector3(tx0, TY, tz0), new THREE.Vector3(tx1, TY, tz0)), beam(new THREE.Vector3(tx0, TY, tz1), new THREE.Vector3(tx1, TY, tz1)),
    beam(new THREE.Vector3(tx0, TY, tz0), new THREE.Vector3(tx0, TY, tz1)), beam(new THREE.Vector3(tx1, TY, tz0), new THREE.Vector3(tx1, TY, tz1)));
  const cans = [[-2.6, tz0], [0, tz0], [2.4, tz0], [-2.6, tz1], [0, tz1], [2.4, tz1]];
  for (const [x, z] of cans) {
    const s = spotCan();
    K.at(s, x, TY - 0.15, z);
    set.add(s);
  }
  // the cones: long soft shafts from the back row of cans down to the canvas (faint: never a wash behind a face)
  for (const [x, rz, op] of [[-2.6, 0.05, 0.05], [0, 0, 0.06], [2.4, -0.05, 0.05]]) {
    const shaft = K.lightShaft({ w: 2.2, h: 9.2, color: 0xfff1da, strength: op });
    shaft.position.set(x, TY - 4.7, tz0 + 0.4);
    shaft.rotation.z = rz;
    set.add(shaft);
  }
  // the pool of light on the canvas under the truss
  const pool = K.sunPatch({ w: 8.5, d: 7.5, color: 0xfff0d6, strength: 0.1 });
  pool.position.set((PL.x + PR.x) / 2, 0.015, 0.2);
  set.add(pool);

  // ---- lights: fight night. The ring lights from above are the key (hard shadows under the stools), a soft front
  // fill keeps the faces readable, a cool blue rim from the back of the gym outlines both characters; the corners glow
  // their colour a little, the poster lamp and the round timer are the practicals in the dark.
  set.add(new THREE.HemisphereLight(0xc9d6ff, 0x16141a, 0.85));
  const key = new THREE.DirectionalLight(0xfff3e4, 2.1);
  key.position.set(1.2, 14, 5);
  key.target.position.set(-0.2, 1.2, -2.0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 6;
  key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 34 });
  const fill = new THREE.DirectionalLight(0xffeedd, 0.75);
  fill.position.set(-2, 5, 14);
  fill.target.position.set(0, 2.5, -2);
  const rim = new THREE.DirectionalLight(0x8fb2ff, 2.4);
  rim.position.set(-2, 7, -14);
  rim.target.position.set(0, 2, -1.5);
  set.add(key, key.target, fill, fill.target, rim, rim.target);
  const pl = (color, intensity, x, y, z, distance = 6) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lights = {
    red: pl(0xff4a4a, 2.2, PL.x + 0.6, 3.2, PL.z + 0.6, 4.5),
    blue: pl(0x5f8bff, 3.2, PR.x - 0.5, 3.0, PR.z + 0.6, 4.5),
    poster: pl(0xffcf96, 6, -0.35, 5.6, WALL + 1.5, 6),
    timer: pl(0xff3b3b, 2.5, 4.6, 5.0, WALL + 1.0, 4),
    ring: pl(0xfff0dc, 4, -0.2, 7.5, -0.8, 10),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(-2.35, 4.05, -1.85);
  const settyFace = new THREE.Vector3(2.3, 2.15, -2.3);
  const sTop = stack.userData.top;
  return {
    key, rim, lights, root: set,
    coach: { x: -2.6, y: -0.46, z: -2.1, turn: 0.6, sit: 1, phone: 1 },
    setty: { x: 2.3, y: sTop - 0.3, z: -2.3, turn: -0.4, scale: 0.66 },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 820 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 },
    },
    shots: {
      wide: { pos: [-0.15, 4.7, 16.4], at: [-0.15, 2.25, -2.0], fov: 42 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 }),
    },
  };
}
