// Set "boardroom": a boardroom at the top of a glass tower, in the afternoon (reel18, DM ads). A long lacquered walnut
// table, empty executive chairs, a big wall screen with his ad dashboard ("Messaging conversations started: 300", a
// rising chart) on a wood-slat wall, a floor-to-ceiling window on glass towers and a blue sky, a glass whiteboard with a
// funnel doodle, plants, a conference speakerphone. The coach stands at the end of the table, by the screen, like he is
// presenting; Setty sits on the table, the only one at the meeting.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4;
const TABLE = { x: 1.5, z: -0.95, l: 5.6, d: 1.9, h: 1.4 };
const COACH = { x: -1.95, z: -0.5, turn: 0.42 };
const SETTY = { x: 1.5, y: TABLE.h - 0.3, z: -0.42, turn: -0.42, scale: 0.66 };
const TV = { x: -0.2, y: 4.75, w: 4.3, h: 2.42 };

// ---------------- the view: glass towers in the afternoon, seen from high up ----------------
function towersView(c, W, H, R) {
  const sky = c.createLinearGradient(0, 0, 0, H * 0.62);
  sky.addColorStop(0, "#4f93d8");
  sky.addColorStop(0.6, "#9cc6ec");
  sky.addColorStop(1, "#e4eef5");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  // the sun's glare, top right (the warm rim of the set comes from there)
  const sun = c.createRadialGradient(W * 0.9, H * 0.08, 0, W * 0.9, H * 0.08, W * 0.55);
  sun.addColorStop(0, "rgba(255,250,230,0.95)");
  sun.addColorStop(0.18, "rgba(255,240,205,0.5)");
  sun.addColorStop(1, "rgba(255,240,205,0)");
  c.fillStyle = sun;
  c.fillRect(0, 0, W, H);
  // soft clouds (stacked translucent ellipses, no ctx.filter)
  for (let k = 0; k < 6; k++) {
    const cx = R() * W, cy = H * (0.06 + R() * 0.24), s = 60 + R() * 110;
    for (let j = 0; j < 7; j++) {
      c.fillStyle = `rgba(255,255,255,${0.1 + R() * 0.12})`;
      c.beginPath();
      c.ellipse(cx + (R() - 0.5) * s * 2.2, cy + (R() - 0.5) * s * 0.35, s * (0.5 + R() * 0.6), s * (0.18 + R() * 0.16), 0, 0, Math.PI * 2);
      c.fill();
    }
  }
  const HOR = H * 0.5;
  const tower = (x, w, top, base, col, lit, rows = 40, cols = 6) => {
    c.fillStyle = col;
    c.fillRect(x, top, w, base - top);
    // glass grid
    c.fillStyle = "rgba(220,235,248,0.22)";
    const rh = (base - top) / rows, cw = w / cols;
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      if (R() < 0.25) continue;
      c.fillRect(x + q * cw + cw * 0.12, top + r * rh + rh * 0.18, cw * 0.76, rh * 0.62);
    }
    // the sunlit edge and a sky reflection
    c.fillStyle = lit;
    c.fillRect(x + w * 0.86, top, w * 0.14, base - top);
    const refl = c.createLinearGradient(x, top, x + w, top + (base - top) * 0.6);
    refl.addColorStop(0, "rgba(190,220,250,0.28)");
    refl.addColorStop(0.5, "rgba(190,220,250,0)");
    c.fillStyle = refl;
    c.fillRect(x, top, w, base - top);
  };
  // far skyline: pale, hazy, a few towers taller than us
  for (let x = -20; x < W; ) {
    const w = 30 + R() * 70, top = HOR - (R() < 0.25 ? 120 + R() * 220 : 10 + R() * 70);
    tower(x, w, top, H, `rgb(${150 + R() * 20},${176 + R() * 16},${200 + R() * 14})`, "rgba(255,236,205,0.45)", 30, 4);
    if (R() < 0.15) { c.fillStyle = "#a9bdd0"; c.fillRect(x + w * 0.45, top - 60, 4, 60); }
    x += w + R() * 10;
  }
  // haze over the far city
  const haze = c.createLinearGradient(0, HOR - 120, 0, HOR + 160);
  haze.addColorStop(0, "rgba(230,240,248,0)");
  haze.addColorStop(0.5, "rgba(230,240,248,0.55)");
  haze.addColorStop(1, "rgba(230,240,248,0.2)");
  c.fillStyle = haze;
  c.fillRect(0, HOR - 120, W, 280);
  // mid towers: glassier, bluer, below the eye line
  for (let x = -40; x < W; ) {
    const w = 80 + R() * 140, top = HOR + 30 + R() * 140;
    tower(x, w, top, H, `rgb(${92 + R() * 25},${125 + R() * 25},${160 + R() * 25})`, "rgba(255,226,180,0.6)", 34, 7);
    c.fillStyle = "rgba(235,242,248,0.85)"; // the roof
    c.fillRect(x, top - 6, w, 8);
    x += w + 14 + R() * 26;
  }
  // two near towers, big and dark, framing the view at the bottom corners
  tower(-30, W * 0.24, H * 0.72, H, "#3f5a78", "rgba(255,220,170,0.55)", 22, 6);
  tower(W * 0.8, W * 0.26, H * 0.78, H, "#465f7d", "rgba(255,220,170,0.55)", 18, 6);
  const low = c.createLinearGradient(0, H * 0.6, 0, H);
  low.addColorStop(0, "rgba(220,232,244,0)");
  low.addColorStop(1, "rgba(220,232,244,0.18)");
  c.fillStyle = low;
  c.fillRect(0, H * 0.6, W, H * 0.4);
}

