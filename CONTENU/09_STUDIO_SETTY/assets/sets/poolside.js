// Set "poolside": a villa pool deck in the afternoon (reel11, the DM script). Warm travertine deck, a turquoise pool with
// caustics and an orange ring float, two white loungers, a big cream umbrella, the white villa at the back left, palms and
// green hills behind, a clear late-afternoon sky. The coach sits on the side of a lounger, laptop on his knees; Setty sits
// on a teak side table next to him, by a cold orange spritz.
// build() adds everything and its lights to the scene and returns where the characters go and the camera shots.
// The furniture lives here (only this set uses it); kit.js gives the basics (box, cyl, soft, canvasTex, plant…).
import * as THREE from "three";
import * as K from "./kit.js";

const POOL = { x0: -7.5, x1: 7.5, z0: -12.5, z1: -3.4, water: -0.3, floor: -1.7 };

// ---------------------------------------------------------------- textures

/** travertine tiles: warm cream slabs in staggered rows, soft pits and veins */
function deckTex() {
  const R = K.rng(12);
  return K.canvasTex(1024, 1024, (c, W, H) => {
    c.fillStyle = "#b39a7a";
    c.fillRect(0, 0, W, H);
    const rows = 4, rh = H / rows;
    for (let r = 0; r < rows; r++) {
      const off = r % 2 ? W / 4 : 0;
      for (let k = -1; k < 3; k++) {
        const x = off + k * (W / 2), y = r * rh;
        const tone = 214 - R() * 18;
        c.fillStyle = `rgb(${tone}, ${tone - 18 - R() * 6}, ${tone - 44 - R() * 8})`;
        c.fillRect(x + 4, y + 4, W / 2 - 8, rh - 8);
        for (let v = 0; v < 5; v++) { // veins
          c.strokeStyle = `rgba(170, 140, 100, ${0.08 + R() * 0.1})`;
          c.lineWidth = 1 + R() * 2;
          c.beginPath();
          const vy = y + 10 + R() * (rh - 20);
          c.moveTo(x + 6, vy);
          for (let s = 1; s <= 6; s++) c.lineTo(x + (s * (W / 2 - 12)) / 6, vy + (R() - 0.5) * 18);
          c.stroke();
        }
        for (let p = 0; p < 70; p++) { // pits
          c.fillStyle = `rgba(150, 120, 85, ${0.12 + R() * 0.2})`;
          c.beginPath();
          c.ellipse(x + 8 + R() * (W / 2 - 16), y + 8 + R() * (rh - 16), 1 + R() * 3, 0.6 + R() * 1.6, R() * 3, 0, Math.PI * 2);
          c.fill();
        }
      }
    }
  }, { repeat: [1, 1] });
}

/** small pool mosaic (the basin walls and the wet band above the water) */
function mosaicTex() {
  const R = K.rng(5);
  return K.canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = "#e8f6f7";
    c.fillRect(0, 0, W, H);
    const n = 16, s = W / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const l = 62 + R() * 14;
      c.fillStyle = `hsl(${186 + R() * 10}, ${48 + R() * 20}%, ${l}%)`;
      c.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
    }
  }, { repeat: [1, 1] });
}

/** caustics on the pool floor: a bright net of curved light cells on turquoise */
function causticsTex() {
  const R = K.rng(77);
  return K.canvasTex(1024, 1024, (c, W, H) => {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#19b9c9");
    g.addColorStop(1, "#1aa6c4");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    const pts = [];
    for (let i = 0; i < 90; i++) pts.push([R() * W, R() * H]);
    // a cheap voronoi: for each cell, draw the border to its neighbours as soft bright strokes (tiled 3x3 for wrapping)
    c.lineCap = "round";
    for (const [px, py] of pts) {
      const near = pts.map(([qx, qy]) => [qx, qy, Math.hypot(qx - px, qy - py)]).sort((a, b) => a[2] - b[2]).slice(1, 6);
      for (const [qx, qy] of near) {
        const mx = (px + qx) / 2, my = (py + qy) / 2, dx = -(qy - py), dy = qx - px, l = Math.hypot(dx, dy) || 1;
        const len = 0.42 * Math.hypot(qx - px, qy - py);
        for (const [ox, oy] of [[0, 0], [W, 0], [-W, 0], [0, H], [0, -H]]) {
          c.strokeStyle = "rgba(210, 255, 252, 0.10)";
          c.lineWidth = 14;
          c.beginPath();
          c.moveTo(mx - (dx / l) * len + ox, my - (dy / l) * len + oy);
          c.quadraticCurveTo(mx + (R() - 0.5) * 20 + ox, my + (R() - 0.5) * 20 + oy, mx + (dx / l) * len + ox, my + (dy / l) * len + oy);
          c.stroke();
          c.strokeStyle = "rgba(235, 255, 252, 0.55)";
          c.lineWidth = 3.2;
          c.stroke();
        }
      }
    }
  }, { repeat: [3, 2] });
}

