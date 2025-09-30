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

// Utility to check page overflow and add page if needed
const checkPageOverflow = (doc, currentY, margin = 30) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    // A more generous check: ensure there's enough space for the next title + 4 lines of text
    if (currentY > pageHeight - margin - 100) { 
        doc.addPage();
        return 50; // reset currentY for new page
    }
    return currentY;
};

// --- Refined Analysis Page Function ---

export const addPanchangAnalysisPage = (doc, data) => {
    doc.addPage();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 30;
    let currentY = 50;
    const accentColor = "#a16a21"; 
    const textColor = "#111111"; 
    
    // Consistent spacing variables
    const headerSpacing = 30;
    const sectionTitleSpacing = 16;
    const sectionLineHeight = 10; // Line height for the body text
    const sectionPadding = 20; // Space between sections

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

    // Header
    doc.setFont("Times", "bold");
    doc.setFontSize(24); 
    doc.setTextColor(accentColor);
    doc.text("ASTROLOGICAL INSIGHTS", pageWidth / 2, currentY, { align: "center" });
    currentY += headerSpacing;

    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(textColor);

    // Helper function to draw a section
    const drawSection = (title, textContent, isList = false) => {
        // 1. Check for overflow BEFORE drawing the title
        currentY = checkPageOverflow(doc, currentY, margin);

        // 2. Title
        doc.setFont("Times", "bold");
        doc.setFontSize(14);
        doc.setTextColor(accentColor);
        doc.text(title, margin, currentY);
        currentY += sectionTitleSpacing;

        // 3. Content
        doc.setFont("Times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(textColor);

        if (isList) {
            textContent.forEach(item => {
                currentY = checkPageOverflow(doc, currentY, margin);
                
                // Draw a simple bullet (standard Times font bullet is often safe)
                doc.setFont("Times", "normal");
                doc.text("•", margin, currentY); 
                
                // Text starts slightly indented and is plain text (no ** markers)
                const plainItem = item.replace(/\*\*/g, '');
                const lines = doc.splitTextToSize(plainItem, pageWidth - margin * 2 - 10);
                doc.text(lines, margin + 5, currentY, { align: "justify" });
                currentY += lines.length * sectionLineHeight;
            });
        } else {
            // Narrative section - ensure text is plain for reliable wrapping
            const plainText = textContent.replace(/\*\*/g, '');
            const lines = doc.splitTextToSize(plainText, pageWidth - margin * 2);
            doc.text(lines, margin, currentY, { align: "justify" });
            currentY += lines.length * sectionLineHeight;
        }

        // 4. Padding after content
        currentY += sectionPadding;
    };


    // --- Strengths / Personality Section ---
    const strengthText = 
        `Born on ${day} (${tithi} - ${tithiType}), under ${nakshatra} Nakshatra, ${yoga} Yoga, and ${karana} Karana, you possess unique strengths. ` + 
        `${tithiMeaning || "Your Tithi provides strong foundational energy."} ${nakshatraSummary || "Your Nakshatra guides your inner nature."} ${yogaMeaning || "Your Yoga determines your cosmic luck."} ${karanaSpecial || "Your Karana influences your daily actions."}`;
    drawSection("Strengths / Personality", strengthText);


    // --- Relationships Section ---
    const relationshipText = 
        `Your Nakshatra and Tithi significantly influence how you interact with others and your relationship dynamics. ` + 
        `${nakshatraSummary || "You are naturally charismatic and attract meaningful relationships."} Paying attention to compatibility and clear communication will greatly enhance your bonds and emotional stability.`;
    drawSection("Relationships", relationshipText);


    // --- Success / Career Tips Section ---
    const careerText = 
        `Based on your Panchang, success strategies are guided by your Tithi (${tithiType}), Yoga (${yoga}), and Karana (${karana}). ` + 
        `${tithiMeaning || "Look for careers requiring perseverance."} ${yogaMeaning || "Focus on service-oriented or creative fields."} ${karanaSpecial || "Your Karana suggests a pragmatic approach to work."} Focus on areas where your cosmic energies are strongest to maximize achievement.`;
    drawSection("Success / Career Tips", careerText);


    // --- Cautions / Things to Avoid Section (Formatted as a List) ---
    const cautionList = [
        `Avoid starting high-risk ventures or important initiatives on days or times not aligned with your birth elements.`,
        `During ${paksha || "certain"} Paksha, be cautious of impulsive spending or making sudden commitments.`,
        `The influence of ${ritu || "your"} Ritu suggests avoiding major health changes or physically taxing efforts during incompatible periods.`,
        `Do not ignore the need for balance; a focus on a single aspect (e.g., career) can strain other relationships.`
    ];
    drawSection("Cautions / Things to Avoid", cautionList, true);

    // Footer
    addFooter(doc);
};