"use client"

import { useEffect, useState } from "react"

export default function StockLevels({ inventoryData = [] }) {
  const [stockData, setStockData] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    recentlyAdded: 0,
  })

  useEffect(() => {
    if (inventoryData.length === 0) return

    // Calculate stock statistics
    const totalItems = inventoryData.length

    const lowStock = inventoryData.filter((item) => item.status === "warning").length

    const outOfStock = inventoryData.filter((item) => Number.parseInt(item.quantity) === 0).length

    // For recently added, we would normally use a timestamp
    // Here we'll just use a placeholder value
    const recentlyAdded = 0

    setStockData({
      totalItems,
      lowStock,
      outOfStock,
      recentlyAdded,
    })
  }, [inventoryData])

  return (
    <div className="stock-levels-container">
      <h3 className="section-title">Stock Levels</h3>

      <div className="stock-grid">
        <div className="stock-card">
          <span className="stock-value">{stockData.totalItems}</span>
          <span className="stock-label">Total Items</span>
        </div>

        <div className="stock-card warning">
          <span className="stock-value">{stockData.lowStock}</span>
          <span className="stock-label">Low Stock</span>
        </div>

        <div className="stock-card danger">
          <span className="stock-value">{stockData.outOfStock}</span>
          <span className="stock-label">Out of Stock</span>
        </div>

        <div className="stock-card success">
          <span className="stock-value">{stockData.recentlyAdded}</span>
          <span className="stock-label">Recently Added</span>
        </div>
      </div>

      <button className="order-supplies-btn">Order Supplies</button>
    </div>
  )
}

