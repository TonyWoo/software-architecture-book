/**
 * Layers: four plates stacked with a tab on each front edge. The pointer's
 * x scrubs the gap between them on a spring; its y picks a layer, which
 * takes the bright stroke. At rest the stack stands slightly open, the
 * second layer bright. The slider is the widest gap.
 *
 * The pattern: scrub and pick. A spring for the continuous gap, a pick by
 * screen y against the rest pose (which never moves).
 */
const {
  Cam, clamp, facing, fit, proj, prism, rings, unproj,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const N = 4, PW = 160, PD = 100, PH = 8, REST_G = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxGap = value;

  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-95, -60, 0], [95, 60, 0], [-95, 60, 0], [95, -60, 0], [0, 0, 170]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const layers = [];
  for (let i = 0; i < N; i++) {
    const pr = rings(-PW / 2, -PD / 2, PW / 2, PD / 2, 6, 1.6);
    const tr = rings(-10, PD / 2, 10, PD / 2 + 7, 2, 0.8);
    const plate = solid(g), tab = solid(g);
    layers.push({ pr, tr, plate, tab });
  }
  // paint back to front: bottom layer first (they only overlap when closed)
  layers.forEach((L) => { g.append(L.plate.g); g.append(L.tab.g); });

  const gap = { sp: spring(REST_G, { eps: 0.05 }) };

  function drawLayers() {
    const gr = Math.max(0, gap.sp.x);
    layers.forEach((L, i) => {
      const z0 = i * (PH + gr);
      put(L.plate, prism(P, front, L.pr[0], L.pr[1], z0, z0 + PH));
      put(L.tab, prism(P, front, L.tr[0], L.tr[1], z0 + 2, z0 + 6));
    });
  }
  drawLayers();

  let lastG = NaN;
  const B = register(stage, (dt) => {
    const moving = stepS(gap.sp, dt);
    if (gap.sp.x !== lastG) { lastG = gap.sp.x; drawLayers(); }
    return moving;
  });
  bag.add(B.unregister);

  // rest screen-y of each layer centre: the pick never moves (rule 01)
  const restY = layers.map((_, i) => P(0, 0, i * (PH + REST_G) + PH / 2)[1]);

  let act = 1;
  layers[1].plate.sil.classList.add("hi"); layers[1].tab.sil.classList.add("hi");

  function setPick(a) {
    if (a === act) return;
    act = a;
    layers.forEach((L, i) => {
      const on = a < 0 ? i === 1 : i === a;
      L.plate.sil.classList.toggle("hi", on);
      L.tab.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : `layer ${a + 1}`;
    B.wake();
  }

  function pick(y) {
    let best = 0, bd = 1e9;
    restY.forEach((sy, i) => { const d = Math.abs(y - sy); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  bag.add(pointer(stage, {
    move: (p) => {
      gap.sp.t = clamp((p[0] / 400) * maxGap, 0, maxGap);
      setPick(pick(p[1]));
      B.wake();
    },
    leave: () => { gap.sp.t = REST_G; setPick(-1); B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { maxGap = v; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "layers",
  means: "Four plates: the pointer spreads the gap and picks a layer.",
  rules: [1, 4, 5, 8],
  range: [10, 24, 40],
  mount,
});
