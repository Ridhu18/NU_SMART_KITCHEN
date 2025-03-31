import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/inventory', icon: '📦', label: 'Inventory' },
    { path: '/menu', icon: '🍽️', label: 'Menu' },
    { path: '/waste', icon: '🗑️', label: 'Waste' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{
      width: collapsed ? '80px' : '250px',
      height: '100vh',
      backgroundColor: '#1a237e',
      color: 'white',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease'
    }}>
      <div className="sidebar-header" style={{
        padding: '0 20px',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="logo-container">
          {!collapsed && <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Nirma</span>}
          {collapsed && <span className="logo-icon" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>N</span>}
        </div>
        <button 
          className="collapse-btn" 
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '8px' }}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  color: 'white',
                  backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <span className="nav-icon" style={{ marginRight: collapsed ? 0 : '12px', fontSize: '1.2rem' }}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer" style={{
        padding: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {!collapsed && (
          <div className="user-info" style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <img 
              src="/placeholder.svg?height=40&width=40" 
              alt="User" 
              width={40} 
              height={40} 
              className="user-avatar"
              style={{
                borderRadius: '50%',
                marginRight: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />
            <div className="user-details">
              <span className="user-name" style={{ 
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {user?.username}
              </span>
              <span className="user-role" style={{
                display: 'block',
                fontSize: '0.8rem',
                opacity: 0.7
              }}>
                {user?.email}
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="user-icon-only" style={{ textAlign: 'center', marginBottom: '15px' }}>
            <img 
              src="/placeholder.svg?height=30&width=30" 
              alt="User" 
              width={30} 
              height={30} 
              className="user-avatar-small"
              style={{
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>
        )}
        <button
          onClick={handleLogout}
          className="logout-btn"
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease'
          }}
        >
          {!collapsed ? 'Logout' : '🚪'}
        </button>
      </div>
    </aside>
  );
}