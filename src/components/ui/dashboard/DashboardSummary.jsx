import { Link } from "react-router-dom"

export default function DashboardSummary() {
  const summaryData = {
    wasteReduction: "32%",
    costSavings: "$1,245",
    inventoryHealth: "87%",
    menuEfficiency: "92%",
  }

  return (
    <div className="dashboard-card summary-card">
      <h2 className="card-title">Performance Summary</h2>

      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-icon waste-icon">📉</span>
          <div className="stat-info">
            <span className="stat-value">{summaryData.wasteReduction}</span>
            <span className="stat-label">Waste Reduction</span>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icon savings-icon">💰</span>
          <div className="stat-info">
            <span className="stat-value">{summaryData.costSavings}</span>
            <span className="stat-label">Monthly Savings</span>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icon inventory-icon">📦</span>
          <div className="stat-info">
            <span className="stat-value">{summaryData.inventoryHealth}</span>
            <span className="stat-label">Inventory Health</span>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icon menu-icon">🍽️</span>
          <div className="stat-info">
            <span className="stat-value">{summaryData.menuEfficiency}</span>
            <span className="stat-label">Menu Efficiency</span>
          </div>
        </div>
      </div>
      <Link to="/details" className="view-details-link">
        View Details
      </Link>
    </div>
  )
}