// ---------------- his ad dashboard (the wall screen) ----------------
function dashboard(c, W, H) {
  const rr = (x, y, w, h, r, fill) => { c.fillStyle = fill; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); };
  c.fillStyle = "#0d1421";
  c.fillRect(0, 0, W, H);
  // top bar
  c.fillStyle = "#131c2c";
  c.fillRect(0, 0, W, 96);
  c.fillStyle = "#e9eef7";
  c.font = "700 44px Inter, sans-serif";
  c.textBaseline = "middle";
  c.fillText("Campaign results", 56, 50);
  c.fillStyle = "#3ddc84";
  c.beginPath();
  c.arc(470, 50, 9, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#8fa3bf";
  c.font = "600 32px Inter, sans-serif";
  c.fillText("Active", 490, 51);
  c.textAlign = "right";
  c.fillText("Last 7 days", W - 56, 51);
  c.textAlign = "left";
  // the chart, going up (left: the coach stands in front of this side; the number stays clear of his head)
  rr(48, 130, 712, 470, 26, "#152238");
  c.strokeStyle = "#22314b";
  c.lineWidth = 2;
  for (let k = 0; k < 5; k++) {
    c.beginPath();
    c.moveTo(88, 200 + k * 92);
    c.lineTo(720, 200 + k * 92);
    c.stroke();
  }
  const pts = [[88, 548], [193, 520], [298, 502], [403, 440], [508, 400], [613, 300], [720, 214]];
  const area = c.createLinearGradient(0, 214, 0, 568);
  area.addColorStop(0, "rgba(77,163,255,0.55)");
  area.addColorStop(1, "rgba(77,163,255,0)");
  c.fillStyle = area;
  c.beginPath();
  c.moveTo(88, 568);
  pts.forEach(([x, y]) => c.lineTo(x, y));
  c.lineTo(720, 568);
  c.closePath();
  c.fill();
  c.strokeStyle = "#4da3ff";
  c.lineWidth = 9;
  c.lineJoin = "round";
  c.beginPath();
  pts.forEach(([x, y], k) => (k ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.stroke();
  c.fillStyle = "#ffffff";
  for (const [x, y] of pts) { c.beginPath(); c.arc(x, y, 10, 0, Math.PI * 2); c.fill(); }
  // the metric he is proud of (right)
  rr(792, 130, 760, 470, 26, "#152238");
  c.fillStyle = "#8fa3bf";
  c.font = "600 34px Inter, sans-serif";
  c.textBaseline = "middle";
  c.fillText("Results", 836, 196);
  c.fillStyle = "#dfe7f3";
  c.font = "700 44px Inter, sans-serif";
  c.fillText("Messaging conversations", 836, 262);
  c.fillText("started", 836, 316);
  c.fillStyle = "#ffffff";
  c.font = "800 240px Inter, sans-serif";
  c.textBaseline = "alphabetic";
  c.fillText("300", 824, 560);
  // three small tiles (demo values: the reader's situation, never a result)
  const tiles = [["Amount spent", "$1,230"], ["Cost per conversation", "$4.10"], ["Reach", "38,912"]];
  tiles.forEach(([label, value], k) => {
    const x = 48 + k * 508;
    rr(x, 636, 488, 220, 22, "#152238");
    c.fillStyle = "#8fa3bf";
    c.font = "600 32px Inter, sans-serif";
    c.textBaseline = "middle";
    c.fillText(label, x + 40, 700);
    c.fillStyle = "#ffffff";
    c.font = "800 80px Inter, sans-serif";
    c.fillText(value, x + 40, 788);
  });
}

/** a slim wall-mounted screen showing a canvas texture */
function wallScreen({ w, h, map }) {
  const g = new THREE.Group();
  const bezel = K.box(w + 0.12, h + 0.12, 0.08, 0.03, K.mat(0x0c0c0e, { roughness: 0.3, clearcoat: 0.8 }));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(w, h), K.glow(0xffffff, { map }));
  scr.material.color.setScalar(0.94);
  scr.position.z = 0.045;
  g.add(bezel, scr);
  return g;
}

/** a glass whiteboard on stand-offs, with a marker doodle (the funnel he drew before the meeting) */
function glassBoard({ w = 2.0, h = 2.5 } = {}) {
  const g = new THREE.Group();
  const glass = K.box(w, h, 0.04, 0.02, new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.08, transmission: 0.6,
    transparent: true, opacity: 0.35 }), false);
  const doodle = K.canvasTex(512, Math.round((512 * h) / w), (c, W, H) => {
    c.clearRect(0, 0, W, H);
    c.lineCap = c.lineJoin = "round";
    c.strokeStyle = "#1d3b8f";
    c.lineWidth = 7;
    // a funnel
    c.beginPath();
    c.moveTo(W * 0.14, H * 0.2); c.lineTo(W * 0.86, H * 0.2); c.lineTo(W * 0.6, H * 0.5); c.lineTo(W * 0.6, H * 0.66);
    c.lineTo(W * 0.4, H * 0.72); c.lineTo(W * 0.4, H * 0.5); c.closePath();
    c.stroke();
    c.fillStyle = "#1d3b8f";
    c.font = "700 44px 'Comic Sans MS', 'Marker Felt', Inter, sans-serif";
    c.textAlign = "center";
    c.fillText("ADS", W * 0.5, H * 0.17);
    c.fillText("DMs", W * 0.5, H * 0.4);
    c.fillStyle = "#e0452a";
    c.fillText("$$$", W * 0.5, H * 0.86);
    c.strokeStyle = "#e0452a";
    c.lineWidth = 6;
    c.beginPath(); c.moveTo(W * 0.5, H * 0.74); c.lineTo(W * 0.5, H * 0.8); c.stroke();
  });
  const ink = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, h - 0.1), new THREE.MeshBasicMaterial({ map: doodle, transparent: true }));
  ink.position.z = 0.025;
  const steel = K.mat(0xc9ccd1, { metalness: 0.9, roughness: 0.25 });
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const s = K.cyl(0.04, 0.04, 0.12, steel, 16);
    s.rotation.x = Math.PI / 2;
    s.position.set(sx * (w / 2 - 0.12), sy * (h / 2 - 0.12), -0.04);
    g.add(s);
  }
  g.add(glass, ink);
  return g;
}

