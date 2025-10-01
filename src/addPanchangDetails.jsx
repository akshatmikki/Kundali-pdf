'use client';
import { jsPDF } from "jspdf";

const addFooter = (doc) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const footerY = pageHeight - 45; 
    const lineHeight = 10;
    const black = "#000000";

    doc.setFont("Times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(black);
    doc.text("Astro Arun Pandit Private Limited", pageWidth / 2, footerY, { align: "center" });

    doc.setFont("Times", "normal");
    doc.setFontSize(8);
    doc.setTextColor(black);
    doc.text(
        "Astrology - Numerology - Occult Guidance - Gemstone - Tarot Reading - Consultation",
        pageWidth / 2,
        footerY + lineHeight,
        { align: "center" }
    );
    doc.text(
        "91-9818999037, 91-8604802202 | www.astroarunpandit.org | support@astroarunpandit.org",
        pageWidth / 2,
        footerY + 2 * lineHeight, 
        { align: "center" }
    );
};

// Page border
const addPageBorder = (doc, margin = 15) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(161, 106, 33); // accent color RGB
    doc.setLineWidth(1);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
};

// Check for page overflow
const checkPageOverflow = (doc, currentY, margin = 50) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (currentY > pageHeight - margin - 100) { 
        doc.addPage();
        addPageBorder(doc);
        return margin; 
    }
    return currentY;
};

// --- Analysis Page --- 
export const addPanchangAnalysisPage = (doc, data) => {
    doc.addPage();
    addPageBorder(doc);

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 50;
    let currentY = margin;
    const accentColor = "#a16a21";
    const textColor = "#111111";
    const sectionLineHeight = 14;
    const sectionTitleSpacing = 16;
    const sectionPadding = 20;
    const headingSpacing = 30;

    const res = data?.response || {};
    const day = res.day?.name || "";
    const tithi = res.tithi?.name || "";
    const tithiType = res.tithi?.type || "";
    const tithiMeaning = res.tithi?.meaning || "";
    const nakshatra = res.nakshatra?.name || "";
    const nakshatraSummary = res.nakshatra?.summary || "";
    const yoga = res.yoga?.name || "";
    const yogaMeaning = res.yoga?.meaning || "";
    const karana = res.karana?.name || "";
    const karanaSpecial = res.karana?.special || "";
    const paksha = res.advanced_details?.masa?.paksha || "";
    const ritu = res.advanced_details?.masa?.ritu || "";

    // --- Header ---
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor(accentColor);
    doc.text("ASTROLOGICAL INSIGHTS", pageWidth / 2, currentY, { align: "center" });
    currentY += headingSpacing;

    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(textColor);

    // --- Section Helper ---
    const drawSection = (title, textContent, isList = false) => {
        currentY = checkPageOverflow(doc, currentY, margin);

        // Section title
        doc.setFont("Times", "bold");
        doc.setFontSize(14);
        doc.setTextColor(accentColor);
        doc.text(title, margin, currentY);
        currentY += sectionTitleSpacing;

        doc.setFont("Times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(textColor);

        const safeWidth = pageWidth - margin * 2 - 5;

        if (isList) {
            textContent.forEach(item => {
                const lines = doc.splitTextToSize(item, safeWidth - 10); // indent for bullet
                lines.forEach((line, idx) => {
                    currentY = checkPageOverflow(doc, currentY, margin);
                    doc.text(idx === 0 ? `• ${line}` : `  ${line}`, margin + 10, currentY);
                    currentY += sectionLineHeight;
                });
            });
        } else {
            const lines = doc.splitTextToSize(textContent, safeWidth);
            lines.forEach(line => {
                currentY = checkPageOverflow(doc, currentY, margin);
                doc.text(line, margin, currentY, { align: "justify" });
                currentY += sectionLineHeight;
            });
        }

        currentY += sectionPadding;
    };

    // --- Narrative Sections ---
    const strengthText = 
        `Born on ${day} (${tithi} - ${tithiType}), under ${nakshatra} Nakshatra, ${yoga} Yoga, and ${karana} Karana, you possess unique strengths. ` + 
        `${tithiMeaning || ""} ${nakshatraSummary || ""} ${yogaMeaning || ""} ${karanaSpecial || ""}`;
    drawSection("Strengths / Personality", strengthText);

    const relationshipText = 
        `Your Nakshatra and Tithi influence how you interact with others and your relationship dynamics. ` + 
        `${nakshatraSummary || ""} Paying attention to compatibility and clear communication will enhance your bonds.`;
    drawSection("Relationships", relationshipText);

    const careerText = 
        `Based on your Panchang, success strategies are guided by your Tithi (${tithiType}), Yoga (${yoga}), and Karana (${karana}). ` + 
        `${tithiMeaning || ""} ${yogaMeaning || ""} ${karanaSpecial || ""} Focus on areas where your cosmic energies are strongest.`;
    drawSection("Success / Career Tips", careerText);

    const cautionList = [
        `Avoid starting high-risk ventures or initiatives on days not aligned with your birth elements.`,
        `During ${paksha || "certain"} Paksha, be cautious of impulsive spending or sudden commitments.`,
        `The influence of ${ritu || "your"} Ritu suggests avoiding major health changes or physically taxing efforts.`,
        `Do not ignore the need for balance; a focus on a single aspect can strain other relationships.`
    ];
    drawSection("Cautions / Things to Avoid", cautionList, true);

    addFooter(doc);
};
