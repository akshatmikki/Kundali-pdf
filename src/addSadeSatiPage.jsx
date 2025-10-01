'use client';

import autoTable from 'jspdf-autotable';
import { addPageBorder, addFooter, checkPageOverflow, addParagraphs } from './utils/pdfUtils';

/**
 * Add Sade Sati and Shani events section to an existing jsPDF document
 * @param {jsPDF} doc - existing jsPDF instance
 * @param {Array} sadeSatiData - API response array
 */
export const addSadeSatiPDFSection = (doc, sadeSatiData) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let currentY = margin;

  // --- Helpers ---
  const addHeader = (text) => {
    currentY = checkPageOverflow(doc, currentY, margin);
    doc.setFont('Times', 'bold');
    doc.setFontSize(20);
    doc.setTextColor('#1B1B1B');
    doc.text(text, pageWidth / 2, currentY, { align: 'center' });
    currentY += 30;
  };

  const addSubHeader = (text) => {
    currentY = checkPageOverflow(doc, currentY, margin);
    doc.setFont('Times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor('#333333');
    doc.text(text, margin, currentY);
    currentY += 20;
  };

  const addTable = (headers, data) => {
    autoTable(doc, {
      startY: currentY,
      head: [headers],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: '#f2f2f2', fontStyle: 'bold' },
      styles: { font: 'Times', fontSize: 11 },
      margin: { left: margin, right: margin },
      didDrawPage: (dataArg) => {
        currentY = dataArg.cursor.y + 20;
      },
    });
  };

  // --- Start Sade Sati Section ---
  doc.addPage();
  addPageBorder(doc);
  addHeader('Your Sade Sati & Shani Report');

  const introText =
    'This report covers all Sade Sati, Ardhastama, Kantaka, and Ashtama Shani periods. Saturn’s influence can teach patience, discipline, and karmic resolution. Each phase below includes a description, its duration, and suggested practices to navigate it effectively.';
  currentY = addParagraphs(doc, introText, margin, currentY);

  // --- Separate Sade Sati and other Shani events ---
  const sadeSatiEvents = sadeSatiData.filter((e) => e.type === 'Sade Sati');
  const otherShaniEvents = sadeSatiData.filter((e) => e.type !== 'Sade Sati');

  // --- Group Sade Sati by direction (Rising, Peak, Setting) ---
  const groupedSadeSati = sadeSatiEvents.reduce((acc, item) => {
    const key = item.direction || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  Object.keys(groupedSadeSati).forEach((direction) => {
    addSubHeader(`Sade Sati Phases - ${direction}`);
    groupedSadeSati[direction].forEach((phase, index) => {
      currentY = checkPageOverflow(doc, currentY, margin);

      addSubHeader(`Phase ${index + 1}: ${phase.dhaiya} (${phase.direction})`);

      const phaseText = `Zodiac: ${phase.zodiac}\nStart Date: ${phase.start_date}\nEnd Date: ${phase.end_date}\nRetrograde: ${phase.retro ? 'Yes' : 'No'}\n\nSummary:`;
      currentY = addParagraphs(doc, phaseText, margin, currentY);

      let summary = '';
      switch (phase.direction) {
        case 'Rising':
          summary =
            'The Rising phase marks the beginning of Sade Sati. Focus on self-reflection, setting goals, and starting positive habits.';
          break;
        case 'Peak':
          summary =
            'The Peak phase is intense. Challenges may arise in career, health, or relationships. Practice patience, meditation, and discipline.';
          break;
        case 'Setting':
          summary =
            'The Setting phase brings relief and closure. Reflect on lessons learned and plan for future growth.';
          break;
        default:
          summary = 'This phase is unique and its effects can vary. Stay mindful and disciplined.';
      }
      currentY = addParagraphs(doc, summary, margin, currentY);
    });
  });

  // --- Other Shani Events Table ---
  if (otherShaniEvents.length > 0) {
    addSubHeader('Other Shani Events (Kantaka, Ashtama, Ardhastama)');
    const shaniTableData = otherShaniEvents.map((item) => [
      item.type,
      item.zodiac,
      item.dhaiya,
      item.direction,
      item.start_date,
      item.end_date,
      item.retro ? 'Yes' : 'No',
    ]);
    addTable(
      ['Type', 'Zodiac', 'Dhaiya', 'Direction', 'Start Date', 'End Date', 'Retrograde'],
      shaniTableData
    );
  }

  // --- Remedies & Mantras ---
  addSubHeader('Remedies & Mantras');
  const remediesText =
    '1. Rudraksha Recommendations:\n• 7 Mukhi: Shield against financial instability.\n• 14 Mukhi: Sharpens focus.\n• 17 Mukhi: Boosts confidence and resilience.\n\n2. Daily Practices:\n• Wake up early & start with gratitude\n• Practice mindfulness & meditation\n• Declutter & simplify\n• Stay organized\n• Eat & sleep on time\n\n3. Mantra Chanting:\nShani Gayatri Mantra\nॐ शनैश्चरा य वि द्महे ...';
  currentY = addParagraphs(doc, remediesText, margin, currentY);

  addFooter(doc);
};