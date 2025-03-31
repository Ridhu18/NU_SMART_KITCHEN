import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const imageFile = formData.get('image')

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Convert file to bytes for Gemini
    const imageBytes = await imageFile.arrayBuffer()

    // Initialize the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

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

    // Generate content from image
    const result = await model.generateContent([prompt, imageBytes])
    const response = await result.response
    const text = response.text()

    try {
      // Try to parse the response as JSON
      const parsedItems = JSON.parse(text)
      
      // Validate and transform the items
      const items = parsedItems.map((item, index) => ({
        id: index + 1,
        name: item.name || 'Unknown Item',
        quantity: item.quantity || 'Unknown quantity',
        category: validateCategory(item.category),
        expiry: estimateExpiry(item.condition),
        confidence: parseFloat(item.confidence) || 0.5
      }))

      return NextResponse.json({ items })
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError)
      // Fallback to text parsing if JSON parsing fails
      const items = parseTextResponse(text)
      return NextResponse.json({ items })
    }
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Failed to process image', details: error.message },
      { status: 500 }
    )
  }
}

// Helper function to validate category
function validateCategory(category) {
  const validCategories = ['Produce', 'Meat', 'Dairy', 'Grains', 'Spices', 'Other']
  return validCategories.includes(category) ? category : 'Other'
}

// Helper function to estimate expiry based on condition
function estimateExpiry(condition = '') {
  const condition_lower = condition.toLowerCase()
  
  if (condition_lower.includes('expired') || condition_lower.includes('bad')) {
    return '0 days'
  }
  
  if (condition_lower.includes('fresh') || condition_lower.includes('new')) {
    return '7 days'
  }
  
  if (condition_lower.includes('good')) {
    return '5 days'
  }
  
  // Default expiry estimation based on common food items
  return '3 days'
}

// Fallback function to parse text response if JSON parsing fails
function parseTextResponse(text) {
  const lines = text.split('\n')
  const items = []
  let currentItem = {}

  for (const line of lines) {
    if (line.includes('name:') || line.includes('Name:')) {
      // If we were building an item, save it
      if (currentItem.name) {
        items.push(currentItem)
      }
      currentItem = {
        id: items.length + 1,
        name: line.split(':')[1].trim(),
        confidence: 0.7
      }
    } else if (line.includes('quantity:') || line.includes('Quantity:')) {
      currentItem.quantity = line.split(':')[1].trim()
    } else if (line.includes('category:') || line.includes('Category:')) {
      currentItem.category = validateCategory(line.split(':')[1].trim())
    } else if (line.includes('condition:') || line.includes('Condition:')) {
      const condition = line.split(':')[1].trim()
      currentItem.expiry = estimateExpiry(condition)
    }
  }

  // Add the last item if exists
  if (currentItem.name) {
    items.push(currentItem)
  }

  return items.length > 0 ? items : [{
    id: 1,
    name: "Unrecognized Item",
    quantity: "Unknown quantity",
    expiry: "3 days",
    confidence: 0.5,
    category: "Other"
  }]
} 