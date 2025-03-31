"use client"

import { useState } from "react"

export default function WastePrediction() {
  const [timeframe, setTimeframe] = useState("week")

  // Sample prediction data
  const predictionData = {
    week: {
      totalPredicted: "30.2 kg",
      highRiskItems: [
        { name: "Lettuce", risk: "high", quantity: "4.2 kg", reason: "Short shelf life" },
        { name: "Milk", risk: "high", quantity: "3.5 L", reason: "Approaching expiry" },
        { name: "Tomatoes", risk: "medium", quantity: "2.8 kg", reason: "Seasonal oversupply" },
      ],
      recommendations: [
        "Reduce lettuce order by 20% for next week",
        "Create a weekend special using milk",
        "Offer tomato-based dishes as daily specials",
      ],
    },
    month: {
      totalPredicted: "125.5 kg",
      highRiskItems: [
        { name: "Seasonal Produce", risk: "high", quantity: "22.5 kg", reason: "End of season" },
        { name: "Seafood", risk: "high", quantity: "15.3 kg", reason: "Price fluctuation" },
        { name: "Dairy", risk: "medium", quantity: "18.2 L", reason: "Consistent oversupply" },
      ],
      recommendations: [
        "Adjust menu for seasonal transitions",
        "Review seafood supplier contracts",
        "Implement dairy inventory rotation system",
      ],
    },
  }

  const currentPrediction = predictionData[timeframe]

  return (
    <div className="waste-prediction-container">
      <div className="prediction-controls">
        <button
          className={`timeframe-btn ${timeframe === "week" ? "active" : ""}`}
          onClick={() => setTimeframe("week")}
        >
          Next Week
        </button>
        <button
          className={`timeframe-btn ${timeframe === "month" ? "active" : ""}`}
          onClick={() => setTimeframe("month")}
        >
          Next Month
        </button>
      </div>

      <div className="prediction-summary">
        <div className="prediction-total">
          <h4>Predicted Waste</h4>
          <div className="total-value">{currentPrediction.totalPredicted}</div>
        </div>
      </div>

      <div className="high-risk-items">
        <h4>High Risk Items</h4>
        <ul className="risk-list">
          {currentPrediction.highRiskItems.map((item, index) => (
            <li key={index} className={`risk-item ${item.risk}`}>
              <div className="item-header">
                <span className="item-name">{item.name}</span>
                <span className="risk-badge">{item.risk}</span>
              </div>
              <div className="item-details">
                <span className="item-quantity">{item.quantity}</span>
                <span className="item-reason">{item.reason}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="ai-recommendations">
        <h4>AI Recommendations</h4>
        <ul className="recommendation-list">
          {currentPrediction.recommendations.map((recommendation, index) => (
            <li key={index} className="recommendation-item">
              {recommendation}
            </li>
          ))}
        </ul>
      </div>

      <button className="take-action-btn">Take Action</button>
    </div>
  )
}

