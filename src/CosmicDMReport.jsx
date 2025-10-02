import { jsPDF } from "jspdf";
import { addPanchangPage } from "./addPanchangPage";
import { fetchKundliDetails, fetchPanchangData, fetchSunrise, fetchSunset, fetchMoonSign, fetchSunSign, fetchPlanetReport, fetchSadeSatiTable, fetchMahaDashaPredictions, fetchAshtakvarga,fetchMangalDosh, fetchManglikDosh,fetchYogaList,fetchShadBala,fetchPitraDosh,fetchKaalsarpDosh, fetchPapasamaya } from "./api/fetchAstro";
import { generateAvakahadaChakraPDF } from "./addAvakahadachakra";
import { addChartsTwoPerPage } from "./addChartPage";
import { addShodashvargaPage } from "./addShodashvarga";
import { addVimshottariDashaPage } from "./addVimshottariPage";
import { addPanchangAnalysisPage } from "./addPanchangDetails";
import { addPanchangNarrativePage } from "./addPanchangNarativePage";
import { addKundaliDetailsPage } from "./addKundaliDetailsPage";
import { addPlanetNarrativePage } from "./addPlanetReport";
import { addSadeSatiPDFSection } from "./addSadeSatiPage";
import { addCareerPDFSection } from "./addCareerPage";
// Helper function to draw paragraph text with spacing
const addParagraphs = (doc, text, x, startY, lineHeight = 14, paragraphSpacing = 10) => {
  const paragraphs = text.trim().split("\n"); // split by line breaks
  let y = startY;

  paragraphs.forEach((para) => {
    if (para.trim() === "") {
      y += paragraphSpacing; // extra spacing for empty lines
    } else {
      const lines = doc.splitTextToSize(para, 490); // fit text width
      doc.text(lines, x, y);
      y += lines.length * lineHeight + paragraphSpacing; // line height + paragraph spacing
    }
  });

  return y; // return last y position for further content
};

