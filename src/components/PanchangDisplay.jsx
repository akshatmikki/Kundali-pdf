import { useState } from "react";
import { fetchPanchangData } from "../api/fetchAstro";
import { formatPanchangData, getAuspiciousActivities, getInauspiciousTimes } from "../utils/panchangFormatter";

export default function PanchangDisplay() {
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

  const formattedData = panchangData ? formatPanchangData(panchangData) : null;
  const auspiciousActivities = formattedData ? getAuspiciousActivities(formattedData) : [];
  const inauspiciousTimes = formattedData ? getInauspiciousTimes(formattedData) : {};

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Panchang Data Viewer</h1>
      
      {/* Input Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              step="0.1"
              name="lat"
              value={formData.lat}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="0.1"
              name="lon"
              value={formData.lon}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <input
              type="number"
              step="0.5"
              name="tz"
              value={formData.tz}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className={`px-6 py-2 rounded font-medium ${
            isLoading 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Loading...' : 'Fetch Panchang Data'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Display Panchang Data */}
      {formattedData && (
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Date:</span> {formattedData.basicInfo.date}
              </div>
              <div>
                <span className="font-medium">Day:</span> {formattedData.basicInfo.day}
              </div>
              <div>
                <span className="font-medium">Rasi:</span> {formattedData.basicInfo.rasi}
              </div>
              <div>
                <span className="font-medium">Ayanamsa:</span> {formattedData.basicInfo.ayanamsa}
              </div>
            </div>
          </div>

          {/* Tithi */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Tithi (Lunar Day)</h2>
            <div className="space-y-2">
              <div><span className="font-medium">Name:</span> {formattedData.tithi.name} ({formattedData.tithi.type})</div>
              <div><span className="font-medium">Deity:</span> {formattedData.tithi.deity}</div>
              <div><span className="font-medium">Meaning:</span> {formattedData.tithi.meaning}</div>
              <div><span className="font-medium">Special:</span> {formattedData.tithi.special}</div>
            </div>
          </div>

          {/* Nakshatra */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Nakshatra (Lunar Mansion)</h2>
            <div className="space-y-2">
              <div><span className="font-medium">Name:</span> {formattedData.nakshatra.name}</div>
              <div><span className="font-medium">Lord:</span> {formattedData.nakshatra.lord}</div>
              <div><span className="font-medium">Deity:</span> {formattedData.nakshatra.deity}</div>
              <div><span className="font-medium">Meaning:</span> {formattedData.nakshatra.meaning}</div>
              <div><span className="font-medium">Special:</span> {formattedData.nakshatra.special}</div>
              <div><span className="font-medium">Summary:</span> {formattedData.nakshatra.summary}</div>
              {formattedData.nakshatra.auspiciousDisha && (
                <div>
                  <span className="font-medium">Auspicious Directions:</span> {formattedData.nakshatra.auspiciousDisha.join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Yoga */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">Yoga</h2>
            <div className="space-y-2">
              <div><span className="font-medium">Name:</span> {formattedData.yoga.name}</div>
              <div><span className="font-medium">Meaning:</span> {formattedData.yoga.meaning}</div>
              <div><span className="font-medium">Special:</span> {formattedData.yoga.special}</div>
            </div>
          </div>

          {/* Karana */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Karana</h2>
            <div className="space-y-2">
              <div><span className="font-medium">Name:</span> {formattedData.karana.name} ({formattedData.karana.type})</div>
              <div><span className="font-medium">Lord:</span> {formattedData.karana.lord}</div>
              <div><span className="font-medium">Deity:</span> {formattedData.karana.deity}</div>
              <div><span className="font-medium">Special:</span> {formattedData.karana.special}</div>
            </div>
          </div>

          {/* Auspicious Activities */}
          {auspiciousActivities.length > 0 && (
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-green-700">Auspicious Activities</h2>
              <ul className="space-y-2">
                {auspiciousActivities.map((activity, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inauspicious Times */}
          <div className="bg-red-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Inauspicious Times (Avoid Important Activities)</h2>
            <div className="space-y-2">
              <div><span className="font-medium">Rahu Kaal:</span> {inauspiciousTimes.rahukaal}</div>
              <div><span className="font-medium">Gulika:</span> {inauspiciousTimes.gulika}</div>
              <div><span className="font-medium">Yama Kanta:</span> {inauspiciousTimes.yamakanta}</div>
            </div>
          </div>

          {/* Advanced Details */}
          {formattedData.advanced && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-600">Advanced Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-medium">Sun Rise:</span> {formattedData.advanced.sunRise}</div>
                <div><span className="font-medium">Sun Set:</span> {formattedData.advanced.sunSet}</div>
                <div><span className="font-medium">Moon Rise:</span> {formattedData.advanced.moonRise}</div>
                <div><span className="font-medium">Moon Set:</span> {formattedData.advanced.moonSet}</div>
                <div><span className="font-medium">Next Full Moon:</span> {formattedData.advanced.nextFullMoon}</div>
                <div><span className="font-medium">Next New Moon:</span> {formattedData.advanced.nextNewMoon}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}