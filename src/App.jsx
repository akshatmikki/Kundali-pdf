import { useState } from "react";
import { generateFullCosmicReport } from "./CosmicDMReport.jsx";

export default function AstroPDF() {
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [place, setPlace] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);

  // Helper to format date in dd-mm-yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper to format time in 24-hour HH:mm
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-orange-800 text-center">
        Generate Your Cosmic PDF
      </h2>

      {/* User Info Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Sex"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* DOB & Location Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="DD-MM-YYYY"
          value={formatDate(dob)}
          onChange={(e) => {
            const [day, month, year] = e.target.value.split("-");
            if (day && month && year) {
              setDob(`${year}-${month}-${day}`); // store in yyyy-mm-dd for compatibility
            } else {
              setDob("");
            }
          }}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="time"
          value={formatTime(time)}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <button
        onClick={async () => {
          if (!dob || !time || !lat || !lon || !name || !sex || !place || !state || !country) {
            alert("Please fill in all fields!");
            return;
          }
          setLoading(true);

          const userData = { name, sex, dob, time, place, state, country };
          await generateFullCosmicReport(dob, time, lat, lon, userData);
          setLoading(false);
        }}
        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
      >
        {loading ? "Generating..." : "Generate Full Cosmic Report PDF"}
      </button>
    </div>
  );
}