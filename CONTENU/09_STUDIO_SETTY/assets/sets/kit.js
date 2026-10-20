// Set kit: the furniture and props every Setty set is built from (Three.js, procedural, same toy-like look as the
// characters). A set (assets/sets/<name>.js) places these pieces, its lights and its camera shots; a new set should
// mostly reuse them. Units: the coach stands ~4.7 tall; floor at y 0; the camera looks toward -z.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { superGeo } from "../coach/coach.js";

export const mat = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.6, ...o });
export const glow = (color, o = {}) => new THREE.MeshBasicMaterial({ color, toneMapped: false, ...o });

/** deterministic random for decor (books, city windows…) */
export function rng(seed = 7) {
  return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

export function canvasTex(w, h, draw, { repeat, srgb = true } = {}) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}

const shade = (m, cast = true) => { m.castShadow = cast; m.receiveShadow = true; return m; };
export function box(w, h, d, r, material, cast = true) {
  const rr = Math.max(0.001, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
  return shade(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, rr), material), cast);
}
export function cyl(rt, rb, h, material, seg = 40) {
  return shade(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material));
}
export function ball(r, material, seg = 32) {
  return shade(new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.round(seg * 0.75)), material));
}
/** puffy cushion / pillow / duvet block */
export function soft(w, h, d, material, { P = 3.2, puff = 0.1, wrinkle = 0, seed = 1 } = {}) {
  const R = rng(seed), ph = [R() * 6, R() * 6, R() * 6];
  return shade(new THREE.Mesh(superGeo({
    A: w / 2, B: h / 2, C: d / 2, P, Q: P, w: 72, h: 48,
    deform: (x, y, z) => {
      const k = 1 + puff * (1 - Math.pow(Math.abs(x) / (w / 2), 2)) * (1 - Math.pow(Math.abs(z) / (d / 2), 2));
      const wr = wrinkle * Math.sin(x * 5.1 + ph[0]) * Math.sin(z * 4.3 + ph[1]) * (y > 0 ? 1 : 0.3);
      return [x, y * k + wr, z];
    },
  }), material));
}
export const at = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; return o; };
export function group(...kids) { const g = new THREE.Group(); kids.forEach((k) => g.add(k)); return g; }

// ---------------- textures ----------------
export function woodTex({ base = "#b98a5e", planks = 6, seed = 3, w = 1024, h = 1024 } = {}) {
  const R = rng(seed);
  return canvasTex(w, h, (c) => {
    const ph = h / planks;
    for (let i = 0; i < planks; i++) {
      let x = -R() * w;
      while (x < w) {
        const len = w * (0.45 + R() * 0.6);
        const l = 0.88 + R() * 0.2;
        c.fillStyle = base;
        c.filter = `brightness(${l})`;
        c.fillRect(x, i * ph, len, ph);
        c.filter = "none";
        c.strokeStyle = "rgba(60, 35, 18, 0.12)";
        c.lineWidth = 1.5;
        for (let g = 0; g < 7; g++) {
          const y0 = i * ph + R() * ph;
          c.beginPath();
          c.moveTo(x, y0);
          c.bezierCurveTo(x + len * 0.3, y0 + (R() - 0.5) * 10, x + len * 0.7, y0 + (R() - 0.5) * 10, x + len, y0 + (R() - 0.5) * 6);
          c.stroke();
        }
        c.fillStyle = "rgba(40, 22, 10, 0.55)";
        c.fillRect(x, i * ph, 3, ph);
        x += len;
      }
      c.fillStyle = "rgba(40, 22, 10, 0.5)";
      c.fillRect(0, i * ph, w, 3);
    }
  });
}
export function noiseTex(base = "#2b3040", amount = 10, seed = 5, size = 512) {
  const R = rng(seed);
  return canvasTex(size, size, (c, w, h) => {
    c.fillStyle = base;
    c.fillRect(0, 0, w, h);
    const img = c.getImageData(0, 0, w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (R() - 0.5) * amount;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    c.putImageData(img, 0, 0);
  }, { repeat: [4, 4] });
}

// ---------------- room ----------------
/** floor + back wall. floorMap / wallMap (repeating textures: rubberTex, brickTex…) replace the wood floor and the
 *  painted wall; tile = their size in world units. */
export function room({ w = 16, h = 10, d = 14, wall = "#2a2f42", floor = "#b98a5e", backZ = -3.4, floorMap, wallMap,
  floorTile = 4, wallTile = 4, floorRough = 0.55, baseboard = true } = {}) {
  const g = new THREE.Group();
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(0xffffff, { map: floorMap || woodTex({ base: floor }),
    roughness: floorMap ? floorRough : 0.55, clearcoat: floorMap ? 0.05 : 0.25 }));
  fl.material.map.wrapS = fl.material.map.wrapT = THREE.RepeatWrapping;
  fl.material.map.repeat.set(w / floorTile, d / floorTile);
  fl.rotation.x = -Math.PI / 2;
  fl.position.set(0, 0, backZ + d / 2);
  fl.receiveShadow = true;
  const wl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat(0xffffff, { map: wallMap || noiseTex(wall, 9), roughness: 0.92 }));
  if (wallMap) {
    wl.material.map.wrapS = wl.material.map.wrapT = THREE.RepeatWrapping;
    wl.material.map.repeat.set(w / wallTile, h / wallTile);
  }
  wl.position.set(0, h / 2, backZ);
  wl.receiveShadow = true;
  g.add(fl, wl);
  if (baseboard) {
    const base = box(w, 0.22, 0.06, 0.01, mat(0xf0ece6, { roughness: 0.5 }));
    base.position.set(0, 0.11, backZ + 0.03);
    g.add(base);
  }
  return g;
}

/** acoustic wood slats on black felt (the creator wall) */
export function slatPanel({ w = 3.2, h = 4.4, n = 14, color = 0x8a5634 } = {}) {
  const g = new THREE.Group();
  const felt = box(w, h, 0.05, 0.01, mat(0x141416, { roughness: 1 }), false);
  g.add(felt);
  const wood = mat(color, { roughness: 0.55, clearcoat: 0.3 });
  const sw = (w * 0.62) / n, gap = (w - sw * n) / n;
  for (let i = 0; i < n; i++) {
    const s = box(sw, h - 0.06, 0.09, 0.012, wood);
    s.position.set(-w / 2 + gap / 2 + sw / 2 + i * (sw + gap), 0, 0.06);
    g.add(s);
  }
  return g;
}

