// Function to format date
export function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  
  // Function to calculate days until expiry
  export function calculateDaysUntilExpiry(expiryDate) {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = Math.abs(expiry - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  // Function to determine status based on expiry and quantity
  export function determineStatus(expiryDays, quantity, threshold) {
    if (expiryDays <= 1) return "danger"
    if (expiryDays <= 3) return "warning"
    if (quantity < threshold) return "warning"
    return "good"
  }
  
  // Function to calculate profit margin
  export function calculateProfitMargin(cost, price) {
    const profit = price - cost
    const margin = (profit / price) * 100
    return `${margin.toFixed(1)}%`
  }
  
  // Function to format currency
  export function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }
  
  // Function to group data by category
  export function groupByCategory(data, categoryKey) {
    return data.reduce((acc, item) => {
      const category = item[categoryKey]
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    }, {})
  }
  
  // Function to calculate percentage change
  export function calculatePercentageChange(current, previous) {
    const change = ((current - previous) / previous) * 100
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(1)}%`
  }
  
  