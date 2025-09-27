import { useState } from "react";
import { GenerateCosmicReport } from "./CosmicDMReport";
import TraditionalPanchang from "./components/TraditionalPanchang";
import PanchangDisplay from "./components/PanchangDisplay";
import AstroPDF from "./components/astropdf";

function App() {
  const [activeTab, setActiveTab] = useState("traditional");

  return (
    <div className="App min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-pink-100">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center py-8 text-orange-900 tracking-wide">
            🌟 Vedic Astrology & Panchang System 🌟
          </h1>
          
          {/* Navigation Tabs */}
          <div className="flex justify-center space-x-2 mb-8">
            <button
              onClick={() => setActiveTab("traditional")}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                activeTab === "traditional"
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-orange-300"
                  : "bg-white/80 text-orange-700 hover:bg-orange-100 border-2 border-orange-200"
              }`}
            >
              🔮 Traditional Panchang
            </button>
            <button
              onClick={() => setActiveTab("pdf")}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                activeTab === "pdf"
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-orange-300"
                  : "bg-white/80 text-orange-700 hover:bg-orange-100 border-2 border-orange-200"
              }`}
            >
              📄 PDF Generator
            </button>
            <button
              onClick={() => setActiveTab("display")}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                activeTab === "display"
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-orange-300"
                  : "bg-white/80 text-orange-700 hover:bg-orange-100 border-2 border-orange-200"
              }`}
            >
              ✨ Interactive Display
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === "traditional" && <TraditionalPanchang />}
        {activeTab === "pdf" && <AstroPDF />}
        {activeTab === "display" && <PanchangDisplay />}
      </div>
    </div>
  );
}

export default App;
