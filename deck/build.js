const pptxgen = require("pptxgenjs");
const path = require("path");

const DIR = __dirname;
const LOGO_DARK = path.join(DIR, "assets", "logo_dark.png");   // wordmark noir + mark vert
const LOGO_LIGHT = path.join(DIR, "assets", "logo_light.png"); // wordmark blanc + mark vert
const MARK = path.join(DIR, "assets", "mark.png");

// ---------------------------------------------------------------- Design system
const C = {
  navy: "0B243E",
  navyDeep: "071A2E",
  navySoft: "12304F",
  navyLine: "1D4064",
  green: "0BB165",
  greenDeep: "089055",
  blue: "2361EA",
  white: "FFFFFF",
  surface: "F5F8FA",
  surfaceAlt: "FAFCFD",
  border: "E1E9F0",
  muted: "5C7186",
  mutedDark: "93A9BF",
  ink: "0B243E",
};
const F = "Arial";
const W = 13.333, H = 7.5;
const M = 0.75;                 // marge latérale
const CW = W - 2 * M;           // 11.833

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Cambiste";
pres.company = "Cambiste";
pres.title = "Cambiste x Moov Cote d'Ivoire - Proposition de pilote";

const sh = () => pres.ShapeType;
const shadow = (o = {}) => Object.assign({ type: "outer", color: "0B243E", blur: 14, offset: 3, angle: 90, opacity: 0.09 }, o);

// Carte arrondie (motif : squircle, repris de l'icône applicative Cambiste)
function card(slide, x, y, w, h, opt = {}) {
  slide.addShape(sh().roundRect, {
    x, y, w, h,
    rectRadius: opt.radius || 0.16,
    fill: { color: opt.fill || C.white },
    line: opt.line === null ? { type: "none" } : { color: opt.line || C.border, width: 1 },
    shadow: opt.shadow === false ? undefined : shadow(opt.shadowOpts || {}),
  });
}

// Pastille numérotée verte (squircle) — iconographie unique du deck
function chip(slide, x, y, s, label, opt = {}) {
  slide.addShape(sh().roundRect, {
    x, y, w: s, h: s,
    rectRadius: s * 0.3,
    fill: { color: opt.fill || C.green },
    line: { type: "none" },
  });
  slide.addText(label, {
    x, y, w: s, h: s, align: "center", valign: "middle", margin: 0,
    fontFace: F, fontSize: opt.fontSize || 12, bold: true, color: opt.color || C.white,
  });
}

function eyebrow(slide, x, y, w, text, color) {
  slide.addText(text, {
    x, y, w, h: 0.26, margin: 0, valign: "middle",
    fontFace: F, fontSize: 10.5, bold: true, charSpacing: 2, color: color || C.green,
  });
}

function title(slide, text, opt = {}) {
  slide.addText(text, {
    x: M, y: opt.y || 0.95, w: opt.w || 10.6, h: opt.h || 0.85, margin: 0, valign: "middle",
    fontFace: F, fontSize: opt.size || 32, bold: true, color: opt.color || C.ink,
    charSpacing: -0.3,
  });
}

function lead(slide, text, opt = {}) {
  slide.addText(text, {
    x: M, y: opt.y || 1.82, w: opt.w || 9.6, h: opt.h || 0.55, margin: 0, valign: "top",
    fontFace: F, fontSize: opt.size || 12.5, color: opt.color || C.muted, lineSpacing: 18,
  });
}

// Bandeau de bas de page (texte discret, pas de bloc de couleur)
function footer(slide, n, dark) {
  slide.addText("Cambiste × Moov Côte d'Ivoire  —  Proposition de pilote  —  Document confidentiel", {
    x: M, y: 6.92, w: 8.5, h: 0.28, margin: 0, valign: "middle",
    fontFace: F, fontSize: 8.5, color: dark ? "6C8299" : "9AAABA",
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: W - M - 1.0, y: 6.92, w: 1.0, h: 0.28, margin: 0, valign: "middle", align: "right",
    fontFace: F, fontSize: 8.5, bold: true, color: dark ? "6C8299" : "9AAABA",
  });
  if (!dark) slide.addImage({ path: MARK, x: W - M - 0.32, y: 0.5, w: 0.32, h: 0.25 });
}

function arrowRight(slide, x, y, w, color) {
  slide.addShape(sh().line, {
    x, y, w, h: 0,
    line: { color: color || "BCCBD9", width: 1.5, endArrowType: "triangle" },
  });
}

