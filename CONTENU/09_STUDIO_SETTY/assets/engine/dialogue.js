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
  function line(k, speakerFace, listenerFace, shot = {}) {
    const ln = L[k], mid = (ln.t + ln.end) / 2;
    shotTo(ln.t - 0.2, ln.who, { dur: 0.28, ...shot });
    K(ln.t - 0.2, 0.001, { cam: { fov: 30 } });
    if (ln.who === "coach") { KC(ln.t - 0.12, 0.25, speakerFace, "back.out(1.6)"); if (listenerFace) K(mid, 0.3, listenerFace); }
    else { K(ln.t - 0.12, 0.25, speakerFace, "back.out(1.6)"); if (listenerFace) KC(mid, 0.3, listenerFace); }
  }
  /** 😩 after a roast: cut to the roasted one's face during the "Fahhh" (who: "coach" or "setty") */
  const reaction = (t, face, who = "coach") => {
    shotTo(t - 0.05, who, { dur: 0.16, ease: "power4.out" });
    (who === "coach" ? KC : K)(t, 0.2, face, "back.out(2)");
  };
  return { L, line, reaction, side, punch, CARD_L, CARD_R };
}
