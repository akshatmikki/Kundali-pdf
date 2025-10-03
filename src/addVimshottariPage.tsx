import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchMahaDasha, fetchAntarDasha } from "./api/fetchAstro";

/**
 * Helper function to draw an Antar Dasha table on the current page
 */
function drawAntarDashaTable(
  doc: jsPDF,
  pageWidth: number,
  mahadashaLord: string,
  antarRows: string[][],
  startY: number
): number {
    doc.setFont("Times", "bold");
    doc.setFontSize(16);
    doc.text(`Antar Dasha in ${mahadashaLord} Mahadasha`, pageWidth / 2, startY, { align: "center" });

    const tableStartY = startY + 20; // leave space for title

    autoTable(doc, {
        head: [["Antar Dasha Lord", "Start Date", "End Date"]],
        body: antarRows,
        startY: tableStartY,
        theme: "grid",
        headStyles: { fillColor: [120, 49, 94], textColor: "#fff", fontStyle: "bold" },
        bodyStyles: { fontSize: 10 },
        margin: { left: 25, right: 25 },
    });

    return (doc as any).lastAutoTable.finalY + 10; // return Y position after table
}

/**
 * Add Vimshottari Dasha Page to PDF with two Antar Dasha tables per page
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
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 50; // Initial Y for the title

  // Title
  doc.setFont("Times", "bold");
  doc.setFontSize(20);
  doc.setTextColor("#3e4a89");
  doc.text("Vimshottari Dasha", pageWidth / 2, currentY, { align: "center" });
  currentY += 30;

    // 1. Fetch Maha Dasha
    const mahaData = await fetchMahaDasha(dob, tob, lat, lon);
    const mahaDashaLords = mahaData.response.mahadasha;
    const mahaRows = mahaDashaLords.map((lord: string, i: number) => {
        const startDate = mahaData.response.mahadasha_order[i];
        const endDate = mahaData.response.mahadasha_order[i + 1] || "-";
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

    // 2. Fetch Antar Dasha
    const antarData = await fetchAntarDasha(dob, tob, lat, lon);

    // Loop through Maha Dashas and draw Antar Dasha tables sequentially
    for (let i = 0; i < mahaDashaLords.length; i++) {
        if (antarData.response.antardashas[i]) {
            const antarRows = antarData.response.antardashas[i].map(
                (d: string, idx: number) => [
                    d,
                    antarData.response.antardasha_order[i][idx],
                    antarData.response.antardasha_order[i][idx + 1] || "-"
                ]
            );

            // Check if currentY + estimated table height exceeds pageHeight
            const estimatedTableHeight = 20 + antarRows.length * 10; // rough estimate
            if (currentY + estimatedTableHeight > pageHeight - 40) {
                doc.addPage();
                currentY = 50; // reset Y on new page
            }

            currentY = drawAntarDashaTable(doc, pageWidth, mahaDashaLords[i], antarRows, currentY);
            currentY += 10; // spacing between tables
        }
    }
}
