import { jsPDF } from "jspdf";

export const generateCosmicReport = async () => {
  const doc = new jsPDF("p", "pt", "a4");

  // Front page background image
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "https://media.istockphoto.com/id/2207140922/photo/zodiac-signs-and-astrology-wheel.jpg?s=1024x1024&w=is&k=20&c=DSCCpmdd_Jptk6cAYTwMiU52ODWOwirnJlcC_fdQ0Og=";
  await new Promise((resolve) => { img.onload = resolve; });

  doc.addImage(img, "PNG", 0, 0, 595, 842);
  const x = 297.5;
  const y = 180;

  doc.setFont("CinzelDecorative", "normal");
  doc.setFontSize(48);
  doc.setTextColor("#fff8e7");
  doc.text("COSMIC\nCODE", x, y, { align: "center" });

  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#000000");
  doc.text("AMIT GAUR", 250, 300);

  doc.setFontSize(14);
  doc.text("THE UNIVERSE WITHIN YOU", 180, 330);

  // Page 2
  doc.addPage();

  // Border
  doc.setDrawColor("#a16a21");
  doc.setLineWidth(1.5);
  doc.rect(25, 25, 545, 792, "S");

  // Header
  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#000000");
  doc.text("DISCLAIMER", 297.5, 60, { align: "center" });

  doc.setTextColor("#a16a21");
  doc.setFont("Times", "normal");
  doc.setFontSize(13);

  const text = `
This Cosmic Code Report is crafted using the timeless wisdom of Vedic astrology, offering insights into how cosmic energies influence your life. Every recommendation is based on precise astrological calculations, no personal opinions, just cosmic alignment!

Astrology is a vast and multidimensional science, with interpretations that may vary across astrologers, platforms, and traditions. This report does not predict fixed outcomes but serves as a guiding light to help you navigate life with greater awareness and cosmic harmony.

While certain practices are believed to influence energetic fields and planetary alignments, they are not a substitute for medical, legal or professional advice. Any suggested remedies, whether it's following a spiritual practice, chanting a mantra, or making a donation, should be embraced only if they align with your belief system and intuition. Their effectiveness is influenced by faith, intent, and proper adherence to astrological wisdom.

Results are unique to each individual, and no guarantees are provided. The Author is not responsible for any decisions or actions taken based on this report, nor for any unexpected outcomes. This report is a tool for cosmic awareness and spiritual evolution, not a guaranteed solution to life's challenges.

Author reserves the right to update the content, design, or recommendations in this report at any time without prior notice. No claims or liabilities will be accepted for unfavorable results, as the impact of astrological remedies varies for each person.

Embrace this report with an open mind and a cosmic perspective! The universe is always guiding you, but ultimately, you hold the power to shape your destiny.
`;

  doc.text(doc.splitTextToSize(text, 500), 50, 110);

  const footerStartY = 765;
  const footerLineHeight = 12;

  doc.setFontSize(10);
  doc.setTextColor("#000000");
  doc.setFont("Times", "bold");
  doc.text("Astro Arun Pandit Private Limited", 297.5, footerStartY, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("Times", "normal");
  doc.text("Astrology - Numerology - Occult Guidance - Gemstone - Tarot Reading - Consultation", 297.5, footerStartY + footerLineHeight, { align: "center" });
  doc.text("91-9818999037, 91-8604802202", 297.5, footerStartY + 2 * footerLineHeight, { align: "center" });
  doc.text("www.astroarunpandit.org, support@astroarunpandit.org", 297.5, footerStartY + 3 * footerLineHeight, { align: "center" });

 // Page 5 (Message from the Author)
  doc.addPage();

  doc.setDrawColor("#a16a21");
  doc.setLineWidth(1.5);
  doc.rect(25, 25, 545, 792, "S");

  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#000000");
  doc.text("MESSAGE FROM THE AUTHOR", 297.5, 60, { align: "center" });

  doc.setFont("Times", "normal");
  doc.setFontSize(13);
  doc.setTextColor("#a16a21");
  doc.text("Welcome to Your Personalized Cosmic Code Report", 55, 90);

  const authorText = `
Throughout my journey in the realm of astrology, I've had the privilege of helping individuals navigate life's path with greater clarity and alignment. Each person's journey is unique, but the quest for balance, success, and inner peace is something we all share.

This report is crafted with care, blending ancient Vedic wisdom with practical insights to help you understand how cosmic energies influence your life. Every recommendation here is based on astrological principles, but remember, your intuition and personal experiences play a key role in how you connect with this knowledge.

Inside these pages, you'll discover how planetary forces shape different aspects of your life and how aligning with them can bring harmony. Some insights may instantly resonate with you, while others may take time to unfold, embrace what feels right, and explore with an open mind.

At its core, this report is not just about cosmic alignments, it's about you and your journey toward self-awareness and fulfillment. May these insights bring you clarity, inspiration, and a deeper connection to the universe around you.

Wishing you a radiant and prosperous journey ahead!

Warm regards,
Astro Arun Pandit
`;

  doc.setFont("Times", "normal");
  doc.setFontSize(13);
  doc.setTextColor("#a16a21");
  doc.text(doc.splitTextToSize(authorText, 490), 55, 110);

  const footerStartYPage5 = 765;
  const footerLineHeightPage5 = 12;

  doc.setFontSize(10);
  doc.setTextColor("#000000");
  doc.setFont("Times", "bold");
  doc.text("Astro Arun Pandit Private Limited", 297.5, footerStartYPage5, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("Times", "normal");
  doc.text("Astrology - Numerology - Occult Guidance - Gemstone - Tarot Reading - Consultation", 297.5, footerStartYPage5 + footerLineHeightPage5, { align: "center" });
  doc.text("91-9818999037, 91-8604802202", 297.5, footerStartYPage5 + 2 * footerLineHeightPage5, { align: "center" });
  doc.text("www.astroarunpandit.org, support@astroarunpandit.org", 297.5, footerStartYPage5 + 3 * footerLineHeightPage5, { align: "center" });


  
  // Page 3
  doc.addPage();

  doc.setDrawColor("#a16a21");
  doc.setLineWidth(1.5);
  doc.rect(25, 25, 545, 792, "S");

  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#000000");
  doc.text("BEST WAY TO STUDY THE REPORT", 297.5, 60, { align: "center" });

  doc.setFont("Times", "normal");
  doc.setFontSize(13);
  doc.setTextColor("#a16a21");
  doc.text("Unlocking the Power of Your Cosmic Code Report", 55, 90);

  const studyText = `
Reading your Cosmic Code Report is the first step in aligning yourself with the universe’s cosmic energies. It signifies your openness to understanding how planetary forces influence different aspects of your life, bringing clarity, balance, and deeper self-awareness. But simply reading it once may not be enough to fully grasp its depth and significance.

To truly absorb the wisdom within, we recommend revisiting this report multiple times; at least three times. Each reading will unlock new insights, helping you connect with the astrological guidance on a deeper level. Cosmic influences work in layers, and repeated reading will allow you to notice details you might overlook initially.

Before diving into your report, take a moment to calm your mind. A focused and open mindset will help you absorb the guidance better, making it easier to apply the suggested practices effectively. Think of this as a personalized roadmap, meant to be studied, reflected upon, and revisited as you navigate your journey.

By following this approach, you'll be able to unlock the full potential of this cosmic knowledge, make empowered decisions, and move forward with greater confidence and clarity.
`;

  doc.text(doc.splitTextToSize(studyText, 490), 55, 110);

  doc.setFontSize(10);
  doc.setTextColor("#000000");
  doc.setFont("Times", "bold");
  doc.text("Astro Arun Pandit Private Limited", 297.5, 765, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("Times", "normal");
  doc.text("Astrology - Numerology - Occult Guidance - Gemstone - Tarot Reading - Consultation", 297.5, 777, { align: "center" });
  doc.text("91-9818999037, 91-8604802202", 297.5, 789, { align: "center" });
  doc.text("www.astroarunpandit.org, support@astroarunpandit.org", 297.5, 801, { align: "center" });

 // PAGE 5: Table of Contents (as per image provided)
  doc.addPage();
  doc.setDrawColor("#a16a21");
  doc.setLineWidth(1.5);
  doc.rect(25, 25, 545, 792, "S");
  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#a16a21");
  doc.text("TABLE OF CONTENTS", 297.5, 60, { align: "center" });
  doc.setFont("Times", "normal");
  doc.setFontSize(13);
  doc.setTextColor("#a16a21");
  const tocLines2 = [
    "01  Understanding Your Planetary Blueprint",
    "      Fundamental Details",
    "      Lagna, Moon & Navamsha Charts",
    "      Snapshot of Partnership",
    "      Planetary Positions & Degrees (Table)",
    "      Shadvargiya & Divisional Charts",
    "      Dasha Chart",
    "      Ashhtakavarga Charts",
    "",
    "02  The Influence of Your Birth Chart",
    "      Your Panchang Decoded",
    "      Your Pillars of the Self: Chandra, Lagna & Nakshatra",
    "      Your Personal Planetary Profile",
    "      Planetary Influences – 12 Houses & Its Aspects",
    "",
    "03  Bhavphal: Your Life Through the 12 Houses",
    "      Significance of each Bhav/house",
    "      Detailed analysis of each Bhav",
    "",
    "04  When Energies Merge: Planetary Conjunctions of Your Chart",
    "      Significance of Conjunctions in your Chart",
    "      Detailed analysis of each conjunction in your chart",
    "",
    "05  Astrological Snapshot: Love & Marriage",
    "      Influence of the 5th House – Love, romance, and emotional connections",
    "      Dasha-Am – The planet governing your marriage and relationships",
    "      Timing of Marriage (Table) – Predicting significant relationship timelines",
    "",
    "06  Your Career Calling Written in the Stars",
    "      Two Pillars of Work: Sun's Vision, Saturn's Direction",
    "      Your Birth Mahadasha & Career Calling",
    "      Role of Amatyakaraka",
  ];
  let tocY2 = 100;
  for (const line of tocLines2) {
    if (/^\d{2}/.test(line)) {
      doc.setFont("Times", "bold");
    } else {
      doc.setFont("Times", "normal");
    }
    doc.text(line, 55, tocY2);
    tocY2 += line.trim() === "" ? 7 : 16;
  }
  const footerStartYPage6 = 765;
  const footerLineHeightPage6 = 12;
  doc.setFontSize(10);
  doc.setTextColor("#000000");
  doc.setFont("Times", "bold");
  doc.text("Astro Arun Pandit Private Limited", 297.5, footerStartYPage6, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("Times", "normal");
  doc.text("Astrology - Numerology - Occult Guidance - Gemstone - Tarot Reading - Consultation", 297.5, footerStartYPage6 + footerLineHeightPage6, { align: "center" });
  doc.text("91-9818999037, 91-8604802202", 297.5, footerStartYPage6 + 2 * footerLineHeightPage6, { align: "center" });
  doc.text("www.astroarunpandit.org, support@astroarunpandit.org", 297.5, footerStartYPage6 + 3 * footerLineHeightPage6, { align: "center" });


   // Page 6 (Table of Contents)
  doc.addPage();

  // Border
  doc.setDrawColor("#a16a21");
  doc.setLineWidth(1.5);
  doc.rect(25, 25, 545, 792, "S");

  // Header
  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#a16a21");
  doc.text("TABLE OF CONTENTS", 297.5, 60, { align: "center" });

  // Content
  doc.setFont("Times", "normal");
  doc.setFontSize(13);
  doc.setTextColor("#a16a21");

  const tocLines = [
    "07  Chara Karakas: The Planets Behind Your Purpose",
    "   • Meaning and Significance of each Chara Karaka",
    "   • Impact of each Chara Karaka in your life",
    "   • Awaken Your Purpose with Chara Karaka",
    "",
    "08  Rahu-Ketu Analysis: The Karmic Push and Pull",
    "   • Significance of Rahu-Ketu",
    "   • Your Rahu-Ketu Map",
    "",
    "09  Born with Fire: Understanding the Mangalik Effect",
    "   • Meaning of Mangalik Dosh",
    "   • Effect of Manglik in your Birth Chart",
    "",
    "10  Your Sade Sati Journey: Challenge to Transformation",
    "   • Significance of Sade Sati",
    "   • Phases of Sade Sati",
    "   • Importance of Sade Sati",
    "",
    "11  Raj Yogas: The Combinations of Fame & Fortune",
    "12  Astrological Doshas: Karmic Blocks & Planetary Lessons",
    "13  When Planets Lead: A Journey Through Your Mahadashas",
    "   • Overview of Mahadashas",
    "   • Mahadasha Path",
    "   • Antardasha Path",
    "",
    "14  Numerology: Digits of Divinity",
    "   • Moolank – Your core personality number",
    "   • Bhagyank – The number defining your destiny and success path",
    "   • Expression Number – Your key to achieving goals and recognition",
    "   • Connection Number – Understanding your interpersonal and social strengths"
  ];

  let tocY = 100;
  for (const line of tocLines) {
    if (/^\d{2}/.test(line)) {
      doc.setFont("Times", "bold");
    } else {
      doc.setFont("Times", "normal");
    }
    doc.text(line, 55, tocY);
    tocY += line.trim() === "" ? 7 : 16;
  }

  const footerStartYPage4 = 765;
  const footerLineHeightPage4 = 12;

  doc.setFontSize(10);
  doc.setTextColor("#000000");
  doc.setFont("Times", "bold");
  doc.text("Astro Arun Pandit Private Limited", 297.5, footerStartYPage4, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("Times", "normal");
  doc.text(
    "Astrology - Numerology - Occult Guidance - Gemstone - Tarot Reading - Consultation",
    297.5,
    footerStartYPage4 + footerLineHeightPage4,
    { align: "center" }
  );
  doc.text(
    "91-9818999037, 91-8604802202",
    297.5,
    footerStartYPage4 + 2 * footerLineHeightPage4,
    { align: "center" }
  );
  doc.text(
    "www.astroarunpandit.org, support@astroarunpandit.org",
    297.5,
    footerStartYPage4 + 3 * footerLineHeightPage4,
    { align: "center" }
  );

  doc.save("CosmicDMReport.pdf");
};
