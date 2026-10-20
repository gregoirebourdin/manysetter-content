// Set "cafe": a neighborhood coffee shop in the morning (reel5, Calendly and the no-shows). Cream plaster over a
// bottle-green beadboard wainscot, a cream and green checker floor, a big storefront window on a city street in the
// morning (brick and pastel shopfronts, an orange striped awning, a fire escape, a tree, a parked cab), a "but first,
// coffee" neon, a shelf of cups and jars, a chalk menu. He sits on a bentwood chair next to a round marble bistro table:
// laptop open on a call nobody joins (the joke of the set), a latte, a croissant; Setty sits on the table next to the cup.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import * as K from "./kit.js";
import { BRANDS } from "../engine/brands.js";

const BACK = -3.4;
const iron = () => K.mat(0x17181b, { roughness: 0.35, metalness: 0.7 });
const brass = () => K.mat(0xd9a94a, { roughness: 0.25, metalness: 1 });
const china = () => K.mat(0xf6f3ee, { roughness: 0.22, clearcoat: 0.8, side: THREE.DoubleSide });

// ---------------------------------------------------------------- textures

/** cream and bottle-green checker tiles, a little stone grain (2 × 2 squares per repeat) */
function checkerTex({ a = "#ebe2d1", b = "#2c4a3f", seed = 11 } = {}) {
  const R = K.rng(seed);
  return K.canvasTex(512, 512, (c, W, H) => {
    const s = W / 2;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      c.fillStyle = (i + j) % 2 ? b : a;
      c.fillRect(i * s, j * s, s, s);
    }
    for (let k = 0; k < 2400; k++) {
      c.fillStyle = `rgba(${R() < 0.5 ? "255,255,255" : "0,0,0"}, ${0.02 + R() * 0.04})`;
      c.fillRect(R() * W, R() * H, 1 + R() * 3, 1 + R() * 3);
    }
    c.strokeStyle = "rgba(22, 18, 14, 0.4)"; // grout
    c.lineWidth = 3;
    for (const v of [0, s, W]) {
      c.beginPath(); c.moveTo(v, 0); c.lineTo(v, H); c.stroke();
      c.beginPath(); c.moveTo(0, v); c.lineTo(W, v); c.stroke();
    }
  });
}

/** white marble with soft grey veins */
function marbleTex(seed = 5) {
  const R = K.rng(seed);
  return K.canvasTex(1024, 1024, (c, W, H) => {
    c.fillStyle = "#f4f1ec";
    c.fillRect(0, 0, W, H);
    c.lineCap = "round";
    for (let i = 0; i < 9; i++) { // each vein: a wide faint stroke under a thin one (no ctx.filter: black at render)
      const a = 0.1 + R() * 0.14, lw = 1 + R() * 2.5;
      let x = R() * W, y = 0;
      const path = new Path2D();
      path.moveTo(x, y);
      while (y < H) {
        const nx = x + (R() - 0.35) * 160, ny = y + 60 + R() * 120;
        path.quadraticCurveTo(x + (R() - 0.5) * 120, (y + ny) / 2, nx, ny);
        x = nx;
        y = ny;
      }
      c.strokeStyle = `rgba(120, 118, 122, ${a * 0.35})`;
      c.lineWidth = lw * 4;
      c.stroke(path);
      c.strokeStyle = `rgba(120, 118, 122, ${a})`;
      c.lineWidth = lw;
      c.stroke(path);
    }
  });
}

// ---------------------------------------------------------------- the street through the window

/** a city street in the morning, seen from inside the café: the low sun top left, a row of shopfronts across the street
 *  (brick with a fire escape, cream, sage, terracotta), an orange striped awning, a parked cab, a tree and a street lamp
 *  on our sidewalk, a few soft reflections on the glass */
