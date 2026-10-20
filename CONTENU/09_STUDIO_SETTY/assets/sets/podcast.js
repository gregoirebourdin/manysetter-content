// Set "podcast": the coach's podcast studio in the evening (reel9, ChatGPT or Claude). Dark walls lined with acoustic
// foam (left) and hexagon felt panels in the brand colors (right), a red ON AIR light box between them, Edison bulbs
// over a walnut table, a mixer, headphones, a vinyl shelf, an arc lamp. The coach sits at the left end of the table in
// a cognac leather chair, phone in hand; Setty sits on a tall stool at the right end. Each one has his broadcast mic
// on a boom arm: face to face, like a debate show.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import * as K from "./kit.js";

const BACK = -3.4;
const TABLE_H = 1.5;

// ---- the characters' spots (a set file owns them; the mics are placed from them)
const COACH = { x: -2.45, y: -0.46, z: -0.95, turn: 1.0 };
const SETTY = { x: 2.45, y: 2.0, z: -0.95, turn: -1.0, scale: 0.74 };
const fwd = (turn) => new THREE.Vector3(Math.sin(turn), 0, Math.cos(turn));

/** a cylinder from a to b (Vector3) */
function rod(a, b, r, material) {
  const d = new THREE.Vector3().subVectors(b, a);
  const m = K.cyl(r, r, d.length(), material, 14);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return m;
}

/** wedge acoustic foam: square tiles of ridges, the ridges turning 90° from one tile to the next (one merged mesh) */
function foamWall({ cols = 8, rows = 7, tile = 0.86, ridges = 5, color = 0x24262d } = {}) {
  // a 3-sided cylinder already has one edge on +z: the ridge stands out of the wall, its back flush with it
  const geos = [], rw = tile / ridges, rr = rw * 0.62;
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
    const vertical = (c + r) % 2 === 0;
    for (let k = 0; k < ridges; k++) {
      const g = new THREE.CylinderGeometry(rr, rr, tile * 0.98, 3, 1);
      if (!vertical) g.rotateZ(Math.PI / 2);
      const off = -tile / 2 + rw / 2 + k * rw;
      g.translate(c * tile + (vertical ? off : 0), r * tile + (vertical ? 0 : off), rr / 2);
      geos.push(g);
    }
  }
  const mesh = new THREE.Mesh(mergeGeometries(geos), K.mat(color, { roughness: 1, flatShading: true }));
  mesh.receiveShadow = true;
  const back = K.box(cols * tile + 0.06, rows * tile + 0.06, 0.05, 0.01, K.mat(0x16171b, { roughness: 1 }), false);
  back.position.set((cols - 1) * tile / 2, (rows - 1) * tile / 2, 0);
  return K.group(back, mesh);
}

/** a honeycomb of felt hexagons (cells: [col, row, color] on a pointy-top grid) */
function hexWall(cells, { r = 0.56, gap = 0.05 } = {}) {
  const g = new THREE.Group();
  const w = Math.sqrt(3) * r;
  for (const [c, row, color] of cells) {
    const h = K.cyl(r - gap, r - gap, 0.1, K.mat(color, { roughness: 0.95, sheen: 0.6, sheenColor: new THREE.Color(0xffffff) }), 6);
    h.rotation.x = Math.PI / 2;
    h.position.set(c * w + (row % 2 ? w / 2 : 0), row * r * 1.5, 0.05);
    g.add(h);
  }
  return g;
}

/** the ON AIR light box: a black box, the red face glowing with the words */
function onAir({ w = 2.1, h = 0.7 } = {}) {
  const tex = K.canvasTex(1024, 340, (c, W, H) => {
    const gr = c.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, "#ff4a2a");
    gr.addColorStop(1, "#d81d10");
    c.fillStyle = gr;
    c.fillRect(0, 0, W, H);
    c.font = "800 210px Inter, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.shadowColor = "#fff3e0";
    c.shadowBlur = 26;
    c.fillStyle = "#fff6ea";
    c.fillText("ON AIR", W / 2, H / 2 + 10);
  });
  const g = new THREE.Group();
  const body = K.box(w + 0.16, h + 0.16, 0.22, 0.04, K.mat(0x111114, { roughness: 0.35, clearcoat: 0.6 }));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), K.glow(0xffffff, { map: tex }));
  face.position.z = 0.112;
  g.add(body, face);
  return g;
}

