export default function WasteReports({ data = [], isLoading = false }) {
    // Sample data if none provided
    const sampleData = {
      totalWaste: {
        thisWeek: "32.5 kg",
        lastWeek: "38.2 kg",
        change: "-15%",
      },
      wasteByCategory: [
        { category: "Produce", amount: "12.3 kg", percentage: 38 },
        { category: "Meat", amount: "8.7 kg", percentage: 27 },
        { category: "Dairy", amount: "5.2 kg", percentage: 16 },
        { category: "Prepared", amount: "6.3 kg", percentage: 19 },
      ],
      wasteByReason: [
        { reason: "Spoiled", amount: "14.8 kg", percentage: 45 },
        { reason: "Overproduced", amount: "9.2 kg", percentage: 28 },
        { reason: "Expired", amount: "5.5 kg", percentage: 17 },
        { reason: "Customer Return", amount: "3.0 kg", percentage: 10 },
      ],
      financialImpact: {
        totalCost: "$245.80",
        averageCostPerDay: "$35.11",
        projectedAnnualLoss: "$12,740",
      },
    }
  
    const reportData = data.length ? data : sampleData
  
    return (
      <div className="waste-reports-container">
        {isLoading ? (
          <div className="loading-state">Loading report data...</div>
        ) : (
          <>
            <div className="report-summary">
              <div className="summary-card">
                <h4>Total Waste This Week</h4>
                <div className="summary-value">{reportData.totalWaste.thisWeek}</div>
                <div className="summary-comparison">
                  <span>vs Last Week: </span>
                  <span className="change-value">{reportData.totalWaste.change}</span>
                </div>
              </div>
  
              <div className="summary-card">
                <h4>Financial Impact</h4>
                <div className="summary-value">{reportData.financialImpact.totalCost}</div>
                <div className="summary-detail">Projected Annual: {reportData.financialImpact.projectedAnnualLoss}</div>
              </div>
            </div>
  
            <div className="report-sections">
              <div className="report-section">
                <h4>Waste by Category</h4>
                <ul className="category-list">
                  {reportData.wasteByCategory.map((item, index) => (
                    <li key={index} className="category-item">
                      <div className="category-header">
                        <span className="category-name">{item.category}</span>
                        <span className="category-amount">{item.amount}</span>
                      </div>
                      <div className="category-bar-container">
                        <div className="category-bar" style={{ width: `${item.percentage}%` }}></div>
                        <span className="percentage-label">{item.percentage}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
  
              <div className="report-section">
                <h4>Waste by Reason</h4>
                <ul className="reason-list">
                  {reportData.wasteByReason.map((item, index) => (
                    <li key={index} className="reason-item">
                      <div className="reason-header">
                        <span className="reason-name">{item.reason}</span>
                        <span className="reason-amount">{item.amount}</span>
                      </div>
                      <div className="reason-bar-container">
                        <div className="reason-bar" style={{ width: `${item.percentage}%` }}></div>
                        <span className="percentage-label">{item.percentage}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
  
            <div className="report-actions">
              <button className="export-btn">Export Report</button>
              <button className="detailed-btn">View Detailed Analysis</button>
            </div>
          </>
        )}
      </div>
    )
  }
  
  