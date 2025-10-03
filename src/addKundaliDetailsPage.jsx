import { fetchKundliDetails, fetchMoonSign, fetchAscendant } from './api/fetchAstro';

// Helper - add paragraph text nicely
const addParagraphs = (doc, text, x, startY, maxWidth, lineHeight = 14, paragraphSpacing = 10) => {
  const paragraphs = text.trim().split("\n");
  let y = startY;
  paragraphs.forEach((para) => {
    if (para.trim() === "") {
      y += paragraphSpacing; // space for blank lines
    } else {
      const lines = doc.splitTextToSize(para, maxWidth);
      doc.text(lines, x, y);
      y += lines.length * lineHeight + paragraphSpacing;
    }
  });
  return y;
};

// Footer helper
function addFooter(doc, pageWidth) {
  const footerY = doc.internal.pageSize.getHeight() - 55;
  doc.setFont("Times", "bold");
  doc.setFontSize(11);
  doc.setTextColor("#6f3800");
  doc.text("TrustAstrology", pageWidth / 2, footerY, { align: "center" });

  doc.setFont("Times", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#6f3800");
  doc.text(
    "Astrology · Numerology · Occult Guidance · Gemstone · Tarot Reading · Consultation",
    pageWidth / 2, footerY + 10, { align: "center" }
  );
  doc.text(
    "+91-9818999037, +91-8604802202",
    pageWidth / 2, footerY + 20, { align: "center" }
  );
  doc.setTextColor("#323aff");
  doc.text("www.astroarunpandit.org · support@astroarunpandit.org", pageWidth / 2, footerY + 30, { align: "center" });
}

// Helper - async load image by URL and add
async function addImageFromUrl(doc, imageUrl, x, y, width, height) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      doc.addImage(img, "PNG", x, y, width, height);
      resolve();
    };
    img.onerror = err => reject(err);
  });
}

