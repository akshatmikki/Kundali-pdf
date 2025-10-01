import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchMahaDasha, fetchAntarDasha } from "./api/fetchAstro";

/**
 * Helper function to draw an Antar Dasha table
 */
function drawAntarDashaTable(
  doc: jsPDF,
  pageWidth: number,
  mahadashaLord: string,
  antarRows: string[][],
  startY: number
): number {
  doc.addPage();
  doc.setFont("Times", "bold");
  doc.setFontSize(16);
  doc.text(
    `Antar Dasha in ${mahadashaLord} Mahadasha`,
    pageWidth / 2,
    50,
    { align: "center" }
  );

  autoTable(doc, {
    head: [["Antar Dasha Lord", "Start Date", "End Date"]],
    body: antarRows,
    startY,
    theme: "grid",
    headStyles: { fillColor: [120, 49, 94], textColor: "#fff", fontStyle: "bold" },
    bodyStyles: { fontSize: 10 },
    margin: { left: 25, right: 25 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Add Vimshottari Dasha Page to PDF
 */
export async function addVimshottariDashaPage(
  doc: jsPDF,
  dob: string,
  tob: string,
  lat: number,
  lon: number
): Promise<void> {
  doc.addPage();
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 50;

  // Title
  doc.setFont("Times", "bold");
  doc.setFontSize(20);
  doc.setTextColor("#3e4a89");
  doc.text("Vimshottari Dasha", pageWidth / 2, currentY, { align: "center" });
  currentY += 30;

  // 1. Fetch Maha Dasha
  const mahaData = await fetchMahaDasha(dob, tob, lat, lon);
  const mahaDashaLords = mahaData?.response?.mahadasha || [];
  const mahaOrder = mahaData?.response?.mahadasha_order || [];

  if (!Array.isArray(mahaDashaLords) || !Array.isArray(mahaOrder)) {
    console.error("Invalid MahaDasha data:", mahaData);
    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.text("Mahadasha data could not be loaded", pageWidth / 2, currentY, { align: "center" });
    return;
  }

  const mahaRows = mahaDashaLords.map((lord: string, i: number) => {
    const startDate = mahaOrder[i] || "-";
    const endDate = mahaOrder[i + 1] || "-";
    return [lord, startDate, endDate, "-"];
  });

  // Maha Dasha Table
  autoTable(doc, {
    head: [["Mahadasha Lord", "Start Date", "End Date", "Duration"]],
    body: mahaRows,
    startY: currentY,
    theme: "grid",
    headStyles: { fillColor: [62, 74, 137], textColor: "#fff", fontStyle: "bold" },
    bodyStyles: { fontSize: 10 },
    margin: { left: 25, right: 25 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;

  // 2. Antar Dasha (for ALL Maha Dashas)
  const antarData = await fetchAntarDasha(dob, tob, lat, lon);
  const antarDashas = antarData?.response?.antardashas || [];
  const antarOrders = antarData?.response?.antardasha_order || [];

  if (!Array.isArray(antarDashas) || !Array.isArray(antarOrders)) {
    console.error("Invalid AntarDasha data:", antarData);
    doc.setFont("Times", "normal");
    doc.setFontSize(12);
    doc.text("Antar Dasha data could not be loaded", pageWidth / 2, currentY, { align: "center" });
    return;
  }

  for (let mahaIndex = 0; mahaIndex < mahaDashaLords.length; mahaIndex++) {
    const currentMahaLord = mahaDashaLords[mahaIndex];
    const antarsForThisMaha = antarDashas[mahaIndex];
    const ordersForThisMaha = antarOrders[mahaIndex];

    if (Array.isArray(antarsForThisMaha) && Array.isArray(ordersForThisMaha)) {
      const antarRows = antarsForThisMaha.map((d: string, i: number) => [
        d,
        ordersForThisMaha[i] || "-",
        ordersForThisMaha[i + 1] || "-"
      ]);

      currentY = drawAntarDashaTable(
        doc,
        pageWidth,
        currentMahaLord,
        antarRows,
        80
      );
    } else {
      console.warn(`No Antar Dasha data for ${currentMahaLord}`);
    }
  }
}
