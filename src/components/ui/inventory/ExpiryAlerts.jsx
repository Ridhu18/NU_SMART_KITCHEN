"use client"

import { useEffect, useState } from "react"

export default function ExpiryAlerts({ inventoryData = [] }) {
  const [expiryData, setExpiryData] = useState({
    expiringSoon: 0,
    expired: 0,
    categories: [],
  })

  useEffect(() => {
    if (inventoryData.length === 0) return

    // Calculate expiry statistics
    const expiringSoon = inventoryData.filter((item) => {
      const days = Number.parseInt(item.expiry)
      return days > 0 && days <= 5
    }).length

    const expired = inventoryData.filter((item) => {
      const days = Number.parseInt(item.expiry)
      return days <= 0
    }).length

    // Group by category
    const categoryMap = new Map()

    inventoryData.forEach((item) => {
      const days = Number.parseInt(item.expiry)
      if (days <= 5) {
        if (!categoryMap.has(item.category)) {
          categoryMap.set(item.category, 0)
        }
        categoryMap.set(item.category, categoryMap.get(item.category) + 1)
      }
    })

    const categories = Array.from(categoryMap).map(([name, count]) => ({ name, count }))

    setExpiryData({
      expiringSoon,
      expired,
      categories,
    })
  }, [inventoryData])

  return (
    <div className="expiry-alerts-container">
      <h3 className="section-title">Expiry Alerts</h3>

      <div className="expiry-stats">
        <div className="expiry-stat">
          <span className="stat-value warning">{expiryData.expiringSoon}</span>
          <span className="stat-label">Expiring Soon</span>
        </div>
        <div className="expiry-stat">
          <span className="stat-value danger">{expiryData.expired}</span>
          <span className="stat-label">Expired</span>
        </div>
      </div>

      <div className="expiry-categories">
        <h4>Categories at Risk</h4>
        {expiryData.categories.length === 0 ? (
          <p className="no-data">No categories at risk</p>
        ) : (
          <ul className="category-list">
            {expiryData.categories.map((category) => (
              <li key={category.name} className="category-item">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