/** the long boardroom table: a walnut top with a clear lacquer, two dark pedestals, a cable box in the middle */
function conferenceTable({ l, d, h }) {
  const g = new THREE.Group();
  const walnut = K.mat(0xffffff, { map: K.woodTex({ base: "#5b3b27", planks: 3, seed: 8 }), roughness: 0.28, clearcoat: 0.9, clearcoatRoughness: 0.12 });
  const top = K.box(l, 0.12, d, 0.05, walnut);
  top.position.y = h - 0.06;
  const dark = K.mat(0x1c1c20, { roughness: 0.4, metalness: 0.5 });
  for (const sx of [-1, 1]) {
    const ped = K.box(0.55, h - 0.12, d * 0.5, 0.04, dark);
    ped.position.set(sx * (l / 2 - 1.05), (h - 0.12) / 2, 0);
    const foot = K.box(0.75, 0.05, d * 0.62, 0.02, dark);
    foot.position.set(sx * (l / 2 - 1.05), 0.025, 0);
    g.add(ped, foot);
  }
  const port = K.box(0.7, 0.025, 0.2, 0.01, K.mat(0x121214, { roughness: 0.35, metalness: 0.4 }));
  port.position.set(-0.6, h + 0.012, -0.1);
  g.add(top, port);
  return g;
}