// Liste à puces : l'interligne s'adapte au nombre de lignes réellement occupées,
// pour que les items sur deux lignes ne se rapprochent pas du suivant.
function bulletCol(slide, items, x, y, w, opt = {}) {
  const size = opt.size || 11;
  const lh = (opt.lineSpacing || 14) / 72;      // hauteur de ligne en pouces
  const extra = opt.gap != null ? opt.gap : 0.2; // respiration entre items
  const tw = w - 0.22;
  const cpl = Math.max(8, Math.floor(tw / (0.48 * size / 72))); // caractères par ligne (Arial)
  let yy = y, last = y;
  items.forEach((t) => {
    const lines = Math.max(1, Math.ceil(t.length / cpl));
    const hh = lines * lh;
    slide.addShape(sh().roundRect, {
      x, y: yy + lh / 2 - 0.05, w: 0.1, h: 0.1, rectRadius: 0.03,
      fill: { color: opt.dot || C.green }, line: { type: "none" },
    });
    slide.addText(t, {
      x: x + 0.22, y: yy, w: tw, h: hh + 0.06, margin: 0, valign: "top",
      fontFace: F, fontSize: size, color: opt.color || C.ink, lineSpacing: opt.lineSpacing || 14,
    });
    last = yy + hh;
    yy += hh + extra;
  });
  return last; // bas réel de la liste, pour caler l'élément suivant
}

// Titre sur deux lignes : aligné en haut pour conserver l'écart au sur-titre
function titleWrap(slide, text, opt = {}) {
  slide.addText(text, {
    x: M, y: opt.y || 1.18, w: opt.w || 11.4, h: opt.h || 1.0, margin: 0, valign: "top",
    fontFace: F, fontSize: opt.size || 30, bold: true, color: opt.color || C.ink,
    charSpacing: -0.3, lineSpacing: 36,
  });
}

// ============================================================ SLIDE 1 — Couverture
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Géométrie de marque : squircles très discrets (aucun aplat décoratif)
  s.addShape(sh().roundRect, { x: 9.15, y: -1.55, w: 6.2, h: 6.2, rectRadius: 1.7, fill: { color: C.navySoft }, line: { type: "none" } });
  s.addShape(sh().roundRect, { x: 10.75, y: 3.35, w: 4.4, h: 4.4, rectRadius: 1.25, fill: { color: C.green, transparency: 88 }, line: { type: "none" } });

  s.addImage({ path: LOGO_LIGHT, x: M, y: 0.72, w: 2.35, h: 0.364 });
  s.addText("Limitless Africa", {
    x: M, y: 1.11, w: 3, h: 0.24, margin: 0, valign: "middle",
    fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1.2, color: C.mutedDark,
  });

  eyebrow(s, M, 2.72, 8, "PROPOSITION DE PILOTE  —  CÔTE D'IVOIRE", C.green);
  s.addText("Cambiste × Moov Côte d'Ivoire", {
    x: M, y: 3.12, w: 9.4, h: 0.95, margin: 0, valign: "middle",
    fontFace: F, fontSize: 42, bold: true, color: C.white, charSpacing: -0.8,
  });
  s.addText("Étendre les possibilités du Mobile Money aux paiements transfrontaliers", {
    x: M, y: 4.15, w: 8.2, h: 0.8, margin: 0, valign: "top",
    fontFace: F, fontSize: 16.5, color: C.mutedDark, lineSpacing: 25,
  });

  s.addText("Document confidentiel — destiné à la Direction Générale de Moov Côte d'Ivoire", {
    x: M, y: 6.62, w: 8.5, h: 0.28, margin: 0, valign: "middle",
    fontFace: F, fontSize: 9.5, color: "6C8299",
  });
  s.addText("Août 2026", {
    x: W - M - 2.2, y: 6.62, w: 2.2, h: 0.28, margin: 0, valign: "middle", align: "right",
    fontFace: F, fontSize: 9.5, bold: true, color: "6C8299",
  });
  s.addNotes("Objectif de la présentation : obtenir un accord de principe pour passer au cadrage d'un pilote encadré de paiements transfrontaliers avec Moov Côte d'Ivoire.");
}

