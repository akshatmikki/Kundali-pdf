'use client';
import { jsPDF } from "jspdf";

// --- Utility Functions (Kept as is or slightly adjusted for clarity) ---

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
// Adjusted margin for better look and reset Y
const checkPageOverflow = (doc, currentY, margin = 30) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    // Check if the next section (Title + at least 3 lines of text) will fit
    if (currentY > pageHeight - margin - 110) { 
        doc.addPage();
        return 50; // reset currentY for new page
    }
    return currentY;
};

// --- Main Function (Refined) ---

export const addPanchangNarrativePage = (doc, data) => {
    doc.addPage();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 30;
    let currentY = 50;
    const accentColor = "#a16a21";
    const textColor = "#111111";
    
    // Define consistent spacing constants
    const headingSpacing = 25;
    const introLineHeight = 15; // Increased line height for intro for readability
    const sectionLineHeight = 10; // Consistent line height for section body text
    const sectionTitleSpacing = 16; // Space after section title
    const sectionPadding = 22; // Space between sections

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
    const sunZodiac = res.sun_position?.zodiac || "";
    const moonDegree = res.moon_position?.moon_degree?.toFixed(2) || "";
    const rahukaal = res.rahukaal || "";
    const gulika = res.gulika || "";
    const yamakanta = res.yamakanta || "";
    const ayanamsa = res.ayanamsa?.name || "";

    // Intro Header
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor(accentColor);
    doc.text("YOUR PANCHANG DECODED", pageWidth / 2, currentY, { align: "center" });
    currentY += headingSpacing;

    // Intro Body
    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    const intro = "Your Panchang is a cosmic snapshot of the stars and planets at your birth. It reveals key details like Tithi, Nakshatra, Yoga, Karana, and Vaar, which influence your personality and life path.";
    const introLines = doc.splitTextToSize(intro, pageWidth - margin * 2);
    doc.text(introLines, margin, currentY, { align: "justify" });
    currentY += introLines.length * introLineHeight;
    currentY += headingSpacing; // Add extra space after the intro

    // Dynamic Sections from API
    const sections = [
        {
            title: `Vaar: ${day}`,
            text: `Born on ${day}, you carry the traits associated with this day. It influences your strengths, personality, and opportunities.`,
            type: 'narrative'
        },
        {
            title: `Tithi: ${tithi} (${tithiType})`,
            text: `Being born on this Tithi (${tithiType} Paksha), you are imbued with the following qualities: ${tithiMeaning || "No additional info available."}`,
            type: 'narrative'
        },
        {
            title: `Nakshatra: ${nakshatra}`,
            text: `Your Nakshatra, ${nakshatra}, shapes your life path, behavior, and interactions. ${nakshatraSummary || ""}`,
            type: 'narrative'
        },
        {
            title: `Yoga: ${yoga}`,
            text: `Yoga at your birth is ${yoga}, representing the cosmic energy available to you. ${yogaMeaning || ""}`,
            type: 'narrative'
        },
        {
            title: `Karana: ${karana}`,
            text: `Karana present at birth: ${karana}. ${karanaSpecial || ""}`,
            type: 'narrative'
        },
        {
            title: "Other Cosmic Details",
            // Format details as a list for better readability than a single blob
            details: [
                `Paksha: ${paksha}`,
                `Ritu: ${ritu}`,
                `Sun Zodiac: ${sunZodiac}`,
                `Moon Degree: ${moonDegree}°`,
                `Rahukaal: ${rahukaal}`,
                `Gulika: ${gulika}`,
                `Yamakanta: ${yamakanta}`,
                `Ayanamsa: ${ayanamsa}`
            ],
            type: 'list'
        }
    ];

    sections.forEach(sec => {
        // Check for page overflow before drawing the title
        currentY = checkPageOverflow(doc, currentY, margin);

        // Section Title
        doc.setFont("Times", "bold");
        doc.setFontSize(14);
        doc.setTextColor(accentColor);
        doc.text(sec.title, margin, currentY);
        currentY += sectionTitleSpacing;

        doc.setFont("Times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(textColor);
        
        // Section Content
        if (sec.type === 'narrative') {
            const lines = doc.splitTextToSize(sec.text, pageWidth - margin * 2);
            doc.text(lines, margin, currentY, { align: "justify" });
            // Use consistent line height
            currentY += lines.length * sectionLineHeight; 
        } else if (sec.type === 'list') {
             // For the list, iterate through details
             sec.details.forEach(detail => {
                currentY = checkPageOverflow(doc, currentY, margin); // Check overflow per detail line
                // Simple bullet/hyphen and slight indent
                doc.text(`• ${detail}`, margin + 5, currentY);
                currentY += sectionLineHeight;
             });
        }

        currentY += sectionPadding; // Consistent space after each section
    });

    // Footer
    addFooter(doc);
};