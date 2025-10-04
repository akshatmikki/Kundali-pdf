import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchAshtakavargaTable, fetchAshtakavargaChart } from "./api/fetchAstro";
import { addFooter, addPageBorder, checkPageOverflow } from "./utils/pdfUtils";

// --- Utility: Convert SVG string to PNG base64 ---
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

export const generateAshtakavargaReport = async (doc, dob, tob, lat, lon, tz) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // --- New Page ---
  doc.addPage();
  addPageBorder(doc);

  // --- Title ---
  doc.setFontSize(18);
  doc.setTextColor("#a16a21");
  doc.text("Ashtakavarga Chart & Table", pageWidth / 2, 30, { align: "center" });

  // --- Fetch Chart ---
  let chartData = await fetchAshtakavargaChart(dob, tob, lat, lon, tz);
  const processedSvgText = svgPreprocessor(chartData);
  const chartBase64 = await svgToBase64PNG(processedSvgText, 500, 500);
  

  // --- Chart Placement (top half) ---
  const chartHeightMax = pageHeight / 2 - 50;
  const chartWidthMax = pageWidth - margin * 2;
  const imgProps = doc.getImageProperties(`data:image/png;base64,${chartBase64}`);

  let imgWidth = imgProps.width;
  let imgHeight = imgProps.height;

  // Scale if too large
  const widthRatio = chartWidthMax / imgWidth;
  const heightRatio = chartHeightMax / imgHeight;
  const scale = Math.min(widthRatio, heightRatio, 1);
  imgWidth *= scale;
  imgHeight *= scale;

  const imgX = (pageWidth - imgWidth) / 2;
  const imgY = 50;

  doc.addImage(`data:image/png;base64,${chartBase64}`, "PNG", imgX, imgY, imgWidth, imgHeight);

  // --- Fetch Table Data ---
  const ashtakvargaDataRaw = await fetchAshtakavargaTable(dob, tob, lat, lon, tz);
  const ashtakvargaData = ashtakvargaDataRaw.response;

  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const head = [["Sign", ...signs]];
  const rows = ashtakvargaData.ashtakvarga_order.map(
    (planet, i) => [planet.toUpperCase(), ...ashtakvargaData.ashtakvarga_points[i]]
  );
  const totalRow = ["Total", ...ashtakvargaData.ashtakvarga_total];
  const body = [...rows, totalRow];

  // --- Table Placement (bottom half) ---
  let startY = imgY + imgHeight + 20;
  startY = checkPageOverflow(doc, startY, margin);

  autoTable(doc, {
    head,
    body,
    startY,
    styles: { halign: "center", valign: "middle", fontSize: 10 },
    headStyles: { fillColor: "#a16a21", textColor: "#fff", fontStyle: "bold" },
    footStyles: { fillColor: "#f0f0f0", textColor: "#000", fontStyle: "bold" },
    theme: "grid",
    didDrawPage: () => addPageBorder(doc),
  });

  // --- Footer ---
  addFooter(doc, {
    company: "TrustAstrology",
    services: "Astrology Numerology Occult Guidance Gemstone Tarot Reading Consultation",
    contact: "+91-9818999037",
    website: "www.trustastrology.com",
  });
};
