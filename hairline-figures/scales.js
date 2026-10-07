/**
 * Scales: a balance on a pillar. The pointer's x slides a saddle weight
 * along the beam on a spring; the beam tips toward it, the two pans hang
 * level from its ends, and the weight keeps the bright stroke. At rest the
 * weight sits slightly right of centre, the beam tipped a little. The
 * slider is how far it tips, in degrees.
 *
 * The pattern: continuous input. A spring for where, a hit test on the
 * beam's rest plane (which never moves), and the beam drawn as three quads
 * from its eight rotated corners.
 */
const {
  Cam, clamp, facing, fit, proj, prism, rings, circ, ringAt, unproj, rad,
  spring, stepS, mk, open, poly, seg, pointer, put, register, disposer, solid,
} = HL;

const BC = 75, BL = 85, BT = 3, BD = 4;
const PAN_R = 15, DROP = 26, PB = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tiltMax = value;

  const C = Cam(45, 0.5, 1.45);
  fit(C, [[-110, -34, -PB], [110, 34, -PB], [-110, 34, -PB], [110, -34, -PB], [0, 0, BC + 22]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  {
    const [pr, pi] = rings(-60, -30, 60, 30, 8, 2);
    const plinth = solid(g);
    put(plinth, prism(P, front, pr, pi, -PB, 0));
    const [fr, fi] = rings(-7, -7, 7, 7, 2.5, 1);
    const pillar = solid(g);
    put(pillar, prism(P, front, fr, fi, 0, BC - BT));
    const [qr, qi] = rings(-13, -13, 13, 13, 3, 1.2);
    const foot = solid(g);
    put(foot, prism(P, front, qr, qi, 0, 6));
  }
  const pin = mk("circle", { r: 3.2, class: "sil" }, g);
  {
    const q = P(0, 0, BC);
    pin.setAttribute("cx", q[0]); pin.setAttribute("cy", q[1]);
  }

  const beamBack = mk("path", { class: "sil" }, g);
  const beamTop = mk("path", { class: "nf lo" }, g);
  const beamFront = mk("path", { class: "sil" }, g);
  const saddle = solid(g);
  const pans = [];
  for (let k = 0; k < 2; k++) {
    const rim = mk("path", { class: "sil" }, g);
    const strings = [];
    for (let s = 0; s < 3; s++) strings.push(mk("path", { class: "nf" }, g));
    pans.push({ rim, strings });
  }

  const w = { x: 15, sp: spring(15, { eps: 0.05 }) };

  /** Beam-frame (x along beam, z up) -> world, rotated about Y by th. */
  const bw = (x, y, z, th) => {
    const c = Math.cos(th), s = Math.sin(th);
    return [x * c + z * s, y, -x * s + z * c + BC];
  };

  function drawBeam(th) {
    const q = (x, y, z) => P(...bw(x, y, z, th));
    beamBack.setAttribute("d", poly([q(-BL, -BD, -BT), q(BL, -BD, -BT), q(BL, -BD, BT), q(-BL, -BD, BT)]));
    beamTop.setAttribute("d", poly([q(-BL, -BD, BT), q(BL, -BD, BT), q(BL, BD, BT), q(-BL, BD, BT)]));
    beamFront.setAttribute("d", poly([q(-BL, BD, -BT), q(BL, BD, -BT), q(BL, BD, BT), q(-BL, BD, BT)]));
  }

  function drawPan(pan, hx, hy, hz) {
    const ring = circ(PAN_R, 20).map((s) => ({ u: s.u + hx, v: s.v + hy }));
    pan.rim.setAttribute("d", poly(ringAt(P, ring, hz - DROP)));
    const hp = P(hx, hy, hz);
    for (let s = 0; s < 3; s++) {
      const a = rad(90 + s * 120);
      const rp = P(hx + PAN_R * Math.cos(a), hy + PAN_R * Math.sin(a), hz - DROP);
      pan.strings[s].setAttribute("d", seg(hp, rp));
    }
  }

  function draw() {
    const th = rad(tiltMax * (w.sp.x / 60));
    drawBeam(th);
    const c = Math.cos(th), s = Math.sin(th);
    // saddle weight straddling the beam, axis-aligned so the tilt hides inside it
    const wx = w.sp.x * c, wz = -w.sp.x * s + BC;
    const [sr, si] = rings(wx - 7, -6, wx + 7, 6, 2, 0.8);
    put(saddle, prism(P, front, sr, si, wz - 9, wz + 5));
    saddle.sil.classList.add("hi");
    // pans hang level from the beam ends
    drawPan(pans[0], -BL * c, 0, BL * s + BC);
    drawPan(pans[1], BL * c, 0, -BL * s + BC);
    return th;
  }
  draw();

  let lastX = NaN;
  const B = register(stage, (dt) => {
    const moving = stepS(w.sp, dt);
    if (w.sp.x !== lastX) { lastX = w.sp.x; draw(); }
    return moving;
  });
  bag.add(B.unregister);

  function setWx(x) {
    w.sp.t = clamp(x, -60, 60);
    const deg = Math.round(Math.abs(tiltMax * (w.sp.t / 60)));
    read.textContent = `tip ${deg}°`;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => setWx(unproj(C, p[0], p[1], BC)[0]),
    leave: () => { w.sp.t = 15; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { tiltMax = v; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "scales",
  means: "A balance: the pointer slides the weight along the beam, and the beam tips.",
  rules: [1, 4, 5, 8],
  range: [4, 10, 18],
  mount,
});
