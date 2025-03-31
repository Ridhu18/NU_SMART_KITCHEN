// Load environment variables first
require('dotenv').config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const authRoutes = require("./routes/auth")
const inventoryRoutes = require("./routes/inventory")
const menuRoutes = require('./routes/menu')

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// MongoDB Connection with better error handling
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully")
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
    process.exit(1) // Exit if cannot connect to database
  })

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...')
})

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected')
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use('/api/menu', menuRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 5000

// Check if Gemini API key is configured
console.log('Checking API key configuration...')
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in .env file')
  process.exit(1)
}
console.log('✅ Gemini AI initialized successfully')

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Not set',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set'
  })
})

