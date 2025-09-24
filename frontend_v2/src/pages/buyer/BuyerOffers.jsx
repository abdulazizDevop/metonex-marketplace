import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerOffers = () => {
  const navigate = useNavigate();
  const [showBestPriceAlert, setShowBestPriceAlert] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  const [offers] = useState([
    {
      id: 1,
      supplierId: '14ad',
      status: 'rejected',
      statusText: 'Rejected',
      statusColor: 'bg-red-100 text-[#EF4444]',
      message: 'Out of stock',
      price: null,
      delivery: null,
      actions: ['sendToAlternative']
    },
    {
      id: 2,
      supplierId: '25fg',
      status: 'approved',
      statusText: 'Approved',
      statusColor: 'bg-green-100 text-[#22C55E]',
      message: null,
      price: 1200,
      delivery: '2 days',
      actions: ['reject', 'pay']
    },
    {
      id: 3,
      supplierId: '39hj',
      status: 'counter-offer',
      statusText: 'Counter-offer',
      statusColor: 'bg-yellow-100 text-[#F59E0B]',
      message: 'Partial delivery now, rest later.',
      price: null,
      delivery: null,
      actions: ['rejectAndAutoSend', 'accept']
    }
  ]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSendToAlternative = (supplierId) => {
    console.log(`Sending to alternative supplier for ${supplierId}...`);
    // Navigate to alternative supplier selection
  };

  const handleReject = (supplierId) => {
    console.log(`Rejecting offer from ${supplierId}...`);
    // Handle rejection logic
  };

  const handlePay = (supplierId) => {
    console.log(`Processing payment for ${supplierId}...`);
    // Navigate to payment page
  };

  const handleRejectAndAutoSend = (supplierId) => {
    setSelectedOffer(supplierId);
    setShowBestPriceAlert(true);
  };

  const handleAccept = (supplierId) => {
    console.log(`Accepting offer from ${supplierId}...`);
    // Handle acceptance logic
  };

  const handleCancelAlert = () => {
    setShowBestPriceAlert(false);
    setSelectedOffer(null);
  };

  const handleRejectAnyway = () => {
    console.log(`Rejecting anyway for ${selectedOffer}...`);
    setShowBestPriceAlert(false);
    setSelectedOffer(null);
    // Handle rejection logic
  };

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#F9FAFB]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
        <button 
          onClick={handleBack}
          className="flex items-center justify-center rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">Supplier Responses</h1>
        <div className="w-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-4 p-4">
        {offers.map((offer) => (
          <div key={offer.id} className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${offer.statusColor}`}>
                {offer.statusText}
              </span>
              <span className="text-sm font-semibold text-gray-500">ID {offer.supplierId}</span>
            </div>

            {offer.message && (
              <p className={`text-base ${offer.status === 'rejected' ? 'text-[#EF4444]' : 'text-gray-600'}`}>
                {offer.message}
              </p>
            )}

            {offer.price && (
              <div className="flex items-baseline justify-between">
                <p className="text-4xl font-bold text-[#22C55E]">
                  {formatCurrency(offer.price)}
                </p>
                <p className="text-sm text-gray-500">
                  Delivery: <span className="font-semibold">{offer.delivery}</span>
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {offer.actions.includes('sendToAlternative') && (
                <button 
                  onClick={() => handleSendToAlternative(offer.supplierId)}
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#F3F4F6] py-3 text-base font-semibold text-[#4B5563] transition-colors hover:bg-gray-200"
                >
                  Send to 2nd best supplier
                </button>
              )}

              {offer.actions.includes('reject') && (
                <button 
                  onClick={() => handleReject(offer.supplierId)}
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#F3F4F6] py-3 text-base font-semibold text-[#4B5563] transition-colors hover:bg-gray-200"
                >
                  Reject
                </button>
              )}

              {offer.actions.includes('pay') && (
                <button 
                  onClick={() => handlePay(offer.supplierId)}
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#5E5CE6] py-3 text-base font-semibold text-white transition-colors hover:bg-opacity-90"
                >
                  Pay
                </button>
              )}

              {offer.actions.includes('rejectAndAutoSend') && (
                <button 
                  onClick={() => handleRejectAndAutoSend(offer.supplierId)}
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#F3F4F6] py-3 text-base font-semibold text-[#4B5563] transition-colors hover:bg-gray-200"
                >
                  Reject & auto-send
                </button>
              )}

              {offer.actions.includes('accept') && (
                <button 
                  onClick={() => handleAccept(offer.supplierId)}
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#5E5CE6] py-3 text-base font-semibold text-white transition-colors hover:bg-opacity-90"
                >
                  Accept
                </button>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Best Price Alert Modal */}
      {showBestPriceAlert && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="mx-4 flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-[#F59E0B]">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Best Price Alert</h2>
            </div>
            <p className="text-base text-gray-600">
              This is the best offer available right now. Rejecting may delay your project.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleCancelAlert}
                className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#F3F4F6] py-3 text-base font-semibold text-[#4B5563] transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectAnyway}
                className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#EF4444] py-3 text-base font-semibold text-white transition-colors hover:bg-opacity-90"
              >
                Reject Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <nav className="flex justify-around p-2">
          <button className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[#9CA3AF] transition-colors hover:bg-gray-100">
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-purple-100 py-2 text-[#5E5CE6] transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              list_alt
            </span>
            <span className="text-xs font-semibold">Offers</span>
          </button>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[#9CA3AF] transition-colors hover:bg-gray-100">
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[#9CA3AF] transition-colors hover:bg-gray-100">
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </nav>
      </footer>
    </div>
  );
};

export default BuyerOffers;