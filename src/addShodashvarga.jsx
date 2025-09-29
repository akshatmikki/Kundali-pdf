import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import separately
import { fetchDivisionalChart } from "./api/fetchAstro";

const divisionalCharts = [
  { div: "D1", title: "Rashi" },
  { div: "D2", title: "Hora" },
  { div: "D3", title: "Dreshkan" },
  { div: "D4", title: "Chaturthamsha" },
  { div: "D5", title: "Panchamsha" },
  { div: "D6", title: "Shashtiamsa" },
  { div: "D7", title: "Saptamsa" },
  { div: "D8", title: "Ashtamsa" },
  { div: "D9", title: "Navamsa" },
  { div: "D10", title: "Dashamsa" },
  { div: "D11", title: "Ekadamsa" },
  { div: "D12", title: "Dwadashamsha" },
  { div: "D16", title: "Shodashamsa" },
  { div: "D20", title: "Vimsamsa" },
  { div: "D24", title: "Chaturvimshamsa" },
  { div: "D27", title: "Saptavimsamsa" },
  { div: "D30", title: "Trimsamsa" },
  { div: "D40", title: "Khavedamsa" },
  { div: "D45", title: "Akshavedamsa" }
];

const planets = ["As", "Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"];

// Add Sarvodhya/Shodashvarga table page to an existing PDF
export async function addShodashvargaPage(doc, dob, tob, lat, lon) {
  doc.addPage(); // New page for Shodashvarga table
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("Times", "bold");
  doc.setFontSize(20);
  doc.setTextColor("#a16a21");
  doc.text("Shodashvarga Table", pageWidth / 2, 50, { align: "center" });

  // Fetch chart data
  const chartsData = await Promise.all(
    divisionalCharts.map(async (chart) => {
      const data = await fetchDivisionalChart({
        dob,
        tob,
        lat,
        lon,
        div: chart.div,
        response_type: "planet_object",
      });

      // Map planets to zodiac signs
      const row = planets.map((p) => {
        const planet = Object.values(data.response).find((pl) => pl.name === p);
        return planet?.zodiac || "-";
      });

      return [chart.title, ...row];
    })
  );

  autoTable(doc, {
  head: [["Divisional Chart", "As", "Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"]],
  body: chartsData,
  startY: 80,
  theme: "grid",
  headStyles: { fillColor: [161, 106, 33], textColor: "#fff", fontStyle: "bold" },
  bodyStyles: { fontSize: 10 },
  margin: { left: 25, right: 25 }
});
}
