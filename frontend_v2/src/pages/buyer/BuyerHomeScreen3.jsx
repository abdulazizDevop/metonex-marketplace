import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerHomeScreen3 = () => {
  const navigate = useNavigate();
  const [activeOrders] = useState(3);
  const [outstandingAmount] = useState(2630.00);
  const [paidThisMonth] = useState(1080.00);
  const [outstandingChange] = useState(5.2);
  const [paidChange] = useState(-10.1);

  const handleNewRequest = () => {
    // Navigate to new request page
    console.log('Starting new request...');
  };

  const handleUploadBOM = () => {
    // Navigate to BOM upload page
    console.log('Uploading BOM...');
  };

  const handleTrackOrders = () => {
    // Navigate to order tracking page
    console.log('Tracking orders...');
  };

  const handleReorder = () => {
    // Handle reorder functionality
    console.log('Reordering...');
  };

  const handleViewAllHistory = () => {
    // Navigate to purchase history page
    console.log('Viewing all purchase history...');
  };

  const handleCheckOffers = () => {
    // Navigate to offers page
    console.log('Checking offers...');
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between overflow-x-hidden bg-[#f5f5f7]">
      <main className="flex-grow">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-[#d2d2d7] bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
            <div className="w-10">
              <button className="flex items-center justify-center">
                <img 
                  className="h-8 w-8 rounded-full" 
                  src="https://lh3.googleusercontent.com/a/ACg8ocJXgC63-QhKjpbA_yH5w1i-Xh33P5oW2vjL-r_q-t5q=s96-c-rg-br100"
                  alt="Profile"
                />
              </button>
            </div>
            <h1 className="text-lg font-semibold">MetOneX</h1>
            <div className="w-10 text-right">
              <button className="relative flex items-center justify-center text-[#1d1d1f]">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Hi, Metacorp</h2>
            <p className="text-[#6e6e73]">
              You have <span className="font-semibold text-[#994ce6]">{activeOrders} active orders</span> today.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 grid grid-cols-1 gap-4">
            <button 
              onClick={handleNewRequest}
              className="flex w-full items-center justify-between rounded-xl bg-[#994ce6] p-4 text-left text-white shadow-lg transition-transform hover:scale-[1.02]"
            >
              <div>
                <p className="font-semibold">New Request</p>
                <p className="text-sm opacity-80">Start a new material order</p>
              </div>
              <span className="material-symbols-outlined text-3xl">add_circle</span>
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleUploadBOM}
                className="flex flex-col items-start justify-center gap-2 rounded-xl bg-white p-3 shadow-sm transition-transform hover:scale-105"
              >
                <span className="material-symbols-outlined text-blue-500">upload_file</span>
                <span className="text-sm font-semibold">Upload BOM</span>
              </button>
              <button 
                onClick={handleTrackOrders}
                className="flex flex-col items-start justify-center gap-2 rounded-xl bg-white p-3 shadow-sm transition-transform hover:scale-105"
              >
                <span className="material-symbols-outlined text-green-500">local_shipping</span>
                <span className="text-sm font-semibold">Track Orders</span>
              </button>
            </div>
          </div>

          {/* Finance Section */}
          <section className="mb-6">
            <h3 className="mb-3 text-xl font-bold">Finance</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Outstanding Card */}
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#6e6e73]">Outstanding</p>
                  <div className="flex items-center text-sm font-medium text-red-500">
                    <span className="material-symbols-outlined text-base">arrow_upward</span>
                    <span>{outstandingChange}%</span>
                  </div>
                </div>
                <p className="text-2xl font-semibold">${outstandingAmount.toLocaleString()}</p>
                <svg className="mt-2 h-8 w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <polyline 
                    className="sparkline negative-sparkline" 
                    fill="none" 
                    stroke="#ff3b30"
                    strokeWidth="2"
                    points="0,15 10,12 20,14 30,10 40,11 50,8 60,9 70,6 80,8 90,5 100,3"
                  />
                </svg>
              </div>

              {/* Paid This Month Card */}
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#6e6e73]">Paid This Month</p>
                  <div className="flex items-center text-sm font-medium text-green-500">
                    <span className="material-symbols-outlined text-base">arrow_downward</span>
                    <span>{Math.abs(paidChange)}%</span>
                  </div>
                </div>
                <p className="text-2xl font-semibold">${paidThisMonth.toLocaleString()}</p>
                <svg className="mt-2 h-8 w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <polyline 
                    className="sparkline positive-sparkline" 
                    fill="none" 
                    stroke="#34c759"
                    strokeWidth="2"
                    points="0,5 10,8 20,6 30,10 40,9 50,12 60,11 70,14 80,12 90,15 100,17"
                  />
                </svg>
              </div>
            </div>

            {/* AI Hint */}
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-blue-50 p-3">
              <span className="material-symbols-outlined text-blue-500">lightbulb</span>
              <p className="text-sm text-blue-800">
                <span className="font-semibold">AI Hint:</span> Most of your spend is on Cement,
                <button 
                  onClick={handleCheckOffers}
                  className="font-bold underline hover:text-blue-600"
                >
                  check offers?
                </button>
              </p>
            </div>
          </section>

          {/* Purchase History Section */}
          <section>
            <h3 className="mb-3 text-xl font-bold">Purchase History</h3>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#6e6e73]">LAST ORDER • 2 DAYS AGO</p>
                  <p className="text-base font-bold">Structural Steel Beams</p>
                  <p className="text-sm text-[#6e6e73]">
                    Supplier ID: 1011 • <span className="font-medium text-green-600">Delivered</span>
                  </p>
                </div>
                <button 
                  onClick={handleReorder}
                  className="flex shrink-0 items-center gap-1.5 self-center rounded-full bg-[#007aff] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105"
                >
                  <span className="material-symbols-outlined text-base">replay</span> 
                  Reorder
                </button>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-3">
                <button 
                  onClick={handleViewAllHistory}
                  className="text-center text-sm font-semibold text-[#007aff] hover:text-blue-600"
                >
                  View All Purchase History
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 border-t border-[#d2d2d7] bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto grid max-w-7xl grid-cols-5 gap-1 px-2 pb-2 pt-1">
          <button className="flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[#994ce6]">
            <span className="material-symbols-outlined">home</span>
            <p className="text-xs font-medium">Home</p>
          </button>
          <button className="flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[#6e6e73] hover:text-[#994ce6]">
            <span className="material-symbols-outlined">list_alt</span>
            <p className="text-xs font-medium">Requests</p>
          </button>
          <button className="flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[#6e6e73] hover:text-[#994ce6]">
            <span className="material-symbols-outlined">insert_chart</span>
            <p className="text-xs font-medium">Dashboard</p>
          </button>
          <button className="flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[#6e6e73] hover:text-[#994ce6]">
            <span className="material-symbols-outlined">person</span>
            <p className="text-xs font-medium">Profile</p>
          </button>
          <button className="flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[#6e6e73] hover:text-[#994ce6]">
            <span className="material-symbols-outlined">receipt_long</span>
            <p className="text-xs font-medium">Invoices</p>
          </button>
        </nav>
      </footer>
    </div>
  );
};

export default BuyerHomeScreen3;