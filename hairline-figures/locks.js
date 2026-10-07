/**
 * Locks: a flight of three canal locks stepping down. Each chamber holds
 * its water high; the pointer picks a lock, its sluice gate lifts, and the
 * water drops one step to the next level. At rest the gates sit closed and
 * the water steps down, the middle gate bright. The slider is the drop.
 *
 * The pattern: discrete items. One spring per gate (fast lift) and one per
 * water surface, a hit test on the chambers' screen x, and a rest that is
 * a composition.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings,
  spring, stepS, mk, poly, pointer, put, register, disposer, solid,
} = HL;

const CX = [-56, 0, 56];       // chamber centres (x)
const GX = [-28, 28, 84];      // sluice gates (downstream of each chamber)
const W0 = [24, 17, 10];       // water levels at rest (stepping down)
const WALL_H = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let drop = value;

  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-92, -26, -8], [96, 26, -8], [-92, 26, -8], [96, -26, -8], [0, 0, 52]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  {
    // side walls (continuous)
    const [r1, i1] = rings(-80, -20, 88, -16, 2, 1);
    put(solid(g), prism(P, front, r1, i1, 0, WALL_H));
    const [r2, i2] = rings(-80, 16, 88, 20, 2, 1);
    put(solid(g), prism(P, front, r2, i2, 0, WALL_H));
    // upstream end wall
    const [r3, i3] = rings(-84, -20, -80, 20, 2, 1);
    put(solid(g), prism(P, front, r3, i3, 0, WALL_H));
    // chamber floors (thin, just to ground them)
    for (const x of CX) {
      const [rf, fi] = rings(x - 24, -16, x + 24, 16, 2, 1);
      const fl = solid(g);
      put(fl, prism(P, front, rf, fi, -4, 0));
      fl.sil.classList.add("lo");
    }
  }

  // Gates: sluice panels that lift.
  const gates = GX.map((x) => {
    const gate = solid(g);
    const sp = spring(0, { k: 200, c: 24, eps: 0.05 });
    return { x, gate, sp, drawn: NaN };
  });

  function drawGate(Gt) {
    const s = Gt.sp.x;
    if (s === Gt.drawn) return;
    Gt.drawn = s;
    const [gr, gi] = rings(Gt.x - 2, -16, Gt.x + 2, 16, 1.5, 0.8);
    put(Gt.gate, prism(P, front, gr, gi, s, s + 22));
  }
  gates.forEach(drawGate);

  // Water surfaces: flat plates that drop.
  const waters = CX.map((x, i) => {
    const w = mk("path", { class: "nf" }, g);
    const sp = spring(W0[i], { eps: 0.05 });
    return { x, w, sp, drawn: NaN };
  });

  function drawWater(Wt) {
    const z = Wt.sp.x;
    if (z === Wt.drawn) return;
    Wt.drawn = z;
    const x0 = Wt.x - 22, x1 = Wt.x + 22;
    Wt.w.setAttribute("d", poly([
      P(x0, -15, z), P(x1, -15, z), P(x1, 15, z), P(x0, 15, z),
    ]));
  }
  waters.forEach(drawWater);

  const B = register(stage, (dt) => {
    let m = false;
    for (const Gt of gates) { if (stepS(Gt.sp, dt)) m = true; drawGate(Gt); }
    for (const Wt of waters) { if (stepS(Wt.sp, dt)) m = true; drawWater(Wt); }
    return m;
  });
  bag.add(B.unregister);

  let act = -1;
  gates[1].gate.sil.classList.add("hi");

  function setActive(a) {
    if (a === act) return;
    act = a;
    gates.forEach((Gt, i) => {
      Gt.sp.t = i === a ? 18 : 0;
      const on = i === a || (a < 0 && i === 1);
      Gt.gate.sil.classList.toggle("hi", on);
    });
    waters.forEach((Wt, i) => {
      Wt.sp.t = i === a ? W0[i] - drop : W0[i];
    });
    read.textContent = a < 0 ? "rest" : `lock ${a + 1}`;
    B.wake();
  }

  // Hit test on the chambers' water screen x.
  const xs = CX.map((x) => P(x, 0, 17)[0]);
  function hit(pt) {
    let best = 0, bd = 1e9;
    xs.forEach((sx, i) => { const d = Math.abs(pt[0] - sx); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => {
      drop = v;
      if (act >= 0) waters[act].sp.t = W0[act] - v;
      B.wake();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "locks",
  means: "A flight of canal locks: the pointer lifts a sluice gate and the water drops a step.",
  rules: [1, 4, 5, 9],
  range: [5, 7, 10],
  mount,
});
