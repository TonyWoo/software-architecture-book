/**
 * Fence: a fence of posts and rails with two gates. The pointer picks the
 * nearest gate; it swings open on its hinge on a spring, its diagonal brace
 * riding on it, and it takes the bright stroke. At rest the left gate
 * stands a crack open. The slider is how far a gate swings, in degrees.
 *
 * The pattern: discrete items. Springs, a pick by screen x against the rest
 * pose (which never moves); each gate drawn per frame from its angle.
 */
const {
  Cam, clamp, facing, fit, proj, prism, rings, unproj, rad,
  spring, stepS, mk, poly, seg, pointer, put, register, disposer, solid,
} = HL;

const POSTS = [-80, -40, 0, 40, 80];
const GATES = [0, 3];
const PH = 44, GH0 = 10, GH1 = 34, GU0 = 4, GU1 = 36, GT = 1.3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let openMax = value;

  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-94, -30, 0], [94, 50, 0], [-94, 50, 0], [94, -30, 0], [0, 0, PH + 4]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  for (const x of POSTS) {
    const [pr, pi] = rings(x - 4, -4, x + 4, 4, 2, 0.8);
    const post = solid(g);
    put(post, prism(P, front, pr, pi, 0, PH));
  }
  for (const s of [1, 2]) {
    for (const z of [13, 31]) {
      const [rr, ri] = rings(POSTS[s] + 4, -2, POSTS[s + 1] - 4, 2, 1.5, 0.6);
      const rail = solid(g);
      put(rail, prism(P, front, rr, ri, z, z + 4));
    }
  }

  const gates = GATES.map((s) => {
    const hx = POSTS[s];
    const back = mk("path", { class: "sil" }, g);
    const face = mk("path", { class: "sil" }, g);
    const brace = mk("path", { class: "nf" }, g);
    return { hx, back, face, brace, sp: spring(0, { eps: 0.05 }), drawn: NaN };
  });

  function drawGate(gt) {
    const a = Math.max(0, gt.sp.x);
    if (a === gt.drawn) return;
    gt.drawn = a;
    const t = rad(a), c = Math.cos(t), s = Math.sin(t);
    // gate frame: u from hinge, z up; n is the panel normal
    const pt = (u, z, n) => [gt.hx + u * c - n * s, u * s + n * c, z];
    const q = (u, z, n) => P(...pt(u, z, n));
    gt.back.setAttribute("d", poly([q(GU0, GH0, -GT), q(GU1, GH0, -GT), q(GU1, GH1, -GT), q(GU0, GH1, -GT)]));
    gt.face.setAttribute("d", poly([q(GU0, GH0, GT), q(GU1, GH0, GT), q(GU1, GH1, GT), q(GU0, GH1, GT)]));
    gt.brace.setAttribute("d", seg(q(7, GH0 + 2, GT + 0.2), q(GU1 - 2, GH1 - 2, GT + 0.2)));
  }
  gates.forEach(drawGate);

  const B = register(stage, (dt) => {
    let m = false;
    for (const gt of gates) { if (stepS(gt.sp, dt)) m = true; drawGate(gt); }
    return m;
  });
  bag.add(B.unregister);

  const restX = gates.map((gt) => P(gt.hx + 20, 0, 23)[0]);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    gates.forEach((gt, i) => {
      gt.sp.t = i === a ? openMax : i === 0 ? 12 : 0;
      const on = i === a || (a < 0 && i === 0);
      gt.face.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : `gate ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  function pick(x) {
    let best = 0, bd = 1e9;
    restX.forEach((sx, i) => { const d = Math.abs(x - sx); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  bag.add(pointer(stage, {
    move: (p) => setActive(pick(p[0])),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { openMax = v; if (act >= 0) gates[act].sp.t = v; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "fence",
  means: "A fence with two gates; the pointer swings one open.",
  rules: [1, 4, 5, 8],
  range: [45, 70, 95],
  mount,
});