// ---------------- desk setup ----------------
export function desk({ w = 3.6, d = 1.5, h = 1.35, top = 0xd9c2a3, legs = 0x1b1b1e } = {}) {
  const g = new THREE.Group();
  const t = box(w, 0.1, d, 0.03, mat(top, { roughness: 0.45, clearcoat: 0.4 }));
  t.position.y = h - 0.05;
  const metal = mat(legs, { roughness: 0.35, metalness: 0.6 });
  for (const sx of [-1, 1]) {
    const leg = box(0.1, h - 0.1, d * 0.85, 0.03, metal);
    leg.position.set(sx * (w / 2 - 0.2), (h - 0.1) / 2, 0);
    g.add(leg);
  }
  const mat2 = box(w * 0.55, 0.012, d * 0.62, 0.005, mat(0x232327, { roughness: 0.9 }));
  mat2.position.set(0.15, h + 0.006, 0.12);
  g.add(t, mat2);
  g.userData.top = h;
  return g;
}

export function monitor({ w = 2.0, h = 1.15, screen } = {}) {
  const g = new THREE.Group();
  const black = mat(0x101012, { roughness: 0.35, clearcoat: 0.6 });
  const frame = box(w, h, 0.07, 0.03, black);
  frame.position.y = 0.75 + h / 2;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.07, h - 0.07), glow(0xffffff, { map: screen }));
  scr.position.set(0, 0.75 + h / 2, 0.037);
  const neck = box(0.12, 0.75, 0.06, 0.02, mat(0x2a2a2e, { metalness: 0.6, roughness: 0.3 }));
  neck.position.set(0, 0.42, -0.06);
  const foot = box(0.55, 0.03, 0.34, 0.015, mat(0x2a2a2e, { metalness: 0.6, roughness: 0.3 }));
  foot.position.y = 0.015;
  g.add(frame, scr, neck, foot);
  g.userData.screen = scr;
  return g;
}

export function keyboard() {
  const g = new THREE.Group();
  const base = box(1.05, 0.05, 0.36, 0.02, mat(0x1f1f23, { roughness: 0.4 }));
  base.position.y = 0.025;
  g.add(base);
  const key = mat(0x2d2d33, { roughness: 0.5 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) {
    const k = box(0.058, 0.03, 0.058, 0.01, key, false);
    k.position.set(-0.46 + c * 0.071, 0.06, -0.12 + r * 0.075);
    g.add(k);
  }
  return g;
}

export function mug(color = 0xf2eee8, accent = 0xff611d) {
  const g = new THREE.Group();
  const c = cyl(0.11, 0.1, 0.24, mat(color, { roughness: 0.3, clearcoat: 0.6 }));
  c.position.y = 0.12;
  const band = cyl(0.112, 0.112, 0.04, mat(accent, { roughness: 0.4 }));
  band.position.y = 0.17;
  const handle = shade(new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 10, 24), mat(color, { roughness: 0.3 })));
  handle.position.set(0.12, 0.12, 0);
  const coffee = cyl(0.095, 0.095, 0.01, mat(0x3a2215, { roughness: 0.2 }));
  coffee.position.y = 0.225;
  g.add(c, band, handle, coffee);
  return g;
}

export function can(color = 0x2a2a2e, stripe = 0x9cf05a) {
  const g = new THREE.Group();
  const body = cyl(0.075, 0.075, 0.3, mat(color, { metalness: 0.7, roughness: 0.25 }));
  body.position.y = 0.15;
  const s = cyl(0.077, 0.077, 0.06, glow(stripe));
  s.position.y = 0.17;
  const top = cyl(0.068, 0.075, 0.02, mat(0xc9c9cc, { metalness: 0.9, roughness: 0.3 }));
  top.position.y = 0.31;
  g.add(body, s, top);
  return g;
}

/** ring light on a tripod; returns the group (its light is added by the set) */
export function ringLight({ r = 0.62, h = 3.1 } = {}) {
  const g = new THREE.Group();
  const ring = shade(new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 16, 64), glow(0xfff4e8)), false);
  ring.position.y = h;
  const housing = shade(new THREE.Mesh(new THREE.TorusGeometry(r, 0.085, 16, 64, Math.PI * 2), mat(0x18181b, { roughness: 0.4 })));
  housing.position.set(0, h, -0.04);
  const metal = mat(0x222226, { metalness: 0.7, roughness: 0.3 });
  const pole = cyl(0.025, 0.03, h - r, metal);
  pole.position.y = (h - r) / 2;
  g.add(ring, housing, pole);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const leg = cyl(0.018, 0.018, 0.9, metal);
    leg.position.set(Math.sin(a) * 0.3, 0.38, Math.cos(a) * 0.3);
    leg.rotation.set(Math.cos(a) * 0.7, 0, -Math.sin(a) * 0.7);
    g.add(leg);
  }
  return g;
}

/** podcast mic on a boom arm, clamped at the desk edge */
export function micArm() {
  const g = new THREE.Group();
  const metal = mat(0x1d1d21, { metalness: 0.6, roughness: 0.35 });
  const a1 = cyl(0.025, 0.025, 1.1, metal);
  a1.position.set(0, 0.5, 0);
  a1.rotation.z = 0.35;
  const a2 = cyl(0.022, 0.022, 0.95, metal);
  a2.position.set(0.42, 1.12, 0.25);
  a2.rotation.set(0.6, 0, -1.1);
  const mic = shade(new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.3, 8, 24), mat(0x18181b, { roughness: 0.35, metalness: 0.4 })));
  mic.position.set(0.8, 1.2, 0.55);
  mic.rotation.set(0.9, 0, 0.3);
  const grille = cyl(0.115, 0.115, 0.14, mat(0x3a3a40, { metalness: 0.8, roughness: 0.45 }));
  grille.position.copy(mic.position).add(new THREE.Vector3(0.04, 0.1, 0.1));
  grille.rotation.copy(mic.rotation);
  g.add(a1, a2, mic, grille);
  return g;
}

/** gaming chair (black, with an accent stripe); seat top at `seat` */
export function gamingChair({ seat = 0.5, color = 0x1c1c20, accent = 0xff611d } = {}) {
  const g = new THREE.Group();
  const leather = mat(color, { roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.3 });
  const acc = mat(accent, { roughness: 0.45, clearcoat: 0.4 });
  const cushion = soft(1.25, 0.24, 1.15, leather, { P: 3.4, puff: 0.12, seed: 4 });
  cushion.position.y = seat - 0.12;
  const back = soft(1.15, 2.1, 0.32, leather, { P: 3.6, puff: 0.08, seed: 5 });
  back.position.set(0, seat + 1.05, -0.55);
  back.rotation.x = -0.12;
  const stripe = box(0.18, 1.7, 0.05, 0.02, acc);
  stripe.position.set(0, seat + 1.0, -0.37);
  stripe.rotation.x = -0.12;
  const pillow = soft(0.7, 0.32, 0.2, acc, { P: 3, puff: 0.2, seed: 6 });
  pillow.position.set(0, seat + 1.85, -0.36);
  pillow.rotation.x = -0.12;
  const metal = mat(0x2a2a2e, { metalness: 0.7, roughness: 0.3 });
  const post = cyl(0.06, 0.06, seat - 0.2, metal);
  post.position.y = (seat - 0.2) / 2 + 0.1;
  g.add(cushion, back, stripe, pillow, post);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = box(0.6, 0.06, 0.1, 0.03, metal);
    leg.position.set(Math.sin(a) * 0.3, 0.12, Math.cos(a) * 0.3);
    leg.rotation.y = a + Math.PI / 2;
    const wheel = ball(0.06, mat(0x111113, { roughness: 0.5 }), 16);
    wheel.position.set(Math.sin(a) * 0.6, 0.06, Math.cos(a) * 0.6);
    g.add(leg, wheel);
  }
  for (const sx of [-1, 1]) {
    const arm = box(0.12, 0.08, 0.6, 0.03, leather);
    arm.position.set(sx * 0.66, seat + 0.42, -0.05);
    const strut = box(0.06, 0.4, 0.06, 0.02, metal);
    strut.position.set(sx * 0.66, seat + 0.2, -0.1);
    g.add(arm, strut);
  }
  return g;
}