export async function addKundaliDetailsPage(doc, dob, tob, lat, lon) {
  try {
    const kundliData = await fetchKundliDetails(dob, tob, lat, lon);
    const moonSignData = await fetchMoonSign(dob, tob, lat, lon);
    const ascendantData = await fetchAscendant(dob, tob, lat, lon);

    const pageWidth = doc.internal.pageSize.getWidth();
    const resp = kundliData.response || {};

    // =====================
    // 1. THREE PILLARS PAGE
    // =====================
    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#6f3800");
    doc.text("THREE PILLARS OF THE SELF:", pageWidth / 2, 60, { align: "center" });
    doc.text("CHANDRA, LAGNA & NAKSHATRA", pageWidth / 2, 90, { align: "center" });

    doc.setFillColor("#7A481F");
    doc.roundedRect(68, 110, 464, 530, 20, 20, "F");
    doc.setFont("Times", "normal");
    doc.setFontSize(13);
    doc.setTextColor("#fff");
    addParagraphs(
      doc,
      `
Your Lagna (Ascendant), Moon Sign (Chandra), and Nakshatra are the VIPs of your birth chart! They shape your personality, emotions, and how you interact with the world.
Astrology is the art of uncovering your truest self through the lens of the cosmos. Each of these three pillars—Lagna, Moon Sign, and Nakshatra—forms the foundation of your personality blueprint.

- Your Lagna (Ascendant) marks the sunrise of your individuality, revealing how others see you and how you take on life's challenges.
- The Moon Sign reflects the lunar undercurrent of your emotions, memories, and instincts, coloring your reactions and intimate world.
- Nakshatra, the star constellation at your birth, adds nuance by describing your hidden talents, relationship patterns, and the karmic story you carry forward.

Together, these influences reveal how you shine outwardly, how you feel inwardly, and what inspires your soul's deepest journey.
Let's explore what these celestial influences say about you!
      `.trim(),
      80,
      135,
      464 - 36 // usable width
    );
    await addImageFromUrl(doc, "/Astrology.png", pageWidth / 2 - 110, 440, 220, 180);

    // =====================
    // 2. MOON SIGN
    // =====================
    const moonSign = moonSignData.response.moon_sign || "N/A";
    const moonSignImage = `/${moonSign}.png`; // dynamic image from public folder

    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#6f3800");
    doc.text("MOON SIGN", pageWidth / 2, 60, { align: "center" });

    doc.setFillColor("#8c5319");
    doc.roundedRect(68, 90, 464, 550, 26, 26, "F");
    await addImageFromUrl(doc, moonSignImage, pageWidth / 2 - 55, 105, 110, 90);

    // **Sign name below the image**
    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    doc.setTextColor("#fff");
    doc.text(`MOON SIGN: ${moonSign.toUpperCase()}`, 110, 210);

    // **Description text below the sign name**
    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor("#fff");
    addParagraphs(
      doc,
      `
Since your Moon sign is ${moonSign}, you turn everyday moments into special memories without even trying. Your warmth and light-giving nature inspire and uplift others, making you emotionally strong and deeply connected.

Your sensitivity allows you to feel deeply, and your loyalty is unmatched. Though you may be reserved, your heart longs for connection and recognition balanced with humility.

Embrace this special gift and the cosmic wisdom it brings.

People with Moon in ${moonSign} are natural encouragers, often lifting up friends during tough times. You have the ability to make others feel special, seen, and celebrated. In creative pursuits, your imagination blazes brightly, and you thrive when given the stage to perform—whether that's in art, leadership, or simple acts of kindness.

Beware of letting your need for appreciation overshadow your true desires; your joy multiplies when you remember that your light is meant to be shared, not just applauded. When balanced, your ${moonSign} Moon brings both confidence and heartfelt compassion to everything you do.
      `.trim(),
      110,
      230, // slightly below the sign name
      464 - 80
    );
    addFooter(doc, pageWidth);

    // =====================
    // 3. ASCENDANT
    // =====================
    const ascendant = ascendantData.response.ascendant || "N/A";
    const ascendantImage = `/${ascendant}.png`; // dynamic image from public folder

    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#6f3800");
    doc.text("ASCENDANT", pageWidth / 2, 60, { align: "center" });

    doc.setFillColor("#8c5319");
    doc.roundedRect(68, 90, 464, 550, 26, 26, "F");
    await addImageFromUrl(doc, ascendantImage, pageWidth / 2 - 55, 105, 110, 90);

    // **Sign name below the image**
    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    doc.setTextColor("#fff");
    doc.text(`ASCENDANT: ${ascendant.toUpperCase()}`, 110, 210);

    // **Description text below the sign name**
    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor("#fff");
    addParagraphs(
      doc,
      `
Your Ascendant, or Lagna, ${ascendant} brings a powerful and regal energy. You naturally draw attention with your confidence and magnetism. Your leadership and passion inspire those around you.

You carry yourself with dignity and a desire to leave a meaningful mark on the world. Balance pride with humility and keep nurturing your generous heart. Your potential is limitless when you embrace your true strengths.

Those who meet you often remember your presence long after an interaction, thanks to your natural charisma and authenticity. You're driven towards goals with enthusiasm, and setbacks rarely dampen your spirits for long.

Keep in mind, true strength lies not just in visibility but in the courage to help others shine too. As you move through life, your regal ${ascendant} Ascendant reminds you to uplift others as you grow, ensuring that your legacy inspires and empowers all those you encounter.
      `.trim(),
      110,
      230,
      464 - 80
    );
    addFooter(doc, pageWidth);

    // =====================
    // 4. NAKSHATRA
    // =====================
    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#6f3800");
    doc.text("NAKSHATRA", pageWidth / 2, 60, { align: "center" });

    doc.setFillColor("#8c5319");
    doc.roundedRect(68, 90, 464, 580, 26, 26, "F");
    await addImageFromUrl(doc, "/nakshatra.png", pageWidth / 2 - 55, 115, 110, 90);

    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    doc.setTextColor("#fff");
    doc.text(`NAKSHATRA: ${resp.nakshatra?.toUpperCase() || 'N/A'}`, 110, 220);

    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor("#fff");
    addParagraphs(
      doc,
      `
You are born under ${resp.nakshatra} Nakshatra, which falls in the zodiac sign of ${resp.rasi} and is ruled by ${resp.nakshatra_lord}. Your nakshatra is all about love, creativity, and pleasure. Linked to Bhaga, the god of fortune, you attract joy, beauty, and luxury effortlessly. People enjoy being around you because you bring warmth, charm, and a sense of ease to any situation. You value love, relationships, and self-expression, and you know how to enjoy life to the fullest. But beyond the glamour, you also have a deep well of creativity and a desire to make life beautiful—not just for yourself, but for everyone around you.

Since you’re born in Pada ${resp.nakshatra_pada} of ${resp.nakshatra} Nakshatra, your love life is anything but simple. You often juggle dual relationships, secret affairs, or complex romantic entanglements, as your heart craves excitement and variety. Your flirtation skills and social charm make you irresistible, allowing you to persuade, sell, and entertain with ease.

You are a nomadic creator, producing your best work while traveling or in ever-changing environments. The idea of traditional marriage may not appeal to you; you prefer non-traditional setups, long-distance romances, or relationships that keep your mind engaged. For you, life is a dance of movement, creativity, and endlessly shifting connections.
      `.trim(),
      110,
      250,
      464 - 80
    );
    addFooter(doc, pageWidth);

  } catch (err) {
    console.error("Error adding Kundali pages:", err);
    throw err;
  }
}
