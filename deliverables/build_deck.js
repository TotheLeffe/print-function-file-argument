const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");
const { applyTheme } = require("/root/.claude/skills/synced/10313fb5-6401-4271-adc9-470a5f4ba52a_7669edc2-65a3-422f-b78c-2bb756b1065c/pptx/scripts/apply_theme.js");

const OUT = process.argv[2] || "Cambiste_MTN_Pilot_Proposal.pptx";

// Cambiste brand (from the reference document): deep navy, Cambiste blue, steel tints, Helvetica/Arial
const HEX = {
  navy: "16324F", white: "FFFFFF", slate: "4A5563", ice: "EEF3F8",
  blue: "2F6FB0", teal: "1C8C7A", steel: "C9D6E2", deep: "0D2136", amber: "D99A2B", gray: "8A94A3",
};
const THEME = {
  name: "Cambiste",
  headFontFace: "Arial",
  bodyFontFace: "Arial",
  colors: {
    dk1: HEX.navy, lt1: HEX.white, dk2: HEX.slate, lt2: HEX.ice,
    accent1: HEX.blue, accent2: HEX.teal, accent3: HEX.steel, accent4: HEX.deep,
    accent5: HEX.amber, accent6: HEX.gray, hlink: HEX.blue, folHlink: HEX.slate,
  },
};

