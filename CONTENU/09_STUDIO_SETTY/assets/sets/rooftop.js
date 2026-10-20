// Set "rooftop": a rooftop terrace at sunset (reel8, the DM funnel stuck in 2015). Teak decking, a glass railing, a
// city skyline at golden hour with the sun going down between the towers, string lights already on, planters of tall
// grasses, an olive tree. He lounges in a teak lounge chair, phone in hand; Setty sits on the low concrete table next
// to him, a spritz on the table. The joke of the set: the best sunset of the year behind him, eyes on his own reel.
// build() adds the terrace and its lights to the scene and returns where the characters go and the camera shots.
// The furniture only this set uses (lounge chair, low table, string lights, planters, the skyline) stays in this file.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.6; // the railing line: beyond it, the drop and the city

// ---------------- the skyline (a big painted backdrop far behind the railing) ----------------
const HZ = 0.69; // horizon height on the painting (fraction from the top)
function sunsetCity(c, W, H, R) {
  const hy = H * HZ;
  const sky = c.createLinearGradient(0, 0, 0, hy);
  sky.addColorStop(0, "#1c2152");
  sky.addColorStop(0.32, "#46397e");
  sky.addColorStop(0.6, "#b95a86");
  sky.addColorStop(0.83, "#ff8a57");
  sky.addColorStop(1, "#ffc778");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, hy);
  const low = c.createLinearGradient(0, hy, 0, H);
  low.addColorStop(0, "#f2955f");
  low.addColorStop(0.18, "#86506c");
  low.addColorStop(1, "#191628");
  c.fillStyle = low;
  c.fillRect(0, hy, W, H - hy);
  // the sun, low between the towers, and its glow over the whole sky
  const sx = W * 0.49, sy = hy - H * 0.012, sr = W * 0.021;
  const g = c.createRadialGradient(sx, sy, 0, sx, sy, W * 0.34);
  g.addColorStop(0, "rgba(255,232,180,0.95)");
  g.addColorStop(0.1, "rgba(255,178,104,0.6)");
  g.addColorStop(0.45, "rgba(255,120,96,0.16)");
  g.addColorStop(1, "rgba(255,120,96,0)");
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#fff3d2";
  c.beginPath();
  c.arc(sx, sy, sr, 0, Math.PI * 2);
  c.fill();
  // thin clouds lit from below
  for (let i = 0; i < 11; i++) {
    const cy = hy * (0.3 + R() * 0.5), cx = W * R(), cw = W * (0.1 + R() * 0.22), ch = H * (0.005 + R() * 0.009);
    const near = 1 - Math.min(1, Math.abs(cx - sx) / (W * 0.5));
    c.fillStyle = `rgba(255,${150 + Math.round(60 * near)},${130 + Math.round(30 * near)},${0.22 + 0.25 * near})`;
    c.beginPath();
    c.ellipse(cx, cy, cw / 2, ch, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "rgba(70,50,110,0.18)";
    c.beginPath();
    c.ellipse(cx + cw * 0.05, cy - ch * 0.8, cw * 0.42, ch * 0.7, 0, 0, Math.PI * 2);
    c.fill();
  }
  // a row of towers: base line, heights, widths, colour, lit windows, the rim of the sun on the side facing it
  const towers = ({ base, n, hMin, hMax, wMin, wMax, color, win = 0, rim = 0.3, tall = 0, spire = 0, red = 0, gap = 0 }) => {
    let x = -W * 0.02;
    while (x < W * 1.02) {
      const w = W * (wMin + R() * (wMax - wMin));
      let h = H * (hMin + Math.pow(R(), 1.6) * (hMax - hMin));
      if (R() < tall) h *= 1.7 + R() * 0.6;
      if (gap && Math.abs(x + w / 2 - sx) < W * gap) { x += w + W * R() * 0.004; continue; } // the sun sets between the towers
      const top = base - h;
      c.fillStyle = color;
      c.fillRect(x, top, w, h + 2);
      if (R() < spire) {
        c.beginPath();
        c.moveTo(x + w * 0.3, top);
        c.lineTo(x + w * 0.5, top - h * (0.12 + R() * 0.12));
        c.lineTo(x + w * 0.7, top);
        c.fill();
      }
      const lit = x + w / 2 < sx ? x + w - Math.max(2, w * 0.1) : x; // the edge that faces the sun
      c.fillStyle = `rgba(255,170,110,${rim})`;
      c.fillRect(lit, top, Math.max(2, w * 0.1), h);
      if (win) {
        const cols = Math.max(2, Math.round(w / (W * 0.0038))), rows = Math.round(h / (H * 0.008));
        for (let i = 0; i < cols; i++) for (let j = 1; j < rows; j++) {
          if (R() > win) continue;
          c.fillStyle = `rgba(255,${200 + Math.round(R() * 40)},${120 + Math.round(R() * 60)},${0.45 + R() * 0.5})`;
          c.fillRect(x + (i + 0.3) * (w / cols), top + j * H * 0.008, (w / cols) * 0.45, H * 0.0035);
        }
      }
      if (red && h > H * hMax * 0.9) {
        c.fillStyle = "#ff3b30";
        c.fillRect(x + w / 2 - 2, top - 6, 4, 4);
      }
      x += w + W * R() * 0.004;
    }
  };
  towers({ base: hy + H * 0.01, n: 0, hMin: 0.015, hMax: 0.08, wMin: 0.01, wMax: 0.024, color: "rgba(160,92,120,0.8)", rim: 0.12, tall: 0.1, spire: 0.15, gap: 0.022 });
  towers({ base: hy + H * 0.03, n: 0, hMin: 0.03, hMax: 0.12, wMin: 0.014, wMax: 0.034, color: "#4b3456", win: 0.22, rim: 0.32, tall: 0.08, spire: 0.12, red: 1, gap: 0.05 });
  // haze over the horizon, from the sun
  const hz = c.createLinearGradient(0, hy - H * 0.08, 0, hy + H * 0.08);
  hz.addColorStop(0, "rgba(255,170,120,0)");
  hz.addColorStop(0.5, "rgba(255,170,120,0.32)");
  hz.addColorStop(1, "rgba(255,170,120,0)");
  c.fillStyle = hz;
  c.fillRect(0, hy - H * 0.08, W, H * 0.16);
  // the city far below the terrace: low blocks seen from above, windows and street lights already on
  for (let k = 0; k < 3; k++) {
    let x = -W * 0.02;
    const y0 = hy + H * (0.05 + k * 0.07);
    while (x < W) {
      const w = W * (0.025 + R() * 0.05), top = y0 + H * R() * 0.05;
      c.fillStyle = ["#3a2b48", "#2c2340", "#221c33"][k];
      c.fillRect(x, top, w, H - top);
      c.fillStyle = "rgba(255,160,100,0.35)";
      c.fillRect(x, top, w, 2);
      for (let i = 0; i < 26; i++) {
        c.fillStyle = R() < 0.8 ? `rgba(255,214,140,${0.4 + R() * 0.5})` : "rgba(255,255,255,0.7)";
        c.fillRect(x + R() * w, top + 6 + R() * (H - top - 6), 3, 2);
      }
      x += w + W * 0.003;
    }
  }
}

