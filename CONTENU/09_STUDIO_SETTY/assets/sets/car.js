// Set "car": the coach's car parked outside a coworking at dusk (reel4, 10 calls 0 closed). A black SUV, nose out, in
// front of a glass coworking storefront (warm lights inside, a "cowork" neon, street lamps), the sky going violet to
// orange. We look in through the open windshield: he sits at the wheel between two discovery calls, phone on the dash
// mount, a coffee in the cup holder; Setty floats over the passenger seat. Black leather with orange stitching, an
// orange ambient strip, the dome light on.
// The car faces +z (the camera): the driver (US, left-hand drive) sits at +x, on the right of the frame.
// build() adds the car, the street and their lights to the scene and returns where the characters go and the shots.
import * as THREE from "three";
import * as K from "./kit.js";

const GROUND = -1.25; // the street; the cabin floor is y 0
const FACADE = -13; // the coworking storefront

// ---------------- painters ----------------
/** black quilted leather, orange stitching (seats) */
function leatherTex() {
  return K.canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = "#26272d";
    c.fillRect(0, 0, W, H);
    const R = K.rng(12);
    const img = c.getImageData(0, 0, W, H);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (R() - 0.5) * 9;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    c.putImageData(img, 0, 0);
    const s = W / 4;
    c.lineWidth = 3;
    for (let k = -4; k <= 8; k++) { // the diamond quilting: a soft crease and its stitch line
      for (const dir of [1, -1]) {
        c.strokeStyle = "rgba(0,0,0,0.45)";
        c.setLineDash([]);
        c.beginPath();
        c.moveTo(k * s, 0);
        c.lineTo(k * s + dir * H, H);
        c.stroke();
        c.strokeStyle = "rgba(255, 106, 43, 0.55)";
        c.setLineDash([7, 6]);
        c.beginPath();
        c.moveTo(k * s + 5, 0);
        c.lineTo(k * s + 5 + dir * H, H);
        c.stroke();
      }
    }
  }, { repeat: [2, 2] });
}

/** the dusk sky all around (a panorama on an open cylinder): indigo to violet to a pink-orange horizon, a far skyline
 *  with lit windows and red aviation lights, blurred city bokeh at the horizon */
