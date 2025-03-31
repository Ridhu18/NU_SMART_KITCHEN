import React, { useState } from 'react'
import MenuSuggestions from '../components/ui/menu/MenuSuggestions'
import RecipeGenerator from '../components/ui/menu/RecipeGenerator'
import MenuItem from '../components/ui/menu/MenuItem'
import CostAnalysis from '../components/ui/menu/CostAnalysis'

export default function Menu() {
  const [activeTab, setActiveTab] = useState('suggestions')

  const tabs = [
    { id: 'suggestions', label: 'Menu Suggestions', icon: '🍽️' },
    { id: 'generator', label: 'Recipe Generator', icon: '📝' },
    { id: 'items', label: 'Menu Items', icon: '📋' },
    { id: 'analysis', label: 'Cost Analysis', icon: '💰' }
  ]

  return (
    <div className="menu-page" style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{
        color: '#1a237e',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span>Menu Management</span>
      </h1>

      <div className="tabs" style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        overflowX: 'auto',
        padding: '4px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeTab === tab.id ? '#1a237e' : '#f5f5f5',
              color: activeTab === tab.id ? 'white' : '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'suggestions' && <MenuSuggestions />}
        {activeTab === 'generator' && <RecipeGenerator />}
        {activeTab === 'items' && <MenuItem />}
        {activeTab === 'analysis' && <CostAnalysis />}
      </div>
    </div>
  )
} 