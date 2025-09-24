import React from 'react'
import { Link } from 'react-router-dom'

const SellerHomeScreen1 = () => {
  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm ios-header z-10">
        <div className="flex items-center justify-between p-4">
          <Link to="/seller/profile-1" className="flex items-center text-primary">
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <span className="text-base">Profile</span>
          </Link>
          <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2">Support</h1>
        </div>
      </header>

      <main className="flex-grow p-4 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-800 px-1 mb-4">Contact Us</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-primary text-white font-semibold shadow-sm transition-transform active:scale-95">
              <span className="material-symbols-outlined">chat_bubble</span>
              Chat with Support
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold shadow-sm transition-transform active:scale-95">
              <span className="material-symbols-outlined text-primary">call</span>
              Call Us
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold shadow-sm transition-transform active:scale-95">
              <span className="material-symbols-outlined text-primary">email</span>
              Email Us
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 px-1 mb-4">Frequently Asked Questions</h2>
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              className="w-full bg-gray-100 border-none rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary" 
              placeholder="Search FAQs" 
              type="text"
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm">
            <div className="faq-item">
              <details>
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="font-medium text-gray-800">How do I update my product catalog?</span>
                  <span className="material-symbols-outlined text-gray-400 transition-transform chevron-down">expand_more</span>
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  <p>You can update your product catalog by navigating to the 'Products' tab from the main menu. From there, you can add new products, edit existing ones, or remove items that are no longer available.</p>
                </div>
              </details>
            </div>
            <div className="faq-item">
              <details>
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="font-medium text-gray-800">What are the seller performance metrics?</span>
                  <span className="material-symbols-outlined text-gray-400 transition-transform chevron-down">expand_more</span>
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  <p>Seller performance metrics include your seller rating, response time to requests, order completion rate, and customer feedback. Maintaining high metrics is key to becoming a Top Rated Supplier.</p>
                </div>
              </details>
            </div>
            <div className="faq-item">
              <details>
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="font-medium text-gray-800">How are payments processed?</span>
                  <span className="material-symbols-outlined text-gray-400 transition-transform chevron-down">expand_more</span>
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  <p>Payments are securely processed through our integrated payment gateway. Payouts are made to your linked bank account within 3-5 business days after an order is marked as 'Completed'.</p>
                </div>
              </details>
            </div>
            <div className="faq-item">
              <details>
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="font-medium text-gray-800">Can I dispute a customer review?</span>
                  <span className="material-symbols-outlined text-gray-400 transition-transform chevron-down">expand_more</span>
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  <p>Yes, if you believe a review is unfair or violates our policies, you can submit a dispute request through the order details page. Our support team will review the case and take appropriate action.</p>
                </div>
              </details>
            </div>
          </div>
        </section>

        <section>
          <Link 
            to="/help-center"
            className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm"
          >
            <div>
              <h3 className="font-semibold text-gray-800">Help Center</h3>
              <p className="text-sm text-gray-500">Find articles, guides, and tutorials.</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">arrow_forward_ios</span>
          </Link>
        </section>
      </main>

      <div className="h-24"></div>
    </div>
  )
}

export default SellerHomeScreen1