function street(c, W, H, R) {
  const sky = c.createLinearGradient(0, 0, 0, H * 0.55);
  sky.addColorStop(0, "#95c6ec");
  sky.addColorStop(1, "#fcefd9");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  const sx = W * 0.08, sy = H * 0.06;
  const halo = c.createRadialGradient(sx, sy, 0, sx, sy, W * 0.55);
  halo.addColorStop(0, "rgba(255, 242, 210, 1)");
  halo.addColorStop(1, "rgba(255, 242, 210, 0)");
  c.fillStyle = halo;
  c.fillRect(0, 0, W, H);
  for (let i = 0; i < 4; i++) { // soft clouds
    c.fillStyle = `rgba(255, 255, 255, ${0.4 + R() * 0.3})`;
    const cx = W * (0.25 + R() * 0.7), cy = H * (0.05 + R() * 0.12);
    for (let k = 0; k < 4; k++) {
      c.beginPath();
      c.ellipse(cx + (k - 1.5) * 30, cy + (k % 2) * 7, 38 + R() * 26, 13 + R() * 8, 0, 0, Math.PI * 2);
      c.fill();
    }
  }

  const GROUND = H * 0.7; // the far sidewalk line
  const facade = ({ x, w, h, col, trim = "#f4efe6", awning, escape, rows = 4, cols = 3 }) => {
    const top = GROUND - h;
    c.fillStyle = col;
    c.fillRect(x, top, w, h);
    const lit = c.createLinearGradient(x, 0, x + w, 0); // the morning sun from the left
    lit.addColorStop(0, "rgba(255, 236, 200, 0.28)");
    lit.addColorStop(1, "rgba(40, 30, 40, 0.12)");
    c.fillStyle = lit;
    c.fillRect(x, top, w, h);
    c.fillStyle = "rgba(0, 0, 0, 0.18)"; // cornice
    c.fillRect(x - 4, top, w + 8, 16);
    c.fillStyle = trim;
    c.fillRect(x - 4, top + 14, w + 8, 5);
    const shop = H * 0.13, ww = (w - 30) / cols - 14;
    const wh = Math.min(70, (h - shop - 40) / rows - 18);
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) { // upper windows: white trim, sky in the glass
      const wx = x + 22 + k * (ww + 14), wy = top + 34 + r * (wh + 18);
      if (wy + wh > GROUND - shop - 10) continue;
      c.fillStyle = trim;
      c.fillRect(wx - 4, wy - 4, ww + 8, wh + 10);
      const gl = c.createLinearGradient(wx, wy, wx + ww, wy + wh);
      gl.addColorStop(0, "#cfe3f1");
      gl.addColorStop(1, "#5d7488");
      c.fillStyle = gl;
      c.fillRect(wx, wy, ww, wh);
      c.fillStyle = "rgba(255, 255, 255, 0.5)";
      c.beginPath();
      c.moveTo(wx + ww * 0.15, wy + wh);
      c.lineTo(wx + ww * 0.45, wy);
      c.lineTo(wx + ww * 0.6, wy);
      c.lineTo(wx + ww * 0.3, wy + wh);
      c.fill();
      c.fillStyle = trim;
      c.fillRect(wx + ww / 2 - 2, wy, 4, wh);
    }
    if (escape) { // the black fire escape: landings and ladders
      c.strokeStyle = "#1d1e22";
      c.fillStyle = "#1d1e22";
      c.lineWidth = 3;
      for (let r = 1; r < rows; r++) {
        const ly = top + 34 + r * (wh + 18) - 8, lx = x + 12, lw = ww * 2 + 30;
        if (ly > GROUND - shop - 20) continue;
        c.fillRect(lx, ly, lw, 5);
        for (let b = 0; b <= 8; b++) c.fillRect(lx + (b * lw) / 8, ly - 26, 2, 26);
        c.fillRect(lx, ly - 28, lw, 3);
        c.beginPath();
        c.moveTo(lx + lw * 0.2, ly);
        c.lineTo(lx + lw * 0.75, ly + wh + 18);
        c.stroke();
      }
    }
    const sy0 = GROUND - shop; // the shopfront: warm lit glass, a door
    c.fillStyle = "rgba(0, 0, 0, 0.25)";
    c.fillRect(x, sy0 - 6, w, 6);
    const inside = c.createLinearGradient(0, sy0, 0, GROUND);
    inside.addColorStop(0, "#5b4334");
    inside.addColorStop(1, "#f0c48a");
    c.fillStyle = inside;
    c.fillRect(x + 10, sy0 + 26, w - 20, shop - 30);
    c.fillStyle = "#2a2522";
    c.fillRect(x + w * 0.62, sy0 + 34, w * 0.18, shop - 34);
    c.fillStyle = trim;
    c.fillRect(x + 10, sy0 + 20, w - 20, 8);
    if (awning) { // a striped awning with a scalloped edge
      const ay = sy0 + 4, ah = 44, n = Math.round(w / 26);
      for (let k = 0; k < n; k++) {
        c.fillStyle = k % 2 ? awning[1] : awning[0];
        c.beginPath();
        c.moveTo(x + 4 + (k * (w - 8)) / n, ay);
        c.lineTo(x + 4 + ((k + 1) * (w - 8)) / n, ay);
        c.lineTo(x - 6 + ((k + 1) * (w + 12)) / n, ay + ah);
        c.arc(x - 6 + ((k + 0.5) * (w + 12)) / n, ay + ah, (w + 12) / n / 2, 0, Math.PI);
        c.closePath();
        c.fill();
      }
      c.fillStyle = "rgba(0, 0, 0, 0.18)";
      c.fillRect(x, ay + ah + 10, w, 10);
    }
  };
  facade({ x: -30, w: 270, h: H * 0.6, col: "#b4553d", escape: true, awning: ["#ff611d", "#fff4ea"], rows: 5, cols: 3 });
  facade({ x: 240, w: 200, h: H * 0.48, col: "#efe1c4", trim: "#ffffff", rows: 4, cols: 2 });
  facade({ x: 440, w: 230, h: H * 0.63, col: "#93ad98", trim: "#f6f2ea", awning: ["#2c4a3f", "#efe6d6"], rows: 5, cols: 3 });
  facade({ x: 670, w: 170, h: H * 0.46, col: "#d98b60", rows: 3, cols: 2 });
  facade({ x: 840, w: 210, h: H * 0.58, col: "#8b3e2d", escape: true, rows: 5, cols: 3 });

  // the street: far sidewalk, curb, road with a dashed line, our sidewalk
  c.fillStyle = "#d3ccc1";
  c.fillRect(0, GROUND, W, H * 0.045);
  c.fillStyle = "#9e978c";
  c.fillRect(0, GROUND + H * 0.045, W, 5);
  c.fillStyle = "#4c4f58";
  c.fillRect(0, GROUND + H * 0.05, W, H * 0.15);
  c.fillStyle = "#f2c94c";
  for (let x = 10; x < W; x += 90) c.fillRect(x, GROUND + H * 0.125, 50, 6);
  c.fillStyle = "#ddd6ca";
  c.fillRect(0, GROUND + H * 0.2, W, H);
  c.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let x = 0; x < W; x += 110) c.fillRect(x, GROUND + H * 0.2, 3, H);

  // a parked cab on the road, its long morning shadow
  const cx = W * 0.5, cy = GROUND + H * 0.17;
  c.fillStyle = "rgba(20, 20, 30, 0.35)";
  c.beginPath();
  c.ellipse(cx + 150, cy + 8, 190, 14, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#f4c23d";
  c.beginPath();
  c.roundRect(cx - 120, cy - 52, 240, 50, 16);
  c.fill();
  c.beginPath();
  c.roundRect(cx - 70, cy - 88, 140, 44, [22, 22, 4, 4]);
  c.fill();
  c.fillStyle = "#3a4552";
  c.beginPath();
  c.roundRect(cx - 58, cy - 80, 54, 32, [14, 4, 2, 2]);
  c.roundRect(cx + 4, cy - 80, 54, 32, [4, 14, 2, 2]);
  c.fill();
  c.fillStyle = "#ffffff";
  c.fillRect(cx - 18, cy - 100, 36, 12);
  c.fillStyle = "#1c1d21";
  for (const wx of [cx - 72, cx + 72]) {
    c.beginPath();
    c.arc(wx, cy, 22, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = "#b9bcc2";
  for (const wx of [cx - 72, cx + 72]) {
    c.beginPath();
    c.arc(wx, cy, 9, 0, Math.PI * 2);
    c.fill();
  }

  // our sidewalk: a tree in its pit and a black street lamp
  const tx = W * 0.15;
  c.fillStyle = "#5c4636";
  c.fillRect(tx - 9, H * 0.38, 18, H);
  const leaves = ["#3f7a45", "#5a9a52", "#77b062", "#356b3d"];
  for (let i = 0; i < 46; i++) {
    const a = R() * Math.PI * 2, d = R() * 120;
    c.fillStyle = leaves[Math.floor(R() * leaves.length)];
    c.beginPath();
    c.arc(tx + Math.cos(a) * d * 1.15, H * 0.3 + Math.sin(a) * d * 0.8, 26 + R() * 30, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = "rgba(255, 246, 214, 0.35)"; // sunlit side of the crown
  for (let i = 0; i < 14; i++) {
    c.beginPath();
    c.arc(tx - 60 + R() * 70, H * 0.22 + R() * 90, 14 + R() * 18, 0, Math.PI * 2);
    c.fill();
  }
  const lx = W * 0.88;
  c.fillStyle = "#1d1e22";
  c.fillRect(lx - 6, H * 0.2, 12, H);
  c.beginPath();
  c.roundRect(lx - 22, H * 0.15, 44, 58, 8);
  c.fill();
  c.fillStyle = "#ffe6b0";
  c.fillRect(lx - 14, H * 0.16, 28, 40);

  // reflections on the glass
  c.fillStyle = "rgba(255, 255, 255, 0.07)";
  for (const [x0, wd] of [[W * 0.32, 90], [W * 0.43, 30], [W * 0.74, 120]]) {
    c.beginPath();
    c.moveTo(x0, 0);
    c.lineTo(x0 + wd, 0);
    c.lineTo(x0 + wd - H * 0.5, H);
    c.lineTo(x0 - H * 0.5, H);
    c.fill();
  }
}

// ---------------------------------------------------------------- furniture

/** bottle-green beadboard wainscot with a wooden cap rail (along the back wall) */
function wainscot({ w = 18, h = 2.0 } = {}) {
  const g = new THREE.Group();
  const tex = K.canvasTex(1024, 256, (c, W, H) => {
    c.fillStyle = "#26463b";
    c.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += 32) {
      c.fillStyle = "rgba(0, 0, 0, 0.38)";
      c.fillRect(x, 0, 3, H);
      c.fillStyle = "rgba(255, 255, 255, 0.07)";
      c.fillRect(x + 3, 0, 2, H);
    }
  }, { repeat: [w / 4, 1] });
  const panel = K.box(w, h, 0.08, 0.01, K.mat(0xffffff, { map: tex, roughness: 0.45, clearcoat: 0.35 }), false);
  panel.position.y = h / 2;
  const cap = K.box(w, 0.1, 0.18, 0.02, K.mat(0x6e4a2f, { roughness: 0.4, clearcoat: 0.5 }));
  cap.position.set(0, h + 0.03, 0.05);
  const kick = K.box(w, 0.2, 0.12, 0.01, K.mat(0x163029, { roughness: 0.5 }), false);
  kick.position.set(0, 0.1, 0.05);
  g.add(panel, cap, kick);
  return g;
}

/** a bentwood café chair: caned round seat, splayed legs, a leg ring, a hoop back (the seat centre is the origin) */
function bistroChair({ seat = 0.62, color = 0x3b2517 } = {}) {
  const g = new THREE.Group();
  const wood = K.mat(color, { roughness: 0.32, clearcoat: 0.7 });
  const caneTex = K.canvasTex(256, 256, (c, W, H) => {
    c.fillStyle = "#d9b77e";
    c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(110, 72, 30, 0.45)";
    c.lineWidth = 2;
    for (let k = -W; k < W * 2; k += 14) {
      c.beginPath(); c.moveTo(k, 0); c.lineTo(k + H, H); c.stroke();
      c.beginPath(); c.moveTo(k, H); c.lineTo(k + H, 0); c.stroke();
    }
  });
  const s = K.cyl(0.4, 0.4, 0.05, K.mat(0xffffff, { map: caneTex, roughness: 0.8 }), 40);
  s.position.y = seat - 0.04;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.41, 0.04, 10, 48), wood);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = seat - 0.04;
  rim.castShadow = true;
  g.add(s, rim);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2, len = seat - 0.04;
    const leg = K.cyl(0.03, 0.036, len, wood, 12);
    leg.position.set(Math.sin(a) * 0.36, len / 2, Math.cos(a) * 0.36);
    leg.rotation.set(Math.cos(a) * -0.08, 0, Math.sin(a) * 0.08);
    g.add(leg);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.022, 8, 40), wood);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.22;
  g.add(ring);
  // the back: two posts rising behind the seat, closed by a hoop
  const H = 1.25, bz = -0.36;
  for (const sx of [-1, 1]) {
    const post = K.cyl(0.03, 0.03, H, wood, 12);
    post.position.set(sx * 0.27, seat + H / 2 - 0.04, bz);
    post.rotation.x = -0.1;
    g.add(post);
  }
  const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.035, 10, 32, Math.PI), wood);
  hoop.position.set(0, seat + H - 0.06, bz - 0.06);
  hoop.rotation.x = -0.1;
  hoop.castShadow = true;
  const inner = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.022, 8, 28, Math.PI), wood);
  inner.position.set(0, seat + 0.62, bz - 0.03);
  inner.rotation.set(-0.1, 0, Math.PI);
  g.add(hoop, inner);
  return g;
}

