import { Inter } from "next/font/google"
import "../styles/globals.css"
import Sidebar from "@/components/shared/Sidebar"
import Header from "@/components/shared/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Smart Kitchen - AI-Powered Waste Minimizer",
  description: "AI-driven system for restaurant owners to enhance kitchen efficiency",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Header />
            <div className="content-wrapper">{children}</div>
          </main>
        </div>
      </body>
    </html>
  )
}

