import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerHomeOffersReceived = () => {
  const navigate = useNavigate();
  
  const [activeRequests] = useState([
    {
      id: 1,
      title: 'Rebar Ø12, 20 tons',
      status: 'NEW OFFERS',
      offersCount: 3,
      lowestPrice: '$710/t',
      fastestDelivery: '2 days',
      hasNewOffers: true
    },
    {
      id: 2,
      title: 'Concrete Mix C25, 50 m³',
      status: 'PENDING',
      offersCount: 1,
      lowestPrice: '$85/m³',
      fastestDelivery: '1 day',
      hasNewOffers: false
    }
  ]);

  const [completedRequests] = useState([
    {
      id: 3,
      title: 'Steel Beams I-200, 10 pieces',
      status: 'COMPLETED',
      completedDate: '2 days ago'
    },
    {
      id: 4,
      title: 'Cement Bags 50kg, 100 pieces',
      status: 'COMPLETED',
      completedDate: '1 week ago'
    }
  ]);

  const handleViewOffers = (requestId) => {
    console.log(`Viewing offers for request ${requestId}`);
    // Navigate to offers page
  };

  const handleRemindSuppliers = (requestId) => {
    console.log(`Reminding suppliers for request ${requestId}`);
    // Send reminder to suppliers
  };

  const handleCreateNewRequest = () => {
    console.log('Creating new request...');
    // Navigate to create request page
  };

  const handleViewCompleted = () => {
    console.log('Viewing completed requests...');
    // Navigate to completed requests page
  };

  const handleNavigation = (page) => {
    console.log(`Navigating to ${page}`);
    // Handle navigation
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-white">
      <div className="flex-grow">
        <header className="p-4 pt-12 pb-6 bg-white">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Welcome, BuildCo</h1>
        </header>
        
        <main className="px-4 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Active Requests</h2>
          
          {activeRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                  {request.hasNewOffers && (
                    <div className="pill bg-[#5E5CE6] text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase animate-pulse">
                      NEW OFFERS
                    </div>
                  )}
                </div>
                <p className="text-gray-500 mt-1">
                  Status: <span className="font-medium text-gray-700">{request.offersCount} offers received</span>
                </p>
                <p className="text-gray-500 mt-3 text-sm">
                  Lowest: <span className="font-semibold text-gray-800">{request.lowestPrice}</span> · 
                  Fastest: <span className="font-semibold text-gray-800">{request.fastestDelivery}</span>
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => handleViewOffers(request.id)}
                  className="w-full bg-[#5E5CE6] text-white text-center py-3.5 px-5 rounded-2xl font-semibold text-lg hover:bg-[#4C4AC7] transition-colors"
                >
                  View Offers
                </button>
                <button 
                  onClick={() => handleRemindSuppliers(request.id)}
                  className="text-center w-full mt-3 text-sm font-medium text-gray-500 hover:text-[#5E5CE6] transition-colors"
                >
                  Remind suppliers
                </button>
              </div>
            </div>
          ))}
          
          <div className="border-t border-gray-200 pt-4">
            <div 
              className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={handleViewCompleted}
            >
              <h2 className="text-xl font-bold text-gray-900">Completed Requests</h2>
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
          </div>
        </main>
      </div>
      
      <footer className="bg-white p-4 pb-8 space-y-4">
        <button 
          onClick={handleCreateNewRequest}
          className="w-full bg-[#5E5CE6] text-white text-center py-3.5 px-5 rounded-2xl font-semibold text-lg hover:bg-[#4C4AC7] transition-colors"
        >
          Create New Request
        </button>
        
        <div className="flex justify-around items-center border-t border-gray-200 pt-4">
          <button 
            onClick={() => handleNavigation('home')}
            className="flex flex-col items-center gap-1 text-[#5E5CE6]"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z"></path>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('requests')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5E5CE6] transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <span className="text-xs font-medium">Requests</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('dashboard')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5E5CE6] transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-8-12V7a2 2 0 012-2h4a2 2 0 012 2v2m-6 8h.01M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('profile')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5E5CE6] transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BuyerHomeOffersReceived;