/** a round marble bistro table: brass rim, cast-iron column and foot */
function bistroTable({ r = 1.15, h = 1.45 } = {}) {
  const g = new THREE.Group();
  const top = K.cyl(r, r, 0.07, K.mat(0xffffff, { map: marbleTex(), roughness: 0.16, clearcoat: 0.9 }), 72);
  top.position.y = h - 0.035;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.022, 8, 96), brass());
  rim.rotation.x = Math.PI / 2;
  rim.position.y = h - 0.035;
  const collar = K.cyl(0.2, 0.13, 0.1, iron(), 24);
  collar.position.y = h - 0.12;
  const col = K.cyl(0.055, 0.07, h - 0.2, iron(), 20);
  col.position.y = (h - 0.2) / 2 + 0.06;
  const foot = K.cyl(0.42, 0.5, 0.07, iron(), 40);
  foot.position.y = 0.035;
  const boss = K.cyl(0.12, 0.2, 0.1, iron(), 24);
  boss.position.y = 0.11;
  g.add(top, rim, collar, col, foot, boss);
  g.userData.top = h;
  return g;
}

/** the call nobody joins: a video call, his self view, the empty tile "Waiting for Tyler to join…", the timer at 15:02 */
function callScreen() {
  const zoom = new Path2D(BRANDS.zoom.d);
  return K.canvasTex(1024, 640, (c, W, H) => {
    c.fillStyle = "#18191d";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#24252b";
    c.fillRect(0, 0, W, 84);
    c.fillStyle = "#0b5cff";
    c.beginPath();
    c.roundRect(20, 16, 52, 52, 13);
    c.fill();
    c.save();
    c.translate(25, 21);
    c.scale(42 / 24, 42 / 24);
    c.fillStyle = "#ffffff";
    c.fill(zoom);
    c.restore();
    c.textBaseline = "middle";
    c.font = "700 34px Inter, sans-serif";
    c.fillStyle = "#eceef3";
    c.fillText("Discovery call", 90, 43);
    const tx = 90 + c.measureText("Discovery call").width + 34;
    c.fillStyle = "#e5484d";
    c.beginPath();
    c.roundRect(tx, 18, 170, 50, 25);
    c.fill();
    c.fillStyle = "#ffffff";
    c.beginPath();
    c.arc(tx + 28, 43, 9, 0, Math.PI * 2);
    c.fill();
    c.font = "800 36px Inter, sans-serif";
    c.fillText("15:02", tx + 48, 45);
    // the empty tile
    c.fillStyle = "#2b2d34";
    c.beginPath();
    c.roundRect(26, 104, 640, 440, 26);
    c.fill();
    c.fillStyle = "#4b4f5b";
    c.beginPath();
    c.arc(346, 270, 84, 0, Math.PI * 2);
    c.fill();
    c.font = "800 88px Inter, sans-serif";
    c.fillStyle = "#ffffff";
    c.textAlign = "center";
    c.fillText("T", 346, 276);
    c.font = "700 40px Inter, sans-serif";
    c.fillStyle = "#e8eaf0";
    c.fillText("Waiting for Tyler to join…", 346, 420);
    c.font = "500 30px Inter, sans-serif";
    c.fillStyle = "#9a9ea9";
    c.fillText("He has the link.", 346, 474);
    // his self view: the café light, his beanie
    const sv = c.createLinearGradient(0, 104, 0, 344);
    sv.addColorStop(0, "#e9d6b8");
    sv.addColorStop(1, "#9c7c5c");
    c.fillStyle = sv;
    c.beginPath();
    c.roundRect(688, 104, 310, 240, 22);
    c.fill();
    c.save();
    c.beginPath();
    c.roundRect(688, 104, 310, 240, 22);
    c.clip();
    c.fillStyle = "#f4f1ea";
    c.beginPath();
    c.ellipse(843, 344, 110, 70, 0, Math.PI, 0);
    c.fill();
    c.fillStyle = "#b07a52";
    c.beginPath();
    c.arc(843, 226, 56, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#16161a";
    c.beginPath();
    c.ellipse(843, 196, 60, 40, 0, Math.PI, 0);
    c.fill();
    c.fillRect(783, 192, 120, 16);
    c.restore();
    c.font = "600 26px Inter, sans-serif";
    c.textAlign = "left";
    c.fillStyle = "rgba(0, 0, 0, 0.55)";
    c.beginPath();
    c.roundRect(700, 300, 66, 34, 8);
    c.fill();
    c.fillStyle = "#ffffff";
    c.fillText("You", 710, 318);
    // participants panel
    c.fillStyle = "#24252b";
    c.beginPath();
    c.roundRect(688, 364, 310, 180, 22);
    c.fill();
    c.font = "700 30px Inter, sans-serif";
    c.fillStyle = "#e8eaf0";
    c.fillText("Participants (1)", 712, 408);
    c.font = "500 28px Inter, sans-serif";
    c.fillStyle = "#9a9ea9";
    c.fillText("Waiting room: 0", 712, 458);
    c.fillText("Invited: Tyler", 712, 502);
    // controls
    c.fillStyle = "#24252b";
    c.fillRect(0, H - 76, W, 76);
    for (let k = 0; k < 4; k++) {
      c.fillStyle = "#3a3c44";
      c.beginPath();
      c.arc(70 + k * 90, H - 38, 24, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = "#e5484d";
    c.beginPath();
    c.roundRect(W - 190, H - 62, 160, 48, 24);
    c.fill();
    c.font = "800 28px Inter, sans-serif";
    c.fillStyle = "#ffffff";
    c.textAlign = "center";
    c.fillText("Leave", W - 110, H - 37);
  });
}

/** an aluminium laptop, lid open (open = angle between lid and base); the screen faces +z */
function laptop({ screen, open = 1.86 } = {}) {
  const g = new THREE.Group();
  const alu = K.mat(0xc9cdd4, { roughness: 0.28, metalness: 0.75 });
  const base = K.box(1.2, 0.045, 0.82, 0.03, alu);
  base.position.y = 0.0225;
  const deck = K.box(1.04, 0.006, 0.4, 0.01, K.mat(0x1d1e22, { roughness: 0.6 }), false);
  deck.position.set(0, 0.047, -0.12);
  const pad = K.box(0.44, 0.004, 0.26, 0.01, K.mat(0xb3b8c0, { roughness: 0.3, metalness: 0.6 }), false);
  pad.position.set(0, 0.047, 0.22);
  const lid = new THREE.Group();
  lid.position.set(0, 0.045, -0.4);
  const shell = K.box(1.2, 0.8, 0.03, 0.03, alu);
  shell.position.set(0, 0.4, -0.016);
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(1.16, 0.76), K.mat(0x0c0c0e, { roughness: 0.2, clearcoat: 1 }));
  bezel.position.set(0, 0.4, 0.0);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.6875), K.glow(0xffffff, { map: screen }));
  scr.position.set(0, 0.41, 0.002);
  scr.material.color.setScalar(0.92);
  lid.add(shell, bezel, scr);
  lid.rotation.x = -(open - Math.PI / 2);
  g.add(base, deck, pad, lid);
  g.userData.screen = scr;
  return g;
}

