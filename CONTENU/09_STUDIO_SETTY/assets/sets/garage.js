// Set "garage": the coach's garage workshop on a Saturday night (reel17, his homemade AI setter in Make). A two-car
// garage turned "startup corner": grey concrete floor, a painted cinder-block wall, a sectional garage door half open on
// the street at night (a parked car, the houses across, a cool streetlight), a butcher-block workbench under a pegboard
// of tools, three monitors with his Make scenario, an LED shop light on chains, a clamp lamp, a cyan SHIP IT neon, a
// stack of tyres, a pizza box. He sits on a rolling shop stool in front of the bench; Setty sits on a black rolling
// tool chest in front of the half-open door (cool blue behind him, never orange on orange).
// The furniture only this set uses stays in this file (kit.js is frozen during the 12-21 batch).
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4;
const DOOR = { x: 3.35, w: 5.0, h: 5.2, open: 2.3 }; // the garage door opening, and the height its bottom edge is raised to

// ---------------- textures (gradients only: never ctx.filter, the headless render turns it black) ----------------
const rgb = (hex, k = 1) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
};

/** sealed grey concrete: mottled, saw-cut joints, a few oil stains */
function concreteTex({ seed = 13 } = {}) {
  const R = K.rng(seed);
  return K.canvasTex(1024, 1024, (c, W, H) => {
    c.fillStyle = "#626468";
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) {
      const x = R() * W, y = R() * H, r = 20 + R() * 120, dark = R() < 0.5;
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, dark ? "rgba(40,42,46,0.10)" : "rgba(210,210,206,0.08)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g;
      c.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    for (let i = 0; i < 2600; i++) { // aggregate specks
      c.fillStyle = R() < 0.5 ? "rgba(30,30,32,0.25)" : "rgba(220,220,215,0.18)";
      c.fillRect(R() * W, R() * H, 1 + R() * 2, 1 + R() * 2);
    }
    for (const [x, y, rx, ry] of [[300, 640, 90, 46], [700, 300, 60, 30], [520, 820, 40, 22]]) { // oil stains
      const g = c.createRadialGradient(x, y, 0, x, y, rx);
      g.addColorStop(0, "rgba(20,20,24,0.32)");
      g.addColorStop(0.7, "rgba(20,20,24,0.12)");
      g.addColorStop(1, "rgba(20,20,24,0)");
      c.save();
      c.translate(x, y);
      c.scale(1, ry / rx);
      c.translate(-x, -y);
      c.fillStyle = g;
      c.fillRect(x - rx, y - rx, 2 * rx, 2 * rx);
      c.restore();
    }
    c.strokeStyle = "rgba(28,28,30,0.55)"; // saw-cut joints (one tile = one slab)
    c.lineWidth = 3;
    c.strokeRect(1.5, 1.5, W - 3, H - 3);
  });
}

/** painted cinder blocks (2:1 blocks, 4 per row, 8 rows per tile), off-white paint gone a bit grey */
function blockTex({ base = "#8d929b", seed = 19 } = {}) {
  const R = K.rng(seed);
  return K.canvasTex(1024, 1024, (c, W, H) => {
    c.fillStyle = "#6c7077";
    c.fillRect(0, 0, W, H);
    const rows = 8, cols = 4, bh = H / rows, bw = W / cols, m = 7;
    for (let r = 0; r < rows; r++) {
      const off = r % 2 ? bw / 2 : 0;
      for (let k = -1; k <= cols; k++) {
        const x = k * bw + off, y = r * bh;
        c.fillStyle = rgb(base, 0.93 + R() * 0.1);
        c.fillRect(x + m / 2, y + m / 2, bw - m, bh - m);
        const g = c.createLinearGradient(0, y, 0, y + bh); // a soft bevel: light on top, shade at the bottom
        g.addColorStop(0, "rgba(255,255,255,0.10)");
        g.addColorStop(0.5, "rgba(255,255,255,0)");
        g.addColorStop(1, "rgba(0,0,0,0.10)");
        c.fillStyle = g;
        c.fillRect(x + m / 2, y + m / 2, bw - m, bh - m);
        for (let p = 0; p < 40; p++) { // pores under the paint
          c.fillStyle = "rgba(60,58,54,0.16)";
          c.fillRect(x + m + R() * (bw - 2 * m), y + m + R() * (bh - 2 * m), 2, 2);
        }
      }
    }
  });
}

/** butcher block: narrow glued strips, each its own tone */
function butcherTex({ base = "#c08e5c", strips = 14, seed = 23 } = {}) {
  const R = K.rng(seed);
  return K.canvasTex(1024, 512, (c, W, H) => {
    const sh = H / strips;
    for (let i = 0; i < strips; i++) {
      let x = -R() * 300;
      while (x < W) {
        const len = 260 + R() * 420;
        c.fillStyle = rgb(base, 0.84 + R() * 0.26);
        c.fillRect(x, i * sh, len, sh);
        c.strokeStyle = "rgba(70,40,18,0.16)";
        c.lineWidth = 1.2;
        for (let g = 0; g < 3; g++) {
          const y0 = i * sh + R() * sh;
          c.beginPath();
          c.moveTo(x, y0);
          c.bezierCurveTo(x + len * 0.3, y0 + (R() - 0.5) * 4, x + len * 0.7, y0 + (R() - 0.5) * 4, x + len, y0);
          c.stroke();
        }
        c.fillStyle = "rgba(60,32,14,0.4)";
        c.fillRect(x, i * sh, 2, sh);
        x += len;
      }
      c.fillStyle = "rgba(60,32,14,0.35)";
      c.fillRect(0, i * sh, W, 1.5);
    }
  });
}