// ---------------- bedroom ----------------
/** bed: wooden platform, upholstered headboard, mattress, duvet, pillows, a knit throw at the foot. Head against -z. */
export function bed({ w = 3.0, l = 3.9, top = 1.0, frame = 0x6b4329, head = 0xe6ddd0, duvet = 0xefe9df, throwColor = 0xff6a2b } = {}) {
  const g = new THREE.Group();
  const wood = mat(frame, { roughness: 0.5, clearcoat: 0.3 });
  const plat = box(w + 0.2, 0.42, l + 0.1, 0.05, wood);
  plat.position.set(0, 0.32, 0);
  const hb = soft(w + 0.2, 2.0, 0.34, mat(head, { roughness: 0.95, sheen: 1, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.8 }), { P: 4, puff: 0.06, seed: 9 });
  hb.position.set(0, top + 0.55, -l / 2 - 0.05);
  const mattress = box(w, 0.42, l - 0.1, 0.12, mat(0xf7f5f0, { roughness: 0.9 }));
  mattress.position.set(0, top - 0.21 + 0.02, 0.02);
  const duv = soft(w + 0.16, 0.34, l * 0.72, mat(duvet, { roughness: 0.92, sheen: 0.8, sheenColor: new THREE.Color(0xffffff) }), { P: 3.2, puff: 0.35, wrinkle: 0.035, seed: 2 });
  duv.position.set(0, top + 0.06, l * 0.14);
  const pillowM = mat(0xfbfaf7, { roughness: 0.9, sheen: 0.7, sheenColor: new THREE.Color(0xffffff) });
  for (const sx of [-1, 1]) {
    const p = soft(w * 0.42, 0.42, 0.95, pillowM, { P: 2.6, puff: 0.3, seed: sx + 11 });
    p.position.set(sx * w * 0.24, top + 0.3, -l / 2 + 0.6);
    p.rotation.x = -0.5;
    g.add(p);
  }
  const knit = mat(throwColor, { roughness: 0.95, sheen: 0.6, sheenColor: new THREE.Color(0xffc4a8) });
  const thr = soft(w + 0.24, 0.2, 0.9, knit, { P: 3, puff: 0.2, wrinkle: 0.02, seed: 13 });
  thr.position.set(0, top + 0.22, l / 2 - 0.5);
  g.add(plat, hb, mattress, duv, thr);
  g.userData = { top, duvetTop: top + 0.23 };
  return g;
}

export function nightstand({ h = 1.0 } = {}) {
  const g = new THREE.Group();
  const wood = mat(0x6b4329, { roughness: 0.5, clearcoat: 0.3 });
  const b = box(0.9, h, 0.8, 0.04, wood);
  b.position.y = h / 2;
  const drawer = box(0.78, 0.36, 0.02, 0.01, mat(0x5a3720, { roughness: 0.5 }));
  drawer.position.set(0, h * 0.62, 0.405);
  const knob = ball(0.035, mat(0xd9a94a, { metalness: 1, roughness: 0.3 }), 12);
  knob.position.set(0, h * 0.62, 0.43);
  g.add(b, drawer, knob);
  g.userData.top = h;
  return g;
}

/** globe lamp (emissive shade); add its PointLight in the set */
export function lamp({ color = 0xffc58a } = {}) {
  const g = new THREE.Group();
  const base = cyl(0.14, 0.18, 0.08, mat(0xd9a94a, { metalness: 1, roughness: 0.3 }));
  base.position.y = 0.04;
  const stem = cyl(0.02, 0.02, 0.4, mat(0xd9a94a, { metalness: 1, roughness: 0.3 }));
  stem.position.y = 0.26;
  const globe = ball(0.27, glow(color), 32);
  globe.castShadow = false;
  globe.position.y = 0.66;
  g.add(base, stem, globe);
  return g;
}

/** potted plant: a pot and big glossy leaves on stems */
export function plant({ h = 2.4, pot = 0xe9e3da, leaf = 0x3f7a4c, n = 9, seed = 21 } = {}) {
  const R = rng(seed), g = new THREE.Group();
  const p = cyl(0.42, 0.32, 0.75, mat(pot, { roughness: 0.6, clearcoat: 0.3 }));
  p.position.y = 0.375;
  const soil = cyl(0.39, 0.39, 0.02, mat(0x2b1d14, { roughness: 1 }));
  soil.position.y = 0.73;
  g.add(p, soil);
  const lm = mat(leaf, { roughness: 0.35, clearcoat: 0.6, side: THREE.DoubleSide });
  const stemM = mat(0x2f5e39, { roughness: 0.6 });
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + R() * 0.5, tilt = 0.35 + R() * 0.55, len = h * (0.45 + R() * 0.45);
    const stem = cyl(0.015, 0.02, len, stemM, 8);
    const pivot = new THREE.Group();
    pivot.position.y = 0.72;
    pivot.rotation.set(Math.cos(a) * tilt, 0, -Math.sin(a) * tilt);
    stem.position.y = len / 2;
    const lf = shade(new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), lm));
    lf.scale.set(0.75, 1, 0.12);
    lf.position.y = len + 0.25;
    lf.rotation.set(-0.5 - R() * 0.4, a, 0);
    pivot.add(stem, lf);
    g.add(pivot);
  }
  return g;
}