// ============================================================ SLIDE 2 — L'opportunité
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  eyebrow(s, M, 0.62, 6, "L'OPPORTUNITÉ");
  title(s, "Une nouvelle opportunité pour Moov Money");
  lead(s, "Moov Money constitue déjà un point d'accès essentiel aux services financiers numériques en Côte d'Ivoire. Cambiste propose d'étendre progressivement cette utilité vers de nouveaux usages transfrontaliers, dans un cadre limité et contrôlé.", { y: 1.92, w: 10.4, h: 0.9 });

  const items = [
    ["PLUS D'USAGES", "Enrichir les possibilités offertes depuis l'environnement Moov Money."],
    ["PLUS DE TRANSACTIONS", "Créer de nouvelles occasions d'utilisation du wallet."],
    ["NOUVELLES SOURCES DE REVENUS", "Créer de nouvelles opportunités de revenus transactionnels."],
  ];
  const cw = 3.611, gap = 0.5, cy = 3.15, ch = 2.8;
  items.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, x, cy, cw, ch, { fill: C.surface, line: C.border });
    chip(s, x + 0.42, cy + 0.45, 0.5, "0" + (i + 1), { fontSize: 12 });
    s.addText(it[0], {
      x: x + 0.42, y: cy + 1.15, w: cw - 0.84, h: 0.62, margin: 0, valign: "top",
      fontFace: F, fontSize: 14, bold: true, color: C.ink, lineSpacing: 19,
    });
    s.addText(it[1], {
      x: x + 0.42, y: cy + 1.8, w: cw - 0.84, h: 0.75, margin: 0, valign: "top",
      fontFace: F, fontSize: 11, color: C.muted, lineSpacing: 15,
    });
  });
  footer(s, 2);
  s.addNotes("Trois bénéfices seulement, sans donnée chiffrée : l'objectif est de cadrer l'opportunité, pas de la quantifier avant le pilote.");
}

// ============================================================ SLIDE 3 — Expérience client
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  eyebrow(s, M, 0.62, 6, "PARCOURS");
  title(s, "Du wallet Moov Money au bénéficiaire international");

  const nodes = [
    { t: "Client\nMoov Money", k: "moov" },
    { t: "Moov Money", k: "moov" },
    { t: "Cambiste", k: "cambiste" },
    { t: "Infrastructure\nfinancière réglementée", k: "reg" },
    { t: "Bénéficiaire\ninternational", k: "reg" },
  ];
  const nw = 2.02, ngap = 0.42, ny = 2.62, nh = 1.62;
  nodes.forEach((n, i) => {
    const x = M + i * (nw + ngap);
    const isC = n.k === "cambiste";
    card(s, x, ny, nw, nh, {
      fill: isC ? C.navy : C.white,
      line: isC ? C.navy : C.border,
      shadowOpts: isC ? { blur: 18, offset: 4, opacity: 0.22 } : {},
    });
    s.addText(n.t, {
      x: x + 0.14, y: ny, w: nw - 0.28, h: nh, margin: 0, align: "center", valign: "middle",
      fontFace: F, fontSize: isC ? 15 : 12.5, bold: true,
      color: isC ? C.white : C.ink, lineSpacing: isC ? 20 : 17,
    });
    if (i < nodes.length - 1) arrowRight(s, x + nw + 0.1, ny + nh / 2, ngap - 0.2);
  });

  // Sous-bloc discret rattaché au nœud Cambiste
  const cx = M + 2 * (nw + ngap);
  const subW = 5.9, subX = cx + nw / 2 - subW / 2;
  s.addShape(sh().line, { x: cx + nw / 2, y: ny + nh, w: 0, h: 0.22, line: { color: C.green, width: 1.5 } });
  card(s, subX, ny + nh + 0.22, subW, 0.54, { fill: C.surface, line: C.border, radius: 0.12, shadow: false });
  s.addText("Orchestration  •  Routage  •  Contrôles  •  Suivi  •  Rapprochement", {
    x: subX, y: ny + nh + 0.22, w: subW, h: 0.54, margin: 0, align: "center", valign: "middle",
    fontFace: F, fontSize: 10, bold: true, color: C.greenDeep, charSpacing: 0.2,
  });

  s.addText("Moov conserve la relation client, l'environnement wallet et ses contrôles. Cambiste orchestre le flux technique de bout en bout, sans détenir les fonds des utilisateurs.", {
    x: M, y: 5.72, w: 10.6, h: 0.6, margin: 0, valign: "top",
    fontFace: F, fontSize: 11.5, color: C.muted, lineSpacing: 16,
  });
  footer(s, 3);
  s.addNotes("Le schéma doit être compris en moins de dix secondes. Cambiste apparaît comme couche d'orchestration, jamais comme détenteur de fonds.");
}