/** brown hardboard pegboard with its grid of holes */
function pegTex() {
  return K.canvasTex(1024, 512, (c, W, H) => {
    c.fillStyle = "#8a6748";
    c.fillRect(0, 0, W, H);
    const g = c.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "rgba(255,255,255,0.05)");
    g.addColorStop(1, "rgba(0,0,0,0.08)");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#2a1d12";
    for (let y = 16; y < H; y += 32) for (let x = 16; x < W; x += 32) {
      c.beginPath();
      c.arc(x, y, 4.2, 0, Math.PI * 2);
      c.fill();
    }
  });
}

/** the street at night through the gap under the door: wet driveway, the street, a parked car, the houses across */
function streetNight(c, W, H, R) {
  const sky = c.createLinearGradient(0, 0, 0, H * 0.32);
  sky.addColorStop(0, "#0d1426");
  sky.addColorStop(1, "#1c2742");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H * 0.32);
  // the houses across: siding, a lit window, a porch light, a garage door
  for (const [x, w, col] of [[-40, 380, "#2a3348"], [330, 360, "#323a50"], [690, 400, "#283044"]]) {
    c.fillStyle = col;
    c.fillRect(x, H * 0.05, w, H * 0.27);
    c.fillStyle = "rgba(255,255,255,0.05)";
    for (let y = H * 0.07; y < H * 0.32; y += 9) c.fillRect(x, y, w, 2);
  }
  for (const [x, y, w, h] of [[90, 0.11, 70, 0.12], [520, 0.1, 80, 0.13], [840, 0.12, 60, 0.11]]) {
    const g = c.createLinearGradient(0, H * y, 0, H * (y + h));
    g.addColorStop(0, "#ffd58a");
    g.addColorStop(1, "#e8a85a");
    c.fillStyle = g;
    c.fillRect(x, H * y, w, H * h);
    c.fillStyle = "#1a2030";
    c.fillRect(x + w / 2 - 2, H * y, 4, H * h);
  }
  c.fillStyle = "#3d4660"; // the garage door across
  c.fillRect(250, H * 0.13, 150, H * 0.19);
  const porch = c.createRadialGradient(470, H * 0.12, 0, 470, H * 0.12, 70);
  porch.addColorStop(0, "rgba(255,214,150,0.85)");
  porch.addColorStop(1, "rgba(255,214,150,0)");
  c.fillStyle = porch;
  c.fillRect(400, 0, 140, H * 0.3);
  // lawn strip and curb
  c.fillStyle = "#18241f";
  c.fillRect(0, H * 0.32, W, H * 0.05);
  c.fillStyle = "#59606e";
  c.fillRect(0, H * 0.37, W, H * 0.015);
  // the street, with a cool LED streetlight pool on the left
  const st = c.createLinearGradient(0, H * 0.385, 0, H * 0.52);
  st.addColorStop(0, "#1b1f2a");
  st.addColorStop(1, "#242a36");
  c.fillStyle = st;
  c.fillRect(0, H * 0.385, W, H * 0.135);
  const pool = c.createRadialGradient(170, H * 0.45, 0, 170, H * 0.45, 260);
  pool.addColorStop(0, "rgba(190,215,255,0.38)");
  pool.addColorStop(1, "rgba(190,215,255,0)");
  c.fillStyle = pool;
  c.fillRect(0, H * 0.2, 460, H * 0.4);
  // a parked car (its lower half: body, wheels, a tail light)
  c.fillStyle = "#121722";
  c.beginPath();
  c.roundRect(560, H * 0.22, 380, H * 0.2, 26);
  c.fill();
  c.fillStyle = "rgba(170,195,235,0.35)";
  c.fillRect(580, H * 0.27, 340, 3);
  c.fillStyle = "#07090e";
  for (const x of [640, 860]) {
    c.beginPath();
    c.arc(x, H * 0.42, H * 0.06, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = "#ff3b3b";
  c.fillRect(930, H * 0.27, 10, 14);
  // the wet driveway: cool reflections of the streetlight, warm streaks from the windows
  const dw = c.createLinearGradient(0, H * 0.52, 0, H);
  dw.addColorStop(0, "#2e3442");
  dw.addColorStop(1, "#4a505c");
  c.fillStyle = dw;
  c.fillRect(0, H * 0.52, W, H * 0.48);
  for (const [x, col, w] of [[170, "rgba(200,222,255,0.20)", 90], [125, "rgba(255,210,140,0.12)", 30], [560, "rgba(255,210,140,0.10)", 36], [870, "rgba(255,210,140,0.09)", 26]]) {
    const g = c.createLinearGradient(0, H * 0.52, 0, H);
    g.addColorStop(0, col);
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(x - w / 2, H * 0.52, w, H * 0.48);
  }
  for (let i = 0; i < 900; i++) { // concrete grain
    c.fillStyle = R() < 0.5 ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.05)";
    c.fillRect(R() * W, H * 0.52 + R() * H * 0.48, 2, 2);
  }
  c.fillStyle = "rgba(10,12,16,0.55)"; // the driveway's expansion joint
  c.fillRect(0, H * 0.74, W, 3);
}

