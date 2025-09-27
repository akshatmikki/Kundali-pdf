import { useState } from "react";
import { jsPDF } from "jspdf";
import { fetchPanchangData } from "../api/fetchAstro";
import autoTable from "jspdf-autotable";
import { GenerateCosmicReport } from "../CosmicDMReport";

export default function TraditionalPanchang() {
  const [panchangData, setPanchangData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: "1994-03-11",
    time: "05:20",
    lat: "11.2",
    lon: "77.00",
    tz: "5.5"
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPanchangData(
        formData.date,
        formData.time,
        parseFloat(formData.lat),
        parseFloat(formData.lon),
        parseFloat(formData.tz)
      );
      setPanchangData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const generatePDF = (panchangData) => {
  GenerateCosmicReport(panchangData);
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Set peach background helper
  const setPeachBackground = () => {
    doc.setFillColor(255, 218, 185);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  // PAGE: Panchang Title & Main Data
  doc.addPage();
  setPeachBackground();

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(32);
  doc.text("PANCHANG", pageWidth / 2, 70, { align: "center" });

  // Divider
  doc.setDrawColor(180, 140, 105);
  doc.setLineWidth(0.5);
  doc.line(60, 90, pageWidth - 60, 90);
  doc.setFontSize(18);
  doc.text("\u25C6", pageWidth / 2, 95, { align: "center" });

  // Calculate columns
  const colW = (pageWidth - 120) / 4;
  const col1x = 60, col2x = col1x + colW, col3x = col2x + colW, col4x = col3x + colW;
  const startY = 120;

  // Column 1: Calendar
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("CALENDAR", col1x, startY);
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  const calendarArr = [
    "National",
    "Punjabi",
    "Bengali",
    "Tamil",
    "Kerala",
    "Nepali",
    "Chaitradi",
    "Kartakadi"
  ];
  calendarArr.forEach((val, i) => {
    doc.text("\u25C6 " + val, col1x, startY + 22 + i * 18);
  });

  // Column 2: Year
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("YEAR", col2x, startY);
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  const yearArr = [
    panchangData.response.advanced_details?.years?.saka || "N/A",
    panchangData.response.advanced_details?.years?.vikram_samvaat || "N/A",
    panchangData.response.advanced_details?.years?.bengali || "N/A",
    panchangData.response.advanced_details?.years?.tamil || "N/A",
    panchangData.response.advanced_details?.years?.kerala || "N/A",
    panchangData.response.advanced_details?.years?.nepali || "N/A",
    panchangData.response.advanced_details?.years?.chaitradi || "N/A",
    panchangData.response.advanced_details?.years?.kartakadi || "N/A"
  ];
  yearArr.forEach((val, i) => {
    doc.text("\u25C6 " + val, col2x, startY + 22 + i * 18);
  });

  // Column 3: Mah
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("MAH", col3x, startY);
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  const mahArr = [
    panchangData.response.advanced_details?.masa?.jyeshtha || "N/A",
    panchangData.response.advanced_details?.masa?.jyeshtha || "N/A",
    panchangData.response.advanced_details?.masa?.jyeshtha || "N/A",
    panchangData.response.advanced_details?.masa?.vaikasi || "N/A",
    panchangData.response.advanced_details?.masa?.edavam || "N/A",
    panchangData.response.advanced_details?.masa?.jyeshtha || "N/A",
    panchangData.response.advanced_details?.masa?.jyeshtha || "N/A",
    panchangData.response.advanced_details?.masa?.jyeshtha || "N/A"
  ];
  mahArr.forEach((val, i) => {
    doc.text("\u25C6 " + val, col3x, startY + 22 + i * 18);
  });

  // Column 4: Tithi/Pravishthe
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("TITHI/PRAVISHTHE", col4x, startY);
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  const tithiArr = [
    "13",
    "20",
    "20",
    "20",
    "20",
    "20",
    "Shukla 8",
    "Shukla 8"
  ];
  tithiArr.forEach((val, i) => {
    doc.text("\u25C6 " + val, col4x, startY + 22 + i * 18);
  });

  // Set starting position for Panchang & Ghatak details below
  let detailsStartY = startY + calendarArr.length * 18 + 40;

  // Panchang Details (left column)
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("PANCHANG", col1x, detailsStartY);

  const panchangDetails = [
    ["Tithi At Sunrise", panchangData.response.tithi?.name || "N/A"],
    ["Tithi Ending Time", panchangData.response.tithi?.end || "N/A"],
    ["Tithi At Birth", panchangData.response.tithi?.name || "N/A"],
    ["Nak At Sunrise", panchangData.response.nakshatra?.name || "N/A"],
    ["Nak Ending Time", panchangData.response.nakshatra?.end || "N/A"],
    ["Yoga At Birth", panchangData.response.yoga?.name || "N/A"],
    ["Yoga At Sunrise", panchangData.response.yoga?.name || "N/A"],
    ["Yoga Ending Time", panchangData.response.yoga?.end || "N/A"],
    ["Karana At Sunrise", panchangData.response.karana?.name || "N/A"],
    ["Karana Ending Time", panchangData.response.karana?.end || "N/A"],
    ["Karana At Birth", panchangData.response.karana?.name || "N/A"],
    ["Bhayat", "23:58"], // These are static in image, replace as needed
    ["Bhabhog", "43:26"],
    ["Balance Of Dasa", panchangData.response.balance_of_dasa || "N/A"]
  ];

  doc.setFont("times", "normal");
  doc.setFontSize(13);
  panchangDetails.forEach(([key, val], i) => {
    doc.text(key, col1x, detailsStartY + 25 + i * 18);
    doc.text(val.toString(), col1x + 150, detailsStartY + 25 + i * 18);
  });

  // Ghatak Details (right column)
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("GHATAK", col3x, detailsStartY);

  const ghatakDetails = [
    ["Month", panchangData.response.advanced_details?.masa?.ayana || "N/A"],
    ["Tithi", (panchangData.response.tithi?.number || "N/A").toString()],
    ["Day", panchangData.response.day?.name || "N/A"],
    ["Nakshatra", panchangData.response.nakshatra?.name || "N/A"],
    ["Yoga", panchangData.response.yoga?.name || "N/A"],
    ["Karan", panchangData.response.karana?.name || "N/A"],
    ["Prahar", "1"], // static value in image, replace if available
    ["Varga", "None"],
    ["Lagna", panchangData.response.lagna || "N/A"],
    ["Sun", panchangData.response.sun_position?.zodiac || "N/A"],
    ["Moon", panchangData.response.moon_position?.zodiac || "N/A"],
    ["Mar", panchangData.response.mars_position?.zodiac || "N/A"],
    ["Mer", panchangData.response.mercury_position?.zodiac || "N/A"],
    ["Jup", panchangData.response.jupiter_position?.zodiac || "N/A"],
    ["Venus", panchangData.response.venus_position?.zodiac || "N/A"],
    ["Sat", panchangData.response.saturn_position?.zodiac || "N/A"],
    ["Rah", panchangData.response.rah_position?.zodiac || "N/A"],
  ];

  doc.setFont("times", "normal");
  doc.setFontSize(13);
  ghatakDetails.forEach(([key, val], i) => {
    doc.text(key, col3x, detailsStartY + 25 + i * 18);
    doc.text(val.toString(), col3x + 130, detailsStartY + 25 + i * 18);
  });

  // Save PDF
  doc.save("Panchang_Report.pdf");
};



  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-pink-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Input Form */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-orange-200 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-orange-900">🔮 Enter Details for Traditional Panchang 🔮</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-orange-800 mb-2">📅 Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-orange-800 mb-2">🕐 Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-orange-800 mb-2">🌍 Latitude</label>
                <input
                  type="number"
                  step="0.1"
                  name="lat"
                  value={formData.lat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-orange-800 mb-2">🌏 Longitude</label>
                <input
                  type="number"
                  step="0.1"
                  name="lon"
                  value={formData.lon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-orange-800 mb-2">⏰ Timezone</label>
                <input
                  type="number"
                  step="0.5"
                  name="tz"
                  value={formData.tz}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 bg-white/80"
                />
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={fetchData}
                disabled={isLoading}
                className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${isLoading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-orange-300'
                  }`}
              >
                {isLoading ? '⏳ Generating Panchang...' : '✨ Generate Traditional Panchang ✨'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border-2 border-red-300 text-red-700 rounded-2xl shadow-lg">
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          {/* Traditional Panchang Layout */}
          {panchangData && (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-600 text-white text-center py-8 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative">
                  <h1 className="text-4xl font-bold tracking-wide mb-2">🔮 PANCHANG REPORT 🔮</h1>
                  <p className="text-orange-100 text-xl font-semibold">{panchangData.response?.date || 'N/A'}</p>
                  <div className="mt-4 flex justify-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-medium">✨ Vedic Astrology ✨</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left Column */}
                <div className="p-8 border-r border-orange-200 bg-gradient-to-br from-orange-50/50 to-pink-50/50">
                  {/* Calendar Systems Section */}
                  <div className="mb-10">
                    <h2 className="text-xl font-bold text-orange-900 mb-6 border-b-2 border-orange-300 pb-3 bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-3 rounded-t-xl shadow-sm">
                      📅 CALENDAR & YEAR
                    </h2>
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-b-xl border-2 border-orange-200 shadow-inner">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-6 text-sm font-bold text-orange-900 bg-gradient-to-r from-orange-200 to-pink-200 p-3 rounded-xl shadow-sm">
                          <div>📅 CALENDAR</div>
                          <div>🗓️ YEAR</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                          <div className="font-semibold text-orange-800">🇮🇳 National</div>
                          <div className="text-orange-700">Samvat: {panchangData.response?.advanced_details?.years?.saka || 'N/A'}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                          <div className="font-semibold text-orange-800">🕊️ Punjabi</div>
                          <div className="text-orange-700">Samvat: {panchangData.response?.advanced_details?.years?.vikram_samvaat || 'N/A'}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                          <div className="font-semibold text-orange-800">🎭 Bengali</div>
                          <div className="text-orange-700">Samvat: {panchangData.response?.advanced_details?.years?.saka || 'N/A'}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                          <div className="font-semibold text-orange-800">🎨 Tamil</div>
                          <div className="text-orange-700">Samvat: {panchangData.response?.advanced_details?.years?.vikram_samvaat || 'N/A'}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                          <div className="font-semibold text-orange-800">🌴 Kerala</div>
                          <div className="text-orange-700">Samvat: {panchangData.response?.advanced_details?.years?.vikram_samvaat || 'N/A'}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                          <div className="font-semibold text-orange-800">🏔️ Nepali</div>
                          <div className="text-orange-700">Samvat: {panchangData.response?.advanced_details?.years?.vikram_samvaat || 'N/A'}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                          <div className="font-semibold text-orange-800">🌸 Chaitradi</div>
                          <div className="text-orange-700">Samvat: {panchangData.response?.advanced_details?.years?.vikram_samvaat || 'N/A'}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                          <div className="font-semibold text-orange-800">🦂 Kartakadi</div>
                          <div className="text-orange-700">Samvat: {panchangData.response?.advanced_details?.years?.vikram_samvaat || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MAH & TITHI/PRAVISHTE Section */}
                  <div className="mb-10">
                    <h2 className="text-xl font-bold text-orange-900 mb-6 border-b-2 border-orange-300 pb-3 bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-3 rounded-t-xl shadow-sm">
                      🌙 MAH & TITHI/PRAVISHTE
                    </h2>
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-b-xl border-2 border-orange-200 shadow-inner">
                      <div className="grid grid-cols-2 gap-6 text-sm font-bold text-orange-900 bg-gradient-to-r from-orange-200 to-pink-200 p-3 rounded-xl shadow-sm">
                        <div>🌙 MAH</div>
                        <div>📅 TITHI/PRAVISHTE</div>
                      </div>
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                          <div className="font-semibold text-orange-800">{panchangData.response?.advanced_details?.masa?.amanta_name || 'N/A'}</div>
                          <div className="text-orange-700">
                            {i >= 6 ? `${panchangData.response?.tithi?.type || ''} ${panchangData.response?.tithi?.number || 'N/A'}` : panchangData.response?.tithi?.number || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="p-8 bg-gradient-to-br from-pink-50/50 to-orange-50/50">
                {/* Detailed Panchang Section */}
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-orange-900 mb-6 border-b-2 border-orange-300 pb-3 bg-gradient-to-r from-pink-100 to-orange-100 px-4 py-3 rounded-t-xl shadow-sm">
                    ✨ PANCHANG (Detailed)
                  </h2>
                  <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-b-xl border-2 border-orange-200 shadow-inner">
                    <div className="grid grid-cols-2 gap-6 text-sm font-bold text-orange-900 bg-gradient-to-r from-pink-200 to-orange-200 p-3 rounded-xl shadow-sm">
                      <div>📊 DETAIL</div>
                      <div>📋 VALUE</div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">🌅 Tithi At Sunrise:</span>
                      <span className="text-orange-700">{panchangData.response?.tithi?.name} ({panchangData.response?.tithi?.number})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">⏰ Tithi Ending Time:</span>
                      <span className="text-orange-700">{panchangData.response?.tithi?.end ? new Date(panchangData.response.tithi.end).toLocaleTimeString() : 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">👶 Tithi At Birth:</span>
                      <span className="text-orange-700">{panchangData.response?.tithi?.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">🌙 Nak At Sunrise:</span>
                      <span className="text-orange-700">{panchangData.response?.nakshatra?.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">⏰ Nak. Ending Time:</span>
                      <span className="text-orange-700">{panchangData.response?.nakshatra?.end ? new Date(panchangData.response.nakshatra.end).toLocaleTimeString() : 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">🧘 Yoga At Birth:</span>
                      <span className="text-orange-700">{panchangData.response?.yoga?.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">🌅 Yoga At Sunrise:</span>
                      <span className="text-orange-700">{panchangData.response?.yoga?.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">⏰ Yoga Ending Time:</span>
                      <span className="text-orange-700">{panchangData.response?.yoga?.end ? new Date(panchangData.response.yoga.end).toLocaleTimeString() : 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">🔮 Karana At Sunrise:</span>
                      <span className="text-orange-700">{panchangData.response?.karana?.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">⏰ Karana Ending Time:</span>
                      <span className="text-orange-700">{panchangData.response?.karana?.end ? new Date(panchangData.response.karana.end).toLocaleTimeString() : 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">👶 Karana At Birth:</span>
                      <span className="text-orange-700">{panchangData.response?.karana?.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">⏳ Bhayat:</span>
                      <span className="text-orange-700">23:58</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">🎯 Bhabhog:</span>
                      <span className="text-orange-700">43:26</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      <span className="font-semibold text-orange-800">⚖️ Balance Of Dasa:</span>
                      <span className="text-orange-700">Venus 7 Y 1 M 19 D</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GHATAK Section */}
              <div>
                <h2 className="text-xl font-bold text-orange-900 mb-6 border-b-2 border-orange-300 pb-3 bg-gradient-to-r from-pink-100 to-orange-100 px-4 py-3 rounded-t-xl shadow-sm">
                  🔮 GHATAK
                </h2>
                <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-b-xl border-2 border-orange-200 shadow-inner">
                  <div className="grid grid-cols-2 gap-6 text-sm font-bold text-orange-900 bg-gradient-to-r from-pink-200 to-orange-200 p-3 rounded-xl shadow-sm">
                    <div>🔮 PLANET</div>
                    <div>📍 POSITION</div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">📅 Month:</span>
                    <span className="text-orange-700">{panchangData.response?.advanced_details?.masa?.amanta_name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">🌙 Tithi:</span>
                    <span className="text-orange-700">{panchangData.response?.tithi?.number || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">📆 Day:</span>
                    <span className="text-orange-700">{panchangData.response?.day?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">⭐ Nakshatra:</span>
                    <span className="text-orange-700">{panchangData.response?.nakshatra?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">🧘 Yoga:</span>
                    <span className="text-orange-700">{panchangData.response?.yoga?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">🔮 Karan:</span>
                    <span className="text-orange-700">{panchangData.response?.karana?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">⏰ Prahar:</span>
                    <span className="text-orange-700">1</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">📊 Varga:</span>
                    <span className="text-orange-700">None</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">🎯 Lagna:</span>
                    <span className="text-orange-700">{panchangData.response?.rasi?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">☀️ Sun:</span>
                    <span className="text-orange-700">{panchangData.response?.sun_position?.zodiac || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">🌙 Moon:</span>
                    <span className="text-orange-700">{panchangData.response?.rasi?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">🔴 Mar (Mars):</span>
                    <span className="text-orange-700">{panchangData.response?.rasi?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">🟢 Mer (Mercury):</span>
                    <span className="text-orange-700">{panchangData.response?.rasi?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">🟡 Jup (Jupiter):</span>
                    <span className="text-orange-700">{panchangData.response?.rasi?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">⚪ Venus:</span>
                    <span className="text-orange-700">{panchangData.response?.rasi?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">🟤 Sat (Saturn):</span>
                    <span className="text-orange-700">{panchangData.response?.rasi?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm hover:bg-orange-100 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-orange-800">🌑 Rah (Rahu):</span>
                    <span className="text-orange-700">{panchangData.response?.rasi?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          
          )}
          {/* Download Button */}
          {panchangData && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-orange-800 font-semibold text-center md:text-left">
                <p>✨ Generated on {new Date().toLocaleDateString()} | 🔮 Vedic Astrology Panchang Report ✨</p>
              </div>
              <button
                onClick={generatePDF(panchangData)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-300"
              >
                📄 Download Complete Cosmic & Panchang Report
              </button>
            </div>
            )}
        </div >
      </div>
    </>
  );
}