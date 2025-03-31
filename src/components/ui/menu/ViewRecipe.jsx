import React from 'react'

export default function ViewRecipe({ recipe, onClose }) {
  // Helper function to safely format currency
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '₹0.00'
    return `₹${value.toFixed(2)}`
  }

  if (!recipe) return null

  return (
    <div className="view-recipe-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>

        <h2 style={{ color: '#1a237e', marginTop: 0, paddingRight: '32px' }}>
          {recipe.name}
        </h2>

        <div style={{ color: '#666', marginBottom: '20px' }}>
          <strong>Cuisine:</strong> {recipe.cuisine}
          {recipe.servings && (
            <span style={{ marginLeft: '16px' }}>
              <strong>Servings:</strong> {recipe.servings}
            </span>
          )}
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ color: '#1a237e' }}>Ingredients</h3>
          <ul style={{ 
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '12px'
          }}>
            {recipe.ingredients.map((ingredient, index) => (
              <li 
                key={index}
                style={{
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{ingredient.name}</div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>{ingredient.amount}</div>
                </div>
                {ingredient.estimatedCost && (
                  <div style={{ color: '#2e7d32' }}>
                    {formatCurrency(ingredient.estimatedCost)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ color: '#1a237e' }}>Instructions</h3>
          <ol style={{ 
            paddingLeft: '24px',
            lineHeight: '1.6'
          }}>
            {recipe.instructions.map((step, index) => (
              <li key={index} style={{ marginBottom: '16px' }}>
                {step}
              </li>
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
              marginTop: '16px'
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
              <div style={{ 
                marginTop: '16px',
                fontSize: '0.9em',
                color: '#2e7d32',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '8px'
              }}>
                <div>Ingredients Cost: {recipe.cost.breakdown.ingredientsCost || '₹0'}</div>
                <div>Overhead Cost: {recipe.cost.breakdown.overheadCost || '₹0'}</div>
                <div>Suggested Price: {recipe.cost.breakdown.suggestedPrice || '₹0'}</div>
                <div>Monthly Profit: {recipe.cost.breakdown.monthlyProfit || '₹0'}</div>
              </div>
            )}
          </div>
        )}

        <div style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f5f5f5',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
          <button
            onClick={() => {
              // TODO: Implement add to menu functionality
              alert('Recipe added to menu!')
              onClose()
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1a237e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add to Menu
          </button>
        </div>
      </div>
    </div>
  )
} 