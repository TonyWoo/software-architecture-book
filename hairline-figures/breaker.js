/**
 * Breaker: a breaker panel with four switches in a row. The pointer picks
 * the nearest switch; its knob snaps UP the slot like a breaker tripping,
 * and falls back when the pointer leaves. At rest all knobs sit down, the
 * second one bright. The slider is the snap travel.
 *
 * The pattern: discrete items. One fast spring per knob, a hit test on the
 * knobs' rest screen x, and a rest that is a composition.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings,
  spring, stepS, mk, poly, seg, pointer, put, register, disposer, solid,
} = HL;

const SLOTS = [-45, -15, 15, 45];
const DOWN = 8, KH = 16;   // knob bottom at rest, knob height
const KW = 9;              // knob half-width

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;

  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-78, -24, -14], [78, 24, -14], [-78, 24, -14], [78, -24, -14], [0, 0, 82]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  {
    // panel body
    const [pr, pi] = rings(-60, -6, 60, 6, 3, 1.5);
    put(solid(g), prism(P, front, pr, pi, 0, 64));
    // plinth
    const [qr, qi] = rings(-70, -16, 70, 16, 4, 2);
    put(solid(g), prism(P, front, qr, qi, -14, 0));
    // switch plate (thin face on the panel front)
    const plate = mk("path", { class: "nf" }, g);
    plate.setAttribute("d", poly([P(-56, 6.6, 4), P(56, 6.6, 4), P(56, 6.6, 60), P(-56, 6.6, 60)]));
    // slots: vertical grooves the knobs slide in
    const slot = mk("path", { class: "nf" }, g);
    let d = "";
    for (const x of SLOTS) {
      const z0 = DOWN - 3, z1 = DOWN + 52;
      d += seg(P(x - 4.5, 7, z0), P(x + 4.5, 7, z0));
      d += seg(P(x + 4.5, 7, z0), P(x + 4.5, 7, z1));
      d += seg(P(x + 4.5, 7, z1), P(x - 4.5, 7, z1));
      d += seg(P(x - 4.5, 7, z1), P(x - 4.5, 7, z0));
    }
    slot.setAttribute("d", d);
  }

  const knobs = SLOTS.map((x) => {
    const knob = solid(g);
    // fast spring: breakers trip decisively
    const sp = spring(0, { k: 320, c: 30, eps: 0.05 });
    return { x, knob, sp, drawn: NaN };
  });

  function drawKnob(k) {
    const s = k.sp.x;
    if (s === k.drawn) return;
    k.drawn = s;
    const z = DOWN + s;
    const [kr, ki] = rings(k.x - KW, -5, k.x + KW, 7, 2.5, 1.2);
    put(k.knob, prism(P, front, kr, ki, z, z + KH));
  }
  knobs.forEach(drawKnob);

  const B = register(stage, (dt) => {
    let m = false;
    for (const k of knobs) { if (stepS(k.sp, dt)) m = true; drawKnob(k); }
    return m;
  });
  bag.add(B.unregister);

  let act = -1;
  knobs[1].knob.sil.classList.add("hi");

  function setActive(a) {
    if (a === act) return;
    act = a;
    knobs.forEach((k, i) => {
      k.sp.t = i === a ? travel : 0;
      const on = i === a || (a < 0 && i === 1);
      k.knob.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : `breaker ${a + 1}`;
    B.wake();
  }

  // Hit test on the knobs' rest screen x.
  const xs = knobs.map((k) => P(k.x, 0, DOWN + KH / 2)[0]);
  function hit(pt) {
    let best = 0, bd = 1e9;
    xs.forEach((sx, i) => { const d = Math.abs(pt[0] - sx); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => {
      travel = v;
      if (act >= 0) knobs[act].sp.t = v;
      B.wake();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "breaker",
  means: "A breaker panel: the pointer flips a switch and its knob snaps up the slot.",
  rules: [1, 4, 5, 9],
  range: [22, 34, 44],
  mount,
});