/** a latte on its saucer: a rosetta drawn in the foam, a spoon */
function latte() {
  const g = new THREE.Group();
  const saucer = K.cyl(0.32, 0.25, 0.035, china(), 48);
  saucer.position.y = 0.0175;
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.13, 0.24, 48, 1, true), china()); // open top: the foam shows
  cup.castShadow = cup.receiveShadow = true;
  cup.position.y = 0.035 + 0.12;
  const bottom = K.cyl(0.13, 0.13, 0.01, china(), 32);
  bottom.position.y = 0.04;
  const art = K.canvasTex(256, 256, (c, W) => {
    const gr = c.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
    gr.addColorStop(0, "#d6a576");
    gr.addColorStop(0.85, "#a8693f");
    gr.addColorStop(1, "#6e3f22");
    c.fillStyle = gr;
    c.fillRect(0, 0, W, W);
    c.fillStyle = "#fbf3e7";
    c.beginPath(); // a heart
    c.moveTo(W / 2, W * 0.78);
    c.bezierCurveTo(W * 0.12, W * 0.5, W * 0.22, W * 0.2, W / 2, W * 0.36);
    c.bezierCurveTo(W * 0.78, W * 0.2, W * 0.88, W * 0.5, W / 2, W * 0.78);
    c.fill();
    c.strokeStyle = "#b47648"; // the pour line through it
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(W / 2, W * 0.3);
    c.lineTo(W / 2, W * 0.82);
    c.stroke();
  });
  const foam = new THREE.Mesh(new THREE.CircleGeometry(0.2, 48), K.mat(0xffffff, { map: art, roughness: 0.65 }));
  foam.rotation.x = -Math.PI / 2;
  foam.position.y = 0.035 + 0.215;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.02, 10, 24), china());
  handle.position.set(0.22, 0.17, 0);
  handle.castShadow = true;
  const spoon = K.box(0.04, 0.012, 0.3, 0.006, K.mat(0xd8dade, { metalness: 1, roughness: 0.2 }));
  spoon.position.set(0.17, 0.045, 0.1);
  spoon.rotation.y = 0.5;
  g.add(saucer, cup, bottom, foam, handle, spoon);
  return g;
}

