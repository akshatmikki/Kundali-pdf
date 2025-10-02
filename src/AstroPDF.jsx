import { useState } from "react";
import './index.css';
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 overflow-hidden flex items-center justify-center px-4">
      {/* Star background */}
      <div className="stars"></div>

      <div className="relative w-full max-w-4xl mx-auto p-10 bg-white rounded-3xl shadow-2xl z-10 space-y-8">
        <h2 className="text-4xl font-bold text-center text-purple-700">
          Generate Your Cosmic PDF
        </h2>

        {/* Personal Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-purple-600">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              placeholder="Sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              placeholder="Place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Birth Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-purple-600">
            Birth Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="number"
              placeholder="Longitude"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center pt-4">
          <button
            onClick={async () => {
              if (
                !dob ||
                !time ||
                !lat ||
                !lon ||
                !name ||
                !sex ||
                !place ||
                !state ||
                !country
              ) {
                alert("Please fill in all fields!");
                return;
              }
              setLoading(true);

              const userData = { name, sex, dob, time, place, state, country };
              await generateFullCosmicReport(dob, time, lat, lon, userData);
              setLoading(false);
            }}
            className="w-full md:w-2/3 lg:w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            {loading ? "Generating..." : "Generate Full Cosmic Report PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
