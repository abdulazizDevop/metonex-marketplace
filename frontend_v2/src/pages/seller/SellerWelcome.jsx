import React from 'react'
import { Link } from 'react-router-dom'

const SellerWelcome = () => {
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
          to="/seller/add-product"
          className="btn-primary w-full block text-center"
        >
          Add Product
        </Link>
        <button className="mt-4 w-full text-gray-silver font-medium">
          Skip for now
        </button>
      </footer>
    </div>
  )
}

export default SellerWelcome