/** a croissant on a small plate (toy-like: plump segments along an arc) */
function croissant() {
  const g = new THREE.Group();
  const plate = K.cyl(0.36, 0.3, 0.03, china(), 48);
  plate.position.y = 0.015;
  g.add(plate);
  const pastry = K.mat(0xd68d3a, { roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.35 });
  const N = 7;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1), a = (t - 0.5) * 2.3;
    const r = 0.05 + 0.065 * Math.sin(t * Math.PI);
    const b = K.ball(r, pastry, 20);
    b.scale.set(1.3, 0.85, 1);
    b.position.set(Math.sin(a) * 0.2, 0.03 + r * 0.8, 0.14 - Math.cos(a) * 0.2);
    b.rotation.y = a;
    g.add(b);
  }
  return g;
}

/** a wooden shelf on brass brackets: mugs, stacked cups and two jars of beans */
function cupShelf({ w = 2.0 } = {}) {
  const g = new THREE.Group();
  const board = K.box(w, 0.07, 0.42, 0.015, K.mat(0x7a5236, { roughness: 0.45, clearcoat: 0.4 }));
  g.add(board);
  for (const sx of [-0.38, 0.38]) {
    const br = K.box(0.04, 0.3, 0.32, 0.01, brass());
    br.position.set(sx * w, -0.18, -0.02);
    g.add(br);
  }
  const mugs = [[0xf2eee8, 0xff611d], [0xffffff, 0x2c4a3f], [0xe9dfcf, 0xff611d]];
  mugs.forEach(([col, band], k) => {
    const m = K.mug(col, band);
    m.scale.setScalar(1.5);
    m.position.set(-w * 0.42 + k * 0.36, 0.035, 0.02);
    m.rotation.y = -0.6;
    g.add(m);
  });
  for (let k = 0; k < 3; k++) { // a stack of cups
    const cp = K.cyl(0.13, 0.09, 0.12, china(), 32);
    cp.position.set(w * 0.08, 0.1 + k * 0.1, 0);
    g.add(cp);
  }
  const glass = K.mat(0xffffff, { roughness: 0.05, transmission: 0.85, transparent: true, opacity: 0.45, thickness: 0.2 });
  const beans = K.mat(0x3a2215, { roughness: 0.8 });
  [[w * 0.28, 0.42], [w * 0.4, 0.32]].forEach(([x, h]) => {
    const jar = K.cyl(0.13, 0.13, h, glass, 32);
    jar.position.set(x, 0.035 + h / 2, 0);
    const fill = K.cyl(0.115, 0.115, h * 0.7, beans, 24);
    fill.position.set(x, 0.035 + h * 0.36, 0);
    const lid = K.cyl(0.14, 0.14, 0.06, K.mat(0x8a5634, { roughness: 0.5 }), 32);
    lid.position.set(x, 0.035 + h + 0.03, 0);
    g.add(fill, jar, lid);
  });
  return g;
}

