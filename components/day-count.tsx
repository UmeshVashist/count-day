"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function DayCount() {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(true)
  const [dayCount, setDayCount] = useState<number | null>(null)
  const [dateDifference, setDateDifference] = useState<{ years: number; months: number; days: number } | null>(null)

  const parseDate = (dateString: string) => {
    const parts = dateString.split("/")
    if (parts.length === 3) {
      const day = Number.parseInt(parts[0])
      const month = Number.parseInt(parts[1])
      const year = Number.parseInt(parts[2])
      if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900) {
        return new Date(year, month - 1, day)
      }
    }
    return null
  }

  const calculateDateDifference = (startDate: Date, endDate: Date, inclusive: boolean) => {
    const adjustedEndDate = new Date(endDate)
    if (inclusive) {
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1)
    }

    let years = adjustedEndDate.getFullYear() - startDate.getFullYear()
    let months = adjustedEndDate.getMonth() - startDate.getMonth()
    let days = adjustedEndDate.getDate() - startDate.getDate()

    // Adjust if days is negative
    if (days < 0) {
      months--
      const prevMonth = new Date(adjustedEndDate.getFullYear(), adjustedEndDate.getMonth(), 0)
      days += prevMonth.getDate()
    }

    // Adjust if months is negative
    if (months < 0) {
      years--
      months += 12
    }

    return { years, months, days }
  }

  // Calculate days between dates
  useEffect(() => {
    if (startDate && endDate) {
      const start = parseDate(startDate)
      const end = parseDate(endDate)

      if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        const finalCount = includeEndDate ? diffDays + 1 : diffDays
        setDayCount(finalCount)

        const difference = calculateDateDifference(start, end, includeEndDate)
        setDateDifference(difference)
      }
    } else {
      setDayCount(null)
      setDateDifference(null)
    }
  }, [startDate, endDate, includeEndDate])

  const handleDateInput = (value: string, setter: (val: string) => void) => {
    // If empty, clear it
    if (value === "") {
      setter("")
      return
    }

    // Extract only digits
    let digits = value.replace(/\D/g, "")

    // Limit to 8 digits (DDMMYYYY)
    digits = digits.substring(0, 8)

    // Format as DD/MM/YYYY while preserving structure
    let formatted = ""
    if (digits.length > 0) {
      formatted = digits.substring(0, 2) // DD
    }
    if (digits.length > 2) {
      formatted += "/" + digits.substring(2, 4) // MM
    }
    if (digits.length > 4) {
      formatted += "/" + digits.substring(4, 8) // YYYY
    }

    setter(formatted)
  }

  const handleDateBlur = (value: string, setter: (val: string) => void) => {
    if (value.length === 2) {
      // Only day entered (e.g., "14")
      const today = new Date()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const year = today.getFullYear()
      setter(`${value}/${month}/${year}`)
    }
  }

  const handleClear = () => {
    setStartDate("")
    setEndDate("")
    setDayCount(null)
    setDateDifference(null)
    setIncludeEndDate(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="space-y-6">
          {/* Start Date Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={startDate}
              onChange={(e) => handleDateInput(e.target.value, setStartDate)}
              onBlur={(e) => handleDateBlur(e.target.value, setStartDate)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* End Date Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={endDate}
              onChange={(e) => handleDateInput(e.target.value, setEndDate)}
              onBlur={(e) => handleDateBlur(e.target.value, setEndDate)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Checkbox for include end date */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            <Checkbox
              id="include-end-date"
              checked={includeEndDate}
              onCheckedChange={(checked) => setIncludeEndDate(checked as boolean)}
              className="w-5 h-5 cursor-pointer border border-black"
            />
            <label htmlFor="include-end-date" className="text-sm font-medium text-gray-700 cursor-pointer">
              {includeEndDate
                ? "Counting: Start date to End date (inclusive)"
                : "Counting: Start date to Next day of End date"}
            </label>
          </div>

          {dayCount !== null && dateDifference && (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-cyan-500 rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 gap-0">
                  <div className="border-r border-slate-700 p-4">
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">
                      Years
                    </p>
                    <p className="text-lg font-bold text-cyan-500 text-center">{dateDifference.years}</p>
                  </div>
                  <div className="border-r border-slate-700 p-4">
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">
                      Months
                    </p>
                    <p className="text-lg font-bold text-cyan-500 text-center">{dateDifference.months}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">Days</p>
                    <p className="text-lg font-bold text-cyan-500 text-center">{dateDifference.days}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">Time difference between dates</p>
            </div>
          )}

          {/* Clear Button */}
          <Button
            onClick={handleClear}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition hover:cursor-pointer transition-all hover:shadow-lg hover:shadow-red-600 border border-red-500 text-red-500 hover:text-red-500 cursor-pointer"
          >
            Clear Fields
          </Button>
        </div>
      </div>
    </div>
  )
}
