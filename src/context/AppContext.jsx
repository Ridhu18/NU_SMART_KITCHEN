import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const AppContext = createContext();

// Backend API URL
const API_URL = 'http://localhost:5000/api';

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Global state
  const [inventory, setInventory] = useState([]);
  const [wasteData, setWasteData] = useState([]);
  const [menuSuggestions, setMenuSuggestions] = useState([]);
  const [loading, setLoading] = useState({
    inventory: false,
    waste: false,
    menu: false
  });
  const [error, setError] = useState({
    inventory: null,
    waste: null,
    menu: null
  });

  // Fetch inventory data
  const fetchInventory = async () => {
    setLoading(prev => ({ ...prev, inventory: true }));
    try {
      const response = await fetch(`${API_URL}/inventory`);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
      setError(prev => ({ ...prev, inventory: null }));
    } catch (err) {
      setError(prev => ({ ...prev, inventory: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, inventory: false }));
    }
  };

  // Fetch waste data
  const fetchWasteData = async () => {
    setLoading(prev => ({ ...prev, waste: true }));
    try {
      const response = await fetch(`${API_URL}/waste/data`);
      if (!response.ok) throw new Error('Failed to fetch waste data');
      const data = await response.json();
      setWasteData(data);
      setError(prev => ({ ...prev, waste: null }));
    } catch (err) {
      setError(prev => ({ ...prev, waste: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, waste: false }));
    }
  };

  // Fetch menu suggestions
  const fetchMenuSuggestions = async () => {
    setLoading(prev => ({ ...prev, menu: true }));
    try {
      const response = await fetch(`${API_URL}/menu/suggestions`);
      if (!response.ok) throw new Error('Failed to fetch menu suggestions');
      const data = await response.json();
      setMenuSuggestions(data);
      setError(prev => ({ ...prev, menu: null }));
    } catch (err) {
      setError(prev => ({ ...prev, menu: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, menu: false }));
    }
  };

  // Add inventory item
  const addInventoryItem = async (item) => {
    try {
      const response = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add inventory item');
      }
      
      // Refresh inventory data
      await fetchInventory();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Log waste
  const logWaste = async (wasteItem) => {
    try {
      const response = await fetch(`${API_URL}/waste/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wasteItem),
      });
      
      if (!response.ok) throw new Error('Failed to log waste');
      
      // Refresh waste data
      fetchWasteData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Generate recipe
  const generateRecipe = async (ingredients) => {
    try {
      const response = await fetch(`${API_URL}/menu/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      
      if (!response.ok) throw new Error('Failed to generate recipe');
      
      const recipe = await response.json();
      return { success: true, recipe };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchInventory();
    fetchWasteData();
    fetchMenuSuggestions();
  }, []);

  // Context value
  const value = {
    inventory,
    wasteData,
    menuSuggestions,
    loading,
    error,
    fetchInventory,
    fetchWasteData,
    fetchMenuSuggestions,
    addInventoryItem,
    logWaste,
    generateRecipe
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};