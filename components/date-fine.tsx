"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function DateFine() {
  const [baseDate, setBaseDate] = useState<string>("")
  const [yearsToAdd, setYearsToAdd] = useState<number | string>("")
  const [monthsToAdd, setMonthsToAdd] = useState<number | string>("")
  const [daysToAdd, setDaysToAdd] = useState<number | string>("")
  const [includeBaseDate, setIncludeBaseDate] = useState<boolean>(true)
  const [resultDate, setResultDate] = useState<string>("")

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

  const formatDateOutput = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  useEffect(() => {
    if (baseDate && (yearsToAdd !== "" || monthsToAdd !== "" || daysToAdd !== "")) {
      const base = parseDate(baseDate)
      const years = Number.parseInt(yearsToAdd as string) || 0
      const months = Number.parseInt(monthsToAdd as string) || 0
      const days = Number.parseInt(daysToAdd as string) || 0

      if (base && !isNaN(base.getTime())) {
        const result = new Date(base)

        result.setFullYear(result.getFullYear() + years)
        result.setMonth(result.getMonth() + months)

        // Adjust for base date counting
        if (includeBaseDate) {
          result.setDate(result.getDate() - 1 + days)
        } else {
          result.setDate(result.getDate() + days)
        }

        const formattedResult = formatDateOutput(result)
        setResultDate(formattedResult)
      }
    } else {
      setResultDate("")
    }
  }, [baseDate, yearsToAdd, monthsToAdd, daysToAdd, includeBaseDate])

  const handleDateInput = (value: string, setter: (val: string) => void) => {
    if (value === "") {
      setter("")
      return
    }

    let digits = value.replace(/\D/g, "")
    digits = digits.substring(0, 8)

    let formatted = ""
    if (digits.length > 0) {
      formatted = digits.substring(0, 2)
    }
    if (digits.length > 2) {
      formatted += "/" + digits.substring(2, 4)
    }
    if (digits.length > 4) {
      formatted += "/" + digits.substring(4, 8)
    }

    setter(formatted)
  }

  const handleDateBlur = (value: string, setter: (val: string) => void) => {
    if (value.length === 2) {
      const today = new Date()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const year = today.getFullYear()
      setter(`${value}/${month}/${year}`)
    }
  }

  const handleNumberInput = (value: string, setter: (val: string | number) => void) => {
    if (value === "") {
      setter("")
      return
    }
    const num = Number.parseInt(value)
    if (!isNaN(num) && num >= 0) {
      setter(num)
    }
  }

  const handleClear = () => {
    setBaseDate("")
    setYearsToAdd("")
    setMonthsToAdd("")
    setDaysToAdd("")
    setResultDate("")
    setIncludeBaseDate(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="space-y-6">
          {/* Base Date Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Starting Date</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={baseDate}
              onChange={(e) => handleDateInput(e.target.value, setBaseDate)}
              onBlur={(e) => handleDateBlur(e.target.value, setBaseDate)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Days to Add</label>
            <div className="grid grid-cols-3 gap-3">
              {/* Years Input */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 text-center">Year</label>
                <input
                  type="number"
                  placeholder="0"
                  value={yearsToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setYearsToAdd)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:cursor-pointer text-center"
                />
              </div>

              {/* Months Input */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 text-center">Month</label>
                <input
                  type="number"
                  placeholder="0"
                  value={monthsToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setMonthsToAdd)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:cursor-pointer text-center"
                />
              </div>

              {/* Days Input */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 text-center">Days</label>
                <input
                  type="number"
                  placeholder="0"
                  value={daysToAdd}
                  onChange={(e) => handleNumberInput(e.target.value, setDaysToAdd)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition hover:cursor-pointer text-center"
                />
              </div>
            </div>
          </div>

          {/* Checkbox for include base date */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            <Checkbox
              id="include-base-date"
              checked={includeBaseDate}
              onCheckedChange={(checked) => setIncludeBaseDate(checked as boolean)}
              className="w-5 h-5 cursor-pointer border border-black"
            />
            <label htmlFor="include-base-date" className="text-sm font-medium text-gray-700 cursor-pointer">
              {includeBaseDate ? "Counting: Starting from base date" : "Counting: Starting from next day"}
            </label>
          </div>

          {resultDate && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-cyan-500 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 gap-0">
                <div className="border-r border-slate-700 p-4">
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">
                    Result Date
                  </p>
                  <p className="text-lg font-bold text-cyan-500 text-center">{resultDate}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2 text-center">
                    Total Added:
                  </p>
                  <p className="text-lg font-bold text-cyan-500 text-center">
                    {yearsToAdd || 0}Y {monthsToAdd || 0}M {daysToAdd || 0}D
                  </p>
                </div>
              </div>
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
