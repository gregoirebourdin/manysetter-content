// The infopreneur ("the coach"), Setty's conversation partner: a gym-bro creator in a ribbed white tank top, a black
// beanie, three-day stubble, grey joggers, white sneakers and a thin gold chain. Same toy-like 3D language as Setty
// (assets/setty), built entirely in code: the pose is a plain object of numbers GSAP can tween, then `coach.apply(pose)`.
// Orientation: he faces +z; "L" is the viewer's left (x < 0), like Setty.
import * as THREE from "three";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

export const COLORS = {
  skin: 0xbd7b52, hair: 0x1b120d, tank: 0xf3efe9, beanie: 0x1f1f23, patch: 0xb27a4c,
  jogger: 0x4a4c53, sneaker: 0xf6f5f2, sole: 0xd8d6d0, gold: 0xe0ad4a, ink: 0x1c1210, iris: 0x5a3520,
};

// head: a slightly boxy egg (superellipsoid), the jaw a little wider than the skull
const HA = 0.7, HB = 0.88, HC = 0.74, HP = 2.4, HQ = 2.3;
export function headZ(x, y) {
  const s = Math.pow(Math.abs(x / HA), HP) + Math.pow(Math.abs(y / HB), HP);
  return s >= 1 ? 0 : HC * Math.pow(1 - Math.pow(s, HQ / HP), 1 / HQ);
}
const smooth = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/** superellipsoid mesh (A, B, C half-sizes, P/Q roundness), optional deform(x, y, z) → [x, y, z] and color(x, y, z) → Color */
export function superGeo({ A, B, C, P = 2.4, Q = 2.4, w = 96, h = 72, deform, color }) {
  const g = new THREE.SphereGeometry(1, w, h);
  g.deleteAttribute("uv");
  g.deleteAttribute("normal");
  const pos = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const s = Math.pow(Math.abs(v.x), P) + Math.pow(Math.abs(v.y), P);
    const r = Math.pow(Math.pow(s, Q / P) + Math.pow(Math.abs(v.z), Q), -1 / Q);
    let p = [v.x * r * A, v.y * r * B, v.z * r * C];
    if (deform) p = deform(...p);
    pos.setXYZ(i, ...p);
  }
  const m = mergeVertices(g);
  m.computeVertexNormals();
  if (color) {
    const p = m.attributes.position, col = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) {
      const c = color(p.getX(i), p.getY(i), p.getZ(i));
      col.set([c.r, c.g, c.b], i * 3);
    }
    m.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }
  return m;
}

/** a limb hanging from its top (y 0) down to y -L, radius profile [[t, r], …] with t 0 (top) → 1 (bottom) */
export function limbGeo(L, prof, seg = 40) {
  const r0 = prof[0][1], r1 = prof[prof.length - 1][1], pts = [];
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; pts.push(new THREE.Vector2(r1 * Math.sin(a), -L - r1 * Math.cos(a))); }
  for (let i = prof.length - 2; i >= 1; i--) pts.push(new THREE.Vector2(prof[i][1], -L * prof[i][0]));
  for (let i = 8; i >= 0; i--) { const a = (i / 8) * Math.PI / 2; pts.push(new THREE.Vector2(r0 * Math.sin(a), r0 * Math.cos(a))); }
  const g = new THREE.LatheGeometry(pts, seg);
  g.deleteAttribute("uv");
  g.deleteAttribute("normal");
  const m = mergeVertices(g);
  m.computeVertexNormals();
  return m;
}

const phys = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, ...o });
const skinMat = () => phys(COLORS.skin, { roughness: 0.46, clearcoat: 0.18, clearcoatRoughness: 0.4, sheen: 0.3,
                                          sheenColor: new THREE.Color(0xffb595), sheenRoughness: 0.5 });

// GLSL: hash noise for stubble and fabric, injected through onBeforeCompile (object-space position in vP)
const NOISE = `
varying vec3 vP;
float hash3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x), mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x), mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float under(float edge, float w, float x) { return 1.0 - smoothstep(edge - w, edge + w, x); }
`;
function shaded(mat, uniforms, body) {
  // `body` runs after color_fragment (vP = object-space position); it may set rough2 to override the roughness
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    const decl = Object.keys(uniforms).map((k) => `uniform vec3 ${k};`).join("\n");
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vP;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvP = position;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", `#include <common>\n${NOISE}\n${decl}`)
      .replace("void main() {", "void main() {\n\tfloat rough2 = -1.0;")
      .replace("#include <color_fragment>", `#include <color_fragment>\n{\n${body}\n}`)
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n\tif (rough2 >= 0.0) roughnessFactor = rough2;");
  };
  mat.customProgramCacheKey = () => body;
  return mat;
}

