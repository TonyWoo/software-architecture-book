/**
 * Ballot: three ballot boxes in a row. The pointer paints votes: each box
 * it touches keeps its vote, a ballot card rising from its slot, until the
 * pointer leaves and the box is empty again. Two votes is a quorum. At rest
 * the boxes stand empty, the middle one bright. The slider is how far a
 * ballot rises.
 *
 * The pattern: discrete items with latched state. Votes accumulate under
 * the pointer; leaving clears them. A pick by screen x on the rest pose.
 */
const {
  Cam, clamp, facing, fit, proj, prism, rings, unproj,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const N = 3, BX = [-46, 0, 46], BW = 30, BD = 30, BH = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let cardH = value;

  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-76, -30, 0], [76, 30, 0], [-76, 30, 0], [76, -30, 0], [0, 0, BH + 26]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const boxes = BX.map((x) => {
    const [br, bi] = rings(x - BW / 2, -BD / 2, x + BW / 2, BD / 2, 4, 1.4);
    const box = solid(g);
    put(box, prism(P, front, br, bi, 0, BH));
    // slot on the lid
    const slot = mk("path", { class: "nf lo" }, g);
    const s0 = P(x - 10, 0, BH), s1 = P(x + 10, 0, BH);
    slot.setAttribute("d", `M${s0[0]} ${s0[1]}L${s1[0]} ${s1[1]}`);
    // ballot card, drawn per frame while rising
    const card = solid(g);
    return { x, box, slot, card, voted: false, sp: spring(0, { eps: 0.05 }), drawn: NaN };
  });

  function drawCard(b) {
    const h = Math.max(0, b.sp.x);
    if (h === b.drawn) return;
    b.drawn = h;
    if (h < 0.5) { put(b.card, { sil: "", crease: "" }); return; }
    const [cr, ci] = rings(b.x - 11, -1.5, b.x + 11, 1.5, 2, 0.7);
    put(b.card, prism(P, front, cr, ci, BH - 2, BH + h));
  }
  boxes.forEach(drawCard);

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of boxes) { if (stepS(b.sp, dt)) m = true; drawCard(b); }
    return m;
  });
  bag.add(B.unregister);

  const restX = boxes.map((b) => P(b.x, 0, BH / 2)[0]);

  function refresh() {
    const n = boxes.filter((b) => b.voted).length;
    boxes.forEach((b, i) => {
      b.sp.t = b.voted ? cardH : 0;
      b.box.sil.classList.toggle("hi", b.voted || (n === 0 && i === 1));
    });
    read.textContent = n === 0 ? "rest" : `votes ${n}/3`;
    B.wake();
  }

  function pick(x) {
    let best = 0, bd = 1e9;
    restX.forEach((sx, i) => { const d = Math.abs(x - sx); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const i = pick(p[0]);
      if (!boxes[i].voted) { boxes[i].voted = true; refresh(); }
    },
    leave: () => { boxes.forEach((b) => (b.voted = false)); refresh(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { cardH = v; refresh(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "ballot",
  means: "Three ballot boxes; the pointer paints votes, two is a quorum.",
  rules: [1, 4, 5, 9],
  range: [10, 18, 28],
  mount,
});
