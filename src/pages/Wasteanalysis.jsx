import React from 'react';
import { useAppContext } from '../context/AppContext';

// Waste Components
import WasteTracker from '../components/ui/waste/WasteTracker';
import WasteHeatmap from '../components/ui/waste/WasteHeatmap';
import WasteReports from '../components/ui/waste/WasteReports';
import WastePrediction from '../components/ui/waste/WastePrediction';

function WasteAnalysis() {
  const { wasteData, loading, logWaste } = useAppContext();
  
  return (
    <div className="waste-analysis-container">
      <h1>Waste Analysis & Reporting</h1>
      
      <div className="waste-grid">
        <div className="waste-section">
          <h2>Waste Tracker</h2>
          <WasteTracker onLogWaste={logWaste} />
        </div>
        
        <div className="waste-section">
          <h2>Waste Heatmap</h2>
          <WasteHeatmap data={wasteData} isLoading={loading.waste} />
        </div>
        
        <div className="waste-section">
          <h2>Waste Reports</h2>
          <WasteReports data={wasteData} isLoading={loading.waste} />
        </div>
        
        <div className="waste-section">
          <h2>AI Waste Prediction</h2>
          <WastePrediction />
        </div>
      </div>
    </div>
  );
}

export default WasteAnalysis;