/** the water's ripples, as a bump map: soft overlapping ellipses */
function rippleTex() {
  const R = K.rng(9);
  return K.canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = "#808080";
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) {
      const x = R() * W, y = R() * H, rx = 10 + R() * 40, ry = rx * (0.25 + R() * 0.3);
      const v = R() < 0.5 ? 255 : 0;
      c.fillStyle = `rgba(${v}, ${v}, ${v}, ${0.05 + R() * 0.09})`;
      c.beginPath();
      c.ellipse(x, y, rx, ry, (R() - 0.5) * 0.4, 0, Math.PI * 2);
      c.fill();
    }
  }, { repeat: [6, 4], srgb: false });
}

/** the panorama behind: afternoon sky, soft clouds, three layers of green hills with white houses and palm silhouettes */
function backdropTex() {
  const R = K.rng(23);
  return K.canvasTex(4096, 1024, (c, W, H) => {
    const sky = c.createLinearGradient(0, 0, 0, H * 0.72);
    sky.addColorStop(0, "#2c7bd6");
    sky.addColorStop(0.5, "#7db8ec");
    sky.addColorStop(1, "#fde3c2");
    c.fillStyle = sky;
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) { // soft clouds
      const x = R() * W, y = H * (0.12 + R() * 0.3), w = 120 + R() * 260;
      for (let k = 0; k < 6; k++) {
        const g = c.createRadialGradient(x + k * w * 0.18, y + (R() - 0.5) * 18, 0, x + k * w * 0.18, y, w * 0.32);
        g.addColorStop(0, "rgba(255, 255, 255, 0.55)");
        g.addColorStop(1, "rgba(255, 255, 255, 0)");
        c.fillStyle = g;
        c.fillRect(x + k * w * 0.18 - w, y - w, w * 2, w * 2);
      }
    }
    const ridge = (base, amp, col, seed, houses) => {
      const r = K.rng(seed), pts = [];
      let y = base;
      for (let x = 0; x <= W + 64; x += 64) {
        y = base - amp * (0.5 + 0.5 * Math.sin(x / 420 + seed) * Math.sin(x / 1130 + seed * 2)) - r() * amp * 0.12;
        pts.push([x, y]);
      }
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(0, H);
      for (const [x, yy] of pts) c.lineTo(x, yy);
      c.lineTo(W, H);
      c.closePath();
      c.fill();
      const shadeG = c.createLinearGradient(0, base - amp, 0, H); // the slope darkens toward its foot
      shadeG.addColorStop(0, "rgba(255, 250, 230, 0.12)");
      shadeG.addColorStop(1, "rgba(10, 40, 20, 0.22)");
      c.fillStyle = shadeG;
      c.beginPath();
      c.moveTo(0, H);
      for (const [x, yy] of pts) c.lineTo(x, yy);
      c.lineTo(W, H);
      c.closePath();
      c.fill();
      for (let i = 0; i < houses; i++) { // white villas dotted on the slope, a terracotta or flat roof
        const k = Math.floor(r() * (pts.length - 1)), [x, yy] = pts[k];
        const hw = 10 + r() * 16, hy = yy + 14 + r() * 50;
        c.fillStyle = "rgba(250, 246, 238, 0.92)";
        c.fillRect(x, hy, hw, hw * 0.6);
        c.fillStyle = r() < 0.5 ? "rgba(196, 110, 70, 0.85)" : "rgba(230, 226, 218, 0.9)";
        c.fillRect(x - 2, hy - 3, hw + 4, 4);
      }
      return pts;
    };
    // haze between the layers
    ridge(H * 0.66, 210, "#86a9a8", 3, 0);
    c.fillStyle = "rgba(255, 236, 214, 0.18)";
    c.fillRect(0, H * 0.4, W, H * 0.6);
    const mid = ridge(H * 0.78, 170, "#4f8a59", 7, 12);
    c.fillStyle = "rgba(255, 236, 214, 0.08)";
    c.fillRect(0, H * 0.55, W, H * 0.45);
    ridge(H * 0.9, 110, "#2f6a43", 11, 5);
    // palm silhouettes on the middle ridge
    const palm = (x, y, s) => {
      c.strokeStyle = "#2f5a3c";
      c.lineWidth = 4 * s;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + 8 * s, y - 40 * s, x + 4 * s, y - 80 * s);
      c.stroke();
      c.fillStyle = "#2f5a3c";
      for (let k = 0; k < 7; k++) {
        const a = -Math.PI / 2 + (k - 3) * 0.48;
        c.beginPath();
        c.ellipse(x + 4 * s + Math.cos(a) * 18 * s, y - 80 * s + Math.sin(a) * 9 * s + 6 * s, 22 * s, 4 * s, a, 0, Math.PI * 2);
        c.fill();
      }
    };
    for (let i = 0; i < 40; i++) {
      const [x, y] = mid[Math.floor(R() * mid.length)];
      palm(x, y + 30 + R() * 40, 0.6 + R() * 0.5);
    }
  });
}