/** the chalk menu (drawn with the canvas, prices as decor) */
function chalkMenu(c, W, H) {
  c.fillStyle = "#1f2423";
  c.fillRect(0, 0, W, H);
  c.fillStyle = "rgba(255, 255, 255, 0.04)";
  for (let k = 0; k < 6; k++) c.fillRect(0, (k * H) / 6 + 20, W, 30);
  c.textBaseline = "middle";
  c.fillStyle = "#f3efe6";
  c.font = "600 64px Nohemi, Inter, sans-serif";
  c.textAlign = "center";
  c.fillText("MENU", W / 2, 70);
  c.fillStyle = "#ff8a4c";
  c.fillRect(W * 0.3, 112, W * 0.4, 4);
  const items = [["latte", "5.50"], ["flat white", "5.00"], ["cold brew", "6.00"], ["matcha", "6.00"], ["croissant", "4.50"]];
  c.font = "500 34px Inter, sans-serif";
  items.forEach(([name, price], k) => {
    const y = 175 + k * 62;
    c.textAlign = "left";
    c.fillStyle = "#f3efe6";
    c.fillText(name, 40, y);
    c.textAlign = "right";
    c.fillText(`$${price}`, W - 40, y);
    c.fillStyle = "rgba(243, 239, 230, 0.35)";
    c.fillRect(40 + c.measureText(name).width + 14, y + 6, 6, 2);
  });
}

