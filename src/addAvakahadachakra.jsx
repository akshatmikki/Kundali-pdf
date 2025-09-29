'use client';
import { jsPDF } from "jspdf";

const addFooter = (doc) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const footerY = pageHeight - 45;
    const lineHeight = 10;

    doc.setFont("Times", "bold");
    doc.setFontSize(10);
    doc.setTextColor("#000000");
    doc.text("Astro Arun Pandit Private Limited", pageWidth / 2, footerY, { align: "center" });

    doc.setFont("Times", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#000000");
    doc.text(
        "Astrology - Numerology - Occult Guidance - Gemstone - Tarot Reading - Consultation",
        pageWidth / 2,
        footerY + lineHeight,
        { align: "center" }
    );
};

export const generateAvakahadaChakraPDF = async ({
    doc, kundliData, sunriseData, sunsetData, moonSignData, sunSignData, userData
}) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 30;
    const innerBoxMargin = 50;
    const colGap = 15;
    const chakraColWidth = (pageWidth - margin * 2 - colGap) / 2;
    const rowHeight = 15;
    const textColor = "#5e3a0b";
    const accentColor = "#a16a21";
    const bgColor = "#fffdf9";

    doc.addPage();

    // --- Background ---
    doc.setFillColor(bgColor);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // --- Border ---
    doc.setDrawColor(accentColor);
    doc.setLineWidth(1.5);
    doc.rect(margin - 10, margin - 10, pageWidth - margin * 2 + 20, pageHeight - margin * 2 + 20, "S");

    // --- User Info Box ---
    const userBoxY = 70; // shifted down
    const userBoxHeight = 170;
    const userBoxX = innerBoxMargin;
    const userBoxWidth = pageWidth - innerBoxMargin * 2;

    doc.setDrawColor(accentColor);
    doc.setLineWidth(1);
    doc.rect(userBoxX, userBoxY, userBoxWidth, userBoxHeight, "S");

    // Decorative lines
    const lineY_Top = userBoxY + 25;
    const lineY_Bottom = userBoxY + userBoxHeight - 15;
    doc.setLineWidth(0.5);
    doc.line(userBoxX + 15, lineY_Top, userBoxX + userBoxWidth / 2 - 40, lineY_Top);
    doc.line(userBoxX + userBoxWidth / 2 + 40, lineY_Top, userBoxX + userBoxWidth - 15, lineY_Top);
    doc.line(userBoxX + 15, lineY_Bottom, userBoxX + userBoxWidth - 15, lineY_Bottom);

    // Decorative Bullets
    const bulletR = 3;
    doc.setFillColor(accentColor);
    doc.circle(userBoxX + userBoxWidth / 2 - 35, lineY_Top, bulletR, "F");
    doc.circle(userBoxX + userBoxWidth / 2 + 35, lineY_Top, bulletR, "F");

    // --- Name ---
    doc.setFont("Times", "bold");
    doc.setFontSize(18);
    doc.setTextColor(accentColor);
    doc.text((userData?.name || "").toUpperCase(), pageWidth / 2, lineY_Top + 25, { align: "center" });

    // --- User Data ---
    const dataStartY = lineY_Top + 4 * rowHeight;  // was 2 * rowHeight, now shifted further down
    const column1X = userBoxX + 10;
    const column2X = pageWidth / 2 + 10;

    const leftFields = [
        ["Sex", userData?.sex || ""],
        ["Date of Birth", userData?.dob || ""],
        ["Day", userData?.day || ""],
        ["Time of Birth", userData?.time || ""],
    ];
    const rightFields = [
        ["Ishta", kundliData?.ishta || ""],
        ["City", userData?.city || ""],
        ["State", userData?.state || ""],
        ["Country", userData?.country || ""],
    ];

    const drawUserInfoRows = (startX, fields) => {
        let currentY = dataStartY;
        const valueRightAlignX = startX + (userBoxWidth / 2) - 100;

        doc.setFont("Times", "normal");
        doc.setFontSize(13);
        doc.setTextColor(textColor);

        fields.forEach(([key, val]) => {
            doc.text(`${key}:`, startX, currentY);
            doc.setFont("Times", "bold");
            doc.text(val, valueRightAlignX, currentY);
            doc.setFont("Times", "normal");
            currentY += rowHeight;
        });
    };

    drawUserInfoRows(column1X, leftFields);
    drawUserInfoRows(column2X, rightFields);

    // --- Chakra Header ---
    const chakraY = userBoxY + userBoxHeight + 50;
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.setTextColor(accentColor);
    doc.text("AVAKAHADA CHAKRA", pageWidth / 2, chakraY, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 80, chakraY + 5, pageWidth / 2 - 20, chakraY + 5);
    doc.line(pageWidth / 2 + 20, chakraY + 5, pageWidth / 2 + 80, chakraY + 5);
    doc.circle(pageWidth / 2, chakraY + 5, bulletR, "F");

    // --- Chakra Fields ---
    const chakraDataY = chakraY + 40;
    const chakraCol1X = margin;
    const chakraCol2X = margin + chakraColWidth + colGap;

    const chakraLeftFields = [
        ["Latitude", userData?.latitude || ""],
        ["Longitude", userData?.longitude || ""],
        ["Ascendant Sign", kundliData?.response?.ascendant_sign || ""],
        ["Ascendant Nakshatra", kundliData?.response?.ascendant_nakshatra || ""],
        ["Rasi", kundliData?.response?.rasi || ""],
        ["Rasi Lord", kundliData?.response?.rasi_lord || ""],
        ["Nakshatra", kundliData?.response?.nakshatra || ""],
        ["Nakshatra Lord", kundliData?.response?.nakshatra_lord || ""],
        ["Nakshatra Pada", kundliData?.response?.nakshatra_pada || 0],
        ["Sun Sign (Vedic)", kundliData?.response?.sun_sign || ""],
        ["Sun Sign (Western)", sunSignData?.response?.sun_sign || ""],
        ["Moon Sign", moonSignData?.response?.moon_sign || ""],
        ["Tithi", kundliData?.response?.tithi || ""],
        ["Karana", kundliData?.response?.karana || ""],
        ["Yoga", kundliData?.response?.yoga || ""],
        ["Sunrise", sunriseData?.response?.sun_rise || ""],
        ["Sunset", sunsetData?.response?.sun_set || ""],
    ];

    const chakraRightFields = [
        ["Gana", kundliData?.response?.gana || ""],
        ["Yoni", kundliData?.response?.yoni || ""],
        ["Vasya", kundliData?.response?.vasya || ""],
        ["Nadi", kundliData?.response?.nadi || ""],
        ["Varna", kundliData?.response?.varna || ""],
        ["Paya", kundliData?.response?.paya || ""],
        ["Tatva", kundliData?.response?.tatva || ""],
        ["Life Stone", kundliData?.response?.life_stone || ""],
        ["Lucky Stone", kundliData?.response?.lucky_stone || ""],
        ["Fortune Stone", kundliData?.response?.fortune_stone || ""],
        ["Name Start", kundliData?.response?.name_start || ""],
    ];

    const drawChakraRows = (startX, fields) => {
        let currentY = chakraDataY;
        const arrowGap = 5;
        const arrowSymbol = "➤";
        const valueStartX = startX + chakraColWidth / 2 + 5;

        doc.setFont("Times", "normal");
        doc.setFontSize(13);
        doc.setTextColor(textColor);

        fields.forEach(([key, val]) => {
            doc.text(key, startX, currentY);
            const keyWidth = doc.getStringUnitWidth(key) * doc.internal.getFontSize();
            doc.text(arrowSymbol, startX + keyWidth + arrowGap, currentY);
            doc.setFont("Times", "bold");
            doc.text(String(val || ""), valueStartX, currentY);
            doc.setFont("Times", "normal");
            currentY += rowHeight;
        });
        return currentY;
    };

    const chartBlockWidth = 2 * chakraColWidth + colGap;
    const centeredStart = (pageWidth - chartBlockWidth) / 2;

    drawChakraRows(centeredStart, chakraLeftFields);
    drawChakraRows(centeredStart + chakraColWidth + colGap, chakraRightFields);

    // --- Footer ---
    addFooter(doc);
};
