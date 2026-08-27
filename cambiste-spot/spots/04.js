/* =========================================================================
   04 — COMPLIANCE BY DESIGN                                    21,0 s
   Une idee : la conformite n'est pas une couche ajoutee, elle est integree
   au flux. Ce spot sert aussi de piece a envoyer apres un premier contact.
   ========================================================================= */
(function () {
const E = CAMBISTE, C = E.C, M = E.M, W = E.W;

const CONTROLS = ['KYC', 'AML screening', 'Source of funds',
                  'Transaction monitoring', 'Regulatory controls'];
const A0 = 30, STEP = 32;          // premiere coche, puis une toutes les 1,07 s

window.SPOT = {
  name: '04 — Compliance by design',
  scenes: [

  /* -- 1. L'accroche : une API ne suffit pas ----------------------------- */
  { name: 'accroche', sec: 4.5, bg: 'white',
    draw: function (l) {
      E.text('CROSS-BORDER PAYMENTS', M, 330, 27,
             { w: 700, tr: 5.5, color: C.green }, 'left', E.eo(E.seg(l, 2, 14)));
      E.headline(['NEED MORE', 'THAN APIs.'], M, 546, 130,
                 { w: 800, tr: -3, color: C.ink, lh: 1.14 }, l, 10, 14, 18);
    } },

  /* -- 2. Les controles, un par un --------------------------------------- */
  { name: 'controles', sec: 9.0, bg: 'mint', tin: 20, wipe: 'bottom',
    draw: function (l) {
      E.headline(['BUILT INTO THE FLOW.'], M, 300, 62,
                 { w: 800, tr: -1.5, color: C.ink }, l, 10, 0, 16);
      CONTROLS.forEach(function (t, i) {
        const a = A0 + i * STEP;
        E.check(t, M, 464 + i * 102, E.seg(l, a, a + 14), E.seg(l, a + 5, a + 17));
      });
      E.textRise('Every transaction. Every corridor. Every time.', M, 992, 29,
                 { w: 500, color: E.alpha(C.ink, .6) }, 'left', E.seg(l, 196, 212));
    } },

  /* -- 3. La chute ------------------------------------------------------- */
  E.closer(['COMPLIANCE BY DESIGN.'], 3.5),

  /* -- 4. Signature ------------------------------------------------------ */
  E.signature(3.0)
]};
})();
