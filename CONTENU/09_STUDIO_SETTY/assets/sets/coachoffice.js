// Set "coachoffice": the coach's office in a Brooklyn brownstone, soft morning light (reel14). A deep green wall over
// cream wainscoting, a tufted oxblood leather couch (the clients' couch), a navy velvet club armchair facing it, a walnut
// bookcase, his framed coaching certificate, a brass floor lamp, a side table with a tissue box and a glass of water, a
// Persian-style rug, a tall small-paned window on a leafy street with the brownstones across, the morning sun slanting in.
// He slumps on his own clients' couch, phone in hand; Setty sits in the coach's armchair like a therapist, a legal pad
// and a pen on the armrest. The joke: he pays rent on an office and gives the coaching away in his DMs.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4;
const WALL = "#2d4537", CREAM = 0xebe3d4;

/** a point of a piece of furniture (local x, z) in the world, for a piece placed at (px, pz) turned by ry */
const toWorld = (px, pz, ry, x, z) => [px + x * Math.cos(ry) + z * Math.sin(ry), pz - x * Math.sin(ry) + z * Math.cos(ry)];

// ---- the furniture of this set (kept here: only this reel uses it)
/** a tufted chesterfield couch in oxblood leather (cognac looked like the coach's skin, his arms melted into it): rolled arms as high as the back, deep buttons on the back, two seat
 *  cushions, turned wooden feet; front toward +z. Seat height like the livingroom couch (the coach's feet reach the floor). */
function chesterfield({ w = 4.6, d = 1.75, color = 0x5e1d18 } = {}) {
  const g = new THREE.Group();
  const leather = K.mat(color, { roughness: 0.42, clearcoat: 0.45, clearcoatRoughness: 0.35, sheen: 0.4, sheenColor: new THREE.Color(0xff9c8a) });
  const dark = K.mat(0x2a0c09, { roughness: 0.5, clearcoat: 0.3 });
  const wood = K.mat(0x3b2416, { roughness: 0.45, clearcoat: 0.4 });
  const arm = 0.62, legH = 0.1, baseTop = 0.3, cushH = 0.24, seat = baseTop + cushH, backTop = 1.55;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = K.cyl(0.07, 0.05, legH, wood, 16);
    leg.position.set(sx * (w / 2 - 0.22), legH / 2, sz * (d / 2 - 0.2));
    g.add(leg);
  }
  const base = K.box(w, baseTop - legH, d, 0.06, leather);
  base.position.set(0, (baseTop + legH) / 2, 0);
  // the back: a thick tufted block whose front face sits at z ≈ 0 (the coach's back rests on it)
  const bd = 0.86;
  const back = K.box(w - 0.04, backTop - legH, bd, 0.14, leather);
  back.position.set(0, (backTop + legH) / 2, -d / 2 + bd / 2);
  g.add(base, back);
  // the buttons, in a diamond grid on the front of the back, each in a small dimple
  const front = -d / 2 + bd + 0.004, inner = w - 2 * arm;
  for (let r = 0; r < 3; r++) {
    const y = seat + 0.28 + r * 0.24, off = r % 2 ? 0.19 : 0;
    for (let x = -inner / 2 + 0.2 + off; x < inner / 2 - 0.1; x += 0.38) {
      const dim = K.ball(0.05, dark, 12);
      dim.scale.set(1, 1, 0.35);
      dim.position.set(x, y, front - 0.01);
      const btn = K.ball(0.028, dark, 10);
      btn.position.set(x, y, front + 0.005);
      g.add(dim, btn);
    }
  }
  // the arms, as high as the back, rolled at the top (a fat cylinder along z), the scroll's face at the front
  for (const sx of [-1, 1]) {
    const a = K.box(arm, backTop - 0.2 - legH, d, 0.1, leather);
    a.position.set(sx * (w / 2 - arm / 2), (backTop - 0.2 + legH) / 2, 0);
    const roll = K.cyl(0.26, 0.26, d + 0.04, leather, 32);
    roll.rotation.x = Math.PI / 2;
    roll.position.set(sx * (w / 2 - arm / 2 + 0.03), backTop - 0.22, 0.02);
    const scroll = K.cyl(0.2, 0.2, 0.03, K.mat(color, { roughness: 0.5, clearcoat: 0.4 }), 32); // not black: it read as a hole
    scroll.rotation.x = Math.PI / 2;
    scroll.position.set(sx * (w / 2 - arm / 2 + 0.03), backTop - 0.22, d / 2 + 0.045);
    g.add(a, roll, scroll);
  }
  // two seat cushions, a little worn in the middle
  const cw = inner / 2;
  for (let i = 0; i < 2; i++) {
    const c = K.soft(cw - 0.03, cushH, d - bd + 0.05, leather, { P: 3.6, puff: 0.18, wrinkle: 0.01, seed: 70 + i });
    c.position.set(-inner / 2 + cw * (i + 0.5), baseTop + cushH / 2, -d / 2 + bd + (d - bd) / 2 - 0.02);
    g.add(c);
  }
  // a cream knit pillow in the left corner (his clients' side: the one he never sits on)
  const knit = K.mat(0xe9e1d3, { roughness: 0.95, sheen: 0.7, sheenColor: new THREE.Color(0xffffff) });
  const pil = K.soft(0.8, 0.78, 0.26, knit, { P: 2.6, puff: 0.35, seed: 72 });
  pil.position.set(-inner / 2 + 0.45, seat + 0.4, -d / 2 + bd + 0.14);
  pil.rotation.set(-0.2, 0.25, 0.15);
  g.add(pil);
  g.userData = { seat, backTop, armX: w / 2 - arm / 2, front: d / 2, inner };
  return g;
}

