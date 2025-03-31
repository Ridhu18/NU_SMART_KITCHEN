const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Common Indian ingredient price estimates (in ₹)
const baseIngredientPrices = {
  rice: { unit: 'kg', price: 60 },
  wheat: { unit: 'kg', price: 40 },
  tomatoes: { unit: 'kg', price: 40 },
  onions: { unit: 'kg', price: 30 },
  potatoes: { unit: 'kg', price: 25 },
  chicken: { unit: 'kg', price: 200 },
  mutton: { unit: 'kg', price: 600 },
  paneer: { unit: 'kg', price: 320 },
  milk: { unit: 'liter', price: 60 },
  curd: { unit: 'kg', price: 80 },
  oil: { unit: 'liter', price: 150 },
  butter: { unit: '500g', price: 250 },
  ghee: { unit: 'kg', price: 600 },
  ginger: { unit: 'kg', price: 160 },
  garlic: { unit: 'kg', price: 120 },
  green_chilies: { unit: 'kg', price: 80 },
  coriander: { unit: 'bunch', price: 20 },
  mint: { unit: 'bunch', price: 20 },
  lemon: { unit: 'piece', price: 5 },
  common_spices: { unit: '100g', price: 50 }
};

// Helper function to clean AI response and extract JSON
function extractJsonFromResponse(text) {
  try {
    // Remove any markdown formatting
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Find the first { and last }
    const startIdx = cleanText.indexOf('{');
    const endIdx = cleanText.lastIndexOf('}') + 1;
    
    if (startIdx === -1 || endIdx === 0) {
      throw new Error('No JSON object found in response');
    }
    
    // Extract just the JSON part
    cleanText = cleanText.slice(startIdx, endIdx);
    
    // Parse and return the JSON
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error cleaning response:', error);
    throw new Error('Failed to parse AI response');
  }
}

// Helper function to analyze inventory and suggest dishes
async function analyzeSuggestions(inventory) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a professional chef AI. Given the following inventory items:
${JSON.stringify(inventory, null, 2)}

Generate exactly 6 creative dish suggestions that can be made using these ingredients. For each dish:
1. Consider ingredient quantities and expiry dates
2. Suggest dishes that use ingredients that are close to expiry
3. Include cuisine type and available ingredients
4. Include estimated cost in Indian Rupees (₹)

