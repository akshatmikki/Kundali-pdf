'use client';

import { addFooter, addPageBorder, checkPageOverflow } from './utils/pdfUtils';
import { jsPDF } from "jspdf";

/**
 * Initialize Devanagari font dynamically from TTF
 */
/**
 * Convert ArrayBuffer to Base64
 */
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // safe chunk size for large buffers
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
};

/**
 * Initialize Devanagari font dynamically
 */
const initDevanagariFont = async (doc) => {
  const res = await fetch("/NotoSansDevanagari-VariableFont_wdth,wght.ttf");
  const buffer = await res.arrayBuffer();
  const base64Font = arrayBufferToBase64(buffer); // ⚡ Convert ArrayBuffer → Base64
  doc.addFileToVFS("NotoSansDevanagari.ttf", base64Font);
  doc.addFont("NotoSansDevanagari.ttf", "NotoDevanagari", "normal");
};


/**
 * Add Sade Sati and Shani events as narrative sections
 * @param {jsPDF} doc - jsPDF instance
 * @param {Array} sadeSatiData - API response array
 */
export const addSadeSatiPDFSection = async (doc, sadeSatiData) => {
  if (!sadeSatiData || !sadeSatiData.length) return;

  await initDevanagariFont(doc); // ⚡️ Make sure we await

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
  doc.text("Your Sade Sati & Shani Report", pageWidth / 2, currentY, { align: "center" });
  currentY += 30;

  const addSection = (title, content, options = {}) => {
    if (!content || !content.trim()) return;

    currentY = checkPageOverflow(doc, currentY, margin);

    if (title) {
      doc.setFont("Times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(accentColor);
      doc.text(title, margin, currentY);
      currentY += lineHeight + 4;
    }

    doc.setFont(options.font || "Times", options.style || "normal");
    doc.setFontSize(12);
    doc.setTextColor(options.color || textColor);

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

  // --- Intro ---
  addSection(
    "Introduction",
    `This report covers all Sade Sati, Ardhastama, Kantaka, and Ashtama Shani periods.
Saturn’s influence teaches patience, discipline, and karmic resolution. Each phase below
includes a description, its duration, and suggested practices to navigate it effectively.`
  );

  // --- Sade Sati and Other Shani Events ---
  const sadeSatiEvents = sadeSatiData.filter(e => e.type === 'Sade Sati');
  const otherShaniEvents = sadeSatiData.filter(e => e.type !== 'Sade Sati');

  // Sade Sati Phases
  const groupedSadeSati = sadeSatiEvents.reduce((acc, item) => {
    const key = item.direction || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  Object.keys(groupedSadeSati).forEach(direction => {
    groupedSadeSati[direction].forEach((phase, index) => {
      addSection(`Phase ${index + 1} - ${phase.dhaiya} (${direction})`,
        `Zodiac: ${phase.zodiac}
Start Date: ${phase.start_date}
End Date: ${phase.end_date}
Retrograde: ${phase.retro ? 'Yes' : 'No'}

${phase.direction === 'Rising'
  ? 'The Rising phase marks the beginning of Sade Sati. Focus on self-reflection, setting goals, and starting positive habits.'
  : phase.direction === 'Peak'
    ? 'The Peak phase is intense. Challenges may arise in career, health, or relationships. Practice patience, meditation, and discipline.'
    : phase.direction === 'Setting'
      ? 'The Setting phase brings relief and closure. Reflect on lessons learned and plan for future growth.'
      : 'This phase is unique and its effects can vary. Stay mindful and disciplined.'
}`
      );

      let mantra = '';
      switch (phase.direction) {
        case 'Rising':
          mantra = `7 Mukhi Rudraksha Mantra:
ॐ ह्रीं श्रीं क्लीं सातमुख रुद्राक्षाय नमः`;
          break;
        case 'Peak':
          mantra = `Shani Gayatri Mantra:
ॐ शनैश्चराय विद्महे शनैश्चराय धीमहि तन्नः शनैश्चरः प्रचोदयात्`;
          break;
        case 'Setting':
          mantra = `Shani Beej Mantra:
ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः`;
          break;
        default:
          mantra = `Shani Gayatri Mantra:
ॐ शनैश्चराय विद्महे शनैश्चराय धीमहि तन्नः शनैश्चरः प्रचोदयात्`;
      }

      addSection("Recommended Mantra", mantra, { font: "NotoDevanagari", style: "normal", color: "#000080" });
    });
  });

  // Other Shani Events
  otherShaniEvents.forEach((event, idx) => {
    addSection(`Shani Event ${idx + 1} - ${event.type}`,
      `Zodiac: ${event.zodiac}
Dhaiya: ${event.dhaiya}
Direction: ${event.direction}
Start Date: ${event.start_date}
End Date: ${event.end_date}
Retrograde: ${event.retro ? 'Yes' : 'No'}`
    );
  });

  addFooter(doc);
};

