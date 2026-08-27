/* =========================================================================
   01 — MOBILE MONEY -> GLOBAL BANKING SYSTEM        manifeste · 25,0 s
   Une idee : Mobile Money est deja l'interface financiere de l'Afrique ;
   Cambiste la relie au reste du monde. C'est le spot de vision, celui a
   produire en premier.
   ========================================================================= */
(function () {
const E = CAMBISTE, C = E.C, M = E.M, W = E.W, H = E.H;

/* Schema : trois cartes sur un rail, construit en deux temps. */
const CY = 560, CW = 274, CH = 162;
const NODE = [
  { x: 212, t: 'MOBILE MONEY', s: 'wallet' },
  { x: 540, t: 'CAMBISTE',     s: 'one integration' },
  { x: 868, t: 'GLOBAL BANKS', s: 'bank accounts' }
];

window.SPOT = {
  name: '01 — Mobile Money to Global Banking System',
  scenes: [

  /* -- 1. La donnee : le socle existe deja ------------------------------- */
  { name: 'chiffre', sec: 4.0, bg: 'white',
    draw: function (l) {
      E.text('AFRICA · MOBILE MONEY', M, 322, 27,
             { w: 700, tr: 5.5, color: C.green }, 'left', E.eo(E.seg(l, 2, 14)));

      // « 1.5 » defile puis se fige ; toFixed(1) garde une largeur constante,
      // donc « BILLION+ » ne bouge pas quand le compteur s'arrete.
      const num = 'BILLION+';
      const ns = E.fit('1.5 ' + num, E.MAXW, 176, { w: 800, tr: -3 });
      const wn = E.widthOf('1.5', ns, { w: 800, tr: -3 });
      const wb = E.widthOf(num, ns, { w: 800, tr: -3 });
      const gap = ns * .26;
      const x0 = W/2 - (wn + gap + wb) / 2;
      E.counter(1.5, '', x0 + wn/2, 540, ns, E.seg(l, 8, 46), { dec: 1, tr: -3 });
      E.revealWords(num, x0 + wn + gap, 540, ns,
                    { w: 800, tr: -3, color: C.green }, l, 34, 6, 18);
      E.revealWords('MOBILE MONEY ACCOUNTS', W/2, 646, 46,
                    { w: 700, tr: 2, color: E.alpha(C.ink, .72) }, l, 48, 5, 15, 'center');
    } },

  /* -- 2. La limite ------------------------------------------------------ */
  { name: 'limite', sec: 4.0, bg: 'green', tin: 20, wipe: 'bottom',
    draw: function (l) {
      E.headline(['BUT MOBILE MONEY', 'IS STILL LOCAL.'], W/2, 486, 108,
                 { w: 800, tr: -3, color: C.ink, lh: 1.14 }, l, 14, 10, 16, 'center');
    } },

  /* -- 3. Le pont, construit en deux temps ------------------------------- */
  { name: 'pont', sec: 10.0, bg: 'mint', tin: 20, wipe: 'right',
    draw: function (l) {
      E.headline(['ONE INTEGRATION.'], M, 330, 66,
                 { w: 800, tr: -1.5, color: C.ink }, l, 12, 0, 16);

      // premier temps : le wallet rejoint Cambiste
      E.rail(NODE[0].x, NODE[1].x, CY, E.seg(l, 56, 78));
      E.token(NODE[0].x, NODE[1].x, CY, E.seg(l, 80, 130));
      // second temps : Cambiste rejoint le systeme bancaire mondial
      E.rail(NODE[1].x, NODE[2].x, CY, E.seg(l, 152, 174));
      E.token(NODE[1].x, NODE[2].x, CY, E.seg(l, 176, 226));

      const bump = 1 + .07 * Math.exp(-Math.pow((l - 105) / 6, 2));
      E.card(NODE[0].x, CY, CW, CH, NODE[0].t, NODE[0].s, E.seg(l, 30, 48));
      E.card(NODE[1].x, CY, CW, CH, NODE[1].t, NODE[1].s, E.seg(l, 44, 62), 'brand', bump);
      E.card(NODE[2].x, CY, CW, CH, NODE[2].t, NODE[2].s, E.seg(l, 140, 158));

      E.textRise('No blockchain to operate.', M, 830, 32,
                 { w: 600, color: E.alpha(C.ink, .82) }, 'left', E.seg(l, 230, 246));
      E.textRise('No pre-funded accounts abroad.', M, 880, 32,
                 { w: 600, color: E.alpha(C.ink, .82) }, 'left', E.seg(l, 236, 252));
    } },

  /* -- 4. Le positionnement ---------------------------------------------- */
  { name: 'positionnement', sec: 4.0, bg: 'forest', tin: 18, wipe: 'left',
    draw: function (l) {
      const s = E.fit('GLOBAL BANKING SYSTEM', E.MAXW, 92, { w: 800, tr: -3 });
      E.revealWords('MOBILE MONEY', W/2, 456, s * .78,
                    { w: 700, tr: -1, color: E.alpha(C.white, .78) }, l, 12, 6, 16, 'center');
      E.arrowRight(W/2 - 42, W/2 + 42, 520, E.eo(E.seg(l, 30, 44)), C.leaf, 7);
      E.revealWords('GLOBAL BANKING SYSTEM', W/2, 662, s,
                    { w: 800, tr: -3, color: C.white }, l, 34, 6, 16, 'center');
      const pu = E.eo(E.seg(l, 62, 76));
      if (pu > 0) {
        const wl = E.widthOf('GLOBAL BANKING SYSTEM', s, { w: 800, tr: -3 });
        E.ctx.fillStyle = C.leaf;
        E.ctx.fillRect(W/2 - wl/2, 662 + s * .26, wl * pu, 7);
      }
    } },

  /* -- 5. Signature ------------------------------------------------------ */
  E.signature(3.0)
]};
})();