// ---------- face texture: mouth (lip-sync via `talk`), lower-lip hint, censor bar ----------
const FW = 0.95, FH = 0.46, PX = 600;
function drawMouth(ctx, p) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);
  const open = Math.min(1, p.mouthOpen + p.talk * 0.55);
  const teeth = Math.max(p.teeth, Math.min(1, p.talk * 2.2) * 0.8);
  ctx.save();
  ctx.translate(W / 2 + p.mouthX * PX, H / 2);
  ctx.rotate(p.mouthTilt);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const w = 88 * p.mouthW, sm = p.smirk;
  const cl = -12 * p.curve - 24 * Math.max(0, -sm) + 6 * Math.max(0, sm);
  const cr = -12 * p.curve - 26 * Math.max(0, sm) + 6 * Math.max(0, -sm);
  if (open < 0.04) {
    // lower lip: a soft darker arc under the line
    ctx.strokeStyle = "rgba(120, 52, 40, 0.38)";
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(-w * 0.55, 24 + 6 * p.curve);
    ctx.quadraticCurveTo(0, 36 + 14 * p.curve, w * 0.55, 24 + 6 * p.curve);
    ctx.stroke();
    ctx.strokeStyle = "#3a1c14";
    ctx.lineWidth = 17;
    ctx.beginPath();
    ctx.moveTo(-w, cl);
    ctx.quadraticCurveTo(12 * sm, 34 * p.curve, w, cr);
    ctx.stroke();
  } else if (p.mouthRound > 0.5) {
    ctx.fillStyle = "#2a110c";
    ctx.beginPath();
    ctx.ellipse(0, 10, 28 + 12 * open, 20 + 40 * open, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const ow = w * 1.12, depth = 26 + 112 * open;
    ctx.fillStyle = "#2a110c";
    ctx.beginPath();
    ctx.moveTo(-ow, cl - 4);
    ctx.quadraticCurveTo(0, 4 + 8 * p.curve, ow, cr - 4);
    ctx.bezierCurveTo(ow * 0.88, depth, -ow * 0.88, depth, -ow, cl - 4);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.clip();
    if (teeth > 0.02) {
      ctx.fillStyle = "#fbf8f2";
      ctx.fillRect(-ow, -30, ow * 2, 26 + 16 * teeth);
    }
    ctx.fillStyle = "#e0586e";
    ctx.beginPath();
    ctx.ellipse(4, depth * 0.86, ow * 0.6, depth * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "#3a1c14";
    ctx.lineWidth = 8;
    ctx.stroke();
  }
  ctx.restore();
  if (p.censor > 0.01) {
    ctx.save();
    ctx.translate(W / 2 + 4, H / 2 + 14);
    ctx.rotate(-0.06);
    ctx.scale(p.censor, p.censor);
    ctx.fillStyle = "#0d0c0a";
    ctx.beginPath();
    ctx.roundRect(-150, -52, 300, 104, 22);
    ctx.fill();
    ctx.fillStyle = "#ff7a3a";
    ctx.font = "800 64px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("#@!%", 0, 5);
    ctx.restore();
  }
}

// ---------- pose ----------
export function basePose() {
  return {
    // whole body (root) and the upper body (pivots at the hips)
    x: 0, y: 0, z: 0, turn: 0, scale: 1, squash: 0, bend: 0, lean: 0, twist: 0,
    // head
    nod: 0, headTurn: 0, headTilt: 0,
    // eyes
    lookX: 0, lookY: 0, pupil: 1, lidL: 0.24, lidR: 0.24, lowL: 0.08, lowR: 0.08, happyL: 0, happyR: 0,
    // brows: y raises, a > 0 lifts the inner end (worried), a < 0 drops it (angry)
    browLy: 0, browRy: 0, browLa: 0, browRa: 0,
    // mouth (talk = lip-sync amount, driven by the voice)
    curve: 0.55, smirk: 0, mouthW: 1, mouthOpen: 0, mouthRound: 0, mouthTilt: 0, mouthX: 0, teeth: 0, tongue: 0,
    talk: 0, censor: 0,
    // arms: r raises sideways, f swings forward, e bends the elbow, w turns the wrist
    armLr: 0.16, armRr: 0.16, armLf: 0.05, armRf: 0.05, elbowL: 0.25, elbowR: 0.25, wristL: 0, wristR: 0,
    // legs: sit 0 = standing, 1 = seated (thighs forward, shins down); spread opens the knees
    sit: 0, spread: 0.12,
    // props: sweat drop, phone in the right hand
    sweat: 0, phone: 0,
    // a pointing index finger on the hand (0 = fist / mitten)
    pointL: 0, pointR: 0,
  };
}

export const EXPRESSIONS = {
  neutral: {},
  hyped: { browLy: 0.08, browRy: 0.08, lidL: 0, lidR: 0, curve: 1.2, mouthOpen: 0.55, teeth: 1, mouthW: 1.15,
           armLr: 0.9, armRr: 0.9, armLf: 0.5, armRf: 0.5, elbowL: 0.9, elbowR: 0.9, nod: -0.06 },
  smug: { lidL: 0.42, lidR: 0.3, browRy: 0.07, browLa: -0.08, curve: 0.7, smirk: 0.9, mouthX: 0.05, headTilt: 0.06, lookX: 0.3 },
  stressed: { lidL: 0, lidR: 0, lowL: 0.2, lowR: 0.2, browLy: 0.06, browRy: 0.06, browLa: 0.35, browRa: 0.35, curve: -0.4,
              mouthOpen: 0.22, teeth: 1, mouthW: 1.1, sweat: 1, pupil: 0.8 },
  defeated: { lidL: 0.5, lidR: 0.5, browLa: 0.4, browRa: 0.4, browLy: -0.02, browRy: -0.02, curve: -0.9, mouthW: 0.8,
              nod: 0.22, bend: 0.12, armLr: 0.06, armRr: 0.06, armLf: 0, armRf: 0, elbowL: 0.05, elbowR: 0.05, lookY: -0.5 },
  confused: { browRy: 0.1, browLy: -0.04, browLa: -0.15, browRa: 0.1, curve: 0, smirk: -0.6, mouthW: 0.8, headTilt: -0.14,
              lidL: 0.2, lidR: 0.08, lookX: -0.3, armRr: 0.5, armRf: 0.6, elbowR: 1.6, wristR: 0.4 },
  shocked: { lidL: 0, lidR: 0, lowL: 0, lowR: 0, pupil: 0.7, browLy: 0.13, browRy: 0.13, browLa: 0.1, browRa: 0.1,
             mouthOpen: 0.75, mouthRound: 1, nod: -0.08, bend: -0.06, armLr: 0.5, armRr: 0.5, armLf: 0.6, armRf: 0.6,
             elbowL: 1.2, elbowR: 1.2 },
  laughing: { happyL: 1, happyR: 1, browLy: 0.06, browRy: 0.06, mouthOpen: 0.85, teeth: 1, curve: 1.3, mouthW: 1.2,
              nod: -0.16, bend: -0.08, armLf: 0.3, elbowL: 1.2 },
  annoyed: { lidL: 0.45, lidR: 0.45, browLa: -0.25, browRa: -0.25, browLy: -0.03, browRy: -0.03, curve: -0.2, mouthW: 0.85,
             lookX: 0.6, smirk: -0.2 },
  skeptical: { lidL: 0.55, lidR: 0.18, browRy: 0.11, browLy: -0.04, browLa: -0.2, curve: 0.2, smirk: 0.6, headTilt: 0.1,
               nod: 0.05, armLr: 0.25, armLf: 0.75, elbowL: 2.1, armRr: 0.25, armRf: 0.75, elbowR: 2.1 },
  // the roast: laughing at the other one and pointing at him
  mocking: { happyL: 1, happyR: 0, lidR: 0.35, browLy: 0.08, browRy: 0.03, mouthOpen: 0.6, teeth: 1, curve: 1.1, smirk: 0.5,
             mouthW: 1.15, headTilt: -0.1, nod: -0.08, armRr: 0.35, armRf: 1.45, elbowR: 0.15, pointR: 1 },
  eyeRoll: { lidL: 0.42, lidR: 0.42, lookY: 1, lookX: 0.25, browLy: 0.05, browRy: 0.05, curve: -0.1, smirk: -0.4, mouthW: 0.75,
             headTilt: 0.12, nod: -0.06 },
  panic: { lidL: 0, lidR: 0, lowL: 0, lowR: 0, pupil: 0.6, browLy: 0.14, browRy: 0.14, browLa: 0.4, browRa: 0.4, mouthOpen: 0.7,
           teeth: 1, curve: -0.6, mouthW: 1.2, sweat: 1, armLr: 2.2, armRr: 2.2, armLf: 0.4, armRf: 0.4, elbowL: 2.3, elbowR: 2.3 },
  pleading: { lidL: 0, lidR: 0, pupil: 1.15, browLy: 0.06, browRy: 0.06, browLa: 0.5, browRa: 0.5, curve: -0.3, mouthW: 0.7,
              headTilt: -0.12, armLr: 0.3, armRr: 0.3, armLf: 1.1, armRf: 1.1, elbowL: 1.2, elbowR: 1.2, wristL: 0.5, wristR: 0.5 },
  proud: { lidL: 0.35, lidR: 0.35, curve: 1.1, smirk: 0.3, mouthW: 1.1, nod: -0.14, bend: -0.1, browLy: 0.04, browRy: 0.04,
           armLr: 0.5, armRr: 0.5, armLf: -0.2, armRf: -0.2, elbowL: 1.9, elbowR: 1.9 },
  deadpan: { lidL: 0.55, lidR: 0.55, curve: 0, mouthW: 0.8, browLy: -0.02, browRy: -0.02, lookX: 0, lookY: 0 },
  disgusted: { lidL: 0.45, lidR: 0.25, browLa: -0.3, browRa: -0.1, browLy: -0.05, curve: -0.7, smirk: -0.8, mouthW: 0.9,
               headTilt: 0.15, nod: 0.06, bend: 0.06 },
  thinking: { lidL: 0.3, lidR: 0.3, lookY: 0.6, lookX: -0.5, browRy: 0.08, browLa: 0.1, curve: 0.1, smirk: 0.4, mouthW: 0.8,
              headTilt: -0.08, nod: 0.05 },
  sly: { lidL: 0.5, lidR: 0.5, lookX: 0.7, browLy: 0.05, browLa: -0.1, browRa: -0.1, curve: 0.9, smirk: 1, mouthW: 1.05, headTilt: 0.08 },
  pointing: { browLy: 0.06, browRy: 0.06, curve: 0.8, mouthOpen: 0.3, teeth: 1, armRr: 0.3, armRf: 1.5, elbowR: 0.1, pointR: 1 },
};

export function pose(name, extra = {}) {
  return Object.assign(basePose(), EXPRESSIONS[name] || {}, extra);
}

function goldChain(bodyParts) {
  const probes = bodyParts.map((m) => { const q = new THREE.Mesh(m.geometry); q.position.copy(m.position); q.updateMatrixWorld(true); return q; });
  const rc = new THREE.Raycaster();
  const C = new THREE.Vector3(0, 1.47, 0), pts = [], nrm = [];
  const N = 72;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2; // 0 = the front, the loop goes round the neck
    const front = Math.max(0, Math.cos(a));
    const d = new THREE.Vector3(Math.sin(a), 0.55 - 1.05 * Math.pow(front, 1.4), Math.cos(a) * 0.85).normalize();
    rc.set(C.clone().addScaledVector(d, 3), d.clone().negate());
    const hit = rc.intersectObjects(probes, false)[0];
    if (!hit) continue;
    const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    pts.push(hit.point.clone().addScaledVector(n, 0.024));
    nrm.push(n);
  }
  const curve = new THREE.CatmullRomCurve3(pts, true, "centripetal");
  const L = curve.getLength(), step = 0.03, count = Math.floor(L / step);
  const link = new THREE.TorusGeometry(0.019, 0.0062, 6, 14);
  link.scale(1.45, 1, 1);
  const mesh = new THREE.InstancedMesh(link, phys(COLORS.gold, { metalness: 1, roughness: 0.22, clearcoat: 0.6 }), count);
  const m = new THREE.Matrix4(), T = new THREE.Vector3(), B = new THREE.Vector3(), Nn = new THREE.Vector3();
  for (let k = 0; k < count; k++) {
    const u = k / count, P = curve.getPointAt(u);
    T.copy(curve.getTangentAt(u));
    // the body's normal there: the closest sampled one
    let best = 0, bd = 1e9;
    pts.forEach((q, j) => { const dd = q.distanceToSquared(P); if (dd < bd) { bd = dd; best = j; } });
    Nn.copy(nrm[best]).addScaledVector(T, -nrm[best].dot(T)).normalize();
    B.crossVectors(T, Nn);
    // links alternate: flat on the body, then standing
    if (k % 2) m.makeBasis(T, Nn, B); else m.makeBasis(T, B.clone().negate(), Nn); // right-handed bases
    m.setPosition(P);
    mesh.setMatrixAt(k, m);
  }
  mesh.castShadow = true;
  return mesh;
}

