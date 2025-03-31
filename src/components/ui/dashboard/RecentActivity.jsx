import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      // Fetch activities from different endpoints
      const [menuResponse, inventoryResponse] = await Promise.all([
        fetch('http://localhost:5000/api/menu/items'),
        fetch('http://localhost:5000/api/inventory')
      ]);

      if (!menuResponse.ok || !inventoryResponse.ok) {
        throw new Error('Failed to fetch activities');
      }

      const menuData = await menuResponse.json();
      const inventoryData = await inventoryResponse.json();

      // Process menu items
      const menuActivities = menuData.map(item => ({
        id: `menu-${item._id}`,
        type: 'menu_addition',
        title: `Added "${item.name}" to menu`,
        description: `New ${item.cuisine} dish added with ${item.profitMargin}% profit margin`,
        timestamp: new Date(item.createdAt),
        status: 'success'
      }));

      // Process inventory alerts
      const inventoryActivities = inventoryData
        .filter(item => item.status === 'low' || item.status === 'expired')
        .map(item => ({
          id: `inventory-${item._id}`,
          type: 'inventory_alert',
          title: item.status === 'low' ? 'Low Stock Alert' : 'Expiry Alert',
          description: `${item.name} is ${item.status === 'low' ? 'running low' : 'expired'} (${item.quantity} remaining)`,
          timestamp: new Date(item.updatedAt),
          status: item.status === 'low' ? 'warning' : 'danger'
        }));

      // Combine and sort activities
      const allActivities = [...menuActivities, ...inventoryActivities]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10); // Keep only the 10 most recent activities

      setActivities(allActivities);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'menu_addition':
        return '🍽️';
      case 'inventory_alert':
        return '⚠️';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card recent-activity-card">
        <h2 className="card-title">Recent Activity</h2>
        <div className="loading">Loading activities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card recent-activity-card">
        <h2 className="card-title">Recent Activity</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card recent-activity-card">
      <h2 className="card-title">Recent Activity</h2>
      
      <div className="activity-list">
        {activities.length === 0 ? (
          <div className="no-activity">No recent activities</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <h3 className={`activity-title ${getStatusColor(activity.status)}`}>
                    {activity.title}
                  </h3>
                  <span className="activity-time">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="activity-description">{activity.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="activity-actions">
        <button 
          className="activity-action-btn"
          onClick={fetchRecentActivities}
        >
          Refresh Activities
        </button>
      </div>
    </div>
  );
}
  
  