/** floating shelf with books, a small plant and a trophy */
export function shelf({ w = 2.2, seed = 31 } = {}) {
  const R = rng(seed), g = new THREE.Group();
  const board = box(w, 0.08, 0.5, 0.02, mat(0x8a5634, { roughness: 0.5, clearcoat: 0.3 }));
  g.add(board);
  const COLS = [0xff611d, 0x1f2937, 0xe8dfd2, 0x3b5b7a, 0xc9a227, 0x7a3b2e, 0x2f4f3a];
  let x = -w / 2 + 0.15;
  while (x < w * 0.1) {
    const bw = 0.08 + R() * 0.07, bh = 0.42 + R() * 0.25;
    const b = box(bw, bh, 0.34, 0.01, mat(COLS[Math.floor(R() * COLS.length)], { roughness: 0.7 }));
    b.position.set(x + bw / 2, 0.04 + bh / 2, 0);
    if (R() < 0.15) b.rotation.z = 0.15;
    g.add(b);
    x += bw + 0.01;
  }
  const tro = new THREE.Group();
  const gold = mat(0xe0ad4a, { metalness: 1, roughness: 0.22 });
  const cup = cyl(0.14, 0.05, 0.22, gold);
  cup.position.y = 0.3;
  const st = cyl(0.025, 0.025, 0.12, gold);
  st.position.y = 0.14;
  const bs = box(0.18, 0.08, 0.14, 0.01, mat(0x18181b, { roughness: 0.4 }));
  bs.position.y = 0.08;
  tro.add(cup, st, bs);
  tro.position.set(w * 0.22, 0.0, 0);
  const pl = plant({ h: 0.5, n: 6, seed: seed + 1 });
  pl.scale.setScalar(0.4);
  pl.position.set(w * 0.4, 0.04, 0);
  g.add(tro, pl);
  return g;
}

