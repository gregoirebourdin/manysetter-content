// Set "livingroom": the coach's living room late at night, day 6 of his 5-day challenge (reel6). A big teal velvet couch
// facing the camera, the blue glow of the TV (behind the camera) on their faces, the ring light still set up behind the
// couch and still on (he went live from there five days in a row), an open pizza box and energy cans on the coffee table,
// his challenge plan taped on the wall (DAY 1 to DAY 5 crossed out), a globe lamp, the city at night through a big window.
// He slumps on the couch, phone in hand; Setty sits on the right armrest.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4;

// ---- the furniture of this set (kept here: only this reel uses it)
/** a low 3-seat velvet lounge couch (low so the coach's feet reach the floor), seat cushions, back cushions, chunky
 *  arms, short brass feet; front toward +z */
function couch({ w = 5.4, d = 1.75, color = 0x1f5a5c, sheen = 0x8fd3cf } = {}) {
  const g = new THREE.Group();
  const velvet = K.mat(color, { roughness: 0.82, sheen: 1, sheenColor: new THREE.Color(sheen), sheenRoughness: 0.45 });
  const brass = K.mat(0xd9a94a, { metalness: 1, roughness: 0.3 });
  const arm = 0.75, legH = 0.08, baseTop = 0.3, cushH = 0.24, seat = baseTop + cushH, armTop = 1.03;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = K.cyl(0.06, 0.045, legH, brass, 16);
    leg.position.set(sx * (w / 2 - 0.25), legH / 2, sz * (d / 2 - 0.2));
    g.add(leg);
  }
  const base = K.box(w, baseTop - legH, d, 0.08, velvet);
  base.position.set(0, (baseTop + legH) / 2, 0);
  const backBlock = K.box(w - 0.1, 1.2, 0.45, 0.16, velvet);
  backBlock.position.set(0, baseTop + 0.6, -d / 2 + 0.24);
  g.add(base, backBlock);
  for (const sx of [-1, 1]) {
    const a = K.box(arm, armTop - legH, d, 0.28, velvet);
    a.position.set(sx * (w / 2 - arm / 2), (armTop + legH) / 2, 0);
    g.add(a);
  }
  const inner = w - 2 * arm, n = 3, cw = inner / n;
  for (let i = 0; i < n; i++) {
    const x = -inner / 2 + cw * (i + 0.5);
    const cushion = K.soft(cw - 0.03, cushH, d - 0.5, velvet, { P: 3.4, puff: 0.22, wrinkle: 0.012, seed: 40 + i });
    cushion.position.set(x, baseTop + cushH / 2, 0.22);
    const back = K.soft(cw - 0.05, 0.95, 0.5, velvet, { P: 3.0, puff: 0.24, wrinkle: 0.015, seed: 50 + i });
    back.position.set(x, seat + 0.45, -d / 2 + 0.68);
    back.rotation.x = -0.14;
    g.add(cushion, back);
  }
  // two throw pillows on the left seat, a knit throw over the left arm
  const pill = (col, x, rz, seed) => {
    const p = K.soft(0.95, 0.9, 0.3, K.mat(col, { roughness: 0.95, sheen: 0.7, sheenColor: new THREE.Color(0xffffff) }), { P: 2.6, puff: 0.35, seed });
    p.position.set(x, seat + 0.42, -d / 2 + 1.0);
    p.rotation.set(-0.25, 0, rz);
    g.add(p);
  };
  pill(0xe9e1d3, -inner / 2 + 0.5, 0.18, 61);
  pill(0xd99a3a, -inner / 2 + 0.95, -0.1, 62);
  const knit = K.mat(0xe7e0d4, { roughness: 0.97, sheen: 0.6, sheenColor: new THREE.Color(0xffffff) });
  const thr = K.soft(arm + 0.12, 0.12, 1.2, knit, { P: 3, puff: 0.25, wrinkle: 0.02, seed: 63 });
  thr.position.set(-w / 2 + arm / 2, armTop + 0.04, 0.12);
  g.add(thr);
  g.userData = { seat, armTop, armX: w / 2 - arm / 2, front: d / 2 };
  return g;
}