// ---------------- the screens (Make's look, the coach's homemade setter) ----------------
/** his Make scenario: round modules linked by dotted lines, a "3" run bubble on each (three messages, three runs) */
function scenarioScreen() {
  return K.canvasTex(1024, 576, (c, W, H) => {
    c.fillStyle = "#f3f2f7";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#d6d3e0";
    for (let y = 14; y < H; y += 24) for (let x = 14; x < W; x += 24) c.fillRect(x, y, 2, 2);
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, W, 56);
    c.fillStyle = "#6d00cc";
    c.beginPath();
    c.roundRect(20, 13, 30, 30, 8);
    c.fill();
    c.font = "700 26px Inter, sans-serif";
    c.fillStyle = "#1f1a2e";
    c.textBaseline = "middle";
    c.fillText("my AI setter", 64, 29);
    const mods = [
      { x: 150, y: 300, col: "#d6246e", label: "Webhooks" },
      { x: 400, y: 260, col: "#141414", label: "OpenAI" },
      { x: 650, y: 300, col: "#d6246e", label: "Webhooks" },
    ];
    c.setLineDash([6, 10]);
    c.lineWidth = 5;
    c.strokeStyle = "#b9b4c9";
    c.beginPath();
    c.moveTo(mods[0].x, mods[0].y);
    for (const m of mods.slice(1)) c.lineTo(m.x, m.y);
    c.lineTo(860, 300);
    c.stroke();
    c.setLineDash([]);
    c.fillStyle = "#e4e1ec"; // the "add a module" ghost
    c.beginPath();
    c.arc(880, 300, 46, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#b9b4c9";
    c.fillRect(864, 296, 32, 8);
    c.fillRect(876, 284, 8, 32);
    c.textAlign = "center";
    for (const m of mods) {
      c.fillStyle = "rgba(60,40,90,0.15)";
      c.beginPath();
      c.arc(m.x + 4, m.y + 8, 72, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = m.col;
      c.beginPath();
      c.arc(m.x, m.y, 72, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "#ffffff";
      c.lineWidth = 9;
      c.lineCap = "round";
      c.beginPath();
      if (m.label === "OpenAI") { // a generic spark, not the brand mark
        for (let k = 0; k < 6; k++) {
          const a = (k * Math.PI) / 3;
          c.moveTo(m.x + Math.cos(a) * 12, m.y + Math.sin(a) * 12);
          c.lineTo(m.x + Math.cos(a) * 36, m.y + Math.sin(a) * 36);
        }
      } else { // a hook
        c.arc(m.x, m.y + 8, 22, 0.1 * Math.PI, 1.05 * Math.PI);
        c.moveTo(m.x + 21, m.y + 15);
        c.lineTo(m.x + 21, m.y - 30);
      }
      c.stroke();
      c.font = "600 28px Inter, sans-serif";
      c.fillStyle = "#2a2440";
      c.fillText(m.label, m.x, m.y + 110);
      c.fillStyle = "#ffffff"; // the run bubble
      c.beginPath();
      c.arc(m.x + 56, m.y - 56, 24, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "#e5484d";
      c.lineWidth = 4;
      c.stroke();
      c.font = "800 28px Inter, sans-serif";
      c.fillStyle = "#e5484d";
      c.fillText("3", m.x + 56, m.y - 55);
    }
    c.fillStyle = "#6d00cc"; // the "Run once" button
    c.beginPath();
    c.roundRect(24, H - 84, 210, 60, 30);
    c.fill();
    c.font = "700 26px Inter, sans-serif";
    c.fillStyle = "#ffffff";
    c.fillText("Run once", 129, H - 53);
  });
}

/** the model's instructions, in a dark editor: lines of prompt and a blinking caret */
function promptScreen() {
  return K.canvasTex(1024, 576, (c, W, H) => {
    c.fillStyle = "#16171d";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#22242d";
    c.fillRect(0, 0, W, 56);
    for (const [x, col] of [[28, "#ff5f57"], [56, "#febc2e"], [84, "#28c840"]]) {
      c.fillStyle = col;
      c.beginPath();
      c.arc(x, 28, 9, 0, Math.PI * 2);
      c.fill();
    }
    c.font = "600 30px Inter, sans-serif";
    c.fillStyle = "#c9cbe0";
    c.textBaseline = "middle";
    c.fillText("Instructions", 40, 100);
    const R = K.rng(5);
    const cols = ["#7aa2ff", "#c792ea", "#e6e6f0", "#89ddff", "#e6e6f0", "#c3e88d"];
    for (let i = 0; i < 9; i++) {
      let x = 40;
      const y = 150 + i * 40;
      const n = 2 + Math.floor(R() * 4);
      for (let k = 0; k < n; k++) {
        const w = 50 + R() * 150;
        c.fillStyle = cols[(i + k) % cols.length];
        c.globalAlpha = 0.8;
        c.beginPath();
        c.roundRect(x, y, w, 16, 8);
        c.fill();
        x += w + 18;
      }
    }
    c.globalAlpha = 1;
    c.fillStyle = "#e6e6f0";
    c.fillRect(40, 150 + 9 * 40 - 4, 6, 26);
  });
}

/** the run history: rows of runs, green, green, then red errors */
function historyScreen() {
  return K.canvasTex(1024, 576, (c, W, H) => {
    c.fillStyle = "#f7f7fa";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, W, 56);
    c.font = "700 28px Inter, sans-serif";
    c.fillStyle = "#1f1a2e";
    c.textBaseline = "middle";
    c.fillText("History", 30, 29);
    const states = ["ok", "ok", "err", "ok", "err", "err", "ok", "err"];
    states.forEach((s, i) => {
      const y = 84 + i * 60;
      c.fillStyle = i % 2 ? "#ffffff" : "#f0eff5";
      c.fillRect(20, y, W - 40, 52);
      c.fillStyle = s === "ok" ? "#2fb36d" : "#e5484d";
      c.beginPath();
      c.arc(52, y + 26, 13, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#c9c6d6";
      c.beginPath();
      c.roundRect(84, y + 18, 240 + ((i * 53) % 160), 16, 8);
      c.fill();
      c.fillStyle = s === "ok" ? "#d9f3e5" : "#fde1e2";
      c.beginPath();
      c.roundRect(W - 200, y + 12, 160, 28, 14);
      c.fill();
      c.font = "700 20px Inter, sans-serif";
      c.fillStyle = s === "ok" ? "#1f8a52" : "#c4282e";
      c.textAlign = "center";
      c.fillText(s === "ok" ? "Success" : "Error", W - 120, y + 27);
      c.textAlign = "left";
    });
  });
}

// ---------------- the furniture only this set uses ----------------
const steel = (color = 0x1d1e22, o = {}) => K.mat(color, { metalness: 0.6, roughness: 0.36, clearcoat: 0.4, ...o });

/** the sectional garage door, raised to `open`, in its opening; the street shows in the gap under it */
function garageDoor({ w = DOOR.w, h = DOOR.h, open = DOOR.open } = {}) {
  const g = new THREE.Group();
  const view = new THREE.Mesh(new THREE.PlaneGeometry(w, open + 0.2),
    K.glow(0xffffff, { map: K.canvasTex(1024, Math.round((1024 * (open + 0.2)) / w), (c, W, H) => streetNight(c, W, H, K.rng(51))) }));
  view.material.color.setScalar(1.0);
  view.position.set(0, (open + 0.2) / 2, 0.006); // in front of the wall plane (the room's wall is one plane)
  g.add(view);
  const panel = K.mat(0xb4b9c3, { roughness: 0.55, clearcoat: 0.2 });
  const inset = K.mat(0xa6abb6, { roughness: 0.6 });
  const n = 3, sh = (h - open) / n;
  for (let i = 0; i < n; i++) {
    const y = open + sh * (i + 0.5);
    const s = K.box(w - 0.04, sh - 0.03, 0.12, 0.02, panel);
    s.position.set(0, y, 0.06);
    g.add(s);
    if (i === n - 1) { // the top section: a row of small windows on the night sky
      for (let k = 0; k < 4; k++) {
        const ww = (w - 0.9) / 4;
        const win = new THREE.Mesh(new THREE.PlaneGeometry(ww - 0.12, sh * 0.42), K.glow(0x1d2a48));
        win.position.set(-w / 2 + 0.45 + ww * (k + 0.5), y + 0.02, 0.125);
        const fr = K.box(ww - 0.02, sh * 0.5, 0.03, 0.01, K.mat(0xbfc1c6, { roughness: 0.5 }), false);
        fr.position.set(win.position.x, y + 0.02, 0.115);
        g.add(fr, win);
      }
    } else { // stamped long panels
      for (let k = 0; k < 4; k++) {
        const ww = (w - 0.5) / 4;
        const p = K.box(ww - 0.16, sh * 0.56, 0.03, 0.02, inset, false);
        p.position.set(-w / 2 + 0.25 + ww * (k + 0.5), y, 0.13);
        g.add(p);
      }
    }
  }
  const seal = K.box(w - 0.04, 0.07, 0.16, 0.02, K.mat(0x141416, { roughness: 0.8 }));
  seal.position.set(0, open - 0.02, 0.07);
  const handle = K.box(0.5, 0.08, 0.08, 0.03, steel(0x2a2b30));
  handle.position.set(0, open + 0.32, 0.18);
  g.add(seal, handle);
  const trim = K.mat(0xeeeae2, { roughness: 0.6 });
  for (const sx of [-1, 1]) {
    const j = K.box(0.22, h + 0.22, 0.1, 0.02, trim);
    j.position.set(sx * (w / 2 + 0.11), (h + 0.22) / 2, 0.05);
    const track = K.box(0.08, h - 0.2, 0.08, 0.02, steel(0x6b6e75), false); // the vertical tracks
    track.position.set(sx * (w / 2 - 0.08), h / 2, 0.16);
    g.add(j, track);
  }
  const header = K.box(w + 0.44, 0.22, 0.1, 0.02, trim);
  header.position.set(0, h + 0.11, 0.05);
  g.add(header);
  return g;
}

/** butcher-block workbench: thick top, 4×4 legs, a low shelf with storage bins, a vise on the left end */
function workbench({ w = 4.3, d = 1.3, h = 1.35 } = {}) {
  const g = new THREE.Group();
  const tex = butcherTex();
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const top = K.box(w, 0.16, d, 0.03, K.mat(0xffffff, { map: tex, roughness: 0.5, clearcoat: 0.25 }));
  top.position.y = h - 0.08;
  const leg = K.mat(0xa77a4f, { roughness: 0.65 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const l = K.box(0.16, h - 0.16, 0.16, 0.02, leg);
    l.position.set(sx * (w / 2 - 0.18), (h - 0.16) / 2, sz * (d / 2 - 0.16));
    g.add(l);
  }
  const shelf = K.box(w - 0.3, 0.07, d - 0.2, 0.01, K.mat(0x9a7046, { roughness: 0.7 }));
  shelf.position.y = 0.32;
  const apron = K.box(w - 0.3, 0.16, 0.06, 0.01, leg);
  apron.position.set(0, h - 0.24, d / 2 - 0.12);
  g.add(top, shelf, apron);
  [[-1.35, 0x2b2e35], [-0.35, 0x2b2e35], [0.65, 0x3567c9], [1.55, 0x2b2e35]].forEach(([x, col]) => { // storage bins
    const b = K.box(0.8, 0.48, 0.9, 0.04, K.mat(col, { roughness: 0.5, clearcoat: 0.2 }));
    b.position.set(x, 0.6, 0.02);
    const lip = K.box(0.82, 0.05, 0.92, 0.02, K.mat(col, { roughness: 0.5 }), false);
    lip.position.set(x, 0.86, 0.02);
    g.add(b, lip);
  });
  const vise = new THREE.Group(); // a bench vise on the left end
  const vb = steel(0x3b4a63, { metalness: 0.4, roughness: 0.45 });
  const body = K.box(0.36, 0.26, 0.5, 0.04, vb);
  body.position.set(0, 0.13, 0);
  const jawA = K.box(0.4, 0.2, 0.08, 0.02, steel(0x9a9da4, { metalness: 0.8 }));
  jawA.position.set(0, 0.32, 0.12);
  const jawB = jawA.clone();
  jawB.position.z = 0.26;
  const screw = K.cyl(0.03, 0.03, 0.6, steel(0xb5b8bf, { metalness: 0.85 }), 12);
  screw.rotation.x = Math.PI / 2;
  screw.position.set(0, 0.22, 0.52);
  const bar = K.cyl(0.02, 0.02, 0.5, steel(0xb5b8bf, { metalness: 0.85 }), 10);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, 0.22, 0.82);
  vise.add(body, jawA, jawB, screw, bar);
  vise.position.set(-w / 2 + 0.35, h, d / 2 - 0.42);
  g.add(vise);
  g.userData.top = h;
  return g;
}

/** a pegboard on battens, its tools hanging on hooks (all simple shapes, colours away from orange) */
function pegboard({ w = 4.2, h = 2.6 } = {}) {
  const g = new THREE.Group();
  const tex = pegTex();
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(w / 2.1, h / 1.05);
  const board = K.box(w, h, 0.05, 0.01, K.mat(0xffffff, { map: tex, roughness: 0.85 }), false);
  const frame = K.mat(0xa77a4f, { roughness: 0.65 });
  g.add(board);
  for (const [x, y, bw, bh] of [[0, h / 2, w + 0.12, 0.1], [0, -h / 2, w + 0.12, 0.1], [-w / 2, 0, 0.1, h], [w / 2, 0, 0.1, h]]) {
    const b = K.box(bw, bh, 0.08, 0.01, frame, false);
    b.position.set(x, y, 0.02);
    g.add(b);
  }
  const Z = 0.08;
  const metal = steel(0xa9adb5, { metalness: 0.85, roughness: 0.3 });
  const hook = (x, y) => { const k = K.cyl(0.015, 0.015, 0.12, metal, 8); k.rotation.x = Math.PI / 2; k.position.set(x, y, 0.06); g.add(k); };
  // wrenches, a row of sizes
  [0.42, 0.5, 0.58, 0.66, 0.74].forEach((L, i) => {
    const x = -1.75 + i * 0.16, y = 0.7;
    hook(x, y);
    const sh = K.box(0.06, L, 0.025, 0.01, metal);
    sh.position.set(x, y - L / 2 - 0.02, Z);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.022, 8, 20), metal);
    ring.position.set(x, y - 0.03, Z);
    g.add(sh, ring);
  });
  // a claw hammer
  hook(-0.8, 0.85);
  const hh = K.cyl(0.04, 0.045, 0.85, K.mat(0x2a2c31, { roughness: 0.5 }), 12);
  hh.position.set(-0.8, 0.4, Z);
  const head = K.box(0.36, 0.1, 0.08, 0.02, steel(0x3a3c42));
  head.position.set(-0.8, 0.86, Z);
  g.add(hh, head);
  // screwdrivers: coloured handles, steel shafts
  [0xd8333a, 0x2f6fd6, 0xf2c230, 0x2f9e5c, 0x1e1f24].forEach((col, i) => {
    const x = -0.35 + i * 0.13, y = 0.95;
    const hd = K.cyl(0.04, 0.035, 0.24, K.mat(col, { roughness: 0.35, clearcoat: 0.5 }), 12);
    hd.position.set(x, y, Z);
    const shaft = K.cyl(0.012, 0.012, 0.32 + (i % 2) * 0.1, metal, 8);
    shaft.position.set(x, y - 0.3 - (i % 2) * 0.05, Z);
    g.add(hd, shaft);
  });
  // pliers (two crossed bars with red grips)
  for (const s of [-1, 1]) {
    const grip = K.box(0.05, 0.38, 0.03, 0.02, K.mat(0xc8323a, { roughness: 0.5 }));
    grip.position.set(0.55 + s * 0.05, 0.42, Z);
    grip.rotation.z = s * 0.12;
    const jaw = K.box(0.04, 0.18, 0.03, 0.01, metal);
    jaw.position.set(0.55 - s * 0.01, 0.75, Z);
    jaw.rotation.z = -s * 0.1;
    g.add(grip, jaw);
  }
  hook(0.55, 0.88);
  // a hand saw
  const blade = new THREE.Shape();
  blade.moveTo(0, 0); blade.lineTo(1.0, 0.08); blade.lineTo(1.0, 0.24); blade.lineTo(0, 0.3); blade.closePath();
  const saw = new THREE.Mesh(new THREE.ExtrudeGeometry(blade, { depth: 0.01, bevelEnabled: false }), metal);
  saw.position.set(0.95, 0.65, Z - 0.02);
  saw.castShadow = true;
  const sawGrip = K.box(0.26, 0.3, 0.05, 0.05, K.mat(0x2a2c31, { roughness: 0.5 }));
  sawGrip.position.set(0.85, 0.8, Z);
  g.add(saw, sawGrip);
  // a spirit level and a tape measure
  const level = K.box(1.4, 0.12, 0.05, 0.02, K.mat(0xf2c230, { roughness: 0.4, clearcoat: 0.4 }));
  level.position.set(-0.5, -0.65, Z);
  const bubble = K.box(0.16, 0.06, 0.02, 0.02, K.glow(0x9ef08a), false);
  bubble.position.set(-0.5, -0.65, Z + 0.035);
  const tape = K.box(0.26, 0.26, 0.1, 0.05, K.mat(0xf2c230, { roughness: 0.4 }));
  tape.position.set(1.65, -0.35, Z + 0.02);
  const tapeFace = K.cyl(0.08, 0.08, 0.02, K.mat(0x1e1f24), 16);
  tapeFace.rotation.x = Math.PI / 2;
  tapeFace.position.set(1.65, -0.35, Z + 0.08);
  g.add(level, bubble, tape, tapeFace);
  // a cordless drill on its hook
  const drill = new THREE.Group();
  const dBody = K.box(0.5, 0.2, 0.14, 0.07, K.mat(0x1f8f8a, { roughness: 0.45, clearcoat: 0.4 }));
  const dGrip = K.box(0.13, 0.36, 0.12, 0.05, K.mat(0x1e1f24, { roughness: 0.6 }));
  dGrip.position.set(0.08, -0.22, 0);
  const dBat = K.box(0.24, 0.12, 0.16, 0.04, K.mat(0x1e1f24, { roughness: 0.6 }));
  dBat.position.set(0.08, -0.44, 0);
  const chuck = K.cyl(0.05, 0.04, 0.14, metal, 12);
  chuck.rotation.z = Math.PI / 2;
  chuck.position.set(-0.32, 0, 0);
  drill.add(dBody, dGrip, dBat, chuck);
  drill.position.set(1.65, 0.6, Z + 0.04);
  g.add(drill);
  return g;
}

/** a rolling shop stool: round padded seat, gas lift, five-star base on casters, a foot ring */
function shopStool({ seat = 0.52 } = {}) {
  const g = new THREE.Group();
  const cushion = K.soft(0.95, 0.2, 0.95, K.mat(0x17171a, { roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3 }), { P: 2.2, puff: 0.15, seed: 8 });
  cushion.position.y = seat - 0.1;
  const metal = steel(0x2a2b30);
  const post = K.cyl(0.05, 0.05, seat - 0.24, steel(0x9a9da4, { metalness: 0.85 }), 16);
  post.position.y = (seat - 0.24) / 2 + 0.12;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.025, 8, 40), steel(0x9a9da4, { metalness: 0.85 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.26;
  g.add(cushion, post, ring);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = K.box(0.5, 0.05, 0.09, 0.02, metal);
    leg.position.set(Math.sin(a) * 0.25, 0.11, Math.cos(a) * 0.25);
    leg.rotation.y = a + Math.PI / 2;
    const wheel = K.ball(0.055, K.mat(0x111113, { roughness: 0.5 }), 14);
    wheel.position.set(Math.sin(a) * 0.5, 0.055, Math.cos(a) * 0.5);
    g.add(leg, wheel);
  }
  g.userData.top = seat;
  return g;
}

/** a black rolling tool chest: drawers with chrome bar handles, a rubber mat on top, casters, a side push bar */
function toolChest({ w = 1.7, h = 2.0, d = 1.1 } = {}) {
  const g = new THREE.Group();
  const wheelH = 0.16, bodyH = h - wheelH - 0.04;
  const body = K.box(w, bodyH, d, 0.05, K.mat(0x16171b, { roughness: 0.32, metalness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.2 }));
  body.position.y = wheelH + bodyH / 2;
  const mat = K.box(w - 0.08, 0.04, d - 0.08, 0.015, K.mat(0x26272c, { roughness: 0.9 }));
  mat.position.y = h - 0.02;
  g.add(body, mat);
  const chrome = steel(0xd6d9df, { metalness: 0.95, roughness: 0.18 });
  const gap = K.mat(0x08080a, { roughness: 0.9 });
  const rows = [0.18, 0.18, 0.24, 0.3, 0.42]; // drawer heights from the top
  let y = h - 0.12;
  for (const rh of rows) {
    const line = K.box(w - 0.06, 0.02, 0.01, 0.005, gap, false);
    line.position.set(0, y - rh, d / 2 + 0.002);
    const bar = K.box(w - 0.4, 0.035, 0.05, 0.015, chrome);
    bar.position.set(0, y - 0.06, d / 2 + 0.03);
    g.add(line, bar);
    y -= rh;
  }
  const push = K.cyl(0.03, 0.03, d * 0.8, chrome, 12); // the side push bar
  push.rotation.x = Math.PI / 2;
  push.position.set(w / 2 + 0.1, h - 0.45, 0);
  for (const sz of [-1, 1]) {
    const arm = K.box(0.12, 0.03, 0.03, 0.01, chrome, false);
    arm.position.set(w / 2 + 0.05, h - 0.45, sz * d * 0.38);
    g.add(arm);
  }
  g.add(push);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const fork = K.box(0.1, 0.06, 0.1, 0.02, steel(0x2a2b30), false);
    fork.position.set(sx * (w / 2 - 0.15), wheelH, sz * (d / 2 - 0.15));
    const wheel = K.cyl(0.07, 0.07, 0.06, K.mat(0x111113, { roughness: 0.6 }), 16);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(sx * (w / 2 - 0.15), 0.07, sz * (d / 2 - 0.15));
    g.add(fork, wheel);
  }
  g.userData.top = h;
  return g;
}