// ============================================================ SLIDE 4 — Ce que Cambiste apporte
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  eyebrow(s, M, 0.62, 6, "LA SOLUTION");
  titleWrap(s, "Une couche technologique pour orchestrer le cross-border", { y: 1.12, size: 29 });

  const blocks = [
    ["CONNECTER", "Connexion API avec l'environnement Mobile Money."],
    ["ORCHESTRER", "Gestion et routage des workflows transactionnels."],
    ["CONTRÔLER", "Application des règles opérationnelles et des workflows de conformité convenus."],
    ["RAPPROCHER", "Suivi des transactions, reporting et rapprochement."],
  ];
  const bw = 5.79, bh = 1.62, gx = 0.253, gy = 0.22, by = 2.34;
  blocks.forEach((b, i) => {
    const x = M + (i % 2) * (bw + gx);
    const y = by + Math.floor(i / 2) * (bh + gy);
    card(s, x, y, bw, bh, { fill: C.white, line: C.border });
    chip(s, x + 0.42, y + 0.36, 0.46, "0" + (i + 1), { fontSize: 11 });
    s.addText(b[0], {
      x: x + 1.08, y: y + 0.34, w: bw - 1.5, h: 0.34, margin: 0, valign: "middle",
      fontFace: F, fontSize: 14, bold: true, color: C.ink, charSpacing: 0.8,
    });
    s.addText(b[1], {
      x: x + 1.08, y: y + 0.76, w: bw - 1.5, h: 0.66, margin: 0, valign: "top",
      fontFace: F, fontSize: 11, color: C.muted, lineSpacing: 15,
    });
  });

  card(s, M, 5.9, CW, 0.74, { fill: C.navy, line: C.navy, radius: 0.14, shadowOpts: { blur: 16, offset: 3, opacity: 0.16 } });
  s.addText([
    { text: "Une intégration. ", options: { color: C.green, bold: true } },
    { text: "Un cadre contrôlé pour développer de nouveaux usages transfrontaliers.", options: { color: C.white, bold: true } },
  ], {
    x: M, y: 5.9, w: CW, h: 0.74, margin: 0, align: "center", valign: "middle",
    fontFace: F, fontSize: 14.5,
  });
  footer(s, 4);
  s.addNotes("Quatre fonctions, une seule intégration côté Moov. Cambiste est un fournisseur de services techniques : orchestration, contrôles applicatifs, rapprochement.");
}

// ============================================================ SLIDE 5 — Conformité (dark)
{
  const s = pres.addSlide();
  s.background = { color: C.navy };
  eyebrow(s, M, 0.62, 6, "CONFORMITÉ", C.green);
  title(s, "La conformité intégrée dès la conception", { color: C.white });

  const LX = M, LW = 6.35;
  s.addText("PARCOURS DE CONTRÔLE D'UNE TRANSACTION DU PILOTE", {
    x: LX, y: 1.95, w: LW, h: 0.26, margin: 0, valign: "middle",
    fontFace: F, fontSize: 9, bold: true, charSpacing: 1.4, color: C.mutedDark,
  });
  const layers = [
    "Identification et éligibilité",
    "Règles et plafonds transactionnels",
    "Contrôles sanctions et PEP",
    "Surveillance des transactions",
    "Exécution",
    "Piste d'audit et reporting",
  ];
  const ly0 = 2.35, lh = 0.6, lg = 0.135;
  layers.forEach((t, i) => {
    const y = ly0 + i * (lh + lg);
    s.addShape(sh().roundRect, {
      x: LX, y, w: LW, h: lh, rectRadius: 0.12,
      fill: { color: C.navySoft }, line: { color: C.navyLine, width: 1 },
    });
    chip(s, LX + 0.2, y + (lh - 0.34) / 2, 0.34, "0" + (i + 1), { fontSize: 9.5 });
    s.addText(t, {
      x: LX + 0.68, y, w: LW - 0.88, h: lh, margin: 0, valign: "middle",
      fontFace: F, fontSize: 12, bold: true, color: C.white,
    });
    if (i < layers.length - 1) {
      s.addShape(sh().line, { x: LX + 0.37, y: y + lh, w: 0, h: lg, line: { color: C.green, width: 1.25 } });
    }
  });

  const RX = 7.6, RW = W - M - RX;
  s.addShape(sh().roundRect, {
    x: RX, y: 1.95, w: RW, h: 1.72, rectRadius: 0.16,
    fill: { color: C.green, transparency: 82 }, line: { color: C.green, width: 1 },
  });
  s.addText("Aucune transaction du pilote ne doit contourner le cadre de contrôle convenu.", {
    x: RX + 0.36, y: 1.95, w: RW - 0.72, h: 1.72, margin: 0, valign: "middle",
    fontFace: F, fontSize: 16, bold: true, color: C.white, lineSpacing: 23,
  });

  s.addText("DISPOSITIFS MOBILISÉS", {
    x: RX, y: 3.84, w: RW, h: 0.26, margin: 0, valign: "middle",
    fontFace: F, fontSize: 9, bold: true, charSpacing: 1.4, color: C.mutedDark,
  });
  const tags = ["AML / CFT", "KYC / KYB", "Filtrage sanctions", "Filtrage PEP", "Plafonds et velocity", "Escalade et suspension", "Traçabilité", "Rapprochement"];
  const tw = (RW - 0.18) / 2, th = 0.38, tg = 0.11;
  tags.forEach((t, i) => {
    const x = RX + (i % 2) * (tw + 0.18);
    const y = 4.18 + Math.floor(i / 2) * (th + tg);
    s.addShape(sh().roundRect, {
      x, y, w: tw, h: th, rectRadius: 0.1,
      fill: { color: C.navySoft }, line: { color: C.navyLine, width: 1 },
    });
    s.addText(t, {
      x: x + 0.14, y, w: tw - 0.28, h: th, margin: 0, valign: "middle",
      fontFace: F, fontSize: 9.5, bold: true, color: "CBDCEA",
    });
  });

  s.addText("Le modèle opérationnel définitif sera soumis aux procédures internes de conformité de Moov et aux exigences réglementaires applicables avant toute mise en production.", {
    x: RX, y: 6.2, w: RW, h: 0.6, margin: 0, valign: "top",
    fontFace: F, fontSize: 8.8, italic: true, color: "8FA5BA", lineSpacing: 13,
  });
  footer(s, 5, true);
  s.addNotes("Slide centrale du deck. Message : la conformité n'est pas ajoutée après coup, elle conditionne l'exécution. Aucune affirmation d'agrément ou de certification n'est faite.");
}

