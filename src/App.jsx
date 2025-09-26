import './App.css';
import { generateCosmicReport } from "./CosmicDMReport";

function App() {
  const handleDownload = () => {
    generateCosmicReport(); 
  };

  return (
    <>
      <button onClick={handleDownload}>Download Cosmic Report</button>
    </>
  );
}

export default App;