/** an executive office chair (faces +z): leather seat and back, armrests, gas lift, five-star base on casters */
function execChair({ color = 0x1b1c20, seed = 1 } = {}) {
  const g = new THREE.Group();
  const leather = K.mat(color, { roughness: 0.45, clearcoat: 0.35 });
  const alu = K.mat(0xc4c8ce, { metalness: 0.9, roughness: 0.28 });
  const seat = K.soft(0.95, 0.22, 0.9, leather, { P: 3.4, puff: 0.12, seed });
  seat.position.y = 1.0;
  const back = K.soft(0.92, 1.55, 0.2, leather, { P: 3.0, puff: 0.08, seed: seed + 1 });
  back.position.set(0, 1.92, -0.42);
  back.rotation.x = -0.12;
  const spine = K.box(0.14, 0.75, 0.08, 0.03, alu);
  spine.position.set(0, 1.3, -0.5);
  spine.rotation.x = -0.2;
  g.add(seat, back, spine);
  for (const sx of [-1, 1]) {
    const post = K.box(0.07, 0.36, 0.07, 0.02, alu);
    post.position.set(sx * 0.5, 1.22, -0.02);
    const pad = K.box(0.11, 0.06, 0.55, 0.025, leather);
    pad.position.set(sx * 0.5, 1.42, 0.02);
    g.add(post, pad);
  }
  const lift = K.cyl(0.055, 0.055, 0.72, alu, 16);
  lift.position.y = 0.52;
  g.add(lift);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + 0.3;
    const spoke = K.box(0.62, 0.07, 0.1, 0.03, alu);
    spoke.position.set(Math.cos(a) * 0.3, 0.17, Math.sin(a) * 0.3);
    spoke.rotation.y = -a;
    const caster = K.ball(0.07, K.mat(0x111113, { roughness: 0.5 }), 12);
    caster.position.set(Math.cos(a) * 0.6, 0.07, Math.sin(a) * 0.6);
    g.add(spoke, caster);
  }
  return g;
}

/** a conference speakerphone: a dark rounded triangle with a soft status ring */
function speakerphone() {
  const g = new THREE.Group();
  const s = new THREE.Shape(), R = 0.42, r = 0.1;
  const corners = [0, 1, 2].map((k) => { const a = (k / 3) * Math.PI * 2 + Math.PI / 2; return [Math.cos(a) * R, Math.sin(a) * R]; });
  corners.forEach(([x, y], k) => {
    const [px, py] = corners[(k + 2) % 3], [nx, ny] = corners[(k + 1) % 3];
    const ax = x + (px - x) * (r / R), ay = y + (py - y) * (r / R), bx = x + (nx - x) * (r / R), by = y + (ny - y) * (r / R);
    if (k === 0) s.moveTo(ax, ay); else s.lineTo(ax, ay);
    s.quadraticCurveTo(x, y, bx, by);
  });
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 });
  const body = new THREE.Mesh(geo, K.mat(0x26272c, { roughness: 0.5 }));
  body.rotation.x = -Math.PI / 2;
  body.castShadow = body.receiveShadow = true;
  const grill = K.cyl(0.17, 0.17, 0.012, K.mat(0x3a3b42, { roughness: 0.8 }), 32);
  grill.position.y = 0.09;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 8, 40), K.glow(0x5fd38a));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.092;
  g.add(body, grill, ring);
  return g;
}