/** a palm frond: a rib and two combs of leaflets (alpha) */
function frondTex() {
  return K.canvasTex(512, 128, (c, W, H) => {
    c.clearRect(0, 0, W, H);
    c.strokeStyle = "#4d6b33";
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(0, H / 2);
    c.lineTo(W, H / 2);
    c.stroke();
    for (let i = 0; i < 34; i++) {
      const x = 14 + i * ((W - 24) / 34), len = (H / 2 - 4) * Math.sin(Math.PI * (0.18 + 0.82 * (i / 34)));
      for (const s of [-1, 1]) {
        const g = c.createLinearGradient(x, H / 2, x + 22, H / 2 + s * len);
        g.addColorStop(0, "#3f8a3a");
        g.addColorStop(1, "#7cbf4e");
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(x - 3, H / 2);
        c.quadraticCurveTo(x + 6, H / 2 + s * len * 0.5, x + 22, H / 2 + s * len);
        c.quadraticCurveTo(x + 10, H / 2 + s * len * 0.45, x + 5, H / 2);
        c.fill();
      }
    }
  }, { srgb: true });
}

// ---------------------------------------------------------------- furniture

const teak = () => K.mat(0xffffff, { map: K.noiseTex("#a8714a", 8, 14, 256), roughness: 0.55, clearcoat: 0.25 });

/** lounger along x: teak frame on four legs, a thick white cushion, the backrest raised at the -x end */
function lounger({ l = 3.6, w = 1.2, h = 0.62, back = 0.78, cushion = 0xf6f2ea } = {}) {
  const g = new THREE.Group(), wood = teak();
  const frame = K.box(l, 0.14, w, 0.03, wood);
  frame.position.y = h - 0.24;
  g.add(frame);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = K.box(0.12, h - 0.3, 0.12, 0.02, wood);
    leg.position.set(sx * (l / 2 - 0.12), (h - 0.3) / 2, sz * (w / 2 - 0.1));
    g.add(leg);
  }
  const cm = K.mat(cushion, { roughness: 0.9, sheen: 0.6, sheenColor: new THREE.Color(0xffffff) });
  const seatL = l * 0.66;
  const seat = K.soft(seatL, 0.2, w - 0.06, cm, { P: 4, puff: 0.08, wrinkle: 0.01, seed: 3 });
  seat.position.set(l / 2 - seatL / 2 - 0.04, h - 0.08, 0);
  g.add(seat);
  // the backrest: a hinged panel tilted up, its cushion and a rolled towel at the top
  const bl = l - seatL - 0.1;
  const hinge = new THREE.Group();
  hinge.position.set(-l / 2 + bl + 0.04, h - 0.17, 0);
  hinge.rotation.z = -back;
  const panel = K.box(bl, 0.08, w, 0.03, wood);
  panel.position.x = -bl / 2;
  const bc = K.soft(bl, 0.18, w - 0.06, cm, { P: 4, puff: 0.08, seed: 4 });
  bc.position.set(-bl / 2, 0.12, 0);
  hinge.add(panel, bc);
  g.add(hinge);
  const prop = K.box(0.08, 0.6, 0.08, 0.02, wood); // the stand that holds it up
  prop.position.set(-l / 2 + bl * 0.42, h + 0.05, 0);
  prop.rotation.z = 0.5;
  g.add(prop);
  g.userData.top = h;
  return g;
}

