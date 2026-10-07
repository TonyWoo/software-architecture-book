/**
 * Dividers: a tray with one sliding divider, its tab on top the grip.
 * The pointer's x sets the divider on a spring; the read-out names the bay
 * under the pointer. At rest the divider stands left of centre, bright.
 * The slider is the divider's height.
 *
 * The pattern: continuous input. A spring for where, a hit test on the
 * floor plane (which never moves), one moving part.
 */
const {
  Cam, clamp, facing, fit, proj, prism, rings, unproj,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const X0 = -100, X1 = 100, Y0 = -60, Y1 = 60, W = 8, FH = 4, WH = 12;
const REST_X = -20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let divH = value;

  const C = Cam(45, 0.5, 1.6);
  fit(C, [[X0 - 10, Y0 - 10, -6], [X1 + 10, Y1 + 10, -6], [X0, 0, 46], [X1, 0, 46]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  {
    const [or, oi] = rings(X0, Y0, X1, Y1, 10, 2.2);
    const base = solid(g);
    put(base, prism(P, front, or, oi, -6, FH));
    const walls = [
      rings(X0, Y1 - W, X1, Y1, 3, 1), rings(X0, Y0, X1, Y0 + W, 3, 1),
      rings(X0, Y0 + W, X0 + W, Y1 - W, 3, 1), rings(X1 - W, Y0 + W, X1, Y1 - W, 3, 1),
    ];
    for (const [wr, wi] of walls) {
      const wl = solid(g);
      put(wl, prism(P, front, wr, wi, FH, FH + WH));
    }
  }

  const div = solid(g), tab = solid(g);
  const dx = { v: REST_X, sp: spring(REST_X, { eps: 0.05 }) };
  div.sil.classList.add("hi"); tab.sil.classList.add("hi");

  function drawDiv() {
    const x = dx.sp.x;
    const [dr, di] = rings(x - 3, Y0 + W, x + 3, Y1 - W, 2, 0.8);
    put(div, prism(P, front, dr, di, FH, FH + divH));
    const [tr, ti] = rings(x - 9, -7, x + 9, 7, 3, 1);
    put(tab, prism(P, front, tr, ti, FH + divH, FH + divH + 8));
  }
  drawDiv();

  let lastX = NaN;
  const B = register(stage, (dt) => {
    const moving = stepS(dx.sp, dt);
    if (dx.sp.x !== lastX) { lastX = dx.sp.x; drawDiv(); }
    return moving;
  });
  bag.add(B.unregister);

  function setDx(p) {
    const w = unproj(C, p[0], p[1], FH);
    dx.sp.t = clamp(w[0], -80, 80);
    const inTray = w[0] > X0 && w[0] < X1 && w[1] > Y0 && w[1] < Y1;
    read.textContent = !inTray ? "rest" : w[0] < dx.sp.x ? "bay 1" : "bay 2";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => setDx(p),
    leave: () => { dx.sp.t = REST_X; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { divH = v; lastX = NaN; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "dividers",
  means: "A tray with a sliding divider; the pointer sets the boundary.",
  rules: [1, 4, 5, 8],
  range: [14, 22, 30],
  mount,
});
