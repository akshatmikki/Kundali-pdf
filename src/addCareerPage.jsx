'use client';

import { addFooter, addPageBorder, checkPageOverflow } from './utils/pdfUtils';

/**
 * Add Career Reading as PDF section dynamically based on careerData
 * @param {jsPDF} doc - jsPDF instance
 * @param {Object} careerData - Contains all career-related info, planetary traits, Mahadasha, Amatyakaraka, etc.
 */
export const addCareerPDFSection = (doc, careerData) => {
  if (!careerData) return;

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const accentColor = "#a16a21";
  const textColor = "#111111";
  const lineHeight = 14;
  const sectionSpacing = 12;

  let currentY = margin;

  addPageBorder(doc);

  // --- Page Title ---
  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(accentColor);
  doc.text("Your Career Calling Written in the Stars", pageWidth / 2, currentY, { align: "center" });
  currentY += 30;

  // --- Helper to add sections ---
  const addSection = (title, content) => {
    if (!content || !content.trim()) return;

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

    const paragraphs = content.split("\n").filter(p => p.trim() !== "");
    paragraphs.forEach(para => {
      const lines = doc.splitTextToSize(para, pageWidth - margin * 2);
      lines.forEach(line => {
        currentY = checkPageOverflow(doc, currentY, margin);
        doc.text(line, margin, currentY, { align: "left" });
        currentY += lineHeight;
      });
      currentY += sectionSpacing;
    });
  };

  // --- Introduction ---
  if (careerData.introduction) {
    addSection("Introduction", careerData.introduction);
  }

  // --- Planetary Traits (dynamic) ---
  if (careerData.planetaryTraits?.length) {
    careerData.planetaryTraits.forEach(planet => {
      const title = planet.title || `${planet.name}: Cosmic Influence`;
      addSection(title, planet.traits);
    });
  }

  // --- Personal Career Guidance ---
  if (careerData.personalCareer) {
    addSection("Your Unique Career Blueprint", careerData.personalCareer);
  }

  // --- Mahadasha Influence ---
  if (careerData.mahadasha) {
    const mahaTitle = careerData.mahadasha.title || "Mahadasha Insights";
    addSection(
      mahaTitle,
      careerData.mahadasha.description ||
      `The ${careerData.mahadasha.name || "Birth"} Mahadasha highlights your professional strengths.`
    );
  }

  // --- Amatyakaraka Influence ---
  if (careerData.amatyakaraka) {
    const amatyTitle = careerData.amatyakaraka.title || "Amatyakaraka Insights";
    addSection(amatyTitle, careerData.amatyakaraka.traits || careerData.amatyakaraka.description);
  }

  // --- Footer ---
  addFooter(doc, {
    company: "TrustAstrology",
    services: "Astrology Numerology Occult Guidance Gemstone Tarot Reading Consultation",
    contact: "+91-9818999037, +91-8604802202",
    website: "www.astroarunpandit.org, support@astroarunpandit.org"
  });
};