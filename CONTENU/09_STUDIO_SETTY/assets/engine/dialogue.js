// Dialogue helpers (layout "set", Grégoire 19/10): the camera goes to whoever talks, the other one reacts, cards (real
// tools) pop beside the speaker, his BOOMs punch in, and after a roast the camera cuts to the roasted one for the "Fahhh".
// In scenes.js (shell.html): const { L, line, reaction, side, punch, CARD_L, CARD_R } = D;
export function dialogue(R) {
  const { K, KC, shotTo, shake, tl } = R;
  const L = R.DATA.lines || [];
  // the speaker's framing when a card pops on the other side of the screen
  const CARD_L = { x: 800, dist: 15 }, CARD_R = { x: 310, dist: 17.5, y: 860 };
  /** a card (stage module) beside the speaker: the stage box shrinks to 55 % and moves to one side */
  const side = (t, where = "left") => tl.set("#stagebox", { scale: 0.55, x: where === "left" ? -262 : 262, y: -110 }, t);
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
  return { L, line, reaction, side, punch, push, CARD_L, CARD_R };
}
