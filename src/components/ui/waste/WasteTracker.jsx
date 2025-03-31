"use client"

import { useState } from "react"

export default function WasteTracker() {
  const [wasteItem, setWasteItem] = useState("")
  const [wasteQuantity, setWasteQuantity] = useState("")
  const [wasteReason, setWasteReason] = useState("")
  const [wasteCategory, setWasteCategory] = useState("")
  const [recentEntries, setRecentEntries] = useState([
    { id: 1, item: "Tomatoes", quantity: "2 kg", reason: "Spoiled", category: "Produce", timestamp: "2 hours ago" },
    { id: 2, item: "Chicken", quantity: "1.5 kg", reason: "Overcooked", category: "Meat", timestamp: "5 hours ago" },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!wasteItem || !wasteQuantity || !wasteReason || !wasteCategory) {
      return
    }

    const newEntry = {
      id: Date.now(),
      item: wasteItem,
      quantity: wasteQuantity,
      reason: wasteReason,
      category: wasteCategory,
      timestamp: "Just now",
    }

    setRecentEntries([newEntry, ...recentEntries])

    // Reset form
    setWasteItem("")
    setWasteQuantity("")
    setWasteReason("")
    setWasteCategory("")
  }

  return (
    <div className="waste-tracker-container">
      <div className="waste-form-container">
        <h3>Log Waste Item</h3>
        <form className="waste-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="wasteItem">Item</label>
              <input
                type="text"
                id="wasteItem"
                value={wasteItem}
                onChange={(e) => setWasteItem(e.target.value)}
                placeholder="Item name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="wasteQuantity">Quantity</label>
              <input
                type="text"
                id="wasteQuantity"
                value={wasteQuantity}
                onChange={(e) => setWasteQuantity(e.target.value)}
                placeholder="e.g. 2 kg"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="wasteCategory">Category</label>
              <select id="wasteCategory" value={wasteCategory} onChange={(e) => setWasteCategory(e.target.value)}>
                <option value="">Select category</option>
                <option value="Produce">Produce</option>
                <option value="Meat">Meat</option>
                <option value="Dairy">Dairy</option>
                <option value="Grains">Grains</option>
                <option value="Prepared">Prepared Food</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="wasteReason">Reason</label>
              <select id="wasteReason" value={wasteReason} onChange={(e) => setWasteReason(e.target.value)}>
                <option value="">Select reason</option>
                <option value="Spoiled">Spoiled</option>
                <option value="Expired">Expired</option>
                <option value="Overproduced">Overproduced</option>
                <option value="Overcooked">Overcooked</option>
                <option value="Customer Return">Customer Return</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-waste-btn">
            Log Waste
          </button>
        </form>
      </div>

      <div className="recent-waste-entries">
        <h3>Recent Entries</h3>
        <ul className="entries-list">
          {recentEntries.map((entry) => (
            <li key={entry.id} className="waste-entry">
              <div className="entry-header">
                <span className="entry-item">{entry.item}</span>
                <span className="entry-timestamp">{entry.timestamp}</span>
              </div>
              <div className="entry-details">
                <span className="entry-quantity">{entry.quantity}</span>
                <span className="entry-category">{entry.category}</span>
                <span className="entry-reason">{entry.reason}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

