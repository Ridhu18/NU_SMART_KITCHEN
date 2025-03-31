import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would connect to MongoDB
    // const { db } = await connectToDatabase();
    // const wasteData = await db.collection('waste').find({}).toArray();

    // Mock data for demonstration
    const wasteData = {
      totalWaste: {
        thisWeek: "32.5 kg",
        lastWeek: "38.2 kg",
        change: "-15%",
      },
      wasteByCategory: [
        { category: "Produce", amount: "12.3 kg", percentage: 38 },
        { category: "Meat", amount: "8.7 kg", percentage: 27 },
        { category: "Dairy", amount: "5.2 kg", percentage: 16 },
        { category: "Prepared", amount: "6.3 kg", percentage: 19 },
      ],
      wasteByReason: [
        { reason: "Spoiled", amount: "14.8 kg", percentage: 45 },
        { reason: "Overproduced", amount: "9.2 kg", percentage: 28 },
        { reason: "Expired", amount: "5.5 kg", percentage: 17 },
        { reason: "Customer Return", amount: "3.0 kg", percentage: 10 },
      ],
      financialImpact: {
        totalCost: "$245.80",
        averageCostPerDay: "$35.11",
        projectedAnnualLoss: "$12,740",
      },
      heatmapData: [
        { station: "Prep Station", wastePercentage: 35 },
        { station: "Grill", wastePercentage: 25 },
        { station: "Salad Bar", wastePercentage: 15 },
        { station: "Dessert Station", wastePercentage: 10 },
        { station: "Beverage Station", wastePercentage: 5 },
        { station: "Other", wastePercentage: 10 },
      ],
    }

    return NextResponse.json(wasteData)
  } catch (error) {
    console.error("Error fetching waste data:", error)
    return NextResponse.json({ error: "Failed to fetch waste data" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // In a real app, this would connect to MongoDB
    // const { db } = await connectToDatabase();
    // const result = await db.collection('waste').insertOne(data);

    // Mock response
    return NextResponse.json({ success: true, message: "Waste data added successfully", data }, { status: 201 })
  } catch (error) {
    console.error("Error adding waste data:", error)
    return NextResponse.json({ error: "Failed to add waste data" }, { status: 500 })
  }
}