// ---------------- the furniture of this set ----------------
const teak = () => K.mat(0x9a6a43, { roughness: 0.55, clearcoat: 0.25, map: K.woodTex({ base: "#9a6a43", planks: 3, seed: 12, w: 512, h: 512 }) });
const linen = (c = 0xece5d8) => K.mat(c, { roughness: 0.92, sheen: 0.4, sheenColor: new THREE.Color(0xffffff) });

/** a deep teak lounge armchair with linen cushions and an orange pillow. Origin: under the sitter, +z = the way he faces */
function loungeChair() {
  const g = new THREE.Group(), wood = teak(), cush = linen(0xddd2c1);
  for (const s of [-1, 1]) {
    const arm = K.box(0.2, 1.16, 1.74, 0.07, wood);
    arm.position.set(s * 1.32, 0.58, 0.02);
    g.add(arm);
  }
  const base = K.box(2.44, 0.14, 1.6, 0.04, wood);
  base.position.set(0, 0.2, 0.02);
  const back = K.box(2.44, 2.0, 0.16, 0.05, wood);
  back.position.set(0, 1.18, -0.9);
  back.rotation.x = -0.2;
  const seat = K.soft(2.36, 0.32, 1.52, cush, { puff: 0.14, wrinkle: 0.012, seed: 5 });
  seat.position.set(0, 0.42, 0.06);
  const backC = K.soft(2.3, 1.55, 0.34, cush, { puff: 0.12, wrinkle: 0.012, seed: 8 });
  backC.position.set(0, 1.32, -0.7);
  backC.rotation.x = -0.2;
  g.add(base, back, seat, backC);
  return g;
}