Respond ONLY with a JSON object in this exact structure, no other text:
{
  "suggestions": [
    {
      "name": "Dish Name",
      "cuisine": "Cuisine Type",
      "availableIngredients": ["ingredient1", "ingredient2"],
      "matchPercentage": 85,
      "estimatedCost": {
        "ingredientsCost": 250,
        "suggestedPrice": 400,
        "profitMargin": 60
      }
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return extractJsonFromResponse(text);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    throw new Error('Failed to generate menu suggestions');
  }
}

// Helper function to generate recipe
async function generateRecipeWithAI(ingredients, cuisine, inventory) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a professional chef AI. Generate a detailed recipe using these ingredients: ${ingredients.join(', ')}
For cuisine type: ${cuisine}
Available inventory: ${JSON.stringify(inventory, null, 2)}

Consider these approximate ingredient prices in Indian Rupees (₹):
${JSON.stringify(baseIngredientPrices, null, 2)}

Respond ONLY with a JSON object in this exact structure, no other text:
{
  "name": "Recipe Name",
  "cuisine": "${cuisine}",
  "servings": 4,
  "ingredients": [
    {
      "name": "Ingredient Name",
      "amount": "Required Amount",
      "estimatedCost": 120
    }
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "cost": {
    "totalIngredients": 450,
    "perServing": 112.50,
    "suggestedSellingPrice": 250,
    "profitMargin": 65,
    "breakdown": {
      "ingredientsCost": "₹450",
      "overheadCost": "₹50",
      "suggestedPrice": "₹250 per serving",
      "monthlyProfit": "₹20,000 (estimated for 100 servings)"
    }
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return extractJsonFromResponse(text);
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe');
  }
}

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  name: String,
  cuisine: String,
  ingredients: [{
    name: String,
    amount: String
  }],
  price: Number,
  profitMargin: Number,
  specialNote: String,
  createdAt: { type: Date, default: Date.now }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Route to get menu suggestions based on inventory
router.post('/suggestions', async (req, res) => {
  try {
    const { inventory } = req.body;
    if (!inventory) {
      return res.status(400).json({ error: 'Inventory data is required' });
    }

    const suggestions = await analyzeSuggestions(inventory);
    res.json(suggestions);
  } catch (error) {
    console.error('Error in POST /suggestions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to generate recipe
router.post('/generate-recipe', async (req, res) => {
  try {
    const { ingredients, cuisine, inventory } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Invalid ingredients data' });
    }
    
    if (!cuisine) {
      return res.status(400).json({ error: 'Cuisine type is required' });
    }

    const recipe = await generateRecipeWithAI(ingredients, cuisine, inventory);
    res.json(recipe);
  } catch (error) {
    console.error('Error in /generate-recipe:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get recipe details
router.post('/recipe-details', async (req, res) => {
  try {
    const { name, cuisine, ingredients } = req.body;
    
    if (!name || !cuisine || !ingredients) {
      return res.status(400).json({ error: 'Missing required recipe information' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a professional chef AI. Generate a detailed recipe for "${name}" (${cuisine} cuisine) using these ingredients: ${ingredients.join(', ')}

Consider these approximate ingredient prices in Indian Rupees (₹):
${JSON.stringify(baseIngredientPrices, null, 2)}

Respond ONLY with a JSON object in this exact structure, no other text:
{
  "name": "${name}",
  "cuisine": "${cuisine}",
  "servings": 4,
  "ingredients": [
    {
      "name": "Ingredient Name",
      "amount": "Required Amount",
      "estimatedCost": 120
    }
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "cost": {
    "totalIngredients": 450,
    "perServing": 112.50,
    "suggestedSellingPrice": 250,
    "profitMargin": 65,
    "breakdown": {
      "ingredientsCost": "₹450",
      "overheadCost": "₹50",
      "suggestedPrice": "₹250 per serving",
      "monthlyProfit": "₹20,000 (estimated for 100 servings)"
    }
  }
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const recipeDetails = extractJsonFromResponse(text);
    
    res.json(recipeDetails);
  } catch (error) {
    console.error('Error in /recipe-details:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get cost analysis
router.post('/cost-analysis', async (req, res) => {
  try {
    const { period } = req.body;
    
    // Get all menu items from database
    const menuItems = await MenuItem.find().sort({ createdAt: -1 });
    
    if (!menuItems.length) {
      return res.json({
        summary: {
          totalRevenue: 0,
          totalProfit: 0,
          totalCosts: 0,
          averageProfitMargin: 0
        },
        recipes: []
      });
    }

    // Calculate summary metrics
    const summary = {
      totalRevenue: 0,
      totalProfit: 0,
      totalCosts: 0,
      averageProfitMargin: 0
    };

    // Process each menu item
    const recipes = menuItems.map(item => {
      // Calculate monthly units based on period
      let monthlyUnits = 100; // Default estimate
      if (period === 'daily') {
        monthlyUnits = 30;
      } else if (period === 'weekly') {
        monthlyUnits = 4;
      }

      // Calculate costs and profits
      const ingredientsCost = item.price / (1 + (item.profitMargin / 100));
      const monthlyRevenue = item.price * monthlyUnits;
      const monthlyCosts = ingredientsCost * monthlyUnits;
      const monthlyProfit = monthlyRevenue - monthlyCosts;

      // Add to summary totals
      summary.totalRevenue += monthlyRevenue;
      summary.totalCosts += monthlyCosts;
      summary.totalProfit += monthlyProfit;

      return {
        name: item.name,
        cuisine: item.cuisine,
        ingredientsCost: Math.round(ingredientsCost),
        sellingPrice: item.price,
        profitMargin: item.profitMargin,
        monthlyUnits: monthlyUnits,
        monthlyProfit: Math.round(monthlyProfit)
      };
    });

    // Calculate average profit margin
    summary.averageProfitMargin = Math.round(
      (summary.totalProfit / summary.totalRevenue) * 100
    );

    // Round all summary values
    summary.totalRevenue = Math.round(summary.totalRevenue);
    summary.totalProfit = Math.round(summary.totalProfit);
    summary.totalCosts = Math.round(summary.totalCosts);

    res.json({
      summary,
      recipes
    });
  } catch (error) {
    console.error('Error in /cost-analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get all menu items
router.get('/items', async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Error in GET /items:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to add a recipe to menu items
router.post('/items', async (req, res) => {
  try {
    const { recipe } = req.body;
    if (!recipe) {
      return res.status(400).json({ error: 'Recipe data is required' });
    }

    const menuItem = new MenuItem({
      name: recipe.name,
      cuisine: recipe.cuisine,
      ingredients: recipe.ingredients.map(ing => ({
        name: ing.name,
        amount: ing.amount
      })),
      price: recipe.cost.suggestedSellingPrice,
      profitMargin: recipe.cost.profitMargin,
      specialNote: recipe.specialNote || ''
    });

    const savedItem = await menuItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error in POST /items:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a menu item
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MenuItem.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /items/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to update a menu item
router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error in PUT /items/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 