/* =========================================================================
   05 — ONE API                                                 19,0 s
   Une idee : Cambiste n'est pas une application de transfert, c'est une
   infrastructure. Plusieurs operateurs entrent, un monde de rails sort.
   ========================================================================= */
(function () {
const E = CAMBISTE, C = E.C, M = E.M, W = E.W;

const HUB = { x: 540, y: 560 };
const IN = [
  { x: 190, y: 392, t: 'OPERATOR A' },
  { x: 190, y: 560, t: 'OPERATOR B' },
  { x: 190, y: 728, t: 'OPERATOR C' }
];
const OUT = [
  { x: 890, y: 392, t: 'Bank accounts' },
  { x: 890, y: 560, t: 'International payments' },
  { x: 890, y: 728, t: 'Global liquidity' }
];

window.SPOT = {
  name: '05 — One API',
  scenes: [

  /* -- 1. Le titre, seul dans le cadre ----------------------------------- */
  { name: 'titre', sec: 3.5, bg: 'white',
    draw: function (l) {
      E.stars(E.starField(5501, 7, [210, 350], [760, 940], 24, 16), l);
      E.text('INFRASTRUCTURE, NOT AN APP', M, 336, 27,
             { w: 700, tr: 5.5, color: C.green }, 'left', E.eo(E.seg(l, 2, 14)));
      E.headline(['ONE API.'], M, 596, 190,
                 { w: 800, tr: -5, color: C.ink }, l, 10, 0, 20);
    } },

  /* -- 2. Le faisceau : entrees, socle, sorties -------------------------- */
  { name: 'faisceau', sec: 9.0, bg: 'mint', tin: 20, wipe: 'right',
    draw: function (l) {
      E.stars([{ x: 962, y: 244, s: 21, d: 26, rot: .3, col: C.gold2 },
               { x: 120, y: 258, s: 17, d: 34, rot: .7, col: C.gold },
               { x: 540, y: 404, s: 26, d: 126, rot: .4, col: C.gold },
               { x: 118, y: 906, s: 19, d: 200, rot: .5, col: C.gold2 }], l);
      E.headline(['MANY IN. ONE LAYER. A WORLD OUT.'], M, 268, 46,
                 { w: 800, tr: -1, color: C.ink }, l, 12, 0, 16);

      // les operateurs convergent, puis la valeur se redistribue
      E.fanIn(IN, HUB.x - 138, HUB.y, E.seg(l, 46, 132), C.green);
      E.fanIn(OUT, HUB.x + 138, HUB.y, E.seg(l, 140, 226), C.blue, true);

      IN.forEach(function (n, i) {
        E.card(n.x, n.y, 230, 92, n.t, null, E.seg(l, 30 + i * 10, 50 + i * 10));
      });
      const bump = 1 + .07 * Math.exp(-Math.pow((l - 134) / 8, 2));
      E.card(HUB.x, HUB.y, 288, 150, 'CAMBISTE', 'one API',
             E.seg(l, 68, 90), 'brand', bump);
      OUT.forEach(function (n, i) {
        E.card(n.x, n.y, 250, 92, n.t, null, E.seg(l, 176 + i * 12, 196 + i * 12));
      });

      E.textRise('Integrate once. Reach everywhere.', M, 944, 32,
                 { w: 600, color: E.alpha(C.ink, .82) }, 'left', E.seg(l, 232, 248));
    } },

  /* -- 3. La chute ------------------------------------------------------- */
  E.closer(['A WORLD OF', 'FINANCIAL RAILS.'], 3.5),

  /* -- 4. Signature ------------------------------------------------------ */
  E.signature(3.0)
]};
})();
