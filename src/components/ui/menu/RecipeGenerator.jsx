"use client"

import React, { useState, useEffect } from 'react'

export default function RecipeGenerator() {
  const [inventory, setInventory] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recipe, setRecipe] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const cuisineTypes = [
    'Indian - Punjabi',
    'Indian - Gujarati',
    'Korean',
    'Chinese',
    'Italian',
    'Mexican',
    'Thai',
    'Japanese'
  ]

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory')
      if (!response.ok) {
        throw new Error('Failed to fetch inventory')
      }
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to load inventory items')
    }
  }

  const handleIngredientToggle = (ingredient) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient.name)) {
        return prev.filter(i => i !== ingredient.name)
      }
      return [...prev, ingredient.name]
    })
  }

  const generateRecipe = async () => {
    if (!selectedCuisine || selectedIngredients.length === 0) {
      setError('Please select cuisine type and at least one ingredient')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('http://localhost:5000/api/menu/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          cuisine: selectedCuisine,
          inventory: inventory
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate recipe')
      }

      const data = await response.json()
      setRecipe(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToMenu = async () => {
    if (!recipe) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/menu/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipe: recipe })
      });

      if (!response.ok) {
        throw new Error('Failed to add recipe to menu');
      }

      setSuccessMessage(`${recipe.name} has been added to the menu!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '₹0.00'
    return `₹${value.toFixed(2)}`
  }

  return (
    <div className="recipe-generator">
      <div style={{ marginBottom: '24px' }}>
        <h2>Recipe Generator</h2>
        <p style={{ color: '#666' }}>
          Select ingredients from your inventory and choose a cuisine type to generate a recipe
        </p>
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

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        <div>
          <h3>Available Ingredients</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '8px',
            marginTop: '12px'
          }}>
            {inventory.map((item) => (
              <label
                key={item._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  backgroundColor: selectedIngredients.includes(item.name) ? '#e3f2fd' : '#f5f5f5',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(item.name)}
                  onChange={() => handleIngredientToggle(item)}
                  style={{ marginRight: '8px' }}
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3>Select Cuisine Type</h3>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="">Select cuisine...</option>
            {cuisineTypes.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>

          <button
            onClick={generateRecipe}
            disabled={loading || !selectedCuisine || selectedIngredients.length === 0}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1a237e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginTop: '20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading || !selectedCuisine || selectedIngredients.length === 0 ? 0.7 : 1
            }}
          >
            {loading ? 'Generating Recipe...' : 'Generate Recipe'}
          </button>
        </div>
      </div>

      {recipe && (
        <div style={{
          marginTop: '32px',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1a237e', marginTop: 0 }}>{recipe.name}</h2>
          
          <div style={{ marginTop: '20px' }}>
            <h3>Ingredients</h3>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '8px'
            }}>
              {recipe.ingredients.map((ingredient, index) => (
                <li 
                  key={index}
                  style={{
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{ingredient.name}</span>
                  <div>
                    <span>{ingredient.amount}</span>
                    {ingredient.estimatedCost && (
                      <span style={{ marginLeft: '8px', color: '#666' }}>
                        ({formatCurrency(ingredient.estimatedCost)})
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Instructions</h3>
            <ol style={{ 
              paddingLeft: '20px',
              lineHeight: '1.6'
            }}>
              {recipe.instructions.map((step, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>{step}</li>
              ))}
            </ol>
          </div>

          {recipe.cost && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#e8f5e9',
              borderRadius: '4px'
            }}>
              <h3 style={{ margin: 0, color: '#2e7d32' }}>Cost Analysis</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '12px'
              }}>
                <div>
                  <strong>Total Ingredients:</strong> {formatCurrency(recipe.cost.totalIngredients || 0)}
                </div>
                <div>
                  <strong>Cost Per Serving:</strong> {formatCurrency(recipe.cost.perServing || 0)}
                </div>
                <div>
                  <strong>Suggested Price:</strong> {formatCurrency(recipe.cost.suggestedSellingPrice || 0)}
                </div>
                <div>
                  <strong>Profit Margin:</strong> {recipe.cost.profitMargin || 0}%
                </div>
              </div>

              {recipe.cost.breakdown && (
                <div style={{ marginTop: '16px', fontSize: '0.9em', color: '#2e7d32' }}>
                  <div>Ingredients Cost: {recipe.cost.breakdown.ingredientsCost || '₹0'}</div>
                  <div>Overhead Cost: {recipe.cost.breakdown.overheadCost || '₹0'}</div>
                  <div>Suggested Price: {recipe.cost.breakdown.suggestedPrice || '₹0'}</div>
                  <div>Monthly Profit: {recipe.cost.breakdown.monthlyProfit || '₹0'}</div>
                </div>
              )}
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: '20px'
          }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#1a237e' }}>
                {recipe.name}
              </h3>
              <p style={{ margin: '0', color: '#666' }}>
                <strong>Cuisine:</strong> {recipe.cuisine} | 
                <strong> Servings:</strong> {recipe.servings}
              </p>
            </div>
            <button
              onClick={handleAddToMenu}
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
              Add to Menu
            </button>
          </div>
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
    </div>
  )
}