/** a low concrete table (Setty's seat) with a spritz at the end next to the chair */
function lowTable({ w = 2.7, h = 1.05, d = 1.45 } = {}) {
  const g = new THREE.Group();
  const conc = K.mat(0xbab2a8, { roughness: 0.95, map: K.noiseTex("#bab2a8", 7, 23) });
  const top = K.box(w, 0.2, d, 0.05, conc);
  top.position.y = h - 0.1;
  const foot = K.box(w * 0.7, h - 0.2, d * 0.62, 0.04, conc);
  foot.position.y = (h - 0.2) / 2;
  const glass = K.mat(0xffffff, { roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.3, depthWrite: false });
  const cup = K.cyl(0.13, 0.11, 0.36, glass);
  cup.position.set(-w * 0.4, h + 0.18, d * 0.2);
  const drink = K.cyl(0.115, 0.1, 0.24, K.mat(0xff6a1f, { roughness: 0.2, transparent: true, opacity: 0.85 }));
  drink.position.set(-w * 0.4, h + 0.13, d * 0.2);
  const slice = K.cyl(0.1, 0.1, 0.02, K.mat(0xffa13a, { roughness: 0.6 }));
  slice.position.set(-w * 0.4 + 0.1, h + 0.36, d * 0.2);
  slice.rotation.set(0.2, 0, 1.2);
  g.add(top, foot, cup, drink, slice);
  return g;
}

/** a long fibre-cement planter of tall grasses and golden pampas plumes */
function planter({ w = 3.2, h = 1.0, d = 0.9, seed = 61 } = {}) {
  const R = K.rng(seed), g = new THREE.Group();
  const boxM = K.mat(0x2b2b2f, { roughness: 0.85 });
  const b = K.box(w, h, d, 0.04, boxM);
  b.position.y = h / 2;
  const soil = K.box(w - 0.12, 0.05, d - 0.12, 0.01, K.mat(0x2a1e16, { roughness: 1 }), false);
  soil.position.y = h - 0.04;
  g.add(b, soil);
  const blade = new THREE.ConeGeometry(0.028, 1, 4);
  blade.translate(0, 0.5, 0);
  const greens = [0x7d8c4a, 0xa39858, 0x5d7244, 0xc2ae6c].map((c) => K.mat(c, { roughness: 0.8, side: THREE.DoubleSide }));
  for (let i = 0; i < 90; i++) {
    const m = new THREE.Mesh(blade, greens[i % 4]);
    const len = 1.1 + R() * 1.1;
    m.scale.set(1, len, 1);
    m.position.set((R() - 0.5) * (w - 0.3), h - 0.03, (R() - 0.5) * (d - 0.3));
    m.rotation.set((R() - 0.5) * 0.7, R() * 3, (R() - 0.5) * 0.7);
    m.castShadow = true;
    g.add(m);
  }
  const plumeM = K.mat(0xeedcb6, { roughness: 1, sheen: 0.6, sheenColor: new THREE.Color(0xffe6c0) });
  for (let i = 0; i < 9; i++) {
    const x = (R() - 0.5) * (w - 0.5), z = (R() - 0.5) * (d - 0.4), len = 2.0 + R() * 0.7, tilt = (R() - 0.5) * 0.4;
    const stem = K.cyl(0.012, 0.016, len, K.mat(0xb7a26a), 6);
    stem.position.set(x + Math.sin(tilt) * len / 2, h + len / 2, z);
    stem.rotation.z = -tilt;
    const plume = K.ball(0.13, plumeM, 16);
    plume.scale.set(1, 3.2, 1);
    plume.position.set(x + Math.sin(tilt) * len, h + len + 0.25, z);
    plume.rotation.z = -tilt;
    g.add(stem, plume);
  }
  return g;
}

/** string lights hung between two points (a catenary), warm bulbs with a glow that always faces the camera */
const halo = () => K.canvasTex(128, 128, (c, W) => {
  const gr = c.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
  gr.addColorStop(0, "rgba(255,226,170,1)");
  gr.addColorStop(0.25, "rgba(255,190,110,0.5)");
  gr.addColorStop(1, "rgba(255,170,90,0)");
  c.fillStyle = gr;
  c.fillRect(0, 0, W, W);
});
function stringLights(a, b, { sag = 0.8, step = 0.62, haloTex } = {}) {
  const g = new THREE.Group();
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const pt = (t) => A.clone().lerp(B, t).add(new THREE.Vector3(0, -sag * 4 * t * (1 - t), 0));
  const pts = Array.from({ length: 33 }, (_, i) => pt(i / 32));
  const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 96, 0.014, 6), K.mat(0x141416, { roughness: 0.6 }));
  g.add(wire);
  const n = Math.max(2, Math.round(A.distanceTo(B) / step));
  const bulbM = K.glow(0xffd9a0), haloM = new THREE.SpriteMaterial({ map: haloTex, color: 0xffffff, transparent: true,
    opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
  for (let i = 1; i < n; i++) {
    const p = pt(i / n);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), bulbM);
    bulb.position.copy(p).add(new THREE.Vector3(0, -0.13, 0));
    const sock = K.cyl(0.04, 0.04, 0.09, K.mat(0x141416), 10);
    sock.position.copy(p).add(new THREE.Vector3(0, -0.05, 0));
    const h = new THREE.Sprite(haloM);
    h.scale.setScalar(0.62);
    h.position.copy(bulb.position);
    g.add(bulb, sock, h);
  }
  return g;
}

