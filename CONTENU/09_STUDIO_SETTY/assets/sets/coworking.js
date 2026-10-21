// Set "coworking": an empty coworking at night (reel12, the price ghost). Everyone went home: one long oak communal
// table under a row of black pendants, empty shell chairs pushed in, closed laptops, a glass phone booth glowing in the
// corner, a "GOOD VIBES ONLY" neon, the coach's plan on a whiteboard ("4. ???"), and a steel glass wall on downtown at
// night. The coach sits alone at the head of the table, his laptop open on the DM ("Seen"); Setty sits on a grey felt
// pouf by the table, the city behind him (dark blue: never orange behind Setty).
// The gag: the lights are on a motion sensor. power(v) (1 = on, 0 = off) turns the pendants off one by one, from the far
// end of the table to the coach, and dims the room fill; the laptop, the neon, the booth and the city stay on. Dim the
// engine's key at the same time (K(t, d, { light: { key } })): the key is reset from LIGHT every frame.
// Framings: the 3-line hook title ends at ~710 px, so the close-ups sit lower than in the other sets (coach y 850,
// Setty y 1000 at dist 11.5): the beanie and Setty's top stay under the title, even with the 0.8 push.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4;
const TABLE_H = 1.45;
const TABLE = { x: 1.85, z: -1.65, l: 5.6, d: 1.6 };
const COACH = { x: -1.75, y: -0.46, z: -1.3, turn: 0.85 };
const SETTY = { x: 1.45, y: 1.2, z: -0.1, turn: -0.55, scale: 0.62 };
const steel = () => K.mat(0x16171a, { roughness: 0.35, metalness: 0.7 });
const oak = () => K.mat(0xc49a6c, { roughness: 0.45, clearcoat: 0.3 });

// ---------------------------------------------------------------- textures and painters

/** polished concrete: soft trowel clouds, specks, a saw-cut joint on the tile edge (gradients only, no ctx.filter) */
function concreteTex({ base = "#5f5f64", seed = 19 } = {}) {
  const R = K.rng(seed);
  return K.canvasTex(1024, 1024, (c, W, H) => {
    c.fillStyle = base;
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 80; i++) {
      const x = R() * W, y = R() * H, r = 60 + R() * 220, light = R() < 0.5;
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, light ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g;
      c.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    for (let i = 0; i < 3000; i++) {
      c.fillStyle = R() < 0.5 ? `rgba(255,255,255,${0.04 + R() * 0.1})` : `rgba(0,0,0,${0.05 + R() * 0.12})`;
      c.fillRect(R() * W, R() * H, 1 + R() * 2, 1 + R() * 2);
    }
    c.strokeStyle = "rgba(25,25,28,0.6)";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(0, 1.5);
    c.lineTo(W, 1.5);
    c.moveTo(1.5, 0);
    c.lineTo(1.5, H);
    c.stroke();
  });
}

/** oak planks along the length of the table (each plank its own shade, grain lines, no ctx.filter); repeats */
function oakTex({ base = [199, 158, 112], planks = 4, seed = 8 } = {}) {
  const R = K.rng(seed);
  return K.canvasTex(1024, 512, (c, W, H) => {
    const ph = H / planks;
    for (let i = 0; i < planks; i++) {
      let x = -R() * W * 0.5;
      while (x < W) {
        const len = W * (0.5 + R() * 0.6), l = 0.88 + R() * 0.2;
        c.fillStyle = `rgb(${base.map((v) => Math.min(255, Math.round(v * l))).join(",")})`;
        c.fillRect(x, i * ph, len, ph);
        c.strokeStyle = "rgba(70, 40, 18, 0.14)";
        c.lineWidth = 1.5;
        for (let g = 0; g < 8; g++) {
          const y0 = i * ph + R() * ph;
          c.beginPath();
          c.moveTo(x, y0);
          c.bezierCurveTo(x + len * 0.3, y0 + (R() - 0.5) * 8, x + len * 0.7, y0 + (R() - 0.5) * 8, x + len, y0 + (R() - 0.5) * 5);
          c.stroke();
        }
        c.fillStyle = "rgba(50, 28, 12, 0.45)";
        c.fillRect(x, i * ph, 2, ph);
        x += len;
      }
      c.fillStyle = "rgba(50, 28, 12, 0.4)";
      c.fillRect(0, i * ph, W, 2);
    }
  }, { repeat: [2, 1] });
}