export function createCoach() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const shadowed = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
  const skin = skinMat();

  // ---------------- legs (joggers + sneakers), hips at y 1.06 ----------------
  const jog = shaded(phys(COLORS.jogger, { roughness: 0.92, sheen: 0.4, sheenColor: new THREE.Color(0xbfc2c8) }), {},
    `float n = vnoise(vP * 140.0) * 0.6 + vnoise(vP * 37.0) * 0.4;
     float aa = clamp(length(fwidth(vP * 140.0)) * 0.5, 0.0, 1.0);
     diffuseColor.rgb *= mix(0.88 + 0.22 * n, 0.99, aa);`);
  const legs = [];
  for (const side of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.3, 1.12, 0);
    const thigh = shadowed(new THREE.Mesh(limbGeo(0.54, [[0, 0.28], [0.35, 0.29], [1, 0.23]]), jog));
    thigh.scale.set(1, 1, 1.05);
    const knee = new THREE.Group();
    knee.position.y = -0.54;
    const shin = shadowed(new THREE.Mesh(limbGeo(0.44, [[0, 0.23], [0.3, 0.235], [0.85, 0.2], [1, 0.19]]), jog));
    const cuff = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.18, 0.1, 32), phys(0x76787e, { roughness: 0.95 })));
    cuff.position.y = -0.46;
    const ankle = new THREE.Group();
    ankle.position.y = -0.5;
    const shoe = shadowed(new THREE.Mesh(superGeo({
      A: 0.2, B: 0.13, C: 0.36, P: 2.6, Q: 2.3, w: 64, h: 40,
      deform: (x, y, z) => [x, y + (z > 0 ? -0.03 * smooth(0.1, 0.36, z) : 0), z],
      color: (x, y) => new THREE.Color(y < -0.045 ? COLORS.sole : COLORS.sneaker),
    }), phys(0xffffff, { vertexColors: true, roughness: 0.55, clearcoat: 0.3 })));
    shoe.position.set(0, 0.04, 0.1);
    ankle.add(shoe);
    const kneeBall = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.235, 32, 24), jog));
    knee.add(kneeBall, shin, cuff, ankle);
    hip.add(thigh, knee);
    body.add(hip);
    legs.push({ side, hip, knee, ankle });
  }
  // hips: the joggers' seat, a darker waistband, two drawstrings
  const pelvis = shadowed(new THREE.Mesh(superGeo({ A: 0.62, B: 0.3, C: 0.46, P: 2.6, Q: 2.4 }), jog));
  pelvis.position.y = 1.26;
  body.add(pelvis);

  // ---------------- upper body (pivots at the hips) ----------------
  const upper = new THREE.Group();
  upper.position.y = 1.24;
  body.add(upper);
  // torso: a V-tapered rounded block with pecs; the tank top is painted by the shader (straps, scoop neck, armholes, ribs)
  const torsoMat = shaded(phys(0xffffff, { roughness: 0.8, sheen: 0.35, sheenColor: new THREE.Color(0xffffff) }),
    { uSkin: { value: new THREE.Color(COLORS.skin) }, uTank: { value: new THREE.Color(COLORS.tank) } },
    `float ax = abs(vP.x), y = vP.y;
     float front = smoothstep(-0.12, 0.12, vP.z);
     float scoop = mix(0.5 + 0.8 * pow(ax / 0.42, 2.0), 0.22 + 0.95 * pow(ax / 0.42, 2.0), front);
     float skinNeck = smoothstep(scoop - 0.01, scoop + 0.01, y);
     float e = pow((ax - 0.98) / 0.47, 2.0) + pow((y - 0.74) / 0.52, 2.0);
     float skinArm = 1.0 - smoothstep(0.97, 1.03, e);
     float sk = max(skinNeck, skinArm);
     float band = max(smoothstep(scoop - 0.06, scoop - 0.012, y) * (1.0 - skinNeck), (1.0 - smoothstep(1.03, 1.2, e)) * (1.0 - skinArm));
     float th = atan(vP.x, vP.z) * 64.0;
     float rib = 0.94 + 0.06 * smoothstep(-0.5, 0.5, sin(th));
     rib = mix(rib, 0.97, clamp(fwidth(th) * 0.6, 0.0, 1.0));
     vec3 cloth = uTank * rib * mix(1.0, 0.9, band);
     diffuseColor.rgb = mix(cloth, uSkin, sk);
     rough2 = mix(0.86, 0.46, sk);`);
  const torso = shadowed(new THREE.Mesh(superGeo({
    A: 0.95, B: 0.72, C: 0.5, P: 2.6, Q: 2.3, w: 128, h: 96,
    deform: (x, y, z) => {
      const k = THREE.MathUtils.lerp(0.74, 1, smooth(-0.72, 0.35, y));
      const pec = z > 0 ? 0.075 * Math.exp(-(Math.pow(Math.abs(x) - 0.36, 2) / 0.05 + Math.pow(y - 0.26, 2) / 0.035)) : 0;
      const trap = y > 0.2 ? 0.2 * smooth(0.25, 0.95, Math.abs(x)) * smooth(0.2, 0.72, y) : 0;
      const cap = 0.06 * Math.exp(-(Math.pow(Math.abs(x) - 0.82, 2) / 0.02 + Math.pow(y - 0.38, 2) / 0.03));
      return [x * k + Math.sign(x) * cap, y - trap, z + pec];
    },
  }), torsoMat));
  torso.position.y = 0.78;
  upper.add(torso);
  const neck = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.5, 40), skin));
  neck.position.set(0, 1.56, 0);
  // gold chain: ~80 real links laid on the body (each ray from outside toward the neck base finds the surface)
  upper.add(goldChain([torso, neck]));
  upper.add(neck);

  // ---------------- head ----------------
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.7, 0);
  upper.add(headPivot);
  const head = new THREE.Group();
  head.position.set(0, 0.66, 0.05);
  headPivot.add(head);
  const headMat = shaded(skinMat(), { uHair: { value: new THREE.Color(COLORS.hair) } },
    `float ax = abs(vP.x);
     float line = -0.35 + 0.44 * smoothstep(0.2, 0.68, ax);
     float beard = under(line, 0.035, vP.y) * smoothstep(-0.3, -0.08, vP.z);
     float stache = under(-0.36, 0.03, vP.y) * smoothstep(-0.56, -0.48, vP.y) * under(0.2, 0.05, ax);
     float hair = smoothstep(-0.22, -0.1, vP.y) * (1.0 - smoothstep(-0.3, -0.06, vP.z));
     float dots = smoothstep(0.5, 0.78, vnoise(vP * 230.0));
     float fine = clamp(length(fwidth(vP * 230.0)) * 0.7, 0.0, 1.0);
     dots = mix(dots, 0.3, fine);
     float k = beard * (0.4 + 0.5 * dots + 0.12 * stache) + hair * (0.55 + 0.4 * dots);
     diffuseColor.rgb = mix(diffuseColor.rgb, uHair, clamp(k, 0.0, 0.9));
     rough2 = mix(0.46, 0.75, clamp(k, 0.0, 1.0));`);
  const skull = shadowed(new THREE.Mesh(superGeo({
    A: HA, B: HB, C: HC, P: HP, Q: HQ, w: 128, h: 96,
    deform: (x, y, z) => [x * (1 + 0.05 * smooth(0.0, -0.75, y)), y, z + (z > 0 ? 0.05 * Math.exp(-Math.pow((y + 0.7) / 0.15, 2)) : 0)],
  }), headMat));
  head.add(skull);
  // ears and nose
  for (const side of [-1, 1]) {
    const ear = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 24), skin));
    ear.position.set(side * 0.7, -0.05, -0.04);
    ear.scale.set(0.42, 1, 0.72);
    head.add(ear);
  }
  const nose = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.15, 40, 30), skin));
  nose.position.set(0, -0.19, headZ(0, -0.19) - 0.035);
  nose.scale.set(0.8, 0.86, 0.9);
  head.add(nose);

  // mouth decal
  const faceCanvas = document.createElement("canvas");
  faceCanvas.width = Math.round(FW * PX);
  faceCanvas.height = Math.round(FH * PX);
  const faceCtx = faceCanvas.getContext("2d");
  const faceTex = new THREE.CanvasTexture(faceCanvas);
  faceTex.colorSpace = THREE.SRGBColorSpace;
  faceTex.anisotropy = 8;
  skull.updateMatrixWorld(true); // parents not updated yet: the decal comes out in the head's own space
  const decal = new THREE.Mesh(
    new DecalGeometry(skull, new THREE.Vector3(0, -0.47, 0.7), new THREE.Euler(0, 0, 0), new THREE.Vector3(FW, FH, 0.8)),
    new THREE.MeshPhysicalMaterial({ map: faceTex, transparent: true, depthWrite: false, polygonOffset: true,
                                     polygonOffsetFactor: -4, roughness: 0.4 }),
  );
  head.add(decal);

  // eyes: white ball, brown iris, pupil, glints, real lids in skin colour with a lash line
  const white = phys(0xfbf8f3, { roughness: 0.15, clearcoat: 1 });
  const ink = phys(COLORS.ink, { roughness: 0.2, clearcoat: 1 });
  const irisMat = phys(COLORS.iris, { roughness: 0.25, clearcoat: 1 });
  const glint = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const lidMat = skinMat();
  const ER = 0.15;
  const eyes = [];
  for (const side of [-1, 1]) {
    const ex = side * 0.27, ey = 0.05;
    const eye = new THREE.Group();
    eye.position.set(ex, ey, headZ(ex, ey) - 0.065);
    eye.scale.set(1, 1.06, 0.72);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(ER, 48, 36), white);
    const look = new THREE.Group();
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.094, 40, 30), irisMat);
    iris.scale.set(1, 1.05, 0.42);
    iris.position.z = ER - 0.034;
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.052, 32, 24), ink);
    pupil.scale.set(1, 1.05, 0.4);
    pupil.position.z = ER - 0.014;
    const g1 = new THREE.Mesh(new THREE.CircleGeometry(0.03, 24), glint);
    g1.position.set(-0.03, 0.04, ER + 0.01);
    const g2 = new THREE.Mesh(new THREE.CircleGeometry(0.013, 16), glint);
    g2.position.set(0.035, -0.03, ER + 0.01);
    look.add(iris, pupil, g1, g2);
    const LR = ER * 1.12;
    const cap = (top) => new THREE.SphereGeometry(LR, 48, 24, 0, Math.PI * 2, top ? 0 : Math.PI / 2, Math.PI / 2);
    const lash = (w) => {
      const g = new THREE.TorusGeometry(LR, w, 8, 48, Math.PI - 1.0);
      g.rotateZ(0.5);
      const m = new THREE.Mesh(g, ink);
      m.rotation.x = Math.PI / 2;
      return m;
    };
    const arc = (happy) => {
      const g = new THREE.TorusGeometry(0.12, 0.018, 10, 32, 2.0);
      g.rotateZ(Math.PI / 2 - 1.0);
      g.translate(0, -0.12, 0);
      if (!happy) g.rotateZ(Math.PI);
      const m = new THREE.Mesh(g, ink);
      m.position.set(0, happy ? 0.035 : -0.03, LR - 0.01);
      m.visible = false;
      return m;
    };
    const upperLid = new THREE.Mesh(cap(true), lidMat);
    upperLid.add(lash(0.016));
    const lowerLid = new THREE.Mesh(cap(false), lidMat);
    lowerLid.add(lash(0.008));
    const happyArc = arc(true), blinkArc = arc(false);
    eye.add(ball, look, upperLid, lowerLid, happyArc, blinkArc);
    head.add(eye);
    // brow: a thick dark arc
    const bg = new THREE.TorusGeometry(0.42, 0.052, 12, 40, 0.6);
    bg.rotateZ(Math.PI / 2 - 0.3);
    bg.translate(0, -0.42, 0);
    const brow = new THREE.Mesh(bg, phys(COLORS.hair, { roughness: 0.8 }));
    brow.scale.set(1, 0.9, 0.5);
    brow.castShadow = true;
    const browPivot = new THREE.Group();
    browPivot.add(brow);
    head.add(browPivot);
    eyes.push({ side, ex, ey, look, iris, pupil, upperLid, lowerLid, happyArc, blinkArc, browPivot });
  }

  // beanie: a slouchy ribbed dome, a folded cuff and a leather patch, tilted back
  const beanieMat = shaded(phys(COLORS.beanie, { roughness: 0.9, sheen: 0.6, sheenColor: new THREE.Color(0x5a5a66) }), {},
    `float th = atan(vP.x, vP.z) * 46.0;
     float rib = 0.78 + 0.22 * smoothstep(-0.5, 0.5, sin(th));
     rib = mix(rib, 0.89, clamp(fwidth(th) * 0.6, 0.0, 1.0));
     float knit = vnoise(vP * 160.0);
     diffuseColor.rgb *= rib * (0.9 + 0.2 * knit);`);
  const beanie = new THREE.Group();
  beanie.position.set(0, 0.3, 0);
  beanie.rotation.x = -0.2;
  head.add(beanie);
  const dome = shadowed(new THREE.Mesh(superGeo({ A: 0.76, B: 0.7, C: 0.8, P: 2.15, Q: 2.15, w: 96, h: 64,
    deform: (x, y, z) => [x, Math.max(y, -0.02), z] }), beanieMat));
  dome.position.y = 0.16;
  beanie.add(dome);
  const cuffPts = [];
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI;
    cuffPts.push(new THREE.Vector2(0.74 + 0.05 * Math.sin(a), 0.12 - 0.13 * Math.cos(a)));
  }
  const cuffBand = shadowed(new THREE.Mesh(new THREE.LatheGeometry(cuffPts, 96), beanieMat));
  cuffBand.scale.z = 1.04;
  cuffBand.position.y = -0.0;
  beanie.add(cuffBand);
  const patch = shadowed(new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.11, 0.03, 3, 0.012),
    phys(COLORS.patch, { roughness: 0.55, clearcoat: 0.2 })));
  patch.position.set(0, 0.12, 0.74 * 1.04 + 0.04);
  beanie.add(patch);

  // sweat drop (stress)
  const sweat = new THREE.Group();
  const dropMat = phys(0xcdeeff, { roughness: 0.05, clearcoat: 1, transmission: 0.3, transparent: true, opacity: 0.92 });
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 18), dropMat);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.066, 0.12, 24), dropMat);
  tip.position.y = 0.075;
  sweat.add(drop, tip);
  sweat.position.set(0.58, 0.3, 0.48);
  head.add(sweat);

  // ---------------- arms ----------------
  const arms = [];
  for (const side of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.86, 1.15, 0);
    const delt = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.25, 40, 30), skin));
    delt.scale.set(1.0, 0.78, 0.96);
    delt.position.set(-side * 0.09, -0.15, 0);
    const up = shadowed(new THREE.Mesh(limbGeo(0.6, [[0, 0.225], [0.4, 0.242], [0.75, 0.2], [1, 0.17]]), skin));
    const elbowBall = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.172, 32, 24), skin));
    up.position.y = -0.04;
    up.scale.set(1, 1, 1.06);
    const elbow = new THREE.Group();
    elbow.position.y = -0.64;
    const fore = shadowed(new THREE.Mesh(limbGeo(0.48, [[0, 0.17], [0.22, 0.2], [0.75, 0.15], [1, 0.12]]), skin));
    const wrist = new THREE.Group();
    wrist.position.y = -0.5;
    const hand = shadowed(new THREE.Mesh(superGeo({ A: 0.135, B: 0.17, C: 0.09, P: 2.6, Q: 2.4, w: 40, h: 30 }), skin));
    hand.position.y = -0.15;
    const thumb = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.052, 0.11, 6, 16), skin));
    thumb.position.set(-side * 0.11, -0.09, 0.06);
    thumb.rotation.set(0.35, 0, side * 0.45);
    const finger = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.16, 6, 16), skin));
    finger.position.set(-side * 0.02, -0.34, 0.02);
    wrist.add(hand, thumb, finger);
    elbow.add(elbowBall, fore, wrist);
    shoulder.add(delt, up, elbow);
    upper.add(shoulder);
    arms.push({ side, shoulder, elbow, wrist, finger });
  }
  // phone in the right hand (viewer's right): screen faces him, back faces the camera when he reads it
  const phone = new THREE.Group();
  const phoneBody = shadowed(new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.4, 0.03, 4, 0.03), phys(0x18181b, { roughness: 0.3, clearcoat: 1 })));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.37), new THREE.MeshBasicMaterial({ color: 0xbfe3ff }));
  screen.position.z = 0.017;
  phone.add(phoneBody, screen);
  phone.position.set(-0.02, -0.18, 0.11);
  phone.rotation.set(0.2, Math.PI, 0);
  arms[1].wrist.add(phone);

  function apply(p) {
    root.position.set(p.x, p.y, p.z);
    root.rotation.set(0, p.turn, 0);
    const s = p.squash;
    root.scale.set(p.scale * (1 + s * 0.5), p.scale * (1 - s), p.scale * (1 + s * 0.5));
    upper.rotation.set(p.bend, p.twist, -p.lean, "YXZ");
    headPivot.rotation.set(p.nod, p.headTurn, -p.headTilt, "YXZ");

    for (const L of legs) {
      L.hip.rotation.set(-p.sit * 1.5, 0, -L.side * p.spread * (0.4 + p.sit));
      L.knee.rotation.x = p.sit * 1.5;
      L.ankle.rotation.x = 0;
    }
    for (const e of eyes) {
      const isL = e.side < 0;
      const happy = (isL ? p.happyL : p.happyR) > 0.5;
      const lid = happy ? 1 : isL ? p.lidL : p.lidR, low = happy ? 0 : isL ? p.lowL : p.lowR;
      e.happyArc.visible = happy;
      e.blinkArc.visible = !happy && lid > 0.9;
      e.look.rotation.set(-p.lookY * 0.38, p.lookX * 0.45, 0);
      e.pupil.scale.set(p.pupil, 1.05 * p.pupil, 0.4);
      e.upperLid.rotation.x = THREE.MathUtils.lerp(-1.5, 1.57, THREE.MathUtils.clamp(lid, 0, 1));
      e.lowerLid.rotation.x = THREE.MathUtils.lerp(1.5, -1.57, THREE.MathUtils.clamp(low, 0, 1));
      const by = e.ey + 0.22 + (isL ? p.browLy : p.browRy), ba = isL ? p.browLa : p.browRa;
      e.browPivot.position.set(e.ex, by, headZ(e.ex, by) + 0.01);
      e.browPivot.rotation.set(-0.12, 0, ba * e.side);
    }
    for (const a of arms) {
      const isL = a.side < 0;
      const r = isL ? p.armLr : p.armRr, f = isL ? p.armLf : p.armRf;
      a.shoulder.rotation.set(-f, 0, r * a.side, "YXZ");
      a.elbow.rotation.x = -(isL ? p.elbowL : p.elbowR);
      a.wrist.rotation.y = (isL ? p.wristL : p.wristR) * a.side;
      const pt = isL ? p.pointL : p.pointR;
      a.finger.visible = pt > 0.02;
      a.finger.scale.set(1, Math.max(0.001, pt), 1);
      a.finger.position.y = -0.2 - 0.14 * pt;
    }
    sweat.visible = p.sweat > 0.02;
    sweat.scale.setScalar(Math.max(0.001, p.sweat));
    phone.visible = p.phone > 0.5;
    drawMouth(faceCtx, p);
    faceTex.needsUpdate = true;
  }

  apply(basePose());
  return { root, apply, head, upper, ankles: legs.map((l) => l.ankle) };
}