/** a stack of old tyres */
function tyres(n = 3, { r = 0.62, tube = 0.22 } = {}) {
  const g = new THREE.Group();
  const rubber = K.mat(0x17171a, { roughness: 0.85 });
  const wall = K.mat(0x26262a, { roughness: 0.8 });
  for (let i = 0; i < n; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 18, 48), rubber);
    t.rotation.x = Math.PI / 2;
    t.position.set((i % 2) * 0.05, tube + i * tube * 1.9, (i % 2) * -0.04);
    t.castShadow = t.receiveShadow = true;
    const lip = new THREE.Mesh(new THREE.TorusGeometry(r - tube * 0.75, 0.025, 8, 48), wall);
    lip.rotation.x = Math.PI / 2;
    lip.position.copy(t.position).add(new THREE.Vector3(0, tube * 0.6, 0));
    g.add(t, lip);
  }
  return g;
}

/** an LED shop light hung on two chains */
function shopLight({ w = 2.6, drop = 1.4 } = {}) {
  const g = new THREE.Group();
  const body = K.box(w, 0.09, 0.26, 0.03, K.mat(0xe9eaee, { roughness: 0.4 }));
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.12, 0.16), K.glow(0xf1f6ff));
  strip.rotation.x = Math.PI / 2;
  strip.position.y = -0.047;
  g.add(body, strip);
  for (const sx of [-1, 1]) {
    const chain = K.cyl(0.012, 0.012, drop, steel(0x8a8d94), 6);
    chain.position.set(sx * (w / 2 - 0.25), drop / 2 + 0.04, 0);
    g.add(chain);
  }
  return g;
}