/** neon sign: glowing script text on a clear acrylic plate; add its PointLight in the set */
export function neonSign(text = "HUSTLE", { color = "#ff5a2a", w = 2.6, h = 0.9, font = "italic 700 150px 'Nohemi', Inter, sans-serif" } = {}) {
  const tex = canvasTex(1024, 360, (c, W, H) => {
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = font;
    c.lineJoin = "round";
    for (const [blur, alpha] of [[60, 0.5], [30, 0.7], [12, 0.9]]) {
      c.shadowColor = color;
      c.shadowBlur = blur;
      c.globalAlpha = alpha;
      c.strokeStyle = color;
      c.lineWidth = 14;
      c.strokeText(text, W / 2, H / 2);
    }
    c.globalAlpha = 1;
    c.shadowBlur = 8;
    c.strokeStyle = "#ffe3d6";
    c.lineWidth = 5;
    c.strokeText(text, W / 2, H / 2);
  });
  const g = new THREE.Group();
  const plate = box(w * 0.92, h * 0.85, 0.03, 0.04, mat(0xffffff, { transmission: 0.9, roughness: 0.1, transparent: true, opacity: 0.18 }), false);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glow(0xffffff, { map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  sign.position.z = 0.03;
  g.add(plate, sign);
  return g;
}

/** soft coloured wash on a wall (LED strip glow), additive */
export function wallGlow({ w = 4, h = 2.5, color = "#8b5cff", strength = 0.8 } = {}) {
  const tex = canvasTex(256, 256, (c, W, H) => {
    const gr = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
    gr.addColorStop(0, color);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = gr;
    c.fillRect(0, 0, W, H);
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), glow(0xffffff, { map: tex, transparent: true, opacity: strength, blending: THREE.AdditiveBlending, depthWrite: false }));
}

// ---------------- window views (canvas painters: (ctx, W, H, rnd)) ----------------
export const VIEWS = {
  /** a city at night: lit windows, a moon */
  night(c, W, H, R) {
    const sky = c.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0b1030");
    sky.addColorStop(0.65, "#3a2a6a");
    sky.addColorStop(1, "#ff7a4a");
    c.fillStyle = sky;
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#fff6e0";
    c.beginPath();
    c.arc(W * 0.78, H * 0.2, 34, 0, Math.PI * 2);
    c.fill();
    for (let layer = 0; layer < 2; layer++) {
      let x = -20;
      while (x < W) {
        const bw = 50 + R() * 90, bh = H * (0.25 + R() * 0.45) * (layer ? 1 : 0.8);
        c.fillStyle = layer ? "#0d0f1f" : "#1d1a3d";
        c.fillRect(x, H - bh, bw, bh);
        if (layer) for (let wy = H - bh + 14; wy < H - 10; wy += 22) for (let wx = x + 10; wx < x + bw - 12; wx += 18)
          if (R() < 0.35) { c.fillStyle = R() < 0.8 ? "#ffcf7a" : "#9ad1ff"; c.fillRect(wx, wy, 8, 11); }
        x += bw + 6;
      }
    }
  },
  /** Dubai at golden hour: a supertall stepped tower with a spire, the sun low behind the skyline, warm haze */
  dubai(c, W, H, R) {
    const sky = c.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#86aed0");
    sky.addColorStop(0.36, "#e8cba6");
    sky.addColorStop(0.68, "#ffae63");
    sky.addColorStop(1, "#ffd193");
    c.fillStyle = sky;
    c.fillRect(0, 0, W, H);
    const sx = W * 0.7, sy = H * 0.64;
    const halo = c.createRadialGradient(sx, sy, 0, sx, sy, W * 0.6);
    halo.addColorStop(0, "rgba(255, 246, 215, 1)");
    halo.addColorStop(0.07, "rgba(255, 228, 165, 0.95)");
    halo.addColorStop(0.32, "rgba(255, 172, 92, 0.35)");
    halo.addColorStop(1, "rgba(255, 150, 80, 0)");
    c.fillStyle = halo;
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#fff7df";
    c.beginPath();
    c.arc(sx, sy, W * 0.045, 0, Math.PI * 2);
    c.fill();
    // long thin clouds lit from below
    for (let i = 0; i < 6; i++) {
      c.fillStyle = `rgba(255, 226, 190, ${0.18 + R() * 0.2})`;
      c.beginPath();
      c.ellipse(R() * W, H * (0.08 + R() * 0.35), W * (0.12 + R() * 0.2), 6 + R() * 8, 0, 0, Math.PI * 2);
      c.fill();
    }
    const tower = (x, w, h, base, { shade = "#7d5c6c", lit = "#ffc27c", top = "flat" } = {}) => {
      const g = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
      g.addColorStop(0, shade);
      g.addColorStop(0.62, shade);
      g.addColorStop(1, lit);
      c.fillStyle = g;
      c.beginPath();
      if (top === "sail") {
        c.moveTo(x - w / 2, base);
        c.lineTo(x - w / 2, base - h);
        c.quadraticCurveTo(x + w * 0.9, base - h * 0.55, x + w / 2, base);
      } else if (top === "slant") {
        c.moveTo(x - w / 2, base);
        c.lineTo(x - w / 2, base - h);
        c.lineTo(x + w / 2, base - h * 0.86);
        c.lineTo(x + w / 2, base);
      } else if (top === "peak") {
        c.moveTo(x - w / 2, base);
        c.lineTo(x - w / 2, base - h * 0.85);
        c.lineTo(x, base - h);
        c.lineTo(x + w / 2, base - h * 0.85);
        c.lineTo(x + w / 2, base);
      } else c.rect(x - w / 2, base - h, w, h);
      c.fill();
    };
    // far, hazy skyline
    let x = -10;
    while (x < W) {
      const bw = 26 + R() * 50, bh = H * (0.06 + R() * 0.12);
      c.fillStyle = "rgba(205, 140, 128, 0.6)";
      c.fillRect(x, H * 0.86 - bh, bw, bh + H);
      x += bw + 4;
    }
    // the skyline around the hero tower
    const B = H * 0.97;
    tower(W * 0.07, 70, H * 0.46, B, { top: "slant" });
    tower(W * 0.17, 54, H * 0.34, B);
    tower(W * 0.56, 62, H * 0.47, B, { top: "peak" });
    tower(W * 0.63, 48, H * 0.4, B, { top: "peak" });
    tower(W * 0.83, 78, H * 0.44, B, { top: "sail" });
    tower(W * 0.94, 46, H * 0.3, B);
    // the supertall: stepped tiers that narrow, then the spire
    const X = W * 0.34, tiers = [118, 100, 86, 72, 60, 48, 38, 28, 20, 13];
    let y = B;
    const th = (H * 0.72) / tiers.length;
    tiers.forEach((w, i) => {
      const off = (i % 2 ? 1 : -1) * w * 0.08;
      tower(X + off, w, th + 2, y, { shade: "#6f5266", lit: "#ffc983" });
      c.fillStyle = "rgba(255, 220, 170, 0.18)";
      for (let k = 6; k < th; k += 9) c.fillRect(X + off - w / 2, y - k, w, 1.5);
      y -= th;
    });
    c.fillStyle = "#6f5266";
    c.beginPath();
    c.moveTo(X - 6, y + 2);
    c.lineTo(X, H * 0.035);
    c.lineTo(X + 6, y + 2);
    c.fill();
    c.fillStyle = "#ffd59a";
    c.fillRect(X + 1, H * 0.06, 2, y - H * 0.06);
    // warm haze on the ground, a few birds
    const haze = c.createLinearGradient(0, H * 0.7, 0, H);
    haze.addColorStop(0, "rgba(255, 200, 140, 0)");
    haze.addColorStop(1, "rgba(255, 210, 160, 0.8)");
    c.fillStyle = haze;
    c.fillRect(0, H * 0.7, W, H * 0.3);
    c.strokeStyle = "rgba(70, 50, 60, 0.7)";
    c.lineWidth = 2.5;
    for (const [bx, by, s] of [[0.52, 0.22, 9], [0.56, 0.2, 7], [0.6, 0.24, 8]]) {
      c.beginPath();
      c.moveTo(W * bx - s, H * by - s * 0.5);
      c.quadraticCurveTo(W * bx - s * 0.4, H * by - s * 0.8, W * bx, H * by);
      c.quadraticCurveTo(W * bx + s * 0.4, H * by - s * 0.8, W * bx + s, H * by - s * 0.5);
      c.stroke();
    }
  },
  /** Miami Beach in the morning: the sun just over the ocean, pastel art-deco buildings, palms in front */
  miami(c, W, H, R) {
    const sky = c.createLinearGradient(0, 0, 0, H * 0.62);
    sky.addColorStop(0, "#6fa9de");
    sky.addColorStop(0.55, "#b9dcf0");
    sky.addColorStop(1, "#ffe7c8");
    c.fillStyle = sky;
    c.fillRect(0, 0, W, H);
    const sx = W * 0.64, sy = H * 0.5;
    const halo = c.createRadialGradient(sx, sy, 0, sx, sy, W * 0.55);
    halo.addColorStop(0, "rgba(255, 252, 235, 1)");
    halo.addColorStop(0.08, "rgba(255, 238, 200, 0.9)");
    halo.addColorStop(0.35, "rgba(255, 214, 160, 0.3)");
    halo.addColorStop(1, "rgba(255, 210, 160, 0)");
    c.fillStyle = halo;
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#fffbea";
    c.beginPath();
    c.arc(sx, sy, W * 0.04, 0, Math.PI * 2);
    c.fill();
    for (let i = 0; i < 5; i++) { // soft morning clouds
      c.fillStyle = `rgba(255, 255, 255, ${0.35 + R() * 0.3})`;
      const cx = R() * W, cy = H * (0.08 + R() * 0.25);
      for (let k = 0; k < 4; k++) {
        c.beginPath();
        c.ellipse(cx + (k - 1.5) * 26, cy + (k % 2) * 6, 34 + R() * 26, 12 + R() * 8, 0, 0, Math.PI * 2);
        c.fill();
      }
    }
    // the ocean: a band under the horizon, sun glitter
    const HZ = H * 0.6;
    const sea = c.createLinearGradient(0, HZ, 0, H);
    sea.addColorStop(0, "#5fb0cf");
    sea.addColorStop(1, "#2f86a8");
    c.fillStyle = sea;
    c.fillRect(0, HZ, W, H - HZ);
    c.fillStyle = "rgba(255, 246, 220, 0.85)";
    for (let i = 0; i < 70; i++) {
      const gy = HZ + 4 + R() * (H - HZ) * 0.5, spread = 20 + (gy - HZ) * 0.9;
      c.fillRect(sx + (R() - 0.5) * spread, gy, 6 + R() * 18, 2);
    }
    // pastel art-deco blocks along the beach (left and right), rounded corners, eyebrow ledges
    const PAST = ["#f6c6c9", "#bfe7d9", "#fbe3a7", "#f3f0e6", "#c9d9f5", "#ffd2b0"];
    const deco = (x, w, h, col) => {
      const base = H * 0.86;
      c.fillStyle = col;
      c.beginPath();
      c.roundRect(x, base - h, w, h + H, [w * 0.18, w * 0.18, 0, 0]);
      c.fill();
      c.fillStyle = "rgba(255, 255, 255, 0.55)";
      for (let y = base - h + 22; y < base - 8; y += 24) c.fillRect(x + 4, y, w - 8, 3);
      c.fillStyle = "rgba(60, 90, 120, 0.35)";
      for (let y = base - h + 30; y < base - 14; y += 24)
        for (let wx = x + 10; wx < x + w - 14; wx += 18) c.fillRect(wx, y, 9, 10);
      c.fillStyle = "rgba(255, 255, 255, 0.35)";
      c.fillRect(x + w - w * 0.22, base - h, w * 0.22, h);
    };
    [[-10, 90, 0.36], [84, 70, 0.27], [150, 96, 0.42], [W - 230, 80, 0.3], [W - 150, 104, 0.4], [W - 60, 80, 0.32]]
      .forEach(([x, w, h], i) => deco(x, w, H * h, PAST[i % PAST.length]));
    // sand and the boardwalk
    c.fillStyle = "#f4dfb8";
    c.fillRect(0, H * 0.86, W, H * 0.14);
    c.fillStyle = "rgba(190, 150, 100, 0.4)";
    c.fillRect(0, H * 0.86, W, 4);
    // palms in front: curved trunks, fronds
    const palm = (x, h, lean) => {
      const base = H * 1.02, topX = x + lean * h, topY = base - h;
      c.strokeStyle = "#5b4636";
      c.lineCap = "round";
      for (let k = 0; k < 14; k++) { // ringed trunk
        const t0 = k / 14, t1 = (k + 1) / 14;
        const px = (t) => x + lean * h * t * t, py = (t) => base - h * t;
        c.lineWidth = 16 - t0 * 7;
        c.beginPath();
        c.moveTo(px(t0), py(t0));
        c.lineTo(px(t1), py(t1));
        c.stroke();
      }
      c.fillStyle = "#2f6b47";
      for (let f = 0; f < 9; f++) {
        const a = -Math.PI * 0.95 + (f / 8) * Math.PI * 0.95 * 2 + (R() - 0.5) * 0.3, L = h * (0.28 + R() * 0.1);
        c.save();
        c.translate(topX, topY);
        c.rotate(a);
        c.beginPath();
        c.moveTo(0, 0);
        c.quadraticCurveTo(L * 0.5, -L * 0.22, L, L * 0.28);
        c.quadraticCurveTo(L * 0.5, L * 0.06, 0, 0);
        c.fill();
        c.restore();
      }
      c.fillStyle = "#4a3a2c";
      for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(topX + (R() - 0.5) * 12, topY + 6 + R() * 6, 6, 0, Math.PI * 2); c.fill(); }
    };
    palm(W * 0.12, H * 0.78, 0.18);
    palm(W * 0.3, H * 0.62, -0.12);
    palm(W * 0.86, H * 0.84, -0.2);
  },
};

/** a window on a view (VIEWS.night, VIEWS.dubai or a painter), blinds half down or rolled up (blinds: 0) */
export function cityWindow({ w = 2.6, h = 2.4, view = "night", blinds = 9, mullion = true, bright = 0.85, seed = 41, panes,
  frame = 0x16161a } = {}) {
  const R = rng(seed);
  const paint = typeof view === "function" ? view : VIEWS[view];
  const tex = canvasTex(1024, Math.round((1024 * h) / w), (c, W, H) => paint(c, W, H, R));
  const g = new THREE.Group();
  const v = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glow(0xffffff, { map: tex }));
  v.material.color.setScalar(bright);
  const fm = mat(frame, { roughness: 0.4 });
  const t = 0.1;
  const bars = [[0, h / 2, w + 2 * t, t], [0, -h / 2, w + 2 * t, t], [-w / 2, 0, t, h], [w / 2, 0, t, h]];
  if (mullion && !panes) bars.push([0, 0, 0.05, h]);
  if (panes) { // a steel factory window: a grid of panes
    const [cols, rows] = panes;
    for (let i = 1; i < cols; i++) bars.push([-w / 2 + (i * w) / cols, 0, 0.045, h]);
    for (let j = 1; j < rows; j++) bars.push([0, -h / 2 + (j * h) / rows, w, 0.045]);
  }
  for (const [x, y, bw, bh] of bars) {
    const b = box(bw, bh, 0.12, 0.01, fm);
    b.position.set(x, y, 0.04);
    g.add(b);
  }
  const sill = box(w + 0.4, 0.08, 0.35, 0.02, mat(0xf0ece6, { roughness: 0.5 }));
  sill.position.set(0, -h / 2 - 0.08, 0.15);
  g.add(v, sill);
  const bl = mat(0xe9e4dc, { roughness: 0.7 });
  if (blinds) {
    for (let i = 0; i < blinds; i++) {
      const s = box(w, 0.07, 0.02, 0.005, bl, false);
      s.position.set(0, h / 2 - 0.1 - i * 0.12, 0.12);
      s.rotation.x = 0.9;
      g.add(s);
    }
  } else {
    const roll = cyl(0.09, 0.09, w + 0.1, bl, 24);
    roll.rotation.z = Math.PI / 2;
    roll.position.set(0, h / 2 + 0.02, 0.16);
    g.add(roll);
  }
  g.userData.view = v;
  return g;
}
export const nightWindow = (o = {}) => cityWindow({ ...o, view: "night" });

