import { addFooter, addPageBorder, checkPageOverflow } from "./utils/pdfUtils";

export const addDoshasPDFSection = async (doc, doshaData) => {
  if (!doshaData || typeof doshaData !== "object") return;

  addPageBorder(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const accentColor = "#a16a21";
  const textColor = "#111111";
  const lineHeight = 14;
  const sectionSpacing = 12;

  let currentY = margin;

  // --- Main Title ---
  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(accentColor);
  const heading = "ASTROLOGICAL DOSHAS: KARMIC BLOCKS & PLANETARY LESSONS";
  const wrappedHeading = doc.splitTextToSize(heading, pageWidth - margin * 2);

  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(accentColor);

  wrappedHeading.forEach(line => {
    doc.text(line, pageWidth / 2, currentY, { align: "center" });
    currentY += lineHeight + 4;
  });

  currentY += 20;

  // --- Section Helper ---
  const addSection = (title, content, isBullet = false) => {
    if (!content || (Array.isArray(content) && !content.length)) return;

    currentY = checkPageOverflow(doc, currentY, margin);

    if (title) {
      doc.setFont("Times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(accentColor);
      doc.text(title, margin, currentY);
      currentY += lineHeight + 4;
    }

    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(textColor);

    if (Array.isArray(content)) {
      content.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, pageWidth - margin * 2 - 10);
        lines.forEach(line => {
          currentY = checkPageOverflow(doc, currentY, margin);
          doc.text(line, margin + 10, currentY);
          currentY += lineHeight;
        });
      });
    } else {
      const paragraphs = content.trim().split("\n").filter(p => p.trim() !== "");
      paragraphs.forEach(para => {
        const lines = doc.splitTextToSize(para, pageWidth - margin * 2);
        lines.forEach(line => {
          currentY = checkPageOverflow(doc, currentY, margin);
          doc.text(line, margin, currentY, { align: "left" });
          currentY += lineHeight;
        });
        currentY += sectionSpacing;
      });
    }
    currentY += sectionSpacing;
  };

  // --- Intro Section ---
  addSection(
    "Introduction",
    `Doshas in Kundali – the cosmic speed bumps that challenge your journey!
These planetary glitches are more like detours than dead ends. Doshas can create hurdles,
but with knowledge and remedies, you can transform these challenges into growth opportunities.
Think of it like navigating a game – the more you understand, the better you dodge the obstacles.`
  );

  // --- Mapping ---
  const doshaMapping = {
    mangal: {
      name: "Mangal Dosh",
      description: (data) =>
        `Factors: ${Object.values(data.factors || {}).join("; ")}.\nAstrological Insight: ${data.bot_response} (Score: ${data.score}%).\n${
          data.is_anshik ? "This is a partial dosha (Anshik Manglik)." : ""
        }`,
      remedies: (data) => data.cancellation?.cancellationReason || []
    },
    kaalsarp: {
      name: "Kaal Sarp Dosh",
      description: (data) => `Astrological Insight: ${data.bot_response}`,
      remedies: (data) => data.remedies || []
    },
    pitra: {
      name: "Pitra Dosh",
      description: (data) => `Astrological Insight: ${data.bot_response}`,
      remedies: (data) => data.remedies || [],
      effects: (data) => data.effects || []
    },
    papasamaya: {
      name: "Papa Samaya (Planetary Afflictions)",
      description: (data) =>
        `Planetary Afflictions:\n- Rahu ${data.rahu_papa}\n- Sun ${data.sun_papa}\n- Saturn ${data.saturn_papa}\n- Mars ${data.mars_papa}`
    },
    manglik: {
      name: "Manglik Dosh",
      description: (data) =>
        `Factors: ${data.factors?.join(", ")}.\nAspects: ${data.aspects?.join(", ")}.\nAstrological Insight: ${data.bot_response} (Score: ${data.score}%).`
    }
  };

  // --- Iterate ---
  for (const [key, data] of Object.entries(doshaData)) {
    if (!data) continue;
    if (data.is_dosha_present === false) continue;

    const config = doshaMapping[key];
    if (!config) continue;

    addSection(config.name, typeof config.description === "function" ? config.description(data) : config.description);

    if (config.effects) addSection("Effects", config.effects(data), true);
    if (config.remedies) {
      const remedies = typeof config.remedies === "function" ? config.remedies(data) : config.remedies;
      addSection("Remedies", remedies, true);
    }
  }

  // --- Footer ---
  addFooter(doc, {
    company: "TrustAstrology",
    services: "Astrology Numerology Occult Guidance Gemstone Tarot Reading Consultation",
    contact: "+91-9818999037",
    website: "www.trustastrology.com"
  });
};