/** a clamp work lamp on the bench edge, its aluminium shade tipped toward the bench */
function clampLamp() {
  const g = new THREE.Group();
  const metal = steel(0x2a2b30);
  const clamp = K.box(0.12, 0.2, 0.16, 0.02, metal);
  clamp.position.y = 0.1;
  const arm1 = K.cyl(0.02, 0.02, 1.1, metal, 8);
  arm1.position.set(0, 0.7, 0);
  arm1.rotation.z = 0.22;
  const arm2 = K.cyl(0.02, 0.02, 0.8, metal, 8);
  arm2.position.set(0.28, 1.32, 0.12);
  arm2.rotation.z = -1.0;
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.32, 24, 1, true), K.mat(0xc9ccd2, { metalness: 0.85, roughness: 0.25, side: THREE.DoubleSide }));
  shade.position.set(0.62, 1.4, 0.2);
  shade.rotation.z = 0.7;
  const bulb = K.ball(0.08, K.glow(0xffe1b0), 12);
  bulb.position.set(0.68, 1.34, 0.2);
  g.add(clamp, arm1, arm2, shade, bulb);
  return g;
}

/** an open pizza box, two slices left */
function pizzaBox() {
  const g = new THREE.Group();
  const kraft = K.mat(0xc9a37a, { roughness: 0.85 });
  const base = K.box(0.9, 0.06, 0.9, 0.01, kraft);
  base.position.y = 0.03;
  const lid = K.box(0.9, 0.9, 0.03, 0.01, kraft);
  lid.position.set(0, 0.42, -0.5);
  lid.rotation.x = -0.25;
  g.add(base, lid);
  const slice = new THREE.Shape();
  slice.moveTo(0, 0); slice.lineTo(-0.16, 0.36); slice.quadraticCurveTo(0, 0.42, 0.16, 0.36); slice.closePath();
  const geo = new THREE.ExtrudeGeometry(slice, { depth: 0.03, bevelEnabled: false });
  for (const [x, z, a] of [[-0.12, 0.05, 0.4], [0.16, -0.1, 2.6]]) {
    const s = new THREE.Mesh(geo, K.mat(0xf0c35a, { roughness: 0.6 }));
    s.rotation.set(-Math.PI / 2, 0, a);
    s.position.set(x, 0.07, z);
    g.add(s);
    for (const [px, pz] of [[0.0, 0.12], [-0.05, 0.25], [0.06, 0.24]]) {
      const pep = K.cyl(0.035, 0.035, 0.012, K.mat(0xb3322b, { roughness: 0.55 }), 12);
      const v = new THREE.Vector2(px, pz).rotateAround(new THREE.Vector2(0, 0), a);
      pep.position.set(x + v.x, 0.105, z - v.y);
      g.add(pep);
    }
  }
  return g;
}

