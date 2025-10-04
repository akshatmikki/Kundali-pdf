import {
  fetchJaiminiKarakas, fetchPersonalCharacteristics, fetchPlanetDetails,
  fetchPlanetsInHouses, fetchManglikDosh, fetchMangalDosh, fetchKaalsarpDosh
} from "./api/fetchAstro";

// Helper: Add paragraphs with spacing
const addParagraphs = (doc, text, x, startY, maxWidth = 490, lineHeight = 14, paragraphSpacing = 10) => {
  const paragraphs = text.trim().split("\n");
  let y = startY;
  paragraphs.forEach((para) => {
    if (para.trim() === "") {
      y += paragraphSpacing;
    } else {
      const lines = doc.splitTextToSize(para, maxWidth);
      doc.text(lines, x, y);
      y += lines.length * lineHeight + paragraphSpacing;
    }
  });
  return y;
};

// Helper: Add bold heading
const addHeading = (doc, text, x, y) => {
  doc.setFont("Times", "bold");
  doc.setFontSize(16);
  doc.setTextColor("#6f3800");
  doc.text(text, x, y);
  doc.setFont("Times", "normal");
  doc.setFontSize(13);
  doc.setTextColor("#5b3200");
  return y + 20;
};

const ensureSpace = (doc, y, blockHeightGuess = 60, pageWidth = 595, pageHeight = 842) => {
  const bottomLimit = pageHeight - 90;
  if (y + blockHeightGuess > bottomLimit) {
    addFooter(doc, pageWidth);
    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");
    y = 55;
  }
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

export async function addLoveMarriagePage(doc, dob, tob, lat, lon, userData = {}) {
  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Fetch all required data
    const jaiminiKarakas = await fetchJaiminiKarakas(dob, tob, lat, lon);
    const personalChar = await fetchPersonalCharacteristics(dob, tob, lat, lon);
    const planetsInHouses = await fetchPlanetsInHouses(dob, tob, lat, lon);
    const venusDetails = await fetchPlanetDetails(dob, tob, lat, lon, "Venus");
    const jupiterDetails = await fetchPlanetDetails(dob, tob, lat, lon, "Jupiter");
    const manglikDosh = await fetchManglikDosh(dob, tob, lat, lon);
    const mangalDosh = await fetchMangalDosh(dob, tob, lat, lon);
    const kaalsarpDosh = await fetchKaalsarpDosh(dob, tob, lat, lon);

    // Safe API values
    const darakarakaPlanet = jaiminiKarakas?.response?.Dara?.planet || "a significant planet";
    const personalPrediction = personalChar?.personalised_prediction || "You are naturally introspective and seek meaningful connections.";
    const lordOfZodiac = personalChar?.lord_of_zodiac || "your chart's ruler";
    const lordHouseLocation = personalChar?.lord_house_location ? `house ${personalChar.lord_house_location}` : "an auspicious house";
    const lordZodiacLocation = personalChar?.lord_zodiac_location || "a favorable sign";

    // --- Cover Page ---
    doc.addPage();
    doc.setFillColor("#6f3800");
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setFont("Times", "bold");
    doc.setFontSize(36);
    doc.setTextColor("#fff");
    doc.text("ASTROLOGICAL SNAPSHOT:", pageWidth / 2, 150, { align: "center" });
    doc.text("LOVE & MARRIAGE", pageWidth / 2, 200, { align: "center" });

    // --- Soulmate & Darakaraka Page ---
    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");

    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#6f3800");
    doc.text("THE ONE MEANT FOR YOU:", pageWidth / 2, 60, { align: "center" });
    doc.text("YOUR DARAKARAKA & SOULMATE CONNECTION", pageWidth / 2, 90, { align: "center" });

    doc.setFont("Times", "normal");
    doc.setFontSize(13);
    doc.setTextColor("#5b3200");

    let y = 130;
    y = addParagraphs(
      doc,
      `
As per Jaimini Principles of Vedic astrology, Darakaraka is the planet with the lowest degree in a birth chart and is said to indicate the nature of a person's future spouse. The word "Dara" means "spouse" or "partner," and "Karaka" means "significator". The planet's sign, aspects, and placement in the chart can provide clues about the spouse's personality traits, physical appearance, nature, and the dynamics of the married life.

Curious how your spouse will help you explore your deeper self? With ${darakarakaPlanet} as Darakaraka, expect a partner who’ll help you uncover hidden strengths, subconscious patterns, and spiritual growth. Your relationship will be healing, transformative, and deeply connected to the unseen.

Get ready for a profound journey together. Let’s uncover the mysteries.
      `.trim(),
      55,
      y
    );

    y = ensureSpace(doc, y, 60, pageWidth, pageHeight);
    y = addHeading(doc, "Personality Traits of Your Spouse", 55, y);
    y = addParagraphs(
      doc,
      `
Your spouse is humble, spiritually dignified, and brings quiet wisdom to your private life. They have a gentle strength that doesn't need attention or praise to feel worthy. They find meaning in serving others without recognition and may avoid the spotlight you naturally enjoy. They might work in spiritual guidance, behind-the-scenes leadership, or places requiring selfless service. They need time alone to connect with their inner wisdom. Their special gift is showing how true strength often works quietly without needing applause.
      `.trim(),
      55,
      y
    );

    y = ensureSpace(doc, y, 60, pageWidth, pageHeight);
    y = addHeading(doc, "What Kind of Partners Will You Be Attracted To?", 55, y + 20);
    y = addParagraphs(
      doc,
      `
${personalPrediction}

This suggests you are drawn to partners aligned with your spiritual depth and intuitive nature. Your connections are inclined toward soulful, meaningful relationships rather than superficial attraction.
      `.trim(),
      55,
      y
    );

    y = ensureSpace(doc, y, 60, pageWidth, pageHeight);
    y = addHeading(doc, "Where Are You Likely to Meet Your Partner?", 55, y + 20);
    y = addParagraphs(
      doc,
      `
Considering that ${lordOfZodiac} is located in ${lordHouseLocation} (${lordZodiacLocation}), your opportunities to meet your significant other are likely in environments where spiritual growth and introspection are valued.

Such places may include spiritual communities, educational institutions, or settings emphasizing personal transformation.
      `.trim(),
      55,
      y
    );

    addFooter(doc, pageWidth);

    // --- Love and Romance Section ---
    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");

    y = 100;
    y = addHeading(doc, "Love and Romance", 55, y);
    y = addHeading(doc, "Love isn’t just in the air, it’s written in the stars!", 55, y);
    y = addParagraphs(
      doc,
      `
Your birth chart holds the secrets to your unique romance style.

For you, love is an exhilarating journey, not a static destination. Romance feels like a road trip with no fixed itinerary, spontaneous, thrilling, and always full of discovery. You fall for someone who excites your mind, shares your thirst for adventure, and isn’t afraid to break a few rules along the way.

Routine relationships? No way. You need a partner who keeps things fresh — from deep midnight philosophical talks to last-minute weekend getaways. Freedom is non-negotiable; clinginess or emotional heaviness is a hard pass. Your love life is full of laughter, wild stories, and constant exploration.

But beware, sometimes excitement takes priority over stability. The key is to find someone who matches your fiery enthusiasm and stays when the thrill settles. After all, love isn’t just an adventure — it’s about who stays for the whole ride.
      `.trim(),
      55,
      y
    );

    addFooter(doc, pageWidth);

    // --- Mindfulness in Love & Marriage Page ---
    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");

    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#6f3800");
    doc.text("MINDFULNESS IN LOVE & MARRIAGE", pageWidth / 2, 60, { align: "center" });

    doc.setFont("Times", "normal");
    doc.setFontSize(13);
    doc.setTextColor("#5b3200");

    y = 100;
    y = ensureSpace(doc, y, 60, pageWidth, pageHeight);
    y = addHeading(doc, "Things to Be Mindful Of in Love and Marriage", 55, y);
    y = addParagraphs(
      doc,
      `
Your spouse sometimes seems withdrawn when you want to share experiences with others. Their private nature can clash with your desire for social recognition and enjoyment. They may find your need for appreciation uncomfortable when they value humble service. Their spiritual focus can sometimes seem like a criticism of your visible approach to life.
      `.trim(),
      55,
      y
    );

    y = ensureSpace(doc, y, 60, pageWidth, pageHeight);
    y = addHeading(doc, "Manglik Dosh Insights", 55, y + 20);
    y = addParagraphs(
      doc,
      `
According to your Manglik Dosh assessment, you are ${manglikDosh?.response?.bot_response || "not manglik"}.

Key contributing factors include: ${manglikDosh?.response?.factors?.join(", ") || "No specific factors found."}

Note the planetary aspects involved: ${manglikDosh?.response?.aspects?.join(", ") || "No significant aspects noted."}

Maintaining awareness of these influences can guide you in strengthening your relationships.
      `.trim(),
      55,
      y
    );

    y = ensureSpace(doc, y, 60, pageWidth, pageHeight);
    y = addHeading(doc, "Mangal Dosh Overview", 55, y + 20);
    y = addParagraphs(
      doc,
      `
Your Mangal Dosh score is ${mangalDosh?.response?.score || "N/A"}%, and it is ${mangalDosh?.response?.is_dosha_present ? "present" : "not present"} in your chart.

Key sources of this dosh involve: ${Object.entries(mangalDosh?.response?.factors || {}).map(([planet, desc]) => `From ${planet.toUpperCase()}: ${desc}`).join("; ")}

If present, professional guidance is recommended to overcome associated challenges.
      `.trim(),
      55,
      y
    );

    y = ensureSpace(doc, y, 80, pageWidth, pageHeight);
    y = addHeading(doc, "Kaalsarp Dosh Influence and Remedies", 55, y + 20);

    // Smart fallback for all values
    const kaalsarpType = kaalsarpDosh?.response?.dosha_type;
    const kaalsarpDirection = kaalsarpDosh?.response?.dosha_direction;
    const kaalsarpDesc = kaalsarpDosh?.response?.bot_response;
    const remedies = kaalsarpDosh?.response?.remedies || [];
    const hasDosh = !!kaalsarpDosh?.response?.is_dosha_present;

    // Prepare display text
    let typeDisplay = (
      kaalsarpType && kaalsarpType !== "" && kaalsarpType.toLowerCase() !== "n/a"
        ? kaalsarpType
        : hasDosh
          ? "Type not specified"
          : "No Kaalsarp Dosh detected"
    );
    let directionDisplay = (
      kaalsarpDirection && kaalsarpDirection.toLowerCase() !== "n/a"
        ? ` of type '${kaalsarpDirection}'`
        : ""
    );
    let descDisplay =
      kaalsarpDesc && kaalsarpDesc.toLowerCase().indexOf("no kaalsarp") === -1
        ? kaalsarpDesc
        : hasDosh
          ? "Kaalsarp Dosh is present, but no further description is available."
          : "You do not have Kaalsarp dosha.";

    y = addParagraphs(
      doc,
      `
Your chart indicates the presence of Kaalsarp Dosh: ${typeDisplay}${directionDisplay}.

Description: ${descDisplay}

Recommended remedies include:
      `.trim(),
      55,
      y
    );

    const bottomLimit = pageHeight - 90;
    if (remedies.length && hasDosh) {
      remedies.forEach((remedy, index) => {
        if (y > bottomLimit) {
          addFooter(doc, pageWidth);
          doc.addPage();
          doc.setDrawColor("#a16a21");
          doc.setLineWidth(1.5);
          doc.rect(25, 25, 545, 792, "S");
          y = 55;
          y = addHeading(doc, "Kaalsarp Dosh Remedies (contd)", 55, y);
        }
        y = addParagraphs(doc, `${index + 1}. ${remedy}`, 55, y, 490, 14, 18);
      });
    } else if (!hasDosh) {
      y = addParagraphs(doc, "No remedies required, as you do not have Kaal-Sarp Dosh.", 55, y);
    }

    y = ensureSpace(doc, y, 60, pageWidth, pageHeight);
    y = addHeading(doc, "How Your Marriage Will Evolve Over Time", 55, y + 20);
    y = addParagraphs(
      doc,
      `
Your relationship deepens as outer recognition balances with inner meaning. Early mutual respect grows into appreciation for how you complement each other. Your home becomes both a showcase of achievements and a sanctuary for spiritual growth. As years pass, you build a partnership that shines while serving a higher purpose, creating a life that’s impressive to others and deeply meaningful to you.
      `.trim(),
      55,
      y
    );

    y = ensureSpace(doc, y, 60, pageWidth, pageHeight);
    // Add rectangle for last page!
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");
    y = addHeading(doc, "Remedies for a Harmonious Love and Married Life", 55, y + 20);
    y = addParagraphs(
      doc,
      `
Perform charity by donating food or clothing to the needy on Thursdays without telling others. Light a ghee lamp in a quiet corner of your home on Thursday evenings, sitting together in its gentle light while focusing on gratitude.

Your marriage carries special blessings of spiritual dignity. Make it stronger by celebrating each other's strengths, both seen and unseen.
      `.trim(),
      55,
      y
    );

    addFooter(doc, pageWidth);

  } catch (err) {
    console.error("Error creating Love & Marriage page:", err);
    throw err;
  }
}
