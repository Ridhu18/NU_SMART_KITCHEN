import React, { useState, useEffect } from 'react'

export default function MenuItem() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '₹0.00'
    return `₹${value.toFixed(2)}`
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('http://localhost:5000/api/menu/items')
      if (!response.ok) {
        throw new Error('Failed to fetch menu items')
      }

      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item from the menu?')) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/menu/items/${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete menu item')
      }

      setMenuItems(prev => prev.filter(item => item._id !== itemId))
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(menuItems.map(item => item.cuisine))]

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.cuisine === selectedCategory)

  return (
    <div className="menu-items">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: 0 }}>Menu Items</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={fetchMenuItems}
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading menu items...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {filteredItems.map((item) => (
            <div 
              key={item._id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <h3 style={{ 
                  margin: 0,
                  color: '#1a237e'
                }}>
                  {item.name}
                </h3>
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c62828',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: '1.2rem'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ 
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '12px'
              }}>
                <strong>Cuisine:</strong> {item.cuisine}
              </div>

              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <strong>Ingredients:</strong>
                <ul style={{ 
                  margin: '8px 0',
                  paddingLeft: '20px'
                }}>
                  {item.ingredients.map((ingredient, i) => (
                    <li key={i}>
                      {ingredient.name} ({ingredient.amount})
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #eee'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span>Price:</span>
                  <strong>{formatCurrency(item.price)}</strong>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Profit Margin:</span>
                  <span style={{ 
                    color: item.profitMargin >= 60 ? '#2e7d32' : item.profitMargin >= 40 ? '#f57c00' : '#c62828'
                  }}>
                    {item.profitMargin}%
                  </span>
                </div>
              </div>

              {item.specialNote && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px',
                  backgroundColor: '#fff3e0',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: '#e65100'
                }}>
                  {item.specialNote}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 