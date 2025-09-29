'use client';
import { fetchChartImage } from './api/fetchAstro';


/**
 * Load an image from public folder (or URL) and return Base64 string
 * @param {string} src Path to the image (e.g., '/chart image.png')
 * @returns {Promise<string>} Base64 string of the image
 */
const loadImageAsBase64 = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // to avoid CORS issues
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl.split(",")[1]); // return only Base64 part
    };
    img.onerror = (err) => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });
};

/**
 * Preprocesses the raw SVG string from the API to fix rendering issues
 * for Canvas/Image conversion.
 * 1. Adds a white background rectangle.
 * 2. Replaces invalid CSS centering properties (like display: flex) on text
 * elements with standard SVG attributes (text-anchor, dominant-baseline).
 *
 * @param {string} svgText The raw SVG string.
 * @returns {string} The processed SVG string.
 */
const svgPreprocessor = (svgText) => {
    let processedSvg = svgText;

    // 1. Add white background rectangle right after the opening <svg> tag
    const backgroundRect = '<rect x="0" y="0" width="500" height="500" fill="white"/>';
    // Use a robust replacement for the opening <svg ...> tag
    processedSvg = processedSvg.replace(/<svg(.*?)>/i, (match, p1) => `<svg${p1}>${backgroundRect}`);

    // 2. Fix invalid CSS centering properties on <text> elements
    // This regex targets any <text> tag that has a style attribute.
    // Group 1: attributes before the style
    // Group 2: content of the style attribute
    // Group 3: attributes after the style (if any)
    processedSvg = processedSvg.replace(/<text([^>]*)style\s*=\s*"([^"]*)"([^>]*)>/ig, (match, beforeStyle, styleContent, afterStyle) => {

        // 2a. Remove invalid CSS centering properties and clean up font-family
        let newStyle = styleContent
            // Remove the problematic CSS display/justify/align properties
            .replace(/display:\s*flex;\s*/ig, "")
            .replace(/justify-content:\s*center;\s*/ig, "")
            .replace(/align-items:\s*center;\s*/ig, "")
            // Standardize font family to one guaranteed to render and remove complex quote structure
            .replace(/font-family:\s*'.*?';\s*/ig, "font-family: Arial, sans-serif; ")
            .trim();

        // 2b. Add correct SVG centering properties (middle for horizontal, central for vertical)
        // Ensure the style string ends with a semicolon if it's not empty, then add new properties.
        newStyle = newStyle + "; text-anchor:middle; dominant-baseline:central;";

        // 2c. Reconstruct the text element with the cleaned style
        return `<text${beforeStyle}style="${newStyle.trim()}"${afterStyle}>`;
    });

    return processedSvg;
};

// Utility: convert SVG to PNG Base64
const svgToBase64PNG = (svgText, width = 500, height = 500) => {
    return new Promise((resolve, reject) => {
        // Encode the SVG text to a Data URL directly for maximum compatibility with Image()
        // This avoids the Blob/URL.createObjectURL step which can sometimes fail.
        const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            // Draw the image, which is now guaranteed to have a white background and correctly aligned text
            ctx.drawImage(img, 0, 0, width, height);

            // Get PNG data URL and remove prefix
            const pngBase64 = canvas.toDataURL("image/png").split(",")[1];
            resolve(pngBase64);
        };
        img.onerror = (err) => {
            console.error('Image loading error:', err);
            reject(new Error('Failed to load SVG into Image element for PNG conversion.'));
        };
        img.src = svgDataUrl;
    });
};

export const addChartsTwoPerPage = async (doc, chartsArray) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 30;
    const accentColor = "#a16a21";
    const textColor = "#5e3a0b";
    const imgWidth = 250;
    const imgHeight = 250;
    const spacingY = 60;

    // 🟤 Load Kundli background once
    const kundliBgBase64 = await loadImageAsBase64("/chart image.png");
    // (assuming your image is at /public/kundli_bg.png)

    for (let i = 0; i < chartsArray.length; i += 2) {
        doc.addPage();

        // --- Border ---
        doc.setDrawColor(accentColor);
        doc.setLineWidth(1.5);
        doc.rect(margin - 10, margin - 10, pageWidth - margin * 2 + 20, pageHeight - margin * 2 + 20, "S");

        // === Header ===
        doc.setFont("Times", "bold");
        doc.setFontSize(24);
        doc.setTextColor(accentColor);
        doc.text("CHARTS", pageWidth / 2, 50, { align: "center" });

        for (let j = 0; j < 2; j++) {
            const chartIndex = i + j;
            if (chartIndex >= chartsArray.length) break;

            const chartParams = chartsArray[chartIndex];
            const currentY = 100 + j * (imgHeight + spacingY);

            // --- Chart Title ---
            doc.setFont("Times", "bold");
            doc.setFontSize(16);
            doc.setTextColor(textColor);
            const title = chartParams.div + (chartParams.title ? ` – ${chartParams.title}` : ""); // use 'title' for PDF
            doc.text(title, pageWidth / 2, currentY - 10, { align: "center" });

            try {
                // ✅ Copy chartParams without 'title' for API
                const apiParams = { ...chartParams };
                delete apiParams.title;

                const rawSvgText = await fetchChartImage(apiParams); // send without title
                const processedSvgText = svgPreprocessor(rawSvgText);
                const chartBase64 = await svgToBase64PNG(processedSvgText, 500, 500);

                const x = (pageWidth - imgWidth) / 2;

                // 🟤 Step 1: Draw Kundli background
                doc.addImage(kundliBgBase64, "PNG", x, currentY, imgWidth, imgHeight);

                // 🟤 Step 2: Overlay chart
                doc.addImage(`data:image/png;base64,${chartBase64}`, "PNG", x, currentY, imgWidth, imgHeight);

            } catch (err) {
                console.error("Error generating chart image:", err);
                doc.setFont("Times", "normal");
                doc.setFontSize(14);
                doc.setTextColor(textColor);
                doc.text("Chart could not be loaded", pageWidth / 2, currentY + imgHeight / 2, { align: "center" });
            }
        }
    }
};