/** soft light shapes (additive): a sun patch on the floor, a shaft of light through the air */
function softTex(kind) {
  return canvasTex(256, 256, (c, W, H) => {
    if (kind === "patch") {
      const g = c.createRadialGradient(W / 2, H / 2, W * 0.1, W / 2, H / 2, W * 0.5);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.6, "rgba(255,255,255,0.7)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
    } else {
      const v = c.createLinearGradient(0, 0, 0, H);
      v.addColorStop(0, "rgba(255,255,255,1)");
      v.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = v;
      c.fillRect(0, 0, W, H);
      c.globalCompositeOperation = "destination-in";
      const hgr = c.createLinearGradient(0, 0, W, 0);
      hgr.addColorStop(0, "rgba(0,0,0,0)");
      hgr.addColorStop(0.5, "rgba(0,0,0,1)");
      hgr.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = hgr;
      c.fillRect(0, 0, W, H);
    }
  });
}
export function sunPatch({ w = 3, d = 2, color = 0xffb465, strength = 0.5 } = {}) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), glow(color, { map: softTex("patch"), transparent: true, opacity: strength,
    blending: THREE.AdditiveBlending, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  return m;
}
export function lightShaft({ w = 2.4, h = 5.5, color = 0xffc27a, strength = 0.14 } = {}) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), glow(color, { map: softTex("shaft"), transparent: true, opacity: strength,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
}

/** framed print (draw(ctx, w, h) paints the art) */
export function poster({ w = 1.2, h = 1.6, draw, frame = 0x16161a } = {}) {
  const g = new THREE.Group();
  const f = box(w, h, 0.06, 0.01, mat(frame, { roughness: 0.4 }));
  const art = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.12, h - 0.12), mat(0xffffff, { map: canvasTex(512, Math.round(512 * h / w), draw), roughness: 0.8 }));
  art.position.z = 0.032;
  g.add(f, art);
  return g;
}