// ============================================================ SLIDE 6 — Responsabilités
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  eyebrow(s, M, 0.62, 6, "GOUVERNANCE");
  title(s, "Des responsabilités clairement définies");

  const cols = [
    { h: "MOOV", c: C.navy, items: ["Relation client", "Environnement wallet", "Vigilance clientèle applicable", "Validation interne conformité", "Autorisation transactionnelle selon le modèle retenu"] },
    { h: "CAMBISTE", c: C.green, items: ["Orchestration technologique", "Workflows API", "Logique de routage", "Capacités de surveillance", "Suivi transactionnel", "Rapprochement et reporting"] },
    { h: "INFRASTRUCTURE FINANCIÈRE RÉGLEMENTÉE", c: "44637F", items: ["Services financiers réglementés", "Exécution et règlement selon le modèle retenu", "Contrôles financiers réglementaires applicables"] },
  ];
  const cw = 3.778, gap = 0.25, cy = 2.05, ch = 3.9;
  cols.forEach((col, i) => {
    const x = M + i * (cw + gap);
    card(s, x, cy, cw, ch, { fill: C.white, line: C.border });
    s.addShape(sh().roundRect, {
      x, y: cy, w: cw, h: 0.86, rectRadius: 0.16,
      fill: { color: col.c }, line: { type: "none" },
    });
    // masque le bas arrondi de l'entête pour un raccord net avec la carte
    s.addShape(sh().rect, { x, y: cy + 0.62, w: cw, h: 0.24, fill: { color: col.c }, line: { type: "none" } });
    s.addText(col.h, {
      x: x + 0.3, y: cy, w: cw - 0.6, h: 0.86, margin: 0, valign: "middle",
      fontFace: F, fontSize: i === 2 ? 11 : 14, bold: true, color: C.white, charSpacing: 0.8, lineSpacing: 15,
    });
    bulletCol(s, col.items, x + 0.3, cy + 1.2, cw - 0.6, { size: 11, gap: 0.22, dot: col.c === "44637F" ? "8FA6BC" : col.c, lineSpacing: 15 });
  });

  card(s, M, 6.14, CW, 0.6, { fill: C.surface, line: C.border, radius: 0.12, shadow: false });
  s.addText("La répartition définitive des responsabilités et contrôles sera formalisée lors du cadrage juridique, conformité et opérationnel précédant le pilote.", {
    x: M + 0.3, y: 6.14, w: CW - 0.6, h: 0.6, margin: 0, valign: "middle",
    fontFace: F, fontSize: 10.5, color: C.ink,
  });
  footer(s, 6);
  s.addNotes("Chaque acteur reste dans son périmètre. Cambiste n'assume aucun rôle réglementé et ne se substitue à aucun acteur agréé.");
}