/** a low walnut coffee table on black legs */
function coffeeTable({ w = 2.6, d = 1.25, h = 0.55 } = {}) {
  const g = new THREE.Group();
  const top = K.box(w, 0.1, d, 0.04, K.mat(0x5a3a26, { roughness: 0.72, envMapIntensity: 0.25, map: K.woodTex({ base: "#6b4329", planks: 3, seed: 8 }) }));
  top.position.y = h - 0.05;
  const metal = K.mat(0x17171a, { roughness: 0.35, metalness: 0.6 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = K.box(0.08, h - 0.1, 0.08, 0.02, metal);
    leg.position.set(sx * (w / 2 - 0.15), (h - 0.1) / 2, sz * (d / 2 - 0.15));
    g.add(leg);
  }
  const shelf = K.box(w - 0.3, 0.05, d - 0.3, 0.02, metal);
  shelf.position.y = 0.14;
  g.add(top, shelf);
  g.userData.top = h;
  return g;
}

/** an open pizza box, three slices left (the rest is gone), pepperoni; the lid is thrown open, almost flat */
function pizzaBox({ s = 1.05 } = {}) {
  const g = new THREE.Group();
  const card = K.mat(0xc79a63, { roughness: 0.9 });
  const inside = K.mat(0xe2c79e, { roughness: 0.95 });
  const bottom = K.box(s, 0.03, s, 0.01, inside);
  bottom.position.y = 0.015;
  g.add(bottom);
  for (const [x, z, bw, bd] of [[0, -s / 2, s, 0.03], [0, s / 2, s, 0.03], [-s / 2, 0, 0.03, s], [s / 2, 0, 0.03, s]]) {
    const wall = K.box(bw, 0.13, bd, 0.008, card);
    wall.position.set(x, 0.065, z);
    g.add(wall);
  }
  // the lid, hinged on the back edge, open and leaning back; a grease spot and the pizzeria's orange stamp inside
  const lidTex = K.canvasTex(256, 256, (c, W, H) => {
    c.fillStyle = "#e2c79e";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "rgba(150, 95, 40, 0.28)";
    c.beginPath();
    c.ellipse(W * 0.62, H * 0.58, 46, 34, 0.4, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "rgba(150, 95, 40, 0.18)";
    c.beginPath();
    c.ellipse(W * 0.32, H * 0.36, 22, 16, 0, 0, Math.PI * 2);
    c.fill();
  });
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.13, -s / 2);
  const lid = K.box(s, 0.025, s, 0.01, K.mat(0xffffff, { map: lidTex, roughness: 0.95 }));
  lid.position.set(0, 0, s / 2);
  hinge.add(lid);
  hinge.rotation.x = -2.6;
  g.add(hinge);
  // the pizza: crust, cheese and pepperoni on 3 of 8 slices
  const r = s * 0.44, slice = (Math.PI * 2) / 8;
  const crust = K.mat(0xd0893a, { roughness: 0.7 });
  const cheese = K.mat(0xf3c24e, { roughness: 0.45, clearcoat: 0.3 });
  const pep = K.mat(0xb8321f, { roughness: 0.5, clearcoat: 0.4 });
  const R = K.rng(77);
  for (let i = 0; i < 3; i++) {
    const a0 = 0.4 + i * slice;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.05, 16, 1, false, a0, slice - 0.02), crust);
    base.position.y = 0.055;
    const top = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.06, r - 0.06, 0.02, 16, 1, false, a0 + 0.01, slice - 0.04), cheese);
    top.position.y = 0.085;
    base.castShadow = top.castShadow = true;
    g.add(base, top);
    for (let k = 0; k < 2; k++) {
      const a = a0 + slice * (0.3 + R() * 0.4), rr = r * (0.35 + k * 0.3);
      const p = K.cyl(0.055, 0.055, 0.02, pep, 16);
      p.position.set(Math.sin(a) * rr, 0.1, Math.cos(a) * rr);
      g.add(p);
    }
  }
  return g;
}

