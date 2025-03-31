"use client"

import { useState } from "react"

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, message: "Tomatoes are about to expire in 2 days", type: "warning" },
    { id: 2, message: "Milk stock is running low", type: "alert" },
    { id: 3, message: "New menu suggestions available", type: "info" },
  ]

  return (
    <header className="app-header">
      <div className="search-container">
        <input type="text" placeholder="Search inventory, recipes..." className="search-input" />
        <button className="search-button">🔍</button>
      </div>

      <div className="header-actions">
        <div className="notification-container">
          <button className="notification-button" onClick={() => setShowNotifications(!showNotifications)}>
            🔔<span className="notification-badge">{notifications.length}</span>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <h3>Notifications</h3>
              <ul className="notification-list">
                {notifications.map((notification) => (
                  <li key={notification.id} className={`notification-item ${notification.type}`}>
                    {notification.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button className="help-button">❓</button>
      </div>
    </header>
  )
}

