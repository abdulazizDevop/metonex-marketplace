import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SellerSettingsPanel = () => {
  const navigate = useNavigate()
  const [selectedTimeRange, setSelectedTimeRange] = useState('Today')
  const [settings, setSettings] = useState({
    revenue: true,
    conversion: true,
    lostSales: false,
    repeatBuyers: true,
    aiTimeRange: true,
    anonymizeBuyers: true,
    excludePII: true
  })

  const timeRanges = ['Today', 'Week', 'Month', 'Quarter', 'Year', 'Custom']

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range)
  }

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleNavigation = (page) => {
    navigate(`/${page}`)
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 pb-4 pt-12 backdrop-blur-lg">
        <div className="px-4">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Control how MetOneX works for your business.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Time Range Settings */}
          <div className="rounded-xl bg-white p-4 shadow-lg">
            <label className="text-sm font-semibold text-gray-600">Time Range</label>
            <div className="mt-2 flex flex-wrap gap-2 text-sm font-medium">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  className={`flex-1 rounded-lg px-3 py-2 ${
                    selectedTimeRange === range
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">This range is used across Analytics, AI insights, and Exports.</p>
          </div>

          {/* Business Analytics */}
          <div className="rounded-xl bg-white p-4 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Business Analytics</h2>
            <div className="space-y-4">
              {[
                { key: 'revenue', label: 'Revenue' },
                { key: 'conversion', label: 'Conversion' },
                { key: 'lostSales', label: 'Lost Sales' },
                { key: 'repeatBuyers', label: 'Repeat Buyers' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="font-medium">{label}</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={settings[key]}
                      onChange={(e) => handleSettingChange(key, e.target.checked)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                Metric definitions
              </button>
              <p className="mt-1 text-xs text-gray-400">Visible metrics on dashboards.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex justify-around py-2">
          <button
            onClick={() => handleNavigation('seller/home')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => handleNavigation('seller/requests')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs">Requests</span>
          </button>
          <button
            onClick={() => handleNavigation('seller/products')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-xs">Products</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-xs font-bold">Settings</span>
          </button>
          <button
            onClick={() => handleNavigation('seller/analytics')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-xs">Analytics</span>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default SellerSettingsPanel
