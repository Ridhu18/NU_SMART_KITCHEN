import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

// Inventory Components
import InventoryScanner from '../components/ui/inventory/InventoryScanner';
import InventoryList from '../components/ui/inventory/InventoryList';
import ExpiryAlerts from '../components/ui/inventory/ExpiryAlerts';
import StockLevels from '../components/ui/inventory/StockLevels';

function Inventory() {
  const { inventory, loading, addInventoryItem } = useAppContext();
  const [scanMode, setScanMode] = useState(false);
  
  const handleScanComplete = (data) => {
    setScanMode(false);
    
    // Add scanned items to inventory
    data.forEach(item => {
      addInventoryItem(item);
    });
  };
  
  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Smart Inventory Management</h1>
        <button 
          className={`scan-button ${scanMode ? 'active' : ''}`}
          onClick={() => setScanMode(!scanMode)}
        >
          {scanMode ? 'Cancel Scan' : 'Start Scanning'}
        </button>
      </div>
      
      {scanMode ? (
        <InventoryScanner onScanComplete={handleScanComplete} />
      ) : (
        <>
          {/* <div className="inventory-stats">
            <ExpiryAlerts />
            <StockLevels />
          </div> */}
          <InventoryList data={inventory} isLoading={loading.inventory} />
        </>
      )}
    </div>
  );
}

export default Inventory;