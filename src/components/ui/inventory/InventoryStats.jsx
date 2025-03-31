import React from 'react'

export default function InventoryStats({ items = [] }) {
  // Calculate statistics
  const stats = {
    expiringSoon: items.filter(item => {
      const daysToExpiry = parseInt(item.expiry);
      return daysToExpiry > 0 && daysToExpiry <= 3;
    }).length,
    expired: items.filter(item => parseInt(item.expiry) <= 0).length,
    totalItems: items.length,
    lowStock: items.filter(item => item.status === "warning").length,
    outOfStock: items.filter(item => item.quantity === "0" || item.quantity.toLowerCase().includes("out of stock")).length,
    recentlyAdded: items.filter(item => {
      const addedDate = new Date(item.createdAt);
      const now = new Date();
      const daysDiff = (now - addedDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length
  };

  // Get categories at risk (categories with items expiring soon)
  const categoriesAtRisk = [...new Set(
    items
      .filter(item => parseInt(item.expiry) <= 3)
      .map(item => item.category)
  )];

  return (
    <div className="inventory-stats" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
      {/* Expiry Alerts Section */}
      <div className="stats-section" style={{
        flex: 1,
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Expiry Alerts</h2>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              color: '#ff9800',
              fontWeight: 'bold' 
            }}>
              {stats.expiringSoon}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Expiring Soon</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              color: '#f44336',
              fontWeight: 'bold'  
            }}>
              {stats.expired}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Expired</div>
          </div>
        </div>
        <div style={{ marginTop: '15px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>Categories at Risk</h3>
          {categoriesAtRisk.length > 0 ? (
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              margin: 0,
              color: '#666'
            }}>
              {categoriesAtRisk.map(category => (
                <li key={category} style={{ marginBottom: '5px' }}>• {category}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>No categories at risk</p>
          )}
        </div>
      </div>

      {/* Stock Levels Section */}
      <div className="stats-section" style={{
        flex: 1,
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Stock Levels</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '15px'
        }}>
          <div style={{ 
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {stats.totalItems}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Items</div>
          </div>
          <div style={{ 
            padding: '15px',
            backgroundColor: '#fff3e0',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#ff9800'
            }}>
              {stats.lowStock}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Low Stock</div>
          </div>
          <div style={{ 
            padding: '15px',
            backgroundColor: '#ffebee',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#f44336'
            }}>
              {stats.outOfStock}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Out of Stock</div>
          </div>
          <div style={{ 
            padding: '15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#4caf50'
            }}>
              {stats.recentlyAdded}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Recently Added</div>
          </div>
        </div>
        <button 
          onClick={() => window.location.href = '/order-supplies'}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Order Supplies
        </button>
      </div>
    </div>
  )
} 