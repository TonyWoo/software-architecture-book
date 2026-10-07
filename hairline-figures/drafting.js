/**
 * Drafting: a drafting table with a stack of drawings. The pointer picks a
 * sheet by its height; the sheet peels up from its front edge, like a page
 * being lifted to see the one beneath. At rest the sheets lie flat, the top
 * one bright. The slider is the peel angle, in degrees.
 *
 * The pattern: discrete items. One spring per sheet, a hit test on the
 * sheets' rest screen y (which never moves), and a rest that is a
 * composition. Each sheet is a quad rotating about its front edge.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, rad,
  spring, stepS, mk, poly, pointer, put, register, disposer, solid,
} = HL;

const NS = 4;
const SW = 60, SD = 40;        // sheet half-width, half-depth
const SZ0 = 10, GAP = 2.5;     // first sheet z, stacking gap

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let peelDeg = value;

  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-84, -60, -16], [84, 60, -16], [-84, 60, -16], [84, -60, -16], [0, 0, 84]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  {
    // table top
    const [tr, ti] = rings(-70, -50, 70, 50, 3, 1.5);
    put(solid(g), prism(P, front, tr, ti, 0, 6));
    // legs
    for (const [lx, ly] of [[-60, -40], [60, -40], [-60, 40], [60, 40]]) {
      const [lr, li] = rings(lx - 4, ly - 4, lx + 4, ly + 4, 1.5, 0.8);
      put(solid(g), prism(P, front, lr, li, -34, 0));
    }
  }

  // Sheet frame (x, y) -> world, rotated about the front edge (y = +SD) by a.
  const sw = (x, y, z0, a) => {
    const dy = y - SD;
    const c = Math.cos(a), s = Math.sin(a);
    return [x, SD + dy * c, z0 - dy * s];
  };

  const sheets = [];
  for (let i = 0; i < NS; i++) {
    const z0 = SZ0 + i * GAP;
    const sheet = mk("path", { class: "sil" }, g);
    const sp = spring(0, { eps: 0.05 });
    sheets.push({ z0, sheet, sp, drawn: NaN });
  }

  function drawSheet(S) {
    const a = S.sp.x;
    if (a === S.drawn) return;
    S.drawn = a;
    const q = (x, y) => P(...sw(x, y, S.z0, a));
    S.sheet.setAttribute("d", poly([
      q(-SW, SD), q(SW, SD), q(SW, -SD), q(-SW, -SD),
    ]));
  }
  sheets.forEach(drawSheet);

  const B = register(stage, (dt) => {
    let m = false;
    for (const S of sheets) { if (stepS(S.sp, dt)) m = true; drawSheet(S); }
    return m;
  });
  bag.add(B.unregister);

  let act = -1;
  sheets[NS - 1].sheet.classList.add("hi");

  function setActive(a) {
    if (a === act) return;
    act = a;
    sheets.forEach((S, i) => {
      S.sp.t = i === a ? rad(peelDeg) : 0;
      const on = i === a || (a < 0 && i === NS - 1);
      S.sheet.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : `view ${a + 1}`;
    B.wake();
  }

  // rest screen-y of each sheet centre: the pick never moves (rule 01)
  const restY = sheets.map((S) => P(0, 0, S.z0)[1]);
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
    set: (v) => {
      peelDeg = v;
      if (act >= 0) sheets[act].sp.t = rad(v);
      B.wake();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "drafting",
  means: "A drafting table: the pointer peels a drawing up from the stack.",
  rules: [1, 4, 5, 9],
  range: [30, 50, 70],
  mount,
});