/** downtown at night, close: office towers in curtain walls (whole floors still lit, cool and warm), a tower with a lit
 *  crown and a spire, red aviation lights, the street glow at the bottom */
function downtown(c, W, H, R) {
  const sky = c.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#050914");
  sky.addColorStop(0.5, "#0e1a34");
  sky.addColorStop(0.85, "#263a62");
  sky.addColorStop(1, "#384c74");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  const tops = [];
  const tower = (x, w, top, body, lit, cols, floorH, warm) => {
    c.fillStyle = body;
    c.fillRect(x, top, w, H - top);
    const cw = w / cols;
    for (let y = top + floorH * 0.5; y < H - 4; y += floorH) {
      const on = R() < lit;
      for (let k = 0; k < cols; k++) {
        if (on ? R() < 0.88 : R() < 0.05) {
          c.globalAlpha = 0.5 + R() * 0.5;
          c.fillStyle = R() < warm ? "#ffd590" : "#cfe2ff";
          c.fillRect(x + k * cw + cw * 0.1, y, cw * 0.8, floorH * 0.56);
          c.globalAlpha = 1;
        }
      }
    }
    tops.push([x + w / 2, top]);
  };
  // the far skyline
  let x = -10;
  while (x < W) {
    const w = 40 + R() * 70;
    tower(x, w, H * (0.42 + R() * 0.25), "#17223d", 0.2, 4, 9, 0.5);
    x += w + 3;
  }
  // the crown tower: a slim spire, a lit crown, its aviation light
  const cx = W * 0.6, cwid = 118, ctop = H * 0.2;
  c.fillStyle = "#0d1530";
  c.beginPath();
  c.moveTo(cx - 6, ctop - H * 0.1);
  c.lineTo(cx + 6, ctop - H * 0.1);
  c.lineTo(cx + 18, ctop);
  c.lineTo(cx - 18, ctop);
  c.fill();
  tower(cx - cwid / 2, cwid, ctop, "#0d1530", 0.3, 6, 12, 0.3);
  const crown = c.createLinearGradient(0, ctop, 0, ctop + 50);
  crown.addColorStop(0, "rgba(232,240,255,0.95)");
  crown.addColorStop(1, "rgba(150,185,255,0)");
  c.fillStyle = crown;
  c.fillRect(cx - cwid / 2, ctop, cwid, 50);
  // the mid towers (not over the crown tower)
  x = -20;
  while (x < W) {
    const w = 90 + R() * 120;
    if (Math.abs(x + w / 2 - cx) > w / 2 + cwid / 2 + 6) tower(x, w, H * (0.32 + R() * 0.28), "#0a1124", 0.34, 6, 14, 0.35);
    x += w + 14;
  }
  // the near towers at both edges: big curtain walls
  tower(-40, W * 0.25, H * 0.07, "#070c1a", 0.42, 8, 22, 0.25);
  tower(W * 0.79, W * 0.26, H * 0.17, "#070c1a", 0.38, 8, 22, 0.3);
  c.fillStyle = "#ff3b30";
  const beacon = (bx, by, r) => { c.beginPath(); c.arc(bx, by, r, 0, Math.PI * 2); c.fill(); };
  beacon(cx, ctop - H * 0.1 - 3, 5);
  tops.filter(() => R() < 0.3).forEach(([bx, by]) => beacon(bx, by - 4, 3.5));
  const street = c.createLinearGradient(0, H * 0.78, 0, H);
  street.addColorStop(0, "rgba(255,170,90,0)");
  street.addColorStop(1, "rgba(255,170,90,0.32)");
  c.fillStyle = street;
  c.fillRect(0, H * 0.78, W, H * 0.22);
}

