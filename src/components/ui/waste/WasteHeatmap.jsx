export default function WasteHeatmap({ data = [], isLoading = false }) {
    // Sample data if none provided
    const sampleData = [
      { station: "Prep Station", wastePercentage: 35 },
      { station: "Grill", wastePercentage: 25 },
      { station: "Salad Bar", wastePercentage: 15 },
      { station: "Dessert Station", wastePercentage: 10 },
      { station: "Beverage Station", wastePercentage: 5 },
      { station: "Other", wastePercentage: 10 },
    ]
  
    const heatmapData = data.length ? data : sampleData
  
    const getHeatColor = (percentage) => {
      if (percentage >= 30) return "high-waste"
      if (percentage >= 15) return "medium-waste"
      return "low-waste"
    }
  
    return (
      <div className="waste-heatmap-container">
        {isLoading ? (
          <div className="loading-state">Loading heatmap data...</div>
        ) : (
          <>
            <div className="heatmap-grid">
              {heatmapData.map((item, index) => (
                <div key={index} className="heatmap-item">
                  <div className="station-name">{item.station}</div>
                  <div className={`heatmap-bar ${getHeatColor(item.wastePercentage)}`}>
                    <div className="heat-fill" style={{ width: `${item.wastePercentage}%` }}></div>
                    <span className="percentage-label">{item.wastePercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
  
            <div className="heatmap-legend">
              <div className="legend-item">
                <span className="legend-color high-waste"></span>
                <span className="legend-label">High Waste (30%+)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color medium-waste"></span>
                <span className="legend-label">Medium Waste (15-29%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color low-waste"></span>
                <span className="legend-label">Low Waste (0-14%)</span>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
  
  