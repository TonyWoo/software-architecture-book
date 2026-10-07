/**
 * Drawers: a four-drawer filing cabinet. The pointer's height picks the
 * nearest drawer; it slides out on a spring, its box drawn only where it
 * has left the carcass, and it takes the bright stroke. At rest the second
 * drawer stands a crack open. The slider is how far a drawer pulls out.
 *
 * The pattern: discrete items. Springs, a pick by screen y against the rest
 * pose (which never moves), honest paint order: carcass, then drawers.
 */
const {
  Cam, clamp, facing, fit, proj, prism, rings, unproj,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const N = 4, CW = 76, CD = 54, CH = 96, DW = 68, DH = 20;
const DZ = (i) => 70 - i * 22;
const FRONT = 27;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let slideMax = value;

  const C = Cam(45, 0.5, 1.65);
  fit(C, [[-48, -37, 0], [48, 80, 0], [-48, 80, 0], [48, -37, 0], [0, 0, CH + 6]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  {
    const [cr, ci] = rings(-CW / 2, -CD / 2, CW / 2, CD / 2, 6, 1.8);
    const carcass = solid(g);
    put(carcass, prism(P, front, cr, ci, 0, CH));
    const [tr, ti] = rings(-CW / 2 - 3, -CD / 2 - 3, CW / 2 + 3, CD / 2 + 3, 7, 2);
    const top = solid(g);
    put(top, prism(P, front, tr, ti, CH, CH + 5));
  }

  const drawers = [];
  for (let i = 0; i < N; i++) {
    const z0 = DZ(i);
    const panel = solid(g), handle = solid(g);
    const sideL = solid(g), sideR = solid(g), bottom = solid(g);
    drawers.push({ z0, panel, handle, sideL, sideR, bottom, sp: spring(0, { eps: 0.05 }), drawn: NaN });
    drawDrawer(drawers[i]);
  }

  function drawDrawer(d) {
    const s = Math.max(0, d.sp.x);
    if (s === d.drawn) return;
    d.drawn = s;
    const [pr, pi] = rings(-DW / 2, FRONT + s, DW / 2, FRONT + 4 + s, 2, 0.8);
    put(d.panel, prism(P, front, pr, pi, d.z0, d.z0 + DH));
    const [hr, hi] = rings(-10, FRONT + 4 + s, 10, FRONT + 8 + s, 2, 0.8);
    put(d.handle, prism(P, front, hr, hi, d.z0 + 8, d.z0 + 12));
    if (s > 1) {
      const [lr, li] = rings(-DW / 2 + 4, FRONT, -DW / 2 + 6, FRONT + s, 1, 0.5);
      put(d.sideL, prism(P, front, lr, li, d.z0, d.z0 + 12));
      const [rr, ri] = rings(DW / 2 - 6, FRONT, DW / 2 - 4, FRONT + s, 1, 0.5);
      put(d.sideR, prism(P, front, rr, ri, d.z0, d.z0 + 12));
      const [br, bi] = rings(-DW / 2 + 4, FRONT, DW / 2 - 4, FRONT + s, 1, 0.5);
      put(d.bottom, prism(P, front, br, bi, d.z0, d.z0 + 2));
    } else {
      for (const q of [d.sideL, d.sideR, d.bottom]) put(q, { sil: "", crease: "" });
    }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const d of drawers) { if (stepS(d.sp, dt)) m = true; drawDrawer(d); }
    return m;
  });
  bag.add(B.unregister);

  const restY = drawers.map((d) => P(0, FRONT, d.z0 + DH / 2)[1]);

  let act = -2;

  function setActive(a) {
    if (a === act) return;
    act = a;
    drawers.forEach((d, i) => {
      d.sp.t = i === a ? slideMax : i === 1 ? 6 : 0;
      const on = i === a || (a < 0 && i === 1);
      d.panel.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : `shard ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  function pick(y) {
    let best = 0, bd = 1e9;
    restY.forEach((sy, i) => { const d = Math.abs(y - sy); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  bag.add(pointer(stage, {
    move: (p) => setActive(pick(p[1])),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { slideMax = v; if (act >= 0) drawers[act].sp.t = v; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "drawers",
  means: "A filing cabinet: the pointer's height pulls a drawer out.",
  rules: [1, 4, 5, 8],
  range: [18, 36, 48],
  mount,
});