/** a club armchair in navy velvet: low wide arms, a deep seat cushion, a curved back; front toward +z */
function clubChair({ w = 2.0, d = 1.8, color = 0x1d2742 } = {}) {
  const g = new THREE.Group();
  const velvet = K.mat(color, { roughness: 0.78, sheen: 1, sheenColor: new THREE.Color(0x7d8fc8), sheenRoughness: 0.45 });
  const wood = K.mat(0x3b2416, { roughness: 0.45, clearcoat: 0.4 });
  const legH = 0.12, baseTop = 0.66, cushH = 0.26, seat = baseTop + cushH, armTop = seat + 0.3, arm = 0.42, backTop = seat + 1.3;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = K.cyl(0.06, 0.045, legH, wood, 16);
    leg.position.set(sx * (w / 2 - 0.2), legH / 2, sz * (d / 2 - 0.2));
    g.add(leg);
  }
  const base = K.box(w, baseTop - legH, d, 0.12, velvet);
  base.position.set(0, (baseTop + legH) / 2, 0);
  const back = K.box(w, backTop - legH, 0.45, 0.2, velvet);
  back.position.set(0, (backTop + legH) / 2, -d / 2 + 0.23);
  back.rotation.x = -0.06;
  g.add(base, back);
  for (const sx of [-1, 1]) {
    const a = K.box(arm, armTop - legH, d - 0.1, 0.18, velvet);
    a.position.set(sx * (w / 2 - arm / 2), (armTop + legH) / 2, 0.05);
    g.add(a);
  }
  const cush = K.soft(w - 2 * arm - 0.02, cushH, d - 0.5, velvet, { P: 3.4, puff: 0.2, seed: 81 });
  cush.position.set(0, baseTop + cushH / 2, 0.2);
  g.add(cush);
  g.userData = { seat, armTop, armX: w / 2 - arm / 2 };
  return g;
}

/** a yellow legal pad with a pen across it (the therapist's notes) */
function legalPad() {
  const g = new THREE.Group();
  const tex = K.canvasTex(256, 360, (c, W, H) => {
    c.fillStyle = "#f7e47e";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#c9372c";
    c.fillRect(0, 0, W, 34);
    c.strokeStyle = "rgba(70, 110, 170, 0.55)";
    c.lineWidth = 2;
    for (let y = 70; y < H; y += 22) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    c.strokeStyle = "rgba(200, 60, 60, 0.6)";
    c.beginPath(); c.moveTo(46, 34); c.lineTo(46, H); c.stroke();
    c.strokeStyle = "#1d2433"; // two lines of scribbles
    c.lineWidth = 3;
    for (const [y, l] of [[86, 170], [108, 130], [152, 150]]) {
      c.beginPath();
      c.moveTo(56, y);
      for (let x = 56; x < 56 + l; x += 10) c.lineTo(x + 5, y + (x % 20 ? -5 : 3));
      c.stroke();
    }
  });
  const pad = K.box(0.38, 0.04, 0.52, 0.01, K.mat(0xffffff, { map: tex, roughness: 0.85 }));
  const pen = K.cyl(0.018, 0.018, 0.46, K.mat(0x14161c, { roughness: 0.3, clearcoat: 0.6 }), 12);
  pen.rotation.set(Math.PI / 2, 0, 0.5);
  pen.position.set(0.02, 0.045, 0.02);
  const tip = K.cyl(0.018, 0.004, 0.05, K.mat(0xd9a94a, { metalness: 1, roughness: 0.3 }), 12);
  tip.rotation.copy(pen.rotation);
  tip.position.set(0.02 - Math.sin(0.5) * 0.25, 0.045, 0.02 + Math.cos(0.5) * 0.25);
  g.add(pad, pen, tip);
  return g;
}

