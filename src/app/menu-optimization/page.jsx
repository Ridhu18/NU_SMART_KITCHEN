"use client"

import { useState, useEffect } from "react"
import MenuSuggestions from "@/components/ui/menu/MenuSuggestions"
import RecipeGenerator from "@/components/ui/menu/RecipeGenerator"
import CostAnalysis from "@/components/ui/menu/CostAnalysis"
import MenuCalendar from "@/components/ui/menu/MenuCalendar"

export default function MenuOptimizationPage() {
  const [inventoryData, setInventoryData] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  useEffect(() => {
    // Fetch inventory data
    const fetchInventory = async () => {
      try {
        const response = await fetch("/api/inventory")
        const data = await response.json()
        setInventoryData(data)
      } catch (error) {
        console.error("Error fetching inventory:", error)
      }
    }

    // Fetch menu suggestions
    const fetchSuggestions = async () => {
      try {
        const response = await fetch("/api/menu/suggestions")
        const data = await response.json()
        setSuggestions(data)
      } catch (error) {
        console.error("Error fetching menu suggestions:", error)
      }
    }

    fetchInventory()
    fetchSuggestions()
  }, [])

  return (
    <div className="menu-optimization-container">
      <h1>Menu Optimization</h1>

      <div className="menu-grid">
        <div className="menu-section">
          <h2>AI-Suggested Specials</h2>
          <p className="section-description">Based on your current inventory and expiry dates</p>
          <MenuSuggestions suggestions={suggestions} onSelectRecipe={setSelectedRecipe} />
        </div>

        <div className="menu-section">
          <h2>Recipe Generator</h2>
          <p className="section-description">Create new recipes from available ingredients</p>
          <RecipeGenerator inventory={inventoryData} selectedRecipe={selectedRecipe} />
        </div>

        <div className="menu-section">
          <h2>Cost Analysis</h2>
          <CostAnalysis />
        </div>

        <div className="menu-section">
          <h2>Menu Calendar</h2>
          <MenuCalendar />
        </div>
      </div>
    </div>
  )
}