/** an Edison bulb on a long cord: brass socket, amber glass, a glowing filament (add its PointLight) */
function edison({ cord = 3 } = {}) {
  const g = new THREE.Group();
  const c = K.cyl(0.01, 0.01, cord, K.mat(0x111111), 6);
  c.position.y = cord / 2;
  const brass = K.mat(0xc79a52, { metalness: 1, roughness: 0.3 });
  const sock = K.cyl(0.07, 0.07, 0.22, brass, 20);
  sock.position.y = -0.11;
  const glass = K.ball(0.2, new THREE.MeshPhysicalMaterial({ color: 0xffb35c, emissive: 0xff8a2a, emissiveIntensity: 0.7,
    transparent: true, opacity: 0.55, roughness: 0.05, clearcoat: 1 }), 28);
  glass.scale.set(1, 1.3, 1);
  glass.position.y = -0.42;
  glass.castShadow = false;
  const fil = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 24), K.glow(0xffd9a0));
  fil.position.y = -0.4;
  g.add(c, sock, glass, fil);
  return g;
}

/** a broadcast mic on a boom arm clamped to the table: clamp at `base` (on the table top), the capsule at `mic`,
 *  aimed at `mouth` */
function boomMic(base, mic, mouth) {
  const g = new THREE.Group();
  const metal = K.mat(0x1b1c20, { metalness: 0.7, roughness: 0.32 });
  const clamp = K.box(0.18, 0.34, 0.2, 0.03, metal);
  clamp.position.copy(base).add(new THREE.Vector3(0, -0.07, 0));
  const riser = new THREE.Vector3().copy(base).add(new THREE.Vector3(0, 0.45, 0));
  const dir = new THREE.Vector3().subVectors(mouth, mic).normalize();
  const mount = new THREE.Vector3().copy(mic).addScaledVector(dir, -0.36);
  const elbow = new THREE.Vector3().lerpVectors(riser, mount, 0.42).add(new THREE.Vector3(0, 0.95, 0));
  const knuckle = K.ball(0.055, metal, 16);
  knuckle.position.copy(elbow);
  g.add(clamp, rod(base, riser, 0.035, metal), rod(riser, elbow, 0.03, metal), rod(elbow, mount, 0.026, metal), knuckle);
  // twin rods: the arm's parallel bars
  const side = new THREE.Vector3().subVectors(mount, riser).cross(new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(0.05);
  g.add(rod(riser.clone().add(side), elbow.clone().add(side), 0.014, metal), rod(elbow.clone().add(side), mount.clone().add(side), 0.012, metal));
  // the capsule: a dark body, a foam windscreen on the front, a yoke
  const cap = new THREE.Group();
  const body = K.cyl(0.13, 0.12, 0.5, K.mat(0x202125, { metalness: 0.4, roughness: 0.4, clearcoat: 0.4 }), 28);
  const screen = K.cyl(0.155, 0.155, 0.22, K.mat(0x0f0f11, { roughness: 1 }), 28);
  screen.position.y = 0.3;
  const tip = K.ball(0.155, K.mat(0x0f0f11, { roughness: 1 }), 24);
  tip.scale.y = 0.45;
  tip.position.y = 0.41;
  const ring = K.cyl(0.14, 0.14, 0.03, K.mat(0xff611d, { roughness: 0.4 }), 28);
  ring.position.y = 0.18;
  const yoke = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 8, 24, Math.PI), metal);
  yoke.rotation.set(0, Math.PI / 2, Math.PI);
  yoke.position.y = -0.02;
  cap.add(body, screen, tip, ring, yoke);
  cap.position.copy(mic);
  cap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  g.add(cap, rod(mount, mic.clone().addScaledVector(dir, -0.24), 0.03, metal));
  return g;
}