/** a computer mouse */
function mouse() {
  const m = K.box(0.12, 0.06, 0.2, 0.05, K.mat(0x1f1f23, { roughness: 0.4 }));
  m.position.y = 0.03;
  return m;
}

// ---------------- the set ----------------
export async function build({ renderer, scene, mood = "night" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.26;
  scene.background = new THREE.Color(0x12151d);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 18, h: 11, d: 18, backZ: BACK, floorMap: concreteTex(), floorTile: 4.5, floorRough: 0.62,
    wallMap: blockTex(), wallTile: 4.2, baseboard: false }));

  // ---- the door wall (right): the half-open door on the street at night, the cool light spilling in
  const door = garageDoor();
  K.at(door, DOOR.x, 0, BACK + 0.01);
  const spill = K.sunPatch({ w: 5.6, d: 3.2, color: 0x9dbcff, strength: 0.17 });
  spill.position.set(DOOR.x - 0.2, 0.025, BACK + 1.5);
  const shaft = K.lightShaft({ w: 4.6, h: 2.6, color: 0xa9c6ff, strength: 0.07 });
  shaft.position.set(DOOR.x - 0.3, 1.1, BACK + 1.2);
  shaft.rotation.set(-1.15, 0, 0);
  const tyreStack = tyres(3);
  K.at(tyreStack, 6.55, 0, BACK + 1.0, 0.3);
  set.add(door, spill, shaft, tyreStack);

  // ---- the bench wall (left): pegboard, workbench, three monitors, the neon
  const peg = pegboard({ w: 4.2, h: 2.6 });
  K.at(peg, -2.35, 3.95, BACK + 0.04);
  const bench = workbench({ w: 4.3, d: 1.3, h: 1.35 });
  K.at(bench, -2.35, 0, BACK + 0.72);
  const TOP = 1.35;
  const screens = [
    { tex: scenarioScreen(), x: -3.3, z: BACK + 0.58, ry: 0.22, w: 1.75, h: 1.0 }, // left of his body in his close-up
    { tex: promptScreen(), x: -2.05, z: BACK + 0.5, ry: 0, w: 1.4, h: 0.82 },
    { tex: historyScreen(), x: -0.95, z: BACK + 0.62, ry: -0.32, w: 1.45, h: 0.84 },
  ];
  for (const s of screens) set.add(K.at(K.monitor({ w: s.w, h: s.h, screen: s.tex }), s.x, TOP, s.z, s.ry));
  const screenWash = K.wallGlow({ w: 5.2, h: 2.6, color: "#8c6bff", strength: 0.32 });
  K.at(screenWash, -2.25, 2.7, BACK + 0.08);
  const kb = K.keyboard();
  K.at(kb, -2.25, TOP, BACK + 1.05, 0.02);
  const ms = mouse();
  K.at(ms, -1.45, TOP, BACK + 1.1);
  const can1 = K.can(0x232327, 0x9cf05a);
  K.at(can1, -0.7, TOP, BACK + 1.05);
  const can2 = K.can(0xe8e6e1, 0x3e8bff);
  K.at(can2, -0.48, TOP, BACK + 0.82, 0.5);
  const can3 = K.can(0x232327, 0x9cf05a); // one empty on its side
  K.at(can3, -4.0, TOP + 0.09, BACK + 1.08);
  can3.rotation.z = Math.PI / 2;
  const pizza = pizzaBox();
  K.at(pizza, -0.1, TOP, BACK + 1.0, -0.35); // the right end of the bench, next to the cans
  pizza.scale.setScalar(0.92);
  const lamp = clampLamp();
  K.at(lamp, -4.3, TOP, BACK + 0.6, 0.2);
  const neon = K.neonSign("SHIP IT", { color: "#38d9ff", w: 2.3, h: 0.78, font: "italic 800 150px 'Nohemi', Inter, sans-serif" });
  K.at(neon, -2.3, 5.75, BACK + 0.12);
  const neonWash = K.wallGlow({ w: 4.6, h: 2.4, color: "#38d9ff", strength: 0.36 });
  K.at(neonWash, -2.3, 5.75, BACK + 0.09);
  const light = shopLight({ w: 2.8, drop: 1.6 });
  K.at(light, -2.3, 8.4, BACK + 1.2); // above the hook title in the wide
  set.add(peg, bench, screenWash, kb, ms, can1, can2, can3, pizza, lamp, neon, neonWash, light);

  // ---- the coach's stool and Setty's chest
  const stool = shopStool({ seat: 0.52 });
  K.at(stool, -1.05, 0, -0.92, 0.6);
  const chest = toolChest({ w: 1.7, h: 2.0, d: 1.1 });
  K.at(chest, 2.05, 0, -2.0, -0.25);
  const wrench = K.box(0.06, 0.5, 0.025, 0.01, steel(0xa9adb5, { metalness: 0.85, roughness: 0.3 }));
  wrench.rotation.set(-Math.PI / 2, 0, 0.9);
  wrench.position.set(2.62, 2.03, -1.72);
  set.add(stool, chest, wrench);

  // ---- lights: Saturday night. A cool shop-light key from the front for the faces, the streetlight through the door
  // as the cool rim (it casts the shadows, toward the camera), the screens' violet and the neon's cyan as practicals,
  // the clamp lamp a small warm accent on the bench.
  set.add(new THREE.HemisphereLight(0x6f7fb0, 0x221d1a, 0.55));
  const key = new THREE.DirectionalLight(0xe8eeff, 1.3);
  key.position.set(-3, 9, 9);
  key.target.position.set(0.3, 2, -1.5);
  const rim = new THREE.DirectionalLight(0xa8c4ff, 2.3);
  rim.position.set(4.5, 5.5, -10);
  rim.target.position.set(0.2, 1, 0);
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
    shop: pl(0xeef3ff, 8, -2.3, 7.6, BACK + 1.6, 9),
    screens: pl(0x9a86ff, 6, -2.25, 2.4, BACK + 1.5, 5),
    lamp: pl(0xffc98e, 4, -3.7, 2.6, BACK + 1.0, 4),
    neon: pl(0x38d9ff, 5, -2.3, 5.8, BACK + 0.9, 6),
    street: pl(0xa9c6ff, 6, DOOR.x, 1.2, BACK + 0.4, 7),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(-0.85, 4.05, -0.72); // centre of head + beanie, seated
  const settyFace = new THREE.Vector3(2.05, 2.79, -1.9);
  return {
    key, rim, lights, root: set,
    coach: { x: -1.05, y: -0.46, z: -0.92, turn: 0.6, sit: 1 },
    setty: { x: 2.05, y: 1.7, z: -1.9, turn: -0.32, scale: 0.62 },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 },
    },
    shots: {
      wide: { pos: [0.4, 4.1, 15.2], at: [0.4, 2.5, -1.5], fov: 44 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 }),
    },
  };
}
