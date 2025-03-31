import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

// Menu Components
import MenuSuggestions from '../components/ui/menu/MenuSuggestions';
import RecipeGenerator from '../components/ui/menu/RecipeGenerator';
import CostAnalysis from '../components/ui/menu/CostAnalysis';
import MenuCalendar from '../components/ui/menu/MenuCalendar';

function MenuOptimization() {
  const { inventory, menuSuggestions, loading, generateRecipe } = useAppContext();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  return (
    <div className="menu-optimization-container">
      <h1>Menu Optimization</h1>
      
      <div className="menu-grid">
        <div className="menu-section">
          <h2>AI-Suggested Specials</h2>
          <p className="section-description">
            Based on your current inventory and expiry dates
          </p>
          <MenuSuggestions 
            suggestions={menuSuggestions} 
            onSelectRecipe={setSelectedRecipe}
            isLoading={loading.menu}
          />
        </div>
        
        <div className="menu-section">
          <h2>Recipe Generator</h2>
          <p className="section-description">
            Create new recipes from available ingredients
          </p>
          <RecipeGenerator 
            inventory={inventory} 
            selectedRecipe={selectedRecipe}
            onGenerateRecipe={generateRecipe}
          />
        </div>
        
        <div className="menu-section">
          <h2>Cost Analysis</h2>
          <CostAnalysis />
        </div>
        
        <div className="menu-section">
          <h2>Menu Calendar</h2>
          <MenuCalendar />
        </div>
      </div>
    </div>
  );
}

export default MenuOptimization;