/** his DM on the laptop, in a dark Instagram-like inbox: "how much is it?", his price, "Seen" */
function dmScreen() {
  return K.canvasTex(1024, 640, (c, W, H) => {
    c.fillStyle = "#0b0b0e";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#141418";
    c.fillRect(0, 0, 290, H);
    for (let k = 0; k < 6; k++) { // the inbox list
      const y = 70 + k * 92;
      c.fillStyle = k === 0 ? "#2a2a33" : "#1d1d23";
      if (k === 0) c.fillRect(0, y - 44, 290, 88);
      c.fillStyle = ["#6d5dfc", "#3a3a44", "#4b4b56", "#3a3a44", "#4b4b56", "#3a3a44"][k];
      c.beginPath();
      c.arc(52, y, 28, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#3b3b45";
      c.fillRect(96, y - 16, 120 + ((k * 37) % 50), 12);
      c.fillStyle = "#2b2b33";
      c.fillRect(96, y + 6, 80 + ((k * 23) % 60), 10);
    }
    c.fillStyle = "#16161b";
    c.fillRect(290, 0, W - 290, 92);
    c.fillStyle = "#6d5dfc";
    c.beginPath();
    c.arc(340, 46, 26, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#e9e9ef";
    c.font = "600 30px Inter, sans-serif";
    c.textBaseline = "middle";
    c.fillText("new lead", 382, 46);
    const bubble = (x, y, w, h, fill) => {
      c.fillStyle = fill;
      c.beginPath();
      c.roundRect(x, y, w, h, 30);
      c.fill();
    };
    c.font = "500 34px Inter, sans-serif";
    bubble(320, 150, 300, 66, "#26262d");
    c.fillStyle = "#f2f2f5";
    c.fillText("how much is it?", 346, 184);
    const mine = c.createLinearGradient(560, 0, W - 30, 0);
    mine.addColorStop(0, "#8a3cff");
    mine.addColorStop(1, "#3d6bff");
    bubble(560, 250, W - 590, 66, mine);
    c.fillStyle = "#ffffff";
    c.fillText("it's $1,500 for 12 weeks!", 588, 284);
    c.fillStyle = "#8b8b96";
    c.font = "500 26px Inter, sans-serif";
    c.textAlign = "right";
    c.fillText("Seen", W - 36, 348);
    c.textAlign = "left";
    bubble(320, H - 92, W - 350, 62, "#16161b");
    c.fillStyle = "#5c5c66";
    c.font = "500 28px Inter, sans-serif";
    c.fillText("Message…", 352, H - 61);
  });
}

/** the coach's plan on the whiteboard: 1 post a reel, 2 get the DM, 3 send the price, 4 ??? (circled), 5 $$$ */
function planBoard(c, W, H) {
  c.fillStyle = "#f6f6f2";
  c.fillRect(0, 0, W, H);
  for (let i = 0; i < 5; i++) { // ghosts of old, badly erased writing
    const g = c.createRadialGradient(150 + i * 190, 120 + (i % 2) * 380, 0, 150 + i * 190, 120 + (i % 2) * 380, 170);
    g.addColorStop(0, "rgba(120,135,160,0.1)");
    g.addColorStop(1, "rgba(120,135,160,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
  }
  c.textBaseline = "middle";
  const ink = (txt, x, y, col, size, rot) => {
    c.save();
    c.translate(x, y);
    c.rotate(rot);
    c.fillStyle = col;
    c.font = `italic 700 ${size}px Inter, sans-serif`;
    c.fillText(txt, 0, 0);
    c.restore();
  };
  ink("THE PLAN", 64, 78, "#1d2a4a", 76, -0.025);
  c.strokeStyle = "#1d2a4a";
  c.lineWidth = 6;
  c.beginPath();
  c.moveTo(62, 124);
  c.quadraticCurveTo(220, 116, 400, 128);
  c.stroke();
  ink("1. post a reel", 74, 196, "#1d2a4a", 54, -0.01);
  ink("2. get the DM", 74, 282, "#1d2a4a", 54, 0.005);
  ink("3. send the price", 74, 368, "#1d2a4a", 54, -0.015);
  ink("4. ???", 74, 462, "#e0452a", 62, 0.012);
  ink("5. $$$", 74, 560, "#1f7a4d", 62, -0.02);
  c.strokeStyle = "#e0452a";
  c.lineWidth = 7;
  c.beginPath();
  c.ellipse(178, 462, 150, 54, -0.04, 0, Math.PI * 2);
  c.stroke();
  // a sketch on the right: a funnel with a leak
  c.strokeStyle = "#1d2a4a";
  c.lineWidth = 6;
  c.beginPath();
  c.moveTo(640, 190);
  c.lineTo(960, 190);
  c.lineTo(840, 420);
  c.lineTo(840, 540);
  c.lineTo(760, 540);
  c.lineTo(760, 420);
  c.closePath();
  c.stroke();
  c.fillStyle = "#e0452a";
  for (let k = 0; k < 4; k++) {
    c.beginPath();
    c.arc(700 + k * 34, 330 + k * 46, 9, 0, Math.PI * 2);
    c.fill();
  }
}

// ---------------------------------------------------------------- furniture (this set only)

/** the long communal table: a thick oak top, black steel trapezoid legs, a cable tray down the middle */
function communalTable({ l = TABLE.l, d = TABLE.d, h = TABLE_H } = {}) {
  const g = new THREE.Group();
  const tex = oakTex();
  const top = K.box(l, 0.12, d, 0.03, K.mat(0xffffff, { map: tex, roughness: 0.42, clearcoat: 0.45 }));
  top.position.y = h - 0.06;
  g.add(top);
  for (const sx of [-1, 1]) {
    const leg = new THREE.Group();
    const foot = K.box(0.1, 0.08, d - 0.24, 0.02, steel());
    foot.position.y = 0.04;
    const rail = K.box(0.1, 0.08, d - 0.36, 0.02, steel());
    rail.position.y = h - 0.16;
    leg.add(foot, rail);
    for (const sz of [-1, 1]) {
      const post = K.box(0.09, h - 0.16, 0.09, 0.02, steel());
      post.position.set(0, (h - 0.16) / 2 + 0.02, sz * (d / 2 - 0.3));
      post.rotation.x = sz * 0.1;
      leg.add(post);
    }
    leg.position.x = sx * (l / 2 - 0.45);
    g.add(leg);
  }
  const tray = K.box(l * 0.78, 0.035, 0.2, 0.01, K.mat(0x1f2024, { roughness: 0.5 }), false);
  tray.position.set(0.2, h + 0.017, 0);
  g.add(tray);
  for (const k of [-2, -1, 0, 1, 2]) { // pop-up outlets in the tray
    const o = K.box(0.12, 0.03, 0.12, 0.01, K.mat(0xd9dce1, { roughness: 0.35, metalness: 0.4 }), false);
    o.position.set(0.2 + k * 1.0, h + 0.045, 0);
    g.add(o);
  }
  g.userData.top = h;
  return g;
}

/** a molded shell chair on four splayed oak legs (seat top at `seat`); faces +z */
function shellChair({ seat = 0.62, color = 0xe7e3dc, seed = 41 } = {}) {
  const g = new THREE.Group();
  const shell = K.mat(color, { roughness: 0.38, clearcoat: 0.6 });
  const s = K.soft(0.95, 0.14, 0.9, shell, { P: 3, puff: 0.06, seed });
  s.position.y = seat - 0.07;
  const back = K.soft(0.95, 0.85, 0.12, shell, { P: 3.2, puff: 0.08, seed: seed + 1 });
  back.position.set(0, seat + 0.52, -0.45);
  back.rotation.x = -0.18;
  g.add(s, back);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const len = seat - 0.12;
    const leg = K.cyl(0.024, 0.034, len, oak(), 10);
    leg.position.set(sx * 0.32, len / 2, sz * 0.3);
    leg.rotation.set(-sz * 0.12, 0, sx * 0.12);
    g.add(leg);
  }
  return g;
}

/** Setty's seat: a big felt cube pouf, a leather pull tab */
function pouf({ s = 1.25, h = 1.42, color = 0x5b626d } = {}) {
  const g = new THREE.Group();
  const felt = K.mat(color, { roughness: 0.95, sheen: 0.7, sheenColor: new THREE.Color(0xb9c2cf), sheenRoughness: 0.6 });
  const b = K.soft(s, h, s, felt, { P: 3.4, puff: 0.1, wrinkle: 0.01, seed: 51 });
  b.position.y = h / 2;
  const tab = K.box(0.22, 0.05, 0.03, 0.012, K.mat(0x6b4329, { roughness: 0.5, clearcoat: 0.3 }));
  tab.position.set(0, h * 0.62, s / 2 + 0.01);
  g.add(b, tab);
  g.userData.top = h * 1.05;
  return g;
}

/** a glass phone booth: black frame, teal felt back, a small desk and a stool inside, a warm light strip under the roof;
 *  glass front and sides; faces +z */
function phoneBooth({ w = 1.8, d = 1.7, h = 4.5 } = {}) {
  const g = new THREE.Group();
  const frame = K.mat(0x121316, { roughness: 0.35, metalness: 0.5 });
  const roof = K.box(w + 0.12, 0.2, d + 0.12, 0.03, frame);
  roof.position.y = h - 0.1;
  const plinth = K.box(w + 0.12, 0.12, d + 0.12, 0.03, frame);
  plinth.position.y = 0.06;
  g.add(roof, plinth);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const post = K.box(0.09, h, 0.09, 0.02, frame);
    post.position.set((sx * w) / 2, h / 2, (sz * d) / 2);
    g.add(post);
  }
  const felt = K.mat(0x2e5652, { roughness: 0.95 });
  const back = K.box(w - 0.04, h - 0.32, 0.08, 0.01, felt, false);
  back.position.set(0, h / 2, -d / 2 + 0.05);
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xd8e4ff, roughness: 0.05, transparent: true, opacity: 0.14,
    depthWrite: false, side: THREE.DoubleSide });
  const pane = (pw) => new THREE.Mesh(new THREE.PlaneGeometry(pw, h - 0.32), glass);
  const front = pane(w - 0.09);
  front.position.set(0, h / 2, d / 2);
  const left = pane(d - 0.09);
  left.position.set(-w / 2, h / 2, 0);
  left.rotation.y = Math.PI / 2;
  const right = pane(d - 0.09);
  right.position.set(w / 2, h / 2, 0);
  right.rotation.y = Math.PI / 2;
  const handle = K.box(0.04, 0.9, 0.05, 0.015, K.mat(0xc9ccd2, { roughness: 0.25, metalness: 0.9 }));
  handle.position.set(w * 0.34, 2.0, d / 2 + 0.05);
  const deskTop = K.box(w - 0.24, 0.06, 0.45, 0.02, oak());
  deskTop.position.set(0, 1.6, -d / 2 + 0.32);
  const stool = new THREE.Group();
  const cushion = K.cyl(0.26, 0.26, 0.12, K.mat(0xd96a3a, { roughness: 0.8 }), 28);
  cushion.position.y = 0.96;
  const stem = K.cyl(0.04, 0.04, 0.9, steel(), 12);
  stem.position.y = 0.45;
  const base = K.cyl(0.24, 0.26, 0.04, steel(), 28);
  base.position.y = 0.02;
  stool.add(cushion, stem, base);
  stool.position.set(0.1, 0, 0.1);
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.3, 0.08), K.glow(0xffe0ac));
  strip.position.set(0, h - 0.23, -0.1);
  strip.rotation.x = Math.PI / 2;
  g.add(back, front, left, right, handle, deskTop, stool, strip);
  return g;
}

