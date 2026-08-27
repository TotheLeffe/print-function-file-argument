/* =========================================================================
   06 — IMAGINE                                                 21,5 s
   Une idee, portee a la premiere personne : la vision du fondateur.
   Moins de schema, plus d'echelle — c'est le spot de personal branding.
   ========================================================================= */
(function () {
const E = CAMBISTE, C = E.C, M = E.M, W = E.W, H = E.H;

window.SPOT = {
  name: '06 — Imagine',
  scenes: [

  /* -- 1. L'invitation --------------------------------------------------- */
  { name: 'imagine', sec: 4.5, bg: 'white',
    draw: function (l) {
      E.headline(['IMAGINE', '100 MILLION', 'AFRICAN WALLETS…'], M, 470, 116,
                 { w: 800, tr: -3, color: C.ink, lh: 1.14 }, l, 8, 14, 18);
    } },

  /* -- 2. La suite de la phrase ------------------------------------------ */
  { name: 'connectes', sec: 4.5, bg: 'green', tin: 20, wipe: 'bottom',
    draw: function (l) {
      E.headline(['CONNECTED TO', 'THE GLOBAL', 'BANKING SYSTEM.'], W/2, 430, 104,
                 { w: 800, tr: -3, color: C.ink, lh: 1.14 }, l, 14, 12, 16, 'center');
    } },

  /* -- 3. Le reseau s'allume --------------------------------------------- */
  { name: 'reseau', sec: 6.0, bg: 'mint', tin: 20, wipe: 'right',
    draw: function (l) {
      const p = E.seg(l, 20, 150);
      E.network(6603, 34, [120, 300, 960, 860], p);
      const bump = 1 + .06 * Math.exp(-Math.pow((l - 152) / 10, 2));
      E.card(W/2, 560, 300, 152, 'CAMBISTE', 'the connection layer',
             E.seg(l, 96, 120), 'brand', bump);
      E.textRise('One layer between Africa and the world.', W/2, 936, 34,
                 { w: 600, color: E.alpha(C.ink, .8) }, 'center', E.seg(l, 150, 166));
    } },

  /* -- 4. La chute ------------------------------------------------------- */
  E.closer(["THAT’S WHAT", "WE’RE BUILDING."], 3.5),

  /* -- 5. Signature ------------------------------------------------------ */
  E.signature(3.0)
]};
})();