// ============================================================ SLIDE 7 — Pilote
{
  const s = pres.addSlide();
  s.background = { color: C.surfaceAlt };
  eyebrow(s, M, 0.62, 6, "LE PILOTE");
  title(s, "Commencer de manière contrôlée. Valider. Puis étendre.", { size: 30, w: 11.6 });

  // Caractéristiques (mesurées d'abord : elles déterminent la hauteur du bloc de gauche)
  const bx = M, bw = 4.05, by = 2.05;
  const rx = bx + bw + 0.35, rw = W - M - rx;
  const feats = [
    "Population d'utilisateurs éligibles limitée",
    "Corridor(s) sélectionné(s)",
    "Plafonds transactionnels convenus",
    "Volumes contrôlés",
    "Surveillance conformité",
    "Reporting opérationnel",
    "Procédures d'escalade définies",
    "Revue conjointe des performances",
  ];
  const half = rw / 2 - 0.12;
  const e1 = bulletCol(s, feats.slice(0, 4), rx, by + 0.42, half, { size: 11.5, gap: 0.24, lineSpacing: 16 });
  const e2 = bulletCol(s, feats.slice(4), rx + half + 0.24, by + 0.42, half, { size: 11.5, gap: 0.24, lineSpacing: 16 });
  const noteY = Math.max(e1, e2) + 0.26, noteH = 0.79;
  const bh = noteY + noteH - by;

  // Bloc statistique
  card(s, bx, by, bw, bh, { fill: C.navy, line: C.navy, shadowOpts: { blur: 18, offset: 4, opacity: 0.2 } });
  s.addText("PILOTE ENCADRÉ", {
    x: bx + 0.42, y: by + 0.42, w: bw - 0.84, h: 0.26, margin: 0, valign: "middle",
    fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1.6, color: C.green,
  });
  s.addText([
    { text: "90", options: { fontSize: 62, bold: true, color: C.white } },
    { text: "  JOURS", options: { fontSize: 17, bold: true, color: C.mutedDark, charSpacing: 1.5 } },
  ], {
    x: bx + 0.42, y: by + 0.82, w: bw - 0.84, h: 1.0, margin: 0, valign: "middle",
    fontFace: F, charSpacing: -1,
  });
  s.addText("Périmètre, corridors et plafonds définis conjointement avec Moov avant le lancement.", {
    x: bx + 0.42, y: by + 1.92, w: bw - 0.84, h: 0.75, margin: 0, valign: "top",
    fontFace: F, fontSize: 11, color: "AFC2D4", lineSpacing: 15,
  });

  s.addText("PÉRIMÈTRE DU PILOTE", {
    x: rx, y: by, w: rw, h: 0.26, margin: 0, valign: "middle",
    fontFace: F, fontSize: 9, bold: true, charSpacing: 1.4, color: C.muted,
  });

  card(s, rx, noteY, rw, noteH, { fill: C.white, line: C.border, radius: 0.12, shadow: false });
  s.addText([
    { text: "Quatre dimensions évaluées simultanément :  ", options: { bold: true, color: C.ink } },
    { text: "viabilité commerciale, opérationnelle, technique et conformité.", options: { color: C.muted } },
  ], {
    x: rx + 0.3, y: noteY, w: rw - 0.6, h: noteH, margin: 0, valign: "middle",
    fontFace: F, fontSize: 11, lineSpacing: 15,
  });

  // Progression
  const steps = ["PILOTE ENCADRÉ", "VALIDER", "OPTIMISER", "ÉTENDRE"];
  const sw = 2.62, sg = 0.53, sy = 5.42, shh = 0.66;
  const totalW = steps.length * sw + (steps.length - 1) * sg;
  const sx0 = M + (CW - totalW) / 2;
  steps.forEach((t, i) => {
    const x = sx0 + i * (sw + sg);
    s.addShape(sh().roundRect, {
      x, y: sy, w: sw, h: shh, rectRadius: 0.14,
      fill: { color: i === 0 ? C.green : C.white },
      line: { color: i === 0 ? C.green : C.border, width: 1 },
    });
    s.addText(t, {
      x, y: sy, w: sw, h: shh, margin: 0, align: "center", valign: "middle",
      fontFace: F, fontSize: 11.5, bold: true, color: i === 0 ? C.white : C.ink, charSpacing: 0.8,
    });
    if (i < steps.length - 1) arrowRight(s, x + sw + 0.13, sy + shh / 2, sg - 0.26);
  });
  s.addText("Aucune extension n'est automatique : elle dépend des résultats constatés lors de la revue conjointe.", {
    x: M, y: 6.28, w: CW, h: 0.3, margin: 0, align: "center", valign: "middle",
    fontFace: F, fontSize: 10, italic: true, color: C.muted,
  });
  footer(s, 7);
  s.addNotes("Le pilote est présenté comme un mécanisme de réduction du risque : périmètre borné, volumes contrôlés, décision d'extension conditionnée aux résultats.");
}