/** a rolled beach towel (cream with orange stripes) */
function towelRoll({ l = 1.0, r = 0.17 } = {}) {
  const tex = K.canvasTex(256, 256, (c, W, H) => {
    c.fillStyle = "#f4efe6";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#ff7a33";
    for (let x = 18; x < W; x += 64) c.fillRect(x, 0, 22, H);
  });
  const m = K.cyl(r, r, l, K.mat(0xffffff, { map: tex, roughness: 1, sheen: 0.8, sheenColor: new THREE.Color(0xffffff) }), 32);
  m.rotation.z = Math.PI / 2;
  return m;
}

/** a big market umbrella: teak pole on a stone base, cream canopy (8 panels) with a scalloped valance */
function umbrella({ r = 3.3, h = 6.1, color = 0xf1e7d4 } = {}) {
  const g = new THREE.Group(), wood = teak();
  const base = K.cyl(0.45, 0.55, 0.22, K.mat(0x8e8a84, { roughness: 0.8 }), 40);
  base.position.y = 0.11;
  const pole = K.cyl(0.06, 0.07, h, wood, 16);
  pole.position.y = h / 2;
  g.add(base, pole);
  const cloth = K.mat(color, { roughness: 0.95, side: THREE.DoubleSide, sheen: 0.5, sheenColor: new THREE.Color(0xfff7ea) });
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(r, 1.15, 8, 4, true), cloth);
  canopy.position.y = h - 0.15;
  canopy.castShadow = true;
  canopy.receiveShadow = true;
  const val = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.985, r * 0.985, 0.32, 8, 1, true), cloth);
  val.position.y = h - 0.15 - 0.575 - 0.13;
  val.castShadow = true;
  const fin = K.ball(0.1, wood, 16);
  fin.position.y = h + 0.47;
  g.add(canopy, val, fin);
  for (let k = 0; k < 8; k++) { // the ribs under the canopy
    const a = (k / 8) * Math.PI * 2 + Math.PI / 8;
    const rib = K.cyl(0.018, 0.018, r * 1.02, wood, 6);
    rib.position.set(Math.cos(a) * r * 0.49, h - 0.44, Math.sin(a) * r * 0.49);
    rib.rotation.set(0, -a, Math.PI / 2 - 0.33);
    g.add(rib);
  }
  return g;
}

/** a teak drum side table (Setty sits on it) */
function sideTable({ r = 0.95, h = 1.24 } = {}) {
  const g = new THREE.Group(), wood = teak();
  const top = K.cyl(r, r, 0.1, wood, 48);
  top.position.y = h - 0.05;
  const drum = K.cyl(r * 0.7, r * 0.78, h - 0.1, wood, 40);
  drum.position.y = (h - 0.1) / 2;
  g.add(top, drum);
  for (let k = 0; k < 12; k++) { // vertical slats on the drum
    const a = (k / 12) * Math.PI * 2;
    const s = K.box(0.06, h - 0.2, 0.03, 0.01, K.mat(0x6e4529, { roughness: 0.6 }), false);
    s.position.set(Math.cos(a) * r * 0.75, (h - 0.1) / 2, Math.sin(a) * r * 0.75);
    s.rotation.y = -a + Math.PI / 2;
    g.add(s);
  }
  g.userData.top = h;
  return g;
}

/** a cold orange spritz: tumbler, orange drink, ice, an orange slice on the rim, a striped straw */
function drink() {
  const g = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.46, 40, 1, true),
    K.mat(0xeaf6ff, { roughness: 0.03, transparent: true, opacity: 0.28, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }));
  glass.position.y = 0.23;
  const liquid = K.cyl(0.135, 0.12, 0.34, K.mat(0xff6a14, { roughness: 0.12, clearcoat: 1, sheen: 0.4, sheenColor: new THREE.Color(0xffc27a) }), 40);
  liquid.position.y = 0.18;
  const bottom = K.cyl(0.13, 0.13, 0.03, K.mat(0xeaf6ff, { roughness: 0.05, transparent: true, opacity: 0.5 }), 32);
  bottom.position.y = 0.015;
  g.add(glass, liquid, bottom);
  const R = K.rng(4);
  for (let k = 0; k < 4; k++) { // ice cubes poking out
    const ice = K.box(0.09, 0.09, 0.09, 0.02, K.mat(0xf4fbff, { roughness: 0.08, transparent: true, opacity: 0.8, clearcoat: 1 }), false);
    ice.position.set((R() - 0.5) * 0.12, 0.33 + R() * 0.04, (R() - 0.5) * 0.12);
    ice.rotation.set(R(), R(), R());
    g.add(ice);
  }
  const slice = new THREE.Group(); // the orange slice cut to sit on the rim
  const peel = K.cyl(0.11, 0.11, 0.03, K.mat(0xff8a1f, { roughness: 0.5 }), 32);
  const flesh = K.cyl(0.1, 0.1, 0.032, K.mat(0xffb44a, { roughness: 0.4, clearcoat: 0.6 }), 32);
  slice.add(peel, flesh);
  slice.rotation.set(Math.PI / 2, 0, 0.3);
  slice.position.set(0.13, 0.44, 0.02);
  const straw = K.cyl(0.016, 0.016, 0.5, K.mat(0xffffff, { map: K.canvasTex(64, 256, (c, W, H) => {
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#ff611d";
    for (let y = 0; y < H; y += 32) c.fillRect(0, y, W, 14);
  }), roughness: 0.4 }), 12);
  straw.position.set(-0.04, 0.48, 0.02);
  straw.rotation.z = 0.28;
  g.add(slice, straw);
  return g;
}

