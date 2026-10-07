/**
 * Net: a fishing net hung from a pole, its rows sagging. The pointer picks
 * the nearest knot; it takes the bright stroke, its links go bright, the
 * knots within reach stay plain and the rest of the net dims. At rest the
 * upper-middle knot is bright. The slider is how far the highlight reaches,
 * in rings.
 *
 * The pattern: one of many. Nothing moves; only strokes change. The pick is
 * by screen distance against the knots, which never move.
 */
const {
  Cam, facing, fit, proj, prism, rings, circ,
  mk, pointer, put, register, disposer, solid, seg,
} = HL;

const COLS = 5, ROWS = 4, SX = 34, SZ = 28, TOPZ = 110, SAG = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let spread = Math.round(value);

  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-85, -8, 24], [85, 8, 24], [-85, 8, 24], [85, -8, 24], [0, 0, 126]], 200, 168);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  {
    const [pr, pi] = rings(-85, -4, 85, 4, 4, 1.4);
    const pole = solid(g);
    put(pole, prism(P, front, pr, pi, TOPZ + 6, TOPZ + 14));
    for (const x of [-68, 68]) {
      const a = P(x, 0, TOPZ + 6), b = P(x, 0, TOPZ);
      const rope = mk("path", { class: "nf" }, g);
      rope.setAttribute("d", seg(a, b));
    }
  }

  const X = (c) => (c - (COLS - 1) / 2) * SX;
  const Z = (c, r) => TOPZ - r * SZ - SAG * Math.sin((Math.PI * c) / (COLS - 1));
  const key = (c, r) => r * COLS + c;

  const nodes = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const [sx, sy] = P(X(c), 0, Z(c, r));
    const el = mk("circle", { cx: sx, cy: sy, r: 4, class: "nf" }, g);
    nodes.push({ c, r, el, sx, sy });
  }
  const links = [];
  const addLink = (a, b) => {
    const el = mk("path", { class: "nf" }, g);
    el.setAttribute("d", seg([nodes[a].sx, nodes[a].sy], [nodes[b].sx, nodes[b].sy]));
    links.push({ a, b, el });
  };
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (c + 1 < COLS) addLink(key(c, r), key(c + 1, r));
    if (r + 1 < ROWS) addLink(key(c, r), key(c, r + 1));
  }
  // paint order: links under knots
  links.forEach((l) => g.prepend(l.el));

  const adj = nodes.map(() => []);
  links.forEach((l) => { adj[l.a].push(l.b); adj[l.b].push(l.a); });

  function neighbourhood(k) {
    const dist = new Map([[k, 0]]);
    const q = [k];
    while (q.length) {
      const n = q.shift();
      if (dist.get(n) >= spread) continue;
      for (const m of adj[n]) if (!dist.has(m)) { dist.set(m, dist.get(n) + 1); q.push(m); }
    }
    return dist;
  }

  let act = -2;
  function setActive(k) {
    if (k === act) return;
    act = k;
    const dist = k < 0 ? new Map() : neighbourhood(k);
    const restK = key(2, 1);
    nodes.forEach((n, i) => {
      const d = dist.get(i);
      n.el.setAttribute("class", i === k ? "nf hi" : d !== undefined ? "nf" : k < 0 && i === restK ? "nf hi" : "nf lo");
    });
    links.forEach((l) => {
      const da = dist.get(l.a), db = dist.get(l.b);
      l.el.setAttribute("class", l.a === k || l.b === k ? "hi" : da !== undefined && db !== undefined ? "nf" : "nf lo");
    });
    const n = nodes[k];
    read.textContent = k < 0 ? "rest" : `node ${n.c + 1}·${n.r + 1}`;
  }
  setActive(-1);

  function pick(x, y) {
    let best = 0, bd = 1e9;
    nodes.forEach((n, i) => {
      const d = (x - n.sx) ** 2 + (y - n.sy) ** 2;
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  bag.add(pointer(stage, {
    move: (p) => setActive(pick(p[0], p[1])),
    leave: () => setActive(-1),
  }));
  const B = register(stage, () => false);
  bag.add(B.unregister);
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { spread = Math.round(v); if (act >= 0) { const a = act; act = -2; setActive(a); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "net",
  means: "A hung net; the pointer picks a knot and the light spreads.",
  rules: [1, 4, 5, 10],
  range: [1, 2, 3],
  mount,
});