/** a closed laptop, a glass of water, a notepad and pen (the table's still life) */
function laptop() {
  const g = new THREE.Group();
  const alu = K.mat(0xc9ccd2, { metalness: 0.75, roughness: 0.3 });
  const base = K.box(1.05, 0.05, 0.72, 0.03, alu);
  base.position.y = 0.025;
  const lid = K.box(1.05, 0.035, 0.72, 0.03, alu);
  lid.position.y = 0.068;
  g.add(base, lid);
  return g;
}
function waterGlass() {
  const g = new THREE.Group();
  const glass = K.cyl(0.11, 0.095, 0.36, new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, roughness: 0.04,
    thickness: 0.05, transparent: true, opacity: 0.35 }), 24);
  glass.position.y = 0.18;
  const water = K.cyl(0.097, 0.088, 0.22, new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transmission: 0.9, roughness: 0.05,
    transparent: true, opacity: 0.45 }), 24);
  water.position.y = 0.12;
  g.add(glass, water);
  return g;
}
function notepad() {
  const g = new THREE.Group();
  const pad = K.box(0.5, 0.03, 0.68, 0.01, K.mat(0xf6f3ec, { roughness: 0.85 }));
  pad.position.y = 0.015;
  const pen = K.cyl(0.018, 0.018, 0.5, K.mat(0x1d1e22, { roughness: 0.3, clearcoat: 0.6 }), 10);
  pen.rotation.set(Math.PI / 2, 0, 0.25);
  pen.position.set(0.32, 0.03, 0);
  g.add(pad, pen);
  return g;
}

/** a slim linear pendant over the table */
function linearPendant({ l = 4.8, cord = 3.6 } = {}) {
  const g = new THREE.Group();
  const bar = K.box(l, 0.1, 0.3, 0.03, K.mat(0x16161a, { roughness: 0.4, metalness: 0.4 }));
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(l - 0.12, 0.2), K.glow(0xfff3dc));
  strip.rotation.x = Math.PI / 2;
  strip.position.y = -0.052;
  g.add(bar, strip);
  for (const sx of [-1, 1]) {
    const w = K.cyl(0.008, 0.008, cord, K.mat(0x222226, { roughness: 0.5 }), 6);
    w.position.set(sx * (l / 2 - 0.3), cord / 2, 0);
    g.add(w);
  }
  return g;
}

