import { useState, useEffect } from 'react';

export default function InventoryStatus() {
  const [inventoryCategories, setInventoryCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventoryStatus();
  }, []);

  const fetchInventoryStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory status');
      }
      const data = await response.json();
      
      // Group items by category and calculate status
      const categoryStats = data.reduce((acc, item) => {
        const category = item.category || 'Other';
        if (!acc[category]) {
          acc[category] = {
            name: category,
            totalItems: 0,
            lowItems: 0,
            expiredItems: 0
          };
        }
        
        acc[category].totalItems++;
        
        // Count items by status
        if (item.status === 'expired') {
          acc[category].expiredItems++;
        } else if (item.status === 'low') {
          acc[category].lowItems++;
        }
        
        return acc;
      }, {});

      // Calculate level and status for each category
      const categories = Object.values(categoryStats).map(category => {
        const totalItems = category.totalItems;
        const lowPercentage = (category.lowItems / totalItems) * 100;
        const expiredPercentage = (category.expiredItems / totalItems) * 100;
        
        // Calculate level (100% - expired% - low%)
        const level = Math.max(0, Math.round(100 - expiredPercentage - (lowPercentage / 2)));
        
        // Determine status
        let status = 'good';
        if (expiredPercentage > 0) {
          status = 'danger';
        } else if (lowPercentage > 30) {
          status = 'warning';
        }

        return {
          name: category.name,
          level,
          status,
          totalItems,
          lowItems: category.lowItems,
          expiredItems: category.expiredItems
        };
      });

      setInventoryCategories(categories);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card inventory-status-card">
        <h2 className="card-title">Inventory Status</h2>
        <div className="loading">Loading inventory status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card inventory-status-card">
        <h2 className="card-title">Inventory Status</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card inventory-status-card">
      <h2 className="card-title">Inventory Status</h2>

      <div className="inventory-categories">
        {inventoryCategories.map((category) => (
          <div key={category.name} className="inventory-category">
            <div className="category-header">
              <span className="category-name">{category.name}</span>
              <span className={`category-status ${category.status}`}>
                {category.level}%
                <span className="item-count">
                  ({category.totalItems} items)
                </span>
              </span>
            </div>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar ${category.status}`} 
                style={{ width: `${category.level}%` }}
              ></div>
            </div>
            <div className="category-details">
              {category.lowItems > 0 && (
                <span className="warning">Low: {category.lowItems}</span>
              )}
              {category.expiredItems > 0 && (
                <span className="danger">Expired: {category.expiredItems}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="inventory-actions">
        <button 
          className="inventory-action-btn" 
          onClick={() => window.location.href = '/inventory'}
        >
          View Details
        </button>
        <button 
          className="inventory-action-btn"
          onClick={fetchInventoryStatus}
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
}
  
  