// ============================================================ SLIDE 8 — Indicateurs
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  eyebrow(s, M, 0.62, 6, "PILOTAGE");
  title(s, "Mesurer avant d'étendre");
  lead(s, "Cinq indicateurs suivis conjointement pendant toute la durée du pilote.", { y: 1.9, w: 9.5, h: 0.4 });

  const kpis = [
    ["Taux de réussite des transactions", "Part des opérations abouties sur l'ensemble des transactions initiées."],
    ["Délai moyen de traitement", "Temps observé entre l'initiation et la confirmation de l'opération."],
    ["Taux d'exceptions conformité", "Volume d'alertes, de rejets et de cas escaladés sur la période."],
    ["Fiabilité opérationnelle", "Disponibilité des interfaces et qualité du rapprochement."],
    ["Adoption et volume transactionnel", "Utilisateurs actifs et volumes constatés sur le périmètre du pilote."],
  ];
  const kw = 2.263, kg = 0.13, ky = 2.65, kh = 2.75;
  kpis.forEach((k, i) => {
    const x = M + i * (kw + kg);
    card(s, x, ky, kw, kh, { fill: C.surface, line: C.border });
    chip(s, x + 0.32, ky + 0.34, 0.44, "0" + (i + 1), { fontSize: 11 });
    s.addText(k[0], {
      x: x + 0.32, y: ky + 0.94, w: kw - 0.64, h: 0.95, margin: 0, valign: "top",
      fontFace: F, fontSize: 12.5, bold: true, color: C.ink, lineSpacing: 16,
    });
    s.addText(k[1], {
      x: x + 0.32, y: ky + 1.88, w: kw - 0.64, h: 0.75, margin: 0, valign: "top",
      fontFace: F, fontSize: 9.5, color: C.muted, lineSpacing: 13,
    });
  });

  card(s, M, 5.78, CW, 0.6, { fill: C.white, line: C.border, radius: 0.12, shadow: false });
  s.addText("Les objectifs quantitatifs définitifs seront convenus conjointement avant le lancement du pilote.", {
    x: M + 0.3, y: 5.78, w: CW - 0.6, h: 0.6, margin: 0, valign: "middle",
    fontFace: F, fontSize: 10.5, color: C.ink,
  });
  footer(s, 8);
  s.addNotes("Aucun seuil chiffré n'est avancé à ce stade : les cibles sont fixées conjointement pendant le cadrage.");
}

// ============================================================ SLIDE 9 — Chemin vers le pilote
{
  const s = pres.addSlide();
  s.background = { color: C.surfaceAlt };
  eyebrow(s, M, 0.62, 6, "MÉTHODE");
  title(s, "Un chemin structuré vers la mise en production");

  const steps = [
    ["Cadrage commercial\n& conformité", "Périmètre, corridors, population éligible et exigences de contrôle."],
    ["Validation du modèle\nopérationnel", "Parcours, responsabilités, règles transactionnelles et escalade."],
    ["Intégration API", "Connexion technique avec l'environnement Mobile Money."],
    ["Tests & recette", "Scénarios fonctionnels, cas d'exception et validation conjointe."],
    ["Lancement du pilote\nencadré", "Mise en service sur un périmètre limité et sous surveillance."],
    ["Revue à 90 jours", "Analyse des indicateurs et décision conjointe sur la suite."],
  ];
  const nw = 1.792, ng = 0.216, ny = 2.45, nh = 3.15;
  // fil conducteur reliant les repères numérotés
  s.addShape(sh().line, {
    x: M + nw / 2, y: ny + 0.66, w: (steps.length - 1) * (nw + ng), h: 0,
    line: { color: "D6E0E9", width: 1.25 },
  });
  steps.forEach((st, i) => {
    const x = M + i * (nw + ng);
    card(s, x, ny, nw, nh, { fill: C.white, line: C.border });
    s.addShape(sh().roundRect, {
      x: x + (nw - 0.62) / 2, y: ny + 0.35, w: 0.62, h: 0.62, rectRadius: 0.19,
      fill: { color: i === steps.length - 1 ? C.navy : C.green }, line: { type: "none" },
    });
    s.addText("0" + (i + 1), {
      x: x + (nw - 0.62) / 2, y: ny + 0.35, w: 0.62, h: 0.62, margin: 0, align: "center", valign: "middle",
      fontFace: F, fontSize: 14, bold: true, color: C.white,
    });
    s.addText(st[0], {
      x: x + 0.2, y: ny + 1.15, w: nw - 0.4, h: 0.95, margin: 0, align: "center", valign: "top",
      fontFace: F, fontSize: 11.5, bold: true, color: C.ink, lineSpacing: 15,
    });
    s.addText(st[1], {
      x: x + 0.2, y: ny + 2.12, w: nw - 0.4, h: 0.85, margin: 0, align: "center", valign: "top",
      fontFace: F, fontSize: 9, color: C.muted, lineSpacing: 12,
    });
  });

  s.addText("Le calendrier détaillé de chaque étape sera arrêté conjointement lors du cadrage.", {
    x: M, y: 6.0, w: CW, h: 0.32, margin: 0, align: "center", valign: "middle",
    fontFace: F, fontSize: 10.5, italic: true, color: C.muted,
  });
  footer(s, 9);
  s.addNotes("Montrer la maîtrise méthodologique : passer d'une discussion commerciale à un pilote opérationnel selon une séquence éprouvée. Aucun délai n'est avancé.");
}

