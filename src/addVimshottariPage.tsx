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
    doc.text(`Antar Dasha in ${mahadashaLord} Mahadasha`, pageWidth / 2, 50, { align: "center" });

    autoTable(doc, {
        head: [["Antar Dasha Lord", "Start Date", "End Date"]],
        body: antarRows,
        startY: startY, // Use this for consistent initial startY on a new page
        theme: "grid",
        headStyles: { fillColor: [120, 49, 94], textColor: "#fff", fontStyle: "bold" },
        bodyStyles: { fontSize: 10 },
        margin: { left: 25, right: 25 },
    });

    // Return the new Y position after the table, plus some margin
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
        const endDate = mahaData.response.mahadasha_order[i + 1] || "-"; // last one
        return [
            lord,
            startDate,
            endDate,
            "-" // or calculate duration if needed
        ];
    });

    // Maha Dasha Table
    autoTable(doc, {
        head: [["Mahadasha Lord", "Start Date", "End Date", "Duration"]],
        body: mahaRows,
        startY: currentY,
        theme: "grid",
        headStyles: {
            fillColor: [62, 74, 137],
            textColor: "#fff",
            fontStyle: "bold",
        },
        bodyStyles: { fontSize: 10 },
        margin: { left: 25, right: 25 },
    });

    // Update currentY to below the Mahadasha table
    currentY = (doc as any).lastAutoTable.finalY + 20;

    // 2. Antar Dasha (for ALL Maha Dashas)
    const antarData = await fetchAntarDasha(dob, tob, lat, lon);

    // Loop through all Maha Dashas to generate their Antar Dasha tables
    for (let mahaIndex = 0; mahaIndex < mahaDashaLords.length; mahaIndex++) {
        const currentMahaLord = mahaDashaLords[mahaIndex];
        
        // Check if there is Antar Dasha data for this Mahadasha
        if (antarData.response.antardashas[mahaIndex] && antarData.response.antardasha_order[mahaIndex]) {
            
            // Map the Antar Dasha data into rows for jspdf-autotable
            const antarRows = antarData.response.antardashas[mahaIndex].map(
                (d: string, i: number) => [
                    d,
                    antarData.response.antardasha_order[mahaIndex][i],
                    // Get the end date from the next index in the order array
                    antarData.response.antardasha_order[mahaIndex][i + 1] || "-" 
                ]
            );

            // Draw the table on a new page
            currentY = drawAntarDashaTable(
                doc,
                pageWidth,
                currentMahaLord,
                antarRows,
                80 // Start Y for the table on the new page
            );
        }
    }
}