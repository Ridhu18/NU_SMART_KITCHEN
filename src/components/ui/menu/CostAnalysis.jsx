import React, { useState, useEffect } from 'react'

export default function CostAnalysis() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('daily')
  const [costSummary, setCostSummary] = useState(null)

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '₹0.00'
    return `₹${value.toFixed(2)}`
  }

  useEffect(() => {
    fetchCostAnalysis()
  }, [selectedPeriod])

  const fetchCostAnalysis = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('http://localhost:5000/api/menu/cost-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ period: selectedPeriod })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch cost analysis')
      }

      const data = await response.json()
      setRecipes(data.recipes)
      setCostSummary(data.summary)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cost-analysis">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: 0 }}>Cost Analysis</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={fetchCostAnalysis}
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
            Refresh
          </button>
        </div>
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

      {costSummary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#1565c0' }}>Total Revenue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1565c0' }}>
              {formatCurrency(costSummary.totalRevenue)}
            </div>
          </div>
          <div style={{
            backgroundColor: '#e8f5e9',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#2e7d32' }}>Total Profit</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
              {formatCurrency(costSummary.totalProfit)}
            </div>
          </div>
          <div style={{
            backgroundColor: '#fff3e0',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#e65100' }}>Total Costs</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e65100' }}>
              {formatCurrency(costSummary.totalCosts)}
            </div>
          </div>
          <div style={{
            backgroundColor: '#f3e5f5',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#6a1b9a' }}>Average Profit Margin</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6a1b9a' }}>
              {costSummary.averageProfitMargin}%
            </div>
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Recipe Cost Breakdown</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Recipe</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Ingredients Cost</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Selling Price</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Profit Margin</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Monthly Units</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Monthly Profit</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe, index) => (
                <tr 
                  key={index}
                  style={{ 
                    borderBottom: '1px solid #eee',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafafa'
                  }}
                >
                  <td style={{ padding: '12px' }}>{recipe.name}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(recipe.ingredientsCost)}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(recipe.sellingPrice)}</td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'right',
                    color: recipe.profitMargin >= 60 ? '#2e7d32' : recipe.profitMargin >= 40 ? '#f57c00' : '#c62828'
                  }}>
                    {recipe.profitMargin}%
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{recipe.monthlyUnits}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#2e7d32' }}>
                    {formatCurrency(recipe.monthlyProfit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
  
  