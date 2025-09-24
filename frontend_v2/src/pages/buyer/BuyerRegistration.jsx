import React from 'react'
import { Link } from 'react-router-dom'

const BuyerRegistration = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm z-10 px-6 py-4">
        <div className="relative flex items-center justify-center">
          <Link to="/buyer" className="absolute left-0 text-gray-800">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Registration</h1>
        </div>
      </header>

      <main className="flex-grow px-6 py-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2" htmlFor="company-name">
              Company Name
            </label>
            <input 
              className="form-input" 
              id="company-name" 
              placeholder="Your Company LLC" 
              type="text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2" htmlFor="bank-account">
              Bank Account
            </label>
            <input 
              className="form-input" 
              id="bank-account" 
              placeholder="1234567890123456" 
              type="text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2" htmlFor="tin">
              TIN
            </label>
            <input 
              className="form-input" 
              id="tin" 
              placeholder="Your Tax ID Number" 
              type="text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2" htmlFor="telegram">
              Telegram Account
            </label>
            <input 
              className="form-input" 
              id="telegram" 
              placeholder="@your_username" 
              type="text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2" htmlFor="accountant-phone">
              Accountant Phone Number
            </label>
            <input 
              className="form-input" 
              id="accountant-phone" 
              placeholder="+1 (555) 123-4567" 
              type="tel"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2" htmlFor="accountant-name">
              Accountant Name
            </label>
            <input 
              className="form-input" 
              id="accountant-name" 
              placeholder="Jane Doe" 
              type="text"
            />
          </div>
        </div>
      </main>

      <footer className="px-6 py-4 bg-white sticky bottom-0">
        <button className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-4 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
          Continue
        </button>
      </footer>
    </div>
  )
}

export default BuyerRegistration