async function icon(name, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fa[name], { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625
  pres.author = "Cambiste";
  pres.company = "Cambiste";
  pres.title = "From MTN wallets to global bank accounts — Pilot proposal";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const navy = C.text1, white = C.background1, slate = C.text2, ice = C.background2;
  const blue = C.accent1, teal = C.accent2, steel = C.accent3, deep = C.accent4, amber = C.accent5, gray = C.accent6;

  const FOOTER = "Cambiste  |  Pilot proposal  |  For discussion";

  // ---------- Layouts ----------
  pres.defineSlideMaster({
    title: "Cambiste Title Dark",
    background: { color: navy },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 1.35, w: 4.9, h: 1.9, fontSize: 34, bold: true, color: white, align: "left", valign: "top", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.5, y: 2.95, w: 4.6, h: 0.8, fontSize: 15, color: steel, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "Cambiste Title Only",
    background: { color: white },
    margin: [0.5, 0.5, 0.5, 0.5],
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.32, w: 9, h: 0.7, fontSize: 28, bold: true, color: navy, align: "left", valign: "middle", margin: 0 }, text: "" } },
      { text: { text: FOOTER, options: { x: 0.5, y: 5.22, w: 6, h: 0.25, fontSize: 10, color: gray, margin: 0 } } },
    ],
    slideNumber: { x: 9.0, y: 5.22, w: 0.5, h: 0.25, fontSize: 10, color: gray, align: "right", margin: 0 },
  });
  pres.defineSlideMaster({
    title: "Cambiste Closing Dark",
    background: { color: navy },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.32, w: 9, h: 0.7, fontSize: 28, bold: true, color: white, align: "left", valign: "middle", margin: 0 }, text: "" } },
      { text: { text: FOOTER, options: { x: 0.5, y: 5.22, w: 6, h: 0.25, fontSize: 10, color: steel, margin: 0 } } },
    ],
    slideNumber: { x: 9.0, y: 5.22, w: 0.5, h: 0.25, fontSize: 10, color: steel, align: "right", margin: 0 },
  });

  const txt = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontSize: 14, color: slate, valign: "top" }, o));
  const shadow = () => ({ type: "outer", color: "0D2136", blur: 6, offset: 2, angle: 90, opacity: 0.12 });
  const iconCircle = async (s, name, x, y, d, fill, fg, objName) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, objectName: objName + " circle" });
    const pad = d * 0.27;
    s.addImage({ data: await icon(name, fg), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad, objectName: objName + " icon" });
  };

  // ---------- Slide 1 — Title ----------
  pres.addSection({ title: "Proposal" });
  {
    const s = pres.addSlide({ masterName: "Cambiste Title Dark", sectionTitle: "Proposal" });
    txt(s, "CAMBISTE", { x: 0.5, y: 0.45, w: 3, h: 0.3, fontSize: 14, bold: true, color: white, charSpacing: 4, objectName: "Wordmark" });
    txt(s, "Connecting African wallets to Global Banking", { x: 0.5, y: 0.75, w: 4.6, h: 0.3, fontSize: 12, italic: true, color: steel, objectName: "Tagline" });
    s.addText("From MTN wallets to global bank accounts", { placeholder: "title" });
    s.addText("A proposed pilot for outbound international payments from Nigeria and Ghana", { placeholder: "body" });
    txt(s, "Pilot proposal  |  For discussion", { x: 0.5, y: 4.95, w: 4, h: 0.3, fontSize: 11, color: steel, objectName: "Status mention" });

    // Visual: wallet -> bank account
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.55, y: 1.0, w: 3.95, h: 3.6, fill: { color: deep }, line: { type: "none" }, rectRadius: 0.15, objectName: "Visual panel" });
    await iconCircle(s, "FaWallet", 5.85, 1.75, 1.15, white, HEX.navy, "Wallet");
    await iconCircle(s, "FaBuildingColumns", 8.05, 1.75, 1.15, blue, HEX.white, "Bank");
    s.addShape(pres.shapes.LINE, { x: 7.1, y: 2.325, w: 0.85, h: 0, line: { color: steel, width: 2.5, endArrowType: "triangle" }, objectName: "Flow arrow" });
    txt(s, "Cambiste", { x: 6.85, y: 1.85, w: 1.35, h: 0.3, fontSize: 10, color: steel, align: "center", objectName: "Orchestration label" });
    txt(s, [{ text: "MTN mobile money", options: { bold: true, color: white, breakLine: true } }, { text: "Nigeria · Ghana", options: { color: steel } }],
      { x: 5.7, y: 3.05, w: 1.5, h: 0.6, fontSize: 11, align: "center", objectName: "Wallet label" });
    txt(s, [{ text: "Overseas bank account", options: { bold: true, color: white, breakLine: true } }, { text: "Beneficiary", options: { color: steel } }],
      { x: 7.85, y: 3.05, w: 1.55, h: 0.6, fontSize: 11, align: "center", objectName: "Bank label" });
    txt(s, "Customer pays in local fiat · beneficiary receives fiat", { x: 5.7, y: 3.95, w: 3.65, h: 0.3, fontSize: 10, color: steel, align: "center", objectName: "Fiat note" });
    s.addNotes(
      "Purpose: open a discussion, not announce a product. This is a pilot proposal to be built together with MTN.\n" +
      "Sensitive points: nothing is launched, licensed, integrated or contracted yet. Ripple is the envisaged partner for the target architecture; the Cambiste–Ripple distribution partnership is still being formalised. " +
      "Do not use 'powered by Ripple' or imply a joint brand. Customers only ever handle fiat."
    );
  }

  // ---------- Slide 2 — Customer journey ----------
  {
    const s = pres.addSlide({ masterName: "Cambiste Title Only", sectionTitle: "Proposal" });
    s.addText("Unlock a new international payment use case", { placeholder: "title" });
    txt(s, "A target customer journey, to be designed with MTN", { x: 0.5, y: 0.98, w: 9, h: 0.3, fontSize: 14, color: slate, objectName: "Subtitle" });
    const steps = [
      ["FaMobileScreen", "Initiate", "Start an international transfer through the MTN experience"],
      ["FaMagnifyingGlassDollar", "Review", "Check the quote and beneficiary details before confirming"],
      ["FaWallet", "Pay", "Pay in local currency from the mobile money wallet"],
      ["FaLocationCrosshairs", "Track", "Follow delivery to the overseas bank account"],
    ];
    const w = 2.0, gap = 0.333, y = 1.5, h = 2.3;
    for (let i = 0; i < steps.length; i++) {
      const x = 0.5 + i * (w + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: ice }, line: { type: "none" }, rectRadius: 0.1, objectName: `Step ${i + 1} card` });
      await iconCircle(s, steps[i][0], x + 0.2, y + 0.22, 0.62, navy, HEX.white, `Step ${i + 1}`);
      txt(s, "0" + (i + 1), { x: x + w - 0.7, y: y + 0.28, w: 0.5, h: 0.4, fontSize: 18, bold: true, color: blue, align: "right", objectName: `Step ${i + 1} number` });
      txt(s, steps[i][1], { x: x + 0.2, y: y + 1.0, w: w - 0.4, h: 0.35, fontSize: 16, bold: true, color: navy, objectName: `Step ${i + 1} title` });
      txt(s, steps[i][2], { x: x + 0.2, y: y + 1.38, w: w - 0.4, h: 0.85, fontSize: 12, color: slate, objectName: `Step ${i + 1} text` });
      if (i < steps.length - 1)
        s.addShape(pres.shapes.LINE, { x: x + w + 0.06, y: y + 0.53, w: gap - 0.12, h: 0, line: { color: blue, width: 2, endArrowType: "triangle" }, objectName: `Step ${i + 1} arrow` });
    }
    // Target users + assumption
    await iconCircle(s, "FaUsers", 0.5, 4.12, 0.5, blue, HEX.white, "Users");
    txt(s, [{ text: "Target users: ", options: { bold: true, color: navy } }, { text: "individuals and SMEs, subject to eligibility", options: { color: slate } }],
      { x: 1.15, y: 4.12, w: 4.3, h: 0.5, fontSize: 14, valign: "middle", objectName: "Target users" });
    txt(s, "Assumption: illustrative journey. No existing MTN app feature or integration is implied.", { x: 5.7, y: 4.12, w: 3.8, h: 0.5, fontSize: 10, italic: true, color: gray, valign: "middle", objectName: "Journey assumption" });
    s.addNotes(
      "Walk through the four steps from the customer's point of view: initiate, review quote and beneficiary, pay in local currency, track delivery.\n" +
      "Sensitive points: this journey is a target to design together. Do not suggest any of these screens or functions already exist in the MTN app. " +
      "Individuals and SMEs are target segments only; eligibility (KYC level, limits, corridors) will be defined with MTN and the licensed partners."
    );
  }

  // ---------- Slide 3 — Operating model ----------
  pres.addSection({ title: "Operating model" });
  {
    const s = pres.addSlide({ masterName: "Cambiste Title Only", sectionTitle: "Operating model" });
    s.addText("A clear operating model", { placeholder: "title" });
    // Cambiste layer
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.12, w: 9, h: 0.72, fill: { color: navy }, line: { type: "none" }, rectRadius: 0.08, objectName: "Cambiste layer" });
    txt(s, [
      { text: "CAMBISTE  ·  Technology layer (TSP)", options: { bold: true, color: white, fontSize: 14, breakLine: true } },
      { text: "API orchestration  ·  Routing  ·  Instruction transmission  ·  Status tracking  ·  Reconciliation", options: { color: steel, fontSize: 11 } },
    ], { x: 0.75, y: 1.12, w: 8.5, h: 0.72, valign: "middle", objectName: "Cambiste layer text" });

    const boxes = [
      ["MTN / Mobile Money Operator", "Customer interface · local collection"],
      ["Licensed Collection & Conversion Partner", "Local settlement · conversion"],
      ["Ripple Custody", "Institutional custody · treasury"],
      ["Ripple Payments", "FX · cross-border settlement · bank payout"],
      ["Beneficiary Bank Account", "Credited in destination fiat"],
    ];
    const bw = 1.56, bg = 0.3, by = 2.36, bh = 1.62;
    for (let i = 0; i < boxes.length; i++) {
      const x = 0.5 + i * (bw + bg), cx = x + bw / 2;
      const last = i === boxes.length - 1;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: by, w: bw, h: bh, fill: { color: last ? white : ice }, line: { color: last ? teal : steel, width: 1.25 }, rectRadius: 0.08, objectName: `Participant ${i + 1}` });
      s.addShape(pres.shapes.OVAL, { x: x + 0.12, y: by + 0.12, w: 0.3, h: 0.3, fill: { color: blue }, line: { type: "none" }, objectName: `Participant ${i + 1} badge` });
      txt(s, String(i + 1), { x: x + 0.12, y: by + 0.12, w: 0.3, h: 0.3, fontSize: 11, bold: true, color: white, align: "center", valign: "middle", objectName: `Participant ${i + 1} number` });
      txt(s, boxes[i][0], { x: x + 0.12, y: by + 0.48, w: bw - 0.24, h: 0.7, fontSize: 11, bold: true, color: navy, valign: "top", objectName: `Participant ${i + 1} name` });
      txt(s, boxes[i][1], { x: x + 0.12, y: by + 1.2, w: bw - 0.24, h: 0.36, fontSize: 9.5, color: slate, valign: "bottom", objectName: `Participant ${i + 1} role` });
      if (!last) {
        // instructions & data (dashed) from Cambiste layer
        s.addShape(pres.shapes.LINE, { x: cx, y: 1.86, w: 0, h: by - 1.88, line: { color: blue, width: 1.5, dashType: "dash", beginArrowType: "oval", endArrowType: "oval" }, objectName: `API link ${i + 1}` });
        // funds movement (solid)
        s.addShape(pres.shapes.LINE, { x: x + bw + 0.02, y: by + bh / 2, w: bg - 0.04, h: 0, line: { color: navy, width: 2.5, endArrowType: "triangle" }, objectName: `Funds arrow ${i + 1}` });
      }
    }
    // Fiat / rail / fiat bands
    const c = (i) => 0.5 + i * (bw + bg) + bw / 2;
    const bandY = 4.12, bandH = 0.4;
    const band = (x1, x2, fill, color, text, name) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x1, y: bandY, w: x2 - x1, h: bandH, fill: { color: fill }, line: { type: "none" }, rectRadius: 0.06, objectName: name });
      txt(s, text, { x: x1 + 0.08, y: bandY, w: x2 - x1 - 0.16, h: bandH, fontSize: 10, bold: true, color, align: "center", valign: "middle", objectName: name + " text" });
    };
    band(0.5, c(1) - 0.04, teal, white, "Fiat in · NGN / GHS", "Fiat in band");
    band(c(1) + 0.04, c(3) - 0.04, steel, navy, "Institutional rail · approved stablecoin (e.g. RLUSD, to be validated)", "Rail band");
    band(c(3) + 0.04, 9.5, teal, white, "Fiat out · destination currency", "Fiat out band");

    // Legend
    s.addShape(pres.shapes.LINE, { x: 0.5, y: 4.85, w: 0.45, h: 0, line: { color: navy, width: 2.5, endArrowType: "triangle" }, objectName: "Legend funds" });
    txt(s, "Funds movement", { x: 1.05, y: 4.73, w: 1.5, h: 0.25, fontSize: 10, color: slate, valign: "middle", objectName: "Legend funds text" });
    s.addShape(pres.shapes.LINE, { x: 2.6, y: 4.85, w: 0.45, h: 0, line: { color: blue, width: 1.5, dashType: "dash" }, objectName: "Legend API" });
    txt(s, "Instructions & data (API)", { x: 3.15, y: 4.73, w: 2.0, h: 0.25, fontSize: 10, color: slate, valign: "middle", objectName: "Legend API text" });
    txt(s, "The stablecoin is a settlement rail between institutional participants only. Asset, network and entities to be validated.",
      { x: 5.2, y: 4.64, w: 4.3, h: 0.45, fontSize: 10, italic: true, color: gray, valign: "middle", objectName: "Rail assumption" });
    s.addNotes(
      "Read the flow left to right. Solid arrows are funds; dashed lines are instructions and data from Cambiste.\n" +
      "Key message: fiat in, fiat out. The stablecoin is only an institutional settlement rail between participants; customers never hold or see it.\n" +
      "Sensitive points: Cambiste sits above the flow and never touches funds. MTN holds no crypto-assets and offers no crypto product. " +
      "RLUSD is an option to validate, not a requirement; the asset, network, licensed partner and Ripple entities per corridor are all to be confirmed."
    );
  }

  // ---------- Slide 4 — Roles matrix ----------
  {
    const s = pres.addSlide({ masterName: "Cambiste Title Only", sectionTitle: "Operating model" });
    s.addText("Clear roles. Defined accountability.", { placeholder: "title" });
    const hdr = (t) => ({ text: t, options: { bold: true, color: white, fill: { color: navy }, fontSize: 12 } });
    const p = (t, hl) => ({ text: t, options: { bold: true, color: navy, fill: { color: hl ? ice : white }, fontSize: 12 } });
    const c = (t, hl) => ({ text: t, options: { color: slate, fill: { color: hl ? ice : white }, fontSize: 11 } });
    const rows = [
      [hdr("Participant"), hdr("Operational role"), hdr("Responsibility boundary")],
      [p("MTN / local entity"), c("Customer interface and local fiat collection"), c("Within its own authorisations and applicable agreements. Holds no crypto-assets; offers no crypto product to customers.")],
      [p("Licensed collection & conversion partner"), c("Local settlement and conversion to an approved stablecoin"), c("Only within its authorisations for the country, activity and corridor concerned.")],
      [p("Ripple infrastructure & relevant entities"), c("Institutional custody and treasury; FX, cross-border settlement and bank payout"), c("Per the entities, licences, configuration and corridors actually available and agreed.")],
      [p("Cambiste", true), c("Technical orchestration: APIs, routing, status tracking, reconciliation", true), c("No collection, no custody of customer funds or stablecoins, no proprietary conversion.", true)],
    ];
    s.addTable(rows, {
      x: 0.5, y: 1.15, w: 9, colW: [2.2, 3.0, 3.8], rowH: [0.38, 0.66, 0.6, 0.66, 0.6],
      fontFace: "Arial", valign: "middle", margin: [0.06, 0.1, 0.06, 0.1],
      border: { type: "solid", pt: 0.75, color: HEX.steel }, objectName: "Roles matrix",
    });
    await iconCircle(s, "FaScaleBalanced", 0.5, 4.32, 0.46, blue, HEX.white, "Validation");
    txt(s, [
      { text: "Final responsibilities and regulatory requirements to be validated for each entity and corridor before launch.", options: { bold: true, color: navy, breakLine: true } },
      { text: "KYC/AML, sanctions, monitoring, reporting and complaints allocation to be agreed between the parties. Each participant keeps its own obligations.", options: { color: slate } },
    ], { x: 1.1, y: 4.25, w: 8.4, h: 0.62, fontSize: 10.5, valign: "middle", objectName: "Validation note" });
    s.addNotes(
      "One row per participant: what it does, and where its responsibility stops.\n" +
      "Sensitive points: this separation does NOT exempt any participant from its own regulatory obligations. " +
      "We are not proposing who performs KYC/AML, sanctions screening, monitoring, reporting or complaints handling — that allocation must be agreed between the parties. " +
      "Do not attribute custody to Cambiste. Ripple entities and licences are subject to what is actually available per corridor."
    );
  }

  // ---------- Slide 5 — Commercial value ----------
  pres.addSection({ title: "Value & pilot" });
  {
    const s = pres.addSlide({ masterName: "Cambiste Title Only", sectionTitle: "Value & pilot" });
    s.addText("Commercial value for MTN", { placeholder: "title" });
    const ben = [
      ["FaChartLine", "New transaction revenue opportunities"],
      ["FaSliders", "Improved payment economics"],
      ["FaUserCheck", "Greater wallet utility and engagement"],
      ["FaGlobe", "Scalable access to international bank payouts"],
    ];
    const w = 2.0, gap = 0.333, y = 1.12, h = 1.6;
    for (let i = 0; i < ben.length; i++) {
      const x = 0.5 + i * (w + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: white }, line: { color: steel, width: 1 }, rectRadius: 0.1, shadow: shadow(), objectName: `Benefit ${i + 1} card` });
      await iconCircle(s, ben[i][0], x + 0.2, y + 0.18, 0.46, navy, HEX.white, `Benefit ${i + 1}`);
      txt(s, ben[i][1], { x: x + 0.2, y: y + 0.75, w: w - 0.35, h: 0.75, fontSize: 13, bold: true, color: navy, objectName: `Benefit ${i + 1} text` });
    }
    // Economics formula
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.0, w: 5.95, h: 1.95, fill: { color: ice }, line: { type: "none" }, rectRadius: 0.1, objectName: "Economics panel" });
    txt(s, "Transaction economics, to be agreed together", { x: 0.75, y: 3.13, w: 5.5, h: 0.32, fontSize: 14, bold: true, color: navy, objectName: "Economics title" });
    const chips = ["Customer service fee", "Conversion & liquidity cost", "Payout cost", "Participant remuneration"];
    const cw = 1.2, cg = 0.2, cy = 3.58;
    for (let i = 0; i < chips.length; i++) {
      const x = 0.75 + i * (cw + cg);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy, w: cw, h: 0.72, fill: { color: i === 0 ? navy : white }, line: { color: i === 0 ? navy : steel, width: 1 }, rectRadius: 0.06, objectName: `Economics chip ${i + 1}` });
      txt(s, chips[i], { x: x + 0.06, y: cy, w: cw - 0.12, h: 0.72, fontSize: 10.5, bold: true, color: i === 0 ? white : navy, align: "center", valign: "middle", objectName: `Economics chip ${i + 1} text` });
      if (i < chips.length - 1)
        txt(s, "−", { x: x + cw, y: cy, w: cg, h: 0.72, fontSize: 16, bold: true, color: blue, align: "center", valign: "middle", objectName: `Economics minus ${i + 1}` });
    }
    txt(s, "No pricing, revenue share or savings figures until validated with pilot data.", { x: 0.75, y: 4.43, w: 5.5, h: 0.35, fontSize: 10.5, italic: true, color: slate, valign: "middle", objectName: "Economics assumption" });
    // 24/7 vs credit time
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.75, y: 3.0, w: 2.75, h: 1.95, fill: { color: navy }, line: { type: "none" }, rectRadius: 0.1, objectName: "Availability panel" });
    txt(s, "24/7", { x: 7.0, y: 3.1, w: 2.3, h: 0.6, fontSize: 36, bold: true, color: white, objectName: "Availability stat" });
    txt(s, "Processing target", { x: 7.0, y: 3.7, w: 2.3, h: 0.25, fontSize: 12, bold: true, color: steel, objectName: "Availability label" });
    txt(s, "Bank credit time depends on the corridor and the receiving banking systems.", { x: 7.0, y: 4.05, w: 2.3, h: 0.75, fontSize: 11, color: white, objectName: "Availability caveat" });
    s.addNotes(
      "Four value levers for MTN: new transaction revenue, better payment economics, more wallet usage, and a scalable route to international bank payouts.\n" +
      "Sensitive points: no price, revenue share, margin gain or saving is quoted — the economic model (service fee, conversion/liquidity cost, payout cost, participant remuneration) is to be agreed and measured in the pilot. " +
      "24/7 is a processing target, not a promise of instant credit: actual credit time depends on the corridor and the receiving banks."
    );
  }

  // ---------- Slide 6 — Pilot ----------
  {
    const s = pres.addSlide({ masterName: "Cambiste Title Only", sectionTitle: "Value & pilot" });
    s.addText("A focused pilot: Nigeria & Ghana", { placeholder: "title" });
    // Phases
    const phases = [
      ["Readiness validation", "Entities, partners, contracts"],
      ["End-to-end testing", "Funds, data and reconciliation flows"],
      ["Controlled opening", "Indicative 90 days after readiness"],
      ["Review", "Go / no-go on KPIs"],
    ];
    const pw = 2.18, pg = 0.09, py = 1.1;
    for (let i = 0; i < phases.length; i++) {
      const x = 0.5 + i * (pw + pg);
      const hl = i === 2;
      s.addShape(pres.shapes.CHEVRON, { x, y: py, w: pw, h: 0.82, fill: { color: hl ? navy : ice }, line: { type: "none" }, objectName: `Phase ${i + 1}` });
      txt(s, [{ text: phases[i][0], options: { bold: true, fontSize: 11.5, breakLine: true } }, { text: phases[i][1], options: { fontSize: 9.5 } }],
        { x: x + 0.36, y: py, w: pw - 0.62, h: 0.82, color: hl ? white : navy, valign: "middle", objectName: `Phase ${i + 1} text` });
    }
    // Country cards + shared scope
    const cy = 2.12, ch = 1.45;
    const country = async (x, code, name, objName) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy, w: 2.55, h: ch, fill: { color: white }, line: { color: steel, width: 1 }, rectRadius: 0.08, objectName: objName });
      s.addShape(pres.shapes.OVAL, { x: x + 0.18, y: cy + 0.18, w: 0.5, h: 0.5, fill: { color: teal }, line: { type: "none" }, objectName: objName + " badge" });
      txt(s, code, { x: x + 0.18, y: cy + 0.18, w: 0.5, h: 0.5, fontSize: 12, bold: true, color: white, align: "center", valign: "middle", objectName: objName + " code" });
      txt(s, name, { x: x + 0.8, y: cy + 0.18, w: 1.6, h: 0.5, fontSize: 16, bold: true, color: navy, valign: "middle", objectName: objName + " name" });
      txt(s, "Separate workstream. Local entity, partner and regulatory validation.", { x: x + 0.18, y: cy + 0.8, w: 2.2, h: 0.55, fontSize: 10.5, color: slate, objectName: objName + " text" });
    };
    await country(0.5, "NG", "Nigeria", "Nigeria card");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.3, y: cy, w: 3.4, h: ch, fill: { color: ice }, line: { type: "none" }, rectRadius: 0.08, objectName: "Shared scope card" });
    txt(s, "Shared pilot scope", { x: 3.5, y: cy + 0.15, w: 3.0, h: 0.3, fontSize: 13, bold: true, color: navy, objectName: "Shared scope title" });
    txt(s, [
      { text: "Limited destination corridors, selected together", options: { bullet: true, breakLine: true } },
      { text: "Agreed customer cohort", options: { bullet: true, breakLine: true } },
      { text: "Agreed transaction limits", options: { bullet: true } },
    ], { x: 3.5, y: cy + 0.5, w: 3.05, h: 0.85, fontSize: 11, color: slate, paraSpaceAfter: 3, objectName: "Shared scope list" });
    await country(6.95, "GH", "Ghana", "Ghana card");
    // KPIs
    txt(s, "Pilot indicators", { x: 0.5, y: 3.78, w: 3, h: 0.3, fontSize: 13, bold: true, color: navy, objectName: "KPI title" });
    const kpis = ["Success rate", "Time to credit", "All-in cost per transaction", "Contribution margin", "Reconciliation rate", "Complaints", "Compliance incidents"];
    const kw = Array(7).fill(2.175);
    let kx = 0.5, ky = 4.15;
    kpis.forEach((k, i) => {
      if (kx + kw[i] > 9.51) { kx = 0.5; ky += 0.42; }
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: kx, y: ky, w: kw[i], h: 0.32, fill: { color: white }, line: { color: blue, width: 1 }, rectRadius: 0.16, objectName: `KPI ${i + 1}` });
      txt(s, k, { x: kx, y: ky, w: kw[i], h: 0.32, fontSize: 11, color: navy, align: "center", valign: "middle", objectName: `KPI ${i + 1} text` });
      kx += kw[i] + 0.1;
    });
    s.addNotes(
      "Two country workstreams, each subject to its own local validation (entity, licensed partner, regulatory requirements). A shared design: a few destination corridors chosen together, an agreed customer cohort and agreed limits.\n" +
      "Sequence: readiness validation, end-to-end testing, then a controlled opening.\n" +
      "Sensitive points: the 90 days is a proposal and starts only once operational readiness is validated. No volumes, regulatory limits or available destinations are assumed — they will be set together. KPIs are listed without targets for the same reason."
    );
  }

  // ---------- Slide 7 — Decisions & next step ----------
  pres.addSection({ title: "Next steps" });
  {
    const s = pres.addSlide({ masterName: "Cambiste Closing Dark", sectionTitle: "Next steps" });
    s.addText("Align on the pilot workstreams", { placeholder: "title" });
    txt(s, "Decisions we propose to take together", { x: 0.5, y: 1.0, w: 5.4, h: 0.3, fontSize: 14, color: steel, objectName: "Decisions intro" });
    const dec = [
      ["FaUserTie", "Name business, product, technical and compliance leads"],
      ["FaFlag", "Confirm participating entities in Nigeria and Ghana"],
      ["FaRoute", "Select priority corridors and use cases"],
      ["FaFileSignature", "Validate local partners, contract framework and responsibilities"],
      ["FaListCheck", "Define commercial terms and launch criteria"],
    ];
    for (let i = 0; i < dec.length; i++) {
      const y = 1.45 + i * 0.68;
      await iconCircle(s, dec[i][0], 0.5, y, 0.48, blue, HEX.white, `Decision ${i + 1}`);
      txt(s, dec[i][1], { x: 1.15, y, w: 4.7, h: 0.48, fontSize: 14, color: white, valign: "middle", objectName: `Decision ${i + 1} text` });
    }
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y: 1.15, w: 3.3, h: 3.75, fill: { color: white }, line: { type: "none" }, rectRadius: 0.12, objectName: "Next step card" });
    await iconCircle(s, "FaHandshake", 6.5, 1.45, 0.7, navy, HEX.white, "Workshop");
    txt(s, "PROPOSED NEXT STEP", { x: 6.5, y: 2.35, w: 2.8, h: 0.28, fontSize: 10, bold: true, color: blue, charSpacing: 2, objectName: "Next step label" });
    txt(s, "Joint scoping workshop", { x: 6.5, y: 2.65, w: 2.8, h: 0.75, fontSize: 20, bold: true, color: navy, objectName: "Next step title" });
    txt(s, "MTN · Cambiste · Ripple", { x: 6.5, y: 3.42, w: 2.8, h: 0.32, fontSize: 14, bold: true, color: teal, objectName: "Next step parties" });
    txt(s, "To frame the pilot, subject to the availability and agreement of all parties.", { x: 6.5, y: 3.85, w: 2.8, h: 0.75, fontSize: 11, color: slate, objectName: "Next step caveat" });
    s.addNotes(
      "Close on concrete alignment: five decisions to open the pilot workstreams, and one next step — a joint scoping workshop.\n" +
      "Sensitive points: Ripple's participation in the workshop is a proposal, subject to Ripple's availability and agreement; the Cambiste–Ripple partnership is still being formalised. " +
      "Do not commit dates, pricing or regulatory outcomes in the room."
    );
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
