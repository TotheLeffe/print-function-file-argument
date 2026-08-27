/* =========================================================================
   02 — WHY SHOULD AN AFRICAN WALLET STOP AT THE BORDER ?      23,5 s
   Une idee : le wallet existe deja chez l'operateur ; il ne lui manque
   qu'une sortie internationale. Adresse directement aux operateurs.
   ========================================================================= */
(function () {
const E = CAMBISTE, C = E.C, M = E.M, W = E.W;

const CY = 560, CW = 274, CH = 162;
const NODE = [
  { x: 212, t: 'MOBILE MONEY', s: 'your wallet' },
  { x: 540, t: 'CAMBISTE',     s: 'one integration' },
  { x: 868, t: 'GLOBAL BANKS', s: 'worldwide' }
];

window.SPOT = {
  name: '02 — Why should a wallet stop at the border?',
  scenes: [

  /* -- 1. Le constat : ils ont deja l'essentiel -------------------------- */
  { name: 'constat', sec: 4.0, bg: 'white',
    draw: function (l) {
      E.text('MOBILE MONEY OPERATORS', M, 330, 27,
             { w: 700, tr: 5.5, color: C.green }, 'left', E.eo(E.seg(l, 2, 14)));
      E.headline(['YOUR CUSTOMERS', 'ALREADY HAVE', 'A WALLET.'], M, 500, 116,
                 { w: 800, tr: -3, color: C.ink, lh: 1.14 }, l, 8, 12, 17);
    } },

  /* -- 2. Le wallet, seul dans le cadre ---------------------------------- */
  { name: 'wallet', sec: 3.0, bg: 'mint', tin: 20, wipe: 'bottom',
    draw: function (l) {
      E.card(W/2, 496, 440, 236, 'MOBILE MONEY', 'today: local only',
             E.seg(l, 14, 34));
      E.textRise('It works. It scales. It stops at the border.', W/2, 726, 34,
                 { w: 600, color: E.alpha(C.ink, .78) }, 'center', E.seg(l, 34, 50));
    } },

  /* -- 3. La question ---------------------------------------------------- */
  { name: 'question', sec: 4.0, bg: 'green', tin: 20, wipe: 'left',
    draw: function (l) {
      E.headline(['WHAT IF THAT WALLET', 'COULD GO GLOBAL?'], W/2, 486, 100,
                 { w: 800, tr: -3, color: C.ink, lh: 1.14 }, l, 14, 10, 16, 'center');
    } },

  /* -- 4. La reponse : un rail, trois etapes ----------------------------- */
  { name: 'reponse', sec: 6.0, bg: 'mint', tin: 20, wipe: 'right',
    draw: function (l) {
      E.headline(['IT CAN.'], M, 330, 66, { w: 800, tr: -1.5, color: C.ink }, l, 12, 0, 16);

      E.rail(NODE[0].x, NODE[2].x, CY, E.seg(l, 26, 52));
      E.token(NODE[0].x, NODE[2].x, CY, E.seg(l, 58, 132));
      const bump = 1 + .07 * Math.exp(-Math.pow((l - 95) / 6, 2));
      E.card(NODE[0].x, CY, CW, CH, NODE[0].t, NODE[0].s, E.seg(l, 22, 40));
      E.card(NODE[1].x, CY, CW, CH, NODE[1].t, NODE[1].s, E.seg(l, 32, 50), 'brand', bump);
      E.card(NODE[2].x, CY, CW, CH, NODE[2].t, NODE[2].s, E.seg(l, 42, 60));

      E.textRise('Your brand. Your customer. Your rails.', M, 848, 32,
                 { w: 600, color: E.alpha(C.ink, .82) }, 'left', E.seg(l, 140, 156));
    } },

  /* -- 5. La chute ------------------------------------------------------- */
  E.closer(['ONE INTEGRATION.', 'GLOBAL REACH.'], 3.5),

  /* -- 6. Signature ------------------------------------------------------ */
  E.signature(3.0)
]};
})();
