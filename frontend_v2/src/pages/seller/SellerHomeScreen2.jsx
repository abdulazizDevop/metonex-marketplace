import React from 'react'
import { Link } from 'react-router-dom'

const SellerHomeScreen2 = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between overflow-x-hidden">
      <div className="flex-grow">
        <header className="bg-gradient-to-br from-primary to-secondary px-6 pt-16 pb-6 text-white shadow-lg animate-layered-in">
          <div className="opacity-0" style={{ animationDelay: '0.1s', transform: 'translateY(-20px)' }}>
            <p className="text-3xl font-bold leading-tight">Welcome back, Supplier #1234</p>
            <p className="mt-1 text-base text-purple-200">Here's your business performance today.</p>
          </div>
        </header>

        <main className="p-4 pb-24 animate-layered-in">
          <section className="mt-6 mb-6 opacity-0" style={{ animationDelay: '0.3s', transform: 'translateY(-20px)' }}>
            <div className="rounded-2xl bg-white p-4 shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Seller Rating</h3>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⭐</span>
                  <div>
                    <p className="text-xl font-bold text-gray-900">4.7<span className="text-base font-medium text-gray-500">/5</span></p>
                    <p className="text-sm text-gray-600">128 Completed Orders</p>
                  </div>
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Top Rated Supplier
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 opacity-0" style={{ animationDelay: '0.5s', transform: 'translateY(-20px)' }}>
            <h2 className="px-2 text-xl font-bold text-gray-800">Active Orders</h2>
            <div className="mt-4 space-y-4">
              <div className="animate-bounce-light overflow-hidden rounded-2xl bg-white p-4 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
                  <p className="font-semibold text-purple-600">New Request</p>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">Premium Concrete Mix</p>
                <p className="text-sm text-gray-500">Qty: 50 tons, Price: $2,500</p>
                <p className="text-sm text-gray-500">Deadline: 2024-07-25</p>
                <div className="mt-4">
                  <div className="relative h-1.5 w-full rounded-full bg-gray-200">
                    <div className="absolute h-1.5 w-0 rounded-full bg-purple-500"></div>
                    <div className="absolute -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-purple-500 shadow" style={{ left: '5%' }}></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-medium text-gray-400">
                    <span>Request</span><span>Confirmed</span><span>Delivery</span><span>Completed</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                  <p className="font-semibold text-blue-600">In Progress</p>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">Galvanized Steel Beams</p>
                <p className="text-sm text-gray-500">Qty: 20 units, Price: $4,000</p>
                <p className="text-sm text-gray-500">Deadline: 2024-07-22</p>
                <div className="mt-4">
                  <div className="relative h-1.5 w-full rounded-full bg-gray-200">
                    <div className="absolute h-1.5 w-2/3 rounded-full bg-blue-500"></div>
                    <div className="absolute -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-500 shadow animate-timeline-dot" style={{ left: '65%' }}></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-medium text-gray-400">
                    <span>Request</span><span>Confirmed</span><span>Delivery</span><span>Completed</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 opacity-80 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  <p className="font-semibold text-green-600">Completed</p>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">Portland Cement Bags</p>
                <p className="text-sm text-gray-500">Qty: 100 bags, Price: $1,000</p>
                <p className="text-sm text-gray-500">Deadline: 2024-07-10</p>
                <div className="mt-4">
                  <div className="relative h-1.5 w-full rounded-full bg-gray-200">
                    <div className="absolute h-1.5 w-full rounded-full bg-green-500"></div>
                    <div className="absolute -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 shadow" style={{ left: '95%' }}></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-medium text-gray-400">
                    <span>Request</span><span>Confirmed</span><span>Delivery</span><span>Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 opacity-0" style={{ animationDelay: '0.7s', transform: 'translateY(-20px)' }}>
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-gray-800">Seller KPIs</h2>
              <Link 
                to="/seller/analytics-summary"
                className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-300 active:bg-gray-400"
              >
                <span className="material-symbols-outlined text-base">bar_chart</span>
                Detailed View
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">Today's Orders</p>
                <p className="animate-count-up my-1 text-3xl font-bold text-gray-900" style={{ '--num-target': '8' }}></p>
                <p className="flex items-center justify-center text-sm font-medium text-green-500">
                  <span className="material-symbols-outlined text-base">arrow_upward</span>15%
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">Revenue Today</p>
                <p className="animate-count-up my-1 text-3xl font-bold text-gray-900" style={{ '--num-target': '6500' }}>
                  <span className="text-2xl">$</span>
                </p>
                <p className="flex items-center justify-center text-sm font-medium text-green-500">
                  <span className="material-symbols-outlined text-base">arrow_upward</span>8%
                </p>
              </div>
              <div className="relative flex flex-col items-center justify-center rounded-2xl bg-white p-3 text-center shadow-sm">
                <svg className="absolute h-24 w-24 -rotate-90">
                  <circle className="text-gray-200" cx="50%" cy="50%" fill="transparent" r="40" strokeWidth="8"></circle>
                  <circle className="animate-progress-circle text-primary" cx="50%" cy="50%" fill="transparent" r="40" strokeDasharray="251.2" strokeDashoffset="87.92" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <p className="z-10 text-sm font-medium text-gray-500">Total Volume</p>
                <p className="z-10 my-1 text-3xl font-bold text-gray-900">70</p>
                <p className="z-10 text-sm font-medium text-gray-500">tons</p>
              </div>
            </div>
          </section>

          <section className="opacity-0" style={{ animationDelay: '0.9s', transform: 'translateY(-20px)' }}>
            <h2 className="px-2 text-xl font-bold text-gray-800">Quick Actions</h2>
            <div className="actions-grid mt-4 grid grid-cols-3 gap-3">
              <Link 
                to="/seller/add-product"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-3xl">add</span>
                Product
              </Link>
              <Link 
                to="/seller/my-requests"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-secondary py-4 text-sm font-bold text-white shadow-lg transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-3xl">inbox</span>
                Respond
              </Link>
              <button className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-200 py-4 text-sm font-bold text-gray-800 shadow-sm transition-transform active:scale-95">
                <span className="material-symbols-outlined text-3xl text-purple-700">support_agent</span>
                Support
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default SellerHomeScreen2
