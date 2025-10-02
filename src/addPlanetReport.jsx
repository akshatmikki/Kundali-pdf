'use client';

import { addFooter, addPageBorder, checkPageOverflow } from "./utils/pdfUtils";

/**
 * Add a planet narrative page with story-like, personalized sections
 * @param {jsPDF} doc - jsPDF instance
 * @param {Object} planetData - planet API response object
 * @param {string} [imageUrl] - optional planet image URL
 */
export const addPlanetNarrativePage = (doc, planetData) => {
  if (!planetData) return;

  // Remove doc.addPage() here! Loop should handle pages
  addPageBorder(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const accentColor = "#a16a21";
  const textColor = "#111111";
  const lineHeight = 14;
  const sectionSpacing = 12;

  let currentY = margin;

  // --- Planet Image ---
  // if (imageUrl) {
  //   const imgSize = 80;
  //   const centerX = pageWidth / 2;
  //   doc.circle(centerX, currentY + imgSize / 2, imgSize / 2, 'S');
  //   doc.addImage(imageUrl, 'PNG', centerX - imgSize / 2, currentY, imgSize, imgSize, undefined, 'FAST');
  //   currentY += imgSize + 20;
  // }

  // --- Planet Title ---
  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(accentColor);
  doc.text(`${planetData.planet_considered} Report`, pageWidth / 2, currentY, { align: "center" });
  currentY += 30;

  // --- Section Helper ---
  const addSection = (title, content, isBoldTitle = true) => {
    if (!content || !content.trim()) return;  // ⬅️ Prevents blank sections

    currentY = checkPageOverflow(doc, currentY, margin);

    // --- Title ---
    if (title) {
      doc.setFont("Times", isBoldTitle ? "bold" : "normal");
      doc.setFontSize(14);
      doc.setTextColor(accentColor);
      doc.text(title, margin, currentY);
      currentY += lineHeight + 4;
    }

    // --- Content ---
    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(textColor);

    const paragraphs = content.trim().split("\n").filter(p => p.trim() !== "");
    paragraphs.forEach(para => {
      const lines = doc.splitTextToSize(para, pageWidth - margin * 2);
      lines.forEach(line => {
        currentY = checkPageOverflow(doc, currentY, margin);
        doc.text(line, margin, currentY, { align: "left" }); // ⬅️ FIX: use left, not justify
        currentY += lineHeight;
      });
      currentY += sectionSpacing;
    });
  };

  // --- Planet Sections ---
  const planetName = planetData.planet_considered;

  let loveText = planetName === "Venus" || planetName === "Moon" || planetName === "Mars"
    ? `With ${planetName} influencing your chart, love and relationships are an adventure.
You crave excitement and meaningful connections. Intellectual conversations and
emotional richness define your bonds. While seeking passion and excitement,
remember to balance it with stability and understanding.`
    : `In relationships, ${planetName} shapes how you express affection, care, and compatibility.`;
  addSection("Love & Relationships", loveText);

  addSection("Career & Learning", `
${planetName} influences your ambitions and learning style. You are drawn to
activities and knowledge that resonate with your cosmic energy. Your
professional growth is guided by dedication, insight, and aligning with your
inner strengths.
  `);

  let travelText = planetName === "Venus" || planetName === "Jupiter" || planetName === "Rahu"
    ? `Travel, exploration, and cultural experiences energize you. ${planetName}'s placement
suggests growth through new experiences, whether physical journeys or
spiritual adventures.`
    : `You gain perspective through experiences, sometimes finding growth
through challenges or new environments.`;
  addSection("Travel & Adventure", travelText);

  addSection("Spirituality & Guidance", `
${planetName} provides insights into your spiritual path, guiding your
beliefs, intuition, and inner growth. Pay attention to moments of reflection
and cosmic alignment, as these guide your decisions and personal evolution.
  `);

  addSection("General Prediction", planetData.general_prediction || "");
  addSection("Personalized Prediction", planetData.personalised_prediction || "");
  addSection("Planet Definition", planetData.planet_definitions || "");
  addSection("Qualities (Short)", planetData.qualities_short || "");
  addSection("Qualities (Long)", planetData.qualities_long || "");
  addSection("Zodiac Influence", planetData.planet_zodiac_prediction || "");

  if (planetData.character_keywords_positive?.length) {
    addSection("Positive Traits", planetData.character_keywords_positive.map(t => `• ${t}`).join("\n"), false);
  }
  if (planetData.character_keywords_negative?.length) {
    addSection("Negative Traits", planetData.character_keywords_negative.map(t => `• ${t}`).join("\n"), false);
  }

  addSection("Gayatri Mantra", planetData.gayatri_mantra || "");

  // --- Footer ---
  addFooter(doc);
};