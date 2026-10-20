// Set "gym": the coach's private gym in the morning (reel3, Claude on WhatsApp). An industrial room: brick wall, black
// rubber floor, a big steel factory window on Miami Beach in the morning (palms, pastel buildings, the sun over the
// ocean), a dumbbell rack, a power rack, an orange EARN IT neon, two pendants. He sits on a flat bench, phone in hand,
// towel and shaker next to him; Setty sits on a wooden plyo box next to him.
// build() adds the room and its lights to the scene and returns where the characters go and the camera shots.
import * as THREE from "three";
import * as K from "./kit.js";

const BACK = -3.4;

export async function build({ renderer, scene, mood = "morning" }) {
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.42;
  scene.background = new THREE.Color(0x2a2a30);
  void mood;

  const set = new THREE.Group();
  scene.add(set);
  set.add(K.room({ w: 18, h: 11, d: 18, backZ: BACK, floorMap: K.rubberTex(), floorTile: 2.2, floorRough: 0.85,
    wallMap: K.brickTex({ base: "#545863", mortar: "#2a2b30" }), wallTile: 3.2, baseboard: false }));

  // ---- the window wall (right): the factory window on Miami, the sun pouring in
  const win = K.cityWindow({ w: 4.4, h: 3.3, view: "miami", blinds: 0, panes: [4, 3], frame: 0x1a1b1f, bright: 1.0 });
  K.at(win, 2.3, 4.55, BACK + 0.02);
  const winGlow = K.wallGlow({ w: 8, h: 6, color: "#ffd9a6", strength: 0.42 });
  K.at(winGlow, 2.3, 4.4, BACK + 0.06);
  const shaft = K.lightShaft({ w: 3.2, h: 6.4, color: 0xffe2b8, strength: 0.13 });
  shaft.position.set(1.4, 2.7, -1.0);
  shaft.rotation.set(-0.6, 0, 0.3);
  const patch = K.sunPatch({ w: 4.2, d: 2.6, color: 0xffd9a8, strength: 0.38 });
  patch.position.set(0.8, 0.02, 1.0);
  patch.rotation.z = 0.45;
  set.add(win, winGlow, shaft, patch);

  // ---- the iron wall (left): neon, dumbbell rack, power rack
  const neon = K.neonSign("EARN IT", { color: "#ff5a1f", w: 2.6, h: 0.86, font: "italic 800 150px 'Nohemi', Inter, sans-serif" });
  K.at(neon, -1.85, 5.25, BACK + 0.16);
  const neonWash = K.wallGlow({ w: 5, h: 2.8, color: "#ff5a1f", strength: 0.5 });
  K.at(neonWash, -1.85, 5.25, BACK + 0.12);
  const rack = K.dumbbellRack({ w: 2.8, h: 1.45, d: 0.8, n: 5 });
  K.at(rack, 0.45, 0, BACK + 0.62);
  const prack = K.powerRack({ w: 2.6, h: 5.6, d: 1.8 });
  K.at(prack, -4.5, 0, -2.4, 0.22);
  const kb1 = K.kettlebell({ r: 0.26 });
  K.at(kb1, 0.95, 0, -1.25, 0.4);
  const kb2 = K.kettlebell({ r: 0.2, band: 0x3d8bff });
  K.at(kb2, 3.35, 0, -1.3, -0.3);
  const plateL = K.plate({ r: 0.62, w: 0.14 });
  plateL.position.set(-2.4, 0.62, BACK + 0.2);
  plateL.rotation.set(0, Math.PI / 2, 0.08);
  const plateL2 = K.plate({ r: 0.5, w: 0.12, ring: 0xd7dbe0 });
  plateL2.position.set(-2.25, 0.5, BACK + 0.38);
  plateL2.rotation.set(0, Math.PI / 2, 0.1);
  set.add(neon, neonWash, rack, prack, kb1, kb2, plateL, plateL2);

  // ---- the coach's bench and Setty's box
  const bench = K.flatBench({ l: 2.3, h: 0.62 });
  K.at(bench, -1.05, 0, -0.92, 0.6);
  const tw = K.towel();
  tw.position.set(-1.75, 0.6, -0.42);
  tw.rotation.y = 0.6;
  const sh = K.shaker();
  K.at(sh, 0.05, 0, 0.15, 0.3);
  const plyo = K.plyoBox({ w: 1.6, h: 1.3, d: 1.25 });
  K.at(plyo, 2.2, 0, -2.0, -0.25);
  const db = K.dumbbell({ len: 0.7, r: 0.12 });
  db.position.set(0.95, 0.12, -0.4);
  db.rotation.y = 0.9;
  set.add(bench, tw, sh, plyo, db);

  // two industrial pendants over the floor
  const pend1 = K.pendant({ cord: 3 });
  K.at(pend1, -1.4, 8.9, -1.6);
  const pend2 = K.pendant({ cord: 3 });
  K.at(pend2, 2.2, 8.9, -1.2);
  set.add(pend1, pend2);

  // ---- lights: morning daylight. The low sun behind the window is the warm rim (it casts the long shadows), a
  // cool sky fill, a soft front key for the faces; the neon and the pendants add warm practical accents.
  set.add(new THREE.HemisphereLight(0xe4f0ff, 0x3a302a, 1.15));
  const key = new THREE.DirectionalLight(0xfff4ea, 1.55);
  key.position.set(-3, 9, 9);
  key.target.position.set(0.3, 2, -1.5);
  const rim = new THREE.DirectionalLight(0xffcf96, 2.8);
  rim.position.set(6, 6.5, -9);
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
    neon: pl(0xff5a1f, 5, -1.85, 5.1, BACK + 0.9, 6),
    pend1: pl(0xffd7a0, 5, -1.4, 5.3, -1.6, 6),
    pend2: pl(0xffd7a0, 4, 2.2, 5.3, -1.2, 6),
    window: pl(0xffe2bb, 5, 2.3, 4.2, BACK + 1.2, 7),
  };

  // where the characters go (engine pose fields), and the camera shots ({ pos, at, fov })
  const coachHead = new THREE.Vector3(-0.85, 4.05, -0.72);
  const settyFace = new THREE.Vector3(2.2, 2.2, -2.0);
  return {
    key, rim, lights, root: set,
    coach: { x: -1.05, y: -0.46, z: -0.92, turn: 0.6, sit: 1, phone: 1 },
    setty: { x: 2.2, y: 1.0, z: -2.0, turn: -0.3, scale: 0.62 },
    heads: { coach: coachHead, setty: settyFace },
    frames: {
      coach: { target: coachHead, dist: 12, yaw: 0.5, y: 740 },
      setty: { target: settyFace, dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 },
    },
    shots: {
      wide: { pos: [0.15, 4.0, 15.0], at: [0.15, 2.4, -1.5], fov: 44 },
      coach: K.shot(coachHead, { dist: 12, yaw: 0.5, y: 820 }),
      setty: K.shot(settyFace, { dist: 10.5, yaw: -0.32, pitch: 0.06, y: 800 }),
    },
  };
}