/** a whiteboard on wheels (draw paints the board) */
function whiteboard({ w = 2.2, h = 1.5, draw } = {}) {
  const g = new THREE.Group();
  const alu = K.mat(0xbfc4cc, { roughness: 0.3, metalness: 0.8 });
  const y0 = 1.35;
  const frame = K.box(w + 0.08, h + 0.08, 0.05, 0.02, alu);
  frame.position.y = y0 + h / 2;
  const board = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
    K.mat(0xffffff, { map: K.canvasTex(1024, Math.round((1024 * h) / w), draw), roughness: 0.3, clearcoat: 0.6 }));
  board.position.set(0, y0 + h / 2, 0.028);
  const tray = K.box(w * 0.5, 0.05, 0.12, 0.01, alu);
  tray.position.set(0, y0 - 0.02, 0.06);
  g.add(frame, board, tray);
  for (const sx of [-1, 1]) {
    const post = K.box(0.05, y0 + h, 0.05, 0.015, alu);
    post.position.set(sx * (w / 2 + 0.06), (y0 + h) / 2 + 0.1, 0);
    const foot = K.box(0.06, 0.05, 0.8, 0.015, alu);
    foot.position.set(sx * (w / 2 + 0.06), 0.12, 0);
    g.add(post, foot);
    for (const sz of [-1, 1]) {
      const wheel = K.ball(0.06, K.mat(0x1a1a1d, { roughness: 0.5 }), 14);
      wheel.position.set(sx * (w / 2 + 0.06), 0.06, sz * 0.36);
      g.add(wheel);
    }
  }
  // two markers in the tray
  for (const [k, col] of [[0, 0x1d2a4a], [1, 0xe0452a]]) {
    const m = K.cyl(0.025, 0.025, 0.28, K.mat(col, { roughness: 0.4 }), 10);
    m.rotation.z = Math.PI / 2;
    m.position.set(-0.2 + k * 0.34, y0 + 0.03, 0.06);
    g.add(m);
  }
  return g;
}