/** a walnut bookcase full of books (some lying in stacks), a brass bookend, a small plant, a framed photo */
function bookcase({ w = 2.0, h = 5.4, d = 0.6, shelves = 6, seed = 141 } = {}) {
  const R = K.rng(seed), g = new THREE.Group();
  const wood = K.mat(0x4a2c1a, { roughness: 0.5, clearcoat: 0.3, map: K.woodTex({ base: "#5a3620", planks: 2, seed: 9 }) });
  const side = (x) => { const s = K.box(0.08, h, d, 0.01, wood); s.position.set(x, h / 2, 0); g.add(s); };
  side(-w / 2 + 0.04);
  side(w / 2 - 0.04);
  const bk = K.box(w, h, 0.04, 0.01, K.mat(0x2a1a10, { roughness: 0.8 }), false);
  bk.position.set(0, h / 2, -d / 2 + 0.02);
  g.add(bk);
  const COLS = [0x7a2a25, 0x1f2b45, 0xe8dfcc, 0x3e5a3a, 0xc39a3a, 0x1a1a1d, 0x8a6a4a, 0xd96a2e, 0x5c3a52, 0x2d5c63];
  const step = (h - 0.3) / shelves;
  for (let s = 0; s <= shelves; s++) {
    const y = 0.15 + s * step;
    const board = K.box(w - 0.08, 0.06, d - 0.04, 0.01, wood);
    board.position.set(0, y, 0.01);
    g.add(board);
    if (s === shelves) break;
    let x = -w / 2 + 0.12;
    const stackAt = R() < 0.6 ? 0.35 + R() * 0.3 : 2; // where a stack of lying books goes (fraction of the width)
    while (x < w / 2 - 0.16) {
      if ((x + w / 2) / w > stackAt && (x + w / 2) / w < stackAt + 0.05) { // a stack lying flat
        let sy = y + 0.03;
        for (let k = 0; k < 3 + Math.floor(R() * 3); k++) {
          const t = 0.06 + R() * 0.04, bw = 0.45 + R() * 0.12;
          const b = K.box(bw, t, d - 0.18, 0.01, K.mat(COLS[Math.floor(R() * COLS.length)], { roughness: 0.7 }));
          b.position.set(x + 0.26, sy + t / 2, 0.02);
          b.rotation.y = (R() - 0.5) * 0.15;
          g.add(b);
          sy += t;
        }
        x += 0.6;
        continue;
      }
      if (s === 2 && x > 0.2 && x < 0.32) { // a small framed photo leaning against the books
        const fr = K.box(0.34, 0.42, 0.04, 0.01, K.mat(0xd9a94a, { metalness: 1, roughness: 0.3 }));
        fr.position.set(x + 0.17, y + 0.24, 0.12);
        fr.rotation.x = -0.12;
        const ph = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.34), K.mat(0x9fb8c8, { roughness: 0.8 }));
        ph.position.set(x + 0.17, y + 0.24, 0.145);
        ph.rotation.x = -0.12;
        g.add(fr, ph);
        x += 0.4;
        continue;
      }
      const bw = 0.07 + R() * 0.07, bh = Math.min(step - 0.12, 0.5 + R() * 0.3);
      const b = K.box(bw, bh, d - 0.16 - R() * 0.08, 0.008, K.mat(COLS[Math.floor(R() * COLS.length)], { roughness: 0.65 + R() * 0.2 }));
      b.position.set(x + bw / 2, y + 0.03 + bh / 2, 0.03);
      if (R() < 0.08) b.rotation.z = 0.12;
      g.add(b);
      x += bw + 0.006;
    }
  }
  const brass = K.mat(0xd9a94a, { metalness: 1, roughness: 0.28 });
  const bookend = K.box(0.08, 0.38, 0.3, 0.02, brass);
  bookend.position.set(w / 2 - 0.2, 0.15 + 4 * step + 0.22, 0.05);
  const pl = K.plant({ h: 0.6, n: 7, seed: seed + 3 });
  pl.scale.setScalar(0.42);
  pl.position.set(-w / 2 + 0.32, 0.15 + 5 * step + 0.03, 0.04);
  g.add(bookend, pl);
  return g;
}

