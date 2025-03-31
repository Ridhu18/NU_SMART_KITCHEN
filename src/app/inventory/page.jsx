"use client"

import { useState, useEffect } from "react"
import InventoryScanner from "@/components/ui/inventory/InventoryScanner"
import InventoryList from "@/components/ui/inventory/InventoryList"
import ExpiryAlerts from "@/components/ui/inventory/ExpiryAlerts"
import StockLevels from "@/components/ui/inventory/StockLevels"

export default function InventoryPage() {
  const [scanMode, setScanMode] = useState(false)
  const [inventoryData, setInventoryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchInventory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://localhost:5000/api/inventory")

      if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.status}`)
      }

      const data = await response.json()
      setInventoryData(data)
    } catch (error) {
      console.error("Failed to fetch inventory:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleScanComplete = async (newItems) => {
    setScanMode(false)
    // Refresh inventory data
    await fetchInventory()
  }

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Smart Inventory Management</h1>
        <button 
          className={`scan-button ${scanMode ? "active" : ""}`} 
          onClick={() => setScanMode(!scanMode)}
        >
          {scanMode ? "Cancel Scan" : "Start Scanning"}
        </button>
      </div>

      {scanMode ? (
        <InventoryScanner onScanComplete={handleScanComplete} />
      ) : (
        <>
          <div className="inventory-stats">
            <ExpiryAlerts inventoryData={inventoryData} />
            <StockLevels inventoryData={inventoryData} />
          </div>
          <InventoryList data={inventoryData} isLoading={isLoading} />
        </>
      )}
    </div>
  )
}