export async function build({ renderer, scene, mood = "afternoon" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  try { await Promise.all([document.fonts.load("800 100px Inter"), document.fonts.load("600 100px Inter")]); } catch { /* fallback font */ }
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45;
  scene.background = new THREE.Color(0xbfc8d2);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 20, h: 11, d: 20, backZ: BACK, wall: "#cdc7bd", floorMap: K.noiseTex("#383b42", 16, 12), floorTile: 2.5,
    floorRough: 0.95 }));

  // ---- the window wall (right): floor to ceiling, glass towers in the afternoon sun
  const win = K.cityWindow({ w: 6.6, h: 7.4, view: towersView, blinds: 0, panes: [3, 2], frame: 0x1b1c20, bright: 1.0, seed: 52 });
  K.at(win, 5.0, 3.8, BACK + 0.02);
  const winGlow = K.wallGlow({ w: 9, h: 8, color: "#dcebff", strength: 0.3 });
  K.at(winGlow, 4.6, 4.0, BACK + 0.06);
  const shaft = K.lightShaft({ w: 3.4, h: 7.0, color: 0xffe6c0, strength: 0.1 });
  shaft.position.set(3.0, 3.2, -1.4);
  shaft.rotation.set(-0.5, 0, -0.5);
  const patch = K.sunPatch({ w: 3.2, d: 1.6, color: 0xffdcae, strength: 0.22 });
  patch.position.set(0.6, 0.02, 0.6);
  patch.rotation.z = -0.4;
  set.add(win, winGlow, shaft, patch);

  // ---- the screen wall (left): wood slats, the big screen with his dashboard, the glass whiteboard
  const slats = K.slatPanel({ w: 7.2, h: 8.2, n: 30, color: 0x8a5a3a });
  K.at(slats, -2.0, 4.1, BACK + 0.03);
  const tv = wallScreen({ w: TV.w, h: TV.h, map: K.canvasTex(1600, 900, dashboard) });
  K.at(tv, TV.x, TV.y, BACK + 0.2);
  const tvGlow = K.wallGlow({ w: 6.4, h: 4.0, color: "#3d6dff", strength: 0.22 });
  K.at(tvGlow, TV.x, TV.y, BACK + 0.14);
  const board = glassBoard({ w: 1.9, h: 2.5 });
  K.at(board, -4.55, 4.3, BACK + 0.16);
  set.add(slats, tv, tvGlow, board);

  // ---- the table, the empty chairs, the still life
  const tbl = conferenceTable(TABLE);
  K.at(tbl, TABLE.x, 0, TABLE.z);
  set.add(tbl);
  const T = TABLE.h;
  [[-2.05, -0.2], [-0.9, 0.14], [1.2, -0.1]].forEach(([x, ry], k) => {
    const ch = execChair({ seed: 3 + k });
    K.at(ch, TABLE.x + x, 0, TABLE.z - TABLE.d / 2 - 0.62, ry);
    set.add(ch);
  });
  const endChair = execChair({ seed: 9 });
  K.at(endChair, TABLE.x + TABLE.l / 2 + 0.75, 0, TABLE.z - 0.1, -Math.PI / 2 + 0.25);
  set.add(endChair);
  const phone = speakerphone();
  K.at(phone, 0.35, T, -0.65, 0.2);
  const lap = laptop();
  K.at(lap, -0.7, T, -1.3, 0.18);
  const g1 = waterGlass();
  K.at(g1, 1.95, T, -1.6);
  const g2 = waterGlass();
  K.at(g2, 0.1, T, -1.65);
  const pad1 = notepad();
  K.at(pad1, 0.6, T, -1.5, 0.06);
  const pad2 = notepad();
  K.at(pad2, 2.7, T, -1.45, -0.08);
  const cup = K.mug(0xf2eee8, 0xff611d);
  K.at(cup, -0.95, T, -0.4, 0.5);
  set.add(phone, lap, g1, g2, pad1, pad2, cup);

  // plants: a tall one in the screen-wall corner, one by the window
  const plantL = K.plant({ h: 3.6, n: 12, seed: 23 });
  K.at(plantL, -4.35, 0, -2.55);
  const plantR = K.plant({ h: 3.0, n: 10, pot: 0x2a2b30, seed: 41 });
  K.at(plantR, 3.95, 0, -2.6);
  set.add(plantL, plantR);

  const pend = linearPendant({ l: 4.8, cord: 3.4 });
  K.at(pend, TABLE.x, 7.6, TABLE.z);
  set.add(pend);

  // ---- lights: afternoon daylight. The sun through the window is the warm rim (it casts the shadows), a cool sky
  // fill, a soft front key for the faces; the screen and the pendant add practical accents.
  set.add(new THREE.HemisphereLight(0xe6f0ff, 0x3b3631, 1.1));
  const key = new THREE.DirectionalLight(0xfff7ef, 1.45);
  key.position.set(-3, 9, 10);
  key.target.position.set(0.3, 2.4, -1);
  const rim = new THREE.DirectionalLight(0xffe2b4, 2.5);
  rim.position.set(9, 7.5, -8);
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
    window: pl(0xe2efff, 5, 4.6, 4.0, BACK + 1.4, 8),
    screen: pl(0x9fbfff, 3, TV.x, TV.y - 0.3, BACK + 1.3, 5),
    pendant: pl(0xfff2dc, 4, TABLE.x, 6.9, TABLE.z, 7),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(COACH.x, 4.95, COACH.z);
  const settyFace = new THREE.Vector3(SETTY.x, SETTY.y + 1.7 * SETTY.scale + 0.04, SETTY.z);
  return {
    key, rim, lights, root: set,
    coach: { x: COACH.x, y: 0, z: COACH.z, turn: COACH.turn, sit: 0, phone: 0 },
    setty: { x: SETTY.x, y: SETTY.y, z: SETTY.z, turn: SETTY.turn, scale: SETTY.scale },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.38, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 },
    },
    shots: {
      wide: { pos: [-0.2, 4.0, 15.0], at: [-0.2, 2.6, -1.0], fov: 38 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.38, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 }),
    },
  };
}
