/**
 * Keystone: a stone arch, the cover figure. Four voussoirs spring from two
 * piers, leaving a gap at the crown. The keystone hovers above it at rest;
 * the pointer's height slides it down into the gap — push it in and the
 * arch stands complete. Let go and it rises back out.
 *
 * The pattern: continuous input. One spring for the keystone's height, the
 * pointer's screen y driving it, and a rest that is a composition (the open
 * crown). Drawn as a flat elevation, in the book's blueprint spirit.
 */
const {
  Cam, clamp, fit, proj, rings, rad,
  spring, stepS, mk, poly, pointer, put, register, disposer, solid,
} = HL;

const CZ = 34;                 // arch centre height (top of piers)
const R0 = 26, R1 = 40;        // intrados / extrados radii
// voussoir angle spans (degrees, from +x axis); the crown [75,105] is the keystone
const SPANS = [[15, 45], [45, 75], [105, 135], [135, 165]];
const KEY = [75, 105];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;

  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-64, -20, -14], [64, 20, -14], [-64, 20, -14], [64, -20, -14], [0, 0, 104]], 200, 166);
  const P = proj(C);

  const g = mk("g", {}, svg);
  {
    // plinth (flat, in the elevation plane)
    const pl = mk("path", { class: "sil" }, g);
    pl.setAttribute("d", poly([P(-58, 0, -14), P(58, 0, -14), P(58, 0, 0), P(-58, 0, 0)]));
    // piers
    for (const sx of [-1, 1]) {
      const pier = mk("path", { class: "sil" }, g);
      const x0 = sx < 0 ? -48 : 32, x1 = sx < 0 ? -32 : 48;
      pier.setAttribute("d", poly([P(x0, 0, 0), P(x1, 0, 0), P(x1, 0, CZ), P(x0, 0, CZ)]));
    }
  }

  // Wedge corners in the x-z plane for an angle span, lifted by dz.
  const wedge = (a0, a1, dz) => {
    const r0 = rad(a0), r1 = rad(a1);
    return [
      P(R0 * Math.cos(r0), 0, CZ + dz + R0 * Math.sin(r0)),
      P(R0 * Math.cos(r1), 0, CZ + dz + R0 * Math.sin(r1)),
      P(R1 * Math.cos(r1), 0, CZ + dz + R1 * Math.sin(r1)),
      P(R1 * Math.cos(r0), 0, CZ + dz + R1 * Math.sin(r0)),
    ];
  };

  // Static voussoirs.
  for (const [a0, a1] of SPANS) {
    const s = mk("path", { class: "sil" }, g);
    s.setAttribute("d", poly(wedge(a0, a1, 0)));
  }

  // Keystone: slides in z on a spring.
  const key = mk("path", { class: "sil hi" }, g);
  const ksp = spring(travel, { eps: 0.05 });

  function drawKey() {
    const dz = ksp.x;
    if (dz === drawKey.last) return;
    drawKey.last = dz;
    key.setAttribute("d", poly(wedge(KEY[0], KEY[1], dz)));
  }
  drawKey.last = NaN;
  drawKey();

  const B = register(stage, (dt) => {
    const m = stepS(ksp, dt);
    if (m) drawKey();
    return m;
  });
  bag.add(B.unregister);

  // Pointer height -> keystone height. High pointer: keystone out (up).
  // Low pointer: pushed in (down).
  let lastT = 0;   // 0 = out, 1 = in
  function setFromY(py) {
    lastT = clamp((py - 80) / 160, 0, 1);
    ksp.t = (1 - lastT) * travel;
    read.textContent = "keystone";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => setFromY(p[1]),
    leave: () => { lastT = 0; ksp.t = travel; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => {
      travel = v;
      ksp.t = (1 - lastT) * v;
      B.wake();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "keystone",
  means: "A stone arch: the pointer slides the keystone down into the crown.",
  rules: [1, 4, 5, 9],
  range: [12, 18, 26],
  mount,
});
