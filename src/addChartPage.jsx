'use client';
import { fetchChartImage } from './api/fetchAstro';

// --- Safe loader for background images ---
const loadImageAsBase64 = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png").split(",")[1]);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// --- SVG cleanup (same as you had) ---
const svgPreprocessor = (svgText) => {
  let processedSvg = svgText;
  const backgroundRect = '<rect x="0" y="0" width="500" height="500" fill="white"/>';

  processedSvg = processedSvg.replace(/<svg(.*?)>/i, (m, p1) => `<svg${p1}>${backgroundRect}`);

  processedSvg = processedSvg.replace(/<text([^>]*)style\s*=\s*"([^"]*)"([^>]*)>/ig,
    (match, before, style, after) => {
      let newStyle = style
        .replace(/display:\s*flex;\s*/ig, "")
        .replace(/justify-content:\s*center;\s*/ig, "")
        .replace(/align-items:\s*center;\s*/ig, "")
        .replace(/font-family:\s*'.*?';\s*/ig, "font-family: Arial, sans-serif; ")
        .trim();

      newStyle = newStyle + "; text-anchor:middle; dominant-baseline:central;";
      return `<text${before}style="${newStyle}"${after}>`;
    }
  );

  return processedSvg;
};

// --- Fixed: safer SVG → PNG converter using Blob+URL ---
const svgToBase64PNG = (svgText, width = 500, height = 500) => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png").split(",")[1]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG blob into Image"));
    };
    img.src = url;
  });
};

// --- Main charts renderer ---
export const addChartsTwoPerPage = async (doc, chartsArray) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 30;
  const accentColor = "#a16a21";
  const textColor = "#5e3a0b";
  const imgWidth = 250;
  const imgHeight = 250;
  const spacingY = 60;

  // Load background once (⚠️ rename file to avoid spaces, e.g. "chart-image.png")
  const kundliBgBase64 = await loadImageAsBase64("/chart-image.png");

  for (let i = 0; i < chartsArray.length; i += 2) {
    doc.addPage();

    // Border
    doc.setDrawColor(accentColor);
    doc.setLineWidth(1.5);
    doc.rect(margin - 10, margin - 10, pageWidth - margin * 2 + 20, pageHeight - margin * 2 + 20, "S");

    // Header
    doc.setFont("Times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(accentColor);
    doc.text("CHARTS", pageWidth / 2, 50, { align: "center" });

    for (let j = 0; j < 2; j++) {
      const chartIndex = i + j;
      if (chartIndex >= chartsArray.length) break;

      const chartParams = chartsArray[chartIndex];
      const currentY = 100 + j * (imgHeight + spacingY);

      // Chart Title
      doc.setFont("Times", "bold");
      doc.setFontSize(16);
      doc.setTextColor(textColor);
      const title = chartParams.div + (chartParams.title ? ` – ${chartParams.title}` : "");
      doc.text(title, pageWidth / 2, currentY - 10, { align: "center" });

      try {
        const apiParams = { ...chartParams };
        delete apiParams.title;

        const rawSvgText = await fetchChartImage(apiParams);
        const processedSvgText = svgPreprocessor(rawSvgText);
        const chartBase64 = await svgToBase64PNG(processedSvgText, 500, 500);

        const x = (pageWidth - imgWidth) / 2;

        // Background
        doc.addImage(kundliBgBase64, "PNG", x, currentY, imgWidth, imgHeight);

        // Overlay chart
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
