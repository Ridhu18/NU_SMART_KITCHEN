"use client"

import { useState } from "react"
import InventoryStats from "./InventoryStats"
import EditItemModal from "./EditItemModal"

export default function InventoryList({ data = [], isLoading = false, onUpdate }) {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [editingItem, setEditingItem] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  if (isLoading) {
    return (
      <div className="inventory-list-container">
        <div className="loading-state">Loading inventory data...</div>
      </div>
    )
  }

  // Filter data
  const filteredData =
    filter === "all"
      ? data
      : data.filter((item) => {
          if (filter === "expiring") return Number.parseInt(item.expiry) <= 3
          if (filter === "lowStock") return item.status === "warning"
          return item.status === filter
        })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name)
    if (sortBy === "expiry") {
      const aExpiry = Number.parseInt(a.expiry)
      const bExpiry = Number.parseInt(b.expiry)
      return aExpiry - bExpiry
    }
    if (sortBy === "category") return a.category.localeCompare(b.category)
    return 0
  })

  const handleEdit = (item) => {
    setEditingItem(item)
  }

  const handleSave = async (updatedItem) => {
    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${editingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })

      if (!response.ok) {
        throw new Error("Failed to update item")
      }

      const updated = await response.json()
      onUpdate && onUpdate(updated)
      setEditingItem(null)
    } catch (error) {
      console.error("Error updating item:", error)
      alert("Failed to update item. Please try again.")
    }
  }

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      onUpdate && onUpdate()
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Failed to delete item. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="inventory-list-container">
      <InventoryStats items={data} />
      
      <div className="inventory-controls">
        <div className="filter-controls">
          <span>Filter by:</span>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === "all" ? "active" : ""}`} 
              onClick={() => setFilter("all")}
              style={{
                padding: "6px 12px",
                marginRight: "8px",
                backgroundColor: filter === "all" ? "#2196F3" : "#fff",
                color: filter === "all" ? "#fff" : "#000",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === "expiring" ? "active" : ""}`}
              onClick={() => setFilter("expiring")}
              style={{
                padding: "6px 12px",
                marginRight: "8px",
                backgroundColor: filter === "expiring" ? "#ff9800" : "#fff",
                color: filter === "expiring" ? "#fff" : "#000",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Expiring Soon
            </button>
            <button
              className={`filter-btn ${filter === "warning" ? "active" : ""}`}
              onClick={() => setFilter("warning")}
              style={{
                padding: "6px 12px",
                marginRight: "8px",
                backgroundColor: filter === "warning" ? "#f44336" : "#fff",
                color: filter === "warning" ? "#fff" : "#000",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Low Stock
            </button>
          </div>
        </div>

        <div className="sort-controls">
          <span>Sort by:</span>
          <select 
            className="sort-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "6px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginLeft: "8px"
            }}
          >
            <option value="name">Name</option>
            <option value="expiry">Expiry Date</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="empty-state" style={{
          textAlign: "center",
          padding: "40px",
          color: "#666"
        }}>
          <p>No inventory items found. Start by scanning some items.</p>
        </div>
      ) : (
        <div className="inventory-table">
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Item</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Quantity</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Expiry</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr 
                  key={item._id} 
                  className={`inventory-row ${item.status}`}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td style={{ padding: "12px" }}>{item.name}</td>
                  <td style={{ padding: "12px" }}>{item.category}</td>
                  <td style={{ padding: "12px" }}>{item.quantity}</td>
                  <td style={{ padding: "12px" }}>{item.expiry}</td>
                  <td style={{ padding: "12px" }}>
                    <span className={`status-badge ${item.status}`} style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      backgroundColor: 
                        item.status === "good" ? "#4caf50" :
                        item.status === "warning" ? "#ff9800" : "#f44336",
                      color: "white"
                    }}>
                      {item.status === "good" && "Good"}
                      {item.status === "warning" && "Low Stock"}
                      {item.status === "danger" && "Expiring Soon"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(item)}
                        disabled={isDeleting}
                        style={{
                          padding: "4px 8px",
                          marginRight: "8px",
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(item._id)}
                        disabled={isDeleting}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  )
}

