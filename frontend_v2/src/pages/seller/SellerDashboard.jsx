import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SellerDashboard = () => {
  const [hasProducts] = useState(true); // This would come from API/state
  const [hasOrders] = useState(true); // This would come from API/state

  // If no products, show welcome screen
  if (!hasProducts) {
    return (
      <div className="relative flex size-full min-h-screen flex-col justify-between">
        <header className="p-6">
          <h1 className="text-xl font-semibold text-center text-gray-900">Welcome, Build Supply Co.</h1>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="w-48 h-48 mb-8">
            <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              <path d="M3.27 6.96L12 12.01l8.73-5.05" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              <path d="M12 22.08V12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">You don't have any products yet.</h2>
          <p className="mt-2 text-gray-500">Start by adding your first product.</p>
        </main>

        <footer className="p-6 pb-8">
          <Link 
            to="/seller/products"
            className="btn-primary w-full block text-center"
          >
            Add Product
          </Link>
          <button className="mt-4 w-full text-gray-silver font-medium">
            Skip for now
          </button>
        </footer>
      </div>
    );
  }

  // If has products, show dashboard
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
                    <span>Request Received</span>
                    <span>Offer Sent</span>
                    <span>Order Confirmed</span>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 opacity-0" style={{ animationDelay: '0.7s', transform: 'translateY(-20px)' }}>
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-gray-800">Seller KPIs</h2>
              <Link 
                to="/seller/analytics"
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
                <p className="text-xs text-green-600">+12% vs yesterday</p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="animate-count-up my-1 text-3xl font-bold text-gray-900" style={{ '--num-target': '12500' }}></p>
                <p className="text-xs text-green-600">+8% vs yesterday</p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="animate-count-up my-1 text-3xl font-bold text-gray-900" style={{ '--num-target': '3' }}></p>
                <p className="text-xs text-orange-600">2 urgent</p>
              </div>
            </div>
          </section>

          <section className="opacity-0" style={{ animationDelay: '0.9s', transform: 'translateY(-20px)' }}>
            <h2 className="px-2 text-xl font-bold text-gray-800">Quick Actions</h2>
            <div className="actions-grid mt-4 grid grid-cols-3 gap-3">
              <Link 
                to="/seller/products"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-3xl">add</span>
                Product
              </Link>
              <Link 
                to="/seller/requests"
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
  );
};

export default SellerDashboard;