// Full report generator
export const generateFullCosmicReport = async (dob, time, lat, lon, userData) => {
  try {
    // Fetch all data
    const panchangData = await fetchPanchangData(dob, time, lat, lon);
    const kundliData = await fetchKundliDetails(dob, time, lat, lon);
    const sunriseData = await fetchSunrise(dob, time, lat, lon);
    const sunsetData = await fetchSunset(dob, time, lat, lon);
    const moonSignData = await fetchMoonSign(dob, time, lat, lon);
    const sunSignData = await fetchSunSign(dob, time, lat, lon);
    const mangalDosh = await fetchMangalDosh(dob, time, lat, lon);
const kaalsarpDosh = await fetchKaalsarpDosh(dob, time, lat, lon);
const pitraDosh = await fetchPitraDosh(dob, time, lat, lon);
const papasamaya = await fetchPapasamaya(dob, time, lat, lon);
const moonSign = moonSignData?.response?.moon_sign || "Unknown Moon Sign";
const sunSign = sunSignData?.response?.sun_sign || "Unknown Sun Sign";


    // const sadeSatiData = await fetchSadeSatiTable(dob, time, lat, lon);

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Cover Page ---
   // --- Clean Cover Page (no background) ---
doc.setFillColor("#ffffff"); // ensure white background
doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");

//
// ✅ Company Logo + Name as Header
//
const logo = new Image();
logo.crossOrigin = "anonymous";
logo.src = "/logo.png"; // <-- replace with actual logo path
await new Promise((res) => { logo.onload = res; });

const logoWidth = 80;
const logoHeight = 80;
doc.addImage(logo, "PNG", pageWidth / 2 - logoWidth / 2, 50, logoWidth, logoHeight);

// Company Name
doc.setFont("Times", "bold");
doc.setFontSize(26);
doc.setTextColor("#333333");
doc.text("TrustAstrology", pageWidth / 2, 150, { align: "center" });

//
// ✅ Decorative Line under Company Name
//
doc.setDrawColor("#a16a21");   // golden-brown theme color
doc.setLineWidth(1);
doc.line(150, 160, pageWidth - 150, 160); 
// (x1, y1, x2, y2) — adjust 150 padding if you want wider/narrower line

//
// ✅ Report Title
//
doc.setFont("CinzelDecorative", "normal");
doc.setFontSize(48);
doc.setTextColor("#000000");
doc.text("COSMIC\nCODE", pageWidth / 2, 260, { align: "center" });

//
// ✅ User Details
//
doc.setFont("Times", "normal");
doc.setFontSize(22);
doc.setTextColor("#444444");

doc.text(`Name: ${userData?.name || "User"}`, pageWidth / 2, 380, { align: "center" });

const dobStrCover = typeof dob === "string"
  ? dob.split("-").reverse().join("/")  // YYYY-MM-DD → DD/MM/YYYY
  : `${dob.getDate().toString().padStart(2, "0")}/${(dob.getMonth() + 1).toString().padStart(2, "0")}/${dob.getFullYear()}`;

doc.text(`Date of Birth: ${dobStrCover}`, pageWidth / 2, 420, { align: "center" });

    // --- Disclaimer Page ---
    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#000");
    doc.text("DISCLAIMER", pageWidth / 2, 60, { align: "center" });

    const disclaimerText = `
This Cosmic Code Report is crafted using the timeless wisdom of Vedic astrology,
offering insights into how cosmic energies influence your life. Every
recommendation is based on precise astrological calculations, no personal opinions,
just cosmic alignment!

Astrology is a vast and multidimensional science, with interpretations that may vary
across astrologers, platforms, and traditions. This report does not predict fixed
outcomes but serves as a guiding light to help you navigate life with greater
awareness and cosmic harmony.

While certain practices are believed to influence energetic fields and planetary
alignments, they are not a substitute for medical, legal, or professional advice. Any
suggested remedies,whether it’s following a spiritual practice, chanting a mantra, or
making a donation, should be embraced only if they align with your belief system
and intuition. Their effectiveness is influenced by faith, intent, and proper adherence
to astrological wisdom.

Results are unique to each individual, and no guarantees are provided. The Author is
not responsible for any decisions or actions taken based on this report, nor for any
unexpected outcomes. This report is a tool for cosmic awareness and spiritual
evolution, not a guaranteed solution to life’s challenges.

Author reserves the right to update the content, design, or recommendations in this
report at any time without prior notice. No claims or liabilities will be accepted for
any unfavorable results, as the impact of astrological remedies varies for each
person.

Embrace this report with an open mind and a cosmic perspective! The universe is
always guiding you, but ultimately, you hold the power to shape your destiny.
`;
    doc.setFont("Times", "normal");
    doc.setFontSize(13);
    doc.setTextColor("#a16a21");
    addParagraphs(doc, disclaimerText, 50, 110);

    // --- Author Message Page ---
    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#000");
    doc.text("MESSAGE FROM THE AUTHOR", pageWidth / 2, 60, { align: "center" });

    const authorText = `
Welcome to Your Personalized Cosmic Code Report
Throughout my journey in the realm of astrology, I’ve had the privilege of helping
individuals navigate life’s path with greater clarity and alignment. Each person’s
journey is unique, but the quest for balance, success, and inner peace is something
we all share.

This report is crafted with care, blending ancient Vedic wisdom with practical
insights to help you understand how cosmic energies influence your life. Every
recommendation here is based on astrological principles, but remember, your
intuition and personal experiences play a key role in how you connect with this
knowledge.

Inside these pages, you’ll discover how planetary forces shape different aspects of
your life and how aligning with them can bring harmony. Some insights may
instantly resonate with you, while others may take time to unfold, embrace what
feels right, and explore with an open mind.

At its core, this report is not just about cosmic alignments, it’s about you and your
journey toward self-awareness and fulfillment. May these insights bring you clarity,
inspiration, and a deeper connection to the universe around you.

Wishing you a radiant and prosperous journey ahead!
Warm regards,
TrustAstrology
`;
    doc.setFont("Times", "normal");
    doc.setFontSize(13);
    doc.setTextColor("#a16a21");
    addParagraphs(doc, authorText, 55, 110);

    // --- Study Guide Page ---
    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#000");
    doc.text("BEST WAY TO STUDY THE REPORT", pageWidth / 2, 60, { align: "center" });

    const studyText = `
Unlocking the Power of Your Cosmic Code Report
Reading your Cosmic Code Report is the first step in aligning yourself with the
universe’s cosmic energies. It signifies your openness to understanding how
planetary forces influence different aspects of your life, bringing clarity, balance, and
deeper self-awareness. But simply reading it once may not be enough to fully grasp
its depth and significance.

To truly absorb the wisdom within, we recommend revisiting this report multiple
times,at least three times. Each reading will unlock new insights, helping you
connect with the astrological guidance on a deeper level. Cosmic influences work in
layers, and repeated reading will allow you to notice details you might overlook
initially.

Before diving into your report, take a moment to calm your mind. A focused and
open mindset will help you absorb the guidance better, making it easier to apply the
suggested practices effectively. Think of this as a personalized roadmap, meant to be
studied, reflected upon, and revisited as you navigate your journey.

By following this approach, you’ll be able to unlock the full potential of this cosmic
knowledge, make empowered decisions, and move forward with greater confidence
and clarity.
`;
    doc.setFont("Times", "normal");
    doc.setFontSize(13);
    doc.setTextColor("#a16a21");
    addParagraphs(doc, studyText, 55, 110);

    // --- Table of Contents ---
    doc.addPage();
    doc.setDrawColor("#a16a21");
    doc.setLineWidth(1.5);
    doc.rect(25, 25, 545, 792, "S");
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#a16a21");
    doc.text("TABLE OF CONTENTS", pageWidth / 2, 60, { align: "center" });

    const tocLines = [
      "01 Understanding Your Planetary Blueprint",
      "02 The Influence of Your Birth Chart",
      "03 Bhavphal: Your Life Through the 12 Houses",
      "04 Planetary Conjunctions",
      "05 Love & Marriage Snapshot",
      "06 Career Calling",
      "07 Chara Karakas",
      "08 Rahu-Ketu Analysis",
      "09 Mangalik Effect",
      "10 Sade Sati Journey",
      "11 Raj Yogas",
      "12 Astrological Doshas",
      "13 Mahadashas",
      "14 Numerology"
    ];

    doc.setFont("Times", "normal");
    doc.setFontSize(13);
    doc.setTextColor("#a16a21");

    let tocY = 100;
    tocLines.forEach((line) => {
      doc.setFont(line.match(/^\d{2}/) ? "Times" : "Times", line.match(/^\d{2}/) ? "bold" : "normal");
      doc.text(line, 55, tocY);
      tocY += 20; // increased spacing for TOC
    });

    // --- Avakahada Chakra ---
    await generateAvakahadaChakraPDF({
      doc,
      kundliData,
      sunriseData,
      sunsetData,
      moonSignData,
      sunSignData,
      userData
    });

    // --- Panchang Page ---
    addPanchangPage(doc, panchangData);
    const divisionalCharts = [
      { div: "D1", title: "Birth Chart (Lagna Chart)" },
      { div: "D2", title: "Hora Chart" },
      { div: "D3", title: "Drekkana Chart" },
      { div: "D3-s", title: "Drekkana (Alternative) Chart" },
      { div: "D4", title: "Chaturthamsha Chart" },
      { div: "D5", title: "Panchamsha Chart" },
      { div: "D7", title: "Saptamsha Chart" },
      { div: "D8", title: "Ashtamsha Chart" },
      { div: "D9", title: "Navamsha Chart" },
      { div: "D10", title: "Dashamsha Chart" },
      { div: "D10-R", title: "Dashamsha (Alternate) Chart" },
      { div: "D12", title: "Dvadasamsha Chart" },
      { div: "D16", title: "Shodashamsha Chart" },
      { div: "D20", title: "Vimsamsa Chart" },
      { div: "D24", title: "Chaturvimshamsha Chart" },
      { div: "D24-R", title: "Chaturvimshamsha (Alternate) Chart" },
      { div: "D27", title: "Saptavimshamsha Chart" },
      { div: "D30", title: "Trimsamsa Chart" },
      { div: "D40", title: "Khavedamsha Chart" },
      { div: "D45", title: "Akshavedamsha Chart" },
      { div: "D60", title: "Shashtiamsha Chart" },
      { div: "chalit", title: "Chalit Chart" },
      { div: "sun", title: "Sun Chart" },
      { div: "moon", title: "Moon Chart" },
      { div: "kp_chalit", title: "KP Chalit Chart" },
      { div: "transit", title: "Transit Chart" }
    ];

    const chartsArray = divisionalCharts.map(chart => ({
      div: chart.div,
      title: chart.title,   // ✅ used for showing text above chart
      dob,
      tob: time,
      lat,
      lon,
      tz: 5.5,
      style: "north",
      transit_date: "22/01/2022" // or dynamic
    }));


    await addChartsTwoPerPage(doc, chartsArray);
    const dobStr = typeof dob === "string"
      ? dob
      : `${dob.getDate().toString().padStart(2, "0")}/${(dob.getMonth() + 1).toString().padStart(2, "0")}/${dob.getFullYear()}`;

    await addShodashvargaPage(doc, dobStr, time, lat, lon);
    await addVimshottariDashaPage(doc, dobStr, time, lat, lon);
    // --- Panchang Detailed Pages ---
    addPanchangNarrativePage(doc, panchangData);
    addPanchangAnalysisPage(doc, panchangData);
    await addKundaliDetailsPage(doc, dob, time, lat, lon);
    const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Rahu", "Ketu"];

    for (let i = 0; i < planets.length; i++) {
      const planet = planets[i];
      try {
        const data = await fetchPlanetReport({ dob, tob: time, lat, lon, tz: 5.5, planet });
        if (!data?.response?.length) continue;

        const planetData = data.response[0];
        // const imageUrl = `/planets/${planet.toLowerCase()}.png`;

        doc.addPage();
        addPlanetNarrativePage(doc, planetData);

      } catch (err) {
        console.error(`Error fetching ${planet} report:`, err);
      }
    }
    const dobStr1 = typeof dob === "string"
  ? dob.split("-").reverse().join("/")  // converts "1979-06-03" → "03/06/1979"
  : `${dob.getDate().toString().padStart(2,"0")}/${(dob.getMonth()+1).toString().padStart(2,"0")}/${dob.getFullYear()}`;
  const sadeSatiData = await fetchSadeSatiTable({ dob: dobStr1, tob: time, lat, lon, tz: 5.5 });
    // Add Sade Sati section to the existing PDF
    doc.addPage();
    await addSadeSatiPDFSection(doc, sadeSatiData.response);
    // --- Fetch Career Data from two APIs ---
const mahaDashaData = await fetchMahaDashaPredictions(dob, time, lat, lon);
const ashtakvargaData = await fetchAshtakvarga(dob, time, lat, lon);
const yogaList = await fetchYogaList(dob,time,lat,lon);
const shadBala= await fetchShadBala(dob,time,lat,lon);

const careerData = {
  introduction: `Born under ${moonSign}, ${sunSign} ascendant, your career path is influenced by planetary positions and dashas.`,
  planetaryTraits: mahaDashaData.response?.dashas.map(d => ({
    name: d.dasha,
    title: `${d.dasha} Influence`,
    traits: d.prediction
  })),
  personalCareer: `Your unique career blueprint is based on dashas, yogas, and planetary strengths.`,
  mahadasha: mahaDashaData.response?.dashas[0] && {
    name: mahaDashaData.response.dashas[0].dasha,
    title: `${mahaDashaData.response.dashas[0].dasha} Mahadasha Insights`,
    description: mahaDashaData.response.dashas[0].prediction
  },
  amatyakaraka: {
  name: "Mercury",
  title: "Amatyakaraka Insights",
  traits: "Derived dynamically from KP planets or western planets data."
},
  doshas: {
    mangal: mangalDosh.response,
    kaalsarp: kaalsarpDosh.response,
    pitra: pitraDosh.response,
    papasamaya: papasamaya.response
  },
  ashtakvarga_order: ashtakvargaData.response?.ashtakvarga_order || [],
  ashtakvarga_points: ashtakvargaData.response?.ashtakvarga_points || [],
  ashtakvarga_total: ashtakvargaData.response?.ashtakvarga_total || [],
  yogas: yogaList.response?.yogas || [],
  shadBala: shadBala.response || {}
};

doc.addPage();
// --- Add Career Section ---
await addCareerPDFSection(doc, careerData);
    // --- Save PDF ---
    doc.save(`CosmicReport_${dob.replaceAll("-", "")}.pdf`);
  } catch (error) {
    console.error(error);
    alert("Error generating PDF: " + error.message);
  }
};