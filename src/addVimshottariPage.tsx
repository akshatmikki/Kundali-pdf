import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchMahaDasha, fetchAntarDasha } from "./api/fetchAstro";

/**
 * Add Vimshottari Dasha Page to PDF
 */
export async function addVimshottariDashaPage(
    doc: jsPDF, // ✅ type fixed
    dob: string, // e.g. "12/05/1999"
    tob: string, // e.g. "10:15"
    lat: number, // ✅ latitude
    lon: number  // ✅ longitude
): Promise<void> {
    doc.addPage();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFont("Times", "bold");
    doc.setFontSize(20);
    doc.setTextColor("#3e4a89");
    doc.text("Vimshottari Dasha", pageWidth / 2, 50, { align: "center" });

    // 1. Fetch Maha Dasha
    const mahaData = await fetchMahaDasha(dob, tob, lat, lon);
    const mahaRows = mahaData.response.mahadasha.map((lord: string, i: number) => {
        const startDate = mahaData.response.mahadasha_order[i];
        const endDate = mahaData.response.mahadasha_order[i + 1] || "-"; // last one
        return [
            lord,
            startDate,
            endDate,
            "-" // or calculate duration if needed
        ];
    });

    autoTable(doc, {
        head: [["Mahadasha Lord", "Start Date", "End Date", "Duration"]],
        body: mahaRows,
        startY: 80,
        theme: "grid",
        headStyles: {
            fillColor: [62, 74, 137],
            textColor: "#fff",
            fontStyle: "bold",
        },
        bodyStyles: { fontSize: 10 },
        margin: { left: 25, right: 25 },
    });

    // 2. Antar Dasha (only current Maha)
    const currentMahaLord = mahaData.response.mahadasha[0]; // simplest approach

    if (currentMahaLord) {
        doc.addPage();
        doc.setFont("Times", "bold");
        doc.setFontSize(16);
        doc.text(`Antar Dasha in ${currentMahaLord} Mahadasha`, pageWidth / 2, 50, { align: "center" });

        const antarData = await fetchAntarDasha(dob, tob, lat, lon);
        const mahaIndex = 0; // pick the correct Mahadasha index
        const antarRows = antarData.response.antardashas[mahaIndex].map(
            (d: string, i: number) => [
                d,
                antarData.response.antardasha_order[mahaIndex][i],
                antarData.response.antardasha_order[mahaIndex][i + 1] || "-"
            ]
        );

        autoTable(doc, {
            head: [["Antar Dasha Lord", "Start Date", "End Date"]],
            body: antarRows,
            startY: 80,
            theme: "grid",
            headStyles: { fillColor: [120, 49, 94], textColor: "#fff", fontStyle: "bold" },
            bodyStyles: { fontSize: 10 },
            margin: { left: 25, right: 25 },
        });
    }
}