/** a neon in two lines (glowing script on a clear acrylic plate), same glow recipe as the kit's one-line neonSign */
function neonLines(lines, { color = "#ff6a2a", w = 1.6, h = 1.2, font = "italic 700 150px 'Nohemi', Inter, sans-serif" } = {}) {
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

export async function build({ renderer, scene, mood = "morning" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.42;
  scene.background = new THREE.Color(0x3a3430);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 18, h: 11, d: 18, backZ: BACK, wall: "#e6d9c4", floorMap: checkerTex(), floorTile: 1.8,
    floorRough: 0.42, baseboard: false }));
  const wain = wainscot({ w: 18, h: 2.0 });
  K.at(wain, 0, 0, BACK + 0.04);
  set.add(wain);

  // ---- the storefront window on the street, the morning sun pouring in
  const win = K.cityWindow({ w: 5.2, h: 4.5, view: street, blinds: 0, panes: [3, 1], frame: 0x1d3a30, bright: 1.0 });
  K.at(win, 1.0, 4.45, BACK + 0.02);
  const transom = K.box(5.2, 0.08, 0.12, 0.01, K.mat(0x1d3a30, { roughness: 0.4 }));
  K.at(transom, 1.0, 5.6, BACK + 0.06);
  const winGlow = K.wallGlow({ w: 8.5, h: 6.5, color: "#ffe2b5", strength: 0.38 });
  K.at(winGlow, 1.0, 4.4, BACK + 0.06);
  const shaft = K.lightShaft({ w: 3.4, h: 6.6, color: 0xffe4bd, strength: 0.12 });
  shaft.position.set(1.6, 2.8, -1.2);
  shaft.rotation.set(-0.6, 0, 0.32);
  const patch = K.sunPatch({ w: 4.6, d: 2.8, color: 0xffdcae, strength: 0.32 });
  patch.position.set(1.4, 0.02, 0.4);
  patch.rotation.z = 0.45;
  set.add(win, transom, winGlow, shaft, patch);

  // ---- the wall left of the window: neon, cup shelf, chalk menu, a tall plant
  const feature = K.box(7.9, 9.0, 0.04, 0.005, K.mat(0xffffff, { map: K.noiseTex("#2d4f43", 8, 13), roughness: 0.9 }), false);
  feature.material.map.repeat.set(3, 3);
  K.at(feature, -5.68, 2.05 + 4.5, BACK + 0.03);
  const neon = neonLines(["but first,", "coffee."], { color: "#ff6a2a", w: 1.5, h: 1.15, font: "italic 700 205px 'Nohemi', Inter, sans-serif" });
  K.at(neon, -2.62, 4.85, BACK + 0.16);
  const neonWash = K.wallGlow({ w: 3.6, h: 2.8, color: "#ff6a2a", strength: 0.5 });
  K.at(neonWash, -2.62, 4.85, BACK + 0.12);
  const shelf = cupShelf({ w: 1.8 });
  K.at(shelf, -2.7, 3.35, BACK + 0.25);
  const menu = K.poster({ w: 1.35, h: 1.6, draw: chalkMenu, frame: 0x5a3b26 });
  K.at(menu, -5.1, 3.9, BACK + 0.05);
  const plantL = K.plant({ h: 2.9, n: 11, seed: 27, pot: 0xd9cbb4 });
  K.at(plantL, -4.6, 0, -2.3);
  const plantR = K.plant({ h: 2.6, n: 9, seed: 33, pot: 0x2c4a3f });
  K.at(plantR, 4.15, 0, -2.6);
  set.add(feature, neon, neonWash, shelf, menu, plantL, plantR);

  // ---- his table: bentwood chair, marble table, laptop (the call), latte, croissant
  const chair = bistroChair({ seat: 0.62 });
  K.at(chair, -1.45, 0, -0.95, 0.55);
  const table = bistroTable({ r: 1.4, h: 1.45 });
  K.at(table, 0.6, 0, -1.5);
  const lap = laptop({ screen: callScreen() });
  K.at(lap, -0.02, 1.45, -1.9, -0.3);
  lap.scale.setScalar(0.9);
  const cup = latte();
  K.at(cup, 0.15, 1.45, -0.8, 0.3);
  const pastry = croissant();
  K.at(pastry, 1.0, 1.45, -0.6, -0.4);
  // an empty table for two near the window, for depth
  const table2 = bistroTable({ r: 0.85, h: 1.45 });
  K.at(table2, 3.3, 0, -2.2);
  const chair2 = bistroChair({ seat: 0.62 });
  K.at(chair2, 3.15, 0, -0.95, Math.PI + 0.2);
  set.add(chair, table, lap, cup, pastry, table2, chair2);

  // two pendants: over his table and over the counter side
  const pend1 = K.pendant({ cord: 3 });
  K.at(pend1, 0.6, 8.6, -1.5);
  const pend2 = K.pendant({ cord: 3 });
  K.at(pend2, -3.0, 8.9, -1.9);
  set.add(pend1, pend2);

  // ---- lights: morning. The low sun behind the window is the warm rim (it casts the long shadows forward), a cool
  // sky fill, a soft front key for the faces; the neon and the pendants add warm practical accents.
  set.add(new THREE.HemisphereLight(0xfff1dc, 0x3c3028, 1.2));
  const key = new THREE.DirectionalLight(0xfff4ea, 1.5);
  key.position.set(-3, 9, 9);
  key.target.position.set(0.3, 2, -1.5);
  const rim = new THREE.DirectionalLight(0xffd39c, 2.7);
  rim.position.set(5, 6.5, -9);
  rim.target.position.set(0.3, 1, 0);
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
    neon: pl(0xff6a2a, 4, -2.62, 4.8, BACK + 0.9, 6),
    pend1: pl(0xffd7a0, 4, 0.6, 5.0, -1.5, 6),
    window: pl(0xffe6c2, 5, 0.85, 4.0, BACK + 1.2, 7),
    screen: pl(0x9fbcff, 1.2, 0.0, 2.0, -1.5, 2.2),
  };

  // the laptop screen, in the world: the insert shot looks at it
  set.updateMatrixWorld(true);
  const screenAt = lap.userData.screen.getWorldPosition(new THREE.Vector3());

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(-1.25, 3.95, -0.8);
  const settyFace = new THREE.Vector3(1.42, 2.21, -1.45);
  return {
    key, rim, lights, root: set,
    coach: { x: -1.45, y: -0.46, z: -0.95, turn: 0.55, sit: 1 },
    setty: { x: 1.42, y: 1.15, z: -1.45, turn: -0.35, scale: 0.6 },
    heads: { coach: coachHead, setty: settyFace, laptop: screenAt },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 },
      laptop: { target: screenAt, dist: 4.0, yaw: -0.3, pitch: 0.2, y: 800 },
    },
    shots: {
      wide: { pos: [-0.1, 3.5, 12.2], at: [-0.1, 2.25, -1.5], fov: 44 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 }),
      laptop: K.shot(screenAt, { dist: 4.0, yaw: -0.3, pitch: 0.2, y: 800 }),
    },
  };
}
