export default function WasteMetrics() {
    const wasteData = {
      totalWaste: "24.5 kg",
      wasteByCategory: [
        { category: "Produce", percentage: 45 },
        { category: "Dairy", percentage: 20 },
        { category: "Meat", percentage: 15 },
        { category: "Other", percentage: 20 },
      ],
      trend: "decreasing",
    }
  
    return (
      <div className="dashboard-card waste-metrics-card">
        <h2 className="card-title">Waste Metrics</h2>
  
        <div className="waste-overview">
          <div className="waste-total">
            <span className="waste-label">Total This Week</span>
            <span className="waste-value">{wasteData.totalWaste}</span>
            <span className={`waste-trend ${wasteData.trend}`}>
              {wasteData.trend === "decreasing" ? "↓ 12% from last week" : "↑ 8% from last week"}
            </span>
          </div>
  
          <div className="waste-chart">
            {wasteData.wasteByCategory.map((item) => (
              <div key={item.category} className="waste-category">
                <div className="category-label">
                  <span className="category-name">{item.category}</span>
                  <span className="category-percentage">{item.percentage}%</span>
                </div>
                <div className="category-bar-container">
                  <div
                    className={`category-bar ${item.category.toLowerCase()}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <button className="view-details-btn">View Detailed Report</button>
      </div>
    )
  }
  
  