/** a laptop on the coach's knees: base, keyboard, the lid open toward him (his free PDF on screen), a sticker on the back */
function laptop({ w = 0.94, d = 0.62, open = 1.85 } = {}) {
  const g = new THREE.Group();
  const alu = K.mat(0xc9ccd2, { metalness: 0.75, roughness: 0.32, clearcoat: 0.4 });
  const base = K.box(w, 0.045, d, 0.03, alu);
  base.position.y = 0.0225;
  const keys = K.box(w * 0.86, 0.006, d * 0.42, 0.004, K.mat(0x26272b, { roughness: 0.6 }), false);
  keys.position.set(0, 0.047, 0.04);
  const pad = K.box(w * 0.3, 0.004, d * 0.2, 0.004, K.mat(0xb6b9bf, { metalness: 0.6, roughness: 0.3 }), false);
  pad.position.set(0, 0.046, -0.2);
  g.add(base, keys, pad);
  // the lid hinges on the far edge (+z, toward the knees) and leans back toward him: screen faces -z
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.045, d / 2 - 0.01);
  hinge.rotation.x = open - Math.PI / 2;
  const lid = K.box(w, 0.03, d, 0.03, alu);
  lid.position.set(0, d / 2, 0);
  lid.rotation.x = Math.PI / 2;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, d * 0.86), K.glow(0xffffff, { map: K.canvasTex(512, 340, (c, W, H) => {
    c.fillStyle = "#f4f4f6";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#2b2f38";
    c.fillRect(0, 0, W, 26);
    c.fillStyle = "#ffffff";
    c.font = "600 14px Inter, sans-serif";
    c.fillText("free_DM_script_FINAL.pdf", 14, 18);
    c.fillStyle = "#111";
    c.font = "800 26px Inter, sans-serif";
    c.fillText("THE DM SCRIPT 🔥", 30, 72);
    c.fillStyle = "#c9cdd5";
    for (let y = 100; y < H - 20; y += 22) c.fillRect(30, y, 300 + ((y * 37) % 140), 9);
  }) }));
  screen.position.set(0, d / 2, -0.018);
  screen.rotation.y = Math.PI;
  const sticker = new THREE.Mesh(new THREE.CircleGeometry(0.085, 32), K.mat(0xff611d, { roughness: 0.5 }));
  sticker.position.set(0.18, d * 0.6, 0.017);
  hinge.add(lid, screen, sticker);
  g.add(hinge);
  return g;
}

