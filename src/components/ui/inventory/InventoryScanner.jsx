"use client"

import { useState, useRef } from "react"

export default function InventoryScanner({ onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [detectedItems, setDetectedItems] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [error, setError] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setError(null)
    setIsScanning(true)
    setScanProgress(0)
    setSelectedImage(URL.createObjectURL(file))

    // Create FormData to send the image
    const formData = new FormData()
    formData.append("image", file)

    try {
      // Simulate progress while processing
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => Math.min(prev + 5, 95))
      }, 100)

      // Call the backend API endpoint
      const response = await fetch("http://localhost:5000/api/inventory/scan", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      console.log("Raw API response:", data) // Debug log

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to scan image')
      }

      clearInterval(progressInterval)
      setScanProgress(100)

      if (!data.items || !Array.isArray(data.items)) {
        console.error("Invalid items data:", data)
        throw new Error("Invalid response format: missing or invalid items array")
      }

      // Transform items to match the expected format
      const transformedItems = data.items.map((item) => {
        console.log("Processing item:", item) // Debug individual items
        return {
          id: `scan_${Date.now()}_${item.id}`,
          name: item.name || "Unknown Item",
          quantity: item.quantity || "Unknown quantity",
          category: item.category || "Other",
          expiry: item.expiry || "3 days",
          status: item.status || determineStatus(item.condition),
          confidence: parseFloat(item.confidence) || 0.5,
          condition: item.condition
        }
      })

      console.log("Transformed items:", transformedItems)
      setDetectedItems(transformedItems)
      setIsScanning(false)
    } catch (error) {
      console.error("Error processing image:", error)
      setError(error.message || "Failed to process image")
      setIsScanning(false)
      setScanProgress(0)
    }
  }

  // Helper function to determine status from condition
  const determineStatus = (condition = "") => {
    const condition_lower = condition.toLowerCase()
    if (condition_lower.includes("expired") || condition_lower.includes("bad")) {
      return "danger"
    }
    if (condition_lower.includes("fresh") || condition_lower.includes("new") || condition_lower.includes("good")) {
      return "good"
    }
    return "warning"
  }

  const startScan = () => {
    setError(null)
    fileInputRef.current?.click()
  }

  const completeScan = async () => {
    try {
      setIsAdding(true)
      setError(null)

      // Send items to backend to add to inventory
      const response = await fetch("http://localhost:5000/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(detectedItems)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add items to inventory")
      }

      // Clear the scanned items and image
      setDetectedItems([])
      setSelectedImage(null)
      
      // Notify parent component
      onScanComplete(data)
    } catch (error) {
      console.error("Error adding items to inventory:", error)
      setError(error.message || "Failed to add items to inventory")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="scanner-container">
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleImageUpload} 
        style={{ display: "none" }} 
      />

      {error && (
        <div className="error-message" style={{
          color: "red",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          borderRadius: "4px",
        }}>
          {error}
        </div>
      )}

      <div className="scanner-viewport">
        {!isScanning && !detectedItems.length ? (
          <div className="scanner-placeholder">
            <img
              src="/placeholder.svg?height=300&width=400"
              alt="Camera Viewport"
              width={400}
              height={300}
              className="placeholder-image"
            />
            <div className="scanner-instructions">
              <h3>Ready to Scan Inventory</h3>
              <p>Click below to upload an image of your inventory items</p>
              <p className="upload-requirements" style={{
                fontSize: "0.8rem",
                color: "#666",
                marginBottom: "10px",
              }}>
                Supported formats: JPG, PNG, WebP (max 5MB)
              </p>
              <button className="start-scan-btn" onClick={startScan}>
                Upload Image
              </button>
            </div>
          </div>
        ) : (
          <div className="active-scanner">
            {isScanning ? (
              <>
                {selectedImage && (
                  <div className="image-preview-container" style={{ position: "relative" }}>
                    <img
                      src={selectedImage}
                      alt="Uploaded inventory"
                      className="preview-image"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        opacity: "0.8",
                      }}
                    />
                    <div className="scanning-overlay" style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "rgba(0, 0, 0, 0.5)",
                    }}>
                      <div className="scanning-animation"></div>
                      <div className="scanning-progress" style={{ width: "80%", maxWidth: "300px" }}>
                        <div className="progress-bar" style={{
                          height: "4px",
                          background: "#ddd",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${scanProgress}%`,
                              height: "100%",
                              background: "#4CAF50",
                              transition: "width 0.3s ease",
                            }}
                          ></div>
                        </div>
                        <span className="progress-text" style={{
                          color: "#fff",
                          marginTop: "8px",
                          fontSize: "0.9rem",
                        }}>
                          {scanProgress}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : detectedItems.length > 0 ? (
              <div className="detection-results">
                <h3>Detected Items</h3>
                <ul className="detected-items-list" style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "20px 0",
                }}>
                  {detectedItems.map((item) => (
                    <li key={item.id} className="detected-item" style={{
                      padding: "12px",
                      marginBottom: "8px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <div className="item-details">
                        <div className="item-name" style={{ fontWeight: "bold", marginBottom: "4px" }}>
                          {item.name}
                        </div>
                        <div className="item-info" style={{ color: "#666", fontSize: "0.9rem" }}>
                          <span>{item.quantity}</span>
                          <span style={{ margin: "0 8px" }}>•</span>
                          <span>{item.category}</span>
                          <span style={{ margin: "0 8px" }}>•</span>
                          <span>Expires in: {item.expiry}</span>
                        </div>
                      </div>
                      <div className="confidence-meter" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}>
                        <div className="confidence-bar" style={{
                          width: "60px",
                          height: "4px",
                          backgroundColor: "#ddd",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${item.confidence * 100}%`,
                            height: "100%",
                            backgroundColor: item.confidence > 0.7 ? "#4CAF50" : "#FFC107",
                          }}></div>
                        </div>
                        <span className="confidence-text" style={{
                          fontSize: "0.8rem",
                          color: "#666",
                        }}>
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="detection-actions" style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                }}>
                  <button
                    className="rescan-btn"
                    onClick={startScan}
                    disabled={isAdding}
                    style={{
                      padding: "8px 16px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                    }}
                  >
                    Scan Again
                  </button>
                  <button
                    className="complete-btn"
                    onClick={completeScan}
                    disabled={isAdding}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    {isAdding ? "Adding to Inventory..." : "Add to Inventory"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