function duskPanorama(c, W, H) {
  const R = K.rng(77);
  const HZ = H * 0.78;
  const sky = c.createLinearGradient(0, 0, 0, HZ);
  sky.addColorStop(0, "#151638");
  sky.addColorStop(0.4, "#3b2f6e");
  sky.addColorStop(0.72, "#a8558a");
  sky.addColorStop(0.9, "#f08a6a");
  sky.addColorStop(1, "#ffb878");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, HZ);
  c.fillStyle = "#1a1726";
  c.fillRect(0, HZ, W, H - HZ);
  for (let i = 0; i < 14; i++) { // thin clouds lit pink from below
    c.fillStyle = `rgba(255, 170, 170, ${0.08 + R() * 0.14})`;
    c.beginPath();
    c.ellipse(R() * W, H * (0.12 + R() * 0.32), W * (0.03 + R() * 0.06), 5 + R() * 9, 0, 0, Math.PI * 2);
    c.fill();
  }
  for (let i = 0; i < 40; i++) { // first stars
    c.fillStyle = `rgba(255, 255, 255, ${0.3 + R() * 0.5})`;
    c.fillRect(R() * W, R() * H * 0.25, 2, 2);
  }
  for (let layer = 0; layer < 2; layer++) { // the skyline: far hazy, then near and dark
    let x = -20;
    while (x < W) {
      const bw = 40 + R() * 110, bh = H * (layer ? 0.02 + R() * 0.09 : 0.015 + R() * 0.06);
      c.fillStyle = layer ? "#141326" : "rgba(88, 60, 112, 0.85)";
      c.fillRect(x, HZ - bh, bw, bh + 4);
      if (layer) {
        for (let wy = HZ - bh + 10; wy < HZ - 6; wy += 15) for (let wx = x + 6; wx < x + bw - 8; wx += 12)
          if (R() < 0.3) { c.fillStyle = R() < 0.78 ? "#ffcf86" : "#a9d4ff"; c.fillRect(wx, wy, 5, 7); }
        if (R() < 0.35) { c.fillStyle = "#ff3b3b"; c.beginPath(); c.arc(x + bw / 2, HZ - bh - 4, 3, 0, Math.PI * 2); c.fill(); }
      }
      x += bw + 3;
    }
  }
  for (let i = 0; i < 160; i++) { // city bokeh along the horizon: soft dots drawn as radial gradients (no canvas blur)
    const r = 6 + R() * 14, x = R() * W, y = HZ - 6 + R() * 40, a = 0.35 + R() * 0.4;
    const col = R() < 0.7 ? "255, 196, 120" : "255, 90, 80";
    const gr = c.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${col}, ${a})`);
    gr.addColorStop(0.55, `rgba(${col}, ${a * 0.6})`);
    gr.addColorStop(1, `rgba(${col}, 0)`);
    c.fillStyle = gr;
    c.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
}

/** the coworking seen through its glass front: warm wood wall, pendant lamps, long tables with laptops, plants */
function storefront(c, W, H) {
  const R = K.rng(23);
  const wall = c.createLinearGradient(0, 0, 0, H);
  wall.addColorStop(0, "#5a3a26");
  wall.addColorStop(0.55, "#c98a56");
  wall.addColorStop(1, "#7a5136");
  c.fillStyle = wall;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "rgba(60, 34, 18, 0.35)"; // wood slats on the back wall
  for (let x = 0; x < W; x += 26) c.fillRect(x, H * 0.08, 9, H * 0.6);
  c.fillStyle = "#2f2a2a"; // shelves with books
  for (const [x0, y0] of [[W * 0.06, H * 0.26], [W * 0.72, H * 0.3]]) {
    c.fillRect(x0, y0, W * 0.18, 8);
    c.fillRect(x0, y0 + H * 0.16, W * 0.18, 8);
    for (let k = 0; k < 14; k++) {
      c.fillStyle = ["#e9e1d3", "#8a6a52", "#3d4a5c", "#d9b38c"][Math.floor(R() * 4)];
      c.fillRect(x0 + 6 + k * (W * 0.012), y0 - 34 - R() * 16, W * 0.009, 34 + R() * 16);
    }
    c.fillStyle = "#2f2a2a";
  }
  const lamps = [0.14, 0.32, 0.5, 0.68, 0.86];
  for (const fx of lamps) { // pendant lamps and their pools of light
    const x = W * fx, y = H * 0.2;
    c.strokeStyle = "#1c1612";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x, y);
    c.stroke();
    const halo = c.createRadialGradient(x, y + 14, 0, x, y + 14, W * 0.1);
    halo.addColorStop(0, "rgba(255, 236, 190, 0.95)");
    halo.addColorStop(0.3, "rgba(255, 196, 120, 0.45)");
    halo.addColorStop(1, "rgba(255, 170, 90, 0)");
    c.fillStyle = halo;
    c.fillRect(x - W * 0.1, y - W * 0.1 + 14, W * 0.2, W * 0.2);
    c.fillStyle = "#1c1612";
    c.beginPath();
    c.moveTo(x - 30, y + 18);
    c.lineTo(x + 30, y + 18);
    c.lineTo(x + 14, y);
    c.lineTo(x - 14, y);
    c.fill();
    c.fillStyle = "#fff4d6";
    c.fillRect(x - 22, y + 16, 44, 5);
  }
  c.fillStyle = "#2a1d14"; // long tables, laptops glowing, chairs
  for (const [x0, w] of [[0.04, 0.4], [0.56, 0.4]]) {
    c.fillRect(W * x0, H * 0.66, W * w, 12);
    c.fillRect(W * x0 + 10, H * 0.66, 8, H * 0.3);
    c.fillRect(W * (x0 + w) - 18, H * 0.66, 8, H * 0.3);
    for (let k = 0; k < 4; k++) {
      const lx = W * x0 + 40 + k * (W * w - 80) / 3;
      c.fillStyle = "#b9c7d8";
      c.fillRect(lx - 26, H * 0.6, 52, 34);
      c.fillStyle = "#3a3f48";
      c.fillRect(lx - 30, H * 0.655, 60, 6);
      c.fillStyle = "#1d1814";
      c.beginPath();
      c.roundRect(lx - 22, H * 0.7, 44, 60, 10);
      c.fill();
      c.fillStyle = "#2a1d14";
    }
  }
  for (const fx of [0.03, 0.5, 0.97]) { // big plants
    c.fillStyle = "#1e3a27";
    for (let k = 0; k < 9; k++) {
      c.beginPath();
      c.ellipse(W * fx + (R() - 0.5) * 70, H * (0.52 + R() * 0.2), 22, 52, (R() - 0.5) * 1.6, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = "#e9e1d3";
    c.fillRect(W * fx - 34, H * 0.8, 68, H * 0.2);
  }
  const floor = c.createLinearGradient(0, H * 0.86, 0, H);
  floor.addColorStop(0, "rgba(40, 24, 14, 0.2)");
  floor.addColorStop(1, "rgba(40, 24, 14, 0.7)");
  c.fillStyle = floor;
  c.fillRect(0, H * 0.86, W, H * 0.14);
  c.fillStyle = "rgba(255, 255, 255, 0.07)"; // reflections on the glass
  for (let k = 0; k < 7; k++) {
    const x = R() * W;
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x + 70, 0);
    c.lineTo(x - 120, H);
    c.lineTo(x - 190, H);
    c.fill();
  }
}

/** the coworking's upper floor: a row of windows, some lit warm, some cool, some dark */
function upperWindows(c, W, H) {
  const R = K.rng(51);
  c.fillStyle = "#1d1c25";
  c.fillRect(0, 0, W, H);
  const n = 10, gw = W / n;
  for (let i = 0; i < n; i++) {
    const v = R();
    const col = v < 0.45 ? ["#ffd394", "#e39a58"] : v < 0.7 ? ["#bcd6ff", "#6e8fc4"] : ["#2a2c3a", "#1f2130"];
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, col[0]);
    g.addColorStop(1, col[1]);
    c.fillStyle = g;
    c.fillRect(i * gw + 10, 12, gw - 20, H - 24);
    if (v < 0.45 && R() < 0.6) { c.fillStyle = "rgba(40, 26, 18, 0.55)"; c.fillRect(i * gw + 10 + R() * gw * 0.5, H * 0.45, 26, H * 0.55); }
  }
}

/** a dark honeycomb grille (no brand) */
function grilleTex() {
  return K.canvasTex(512, 160, (c, W, H) => {
    c.fillStyle = "#0b0b0e";
    c.fillRect(0, 0, W, H);
    c.strokeStyle = "#2a2b31";
    c.lineWidth = 3;
    for (let y = 0, r = 0; y < H + 20; y += 18, r++) for (let x = (r % 2) * 14; x < W + 20; x += 28) {
      c.beginPath();
      for (let k = 0; k < 6; k++) c.lineTo(x + 10 * Math.cos((k * Math.PI) / 3), y + 10 * Math.sin((k * Math.PI) / 3));
      c.closePath();
      c.stroke();
    }
  });
}

/** a US vanity plate */
function plateTex(text) {
  return K.canvasTex(512, 256, (c, W, H) => {
    c.fillStyle = "#f4f1ea";
    c.beginPath();
    c.roundRect(4, 4, W - 8, H - 8, 22);
    c.fill();
    c.strokeStyle = "#1c2a4a";
    c.lineWidth = 8;
    c.stroke();
    c.fillStyle = "#c2412d";
    c.font = "italic 700 38px Inter, sans-serif";
    c.textAlign = "center";
    c.fillText("Florida", W / 2, 58);
    c.fillStyle = "#1c2a4a";
    c.font = "800 104px Inter, sans-serif";
    c.fillText(text, W / 2, 190, W - 60);
  });
}

/** the phone's screen (it faces him): the Calendly reminder of his next call */
function phoneTex() {
  return K.canvasTex(256, 512, (c, W, H) => {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#1c2340");
    g.addColorStop(1, "#0d1020");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#ffffff";
    c.font = "700 56px Inter, sans-serif";
    c.textAlign = "center";
    c.fillText("6:28", W / 2, 120);
    c.fillStyle = "rgba(255,255,255,0.92)";
    c.beginPath();
    c.roundRect(18, 190, W - 36, 96, 18);
    c.fill();
    c.fillStyle = "#006bff";
    c.beginPath();
    c.arc(56, 238, 20, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#16181d";
    c.font = "700 22px Inter, sans-serif";
    c.textAlign = "left";
    c.fillText("Discovery call", 86, 230);
    c.fillStyle = "#5b6070";
    c.font = "500 19px Inter, sans-serif";
    c.fillText("in 2 min", 86, 258);
  });
}

// ---------------- the car ----------------
function car() {
  const g = new THREE.Group();
  const paint = K.mat(0x111317, { metalness: 0.5, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.06 });
  const trim = K.mat(0x0a0a0c, { roughness: 0.5 });
  const chrome = K.mat(0xd2d6dc, { metalness: 1, roughness: 0.18 });
  const leather = K.mat(0xffffff, { map: leatherTex(), roughness: 0.48, clearcoat: 0.3, clearcoatRoughness: 0.4 });
  const leatherPlain = K.mat(0x24252b, { roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.4 });
  const dash = K.mat(0x17181c, { roughness: 0.62 });
  const headliner = K.mat(0x6f6c69, { roughness: 0.95 });
  const carpet = K.mat(0x121215, { roughness: 1 });
  const amber = K.glow(0xff6a2b);
  const put = (o, x, y, z, rx = 0, ry = 0, rz = 0) => { o.position.set(x, y, z); o.rotation.set(rx, ry, rz); g.add(o); return o; };

  // ---- body: sides, hood, front fascia, roof, pillars
  for (const s of [1, -1]) {
    put(K.box(0.3, 2.6, 12.4, 0.14, paint), s * 2.93, 0.65, 0.05);
    put(K.box(0.06, 0.05, 11.6, 0.02, chrome), s * 3.09, 1.9, 0); // the window-line chrome
    // A-pillar (leans back), B-pillar, C-pillar
    put(K.box(0.24, 2.9, 0.3, 0.08, paint), s * 2.7, 3.17, 1.47, -0.55);
    put(K.box(0.24, 2.5, 0.34, 0.08, paint), s * 2.74, 3.18, -1.95);
    put(K.box(0.24, 2.5, 0.9, 0.08, paint), s * 2.74, 3.18, -4.25);
    // the inner door panel: leather insert, armrest, the orange ambient strip
    put(K.box(0.14, 1.9, 5.8, 0.06, dash), s * 2.72, 0.98, -1.75);
    put(K.box(0.04, 0.7, 4.6, 0.03, leatherPlain), s * 2.64, 1.2, -1.6);
    put(K.box(0.3, 0.14, 1.6, 0.06, leatherPlain), s * 2.56, 1.05, -0.9);
    put(K.box(0.025, 0.03, 5.2, 0.01, amber, false), s * 2.63, 1.72, -1.6);
    // side mirror on its arm
    put(K.box(0.6, 0.4, 0.5, 0.12, paint), s * 3.32, 2.22, 1.75, 0, s * 0.12);
    put(K.box(0.4, 0.08, 0.16, 0.03, trim), s * 3.05, 2.05, 1.8);
    put(K.box(0.04, 0.06, 0.32, 0.02, amber, false), s * 3.5, 2.18, 1.93); // the indicator
  }
  put(K.box(5.86, 0.32, 4.4, 0.14, paint), 0, 1.6, 4.35, 0.07); // hood
  put(K.box(0.05, 0.03, 3.6, 0.01, K.mat(0x23262c, { roughness: 0.3 })), 0.9, 1.78, 4.3, 0.07); // hood creases
  put(K.box(0.05, 0.03, 3.6, 0.01, K.mat(0x23262c, { roughness: 0.3 })), -0.9, 1.78, 4.3, 0.07);
  put(K.box(5.92, 2.2, 0.5, 0.18, paint), 0, 0.45, 6.4); // front fascia
  const grille = put(new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.95), K.mat(0xffffff, { map: grilleTex(), roughness: 0.4 })), 0, 0.72, 6.66);
  grille.receiveShadow = true;
  put(K.box(3.5, 0.06, 0.06, 0.02, chrome), 0, 1.22, 6.67);
  put(K.box(4.6, 0.42, 0.1, 0.08, trim), 0, -0.25, 6.66); // lower intake
  for (const s of [1, -1]) { // LED headlights and their daytime "L"
    put(K.box(1.45, 0.1, 0.06, 0.03, K.glow(0xeef6ff), false), s * 1.95, 1.32, 6.67);
    put(K.box(0.1, 0.42, 0.06, 0.03, K.glow(0xeef6ff), false), s * 2.62, 1.14, 6.67);
    put(K.box(1.5, 0.36, 0.04, 0.06, K.mat(0x1a1d22, { metalness: 0.3, roughness: 0.15, clearcoat: 1 })), s * 1.95, 1.16, 6.65);
  }
  const plate = put(new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.62), K.mat(0xffffff, { map: plateTex("BOOKED"), roughness: 0.5 })), 0, 0.22, 6.68);
  plate.receiveShadow = true;
  put(K.box(5.4, 0.26, 5.5, 0.1, paint), 0, 4.55, -1.95); // roof
  put(K.box(5.3, 0.26, 0.34, 0.08, paint), 0, 4.44, 0.74); // windshield header
  put(K.box(5.2, 0.06, 5.3, 0.03, headliner), 0, 4.4, -2.0);
  put(K.box(5.4, 2.6, 0.26, 0.1, paint), 0, 1.3, -4.7); // rear panel under the rear window
  put(K.box(5.3, 0.2, 0.3, 0.06, paint), 0, 4.3, -4.65);
  for (const s of [1, -1]) { // wheels (dark alloys) under the body
    for (const z of [4.55, -3.9]) {
      const tire = put(K.cyl(1.0, 1.0, 0.8, K.mat(0x0e0e10, { roughness: 0.85 }), 48), s * 2.72, GROUND + 1.0, z, 0, 0, Math.PI / 2);
      tire.castShadow = true;
      put(K.cyl(0.62, 0.62, 0.05, K.mat(0x2b2d33, { metalness: 0.8, roughness: 0.3 }), 40), s * 3.13, GROUND + 1.0, z, 0, 0, Math.PI / 2);
    }
  }
  // ---- cabin: floor, dashboard, wheel, console, seats
  put(K.box(5.4, 0.12, 6.6, 0.03, carpet), 0, -0.06, -1.6);
  put(K.box(5.5, 1.0, 1.4, 0.2, dash), 0, 1.3, 1.55);
  put(K.soft(5.5, 0.2, 1.5, dash, { P: 4, puff: 0.05 }), 0, 1.83, 1.62);
  put(K.box(1.5, 0.3, 0.6, 0.13, dash), 1.35, 1.95, 1.05); // instrument hood
  put(K.box(5.3, 0.05, 0.05, 0.02, chrome), 0, 1.47, 0.84); // metal trim
  put(K.box(5.1, 0.03, 0.03, 0.01, amber, false), 0, 1.37, 0.84); // ambient strip
  // steering wheel, tilted toward him
  const wheel = new THREE.Group();
  const wl = K.mat(0x141417, { roughness: 0.55, clearcoat: 0.2 });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.075, 18, 72), wl);
  rim.castShadow = true;
  const hub = K.cyl(0.21, 0.24, 0.14, wl);
  hub.rotation.x = Math.PI / 2;
  const badge = K.cyl(0.08, 0.08, 0.02, K.mat(0xff611d, { roughness: 0.3, clearcoat: 1 }));
  badge.rotation.x = Math.PI / 2;
  badge.position.z = -0.08;
  wheel.add(rim, hub, badge);
  for (const [a, l] of [[0, 0.42], [Math.PI, 0.42], [-Math.PI / 2, 0.42]]) {
    const sp = K.box(l, 0.1, 0.06, 0.03, wl);
    sp.position.set(Math.cos(a) * 0.38, Math.sin(a) * 0.38, 0);
    sp.rotation.z = a;
    wheel.add(sp);
  }
  const col = K.cyl(0.09, 0.12, 0.9, wl);
  col.rotation.x = Math.PI / 2;
  col.position.z = 0.48;
  wheel.add(col);
  put(wheel, 1.35, 2.0, 0.62, 0.42);
  // centre console: armrest, gear knob, a takeaway coffee in the cup holder
  put(K.box(0.66, 1.0, 2.6, 0.12, dash), 0, 0.5, -0.45);
  put(K.soft(0.64, 0.2, 1.0, leatherPlain, { P: 3.4, puff: 0.12 }), 0, 1.08, -1.15);
  put(K.box(0.14, 0.24, 0.14, 0.06, chrome), 0.1, 1.12, 0.45);
  put(K.cyl(0.15, 0.12, 0.5, K.mat(0xf2eee8, { roughness: 0.7 })), -0.12, 1.25, 0.05);
  put(K.cyl(0.155, 0.155, 0.16, K.mat(0xff611d, { roughness: 0.8 })), -0.12, 1.2, 0.05);
  put(K.cyl(0.16, 0.16, 0.05, K.mat(0x1b1b1e, { roughness: 0.5 })), -0.12, 1.52, 0.05);
  // the two front seats (the coach at +x, Setty at -x) and the rear bench
  const seat = (x) => {
    put(K.box(1.3, 0.32, 1.4, 0.08, trim), x, 0.12, -0.7);
    put(K.soft(1.5, 0.4, 1.7, leather, { P: 3.2, puff: 0.1, seed: 3 }), x, 0.44, -0.66);
    for (const s of [1, -1]) put(K.soft(0.3, 0.52, 1.6, leatherPlain, { P: 3, puff: 0.1 }), x + s * 0.78, 0.5, -0.7);
    put(K.soft(1.5, 2.45, 0.5, leather, { P: 3.4, puff: 0.08, seed: 5 }), x, 1.85, -1.68, -0.12);
    for (const s of [1, -1]) put(K.soft(0.3, 2.2, 0.62, leatherPlain, { P: 3, puff: 0.1 }), x + s * 0.76, 1.75, -1.6, -0.12);
    put(K.soft(0.95, 0.62, 0.36, leatherPlain, { P: 3.4, puff: 0.12, seed: 7 }), x, 3.55, -2.02, -0.1);
    for (const s of [1, -1]) put(K.cyl(0.03, 0.03, 0.4, chrome, 12), x + s * 0.26, 3.15, -1.98);
  };
  seat(1.35);
  seat(-1.35);
  put(K.soft(5.0, 0.42, 1.6, leather, { P: 3.4, puff: 0.08, seed: 9 }), 0, 0.42, -3.15);
  put(K.soft(5.0, 2.2, 0.5, leather, { P: 3.4, puff: 0.06, seed: 11 }), 0, 1.6, -3.98, -0.16);
  for (const x of [-1.6, 1.6]) put(K.soft(0.9, 0.55, 0.32, leatherPlain, { P: 3.4, puff: 0.12 }), x, 2.98, -4.22, -0.1);
  // his gym bag on the back seat
  put(K.soft(1.5, 0.72, 0.8, K.mat(0x1b1c20, { roughness: 0.7 }), { P: 2.6, puff: 0.18, wrinkle: 0.02, seed: 4 }), -1.4, 1.0, -3.05, 0, 0.2);
  put(K.box(1.2, 0.08, 0.02, 0.02, K.mat(0xff611d, { roughness: 0.6 })), -1.38, 1.1, -2.64, 0, 0.2);
  // rearview mirror (small and off-centre: it stays clear of his beanie and of Setty's dots in the close-ups), dome light
  put(K.box(0.06, 0.24, 0.06, 0.02, trim), -0.25, 4.26, 0.82);
  put(K.box(0.8, 0.26, 0.1, 0.09, trim), -0.25, 4.1, 0.82);
  put(K.box(0.6, 0.05, 0.32, 0.03, K.glow(0xfff1d8), false), 0, 4.36, 0.25);
  // the phone on its dash mount (screen toward him, back and orange case to the camera)
  const phone = new THREE.Group();
  phone.add(K.box(0.44, 0.84, 0.05, 0.06, K.mat(0xff611d, { roughness: 0.4, clearcoat: 0.6 })));
  const scrMat = K.glow(0xffffff, { map: phoneTex() });
  scrMat.color.setScalar(0.85);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.76), scrMat);
  scr.position.z = -0.03;
  scr.rotation.y = Math.PI;
  const lens = K.box(0.14, 0.14, 0.03, 0.03, K.mat(0x111114, { roughness: 0.2 }));
  lens.position.set(-0.11, 0.3, 0.035);
  phone.add(scr, lens);
  put(phone, 2.18, 2.38, 1.2, -0.1, 0.39);
  put(K.cyl(0.03, 0.03, 0.3, trim, 10), 2.18, 1.98, 1.26);
  put(K.box(0.22, 0.08, 0.2, 0.03, trim), 2.18, 1.86, 1.28);
  g.userData.phoneScreen = scrMat;
  return g;
}

// ---------------- the street and the coworking ----------------
function street() {
  const g = new THREE.Group();
  const put = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; g.add(o); return o; };
  // wet asphalt with parking lines
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 90), K.mat(0x17181d, { roughness: 0.32, clearcoat: 0.5, clearcoatRoughness: 0.3 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, GROUND, -10);
  ground.receiveShadow = true;
  g.add(ground);
  for (const x of [-4.1, 4.1]) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 13), K.mat(0xd9d6cf, { roughness: 0.6 }));
    line.rotation.x = -Math.PI / 2;
    line.position.set(x, GROUND + 0.01, -2);
    line.receiveShadow = true;
    g.add(line);
  }
  // sidewalk, curb, the warm spill of the storefront on it
  put(K.box(60, 0.26, 4.6, 0.04, K.mat(0x5d5b60, { roughness: 0.85 })), 0, GROUND + 0.13, FACADE + 2.3);
  put(K.box(60, 0.3, 0.26, 0.05, K.mat(0x8b8890, { roughness: 0.8 })), 0, GROUND + 0.15, FACADE + 4.6);
  const spill = K.sunPatch({ w: 18, d: 4.4, color: 0xffb36a, strength: 0.42 });
  spill.position.set(0, GROUND + 0.28, FACADE + 2.4);
  g.add(spill);
  // the coworking: a dark facade, the glass storefront, the upper floor, the neon
  const wallM = K.mat(0x26252d, { roughness: 0.85 });
  const Y0 = GROUND + 0.26, SH = 5.4, SW = 16;
  put(K.box(30, 9.5, 0.6, 0.04, wallM), 0, Y0 + 9.5 / 2, FACADE - 0.6);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), K.glow(0xffffff, { map: K.canvasTex(2048, Math.round((2048 * SH) / SW), storefront) }));
  front.material.color.setScalar(0.92);
  put(front, 0, Y0 + SH / 2, FACADE - 0.28);
  const frameM = K.mat(0x0f0f12, { roughness: 0.4, metalness: 0.4 });
  for (let i = 0; i <= 6; i++) put(K.box(0.14, SH, 0.2, 0.02, frameM), -SW / 2 + (i * SW) / 6, Y0 + SH / 2, FACADE - 0.2);
  put(K.box(SW + 0.2, 0.16, 0.22, 0.02, frameM), 0, Y0 + SH, FACADE - 0.2);
  put(K.box(SW + 0.2, 0.12, 0.22, 0.02, frameM), 0, Y0 + 4.1, FACADE - 0.2);
  put(K.box(0.05, 1.3, 0.08, 0.02, K.mat(0xc9ccd2, { metalness: 1, roughness: 0.25 })), 2.95, Y0 + 1.6, FACADE - 0.08);
  const upper = new THREE.Mesh(new THREE.PlaneGeometry(26, 2.4), K.glow(0xffffff, { map: K.canvasTex(2048, 190, upperWindows) }));
  upper.material.color.setScalar(0.8);
  put(upper, 0, Y0 + 7.5, FACADE - 0.28);
  const neon = K.neonSign("cowork", { color: "#ff6a3d", w: 4.2, h: 1.4, font: "italic 800 190px 'Nohemi', Inter, sans-serif" });
  put(neon, 2.6, Y0 + 6.05, FACADE + 0.05);
  const wash = K.wallGlow({ w: 7, h: 3, color: "#ff6a3d", strength: 0.45 });
  put(wash, 2.6, Y0 + 6.05, FACADE + 0.02);
  for (const x of [-9.4, 9.4]) { // planters by the glass
    const p = K.plant({ h: 2.8, pot: 0x2e2d33, n: 10, seed: x > 0 ? 3 : 8 });
    put(p, x, Y0, FACADE + 1.0);
  }
  // street lamps: pole, arm, the lamp head and its halo
  const lamps = [];
  for (const [x, z] of [[-7.2, FACADE + 4.0], [8.0, FACADE + 4.0]]) {
    const pm = K.mat(0x1b1c21, { roughness: 0.5, metalness: 0.5 });
    put(K.cyl(0.1, 0.14, 9, pm, 16), x, GROUND + 4.5, z);
    put(K.box(1.6, 0.1, 0.1, 0.03, pm), x - Math.sign(x) * 0.7, GROUND + 8.95, z);
    put(K.box(0.7, 0.16, 0.36, 0.06, K.glow(0xffe0a8), false), x - Math.sign(x) * 1.4, GROUND + 8.85, z);
    const halo = K.wallGlow({ w: 4.5, h: 4.5, color: "#ffd08a", strength: 0.55 });
    put(halo, x - Math.sign(x) * 1.4, GROUND + 8.7, z + 0.3);
    lamps.push([x - Math.sign(x) * 1.4, GROUND + 8.4, z]);
  }
  // the sky all around (open cylinder, seen from inside)
  const tex = K.canvasTex(4096, 1024, duskPanorama);
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.x = -1;
  const dome = new THREE.Mesh(new THREE.CylinderGeometry(46, 46, 60, 96, 1, true, Math.PI * 0.32, Math.PI * 1.36),
    K.glow(0xffffff, { map: tex, side: THREE.BackSide, depthWrite: false }));
  dome.position.set(0, GROUND + 60 * 0.38 - 2, -4);
  dome.renderOrder = -1;
  g.add(dome);
  return { g, lamps };
}

export async function build({ renderer, scene, mood = "dusk" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.32;
  scene.background = new THREE.Color(0x1a1830);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  const body = car();
  const { g: outside, lamps } = street();
  set.add(body, outside);

  // ---- lights: dusk. A soft violet sky fill, a front key through the windshield (the city's glow), the warm street
  // lamp and storefront as the rim from his side (it casts the shadows), the dome light above them, the phone's cool
  // glow on his face, the orange ambient strip low in the cabin.
  set.add(new THREE.HemisphereLight(0x9aa2ff, 0x3a2a24, 0.9));
  const key = new THREE.DirectionalLight(0xffeedd, 1.5);
  key.position.set(-2.5, 7.5, 12);
  key.target.position.set(0.2, 2.6, -0.6);
  const rim = new THREE.DirectionalLight(0xffb878, 2.4);
  rim.position.set(11, 6.5, -7);
  rim.target.position.set(0, 2.2, -0.6);
  rim.castShadow = true;
  rim.shadow.mapSize.set(2048, 2048);
  rim.shadow.radius = 6;
  rim.shadow.bias = -0.0005;
  Object.assign(rim.shadow.camera, { left: -8, right: 8, top: 8, bottom: -6, near: 1, far: 34 });
  const fill = new THREE.DirectionalLight(0xb9a6ff, 0.9); // the violet sky from the passenger side
  fill.position.set(-10, 6, -3);
  fill.target.position.set(-1, 2.2, -0.6);
  set.add(key, key.target, rim, rim.target, fill, fill.target);
  const pl = (color, intensity, x, y, z, distance = 6) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lights = {
    dome: pl(0xffe2c0, 7, 0, 4.0, 0.2, 6.5),
    phone: pl(0xbcd4ff, 2.2, 1.9, 2.5, 0.75, 2.6),
    ambientR: pl(0xff6a2b, 2.2, 2.3, 1.5, -0.6, 2.6),
    ambientL: pl(0xff6a2b, 2.2, -2.3, 1.5, -0.6, 2.6),
    neon: pl(0xff6a3d, 14, 2.6, GROUND + 5.6, FACADE + 1.5, 10),
    store: pl(0xffc58a, 16, 0, GROUND + 3, FACADE + 2.5, 14),
    lamp1: pl(0xffd08a, 10, ...lamps[0], 12),
    lamp2: pl(0xffd08a, 10, ...lamps[1], 12),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(1.35, 3.5, -0.7);
  const settyFace = new THREE.Vector3(-1.35, 2.5, -0.7);
  return {
    key, rim, lights, root: set, phoneScreen: body.userData.phoneScreen,
    coach: { x: 1.35, y: -0.42, z: -0.78, turn: -0.32, sit: 1, phone: 0, spread: 0.08 },
    setty: { x: -1.35, y: 1.2, z: -0.72, turn: 0.38, scale: 0.72 },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: -0.3, pitch: 0.14, y: 760 },
      setty: { target: settyFace, dist: 11.5, yaw: 0.32, pitch: 0.26, y: 820 },
    },
    shots: {
      wide: { pos: [0.1, 5.3, 17.5], at: [0.05, 2.6, -1.0], fov: 40 },
      coach: K.shot(coachHead, { dist: 12, yaw: -0.3, pitch: 0.14, y: 760 }),
      setty: K.shot(settyFace, { dist: 11.5, yaw: 0.32, pitch: 0.26, y: 820 }),
    },
  };
}
