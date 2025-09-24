import React from 'react'
import { Link } from 'react-router-dom'

const BuyerHomeScreen2 = () => {
  return (
    <div className="relative flex flex-col min-h-screen">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Hi, Apex Construction 👋</h1>
              <p className="text-sm text-gray-500">You have <span className="font-semibold text-primary">5 active orders</span> today.</p>
            </div>
            <button className="relative">
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold text-center">2</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 space-y-6">
        <section>
          <div className="grid grid-cols-1 gap-3">
            <Link 
              to="/manual-order-request-form"
              className="w-full flex items-center justify-center py-4 px-5 bg-primary text-white rounded-xl shadow-md hover:opacity-90 transition-opacity"
            >
              <span className="text-lg font-semibold">New Request</span>
              <span className="material-symbols-outlined ml-2">add</span>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-start gap-1 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-accent">upload_file</span>
                <span className="text-sm font-semibold">Upload Estimate</span>
              </button>
              <button className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-start gap-1 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-green-500">local_shipping</span>
                <span className="text-sm font-semibold">Track Orders</span>
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">To Pay</p>
              <p className="text-2xl font-bold mt-1">$85,250</p>
              <div className="flex items-center text-xs text-red-500 mt-1">
                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                <span>12.5% vs last month</span>
              </div>
              <svg className="mt-2 h-6 w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                <polyline className="sparkline negative-sparkline" fill="none" points="0,15 10,12 20,14 30,10 40,11 50,8 60,9 70,6 80,8 90,5 100,3"></polyline>
              </svg>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">Paid This Month</p>
              <p className="text-2xl font-bold mt-1">$45,000</p>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                <span>8.2% vs last month</span>
              </div>
              <svg className="mt-2 h-6 w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                <polyline className="sparkline positive-sparkline" fill="none" points="0,5 10,8 20,6 30,10 40,9 50,12 60,11 70,14 80,12 90,15 100,17"></polyline>
              </svg>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Estimate: Downtown Tower Project</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
            <div>
              <div className="flex justify-between items-center text-sm font-medium mb-1">
                <span>Rebar 12mm</span>
                <span className="text-gray-500">20 / 50 tons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Needed: 50 tons, Purchased: 20 tons, Remaining: 30 tons</p>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm font-medium mb-1">
                <span>Cement M500</span>
                <span className="text-gray-500">70 / 100 tons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Needed: 100 tons, Purchased: 70 tons, Remaining: 30 tons</p>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm font-medium mb-1">
                <span>Bricks</span>
                <span className="text-gray-500">2k / 10k pcs</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Needed: 10,000 pcs, Purchased: 2,000 pcs, Remaining: 8,000 pcs</p>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Estimate Value:</span>
                <span className="font-semibold">$120,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Paid:</span>
                <span className="font-semibold text-green-500">$45,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Remaining:</span>
                <span className="font-semibold text-red-500">$75,000</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4">
              <button className="py-2 px-2 text-xs font-semibold bg-primary text-white rounded-lg hover:opacity-90">Buy Remaining</button>
              <button className="py-2 px-2 text-xs font-semibold bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200">Compare Prices</button>
              <button className="py-2 px-2 text-xs font-semibold bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200">View Report</button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">History & Analytics</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Last Order</p>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold">Ready-Mix Concrete</p>
                <p className="text-sm text-gray-500">Supplier ID: S-482B • <span className="font-medium text-green-500">Delivered</span></p>
              </div>
              <button className="flex items-center gap-1.5 shrink-0 rounded-full bg-accent text-white px-3 py-1.5 text-sm font-semibold hover:opacity-90">
                <span className="material-symbols-outlined text-base">replay</span>
                Reorder
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <p className="text-xl font-bold">128</p>
              <p className="text-xs text-gray-500">Total Orders</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <p className="text-xl font-bold">$4.2k</p>
              <p className="text-xs text-gray-500">Avg. Order</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <p className="text-xl font-bold truncate">Cement</p>
              <p className="text-xs text-gray-500">Top Product</p>
            </div>
          </div>
        </section>

        <div className="h-20"></div>
      </main>
    </div>
  )
}

export default BuyerHomeScreen2
