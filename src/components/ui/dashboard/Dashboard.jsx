import InventoryStatus from './InventoryStatus';
import RecentActivity from './RecentActivity';
import '../../styles/dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <InventoryStatus />
        </div>
        <div className="dashboard-section">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
} 