/** the walnut table: rounded top, two black trestle legs */
function table({ w = 3.2, d = 1.7, h = TABLE_H } = {}) {
  const g = new THREE.Group();
  const top = K.box(w, 0.12, d, 0.05, K.mat(0xffffff, { map: K.woodTex({ base: "#6e4429", planks: 3, seed: 8 }), roughness: 0.4, clearcoat: 0.55 }));
  top.position.y = h - 0.06;
  const metal = K.mat(0x17171a, { metalness: 0.6, roughness: 0.35 });
  for (const sx of [-1, 1]) {
    const leg = K.box(0.12, h - 0.12, d * 0.72, 0.03, metal);
    leg.position.set(sx * (w / 2 - 0.45), (h - 0.12) / 2, 0);
    const foot = K.box(0.2, 0.06, d * 0.8, 0.02, metal);
    foot.position.set(sx * (w / 2 - 0.45), 0.03, 0);
    g.add(leg, foot);
  }
  g.add(top);
  return g;
}

/** a small mixing desk: knobs, faders, a level meter */
function mixer() {
  const g = new THREE.Group();
  const base = K.box(0.86, 0.1, 0.52, 0.03, K.mat(0x1d1e22, { roughness: 0.45, clearcoat: 0.3 }));
  base.position.y = 0.05;
  base.rotation.x = -0.08;
  g.add(base);
  const knobM = K.mat(0xe9e4dc, { roughness: 0.4 }), accent = K.mat(0xff611d, { roughness: 0.4 });
  for (let c = 0; c < 4; c++) for (let r = 0; r < 2; r++) {
    const k = K.cyl(0.032, 0.036, 0.05, r === 0 && c === 1 ? accent : knobM, 14);
    k.position.set(-0.3 + c * 0.13, 0.13, -0.15 + r * 0.1);
    g.add(k);
    const f = K.box(0.04, 0.035, 0.06, 0.01, knobM);
    f.position.set(-0.3 + c * 0.13, 0.12, 0.12 - (c % 3) * 0.035);
    g.add(f);
  }
  for (let k = 0; k < 6; k++) {
    const led = K.box(0.05, 0.02, 0.025, 0.005, K.glow(k < 4 ? 0x5dff8a : k === 4 ? 0xffc84a : 0xff4a2a), false);
    led.position.set(0.3, 0.115, 0.15 - k * 0.045);
    g.add(led);
  }
  return g;
}

/** studio headphones lying on the table */
function headphones() {
  const g = new THREE.Group();
  const dark = K.mat(0x1a1a1e, { roughness: 0.4, clearcoat: 0.4 });
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 10, 32, Math.PI), dark);
  band.castShadow = true;
  band.rotation.x = -Math.PI / 2;
  band.position.y = 0.06;
  g.add(band);
  for (const sx of [-1, 1]) {
    const cup = K.cyl(0.14, 0.14, 0.1, dark, 24);
    cup.position.set(sx * 0.3, 0.07, 0);
    const pad = K.cyl(0.12, 0.12, 0.04, K.mat(0xff611d, { roughness: 0.8 }), 24);
    pad.position.set(sx * 0.3, 0.13, 0);
    g.add(cup, pad);
  }
  return g;
}

