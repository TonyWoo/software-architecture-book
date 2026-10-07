/**
 * Footings: five foundation piers on a plinth carry a cambered beam, one
 * segment per pier. The pointer picks the nearest pier; its shaft sinks into
 * its pad on a spring, its beam segment follows it down, and it takes the
 * bright stroke. At rest the piers stand at slightly varied heights, arching
 * the beam, the middle pier bright. The slider is the sink depth.
 *
 * The pattern: discrete items. Springs, a hit test on the ground plane
 * (pier centres never move in x), and a rest that is a composition.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS,
  mk, pointer, put, register, disposer, solid,
} = HL;

const N = 5, STEP = 40, PAD = 12, SHAFT = 7.5, BH = 10, BD = 18, PB = 8;
const PX = (i) => (i - (N - 1) / 2) * STEP;
const H0 = [34, 40, 44, 40, 34];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sinkMax = value;

  const C = Cam(45, 0.5, 1.5);
  const X0 = PX(0) - STEP / 2, X1 = PX(N - 1) + STEP / 2;
  fit(C, [[X0 - 12, -30, -PB], [X1 + 12, 30, -PB], [X0 - 12, 30, -PB], [X1 + 12, -30, -PB], [0, 0, 58]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  {
    const [pr, pi] = rings(X0 - 12, -30, X1 + 12, 30, 8, 2);
    put(solid(g), prism(P, front, pr, pi, -PB, 0));
  }

  const piers = [];
  for (let i = 0; i < N; i++) {
    const x = PX(i);
    const padR = rings(x - PAD, -PAD, x + PAD, PAD, 3, 1.2);
    const shR = rings(x - SHAFT, -SHAFT, x + SHAFT, SHAFT, 2.5, 1);
    const bmR = rings(x - STEP / 2, -BD / 2, x + STEP / 2, BD / 2, 2.5, 1);
    const pad = solid(g), shaft = solid(g), beam = solid(g);
    put(pad, prism(P, front, padR[0], padR[1], 0, 6));
    piers.push({ x, h0: H0[i], shR, bmR, pad, shaft, beam, sp: spring(0, { eps: 0.03 }), drawn: NaN });
    drawPier(piers[i]);
  }

  function drawPier(p) {
    const s = Math.max(0, p.sp.x);
    if (s === p.drawn) return;
    p.drawn = s;
    const h = p.h0 - s;
    put(p.shaft, prism(P, front, p.shR[0], p.shR[1], 6, h));
    put(p.beam, prism(P, front, p.bmR[0], p.bmR[1], h, h + BH));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const p of piers) { if (stepS(p.sp, dt)) m = true; drawPier(p); }
    return m;
  });
  bag.add(B.unregister);

  let act = -1;
  piers[2].shaft.sil.classList.add("hi");

  function setActive(a) {
    if (a === act) return;
    act = a;
    piers.forEach((p, i) => {
      const d = Math.abs(i - a);
      p.sp.t = a < 0 ? 0 : d === 0 ? sinkMax : d === 1 ? sinkMax * 0.45 : 0;
      const on = i === a || (a < 0 && i === 2);
      p.shaft.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : `pier ${a + 1}`;
    B.wake();
  }

  // Hit test on the rest top-centres' screen x (rule 01): the ground plane
  // would land behind a raised pier top and pick the wrong one.
  const topsX = piers.map((p) => P(p.x, 0, p.h0)[0]);
  function hit(pt) {
    let best = 0, bd = 1e9;
    topsX.forEach((sx, i) => { const d = Math.abs(pt[0] - sx); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => {
      sinkMax = v;
      if (act >= 0) piers.forEach((p, i) => {
        const d = Math.abs(i - act);
        p.sp.t = d === 0 ? v : d === 1 ? v * 0.45 : 0;
      });
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "footings",
  means: "Five footings carry a cambered beam; the pier under the pointer sinks under the load.",
  rules: [1, 4, 5, 9],
  range: [6, 12, 20],
  mount,
});
