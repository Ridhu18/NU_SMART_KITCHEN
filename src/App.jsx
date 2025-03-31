"use client"

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/shared/sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Menu from './pages/Menu';
import Waste from './pages/Wasteanalysis';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import InventoryScanner from "./components/ui/inventory/InventoryScanner"
import InventoryList from "./components/ui/inventory/InventoryList"
import './styles/globals.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Main App Component
function App() {
  const [inventory, setInventory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  const fetchInventory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://localhost:5000/api/inventory")
      if (!response.ok) {
        throw new Error("Failed to fetch inventory")
      }
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      console.error("Error fetching inventory:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleScanComplete = async (newItems) => {
    setIsScanning(false)
    await fetchInventory()
  }

  const handleInventoryUpdate = async (updatedItem) => {
    await fetchInventory()
  }

  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Sidebar />
                    <main className="main-content">
                      <Dashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Sidebar />
                    <main className="main-content">
                      <Inventory />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu"
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Sidebar />
                    <main className="main-content">
                      <Menu />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/waste"
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Sidebar />
                    <main className="main-content">
                      <Waste />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Sidebar />
                    <main className="main-content">
                      <Settings />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App; 