/** the coach's laptop, space grey, open on the DM */
function laptop({ screen, open = 1.86 } = {}) {
  const g = new THREE.Group();
  const alu = K.mat(0x4a4d55, { roughness: 0.3, metalness: 0.75 });
  const base = K.box(1.2, 0.045, 0.82, 0.03, alu);
  base.position.y = 0.0225;
  const deck = K.box(1.04, 0.006, 0.4, 0.01, K.mat(0x1a1b1f, { roughness: 0.6 }), false);
  deck.position.set(0, 0.047, -0.12);
  const pad = K.box(0.44, 0.004, 0.26, 0.01, K.mat(0x5d616a, { roughness: 0.3, metalness: 0.6 }), false);
  pad.position.set(0, 0.047, 0.22);
  const lid = new THREE.Group();
  lid.position.set(0, 0.045, -0.4);
  const shell = K.box(1.2, 0.8, 0.03, 0.03, alu);
  shell.position.set(0, 0.4, -0.016);
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(1.16, 0.76), K.mat(0x0c0c0e, { roughness: 0.2, clearcoat: 1 }));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.6875), K.glow(0xffffff, { map: screen }));
  scr.position.set(0, 0.41, 0.002);
  scr.material.color.setScalar(0.95);
  bezel.position.set(0, 0.4, 0);
  lid.add(shell, bezel, scr);
  lid.rotation.x = -(open - Math.PI / 2);
  g.add(base, deck, pad, lid);
  g.userData.screen = scr;
  return g;
}

