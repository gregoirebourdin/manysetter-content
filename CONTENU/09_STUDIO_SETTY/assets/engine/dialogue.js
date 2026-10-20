// Dialogue helpers (layout "set", Grégoire 19/10): the camera goes to whoever talks, the other one reacts, cards (real
// tools) pop beside the speaker, his BOOMs punch in, and after a roast the camera cuts to the roasted one for the "Fahhh".
// In scenes.js (shell.html): const { L, line, reaction, side, punch, bleep, ending, CARD_L, CARD_R } = D;
import { commentBar, notification, endCta } from "./props.js";

export function dialogue(R) {
  const { K, KC, shotTo, shake, tl, face, faceC } = R;
  const L = R.DATA.lines || [];
  // the speaker's framing when a card pops on the other side of the screen
  const CARD_L = { x: 800, dist: 15 }, CARD_R = { x: 310, dist: 17.5, y: 860 };
  /** bottom of the hook title in px (2 or 3 lines): what sits under it must start lower */
  const titleBottom = () => { const h = document.getElementById("hook"); return h ? h.offsetTop + h.offsetHeight : 420; };
  /** a card (stage module) beside the speaker: the stage box shrinks (55 % by default) and moves to one side.
   *  o.scale: bigger for a card in big type (0.62–0.7); o.fit: its top stays under the hook title whatever its height
   *  (a 3-line title covered the cards, 20/10); o.x, o.y: by hand. Without o, exactly as reels 2 and 3. */
  const side = (t, where = "left", o = {}) => {
    const scale = o.scale ?? 0.55, x = o.x ?? (where === "left" ? -262 : 262);
    const y = o.y ?? (o.fit ? Math.max(-110, titleBottom() + 24 - 840 + 360 * scale) : -110); // the stage box spans y 480–1080 around y 840
    tl.set("#stagebox", { scale, x, y }, t);
  };
  /** 💥 a BOOM: punch-in + shake (his BOOM is placed on the same cue in audio.py) */
  const punch = (t, fov = 25) => { K(t - 0.02, 0.08, { cam: { fov } }, "power4.out"); shake(t, 1.1); };
  /** line k: the camera pushes to the speaker, his face; the listener reacts mid-line. shot = framing ({ x, y, dist }) */
  /** the slow, continuous push on whoever talks (Grégoire 20/10: it is what makes the movement): closer and a slight
   *  orbit until `t1`, the framing (x, y) kept; the fov stays free for the BOOM punches */
  // camera moves must never overlap (a "to" tween starts from wherever the camera is when it first renders):
  // a push always ends before the next line's move starts
  const nextMove = (t) => { const n = L.find((ln) => ln.t - 0.2 > t + 0.05); return n ? n.t - 0.21 : Infinity; };
  const push = (t0, t1, who, shot = {}, k = 0.8) => {
    t1 = Math.min(t1, nextMove(t0));
    const f = R.set.frames[who], dist = (shot.dist ?? f.dist) * k, yaw = (shot.yaw ?? f.yaw) + (who === "coach" ? -0.07 : 0.07);
    const { fov, ...cam } = R.camOf(who, { ...shot, dist, yaw });
    K(t0, Math.max(0.3, t1 - t0), { cam }, "sine.inOut");
  };
  function line(k, speakerFace, listenerFace, shot = {}) {
    const ln = L[k], mid = (ln.t + ln.end) / 2;
    shotTo(ln.t - 0.2, ln.who, { dur: 0.28, ...shot });
    K(ln.t - 0.2, 0.001, { cam: { fov: 30 } });
    push(ln.t + 0.08, ln.end + 0.35, ln.who, shot, shot.x ? 0.9 : 0.8); // less with a card beside him
    if (ln.who === "coach") { KC(ln.t - 0.12, 0.25, speakerFace, "back.out(1.6)"); if (listenerFace) K(mid, 0.3, listenerFace); }
    else { K(ln.t - 0.12, 0.25, speakerFace, "back.out(1.6)"); if (listenerFace) KC(mid, 0.3, listenerFace); }
  }
  /** 😩 after a roast: cut to the roasted one's face during the "Fahhh" (who: "coach" or "setty") */
  const reaction = (t, face, who = "coach") => {
    shotTo(t - 0.05, who, { dur: 0.16, ease: "power4.out" });
    push(t + 0.11, t + 1.0, who, {}, 0.86);
    (who === "coach" ? KC : K)(t, 0.2, face, "back.out(2)");
  };
  /** a bleep: the censor bar on the mouth of whoever says the word (Setty also squashes a little); B = DATA.bleeps[k] */
  const bleep = (B) => {
    if (R.DATA.words[B.i]?.who === "coach") {
      KC(B.t - 0.04, 0.12, { censor: 1 }, "back.out(3)");
      KC(B.end + 0.05, 0.1, { censor: 0 });
    } else {
      K(B.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
      K(B.end + 0.05, 0.1, { censor: 0, squash: 0 });
    }
  };

  /** where a point of the set lands on screen in a named shot (its final framing, not the current camera) */
  const screenIn = (shot, p) => {
    const c = R.camOf(shot), cam = new R.THREE.PerspectiveCamera(c.fov, R.W / R.H, 0.1, 100);
    cam.position.set(c.px, c.py, c.pz);
    cam.lookAt(c.ax, c.ay, c.az);
    cam.updateMatrixWorld(true);
    const v = p.clone().project(cam);
    return [(v.x * 0.5 + 0.5) * R.W, (-v.y * 0.5 + 0.5) * R.H];
  };

  /** The CTA ending, the same in every reel (7 of the 8 reels of 20/10 fixed it by hand). Call it right after the CTA
   *  line's line(): Setty winks on "free", the comment bar types the keyword once it is said, under the hook title; back to
   *  the wide; the notification lands once the camera has stopped, where it covers no head; the end pill once the last
   *  caption has gone. Cues: comment, setty_end, free, dms_end, end (templates/reel/build.py). */
  function ending({ settyFace = face("smug", { lookX: -0.8 }), coachFace = faceC("proud", { lookX: 0.5 }), keyword = "SETTY",
    text = "here's how to build your AI setter free 🎁", pill = "Comment SETTY" } = {}) {
    const C = R.C, tb = titleBottom();
    if (C.free != null) K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
    commentBar(R, { keyword, at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
      send: C.setty_end + 0.45, out: C.free != null ? Math.max(C.setty_end + 0.7, C.free - 0.4) : C.setty_end + 0.9 });
    const cb = document.getElementById("comment");
    if (cb) cb.style.top = `${Math.max(565, tb + 24)}px`;
    const stop = C.dms_end + 1.0; // the camera is on the wide from here
    K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
    K(C.dms_end + 0.2, 0.4, settyFace);
    KC(C.dms_end + 0.2, 0.4, coachFace);
    // the heads in the wide: [top, chin] in px, from the real head positions (+0.62: the beanie top, measured on reel11)
    const V = (p, dy) => p.clone().add(new R.THREE.Vector3(0, dy, 0));
    const heads = ["coach", "setty"].map((n) => R.set.frames[n]?.target).filter(Boolean)
      .map((p) => [screenIn("wide", V(p, 0.62))[1] - 20, screenIn("wide", V(p, -0.45))[1] + 12]);
    // the notification (150 px) goes in the room between the title and the highest head, centred, smaller if it must;
    // else under the lowest chin, over the bodies, above the end pill (reel4: it sat on the coach's beanie)
    const H = 150, room = Math.min(...heads.map(([a]) => a), 1170) - tb, below = Math.max(...heads.map(([, b]) => b)) + 20;
    let top = tb + 8, sc = 0.7;
    if (room >= H + 30) [top, sc] = [tb + (room - H) / 2, 1];
    else if (room >= H * 0.75 + 16) { sc = Math.min(1, (room - 16) / H); top = tb + (room - H * sc) / 2; }
    else if (below + H <= 1275) [top, sc] = [below, 1];
    else console.warn(`ending: no room for the notification between the title and the heads (room ${Math.round(room)} px)`);
    notification(R, { title: "setty", text, at: stop });
    const nf = document.getElementById("notif");
    if (nf) { // parked above the screen until it slides in
      nf.style.top = `${Math.round(top)}px`;
      gsap.set(nf, { y: -(top + 260), scale: sc, transformOrigin: "50% 0%" });
    }
    endCta(R, { text: pill, at: C.end + 1.2 }); // after the last caption (it holds 0.9 s)
  }

  return { L, line, reaction, side, punch, push, bleep, ending, screenIn, CARD_L, CARD_R };
}