/** a globe lamp on a tall brass stand (floor lamp); add its PointLight in the set */
function floorLamp({ h = 3.4, color = 0xffc58a } = {}) {
  const g = new THREE.Group();
  const brass = K.mat(0xd9a94a, { metalness: 1, roughness: 0.3 });
  const base = K.cyl(0.3, 0.34, 0.06, brass);
  base.position.y = 0.03;
  const pole = K.cyl(0.03, 0.03, h, brass, 16);
  pole.position.y = h / 2;
  const globe = K.ball(0.36, K.glow(color), 32);
  globe.castShadow = false;
  globe.position.y = h + 0.3;
  g.add(base, pole, globe);
  return g;
}

/** his challenge plan, taped on the wall: DAY 1 to DAY 5 crossed out in orange marker, DAY 6 circled in red */
function challengePlan(c, W, H) {
  c.fillStyle = "#f6f2ea";
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#1f2433";
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.font = "800 62px Inter, sans-serif";
  c.fillText("5-DAY", 44, 84);
  c.fillText("CHALLENGE", 44, 150);
  c.fillStyle = "#ff611d";
  c.fillRect(44, 192, W - 88, 8);
  const days = ["DAY 1", "DAY 2", "DAY 3", "DAY 4", "DAY 5"];
  c.font = "700 54px Inter, sans-serif";
  days.forEach((d, i) => {
    const y = 268 + i * 82;
    c.fillStyle = "#1f2433";
    c.fillText(d, 60, y);
    c.strokeStyle = "#ff611d";
    c.lineWidth = 9;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(48, y + 4);
    c.lineTo(250, y - 6);
    c.stroke();
    c.fillStyle = "#1f9d55"; // a check
    c.beginPath();
    c.moveTo(300, y);
    c.lineTo(318, y + 20);
    c.lineTo(356, y - 22);
    c.lineWidth = 10;
    c.strokeStyle = "#1f9d55";
    c.stroke();
  });
  const y6 = 268 + 5 * 82 + 18;
  c.fillStyle = "#1f2433";
  c.font = "800 58px Inter, sans-serif";
  c.fillText("DAY 6", 60, y6);
  c.strokeStyle = "#e5484d";
  c.lineWidth = 8;
  c.beginPath();
  c.ellipse(140, y6, 120, 52, -0.05, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = "#e5484d";
  c.font = "800 58px Inter, sans-serif";
  c.fillText("???", 300, y6);
  // two strips of tape
  c.fillStyle = "rgba(240, 225, 170, 0.85)";
  c.save();
  c.translate(W * 0.2, 14);
  c.rotate(-0.12);
  c.fillRect(-60, -18, 120, 36);
  c.restore();
  c.save();
  c.translate(W * 0.8, 14);
  c.rotate(0.1);
  c.fillRect(-60, -18, 120, 36);
  c.restore();
}

/** the city at night, from a high floor: a deep sky, a warm haze on the horizon, towers with lit windows and red
 *  aviation lights, a few stars */
function nightCity(c, W, H, R) {
  const sky = c.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#070a1c");
  sky.addColorStop(0.5, "#1b1846");
  sky.addColorStop(0.82, "#4a2d63");
  sky.addColorStop(1, "#c8583a");
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) {
    c.fillStyle = `rgba(255, 255, 255, ${0.3 + R() * 0.5})`;
    c.fillRect(R() * W, R() * H * 0.45, 2, 2);
  }
  const haze = c.createLinearGradient(0, H * 0.6, 0, H);
  haze.addColorStop(0, "rgba(255, 140, 80, 0)");
  haze.addColorStop(1, "rgba(255, 150, 90, 0.45)");
  for (let layer = 0; layer < 3; layer++) {
    let x = -30;
    const far = layer === 0, mid = layer === 1;
    while (x < W) {
      const bw = (far ? 40 : mid ? 70 : 110) + R() * (far ? 50 : 90);
      const bh = H * (far ? 0.2 + R() * 0.25 : mid ? 0.25 + R() * 0.35 : 0.18 + R() * 0.3);
      c.fillStyle = far ? "#2a2350" : mid ? "#171634" : "#0b0c1c";
      c.fillRect(x, H - bh, bw, bh);
      if (!far) {
        const step = mid ? 18 : 24;
        for (let wy = H - bh + 12; wy < H - 8; wy += step) for (let wx = x + 8; wx < x + bw - 10; wx += step - 4)
          if (R() < (mid ? 0.3 : 0.4)) { c.fillStyle = R() < 0.75 ? "#ffcf7a" : "#a8d8ff"; c.fillRect(wx, wy, mid ? 6 : 9, mid ? 8 : 12); }
      }
      if (R() < 0.35) { // a red aviation light on the roof
        c.fillStyle = "#ff3b30";
        c.beginPath();
        c.arc(x + bw / 2, H - bh - 4, far ? 3 : 4.5, 0, Math.PI * 2);
        c.fill();
      }
      x += bw + (far ? 4 : 10);
    }
    if (layer === 0) { c.fillStyle = haze; c.fillRect(0, H * 0.6, W, H * 0.4); }
  }
}

