import React, { useState } from 'react';

function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  
  const [settings, setSettings] = useState({
    general: {
      restaurantName: 'My Restaurant',
      location: 'New York, NY',
      timezone: 'America/New_York'
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      dailyReports: true,
      expiryWarnings: true
    },
    integrations: {
      pos: false,
      suppliers: false,
      accounting: false
    },
    appearance: {
      theme: 'light',
      compactView: false
    }
  });
  
  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };
  
  const saveSettings = () => {
    // In a real app, this would save to backend
    alert('Settings saved successfully!');
  };
  
  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      <div className="settings-layout">
        <div className="settings-sidebar">
          <ul className="settings-tabs">
            <li 
              className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </li>
            <li 
              className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </li>
            <li 
              className={`settings-tab ${activeTab === 'integrations' ? 'active' : ''}`}
              onClick={() => setActiveTab('integrations')}
            >
              Integrations
            </li>
            <li 
              className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              Appearance
            </li>
          </ul>
        </div>
        
        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2>General Settings</h2>
              
              <div className="settings-form">
                <div className="form-group">
                  <label>Restaurant Name</label>
                  <input 
                    type="text" 
                    value={settings.general.restaurantName}
                    onChange={(e) => handleSettingChange('general', 'restaurantName', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    value={settings.general.location}
                    onChange={(e) => handleSettingChange('general', 'location', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Timezone</label>
                  <select 
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Settings</h2>
              
              <div className="settings-form">
                <div className="form-group checkbox">
                  <input 
                    type="checkbox" 
                    id="emailAlerts"
                    checked={settings.notifications.emailAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
                  />
                  <label htmlFor="emailAlerts">Email Alerts</label>
                </div>
                
                <div className="form-group checkbox">
                  <input 
                    type="checkbox" 
                    id="pushNotifications"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                  />
                  <label htmlFor="pushNotifications">Push Notifications</label>
                </div>
                
                <div className="form-group checkbox">
                  <input 
                    type="checkbox" 
                    id="dailyReports"
                    checked={settings.notifications.dailyReports}
                    onChange={(e) => handleSettingChange('notifications', 'dailyReports', e.target.checked)}
                  />
                  <label htmlFor="dailyReports">Daily Reports</label>
                </div>
                
                <div className="form-group checkbox">
                  <input 
                    type="checkbox" 
                    id="expiryWarnings"
                    checked={settings.notifications.expiryWarnings}
                    onChange={(e) => handleSettingChange('notifications', 'expiryWarnings', e.target.checked)}
                  />
                  <label htmlFor="expiryWarnings">Expiry Warnings</label>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'integrations' && (
            <div className="settings-section">
              <h2>Integration Settings</h2>
              
              <div className="settings-form">
                <div className="integration-item">
                  <div className="integration-header">
                    <h3>Point of Sale (POS)</h3>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="posToggle"
                        checked={settings.integrations.pos}
                        onChange={(e) => handleSettingChange('integrations', 'pos', e.target.checked)}
                      />
                      <label htmlFor="posToggle"></label>
                    </div>
                  </div>
                  <p>Connect to your POS system to automatically track sales and inventory.</p>
                </div>
                
                <div className="integration-item">
                  <div className="integration-header">
                    <h3>Suppliers</h3>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="suppliersToggle"
                        checked={settings.integrations.suppliers}
                        onChange={(e) => handleSettingChange('integrations', 'suppliers', e.target.checked)}
                      />
                      <label htmlFor="suppliersToggle"></label>
                    </div>
                  </div>
                  <p>Connect to your suppliers for automatic ordering and delivery tracking.</p>
                </div>
                
                <div className="integration-item">
                  <div className="integration-header">
                    <h3>Accounting</h3>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="accountingToggle"
                        checked={settings.integrations.accounting}
                        onChange={(e) => handleSettingChange('integrations', 'accounting', e.target.checked)}
                      />
                      <label htmlFor="accountingToggle"></label>
                    </div>
                  </div>
                  <p>Connect to your accounting software for financial tracking and reporting.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance Settings</h2>
              
              <div className="settings-form">
                <div className="form-group">
                  <label>Theme</label>
                  <div className="theme-options">
                    <div 
                      className={`theme-option ${settings.appearance.theme === 'light' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                    >
                      <div className="theme-preview light-theme"></div>
                      <span>Light</span>
                    </div>
                    <div 
                      className={`theme-option ${settings.appearance.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                    >
                      <div className="theme-preview dark-theme"></div>
                      <span>Dark</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-group checkbox">
                  <input 
                    type="checkbox" 
                    id="compactView"
                    checked={settings.appearance.compactView}
                    onChange={(e) => handleSettingChange('appearance', 'compactView', e.target.checked)}
                  />
                  <label htmlFor="compactView">Compact View</label>
                </div>
              </div>
            </div>
          )}
          
          <div className="settings-actions">
            <button className="save-settings-btn" onClick={saveSettings}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;