"use client"

import { useState } from "react"
import DayCount from "@/components/day-count"
import DateFine from "@/components/date-fine"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<string>("default")

  const handleClear = () => {
    setSelectedOption("default")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Day Counter
          </h1>
        </div>

        {/* Selector Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Calculator</label>
              <Select value={selectedOption} onValueChange={setSelectedOption}>
                <SelectTrigger className="w-full bg-white border-gray-300 hover:border-purple-400 transition">
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default" disabled>
                    Choose an option
                  </SelectItem>
                  <SelectItem value="day-count">Day Count</SelectItem>
                  <SelectItem value="date-fine">Date Fine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleClear}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md hover:cursor-pointer"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Content Area - Only show content when valid option is selected */}
        {selectedOption !== "default" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {selectedOption === "day-count" && <DayCount />}
            {selectedOption === "date-fine" && <DateFine />}
          </div>
        )}
      </div>
    </main>
  )
}