/** a slim black steel pole for the string lights */
function pole(h = 7) {
  const p = K.cyl(0.06, 0.07, h, K.mat(0x1a1a1d, { roughness: 0.45, metalness: 0.6 }), 16);
  p.position.y = h / 2;
  return p;
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
  scene.environmentIntensity = 0.38;
  scene.background = new THREE.Color(0x46397e);
  void mood;

  const set = new THREE.Group();
  scene.add(set);

  // ---- the deck, the parapet and the glass railing
  const deckTex = K.woodTex({ base: "#a8774c", planks: 8, seed: 19 });
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(34, 30), K.mat(0xffffff, { map: deckTex, roughness: 0.62, clearcoat: 0.12 }));
  deck.material.map.wrapS = deck.material.map.wrapT = THREE.RepeatWrapping;
  deck.material.map.repeat.set(34 / 3.2, 30 / 3.2);
  deck.rotation.x = -Math.PI / 2;
  deck.position.set(0, 0, BACK + 15);
  deck.receiveShadow = true;
  const ledge = K.box(34, 0.42, 0.5, 0.03, K.mat(0xcfc7bb, { roughness: 0.9, map: K.noiseTex("#cfc7bb", 6, 9) }));
  ledge.position.set(0, 0.21, BACK - 0.1);
  const glassM = K.mat(0xcfe3ee, { roughness: 0.04, metalness: 0, transparent: true, opacity: 0.14, clearcoat: 1, depthWrite: false });
  const rail = K.mat(0x9a6a43, { roughness: 0.5, clearcoat: 0.3 });
  const steel = K.mat(0x1c1c20, { roughness: 0.35, metalness: 0.7 });
  for (let i = -6; i <= 6; i++) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(2.48, 2.15), glassM);
    pane.position.set(i * 2.55, 0.42 + 1.075, BACK - 0.1);
    const clip = K.box(0.05, 2.25, 0.12, 0.01, steel);
    clip.position.set(i * 2.55 + 1.275, 0.42 + 1.1, BACK - 0.1);
    set.add(pane, clip);
  }
  const hand = K.box(34, 0.1, 0.24, 0.04, rail);
  hand.position.set(0, 2.62, BACK - 0.1);
  set.add(deck, ledge, hand);

  // ---- the skyline: far behind the railing, the horizon near eye level
  const sky = K.canvasTex(2048, 1092, (c, W, H) => sunsetCity(c, W, H, K.rng(47)));
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(120, 64), K.glow(0xffffff, { map: sky }));
  backdrop.position.set(4, 48 - 32, -42); // spans y -16 → 48: the painted horizon lands at y ≈ 3.8
  set.add(backdrop);

  // ---- sun light on the deck: a warm patch and a shaft
  const patch = K.sunPatch({ w: 6.5, d: 3.6, color: 0xffb070, strength: 0.32 });
  patch.position.set(0.9, 0.02, -0.3);
  patch.rotation.z = -0.35;
  set.add(patch);

  // ---- the lounge: his chair, Setty's table, a rug, planters, an olive tree, lanterns
  const COACH = { x: -1.2, z: -0.55, turn: 0.52 };
  const chair = loungeChair();
  K.at(chair, COACH.x, 0, COACH.z, COACH.turn);
  const TABLE = { x: 1.25, z: -1.15, h: 1.05, ry: -0.15, seat: 0.42 }; // Setty sits on the right half, the spritz on the left end
  const table = lowTable({ h: TABLE.h });
  K.at(table, TABLE.x, 0, TABLE.z, TABLE.ry);
  const rug = K.rug({ r: 3.4, base: "#3b3632", ring: "#ff611d" });
  rug.position.set(0.2, 0.03, -0.6);
  const pl1 = planter({ w: 3.4, seed: 61 });
  K.at(pl1, -5.3, 0, BACK + 0.6);
  const pl2 = planter({ w: 3.0, seed: 73 });
  K.at(pl2, 5.0, 0, BACK + 0.6);
  const olive = K.plant({ h: 3.9, pot: 0x2b2b2f, leaf: 0x6f7f4f, n: 11, seed: 33 });
  K.at(olive, -7.2, 0, -1.6);
  const lantern = (x, z, s = 1) => {
    const l = new THREE.Group();
    const frame = K.box(0.5 * s, 0.8 * s, 0.5 * s, 0.04, K.mat(0x1c1c20, { roughness: 0.5, transparent: true, opacity: 0.55 }));
    frame.position.y = 0.4 * s;
    const candle = K.cyl(0.09 * s, 0.09 * s, 0.24 * s, K.glow(0xffc27a));
    candle.position.y = 0.2 * s;
    l.add(frame, candle);
    return K.at(l, x, 0, z);
  };
  set.add(chair, table, rug, pl1, pl2, olive, lantern(3.4, -2.4), lantern(3.95, -2.15, 0.7), lantern(-3.3, -2.6, 0.85));

  // ---- string lights: one along the railing, two coming over the terrace toward the camera
  const haloTex = halo();
  const poles = [[-7.6, BACK + 0.35], [7.6, BACK + 0.35], [-5.4, 9.5], [5.4, 9.5]];
  for (const [x, z] of poles) set.add(K.at(pole(7.0), x, 0, z));
  set.add(stringLights([-7.6, 6.85, BACK + 0.35], [7.6, 6.85, BACK + 0.35], { sag: 1.05, haloTex }));
  set.add(stringLights([-7.6, 6.85, BACK + 0.35], [5.4, 6.85, 9.5], { sag: 0.9, haloTex }));
  set.add(stringLights([7.6, 6.85, BACK + 0.35], [-5.4, 6.85, 9.5], { sag: 0.9, haloTex }));

  // ---- lights: sunset. The low sun behind the towers is the strong warm rim (long shadows toward the camera), a
  // purple sky fill from above, a soft warm key from the front for the faces, the bulbs as warm practicals.
  set.add(new THREE.HemisphereLight(0xc6b4e6, 0x6a4632, 1.05));
  const key = new THREE.DirectionalLight(0xffe6d2, 1.45);
  key.position.set(-4, 8, 10);
  key.target.position.set(0.2, 2, -1);
  const rim = new THREE.DirectionalLight(0xffa25a, 3.1);
  rim.position.set(7, 5.2, -14);
  rim.target.position.set(0, 1, 0);
  rim.castShadow = true;
  rim.shadow.mapSize.set(2048, 2048);
  rim.shadow.radius = 8;
  rim.shadow.bias = -0.0005;
  Object.assign(rim.shadow.camera, { left: -10, right: 10, top: 9, bottom: -5, near: 1, far: 40 });
  const fill = new THREE.DirectionalLight(0xff9fb0, 0.35);
  fill.position.set(8, 3, 6);
  set.add(key, key.target, rim, rim.target, fill);
  const pl = (color, intensity, x, y, z, distance = 6) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lights = {
    bulbsL: pl(0xffc98a, 4, -3.2, 5.7, BACK + 0.6, 6.5),
    bulbsR: pl(0xffc98a, 4, 3.2, 5.7, BACK + 0.6, 6.5),
    over: pl(0xffc98a, 3, 0, 6.2, 3.5, 7),
    lantern: pl(0xffb070, 2.5, 3.5, 0.8, -2.1, 3.5),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const lean = 0.28; // seated, his head sits a little forward of his hips
  const coachHead = new THREE.Vector3(COACH.x + Math.sin(COACH.turn) * lean, 4.05, COACH.z + Math.cos(COACH.turn) * lean);
  const settyY = TABLE.h - 0.33, settyS = 0.62;
  const SX = TABLE.x + TABLE.seat * Math.cos(TABLE.ry), SZ = TABLE.z - TABLE.seat * Math.sin(TABLE.ry);
  const settyFace = new THREE.Vector3(SX, settyY + 1.7 * settyS, SZ);
  return {
    key, rim, lights, root: set,
    coach: { x: COACH.x, y: -0.46, z: COACH.z, turn: COACH.turn, sit: 1, phone: 1 },
    setty: { x: SX, y: settyY, z: SZ, turn: -0.32, scale: settyS },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.46, y: 800 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.3, pitch: 0.08, y: 860 },
    },
    shots: {
      wide: { pos: [0.2, 4.1, 15.0], at: [0.2, 2.5, -1.5], fov: 44 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.46, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.3, pitch: 0.08, y: 800 }),
    },
  };
}