/** a palm tree: a curved ringed trunk and drooping fronds */
function palm({ h = 7.5, lean = 0.5, seed = 1, n = 11 } = {}) {
  const R = K.rng(seed), g = new THREE.Group();
  const pts = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    pts.push(new THREE.Vector3(Math.sin(t * 1.3) * lean * 1.6, t * h, 0));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, 48, 0.2, 16, false);
  const pos = geo.attributes.position, c0 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) { // taper the trunk and add a swollen base
    const ring = Math.floor(i / 17), t = ring / 48;
    curve.getPointAt(Math.min(1, t), c0);
    const k = 1.25 - 0.45 * t + (t < 0.08 ? (0.08 - t) * 6 : 0);
    pos.setXYZ(i, c0.x + (pos.getX(i) - c0.x) * k, pos.getY(i), c0.z + (pos.getZ(i) - c0.z) * k);
  }
  geo.computeVertexNormals();
  const bark = K.canvasTex(64, 512, (c, W, H) => {
    c.fillStyle = "#9b8466";
    c.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 14) {
      c.fillStyle = "rgba(70, 52, 36, 0.55)";
      c.fillRect(0, y, W, 4);
      c.fillStyle = "rgba(255, 240, 215, 0.18)";
      c.fillRect(0, y + 5, W, 3);
    }
  }, { repeat: [2, 6] });
  const trunk = new THREE.Mesh(geo, K.mat(0xffffff, { map: bark, roughness: 0.9 }));
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  g.add(trunk);
  const top = curve.getPointAt(1);
  const crown = K.ball(0.32, K.mat(0x6b5a3a, { roughness: 0.9 }), 16);
  crown.position.copy(top);
  g.add(crown);
  const ftex = frondTex();
  const fm = K.mat(0xffffff, { map: ftex, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.6 });
  for (let k = 0; k < n; k++) {
    const len = 2.7 + R() * 0.9, wid = 0.8;
    const fg = new THREE.PlaneGeometry(len, wid, 20, 2);
    const p = fg.attributes.position;
    for (let i = 0; i < p.count; i++) { // move the rib to x 0, droop along the length, fold the leaflets in a V
      const x = p.getX(i) + len / 2, y = p.getY(i), u = x / len;
      p.setXYZ(i, x, -0.95 * u * u * len * 0.45 + Math.abs(y) * 0.35, y);
    }
    fg.computeVertexNormals();
    const fr = new THREE.Mesh(fg, fm);
    fr.castShadow = true;
    const a = (k / n) * Math.PI * 2 + R() * 0.3, up = 0.25 + R() * 0.45;
    fr.rotation.set(0, a, up, "YZX");
    fr.position.copy(top);
    g.add(fr);
  }
  return g;
}

/** the white villa at the back: two stucco volumes, big dark glass, a teak slat screen, a flat roof slab */
function villa() {
  const g = new THREE.Group();
  const stucco = K.mat(0xffffff, { map: K.noiseTex("#f3eee6", 5, 31, 256), roughness: 0.92 });
  const glass = K.mat(0x31424f, { roughness: 0.08, metalness: 0.2, clearcoat: 1 });
  const lo = K.box(13, 4.6, 6, 0.06, stucco);
  lo.position.set(0, 2.3, 0);
  const hi = K.box(8, 3.6, 5, 0.06, stucco);
  hi.position.set(-1.6, 6.4, -0.4);
  const roof = K.box(9.2, 0.35, 6.2, 0.04, stucco);
  roof.position.set(-1.6, 8.35, 0.1);
  g.add(lo, hi, roof);
  for (const [x, y, w, hh] of [[-3.6, 2.0, 4.4, 3.4], [2.2, 2.0, 3.2, 3.4], [-1.6, 6.3, 5.4, 2.5]]) {
    const pane = K.box(w, hh, 0.08, 0.01, glass, false);
    pane.position.set(x, y, (y > 4 ? 2.12 : 3.02));
    g.add(pane);
    const mull = K.box(0.06, hh, 0.1, 0.01, K.mat(0x1d1f22, { roughness: 0.4 }), false);
    mull.position.set(x, y, (y > 4 ? 2.16 : 3.06));
    g.add(mull);
  }
  const wood = teak(); // slat screen on the right
  for (let i = 0; i < 9; i++) {
    const s = K.box(0.1, 3.6, 0.12, 0.02, wood);
    s.position.set(4.3 + i * 0.22, 2.0, 3.1);
    g.add(s);
  }
  return g;
}

/** an orange ring float with white bands (brand orange, it floats on the pool) */
function ringFloat({ r = 0.9, t = 0.3 } = {}) {
  const tex = K.canvasTex(512, 64, (c, W, H) => {
    c.fillStyle = "#ff611d";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#ffffff";
    for (let x = 0; x < W; x += 128) c.fillRect(x, 0, 40, H);
  });
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 24, 64), K.mat(0xffffff, { map: tex, roughness: 0.25, clearcoat: 1 }));
  m.rotation.x = Math.PI / 2;
  m.castShadow = true;
  return m;
}

// ---------------------------------------------------------------- the set

