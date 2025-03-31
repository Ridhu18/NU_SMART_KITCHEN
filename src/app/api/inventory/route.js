import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Fetch inventory items from the database
    const inventory = await db.collection("inventory").find({}).toArray()

    return NextResponse.json(inventory)
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory data" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const item = await request.json()

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Add the item to the inventory collection
    const result = await db.collection("inventory").insertOne({
      ...item,
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Inventory item added successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding inventory item:", error)
    return NextResponse.json({ error: "Failed to add inventory item" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Delete the item from the inventory collection
    await db.collection("inventory").deleteOne({ _id: id })

    return NextResponse.json({
      success: true,
      message: "Inventory item deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const item = await request.json()

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Update the item in the inventory collection
    await db.collection("inventory").updateOne({ _id: item._id }, { $set: item })

    return NextResponse.json({
      success: true,
      message: "Inventory item updated successfully",
    })
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 })
  }
}

