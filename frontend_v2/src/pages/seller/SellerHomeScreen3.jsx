import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerHomeScreen3 = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [requestDeclined, setRequestDeclined] = useState(false);
  const [formData, setFormData] = useState({
    price: '',
    deliveryTime: '',
    note: ''
  });

  const [requestData] = useState({
    id: 'RFA-2408-01',
    product: 'Premium Concrete Mix',
    quantity: '50 tons',
    deadline: '2024-08-15',
    deliveryLocation: 'Site A, Downtown',
    paymentMethod: 'Net 30',
    buyerId: 'Buyer-5678'
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSendOffer = () => {
    console.log('Sending offer:', formData);
    setShowModal(false);
    setOfferSent(true);
    // Reset form
    setFormData({
      price: '',
      deliveryTime: '',
      note: ''
    });
  };

  const handleMakeCounterRequest = () => {
    console.log('Making counter request...');
    // Navigate to counter request page
  };

  const handleDecline = () => {
    if (window.confirm("Are you sure you want to decline this request?")) {
      setRequestDeclined(true);
    }
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <header className="sticky top-0 z-20 ios-header border-b border-[#E5E5EA]">
        <div className="mx-auto flex h-[50px] max-w-md items-center justify-between px-4">
          <button 
            onClick={handleBack}
            className="flex items-center text-sm font-medium text-[#5E5CE6] hover:text-[#4B4ACD]"
          >
            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
            Back
          </button>
          <div className="text-center">
            <h1 className="text-base font-semibold">Request #{requestData.id}</h1>
            <p className="text-xs text-gray-500">New Request</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="space-y-4">
          {/* AI Hint */}
          <div className="ai-hint rounded-lg p-3 text-sm text-gray-700 flex items-start gap-3">
            <span className="material-symbols-outlined text-[#5E5CE6] mt-0.5">auto_awesome</span>
            <div>
              <p className="font-semibold text-[#5E5CE6]">AI Hint</p>
              <p>This request matches your stock. High success chance.</p>
            </div>
          </div>

          {/* Request Details */}
          <div className="rounded-xl bg-white shadow-sm border border-[#E5E5EA]">
            <div className="divide-y divide-[#E5E5EA]">
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-500">Product</span>
                <span className="font-semibold text-right">{requestData.product}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-500">Quantity</span>
                <span className="font-semibold">{requestData.quantity}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-500">Deadline</span>
                <span className="font-semibold">{requestData.deadline}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-500">Delivery Location</span>
                <span className="font-semibold text-right">{requestData.deliveryLocation}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-semibold">{requestData.paymentMethod}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-500">Buyer ID</span>
                <span className="font-semibold">{requestData.buyerId}</span>
              </div>
            </div>
          </div>

          {/* Offer Status */}
          {offerSent && (
            <div className="rounded-xl bg-white shadow-sm border border-[#E5E5EA] p-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-green-500 text-3xl">task_alt</span>
                <p className="font-semibold">Offer Sent</p>
                <p className="text-sm text-gray-500">Waiting for Buyer Response.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Action Footer */}
      {!offerSent && !requestDeclined && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-[#E5E5EA] px-4 pt-4 pb-6">
          <div className="mx-auto max-w-md space-y-3">
            <button 
              onClick={handleOpenModal}
              className="action-button-primary w-full rounded-xl py-3.5 text-base font-semibold shadow-sm hover:bg-[#4B4ACD] transition-colors"
            >
              Respond
            </button>
            <button 
              onClick={handleMakeCounterRequest}
              className="action-button-secondary w-full rounded-xl py-3.5 text-base font-semibold hover:bg-[#D1D1D6] transition-colors"
            >
              Make Counter Request
            </button>
            <button 
              onClick={handleDecline}
              className="action-button-tertiary w-full rounded-xl py-2.5 text-base font-medium hover:text-[#111827] transition-colors"
            >
              Decline
            </button>
          </div>
          <div className="h-safe-area-bottom"></div>
        </footer>
      )}

      {/* Request Declined Message */}
      {requestDeclined && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-[#E5E5EA] px-4 pt-4 pb-6">
          <div className="mx-auto max-w-md">
            <div className="text-center py-4 text-gray-500">Request Declined.</div>
          </div>
        </footer>
      )}

      {/* Response Modal */}
      {showModal && (
        <div 
          className="modal fixed inset-0 z-30 items-end bg-black bg-opacity-50 transition-opacity flex"
          onClick={handleModalBackdropClick}
        >
          <div className="w-full max-w-md bg-[#F9F9F9] rounded-t-2xl shadow-xl transform transition-transform">
            <div className="p-4 border-b border-[#E5E5EA] flex justify-between items-center">
              <h2 className="text-lg font-semibold">Send Offer</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="price">
                  Price (per ton)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-[#5E5CE6] focus:ring-[#5E5CE6] sm:text-sm" 
                    id="price" 
                    name="price" 
                    placeholder="0.00" 
                    type="text"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="deliveryTime">
                  Estimated Delivery Time
                </label>
                <input 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5E5CE6] focus:ring-[#5E5CE6] sm:text-sm" 
                  id="deliveryTime" 
                  name="deliveryTime" 
                  type="date"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="note">
                  Note (optional)
                </label>
                <textarea 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5E5CE6] focus:ring-[#5E5CE6] sm:text-sm" 
                  id="note" 
                  name="note" 
                  placeholder="Add a note for the buyer..." 
                  rows="3"
                  value={formData.note}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="px-4 pt-2 pb-6">
              <button 
                onClick={handleSendOffer}
                className="action-button-primary w-full rounded-xl py-3.5 text-base font-semibold shadow-sm hover:bg-[#4B4ACD] transition-colors"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerHomeScreen3;