export async function build({ renderer, scene, mood = "afternoon" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;
  scene.background = new THREE.Color(0x8cc3ee);
  void mood;

  const set = new THREE.Group();
  scene.add(set);

  // ---- the panorama (a big open cylinder behind everything)
  const pano = new THREE.Mesh(new THREE.CylinderGeometry(70, 70, 70, 96, 1, true, Math.PI * 0.5, Math.PI),
    K.glow(0xffffff, { map: backdropTex(), side: THREE.BackSide, fog: false }));
  pano.position.set(0, 26, -6);
  set.add(pano);

  // ---- the deck: travertine around the pool (four slabs leave the hole), a stone coping on the pool's edge
  const dt = deckTex();
  const slab = (x0, x1, z0, z1) => {
    const t = dt.clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set((x1 - x0) / 4.2, (z1 - z0) / 4.2);
    t.offset.set(x0 / 4.2, z0 / 4.2);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), K.mat(0xffffff, { map: t, roughness: 0.78 }));
    m.rotation.x = -Math.PI / 2;
    m.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2);
    m.receiveShadow = true;
    set.add(m);
  };
  slab(-40, 40, POOL.z1, 20);
  slab(-40, 40, -24, POOL.z0);
  slab(-40, POOL.x0, POOL.z0, POOL.z1);
  slab(POOL.x1, 40, POOL.z0, POOL.z1);
  const stone = K.mat(0xf2ebe0, { roughness: 0.7 });
  const pw = POOL.x1 - POOL.x0, pd = POOL.z1 - POOL.z0;
  for (const [x, z, w, d] of [[0, POOL.z1, pw + 0.9, 0.45], [0, POOL.z0, pw + 0.9, 0.45], [POOL.x0, (POOL.z0 + POOL.z1) / 2, 0.45, pd],
    [POOL.x1, (POOL.z0 + POOL.z1) / 2, 0.45, pd]]) {
    const c = K.box(w, 0.1, d, 0.04, stone);
    c.position.set(x, 0.03, z);
    set.add(c);
  }

  // ---- the pool: mosaic walls, a caustics floor, the water (transparent turquoise with ripples catching the sun)
  const mt = mosaicTex();
  const wallM = (len) => {
    const t = mt.clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(len / 1.2, (0 - POOL.floor) / 1.2);
    return K.mat(0xffffff, { map: t, roughness: 0.3, clearcoat: 0.6 });
  };
  const ph = -POOL.floor;
  for (const [x, z, ry, len] of [[0, POOL.z1, Math.PI, pw], [0, POOL.z0, 0, pw], [POOL.x0, (POOL.z0 + POOL.z1) / 2, Math.PI / 2, pd],
    [POOL.x1, (POOL.z0 + POOL.z1) / 2, -Math.PI / 2, pd]]) {
    const wm = new THREE.Mesh(new THREE.PlaneGeometry(len, ph), wallM(len));
    wm.position.set(x, -ph / 2, z);
    wm.rotation.y = ry;
    set.add(wm);
  }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(pw, pd), K.glow(0xffffff, { map: causticsTex() }));
  floor.material.color.setScalar(0.95);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, POOL.floor, (POOL.z0 + POOL.z1) / 2);
  set.add(floor);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(pw, pd), new THREE.MeshPhysicalMaterial({
    color: 0x34c6d3, transparent: true, opacity: 0.5, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05,
    bumpMap: rippleTex(), bumpScale: 1.4, depthWrite: false,
  }));
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, POOL.water, (POOL.z0 + POOL.z1) / 2);
  water.receiveShadow = true;
  set.add(water);
  const ring = ringFloat();
  ring.position.set(3.4, POOL.water + 0.12, -7.2);
  set.add(ring);

  // ---- the back of the deck: a low white wall with hedge balls, the villa (left), palms, potted plants
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(160, 60), K.mat(0xffffff, { map: K.noiseTex("#5d8f4e", 14, 27, 256), roughness: 1 }));
  lawn.material.map.repeat.set(24, 9);
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(0, -0.02, -54); // the garden behind the villa, out to the hills (no void under the horizon)
  set.add(lawn);
  const wall = K.box(60, 1.0, 0.5, 0.06, K.mat(0xffffff, { map: K.noiseTex("#f1ece3", 5, 9, 256), roughness: 0.9 }));
  wall.position.set(0, 0.5, -18.5);
  set.add(wall);
  const hedge = K.box(60, 1.5, 1.2, 0.5, K.mat(0xffffff, { map: K.noiseTex("#3d7340", 26, 19, 256), roughness: 0.95 }));
  hedge.position.set(0, 0.75, -17.6);
  set.add(hedge);
  const house = villa();
  house.position.set(-11, 0, -24);
  set.add(house);
  for (const [x, z, h, lean, seed, ry] of [[6.2, -15.5, 8.6, 0.55, 3, 2.6], [9.8, -13.5, 7.4, 0.4, 5, 0.3], [-3.2, -20.5, 9.4, 0.3, 7, -0.6],
    [-15.5, -16, 8.2, 0.5, 9, 1.9]]) {
    const p = palm({ h, lean, seed });
    p.position.set(x, 0, z);
    p.rotation.y = ry;
    set.add(p);
  }
  for (const [x, z, s, seed] of [[-6.2, -1.6, 1.0, 41], [6.6, -1.4, 0.9, 43]]) {
    const pl = K.plant({ h: 2.2, n: 9, seed, pot: 0xe3d9c9, leaf: 0x3d7a46 });
    pl.scale.setScalar(s);
    pl.position.set(x, 0, z);
    set.add(pl);
  }

  // ---- the coach's lounger, the second lounger, the umbrella, the side table and the drink
  const COACH = { x: -1.15, y: -0.46, z: -0.75, turn: 0.55 };
  const l1 = lounger();
  K.at(l1, -1.35, 0, -1.35, 0.1);
  const l2 = lounger();
  K.at(l2, 4.6, 0, -2.6, -0.25);
  const tr = towelRoll();
  tr.position.set(4.6 - 1.2, 1.05, -2.25);
  tr.rotation.y = -0.25;
  set.add(l1, l2, tr);
  const umb = umbrella();
  K.at(umb, -3.9, 0, -2.4);
  umb.rotation.z = 0.07;
  set.add(umb);
  const table = sideTable();
  K.at(table, 2.15, 0, -1.9);
  const dr = drink();
  K.at(dr, 2.15 + 0.8, table.userData.top, -1.9 + 0.28, 0.4);
  set.add(table, dr);
  const lap = laptop(); // on his thighs: hips at local y 1.12 + thigh radius, centred 0.36 forward of the hips
  const lapPivot = new THREE.Group();
  lapPivot.position.set(COACH.x, COACH.y, COACH.z);
  lapPivot.rotation.y = COACH.turn;
  lap.position.set(0, 1.42, 0.36);
  lap.rotation.x = -0.06;
  lapPivot.add(lap);
  set.add(lapPivot);

  // ---- lights: a warm afternoon sun from behind right (it casts the shadows and lights the water), a blue sky fill,
  // a soft front key for the faces, a turquoise bounce off the pool
  set.add(new THREE.HemisphereLight(0xcfe6ff, 0xb89270, 0.9));
  const key = new THREE.DirectionalLight(0xfff3e6, 1.3);
  key.position.set(-4, 8, 10);
  key.target.position.set(0.3, 2, -1.5);
  const rim = new THREE.DirectionalLight(0xffd6a0, 2.8);
  rim.position.set(12, 8.5, -6);
  rim.target.position.set(0.3, 1, -1);
  rim.castShadow = true;
  rim.shadow.mapSize.set(2048, 2048);
  rim.shadow.radius = 6;
  rim.shadow.bias = -0.0005;
  Object.assign(rim.shadow.camera, { left: -11, right: 11, top: 11, bottom: -6, near: 1, far: 40 });
  set.add(key, key.target, rim, rim.target);
  const pl = (color, intensity, x, y, z, distance = 6) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lights = {
    pool: pl(0x7fe6ef, 3.2, 0.4, 0.4, -3.4, 7),
    warm: pl(0xffd9a8, 2.0, 2.4, 4.5, 1.5, 7),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(-0.95, 4.05, -0.55);
  const settyFace = new THREE.Vector3(2.15, 2.15, -1.9);
  return {
    key, rim, lights, root: set,
    coach: { x: COACH.x, y: COACH.y, z: COACH.z, turn: COACH.turn, sit: 1, phone: 0, armLf: 0.55, armRf: 0.55, elbowL: 0.9, elbowR: 0.9 },
    setty: { x: 2.15, y: 0.94, z: -1.9, turn: -0.3, scale: 0.62 },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 880 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.32, pitch: 0.06, y: 900 },
    },
    shots: {
      wide: { pos: [0.3, 4.2, 15.0], at: [0.3, 2.5, -1.5], fov: 44 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 }),
      // inserts: the pool from above (the ring float, the caustics), the villa over the pool
      pool: { pos: [2.4, 6.8, -3.2], at: [3.2, -0.3, -8.0], fov: 40 },
      villa: { pos: [5.5, 7.5, 2.0], at: [-8.0, 3.0, -22.0], fov: 38 },
    },
  };
}