export async function build({ renderer, scene, mood = "night" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.32;
  scene.background = new THREE.Color(0x10131f);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 18, h: 11, d: 18, wall: "#232a40", floor: "#7d5a3e", backZ: BACK }));

  // ---- the back wall: the big window on the city (right), his challenge plan (left)
  const win = K.cityWindow({ w: 4.2, h: 3.4, view: nightCity, blinds: 0, panes: [3, 1], frame: 0x15161b, bright: 0.95, seed: 63 });
  K.at(win, 1.75, 4.45, BACK + 0.02);
  const winGlow = K.wallGlow({ w: 7.5, h: 5.5, color: "#5a4bd6", strength: 0.38 });
  K.at(winGlow, 1.75, 4.3, BACK + 0.06);
  const plan = K.poster({ w: 1.25, h: 1.65, draw: challengePlan, frame: 0xf6f2ea });
  K.at(plan, -1.55, 5.0, BACK + 0.05);
  plan.rotation.z = 0.04;
  // the TV is behind the camera: a cool pool of its light on the rug in front of the couch
  const tvPool = K.sunPatch({ w: 5.5, d: 3.6, color: 0x5f8cff, strength: 0.2 });
  tvPool.position.set(0.3, 0.04, 2.4);
  set.add(win, winGlow, plan, tvPool);

  // ---- the couch, the coffee table with the pizza and the cans, the rug
  const sofa = couch();
  K.at(sofa, 0.0, 0, -1.95);
  const rug = K.rug({ r: 2.9, base: "#3b4058", ring: "#ff611d" });
  K.at(rug, 0.3, 0, 0.7);
  const table = coffeeTable();
  K.at(table, 0.35, 0, 1.0, -0.05);
  const PZ = new THREE.Vector3(0.0, table.userData.top, 1.05); // the lid opens to the right, low: it never hides a face
  const pz = pizzaBox();
  K.at(pz, PZ.x, PZ.y, PZ.z, -Math.PI / 2 + 0.12);
  const can1 = K.can(0x1d1e24, 0x9cf05a);
  K.at(can1, -0.85, table.userData.top, 0.7);
  const can2 = K.can(0xe8e6e1, 0xff611d);
  K.at(can2, 0.95, table.userData.top + 0.08, 1.45, 0.5);
  can2.rotation.z = Math.PI / 2;
  const can3 = K.can(0x1d1e24, 0x9cf05a);
  K.at(can3, 1.45, table.userData.top, 0.6);
  const mug = K.mug();
  K.at(mug, -0.75, table.userData.top, 1.5, 2.2);
  set.add(sofa, rug, table, pz, can1, can2, can3, mug);

  // ---- the ring light, still set up behind the couch's left arm and still on; a globe lamp on a side table (right),
  // a floor lamp and a plant in the corners
  const RING = new THREE.Vector3(-2.15, 3.3, -2.95);
  const ring = K.ringLight({ r: 0.62, h: RING.y });
  K.at(ring, RING.x, 0, RING.z, 0.45);
  const halo = K.wallGlow({ w: 2.6, h: 2.6, color: "#fff1dc", strength: 0.5 }); // it is ON
  K.at(halo, RING.x, RING.y, RING.z - 0.12, 0.45);
  const side = K.nightstand({ h: 1.0 });
  K.at(side, 3.45, 0, -2.2);
  const lamp = K.lamp();
  K.at(lamp, 3.45, 1.0, -2.25);
  const fl = floorLamp();
  K.at(fl, -3.9, 0, -2.9);
  const plantR = K.plant({ h: 2.9, n: 10, seed: 27 });
  K.at(plantR, 4.3, 0, -2.7);
  set.add(ring, halo, side, lamp, fl, plantR);

  // ---- lights. Night: the TV (behind the camera) is a cool blue key on their faces, a soft neutral fill keeps the
  // skin true, the city through the window is a violet rim (it casts the shadows), the practicals (ring light, globe
  // lamp, floor lamp) add warm accents.
  set.add(new THREE.HemisphereLight(0x5b6aa0, 0x2a1d18, 0.62));
  const key = new THREE.DirectionalLight(0x86b0ff, 1.6); // the TV
  key.position.set(-3.5, 5.5, 10);
  key.target.position.set(0.3, 2.4, -1.6);
  const fill = new THREE.DirectionalLight(0xfff0e4, 0.85);
  fill.position.set(4, 8, 9);
  fill.target.position.set(0.3, 2.4, -1.6);
  const rim = new THREE.DirectionalLight(0x8c8cff, 1.9); // the city, from behind
  rim.position.set(3, 7, -9);
  rim.target.position.set(0.3, 1, 0);
  rim.castShadow = true;
  rim.shadow.mapSize.set(2048, 2048);
  rim.shadow.radius = 8;
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
    tv: pl(0x6f9dff, 6, -0.5, 3.0, 4.2, 9),
    ring: pl(0xfff3e6, 9, RING.x + 0.2, RING.y, RING.z + 0.55, 6),
    lamp: pl(0xffb066, 7, 3.45, 1.95, -1.9, 6),
    floor: pl(0xffc48a, 5, -3.9, 3.7, -2.6, 5),
    city: pl(0x7d6bff, 4, 1.75, 4.1, BACK + 1.0, 7),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const seat = sofa.userData.seat, armTop = sofa.userData.armTop;
  // hips just above the cushion (it gives a little), knees over its front edge, sneakers on the rug
  const coach = { x: -0.95, y: seat - 1.12 + 0.12, z: -1.3, turn: 0.42, sit: 1, phone: 1 };
  const setty = { x: sofa.userData.armX + 0.02, y: armTop - 0.27, z: -1.85, turn: -0.42, scale: 0.6 };
  const coachHead = new THREE.Vector3(coach.x + 0.15, coach.y + 4.5, coach.z + 0.2);
  const settyFace = new THREE.Vector3(setty.x, setty.y + 1.08, setty.z);
  return {
    key, rim, lights, root: set,
    coach, setty,
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 },
    },
    shots: {
      wide: { pos: [0.6, 3.6, 14.4], at: [0.6, 2.4, -1.6], fov: 39 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 }),
      // cut-ins: the cold pizza on the coffee table, the ring light that has been on since Monday
      pizza: K.shot(PZ.clone().add(new THREE.Vector3(0, 0.15, 0.05)), { dist: 4.6, yaw: 0.15, pitch: 0.62, y: 860 }),
      ring: K.shot(new THREE.Vector3(-1.45, 3.65, -2.1), { dist: 8.2, yaw: 0.06, pitch: 0.05, y: 760 }), // the ring light glowing by his face
    },
  };
}