/** round rug */
export function rug({ r = 2.4, base = "#efe7da", ring = "#ff611d" } = {}) {
  const tex = canvasTex(1024, 1024, (c, W) => {
    c.fillStyle = base;
    c.beginPath();
    c.arc(W / 2, W / 2, W / 2, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = ring;
    c.lineWidth = 26;
    c.beginPath();
    c.arc(W / 2, W / 2, W * 0.4, 0, Math.PI * 2);
    c.stroke();
  });
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 96), mat(0xffffff, { map: tex, roughness: 1, alphaTest: 0.5, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.03;
  m.receiveShadow = true;
  return m;
}

/** a camera that looks at `target` from `dist` away (yaw/pitch around it, yaw 0 = from +z) and puts it at screen point
 *  (x, y) of the 1080×1920 frame. Returns { pos, at, fov } (what the sets' shots and the engine's camera use). */
export function shot(target, { dist = 10, fov = 30, yaw = 0, pitch = 0.1, x = 540, y = 840 } = {}) {
  const half = dist * Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const offY = ((960 - y) / 960) * half, offX = ((x - 540) / 540) * half * (1080 / 1920);
  const pos = [target.x + Math.sin(yaw) * Math.cos(pitch) * dist, target.y + Math.sin(pitch) * dist, target.z + Math.cos(yaw) * Math.cos(pitch) * dist];
  const right = [Math.cos(yaw), 0, -Math.sin(yaw)];
  return { pos, at: [target.x - right[0] * offX, target.y - offY, target.z - right[2] * offX], fov };
}

// ---------------- gym ----------------
/** black rubber gym tiles with coloured EPDM flecks (repeat it with room({ floorMap, floorTile })) */
export function rubberTex({ base = "#1c1d21", fleck = ["#ff611d", "#8b8f99", "#3d4a5c"], seed = 9 } = {}) {
  const R = rng(seed);
  return canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = base;
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) {
      c.fillStyle = R() < 0.82 ? `rgba(255,255,255,${0.02 + R() * 0.04})` : fleck[Math.floor(R() * fleck.length)];
      c.globalAlpha = R() < 0.82 ? 1 : 0.5;
      c.fillRect(R() * W, R() * H, 1.5 + R() * 2.5, 1.5 + R() * 2.5);
    }
    c.globalAlpha = 1;
    c.strokeStyle = "rgba(0,0,0,0.75)"; // the tile seams
    c.lineWidth = 4;
    c.strokeRect(1, 1, W - 2, H - 2);
  }, { srgb: true });
}

/** red-brown brick with dark mortar (repeat it with room({ wallMap, wallTile })) */
export function brickTex({ base = "#8c4a35", mortar = "#2e2420", rows = 14, cols = 5, seed = 17 } = {}) {
  const R = rng(seed);
  return canvasTex(1024, 1024, (c, W, H) => {
    c.fillStyle = mortar;
    c.fillRect(0, 0, W, H);
    const bh = H / rows, bw = W / cols, m = 7;
    for (let r = 0; r < rows; r++) {
      const off = r % 2 ? bw / 2 : 0;
      for (let k = -1; k <= cols; k++) {
        const x = k * bw + off;
        c.fillStyle = base;
        c.filter = `brightness(${0.78 + R() * 0.38}) saturate(${0.8 + R() * 0.4})`;
        c.fillRect(x + m / 2, r * bh + m / 2, bw - m, bh - m);
        c.filter = "none";
        c.fillStyle = `rgba(255,255,255,${R() * 0.05})`;
        c.fillRect(x + m / 2, r * bh + m / 2, bw - m, 4);
        for (let n = 0; n < 30; n++) {
          c.fillStyle = `rgba(0,0,0,${R() * 0.12})`;
          c.fillRect(x + m / 2 + R() * (bw - m - 4), r * bh + m / 2 + R() * (bh - m - 4), 3, 3);
        }
      }
    }
  });
}

const steel = (color = 0x1b1c20) => mat(color, { metalness: 0.6, roughness: 0.38, clearcoat: 0.4 });
const chrome = () => mat(0xd7dbe0, { metalness: 1, roughness: 0.18 });

/** hex dumbbell lying along x (len = full length) */
export function dumbbell({ len = 0.62, r = 0.11, color = 0x1a1a1d } = {}) {
  const g = new THREE.Group();
  const head = mat(color, { roughness: 0.55, clearcoat: 0.2 });
  const hw = len * 0.26;
  for (const sx of [-1, 1]) {
    const hd = cyl(r, r, hw, head, 6);
    hd.rotation.z = Math.PI / 2;
    hd.rotation.x = Math.PI / 6;
    hd.position.x = sx * (len / 2 - hw / 2);
    const cap = cyl(r * 0.35, r * 0.35, 0.012, chrome(), 20);
    cap.rotation.z = Math.PI / 2;
    cap.position.x = sx * (len / 2 + 0.004);
    g.add(hd, cap);
  }
  const handle = cyl(r * 0.28, r * 0.28, len - 2 * hw + 0.02, chrome(), 20);
  handle.rotation.z = Math.PI / 2;
  g.add(handle);
  return g;
}

/** two-tier dumbbell rack along x, the pairs getting heavier to the right */
export function dumbbellRack({ w = 3.4, h = 1.45, d = 0.8, n = 6 } = {}) {
  const g = new THREE.Group();
  const st = steel();
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = box(0.09, h, 0.09, 0.01, st);
    leg.position.set(sx * (w / 2 - 0.05), h / 2, sz * (d / 2 - 0.05));
    g.add(leg);
  }
  const tiers = [[h * 0.48, d * 0.15], [h, -d * 0.12]];
  tiers.forEach(([y, z], ti) => {
    const shelfB = box(w, 0.06, d * 0.55, 0.01, st);
    shelfB.position.set(0, y - 0.05, z);
    shelfB.rotation.x = 0.28;
    g.add(shelfB);
    for (let i = 0; i < n; i++) {
      const k = (i + ti * n) / (2 * n - 1), r = 0.075 + k * 0.08;
      const db = dumbbell({ len: r * 2.2, r, color: 0x1a1a1d });
      db.rotation.y = Math.PI / 2;
      db.position.set(-w / 2 + 0.25 + (i + 0.5) * ((w - 0.5) / n), y + r * 0.95, z + 0.02);
      g.add(db);
    }
  });
  return g;
}

/** flat bench along x: padded top (black vinyl, orange piping), steel spine, T feet */
export function flatBench({ l = 2.3, h = 0.62, w = 0.62 } = {}) {
  const g = new THREE.Group();
  const pad = soft(l, 0.24, w, mat(0x141417, { roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 }), { P: 4.2, puff: 0.05, seed: 4 });
  pad.position.y = h - 0.12;
  const pipe = box(l - 0.1, 0.03, w + 0.02, 0.012, mat(0xff611d, { roughness: 0.5 }), false);
  pipe.position.y = h - 0.22;
  const spine = box(l * 0.86, 0.12, 0.16, 0.02, steel());
  spine.position.y = h - 0.3;
  g.add(pad, pipe, spine);
  for (const sx of [-1, 1]) {
    const post = box(0.13, h - 0.36, 0.13, 0.02, steel());
    post.position.set(sx * l * 0.36, (h - 0.36) / 2 + 0.04, 0);
    const foot = box(0.18, 0.08, w * 1.25, 0.03, steel());
    foot.position.set(sx * l * 0.36, 0.04, 0);
    g.add(post, foot);
  }
  g.userData.top = h;
  return g;
}