/** the coach's chair: cognac leather, a swivel base */
function leatherChair() {
  const g = new THREE.Group();
  const leather = K.mat(0x8a4a24, { roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 });
  const seat = K.soft(1.35, 0.3, 1.25, leather, { puff: 0.12, seed: 4 });
  seat.position.set(0, 0.58, -0.05);
  const back = K.soft(1.35, 1.5, 0.3, leather, { puff: 0.1, seed: 6 });
  back.position.set(0, 1.35, -0.72);
  back.rotation.x = -0.16;
  const metal = K.mat(0x1c1c20, { metalness: 0.7, roughness: 0.3 });
  const shell = K.box(1.45, 0.12, 1.32, 0.05, K.mat(0x2a1a12, { roughness: 0.5 }));
  shell.position.y = 0.4;
  const post = K.cyl(0.07, 0.07, 0.3, metal, 16);
  post.position.y = 0.2;
  g.add(seat, back, shell, post);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = K.box(0.08, 0.06, 0.62, 0.02, metal);
    leg.position.set(Math.sin(a) * 0.3, 0.05, Math.cos(a) * 0.3);
    leg.rotation.y = a;
    g.add(leg);
  }
  return g;
}

/** Setty's tall stool: a round cushion, four splayed legs, a foot ring */
function stool({ h = 2.36 } = {}) {
  const g = new THREE.Group();
  const seat = K.cyl(0.62, 0.58, 0.16, K.mat(0x2a2b31, { roughness: 0.5, clearcoat: 0.4 }), 40);
  seat.position.y = h - 0.08;
  const metal = K.mat(0x1b1b1f, { metalness: 0.7, roughness: 0.3 });
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i / 4) * Math.PI * 2;
    g.add(rod(new THREE.Vector3(Math.sin(a) * 0.4, h - 0.16, Math.cos(a) * 0.4), new THREE.Vector3(Math.sin(a) * 0.62, 0, Math.cos(a) * 0.62), 0.03, metal));
  }
  const ringM = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.025, 8, 40), K.mat(0xc79a52, { metalness: 1, roughness: 0.3 }));
  ringM.rotation.x = Math.PI / 2;
  ringM.position.y = h * 0.36;
  g.add(seat, ringM);
  return g;
}

/** an arc floor lamp: marble base, a steel arc, a dome shade glowing inside (add its PointLight) */
function arcLamp({ reach = 2.2, h = 5.6 } = {}) {
  const g = new THREE.Group();
  const base = K.cyl(0.3, 0.34, 0.22, K.mat(0xeeeae4, { roughness: 0.25, clearcoat: 0.6 }), 32);
  base.position.y = 0.11;
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0, h + 0.8, 0), new THREE.Vector3(-reach, h - 0.6, 0));
  const arc = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.035, 10), K.mat(0xc9ccd2, { metalness: 1, roughness: 0.25 }));
  arc.castShadow = true;
  const shade = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), K.mat(0xc9ccd2, { metalness: 1, roughness: 0.25, side: THREE.DoubleSide }));
  shade.position.set(-reach, h - 0.75, 0);
  const bulb = K.ball(0.16, K.glow(0xffd6a0), 20);
  bulb.position.set(-reach, h - 0.8, 0);
  g.add(base, arc, shade, bulb);
  return g;
}

/** framed print: an orange sound wave on cream (his podcast's cover art) */
function waveArt(c, W, H) {
  c.fillStyle = "#efe6d8";
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#ff611d";
  const n = 26, bw = (W * 0.7) / n;
  for (let i = 0; i < n; i++) {
    const a = Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37)) * 0.8 + 0.08;
    const bh = H * 0.42 * a;
    c.beginPath();
    c.roundRect(W * 0.15 + i * bw, H * 0.45 - bh / 2, bw * 0.62, bh, bw * 0.3);
    c.fill();
  }
  c.fillStyle = "#1f2433";
  c.fillRect(W * 0.15, H * 0.8, W * 0.7, 6);
}

