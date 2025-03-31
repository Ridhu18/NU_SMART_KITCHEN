import Link from "next/link"
import Image from "next/image"
import DashboardSummary from "@/components/ui/dashboard/DashboardSummary"
import RecentActivity from "@/components/ui/dashboard/RecentActivity"
import WasteMetrics from "@/components/ui/dashboard/WasteMetrics"
import InventoryStatus from "@/components/ui/dashboard/InventoryStatus"

export default function Home() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Smart Kitchen Dashboard</h1>

      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>Welcome to your AI-Powered Kitchen Assistant</h2>
          <p>Monitor inventory, optimize menus, and reduce waste with advanced AI technology</p>
          <Link href="/inventory" className="primary-button">
            Scan Inventory
          </Link>
        </div>
        <div className="welcome-image">
          <Image
            src="/placeholder.svg?height=200&width=300"
            alt="Smart Kitchen"
            width={300}
            height={200}
            className="banner-image"
          />
        </div>
      </div>

      <div className="dashboard-grid">
        <DashboardSummary />
        <InventoryStatus />
        <WasteMetrics />
        <RecentActivity />
      </div>
    </div>
  )
}

