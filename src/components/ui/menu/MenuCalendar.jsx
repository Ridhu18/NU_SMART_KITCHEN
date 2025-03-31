"use client"

import { useState } from "react"

export default function MenuCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Sample menu data
  const menuData = {
    specials: [
      { date: "2023-06-15", name: "Pasta Primavera" },
      { date: "2023-06-16", name: "Grilled Salmon" },
      { date: "2023-06-17", name: "Weekend BBQ Special" },
      { date: "2023-06-18", name: "Weekend BBQ Special" },
      { date: "2023-06-22", name: "Chef's Surprise" },
      { date: "2023-06-25", name: "Seafood Platter" },
    ],
  }

  // Generate calendar days
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const hasSpecial = menuData.specials.find((special) => special.date === dateStr)

      days.push(
        <div key={day} className={`calendar-day ${hasSpecial ? "has-special" : ""}`}>
          <span className="day-number">{day}</span>
          {hasSpecial && (
            <div className="day-special">
              <span className="special-name">{hasSpecial.name}</span>
            </div>
          )}
        </div>,
      )
    }

    return (
      <>
        <div className="calendar-header">
          <button
            className="month-nav prev"
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11)
                setCurrentYear(currentYear - 1)
              } else {
                setCurrentMonth(currentMonth - 1)
              }
            }}
          >
            &lt;
          </button>
          <h3 className="current-month">
            {monthName} {currentYear}
          </h3>
          <button
            className="month-nav next"
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0)
                setCurrentYear(currentYear + 1)
              } else {
                setCurrentMonth(currentMonth + 1)
              }
            }}
          >
            &gt;
          </button>
        </div>
        <div className="weekday-header">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
        </div>
        <div className="calendar-grid">{days}</div>
      </>
    )
  }

  return (
    <div className="menu-calendar-container">
      {renderCalendar()}

      <div className="calendar-actions">
        <button className="add-special-btn">Add Special</button>
        <button className="view-all-btn">View All Specials</button>
      </div>
    </div>
  )
}

