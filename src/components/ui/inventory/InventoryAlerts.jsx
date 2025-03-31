import React from 'react'

export default function InventoryAlerts({ items = [] }) {
  // Filter items with low stock or expiring soon
  const alertItems = items.filter(item => 
    item.status === "warning" || item.status === "danger"
  )

  if (alertItems.length === 0) {
    return null
  }

  return (
    <div className="inventory-alerts" style={{
      marginBottom: "20px",
      padding: "16px",
      backgroundColor: "#fff3e0",
      borderRadius: "8px",
      border: "1px solid #ffe0b2"
    }}>
      <h3 style={{ 
        margin: "0 0 12px 0",
        color: "#e65100",
        fontSize: "1.1rem"
      }}>
        Inventory Alerts
      </h3>
      <ul style={{
        listStyle: "none",
        padding: 0,
        margin: 0
      }}>
        {alertItems.map(item => (
          <li key={item._id} style={{
            padding: "8px 12px",
            marginBottom: "8px",
            backgroundColor: item.status === "danger" ? "#ffebee" : "#fff8e1",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <span style={{ fontWeight: "500" }}>{item.name}</span>
              <span style={{ 
                marginLeft: "8px",
                color: "#666",
                fontSize: "0.9rem"
              }}>
                {item.status === "danger" ? 
                  `Expires in ${item.expiry}` : 
                  `Quantity: ${item.quantity}`
                }
              </span>
            </div>
            <span style={{
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "0.8rem",
              backgroundColor: item.status === "danger" ? "#ef5350" : "#ffd54f",
              color: item.status === "danger" ? "white" : "black"
            }}>
              {item.status === "danger" ? "Expiring Soon" : "Low Stock"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
} 