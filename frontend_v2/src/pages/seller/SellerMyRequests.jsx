import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SupplierMyRequests = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Active')

  const [requests] = useState([
    {
      id: 1,
      status: 'New Request',
      statusColor: 'bg-[#6C4FFF]/10 text-[#6C4FFF]',
      title: 'Concrete Mix',
      quantity: '50 cubic yards',
      buyerId: '12345',
      deadline: '2024-08-15',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMtd6xFAu59KveQ5zXxs6Zg-y2H-tV7vNh2bG_3Q-L6eK9crFXmB9Dj6FB4C_8nRCCxI-qnfBgfXxXEzY7cZOp6p3M9D6jaiGzUdGb-fIzk1fQy-nLdOq40Ymfm2i5fcZOyACqoYWHdq-3YL5QKcRRxKZBY5FXUeyuR0ZLHNelBePN5mPO5Mk1bG8bv4zl-BX3GSuHiT-GZhrbvAPN6x0QzWNdLSFcD8QHHlamBGswAG4JXgrP2rk_BihkMsf2bhC0Gd8opEYEEJ0'
    },
    {
      id: 2,
      status: 'Offer Sent',
      statusColor: 'bg-yellow-100 text-yellow-800',
      title: 'Steel Rebar',
      quantity: '10 tons',
      buyerId: '67890',
      deadline: '2024-08-20',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPWfjik9RT3aOFFN-79YFT3C4vWGmYawPJ1ecahnLD4FvGi1JHLgAmIsMPdtWJ-2eNR2nu32krMWYCyMvJMe8CHxTczzTxQQ1jruJazZ3XFzB_FLONtNA57XEWKP2r2dfLC4-XF8YLQkvM96gXvF8STN11uixAJdmGzDAnRVzi9qJ9wlPEKoDTD-3ShauVLVNnA8TI7grRf3QiImu7SdRnboQ7y21hFIcDP31oP8g6P1eC_ZXRUDS84jaOFDmWc5ubtNHchn9Iodw'
    },
    {
      id: 3,
      status: 'Buyer Accepted',
      statusColor: 'bg-green-100 text-green-800',
      title: 'Lumber',
      quantity: '2000 board feet',
      buyerId: '11223',
      deadline: '2024-08-25',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0CqPz1iiIG972tGDHC6VONV4IlCp6cNXx755WGsa_PUMJ20QUrRnYB8rnm9uDefCNTNSvyy5J3UR1iu18mKG4HYtkr9rQt92pOHhUEc2thQFh07EDzS8YUkS8zOL3Ddd8uvYEHTvlA0Kt-5fp0v-vp6SdP-QDsV8BF7PPs03NtNSiJwzDsZEiU-TGTKsmkXxGhoE5pd6EATZSy-GAhjnJ6T2SoUIJjuoSiKfO2XQqgoT5j2K4aTn32xP3wCUMGkMxP7BP33cMMK4'
    }
  ])

  const tabs = ['Active', 'Pending', 'Completed']

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleRespond = (requestId) => {
    console.log(`Responding to request ${requestId}`)
    navigate(`/seller/respond-request/${requestId}`)
  }

  const handleViewOffer = (requestId) => {
    console.log(`Viewing offer for request ${requestId}`)
    navigate(`/seller/view-offer/${requestId}`)
  }

  const handleViewOrderDetails = (requestId) => {
    console.log(`Viewing order details for request ${requestId}`)
    navigate(`/seller/order-details/${requestId}`)
  }

  const handleDetails = (requestId) => {
    console.log(`Viewing details for request ${requestId}`)
    navigate(`/seller/request-details/${requestId}`)
  }

  const handleSearch = () => {
    console.log('Searching requests...')
  }

  const handleNavigation = (page) => {
    console.log(`Navigating to ${page}`)
    navigate(`/${page}`)
  }

  const getButtonText = (status) => {
    switch (status) {
      case 'New Request':
        return 'Respond'
      case 'Offer Sent':
        return 'View Offer'
      case 'Buyer Accepted':
        return 'View Order Details'
      default:
        return 'Details'
    }
  }

  const handlePrimaryAction = (request) => {
    switch (request.status) {
      case 'New Request':
        handleRespond(request.id)
        break
      case 'Offer Sent':
        handleViewOffer(request.id)
        break
      case 'Buyer Accepted':
        handleViewOrderDetails(request.id)
        break
      default:
        handleDetails(request.id)
    }
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white px-4 pt-6 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
          <button 
            onClick={handleSearch}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">search</span>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="mt-4">
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-100 p-1">
            {tabs.map((tab) => (
                <label key={tab} className="flex h-full flex-1 cursor-pointer items-center justify-center rounded-md px-2 text-sm font-medium text-gray-500 has-[:checked]:bg-white has-[:checked]:text-[#6C4FFF] has-[:checked]:shadow-sm">
                <span className="truncate">{tab}</span>
                <input 
                  className="sr-only" 
                  name="request-type" 
                  type="radio" 
                  value={tab}
                  checked={activeTab === tab}
                  onChange={() => handleTabChange(tab)}
                />
              </label>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${request.statusColor}`}>
                      {request.status}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-gray-900">{request.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="font-medium">Quantity:</span> {request.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Buyer ID:</span> {request.buyerId}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Deadline:</span> {request.deadline}
                    </p>
                  </div>
                  <div 
                    className="ml-4 h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url("${request.image}")` }}
                  ></div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-gray-200 p-4">
                <button 
                  onClick={() => handlePrimaryAction(request)}
                  className="flex-1 rounded-lg bg-[#6C4FFF] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#5A3FE6] transition-colors"
                >
                  {getButtonText(request.status)}
                </button>
                <button 
                  onClick={() => handleDetails(request.id)}
                  className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-200 transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
          
          {/* Empty State (hidden by default) */}
          <div className="hidden text-center text-gray-500 pt-16">
            <span className="material-symbols-outlined text-6xl text-gray-300">
              assignment
            </span>
            <p className="mt-4 text-lg font-medium">No requests yet</p>
            <p className="text-sm">When you have a new request, it will show up here.</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => navigate('/seller/dashboard')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs font-bold">Requests</span>
          </button>
          <button 
            onClick={() => navigate('/seller/products')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-xs font-medium">Products</span>
          </button>
          <button 
            onClick={() => navigate('/seller/profile')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs font-medium">Profile</span>
          </button>
          <button 
            onClick={() => navigate('/seller/analytics')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-xs font-medium">Analytics</span>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default SupplierMyRequests