/** wooden plyo box (jump box), hand holes on the sides */
export function plyoBox({ w = 1.35, h = 1.25, d = 1.05 } = {}) {
  const g = new THREE.Group();
  const wood = mat(0xffffff, { map: noiseTex("#d2a877", 7, 8, 256), roughness: 0.62, clearcoat: 0.12 });
  wood.map.repeat.set(1, 1);
  const b = box(w, h, d, 0.03, wood);
  b.position.y = h / 2;
  g.add(b);
  const hole = mat(0x2a1a10, { roughness: 1 });
  for (const sx of [-1, 1]) {
    const hh = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), hole);
    hh.scale.set(1, 0.42, 1);
    hh.position.set(sx * (w / 2 + 0.002), h * 0.78, 0);
    hh.rotation.y = sx * Math.PI / 2;
    g.add(hh);
  }
  const edge = mat(0x8a6040, { roughness: 0.7 });
  for (const [x, z, ww, dd] of [[0, d / 2, w, 0.02], [0, -d / 2, w, 0.02], [w / 2, 0, 0.02, d], [-w / 2, 0, 0.02, d]]) {
    const e = box(ww, 0.02, dd, 0.005, edge, false);
    e.position.set(x, h + 0.001, z);
    g.add(e);
  }
  g.userData.top = h;
  return g;
}

/** kettlebell with a coloured band */
export function kettlebell({ r = 0.24, color = 0x1d1e22, band = 0xff611d } = {}) {
  const g = new THREE.Group();
  const iron = mat(color, { roughness: 0.5, clearcoat: 0.25 });
  const bell = ball(r, iron, 32);
  bell.scale.set(1, 0.92, 1);
  bell.position.y = r * 0.9;
  const handle = shade(new THREE.Mesh(new THREE.TorusGeometry(r * 0.62, r * 0.16, 14, 32, Math.PI), iron));
  handle.position.y = r * 1.62;
  const ring = cyl(r * 1.005, r * 1.005, r * 0.22, mat(band, { roughness: 0.5 }), 32);
  ring.position.y = r * 0.9;
  g.add(bell, handle, ring);
  return g;
}

/** protein shaker: tinted body, orange screw lid, a flip cap */
export function shaker({ color = 0x232328, lid = 0xff611d } = {}) {
  const g = new THREE.Group();
  const body = cyl(0.13, 0.11, 0.42, mat(color, { roughness: 0.3, clearcoat: 0.8, transmission: 0.2 }), 32);
  body.position.y = 0.21;
  const cap = cyl(0.135, 0.135, 0.09, mat(lid, { roughness: 0.4, clearcoat: 0.4 }), 32);
  cap.position.y = 0.465;
  const spout = cyl(0.04, 0.05, 0.06, mat(lid, { roughness: 0.4 }), 16);
  spout.position.set(0.04, 0.54, 0);
  g.add(body, cap, spout);
  return g;
}

/** gym towel, folded and a little crumpled */
export function towel({ w = 0.9, d = 0.42, color = 0xf3f0ea, stripe = 0xff611d } = {}) {
  const g = new THREE.Group();
  const t = soft(w, 0.09, d, mat(color, { roughness: 1, sheen: 1, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.9 }),
    { P: 3, puff: 0.25, wrinkle: 0.02, seed: 6 });
  t.position.y = 0.05;
  const s = box(0.06, 0.092, d * 0.98, 0.02, mat(stripe, { roughness: 1 }), false);
  s.position.set(w * 0.34, 0.05, 0);
  g.add(t, s);
  return g;
}

/** bumper plate standing on its edge (axis along x) */
export function plate({ r = 0.48, w = 0.12, color = 0x17171a, ring = 0xff611d } = {}) {
  const g = new THREE.Group();
  const p = cyl(r, r, w, mat(color, { roughness: 0.6 }), 48);
  p.rotation.z = Math.PI / 2;
  const hub = cyl(r * 0.24, r * 0.24, w + 0.02, chrome(), 32);
  hub.rotation.z = Math.PI / 2;
  const rim = shade(new THREE.Mesh(new THREE.TorusGeometry(r * 0.72, 0.012, 8, 64), mat(ring, { roughness: 0.5 })));
  rim.rotation.y = Math.PI / 2;
  rim.position.x = w / 2 + 0.002;
  g.add(p, hub, rim);
  return g;
}

/** power rack with a loaded barbell on the J-hooks */
export function powerRack({ w = 2.6, h = 5.4, d = 1.8, bar = 3.1 } = {}) {
  const g = new THREE.Group();
  const st = steel(0x18191d), holes = mat(0x050506, { roughness: 1 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const up = box(0.16, h, 0.16, 0.015, st);
    up.position.set(sx * w / 2, h / 2, sz * d / 2);
    g.add(up);
    for (let y = 1.2; y < h - 0.4; y += 0.18) { // the hole line
      const hl = box(0.05, 0.05, 0.005, 0.005, holes, false);
      hl.position.set(sx * w / 2, y, sz * d / 2 + 0.083);
      g.add(hl);
    }
  }
  for (const sz of [-1, 1]) {
    const top = box(w + 0.16, 0.16, 0.16, 0.015, st);
    top.position.set(0, h, sz * d / 2);
    g.add(top);
  }
  for (const sx of [-1, 1]) {
    const side = box(0.16, 0.16, d, 0.015, st);
    side.position.set(sx * w / 2, h, 0);
    const foot = box(0.2, 0.08, d + 0.4, 0.02, st);
    foot.position.set(sx * w / 2, 0.04, 0);
    const hook = box(0.14, 0.12, 0.22, 0.02, mat(0xff611d, { roughness: 0.5 }));
    hook.position.set(sx * w / 2, 3.0, d / 2 + 0.16);
    g.add(side, foot, hook);
  }
  const bb = cyl(0.04, 0.04, bar, chrome(), 20);
  bb.rotation.z = Math.PI / 2;
  bb.position.set(0, 3.12, d / 2 + 0.2);
  g.add(bb);
  for (const sx of [-1, 1]) {
    const pl = plate({ r: 0.62, w: 0.14 });
    pl.position.set(sx * (w / 2 + 0.24), 3.12, d / 2 + 0.2);
    const pl2 = plate({ r: 0.5, w: 0.1, ring: 0xd7dbe0 });
    pl2.position.set(sx * (w / 2 + 0.38), 3.12, d / 2 + 0.2);
    g.add(pl, pl2);
  }
  return g;
}

/** industrial pendant: black cone shade, glowing bulb (add its PointLight in the set) */
export function pendant({ cord = 2.2, color = 0xffd7a0 } = {}) {
  const g = new THREE.Group();
  const c = cyl(0.008, 0.008, cord, mat(0x111111), 6);
  c.position.y = cord / 2;
  const shadeM = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.42, 0.42, 40, 1, true), mat(0x141416, { roughness: 0.4, side: THREE.DoubleSide }));
  shadeM.position.y = -0.21;
  const bulb = ball(0.11, glow(color), 20);
  bulb.position.y = -0.36;
  g.add(c, shadeM, bulb);
  return g;
}
