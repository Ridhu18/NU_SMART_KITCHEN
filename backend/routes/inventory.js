const express = require("express")
const router = express.Router()
const multer = require("multer")
const { GoogleGenerativeAI } = require("@google/generative-ai")
const fs = require('fs')
const mongoose = require('mongoose')

// Define Inventory Item Schema
const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  category: { type: String, required: true },
  expiry: { type: String, required: true },
  status: { type: String, required: true },
  confidence: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Create the model if it doesn't exist
let InventoryItem;
try {
  InventoryItem = mongoose.model('InventoryItem')
} catch {
  InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema)
}

// Set up multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// Validate API key format
function isValidApiKey(key) {
  return typeof key === 'string' && key.startsWith('AI') && key.length > 10;
}

// Initialize Gemini AI with validation
let genAI;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Checking API key configuration...');
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  
  if (!isValidApiKey(apiKey)) {
    throw new Error('Invalid API key format. Key should start with "AI"');
  }
  
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('✅ Gemini AI initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Gemini AI:', error.message);
}

// POST endpoint for scanning inventory images
router.post("/scan", upload.single("image"), async (req, res) => {
  try {
    // Check if Gemini AI is properly initialized
    if (!genAI) {
      console.error('Gemini AI not initialized');
      return res.status(500).json({
        error: "Gemini API configuration error",
        details: "Please check your GEMINI_API_KEY in the .env file"
      });
    }

    console.log("Received scan request")

    if (!req.file) {
      console.error("No file received in request")
      return res.status(400).json({ error: "No image provided" })
    }

    console.log("File received:", {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    })

    // Get image buffer
    const imageBuffer = req.file.buffer
    
    if (!imageBuffer || imageBuffer.length === 0) {
      console.error("Invalid image buffer")
      return res.status(400).json({ error: "Invalid image data" })
    }

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');

    // Initialize the Gemini model with the new version
    console.log("Initializing Gemini model...")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create prompt for inventory analysis
    const prompt = `Analyze this image of inventory items and provide a JSON array of objects with the following structure for each item:
    {
      "name": "item name",
      "quantity": "estimated quantity with unit",
      "category": "one of: Produce, Meat, Dairy, Grains, Spices, Other",
      "condition": "description of freshness/condition",
      "confidence": "confidence score between 0 and 1"
    }
    
    Focus on food items and kitchen inventory. Be specific with quantities and measurements.
    If expiry/condition cannot be determined from the image, make a reasonable estimate based on the type of item.
    Return ONLY the JSON array, no additional text.`

    try {
      // Generate content from image
      console.log("Sending request to Gemini...")
      const result = await model.generateContent([
        {
          text: prompt
        },
        {
          inlineData: {
            data: base64Image,
            mimeType: req.file.mimetype
          }
        }
      ])
      console.log("Received response from Gemini")
      const response = await result.response
      const text = response.text()

      try {
        // Clean the response text to remove markdown formatting
        const cleanedText = text.replace(/```json\n|\n```/g, '').trim()
        console.log("Cleaned response text:", cleanedText)
        
        // Try to parse the response as JSON
        const parsedItems = JSON.parse(cleanedText)

        // Validate and transform the items
        const items = parsedItems.map((item, index) => {
          const expiry = estimateExpiry(item.condition, item.category);
          const status = determineStatus(item.condition, expiry);
          
          return {
            id: index + 1,
            name: item.name || "Unknown Item",
            quantity: item.quantity || "Unknown quantity",
            category: validateCategory(item.category),
            expiry: expiry,
            confidence: Number.parseFloat(item.confidence) || 0.5,
            status: status,
            condition: item.condition
          };
        })

        console.log("Transformed items:", items) // Debug log
        return res.json({ items })
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError)
        console.error("Raw response:", text)
        return res.status(500).json({
          error: "Failed to parse Gemini response",
          details: parseError.message,
          rawResponse: text
        })
      }
    } catch (geminiError) {
      console.error("Gemini API Error:", geminiError)
      return res.status(500).json({
        error: "Gemini API Error",
        details: geminiError.message
      })
    }
  } catch (error) {
    console.error("Error processing image:", error)
    return res.status(500).json({
      error: "Failed to process image",
      details: error.message,
    })
  }
})

