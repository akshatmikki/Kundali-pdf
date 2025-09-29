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

export const addPanchangPage = (doc, data) => {
    doc.addPage();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 30;
    const accentColor = "#a16a21";
    const textColor = "#5e3a0b";
    const rowHeight = 16;
    let currentY = 50;
    
    // --- Border ---
    doc.setDrawColor(accentColor);
    doc.setLineWidth(1.5);
    doc.rect(margin - 10, margin - 10, pageWidth - margin * 2 + 20, pageHeight - margin * 2 + 20, "S");

    // === Header ===
    doc.setFont("Times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(accentColor);
    doc.text("PANCHANG", pageWidth / 2, currentY, { align: "center" });
    
    currentY += 40;

    // === Top Four Columns ===
    const colSpacing = 120; // adjusted so TITHI fits
    const startX = 60;
    const columnHeaders = ["CALENDAR", "YEAR", "MAH", "TITHI"];
    const colX = columnHeaders.map((_, i) => startX + i * colSpacing);
    
    doc.setFontSize(14);
    doc.setTextColor(accentColor);
    columnHeaders.forEach((header, i) => {
        doc.text(header, colX[i], currentY);
    });

    doc.setLineWidth(0.5);
    colX.forEach(x => {
        doc.line(x - 5, currentY + 4, x + colSpacing - 65, currentY + 4); 
    });
    
    currentY += 15;

    // === API Data ===
    const res = data?.response || {};
    const masa = res.advanced_details?.masa || {};
    const years = res.advanced_details?.years || {};
    const tithi = res.tithi || {};

    const calendars = ["National", "Punjabi", "Bengali", "Tamil", "Kerala", "Nepali"];
    const yearData = [
        `Vikram: ${years.vikram_samvaat || ""}`,
        `Saka: ${years.saka || ""}`,
        `Kali: ${years.kali || ""}`,
        `Tamil: ${masa.tamil_month || ""}`,
        `Amanta: ${masa.amanta_name || ""}`,
        `Purnimanta: ${masa.purnimanta_name || ""}`
    ];
    const mahData = [
        masa.amanta_name || "",
        masa.purnimanta_name || "",
        masa.tamil_month || "",
        masa.alternate_amanta_name || "",
        masa.alternate_purnimanta_name || "",
        masa.ayana || ""
    ];
    const tithiData = [
        tithi.name || "",
        tithi.number?.toString() || "",
        tithi.next_tithi || "",
        tithi.type || "",
        tithi.diety || "",
        tithi.meaning || ""
    ];
    
    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    const arrowSymbol = "➤";

    calendars.forEach((cal, i) => {
        const y = currentY + i * rowHeight;
        
        doc.text(cal, colX[0], y);
        doc.text(arrowSymbol, colX[0] + 55, y); 

        if (yearData[i]) {
            doc.text(yearData[i], colX[1], y);
        }

        if (mahData[i]) {
            doc.text(mahData[i], colX[2], y);
            doc.text(arrowSymbol, colX[2] + 50, y); 
        }

        if (tithiData[i]) {
            doc.text(tithiData[i], colX[3], y);
        }
    });

    currentY += calendars.length * rowHeight + 25;

    // === Decorative Divider ===
    const lineY = currentY - 5;
    const center = pageWidth / 2;
    const lineLength = 120; 
    doc.line(center - lineLength, lineY, center - 20, lineY);
    doc.line(center + 20, lineY, center + lineLength, lineY);
    const diamondSize = 5;
    doc.triangle(center, lineY - diamondSize, center - diamondSize, lineY, center + diamondSize, lineY, 'F');
    doc.triangle(center, lineY + diamondSize, center - diamondSize, lineY, center + diamondSize, lineY, 'F');

    currentY += 25;

    // === Bottom Two-Column Section ===
    const bottomColGap = 50;
    const bottomColWidth = (pageWidth - margin * 2 - bottomColGap) / 2;
    const panchangX = margin;
    const ghatakX = margin + bottomColWidth + bottomColGap;
    let panchangY = currentY;
    let ghatakY = currentY;
    
    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(accentColor);
    doc.text("PANCHANG", panchangX, panchangY);
    doc.text("GHATAK", ghatakX, ghatakY);
    
    panchangY += 15;
    ghatakY += 15;

    // PANCHANG from API
    const panchangFields = [
        ["Day", res.day?.name || ""],
        ["Tithi", `${tithi.name || ""} (${tithi.type || ""})`],
        ["Tithi Start", tithi.start || ""],
        ["Tithi End", tithi.end || ""],
        ["Nakshatra", res.nakshatra?.name || ""],
        ["Nakshatra End", res.nakshatra?.end || ""],
        ["Yoga", res.yoga?.name || ""],
        ["Yoga End", res.yoga?.end || ""],
        ["Karana", res.karana?.name || ""],
        ["Karana End", res.karana?.end || ""],
        ["Rasi", res.rasi?.name || ""],
        ["Sun Rise", res.advanced_details?.sun_rise || ""],
        ["Sun Set", res.advanced_details?.sun_set || ""],
        ["Moon Rise", res.advanced_details?.moon_rise || ""],
        ["Moon Set", res.advanced_details?.moon_set || ""],
    ];

    // GHATAK from API
    const ghatakFields = [
        ["Vaara", res.advanced_details?.vaara || ""],
        ["Paksha", res.advanced_details?.masa?.paksha || ""],
        ["Ritu", res.advanced_details?.masa?.ritu || ""],
        ["Sun", res.sun_position?.zodiac || ""],
        ["Moon Degree", res.moon_position?.moon_degree?.toFixed(2) || ""],
        ["Rahukaal", res.rahukaal || ""],
        ["Gulika", res.gulika || ""],
        ["Yamakanta", res.yamakanta || ""],
        ["Ayanamsa", res.ayanamsa?.name || ""],
    ];

    const valuePanchangX = panchangX + 130;
    const valueGhatakX = ghatakX + 80;
    const arrowPanchangX = panchangX + 115;
    const arrowGhatakX = ghatakX + 65;

    const drawSectionRows = (startX, startY, arrowX, valueX, fields) => {
        let y = startY;
        doc.setFont("Times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(textColor);
        
        fields.forEach(([key, val]) => {
            if (!val) return; // skip empty values
            doc.text(key, startX, y);
            doc.text(arrowSymbol, arrowX, y);
            doc.text(val.toString(), valueX, y);
            y += rowHeight;
        });
        return y;
    };

    drawSectionRows(panchangX, panchangY, arrowPanchangX, valuePanchangX, panchangFields);
    drawSectionRows(ghatakX, ghatakY, arrowGhatakX, valueGhatakX, ghatakFields);

    // Footer
    addFooter(doc);
};