/** a rectangular rug: deep rust with a cream border */
function rugTex() {
  return K.canvasTex(1024, 640, (c, W, H) => {
    c.fillStyle = "#5a2a1c";
    c.fillRect(0, 0, W, H);
    c.strokeStyle = "#e8dccb";
    c.lineWidth = 22;
    c.strokeRect(40, 40, W - 80, H - 80);
    c.lineWidth = 6;
    c.strokeRect(84, 84, W - 168, H - 168);
    c.fillStyle = "rgba(0,0,0,0.12)";
    for (let i = 0; i < 2600; i++) c.fillRect((i * 97) % W, (i * 53) % H, 2, 2);
  });
}

export async function build({ renderer, scene, mood = "evening" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.36;
  scene.background = new THREE.Color(0x15161b);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 20, h: 11, d: 18, wall: "#22242c", floor: "#6a4630", backZ: BACK, baseboard: false }));

  // ---- the back wall: foam behind the coach, the ON AIR box in the middle, hexagons behind Setty
  const foam = foamWall({ cols: 8, rows: 8, tile: 0.86 });
  K.at(foam, -8.2, 0.9, BACK + 0.04);
  const foamWash = K.wallGlow({ w: 7, h: 5, color: "#ff6a22", strength: 0.32 });
  K.at(foamWash, -4.4, 3.6, BACK + 0.3);
  const air = onAir();
  K.at(air, 0, 5.95, BACK + 0.12);
  const airWash = K.wallGlow({ w: 4.4, h: 2.4, color: "#ff2a12", strength: 0.55 });
  K.at(airWash, 0, 5.95, BACK + 0.08);
  // behind Setty (orange) the cells stay cream, charcoal and slate: one orange cell only, away from his head
  const O = 0xff611d, CR = 0xe8dfd2, CH = 0x34363f, SL = 0x4a5a66;
  const hex = hexWall([
    [1, 0, CH], [2, 0, SL], [0, 1, CR], [1, 1, CH], [2, 1, CH], [3, 1, CR], [0, 2, CH], [1, 2, SL], [2, 2, CR],
    [3, 2, CH], [1, 3, CH], [2, 3, CH], [3, 3, SL], [0, 4, CR], [1, 4, CH], [2, 4, O], [4, 2, CH], [4, 3, CR],
  ]);
  K.at(hex, 1.9, 2.4, BACK + 0.02);
  const art = K.poster({ w: 1.3, h: 1.3, draw: waveArt });
  K.at(art, -1.65, 4.25, BACK + 0.1);
  // his podcast's name in neon on the foam, behind him in his close-ups (left of what the wide shot sees)
  const neon = K.neonSign("SCALE TALK", { color: "#ff5a1f", w: 2.3, h: 0.7, font: "italic 800 140px 'Nohemi', Inter, sans-serif" });
  K.at(neon, -5.95, 5.5, BACK + 0.3);
  set.add(foam, foamWash, air, airWash, hex, art, neon);

  // ---- the right corner: a vinyl shelf, a plant, the arc lamp
  const shelf = K.shelf({ w: 2.4, seed: 44 });
  K.at(shelf, 6.4, 4.7, BACK + 0.28);
  const plantR = K.plant({ h: 3.0, n: 11, seed: 27 });
  K.at(plantR, 7.2, 0, -2.4);
  const lampR = arcLamp({ reach: 2.0, h: 5.8 });
  K.at(lampR, 6.0, 0, -1.6);
  const plantL = K.plant({ h: 2.6, n: 9, seed: 31 });
  K.at(plantL, -6.6, 0, -2.3);
  set.add(shelf, plantR, lampR, plantL);

  // ---- the table, the chairs, the mics
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(9, 5), K.mat(0xffffff, { map: rugTex(), roughness: 1,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.03, -0.6);
  rug.receiveShadow = true;
  const tbl = table({ w: 2.8, d: 1.7 });
  K.at(tbl, 0, 0, -1.05);
  const chair = leatherChair();
  K.at(chair, COACH.x - 0.15, 0, COACH.z - 0.05, COACH.turn);
  const st = stool();
  K.at(st, SETTY.x, 0, SETTY.z);
  const mix = mixer();
  K.at(mix, 0.05, TABLE_H, -1.35, 0.05);
  const hp = headphones();
  K.at(hp, 0.85, TABLE_H, -0.75, -0.5);
  const mug = K.mug(0x1d1e22, 0xff611d);
  K.at(mug, -0.85, TABLE_H, -0.45, 0.4);
  const glass = K.cyl(0.1, 0.09, 0.32, new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, roughness: 0.05,
    transparent: true, opacity: 0.35 }), 24);
  glass.position.set(1.05, TABLE_H + 0.16, -1.55);
  set.add(rug, tbl, chair, st, mix, hp, mug, glass);

  // the mics: below each mouth and to the table's side, aimed up at it, so they never cover a mouth in the
  // close-ups (mouths measured on the seated characters: the coach's at y 2.65, Setty's at 2.9)
  const fc = fwd(COACH.turn), fs = fwd(SETTY.turn);
  const coachMouth = new THREE.Vector3(COACH.x, 2.65, COACH.z).addScaledVector(fc, 0.88);
  const coachMic = coachMouth.clone().addScaledVector(fc, 0.7).add(new THREE.Vector3(0.55, -0.5, -0.1));
  const settyMouth = new THREE.Vector3(SETTY.x, 2.9, SETTY.z).addScaledVector(fs, 0.63);
  const settyMic = settyMouth.clone().addScaledVector(fs, 0.6).add(new THREE.Vector3(-0.6, -0.45, -0.1));
  set.add(boomMic(new THREE.Vector3(-1.15, TABLE_H, -1.75), coachMic, coachMouth));
  set.add(boomMic(new THREE.Vector3(1.15, TABLE_H, -1.75), settyMic, settyMouth));

  // Edison bulbs over the table
  // Edison bulbs over the table, wide apart: they frame the ON AIR box in the wide shot without covering it
  const bulbs = [[-1.5, 5.0, -0.7], [1.5, 5.3, -0.75]].map(([x, cord, z]) => {
    const b = edison({ cord });
    K.at(b, x, 11 - cord, z);
    set.add(b);
    return b;
  });

  // ---- lights: evening, warm. A soft front key for the faces, an amber rim from behind (the shadows), the bulbs,
  // the ON AIR box and the lamp as practicals.
  set.add(new THREE.HemisphereLight(0xffe2c6, 0x2a1c16, 0.9));
  const key = new THREE.DirectionalLight(0xfff0e2, 1.5);
  key.position.set(0.5, 8.5, 11);
  key.target.position.set(0, 2.4, -1.2);
  const rim = new THREE.DirectionalLight(0xffb070, 2.4);
  rim.position.set(3.5, 8, -9);
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
    bulbs: bulbs.map((b) => pl(0xffb46b, 4.5, b.position.x, b.position.y - 0.5, b.position.z, 6.5)),
    onAir: pl(0xff3a1c, 5, 0, 5.9, BACK + 0.9, 5.5),
    lamp: pl(0xffcf94, 5, 4.0, 4.7, -1.6, 6),
    foam: pl(0xff7a33, 3, -4.4, 2.6, BACK + 1.0, 6),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(COACH.x, 4.05, COACH.z).addScaledVector(fc, 0.28);
  const settyFace = new THREE.Vector3(SETTY.x, SETTY.y + 1.7 * SETTY.scale + 0.04, SETTY.z);
  return {
    key, rim, lights, root: set,
    coach: { x: COACH.x, y: COACH.y, z: COACH.z, turn: COACH.turn, sit: 1, phone: 1 },
    setty: { x: SETTY.x, y: SETTY.y, z: SETTY.z, turn: SETTY.turn, scale: SETTY.scale },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.72, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.72, pitch: 0.06, y: 800 },
    },
    shots: {
      wide: { pos: [0, 3.7, 16.2], at: [0, 3.05, -1.2], fov: 43 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.72, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.72, pitch: 0.06, y: 800 }),
    },
  };
}