// Helper function to validate category
function validateCategory(category) {
  const validCategories = ["Produce", "Meat", "Dairy", "Grains", "Spices", "Other"]
  return validCategories.includes(category) ? category : "Other"
}

// Helper function to determine status based on condition and expiry
function determineStatus(condition = "", expiry = "") {
  const condition_lower = condition.toLowerCase();
  const expiryDays = parseInt(expiry) || 0;

  // First check expiry days
  if (expiryDays <= 0) {
    return "expired";
  } else if (expiryDays <= 7) {
    return "low";
  }

  // Then check condition
  if (condition_lower.includes("expired") || condition_lower.includes("bad") || condition_lower.includes("rotten")) {
    return "expired";
  }

  if (condition_lower.includes("fresh") || condition_lower.includes("new")) {
    return "good";
  }

  if (condition_lower.includes("good")) {
    return "good";
  }

  // Default status based on expiry days
  return expiryDays <= 7 ? "low" : "good";
}

// Helper function to estimate expiry based on condition and category
function estimateExpiry(condition = "", category = "") {
  const condition_lower = condition.toLowerCase();
  const category_lower = category.toLowerCase();

  // If condition indicates expiry
  if (condition_lower.includes("expired") || condition_lower.includes("bad") || condition_lower.includes("rotten")) {
    return "0 days";
  }

  // Category-specific expiry estimates
  if (category_lower.includes("meat") || category_lower.includes("dairy")) {
    if (condition_lower.includes("fresh")) {
      return "3 days";
    }
    return "1 days";
  }

  if (category_lower.includes("produce")) {
    if (condition_lower.includes("fresh")) {
      return "5 days";
    }
    return "2 days";
  }

  if (category_lower.includes("grains") || category_lower.includes("spices")) {
    if (condition_lower.includes("fresh")) {
      return "30 days";
    }
    return "15 days";
  }

  // Default expiry estimation
  if (condition_lower.includes("fresh")) {
    return "7 days";
  }

  if (condition_lower.includes("good")) {
    return "5 days";
  }

  return "3 days";
}

// GET endpoint to fetch all inventory items
router.get("/", async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST add new inventory items
router.post("/", async (req, res) => {
  try {
    const items = req.body
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Expected an array of items" })
    }

    console.log("Adding items to inventory:", items)

    // Transform items to match schema
    const itemsToAdd = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      expiry: item.expiry,
      status: item.status,
      confidence: item.confidence
    }))

    // Add items to database
    const savedItems = await InventoryItem.insertMany(itemsToAdd)
    console.log("Successfully added items to inventory:", savedItems)

    res.json(savedItems)
  } catch (error) {
    console.error("Error adding items to inventory:", error)
    res.status(500).json({ 
      error: "Failed to add items to inventory",
      details: error.message 
    })
  }
})

// DELETE an inventory item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const deletedItem = await InventoryItem.findByIdAndDelete(id)
    
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" })
    }
    
    res.json({ message: "Item deleted successfully" })
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    res.status(500).json({ error: "Failed to delete inventory item" })
  }
})

// PUT route to update an inventory item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If expiry days are being updated, recalculate status
    if (updates.expiryDays !== undefined) {
      const currentDate = new Date();
      const expiryDate = new Date(currentDate.getTime() + (updates.expiryDays * 24 * 60 * 60 * 1000));
      
      // Calculate days until expiry
      const daysUntilExpiry = Math.ceil((expiryDate - currentDate) / (24 * 60 * 60 * 1000));
      
      // Update status based on days until expiry
      if (daysUntilExpiry <= 0) {
        updates.status = 'expired';
      } else if (daysUntilExpiry <= 7) {
        updates.status = 'low';
      } else {
        updates.status = 'good';
      }
    }

    const updatedItem = await InventoryItem.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router