// ============================================================ SLIDE 10 — Closing
{
  const s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(sh().roundRect, { x: 10.55, y: -2.3, w: 6.4, h: 6.4, rectRadius: 1.8, fill: { color: C.navySoft }, line: { type: "none" } });

  s.addImage({ path: LOGO_LIGHT, x: M, y: 0.7, w: 2.2, h: 0.341 });

  eyebrow(s, M, 1.95, 8, "PROCHAINE ÉTAPE", C.green);
  s.addText("Lançons le pilote Moov Côte d'Ivoire", {
    x: M, y: 2.32, w: 9.6, h: 0.9, margin: 0, valign: "middle",
    fontFace: F, fontSize: 38, bold: true, color: C.white, charSpacing: -0.6,
  });
  s.addText("Cambiste propose d'engager avec Moov Côte d'Ivoire le cadrage commercial, conformité et technique nécessaire au lancement d'un pilote encadré de paiements transfrontaliers.", {
    x: M, y: 3.28, w: 8.6, h: 0.85, margin: 0, valign: "top",
    fontFace: F, fontSize: 13, color: C.mutedDark, lineSpacing: 20,
  });

  const acts = ["Confirmer l'intérêt pour le pilote", "Désigner les référents Business, Conformité et Technique", "Planifier la réunion de lancement"];
  const aw = 3.611, ag = 0.5, ay = 4.4, ah = 1.18;
  acts.forEach((t, i) => {
    const x = M + i * (aw + ag);
    s.addShape(sh().roundRect, {
      x, y: ay, w: aw, h: ah, rectRadius: 0.16,
      fill: { color: C.navySoft }, line: { color: C.navyLine, width: 1 },
    });
    s.addText("0" + (i + 1), {
      x: x + 0.32, y: ay + 0.22, w: 0.8, h: 0.3, margin: 0, valign: "middle",
      fontFace: F, fontSize: 12, bold: true, color: C.green, charSpacing: 0.5,
    });
    s.addText(t, {
      x: x + 0.32, y: ay + 0.56, w: aw - 0.64, h: 0.5, margin: 0, valign: "top",
      fontFace: F, fontSize: 12, bold: true, color: C.white, lineSpacing: 16,
    });
  });

  s.addShape(sh().roundRect, {
    x: M, y: 6.08, w: 4.9, h: 0.72, rectRadius: 0.2,
    fill: { color: C.green }, line: { type: "none" },
    shadow: shadow({ color: "0BB165", blur: 20, offset: 4, opacity: 0.35 }),
  });
  s.addText("PASSER AU CADRAGE DU PILOTE", {
    x: M, y: 6.08, w: 4.9, h: 0.72, margin: 0, align: "center", valign: "middle",
    fontFace: F, fontSize: 13.5, bold: true, color: C.white, charSpacing: 1,
  });

  s.addText("Limitless Africa", {
    x: W - M - 3.2, y: 6.08, w: 3.2, h: 0.72, margin: 0, align: "right", valign: "middle",
    fontFace: F, fontSize: 11, bold: true, charSpacing: 1.2, color: "6C8299",
  });
  s.addNotes("Décision attendue à l'issue de la présentation : accord de principe pour passer au cadrage du pilote Cambiste x Moov Côte d'Ivoire.");
}

pres.writeFile({ fileName: path.join(DIR, "..", "Cambiste_x_Moov_Cote_dIvoire_Proposition_de_pilote.pptx") })
  .then(f => console.log("OK ->", f));