/** a brass floor lamp with a cream drum shade (warm, on even in the morning); add its PointLight in the set */
function drumLamp({ h = 4.3 } = {}) {
  const g = new THREE.Group();
  const brass = K.mat(0xd9a94a, { metalness: 1, roughness: 0.3 });
  const base = K.cyl(0.32, 0.36, 0.06, brass);
  base.position.y = 0.03;
  const pole = K.cyl(0.03, 0.03, h, brass, 16);
  pole.position.y = h / 2;
  const shade = K.cyl(0.42, 0.5, 0.62, K.glow(0xffe2b8, { side: THREE.DoubleSide }), 40);
  shade.castShadow = false;
  shade.position.y = h + 0.05;
  g.add(base, pole, shade);
  return g;
}

/** a small round walnut side table with a tissue box (a tissue sticking out) and a glass of water */
function sideTable({ h = 1.15 } = {}) {
  const g = new THREE.Group();
  const wood = K.mat(0x4a2c1a, { roughness: 0.45, clearcoat: 0.45 });
  const top = K.cyl(0.48, 0.48, 0.07, wood, 40);
  top.position.y = h - 0.035;
  const stem = K.cyl(0.06, 0.08, h - 0.1, wood, 16);
  stem.position.y = (h - 0.1) / 2 + 0.04;
  const foot = K.cyl(0.32, 0.36, 0.06, wood, 32);
  foot.position.y = 0.03;
  const tb = K.box(0.5, 0.26, 0.3, 0.03, K.mat(0xe8e2d6, { roughness: 0.6 }));
  tb.position.set(-0.1, h + 0.13, 0.02);
  tb.rotation.y = 0.35;
  const tissue = K.soft(0.2, 0.2, 0.08, K.mat(0xffffff, { roughness: 0.9 }), { P: 2.4, puff: 0.4, wrinkle: 0.02, seed: 91 });
  tissue.position.set(-0.1, h + 0.33, 0.02);
  tissue.rotation.set(0.1, 0.35, 0.25);
  const glass = K.cyl(0.08, 0.07, 0.28, K.mat(0xffffff, { transmission: 1, roughness: 0.05, thickness: 0.1, transparent: true, opacity: 0.35 }), 24);
  glass.position.set(0.25, h + 0.14, 0.12);
  const water = K.cyl(0.07, 0.065, 0.18, K.mat(0xbfe3f2, { transparent: true, opacity: 0.45, roughness: 0.05 }), 24);
  water.position.set(0.25, h + 0.1, 0.12);
  g.add(top, stem, foot, tb, tissue, glass, water);
  return g;
}

/** cream wainscoting along the back wall: a panelled lower wall, a chair rail on top */
function wainscot({ w = 18, h = 2.3 } = {}) {
  const g = new THREE.Group();
  const paint = K.mat(CREAM, { roughness: 0.55, clearcoat: 0.15 });
  const board = K.box(w, h, 0.06, 0.01, paint, false);
  board.position.set(0, h / 2, 0.03);
  const rail = K.box(w, 0.12, 0.14, 0.02, paint);
  rail.position.set(0, h, 0.07);
  g.add(board, rail);
  for (let x = -w / 2 + 0.9; x < w / 2 - 0.5; x += 1.5) {
    const p = K.box(1.15, h - 0.65, 0.05, 0.02, paint);
    p.position.set(x + 0.2, h / 2 + 0.06, 0.08);
    g.add(p);
  }
  return g;
}

