"use client"

//import Image from "next/image"
import React, { useState, useEffect } from 'react'
import ViewRecipe from './ViewRecipe'

export default function MenuSuggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('http://localhost:5000/api/inventory')
      if (!response.ok) {
        throw new Error('Failed to fetch inventory')
      }

      const inventory = await response.json()
      
      const suggestionsResponse = await fetch('http://localhost:5000/api/menu/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inventory })
      })

      if (!suggestionsResponse.ok) {
        throw new Error('Failed to fetch suggestions')
      }

      const data = await suggestionsResponse.json()
      setSuggestions(data.suggestions)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewRecipe = async (suggestion) => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/menu/recipe-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: suggestion.name,
          cuisine: suggestion.cuisine,
          ingredients: suggestion.availableIngredients
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get recipe details')
      }

      const recipeDetails = await response.json()
      setSelectedRecipe(recipeDetails)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToMenu = async (suggestion) => {
    try {
      setLoading(true)
      
      // First, get detailed recipe information
      const recipeResponse = await fetch('http://localhost:5000/api/menu/recipe-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: suggestion.name,
          cuisine: suggestion.cuisine,
          ingredients: suggestion.availableIngredients
        })
      })

      if (!recipeResponse.ok) {
        throw new Error('Failed to get recipe details')
      }

      const recipeDetails = await recipeResponse.json()

      // Then add the recipe to menu items
      const menuResponse = await fetch('http://localhost:5000/api/menu/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipe: recipeDetails })
      })

      if (!menuResponse.ok) {
        throw new Error('Failed to add item to menu')
      }

      // Show success message
      setSuccessMessage(`${suggestion.name} has been added to the menu!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="menu-suggestions">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: 0 }}>Menu Suggestions</h2>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1a237e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          Refresh Suggestions
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          {successMessage}
        </div>
      )}

      {loading && !suggestions.length ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading suggestions...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          padding: '20px'
        }}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', color: '#1a237e' }}>
                {suggestion.name}
              </h3>
              <p style={{ color: '#666', margin: '0 0 12px 0' }}>
                <strong>Cuisine:</strong> {suggestion.cuisine}
              </p>
              <div style={{ marginBottom: '12px' }}>
                <strong>Available Ingredients:</strong>
                <ul style={{ 
                  margin: '8px 0',
                  paddingLeft: '20px',
                  color: '#666'
                }}>
                  {suggestion.availableIngredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #eee'
              }}>
                <div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Cost:</strong> ₹{suggestion.estimatedCost.ingredientsCost}
                  </div>
                  <div style={{ 
                    color: suggestion.estimatedCost.profitMargin >= 60 ? '#2e7d32' : 
                           suggestion.estimatedCost.profitMargin >= 40 ? '#f57c00' : '#c62828'
                  }}>
                    <strong>Profit:</strong> {suggestion.estimatedCost.profitMargin}%
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleViewRecipe(suggestion)}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#1a237e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    View Recipe
                  </button>
                  <button
                    onClick={() => handleAddToMenu(suggestion)}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    Add to Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <ViewRecipe
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToMenu={handleAddToMenu}
        />
      )}
    </div>
  )
}

