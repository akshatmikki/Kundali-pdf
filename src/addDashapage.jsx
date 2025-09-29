// addDashaPage.js
'use client';

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchMahaDasha, fetchAntarDasha } from "./api/fetchAstro";

/**
 * Adds Vimshottari Dasha pages to the given PDF document
 * @param {jsPDF} doc - jsPDF instance
 * @param {string} dob - Date of birth in DD/MM/YYYY
 * @param {string} tob - Time of birth in HH:MM
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} tz - Timezone offset
 */
export const addDashaPage = async (doc, dob, tob, lat, lon, tz = 5.5) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Fetch Maha and Antar Dashas
  const mahaData = await fetchMahaDasha(dob, tob, lat, lon, tz);
  const antarData = await fetchAntarDasha(dob, tob, lat, lon, tz);

  // --- Maha Dasha Table ---
  doc.addPage();
  doc.setFont("Times", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#a16a21");
  doc.text("Vimshottari Dasha Report", pageWidth / 2, 40, { align: "center" });

  const mahaTable = mahaData.response.mahadasha.map((planet, i) => {
    const start = new Date(mahaData.response.mahadasha_order[i]);
    const end =
      i < mahaData.response.mahadasha_order.length - 1
        ? new Date(new Date(mahaData.response.mahadasha_order[i + 1]).getTime() - 86400000)
        : "N/A";
    return [planet, start.toDateString(), end instanceof Date ? end.toDateString() : end];
  });

  autoTable(doc, {
    head: [["Maha Dasha Planet", "Start Date", "End Date"]],
    body: mahaTable,
    startY: 70,
    theme: "grid",
    headStyles: { fillColor: [161, 106, 33], textColor: "#fff", fontStyle: "bold" },
    bodyStyles: { fontSize: 10 },
    margin: { left: 25, right: 25 }
  });

  // --- Antar Dasha Table ---
  doc.addPage();
  doc.setFontSize(20);
  doc.text("Antar Dasha", pageWidth / 2, 40, { align: "center" });

  const antarTable = [];
  antarData.response.antardashas.forEach((subArr, mahaIndex) => {
    subArr.forEach((sub, subIndex) => {
      const start = new Date(antarData.response.antardasha_order[mahaIndex][subIndex]);
      const end =
        subIndex < subArr.length - 1
          ? new Date(new Date(antarData.response.antardasha_order[mahaIndex][subIndex + 1]).getTime() - 86400000)
          : mahaIndex < antarData.response.antardashas.length - 1
          ? new Date(new Date(antarData.response.antardasha_order[mahaIndex + 1][0]).getTime() - 86400000)
          : "N/A";

      const now = new Date();
      const isCurrent = now >= start && (end instanceof Date ? now <= end : true);

      antarTable.push([
        mahaData.response.mahadasha[mahaIndex],
        sub,
        start.toDateString(),
        end instanceof Date ? end.toDateString() : end,
        isCurrent ? "✅ Running" : ""
      ]);
    });
  });

  autoTable(doc, {
    head: [["Maha Dasha", "Antar Dasha", "Start Date", "End Date", "Status"]],
    body: antarTable,
    startY: 70,
    theme: "grid",
    headStyles: { fillColor: [161, 106, 33], textColor: "#fff", fontStyle: "bold" },
    bodyStyles: { fontSize: 9 },
    margin: { left: 15, right: 15 }
  });
};
