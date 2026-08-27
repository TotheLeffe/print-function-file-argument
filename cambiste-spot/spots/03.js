/* =========================================================================
   03 — THE PROBLEM ISN'T MOBILE MONEY                          21,0 s
   Une idee : l'Afrique n'a pas un probleme d'adoption, elle a un probleme
   de connexion. La premiere phrase est faite pour retenir le defilement.
   ========================================================================= */
(function () {
const E = CAMBISTE, C = E.C, M = E.M, W = E.W;

/* Pile verticale : le trajet lu de haut en bas. */
const STACK = [
  { y: 400, t: 'MOBILE MONEY',          s: "africa's financial interface" },
  { y: 592, t: 'CAMBISTE',              s: 'the connection layer', brand: true },
  { y: 784, t: 'GLOBAL BANKING SYSTEM', s: 'the rest of the world' }
];

window.SPOT = {
  name: "03 — The problem isn't Mobile Money",
  scenes: [

  /* -- 1. L'accroche a contre-pied --------------------------------------- */
  { name: 'accroche', sec: 4.5, bg: 'white',
    draw: function (l) {
      E.stars(E.starField(3301, 6, [190, 330], [800, 950], 36, 16), l);
      E.headline(['AFRICA DOESN’T HAVE', 'A PAYMENT ADOPTION', 'PROBLEM.'],
                 M, 486, 104, { w: 800, tr: -3, color: C.ink, lh: 1.14 },
                 l, 8, 13, 17);
    } },

  /* -- 2. Le vrai probleme ----------------------------------------------- */
  { name: 'diagnostic', sec: 4.0, bg: 'green', tin: 20, wipe: 'bottom',
    draw: function (l) {
      E.stars(E.starField(3302, 8, [200, 350], [760, 930], 20, 18), l);
      E.headline(['IT HAS A', 'CONNECTIVITY', 'PROBLEM.'], W/2, 440, 108,
                 { w: 800, tr: -3, color: C.ink, lh: 1.14 }, l, 14, 10, 16, 'center');
    } },

  /* -- 3. La pile : ou se situe exactement la connexion manquante -------- */
  { name: 'pile', sec: 6.0, bg: 'mint', tin: 20, wipe: 'right',
    draw: function (l) {
      E.stars([{ x: 178, y: 262, s: 22, d: 22, rot: .3, col: C.gold2 },
               { x: 916, y: 288, s: 18, d: 30, rot: .7, col: C.gold },
               { x: 900, y: 900, s: 24, d: 120, rot: .2, col: C.gold }], l);
      E.headline(['THE MISSING LAYER.'], M, 258, 60,
                 { w: 800, tr: -1.5, color: C.ink }, l, 12, 0, 16);

      E.arrowDown(W/2, STACK[0].y + 62, STACK[1].y - 62, E.seg(l, 52, 76));
      E.arrowDown(W/2, STACK[1].y + 62, STACK[2].y - 62, E.seg(l, 92, 116));
      STACK.forEach(function (n, i) {
        E.card(W/2, n.y, 560, 124, n.t, n.s, E.seg(l, 26 + i * 40, 46 + i * 40),
               n.brand ? 'brand' : 'plain');
      });
    } },

  /* -- 4. La chute ------------------------------------------------------- */
  E.closer(['WE BUILD THE BRIDGE.'], 3.5),

  /* -- 5. Signature ------------------------------------------------------ */
  E.signature(3.0)
]};
})();
