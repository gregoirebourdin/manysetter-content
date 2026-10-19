// Set "bedroom": the coach's bedroom-office at night, right after his webinar. He sits at his creator desk (slat wall,
// monitor, ring light, podcast mic, HUSTLE neon); Setty is tucked in the bed next to him, under the window on the city.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4;

function webinarScreen() {
  return K.canvasTex(1024, 590, (c, W, H) => {
    c.fillStyle = "#0f1220";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#1b2033";
    c.fillRect(0, 0, W, 64);
    c.fillStyle = "#ff3b3b";
    c.beginPath();
    c.arc(34, 32, 9, 0, Math.PI * 2);
    c.fill();
    c.font = "700 30px Inter, sans-serif";
    c.fillStyle = "#e6e9f2";
    c.textBaseline = "middle";
    c.fillText("Webinar  ·  2:04:17", 56, 33);
    const tiles = ["#5b6cff", "#ff8a5c", "#3fbf8f", "#c86bff", "#ffc84a", "#4ab8ff"];
    tiles.forEach((col, i) => {
      const x = 28 + (i % 3) * 330, y = 88 + Math.floor(i / 3) * 200;
      const g = c.createLinearGradient(x, y, x + 300, y + 180);
      g.addColorStop(0, col);
      g.addColorStop(1, "#151827");
      c.fillStyle = g;
      c.beginPath();
      c.roundRect(x, y, 310, 184, 16);
      c.fill();
      c.fillStyle = "rgba(255,255,255,0.85)";
      c.beginPath();
      c.arc(x + 155, y + 78, 34, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.ellipse(x + 155, y + 165, 62, 46, 0, Math.PI, 0);
      c.fill();
    });
    c.fillStyle = "#e5484d";
    c.beginPath();
    c.roundRect(W / 2 - 300, H - 124, 600, 92, 46);
    c.fill();
    c.font = "800 50px Inter, sans-serif";
    c.fillStyle = "#fff";
    c.textAlign = "center";
    c.fillText("WEBINAR ENDED", W / 2, H - 76);
  });
}

function sunsetPrint(c, W, H) {
  c.fillStyle = "#f3ebdf";
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#ff611d";
  c.beginPath();
  c.arc(W / 2, H * 0.48, W * 0.28, Math.PI, 0);
  c.fill();
  c.fillStyle = "#1f2433";
  for (let i = 0; i < 4; i++) c.fillRect(W * 0.2, H * 0.52 + i * 26, W * 0.6, 10);
  c.font = "700 34px Inter, sans-serif";
  c.textAlign = "center";
  c.fillStyle = "#1f2433";
  c.fillText("NO DAYS OFF", W / 2, H * 0.86);
}

export async function build({ renderer, scene }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.32;
  scene.background = new THREE.Color(0x161a26);

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 18, h: 11, d: 18, wall: "#272c3e", floor: "#b3845a", backZ: BACK }));

  // ---- the creator corner (left)
  const slats = K.slatPanel({ w: 4.0, h: 5.0 });
  K.at(slats, -2.05, 3.0, BACK + 0.03);
  const ledWash = K.wallGlow({ w: 6, h: 3.4, color: "#7c4dff", strength: 0.75 });
  K.at(ledWash, -2.05, 2.3, BACK + 0.12);
  const desk = K.desk({ w: 3.6, d: 1.45, h: 1.35 });
  K.at(desk, -2.0, 0, -2.55);
  const mon = K.monitor({ w: 2.1, h: 1.2, screen: webinarScreen() });
  K.at(mon, -2.2, 1.35, -2.95);
  const kb = K.keyboard();
  K.at(kb, -2.05, 1.35, -2.15, 0.04);
  const mug = K.mug();
  K.at(mug, -0.75, 1.35, -2.25);
  const can1 = K.can(0x232327, 0x9cf05a);
  K.at(can1, -3.4, 1.35, -2.75);
  const can2 = K.can(0xe8e6e1, 0xff611d);
  K.at(can2, -3.15, 1.35, -2.45, 0.6);
  can2.rotation.z = Math.PI / 2;
  can2.position.y = 1.43;
  const mic = K.micArm();
  K.at(mic, -3.7, 1.35, -2.0, 0.5);
  const shelf = K.shelf({ w: 2.6 });
  K.at(shelf, -2.05, 5.0, BACK + 0.28);
  const neon = K.neonSign("HUSTLE", { color: "#ff4d2e", w: 2.2, h: 0.76 });
  K.at(neon, -2.45, 4.2, BACK + 0.16);
  const neonWash = K.wallGlow({ w: 4.5, h: 2.4, color: "#ff4d2e", strength: 0.55 });
  K.at(neonWash, -2.45, 4.2, BACK + 0.13);
  const ring = K.ringLight({ r: 0.6, h: 3.3 });
  K.at(ring, 0.05, 0, -3.0, -0.5);
  const chair = K.gamingChair({ seat: 0.5 });
  K.at(chair, -1.05, 0, -0.95, 0.6);
  const plantL = K.plant({ h: 2.8, n: 10, seed: 23 });
  K.at(plantL, -4.4, 0, -2.5);
  set.add(slats, ledWash, desk, mon, kb, mug, can1, can2, mic, shelf, neon, neonWash, ring, chair, plantL);

  // ---- the bed corner (right)
  const bed = K.bed({ w: 3.0, l: 3.9, top: 1.0 });
  K.at(bed, 1.95, 0, BACK + 1.98);
  const win = K.nightWindow({ w: 2.7, h: 2.2 });
  K.at(win, 1.95, 4.55, BACK + 0.02);
  const ns = K.nightstand({ h: 1.0 });
  K.at(ns, 4.15, 0, BACK + 0.6);
  const lamp = K.lamp();
  K.at(lamp, 4.15, 1.0, BACK + 0.55);
  const print = K.poster({ w: 1.15, h: 1.5, draw: sunsetPrint });
  K.at(print, 4.1, 4.3, BACK + 0.05);
  const rug = K.rug({ r: 2.7, base: "#3a3f56", ring: "#ff611d" });
  K.at(rug, 0.3, 0, 0.4);
  set.add(bed, win, ns, lamp, print, rug);

  // ---- lights: navy night, a warm soft key for the faces, an orange rim, the practicals
  set.add(new THREE.HemisphereLight(0x6b78a8, 0x3a2418, 0.75));
  const key = new THREE.DirectionalLight(0xffe7d2, 1.9);
  key.position.set(-3, 9, 9);
  key.target.position.set(0.3, 2, -1.5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 8;
  key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -4, near: 1, far: 30 });
  const rim = new THREE.DirectionalLight(0xff8a4c, 2.2);
  rim.position.set(5, 6, -6);
  set.add(key, key.target, rim);
  const pl = (color, intensity, x, y, z, distance = 6) => {
    const l = new THREE.PointLight(color, intensity, distance, 1.6);
    l.position.set(x, y, z);
    set.add(l);
    return l;
  };
  const lights = {
    monitor: pl(0x9fc4ff, 6, -2.2, 2.0, -2.2, 5),
    ring: pl(0xfff1e0, 9, 0.05, 3.3, -2.5, 7),
    lamp: pl(0xffb066, 10, 4.15, 1.8, BACK + 0.9, 6),
    neon: pl(0xff4d2e, 7, -2.7, 4.1, BACK + 0.9, 6),
    led: pl(0x7c4dff, 8, -2.05, 1.7, BACK + 0.6, 5),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(-0.85, 4.05, -0.72); // centre of head + beanie, seated
  const settyFace = new THREE.Vector3(1.95, 1.8, -2.2);
  return {
    key, rim, lights, root: set,
    coach: { x: -1.05, y: -0.46, z: -0.92, turn: 0.6, sit: 1 },
    setty: { x: 1.95, y: 0.56, z: -2.2, turn: -0.3, scale: 0.7 },
    heads: { coach: coachHead, setty: settyFace },
    shots: {
      wide: { pos: [0.2, 3.7, 13.2], at: [0.2, 2.3, -1.5], fov: 40 },
      coach: shot(coachHead, { dist: 12, yaw: 0.5, y: 820 }),
      setty: shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 }),
    },
  };
}

/** a camera that looks at `target` from `dist` away (yaw/pitch around it) and puts it at screen height `y` (px of 1920) */
export function shot(target, { dist = 10, fov = 30, yaw = 0, pitch = 0.1, y = 840 } = {}) {
  const half = dist * Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const off = ((960 - y) / 960) * half;
  const pos = [target.x + Math.sin(yaw) * Math.cos(pitch) * dist, target.y + Math.sin(pitch) * dist, target.z + Math.cos(yaw) * Math.cos(pitch) * dist];
  return { pos, at: [target.x, target.y - off, target.z], fov };
}
