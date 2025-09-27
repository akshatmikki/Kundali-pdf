import { jsPDF } from "jspdf";
import { useState } from "react";
import { fetchAstroData, fetchPanchangData } from "../api/fetchAstro";
import { fetchOpenAISummary } from "../api/fetchopenAi";
import { GenerateCosmicReport } from "../CosmicDMReport";

export default function AstroPDF() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: "1994-03-11",
    time: "05:20",
    lat: "11.2",
    lon: "77.00",
    tz: "5.5"
  });

const handleGenerateReport = async () => {
  setIsLoading(true);
  setError(null);

  try {
    // fetch Panchang data from API
    const panchangData = await fetchPanchangData(
      formData.date,
      formData.time,
      parseFloat(formData.lat),
      parseFloat(formData.lon),
      parseFloat(formData.tz)
    );

    // call PDF generator
    await GenerateCosmicReport(panchangData);

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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Vedic Astrology & Panchang Report Generator</h2>
        <p className="text-gray-600 mb-4">
          Generate a comprehensive PDF report with Panchang data including Tithi, Nakshatra, Yoga, Karana, and auspicious times.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Enter Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time (HH:MM)
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="0.1"
              name="lat"
              value={formData.lat}
              onChange={handleInputChange}
              placeholder="e.g., 11.2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="0.1"
              name="lon"
              value={formData.lon}
              onChange={handleInputChange}
              placeholder="e.g., 77.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone (e.g., 5.5 for IST)
            </label>
            <input
              type="number"
              step="0.5"
              name="tz"
              value={formData.tz}
              onChange={handleInputChange}
              placeholder="e.g., 5.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

<button
  onClick={handleGenerateReport}
  disabled={isLoading}
  className={`w-full px-6 py-3 rounded shadow-md font-medium transition-colors ${
    isLoading
      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
      : "bg-blue-600 text-white hover:bg-blue-700"
  }`}
>
  {isLoading ? "Generating PDF..." : "Generate Panchang & Astro PDF"}
</button>

      {isLoading && (
        <div className="mt-4 text-blue-600 text-center">
          <p>Fetching Panchang data and generating your personalized report...</p>
        </div>
      )}
    </div>
  );
}