/** a closed laptop left on the table */
function closedLaptop({ color = 0xc4c8cf } = {}) {
  const l = K.box(1.1, 0.06, 0.76, 0.03, K.mat(color, { roughness: 0.28, metalness: 0.75 }));
  l.position.y = 0.03;
  return K.group(l);
}

/** a neon in two lines (glowing script on a clear acrylic plate); its PointLight is added below */
function neonLines(lines, { color = "#ff5a1f", w = 2.4, h = 1.3, font = "italic 800 190px 'Nohemi', Inter, sans-serif" } = {}) {
  const tex = K.canvasTex(1024, Math.round((1024 * h) / w), (c, W, H) => {
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = font;
    c.lineJoin = "round";
    const ys = lines.map((_, k) => H * (0.3 + (0.42 * k) / Math.max(1, lines.length - 1)));
    for (const [blur, alpha] of [[60, 0.5], [30, 0.7], [12, 0.9]]) {
      c.shadowColor = color;
      c.shadowBlur = blur;
      c.globalAlpha = alpha;
      c.strokeStyle = color;
      c.lineWidth = 14;
      lines.forEach((l, k) => c.strokeText(l, W / 2, ys[k]));
    }
    c.globalAlpha = 1;
    c.shadowBlur = 8;
    c.strokeStyle = "#ffe3d6";
    c.lineWidth = 5;
    lines.forEach((l, k) => c.strokeText(l, W / 2, ys[k]));
  });
  const g = new THREE.Group();
  const plate = K.box(w * 0.94, h * 0.9, 0.03, 0.04, K.mat(0xffffff, { transmission: 0.9, roughness: 0.1, transparent: true, opacity: 0.18 }), false);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(w, h), K.glow(0xffffff, { map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  sign.position.z = 0.03;
  g.add(plate, sign);
  return g;
}

// ---------------------------------------------------------------- build

export async function build({ renderer, scene, mood = "night" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.26;
  scene.background = new THREE.Color(0x0c0f17);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  const rm = K.room({ w: 20, h: 11, d: 18, backZ: BACK, wall: "#252930", floorMap: concreteTex(), floorTile: 4.5,
    floorRough: 0.42, baseboard: false });
  rm.children[0].material.clearcoat = 0.35;
  set.add(rm);

  // ---- the glass wall (right): downtown at night, a cool glow on the wall around it
  const glassWall = K.cityWindow({ w: 7.6, h: 6.0, view: downtown, blinds: 0, panes: [4, 3], frame: 0x111216, bright: 0.95, seed: 61 });
  K.at(glassWall, 4.0, 3.35, BACK + 0.02);
  const cityGlow = K.wallGlow({ w: 10, h: 7, color: "#5f7fd0", strength: 0.22 });
  K.at(cityGlow, 4.0, 3.4, BACK + 0.06);
  set.add(glassWall, cityGlow);

  // ---- the wall left of it: the neon, the whiteboard with his plan, a tall plant, the phone booth in the corner
  const neon = neonLines(["GOOD VIBES", "ONLY"], { color: "#ff5a1f", w: 2.3, h: 1.25 });
  K.at(neon, -1.35, 5.35, BACK + 0.16);
  const neonWash = K.wallGlow({ w: 4.4, h: 3.0, color: "#ff5a1f", strength: 0.42 });
  K.at(neonWash, -1.35, 5.35, BACK + 0.12);
  const board = whiteboard({ w: 2.2, h: 1.5, draw: planBoard });
  K.at(board, -0.35, 0, -3.0, 0.04);
  const plantL = K.plant({ h: 3.0, n: 11, seed: 71, pot: 0x2b2d33 });
  K.at(plantL, -2.75, 0, -3.0);
  const booth = phoneBooth();
  K.at(booth, -3.75, 0, -2.25, 0.32);
  set.add(neon, neonWash, board, plantL, booth);

  // ---- the long table: his laptop, a mug, a can; the others left: closed laptops, an off monitor, chairs pushed in
  const table = communalTable();
  K.at(table, TABLE.x, 0, TABLE.z);
  const chair = shellChair({ color: 0x1e1f23, seed: 45 }); // his: dark, so his white tank top reads
  K.at(chair, COACH.x, 0, COACH.z, COACH.turn);
  const lap = laptop({ screen: dmScreen() });
  K.at(lap, -0.45, TABLE_H, -1.42, -0.95);
  lap.scale.setScalar(0.9);
  const mug = K.mug(0x23252a, 0xff611d);
  K.at(mug, 0.35, TABLE_H, -1.05, 0.4);
  const can = K.can(0xeceff3, 0x3d8bff);
  K.at(can, 0.15, TABLE_H, -2.1);
  set.add(table, chair, lap, mug, can);
  const others = [[0.75, 0xe7e3dc], [2.15, 0xb9c0c9], [3.55, 0xe7e3dc]];
  others.forEach(([x, col], k) => {
    const c = shellChair({ color: col, seed: 47 + k * 2 });
    K.at(c, x, 0, TABLE.z - 0.95, 0);
    set.add(c);
  });
  const near = shellChair({ color: 0xb9c0c9, seed: 55 });
  K.at(near, 3.45, 0, TABLE.z + 0.95, Math.PI + 0.12);
  set.add(near);
  const cl1 = closedLaptop();
  K.at(cl1, 0.75, TABLE_H, TABLE.z - 0.35, 0.1);
  const cl2 = closedLaptop({ color: 0x3e4148 });
  K.at(cl2, 3.5, TABLE_H, TABLE.z + 0.3, -0.2);
  const offTex = K.canvasTex(64, 36, (c, W, H) => { c.fillStyle = "#08090c"; c.fillRect(0, 0, W, H); });
  const mon = K.monitor({ w: 1.5, h: 0.86, screen: offTex });
  K.at(mon, 4.05, TABLE_H, TABLE.z - 0.35, -0.1);
  const mug2 = K.mug(0xf2eee8, 0x3d8bff);
  K.at(mug2, 2.2, TABLE_H, TABLE.z - 0.25, 1.2);
  set.add(cl1, cl2, mon, mug2);

  // ---- Setty's pouf, and a plant at the far end by the glass
  const pf = pouf();
  K.at(pf, SETTY.x, 0, SETTY.z, 0.2);
  const plantR = K.plant({ h: 2.7, n: 9, seed: 77, pot: 0xe9e3da });
  K.at(plantR, 5.7, 0, -2.6);
  set.add(pf, plantR);

  // ---- the pendants over the table (on the motion sensor)
  const PEND_X = [-0.25, 1.15, 2.55, 3.95];
  const pendants = PEND_X.map((x) => {
    const p = K.pendant({ cord: 5 });
    K.at(p, x, 6.2, TABLE.z);
    set.add(p);
    return p;
  });
  const bulbs = pendants.map((p) => p.children[2]);
  const bulbColor = bulbs.map((b) => b.material.color.clone());

  // ---- lights: night. The pendants are the warm practicals (and justify the engine's soft key on the faces), the
  // city is the cool rim from behind (it casts the shadows), the laptop lights his face blue, the neon and the booth
  // add warm accents on the left.
  const hemi = new THREE.HemisphereLight(0xa9bce6, 0x1b1916, 0.5);
  set.add(hemi);
  const key = new THREE.DirectionalLight(0xffe7cf, 1.3);
  key.position.set(-3, 9, 9);
  key.target.position.set(0, 2, -1.3);
  const rim = new THREE.DirectionalLight(0x86a6ff, 1.9);
  rim.position.set(6, 6.5, -9);
  rim.target.position.set(0, 1, 0);
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
  const pend = PEND_X.map((x) => pl(0xffd7a0, 5.6, x, 5.6, TABLE.z, 6.5));
  const lights = {
    pend,
    screen: pl(0x9fbcff, 1.8, -0.85, 2.25, -1.2, 2.6),
    neon: pl(0xff5a1f, 3.6, -1.35, 5.2, BACK + 0.9, 6),
    booth: pl(0xffd9a8, 2.6, -3.75, 3.9, -2.25, 3.2),
    window: pl(0x7d9cff, 3.0, 3.0, 3.5, BACK + 1.2, 7),
  };
  const PEND_I = pend.map((l) => l.intensity), HEMI_I = hemi.intensity, ENV_I = scene.environmentIntensity;
  /** the motion sensor: v 1 = all on, 0 = all off; the pendants go off one by one from the far end to the coach
   *  (v 0.75: one off, 0.5: two, 0.25: three) */
  const power = (v) => {
    const n = pend.length;
    let sum = 0;
    for (let k = 0; k < n; k++) {
      const order = n - 1 - k; // the far end first
      const lv = Math.min(1, Math.max(0, v * n - (n - 1 - order)));
      pend[k].intensity = PEND_I[k] * lv;
      bulbs[k].material.color.copy(bulbColor[k]).multiplyScalar(0.06 + 0.94 * lv);
      sum += lv;
    }
    hemi.intensity = HEMI_I * (0.12 + (0.88 * sum) / n);
    scene.environmentIntensity = ENV_I * (0.15 + (0.85 * sum) / n);
  };

  // the laptop screen, in the world: the insert shot looks at it
  set.updateMatrixWorld(true);
  const screenAt = lap.userData.screen.getWorldPosition(new THREE.Vector3());

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(-1.6, 4.0, -1.15);
  const settyFace = new THREE.Vector3(SETTY.x, SETTY.y + 1.7 * SETTY.scale + 0.04, SETTY.z);
  const lampsAt = new THREE.Vector3(1.85, 5.6, TABLE.z); // the row of pendants, seen from below (the gag)
  return {
    key, rim, lights, power, root: set,
    coach: { x: COACH.x, y: COACH.y, z: COACH.z, turn: COACH.turn, sit: 1 },
    setty: { x: SETTY.x, y: SETTY.y, z: SETTY.z, turn: SETTY.turn, scale: SETTY.scale },
    heads: { coach: coachHead, setty: settyFace, laptop: screenAt },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 850 },
      setty: { target: settyFace, dist: 11.5, yaw: -0.32, pitch: 0.06, y: 1000 },
      laptop: { target: screenAt, dist: 3.3, yaw: -0.55, pitch: 0.22, y: 1000 },
      lamps: { target: lampsAt, dist: 7, yaw: 0.1, pitch: -0.38, fov: 60, y: 980 },
    },
    shots: {
      wide: { pos: [-0.15, 4.4, 12.6], at: [-0.15, 3.05, -1.4], fov: 44 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 850 }),
      setty: K.shot(settyFace, { dist: 11.5, yaw: -0.32, pitch: 0.06, y: 1000 }),
      laptop: K.shot(screenAt, { dist: 3.3, yaw: -0.55, pitch: 0.22, y: 1000 }),
      lamps: K.shot(lampsAt, { dist: 7, yaw: 0.1, pitch: -0.38, fov: 60, y: 980 }),
    },
  };
}
