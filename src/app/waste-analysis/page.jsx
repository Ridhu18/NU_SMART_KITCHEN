"use client"

import { useState, useEffect } from "react"
import WasteTracker from "@/components/ui/waste/WasteTracker"
import WasteHeatmap from "@/components/ui/waste/WasteHeatmap"
import WasteReports from "@/components/ui/waste/WasteReports"
import WastePrediction from "@/components/ui/waste/WastePrediction"

export default function WasteAnalysisPage() {
  const [wasteData, setWasteData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/waste/data")
        const data = await response.json()
        setWasteData(data)
      } catch (error) {
        console.error("Error fetching waste data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWasteData()
  }, [])

  return (
    <div className="waste-analysis-container">
      <h1>Waste Analysis & Reporting</h1>

      <div className="waste-grid">
        <div className="waste-section">
          <h2>Waste Tracker</h2>
          <WasteTracker />
        </div>

        <div className="waste-section">
          <h2>Waste Heatmap</h2>
          <WasteHeatmap data={wasteData} isLoading={isLoading} />
        </div>

        <div className="waste-section">
          <h2>Waste Reports</h2>
          <WasteReports data={wasteData} isLoading={isLoading} />
        </div>

        <div className="waste-section">
          <h2>AI Waste Prediction</h2>
          <WastePrediction />
        </div>
      </div>
    </div>
  )
}

