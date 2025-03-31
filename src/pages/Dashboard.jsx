import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// Dashboard Components
import DashboardSummary from '../components/ui/dashboard/DashboardSummary';
import RecentActivity from '../components/ui/dashboard/RecentActivity';
import WasteMetrics from '../components/ui/dashboard/WasteMetrics';
import InventoryStatus from '../components/ui/dashboard/InventoryStatus';

function Dashboard() {
  const { loading } = useAppContext();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Smart Kitchen Dashboard</h1>
      
      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>Welcome to your AI-Powered Kitchen Assistant</h2>
          <p>Monitor inventory, optimize menus, and reduce waste with advanced AI technology</p>
          <Link to="/inventory" className="primary-button">
            Scan Inventory
          </Link>
        </div>
        <div className="welcome-image">
          <img 
            src="/placeholder.svg?height=200&width=300" 
            alt="Smart Kitchen" 
            width={300} 
            height={200} 
            className="banner-image"
          />
        </div>
      </div>
      
      <div className="dashboard-grid">
        <DashboardSummary />
        <InventoryStatus />
        <WasteMetrics />
        <RecentActivity />
      </div>
    </div>
  );
}

export default Dashboard;