/** a Persian-style rug: navy field, red and cream borders, a central medallion */
function persianRug({ w = 6.4, d = 4.2 } = {}) {
  const tex = K.canvasTex(1024, Math.round((1024 * d) / w), (c, W, H) => {
    const rect = (m, col) => { c.fillStyle = col; c.fillRect(m, m, W - 2 * m, H - 2 * m); };
    rect(0, "#7e2622"); // the outer red border, a row of gold diamonds in it
    rect(12, "#e9dcc0");
    rect(18, "#7e2622");
    c.fillStyle = "#d8a84a";
    const dmd = (x, y) => { c.beginPath(); c.moveTo(x, y - 12); c.lineTo(x + 12, y); c.lineTo(x, y + 12); c.lineTo(x - 12, y); c.fill(); };
    for (let x = 60; x < W - 40; x += 46) { dmd(x, 50); dmd(x, H - 50); }
    for (let y = 96; y < H - 80; y += 46) { dmd(50, y); dmd(W - 50, y); }
    rect(82, "#e9dcc0");
    rect(90, "#1f2a46"); // the navy field
    c.fillStyle = "#7e2622"; // corner quarter-rounds
    for (const [x, y, a0] of [[90, 90, 0], [W - 90, 90, Math.PI / 2], [W - 90, H - 90, Math.PI], [90, H - 90, -Math.PI / 2]]) {
      c.beginPath(); c.moveTo(x, y); c.arc(x, y, 120, a0, a0 + Math.PI / 2); c.fill();
    }
    const cx = W / 2, cy = H / 2; // the medallion
    const dia = (rx, ry, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(cx, cy - ry); c.lineTo(cx + rx, cy); c.lineTo(cx, cy + ry); c.lineTo(cx - rx, cy); c.closePath(); c.fill(); };
    dia(300, 200, "#7e2622");
    dia(270, 178, "#e9dcc0");
    dia(250, 162, "#a3352c");
    dia(150, 96, "#d8a84a");
    dia(110, 70, "#1f2a46");
    c.fillStyle = "#e9dcc0";
    c.beginPath(); c.arc(cx, cy, 24, 0, Math.PI * 2); c.fill();
    const R = K.rng(5); // wear: a few light streaks
    for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(255, 240, 220, ${0.03 + R() * 0.04})`; c.fillRect(R() * W, R() * H, 2 + R() * 40, 2); }
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), K.mat(0xffffff, { map: tex, roughness: 1, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.03;
  m.receiveShadow = true;
  return m;
}

/** his coaching certificate: cream paper, a gold double border, a gold seal, two signature lines (generic, no school) */
function certificate(c, W, H) {
  c.fillStyle = "#f4ecd8";
  c.fillRect(0, 0, W, H);
  c.strokeStyle = "#b8893a";
  c.lineWidth = 10;
  c.strokeRect(22, 22, W - 44, H - 44);
  c.lineWidth = 3;
  c.strokeRect(40, 40, W - 80, H - 80);
  c.fillStyle = "#1f2433";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = "700 46px Georgia, serif";
  c.fillText("CERTIFICATE", W / 2, 110);
  c.font = "italic 26px Georgia, serif";
  c.fillText("of completion", W / 2, 152);
  c.font = "700 30px Georgia, serif";
  c.fillText("High-Performance", W / 2, 214);
  c.fillText("Coaching", W / 2, 250);
  c.strokeStyle = "rgba(31, 36, 51, 0.6)";
  c.lineWidth = 2;
  for (const x of [W * 0.3, W * 0.7]) { c.beginPath(); c.moveTo(x - 70, H - 80); c.lineTo(x + 70, H - 80); c.stroke(); }
  c.beginPath(); c.moveTo(W * 0.3 - 50, H - 92); c.bezierCurveTo(W * 0.3 - 20, H - 120, W * 0.3, H - 70, W * 0.3 + 40, H - 98); c.stroke();
  // the gold seal with its ribbons
  const sx = W / 2, sy = H - 128;
  c.fillStyle = "#c9372c";
  c.beginPath(); c.moveTo(sx - 26, sy + 20); c.lineTo(sx - 44, sy + 76); c.lineTo(sx - 20, sy + 64); c.lineTo(sx - 6, sy + 84); c.lineTo(sx + 2, sy + 22); c.fill();
  c.beginPath(); c.moveTo(sx + 26, sy + 20); c.lineTo(sx + 44, sy + 76); c.lineTo(sx + 20, sy + 64); c.lineTo(sx + 6, sy + 84); c.lineTo(sx - 2, sy + 22); c.fill();
  c.fillStyle = "#d8a84a";
  c.beginPath();
  for (let i = 0; i <= 48; i++) { const a = (i / 48) * Math.PI * 2, r = i % 2 ? 40 : 46; c.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); }
  c.fill();
  c.strokeStyle = "#a8782a";
  c.lineWidth = 3;
  c.beginPath(); c.arc(sx, sy, 30, 0, Math.PI * 2); c.stroke();
}

/** the street from a parlor floor in Brooklyn, in the morning: a pale sky with a warm haze, the brownstones across
 *  with their cornices, white-trimmed windows and stoops, sunlit trees in front (gradients only: no ctx.filter) */
function brownstoneStreet(c, W, H, R) {
  const sky = c.createLinearGradient(0, 0, 0, H * 0.4);
  sky.addColorStop(0, "#8fc0e6");
  sky.addColorStop(1, "#f4e2bf");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  // the facades across the street
  const FAC = ["#7b4a39", "#8c5a43", "#6c3f31", "#93604a", "#7f5240"];
  let x = -40, k = 0;
  const top = H * 0.16;
  while (x < W) {
    const fw = 230 + R() * 60, col = FAC[k++ % FAC.length], ft = top + R() * H * 0.05;
    c.fillStyle = col;
    c.fillRect(x, ft, fw, H - ft);
    c.fillStyle = "rgba(0, 0, 0, 0.28)"; // the cornice
    c.fillRect(x - 6, ft - 10, fw + 12, 26);
    c.fillStyle = "rgba(255, 230, 190, 0.18)";
    c.fillRect(x - 6, ft - 10, fw + 12, 6);
    for (let r = 0; r < 4; r++) for (let q = 0; q < 2; q++) { // windows with white trims, some with a warm lamp
      const wx = x + 40 + q * (fw / 2 - 10), wy = ft + 46 + r * ((H - ft) / 4.6), ww = fw / 2 - 70, wh = (H - ft) / 7;
      c.fillStyle = "#efe9de";
      c.fillRect(wx - 6, wy - 10, ww + 12, wh + 16);
      c.fillStyle = R() < 0.18 ? "#f3c77a" : "#33404d";
      c.fillRect(wx, wy, ww, wh);
      c.fillStyle = "rgba(255, 255, 255, 0.22)";
      c.fillRect(wx, wy, ww, wh * 0.35);
    }
    const sun = c.createLinearGradient(x, 0, x + fw, 0); // the morning sun from the right
    sun.addColorStop(0, "rgba(0, 0, 0, 0.12)");
    sun.addColorStop(1, "rgba(255, 210, 150, 0.16)");
    c.fillStyle = sun;
    c.fillRect(x, ft, fw, H - ft);
    x += fw + 4;
  }
  // the trees in front: dark trunks, then big clusters of leaves, darker inside, sunlit on the right
  const trees = [W * 0.18, W * 0.62, W * 0.98];
  for (const tx of trees) {
    c.fillStyle = "#3b2c22";
    c.fillRect(tx - 14, H * 0.45, 28, H * 0.6);
    for (let i = 0; i < 70; i++) {
      const a = R() * Math.PI * 2, rr = R() * W * 0.2, px = tx + Math.cos(a) * rr * 1.2, py = H * 0.3 + Math.sin(a) * rr * 0.75;
      const r = 26 + R() * 40;
      const lit = (px - tx) / (W * 0.24) + (R() - 0.5) * 0.6;
      c.fillStyle = lit > 0.35 ? "#a9c968" : lit > -0.2 ? "#6f9a45" : "#3f6a33";
      c.globalAlpha = 0.9;
      c.beginPath(); c.arc(px, py, r, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
  }
  // the sun's glare from the top right, and a soft warm haze over everything
  const gl = c.createRadialGradient(W * 0.92, H * 0.04, 10, W * 0.92, H * 0.04, W * 0.7);
  gl.addColorStop(0, "rgba(255, 244, 214, 0.85)");
  gl.addColorStop(1, "rgba(255, 244, 214, 0)");
  c.fillStyle = gl;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "rgba(255, 236, 205, 0.12)";
  c.fillRect(0, 0, W, H);
}

export async function build({ renderer, scene, mood = "morning" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45;
  scene.background = new THREE.Color(0x1d2a22);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 18, h: 11, d: 18, wall: WALL, floor: "#8a5b3a", backZ: BACK, baseboard: false }));
  const ws = wainscot();
  ws.position.z = BACK;
  set.add(ws);

  // ---- the back wall: the bookcase (left), his certificate, the tall small-paned window on the street (right)
  const shelfL = bookcase();
  K.at(shelfL, -3.55, 0, BACK + 0.32);
  const cert = K.poster({ w: 1.05, h: 1.35, draw: certificate, frame: 0x2a1a10 });
  K.at(cert, 0.35, 4.95, BACK + 0.05);
  const WIN = { x: 2.85, y: 5.05, w: 2.7, h: 4.2 };
  const win = K.cityWindow({ w: WIN.w, h: WIN.h, view: brownstoneStreet, blinds: 0, panes: [3, 5], frame: 0xf2eee6, bright: 1.0, seed: 64 });
  K.at(win, WIN.x, WIN.y, BACK + 0.02);
  // the morning sun through the window: a warm glow on the wall around it, a shaft through the air, a patch on the rug
  const winGlow = K.wallGlow({ w: 6.5, h: 6.5, color: "#ffd9a0", strength: 0.22 });
  K.at(winGlow, WIN.x, WIN.y, BACK + 0.06);
  const shaft = K.lightShaft({ w: 2.4, h: 6.2, color: 0xffd7a0, strength: 0.1 });
  shaft.position.set(WIN.x - 0.6, 3.6, -1.2);
  shaft.rotation.set(0.15, 0.5, 0.42);
  const sunFloor = K.sunPatch({ w: 3.4, d: 2.2, color: 0xffc27a, strength: 0.32 });
  sunFloor.position.set(1.0, 0.05, 0.9);
  sunFloor.rotation.z = 0.5;
  set.add(shelfL, cert, win, winGlow, shaft, sunFloor);

  // ---- the couch (left, a little turned toward the armchair), the armchair (right, turned toward the couch), the rug
  const COUCH = { x: -1.55, z: -1.95, ry: 0.16 };
  const sofa = chesterfield();
  K.at(sofa, COUCH.x, 0, COUCH.z, COUCH.ry);
  const CHAIR = { x: 2.55, z: -1.15, ry: -0.62 };
  const chair = clubChair();
  K.at(chair, CHAIR.x, 0, CHAIR.z, CHAIR.ry);
  const rug = persianRug();
  K.at(rug, 0.4, 0, 0.2, 0.04);
  set.add(sofa, chair, rug);
  // the legal pad on the armchair's front arm (the one toward the couch and the camera)
  const pad = legalPad();
  const [px, pz] = toWorld(CHAIR.x, CHAIR.z, CHAIR.ry, -chair.userData.armX, 0.35);
  K.at(pad, px, chair.userData.armTop + 0.02, pz, CHAIR.ry + 0.25);
  set.add(pad);

  // ---- the side table between them (back), the floor lamp behind the armchair, a tall plant in the left corner
  const st = sideTable();
  K.at(st, 0.95, 0, -2.55);
  const fl = drumLamp();
  K.at(fl, 4.35, 0, -2.75);
  const plantL = K.plant({ h: 3.3, n: 11, seed: 33, pot: 0x2a2a2e });
  K.at(plantL, -5.0, 0, -2.6);
  set.add(st, fl, plantL);

  // ---- lights. Morning: the sun through the window (back right) is a warm rim that casts the shadows, a soft daylight
  // key from the front left (the room's other window, behind the camera), a warm fill, the floor lamp as a practical.
  set.add(new THREE.HemisphereLight(0xdfe8f2, 0x5a3a24, 0.75));
  const key = new THREE.DirectionalLight(0xfff4e8, 1.75); // daylight from the front left
  key.position.set(-6, 6.5, 9);
  key.target.position.set(0.4, 2.2, -1.5);
  const fill = new THREE.DirectionalLight(0xffe6cc, 0.7);
  fill.position.set(5, 7, 10);
  fill.target.position.set(0.4, 2.2, -1.5);
  const rim = new THREE.DirectionalLight(0xffc98a, 2.4); // the sun, low through the window
  rim.position.set(7, 8.5, -10);
  rim.target.position.set(0.0, 1.0, 0.5);
  rim.castShadow = true;
  rim.shadow.mapSize.set(2048, 2048);
  rim.shadow.radius = 6;
  rim.shadow.bias = -0.0005;
  Object.assign(rim.shadow.camera, { left: -9, right: 9, top: 9, bottom: -5, near: 1, far: 34 });
  set.add(key, key.target, fill, fill.target, rim, rim.target);
  const pl = (color, intensity, x, y, z, distance = 6) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lights = {
    lamp: pl(0xffc98e, 6, 4.35, 4.2, -2.4, 6),
    window: pl(0xffe0b0, 5, WIN.x - 0.4, 4.6, BACK + 1.4, 8),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const seat = sofa.userData.seat;
  // on the couch's right seat (toward the armchair): hips just above the cushion, back on the tufted back, sneakers on the
  // rug; the same heights as the livingroom couch (reel6), whose seat this one copies
  const [cx, cz] = toWorld(COUCH.x, COUCH.z, COUCH.ry, sofa.userData.inner / 4 - 0.05, 0.62);
  const coach = { x: cx, y: seat - 1.12 + 0.12, z: cz, turn: 0.52, sit: 1, phone: 1 };
  // Setty in the armchair, facing the couch, on two cream cushions (the therapist needs a booster): sunk in the seat, the
  // chair's arms hid his own arms, and his face sat too far under the coach's head for the wide (no room for the end
  // notification)
  const [sx, sz] = toWorld(CHAIR.x, CHAIR.z, CHAIR.ry, 0, 0.12);
  const CU = 0.27, S = 0.68;
  const cream = K.mat(0xe9e1d3, { roughness: 0.95, sheen: 0.7, sheenColor: new THREE.Color(0xffffff) });
  const cush1 = K.soft(0.98, CU, 0.98, cream, { P: 2.8, puff: 0.3, seed: 83 });
  K.at(cush1, sx, chair.userData.seat + CU / 2 - 0.04, sz, CHAIR.ry);
  const cush2 = K.soft(0.86, CU, 0.86, K.mat(0xd8c9ad, { roughness: 0.95, sheen: 0.7, sheenColor: new THREE.Color(0xffffff) }), { P: 2.8, puff: 0.3, seed: 84 });
  K.at(cush2, sx, chair.userData.seat + CU * 1.5 - 0.1, sz, CHAIR.ry + 0.3);
  set.add(cush1, cush2);
  const setty = { x: sx, y: chair.userData.seat + 2 * CU - 0.06 - 0.28 * (S / 0.6) - 0.02, z: sz, turn: -0.62, scale: S };
  const coachHead = new THREE.Vector3(coach.x + 0.15, coach.y + 4.5, coach.z + 0.2);
  const settyFace = new THREE.Vector3(setty.x, setty.y + 1.7 * S + 0.04, setty.z);
  const PAD = new THREE.Vector3(px, chair.userData.armTop + 0.05, pz);
  return {
    key, rim, lights, root: set,
    coach, setty,
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      // lower than reel6's (740/800): the 3-line hook title hid the beanie and the top of Setty (as reel11, 880/900)
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 880 },
      setty: { target: settyFace, dist: 11.5, yaw: -0.34, pitch: 0.08, y: 900 }, // scale 0.68: a step back
    },
    shots: {
      wide: { pos: [0.55, 4.0, 18.8], at: [0.55, 3.15, -1.5], fov: 39 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 880 }),
      setty: K.shot(settyFace, { dist: 11.5, yaw: -0.34, pitch: 0.08, y: 900 }),
      // cut-ins: the therapist's legal pad on the armrest, the tissue box on the side table, his certificate on the wall
      pad: K.shot(PAD, { dist: 4.2, yaw: -0.5, pitch: 0.7, y: 900 }),
      tissues: K.shot(new THREE.Vector3(0.9, 1.4, -2.5), { dist: 5.0, yaw: 0.1, pitch: 0.25, y: 880 }),
      certificate: K.shot(new THREE.Vector3(0.35, 4.95, BACK + 0.05), { dist: 6.5, yaw: 0.05, pitch: 0.02, y: 760 }),
    },
  };
}
