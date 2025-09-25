import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const BuyerHome = () => {
  const navigate = useNavigate()
  const [hasOrders] = useState(false); // This would come from API/state
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

  // Auto-redirect to products page after login/registration
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/buyer/products')
    }, 2000) // 2 seconds delay to show welcome message

    return () => clearTimeout(timer)
  }, [navigate])

  const handleViewOffers = (requestId) => {
    console.log(`Viewing offers for request ${requestId}`);
    // Navigate to offers page
  };

  const handleRemindSuppliers = (requestId) => {
    console.log(`Reminding suppliers for request ${requestId}`);
    // Send reminder to suppliers
  };

  const handleGoToProducts = () => {
    navigate('/buyer/products')
  }

  const handleCreateRequest = () => {
    navigate('/buyer/choose-order-method')
  }

  // If no orders, show welcome screen
  if (!hasOrders) {
    return (
      <div className="flex flex-col justify-between min-h-screen">
        <header className="p-6 pb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Welcome, BuildCo</h1>
            <Link 
              to="/buyer/notifications"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">
                notifications
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-grow flex flex-col justify-center items-center px-6 text-center">
          <div className="space-y-6">
            <img 
              alt="Construction materials" 
              className="w-48 h-48 mx-auto" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2PLJ1mxubGQnbAr6J7T8c06qoWCqCBsHooV2vc-ts_MFwIK0Rg--drd6ckudHyAgXR9gOhDKCVqlMEf0XonZo59nBdyAmOVuRuwINl4_LIs91JlIOMrBERNWBmwl_9aZPTSBxTPDZ2CasN1h01WKkM3a5sAE9v3ZGe-hR5w5iZE6hj0G8l1zE6C8QFhg4xuFSzjIFOqPdHppqHodVApXP1KlwRVYKMPBVg37WgqL8xnnpMAWvFsITL_9derqV4SYCajRBI2mBChw"
            />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Welcome to MetOneX!</h2>
              <p className="text-gray-600">Discover thousands of construction materials and connect with verified suppliers.</p>
            </div>
          </div>
        </main>

        <div className="p-6 space-y-3">
          <button 
            onClick={handleGoToProducts}
            className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
          <button 
            onClick={handleCreateRequest}
            className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Create New Request
          </button>
        </div>
      </div>
    );
  }

  // If has orders, show offers received screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hi, Apex Construction 👋</h1>
              <p className="text-sm text-gray-500">You have <span className="font-semibold text-primary">2 active requests</span> with offers.</p>
            </div>
            <Link 
              to="/buyer/notifications"
              className="relative p-2 text-gray-400 hover:text-gray-500"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold text-center">2</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Requests */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Requests</h2>
          <div className="space-y-4">
            {activeRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                      {request.hasNewOffers && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          NEW OFFERS
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Offers:</span> {request.offersCount}
                      </div>
                      <div>
                        <span className="font-medium">Lowest Price:</span> {request.lowestPrice}
                      </div>
                      <div>
                        <span className="font-medium">Fastest Delivery:</span> {request.fastestDelivery}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'NEW OFFERS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleViewOffers(request.id)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                    >
                      View Offers
                    </button>
                    {request.status === 'PENDING' && (
                      <button
                        onClick={() => handleRemindSuppliers(request.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Remind Suppliers
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link 
              to="/buyer/orders"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-primary">add</span>
                <div>
                  <h3 className="font-semibold text-gray-900">New Request</h3>
                  <p className="text-sm text-gray-500">Create a new material request</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/buyer/counter-offers"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-secondary">swap_horiz</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Counter Offers</h3>
                  <p className="text-sm text-gray-500">Negotiate with suppliers</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/buyer/my-company"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-green-600">business</span>
                <div>
                  <h3 className="font-semibold text-gray-900">My Company</h3>
                  <p className="text-sm text-gray-500">Manage company profile</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BuyerHome;
