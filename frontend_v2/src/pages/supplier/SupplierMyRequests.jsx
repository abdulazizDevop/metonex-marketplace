import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

const SupplierMyRequests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Active');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data - real API integration uchun
  const mockRequests = {
    Active: [
      {
        id: 1,
        status: 'New Request',
        statusColor: 'blue',
        title: 'Concrete Mix',
        quantity: '50 cubic yards',
        buyerId: '12345',
        deadline: '2024-08-15',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMtd6xFAu59KveQ5zXxs6Zg-y2H-tV7vNh2bG_3Q-L6eK9crFXmB9Dj6FB4C_8nRCCxI-qnfBgfXxXEzY7cZOp6p3M9D6jaiGzUdGb-fIzk1fQy-nLdOq40Ymfm2i5fcZOyACqoYWHdq-3YL5QKcRRxKZBY5FXUeyuR0ZLHNelBePN5mPO5Mk1bG8bv4zl-BX3GSuHiT-GZhrbvAPN6x0QzWNdLSFcD8QHHlamBGswAG4JXgrP2rk_BihkMsf2bhC0Gd8opEYEEJ0',
        primaryAction: 'Respond',
        secondaryAction: 'Details'
      },
      {
        id: 2,
        status: 'Offer Sent',
        statusColor: 'yellow',
        title: 'Steel Rebar',
        quantity: '10 tons',
        buyerId: '67890',
        deadline: '2024-08-20',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPWfjik9RT3aOFFN-79YFT3C4vWGmYawPJ1ecahnLD4FvGi1JHLgAmIsMPdtWJ-2eNR2nu32krMWYCyMvJMe8CHxTczzTxQQ1jruJazZ3XFzB_FLONtNA57XEWKP2r2dfLC4-XF8YLQkvM96gXvF8STN11uixAJdmGzDAnRVzi9qJ9wlPEKoDTD-3ShauVLVNnA8TI7grRf3QiImu7SdRnboQ7y21hFIcDP31oP8g6P1eC_ZXRUDS84jaOFDmWc5ubtNHchn9Iodw',
        primaryAction: 'View Offer',
        secondaryAction: 'Details'
      }
    ],
    Pending: [
      {
        id: 3,
        status: 'Under Review',
        statusColor: 'orange',
        title: 'Cement Bags',
        quantity: '100 bags',
        buyerId: '54321',
        deadline: '2024-08-18',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0CqPz1iiIG972tGDHC6VONV4IlCp6cNXx755WGsa_PUMJ20QUrRnYB8rnm9uDefCNTNSvyy5J3UR1iu18mKG4HYtkr9rQt92pOHhUEc2thQFh07EDzS8YUkS8zOL3Ddd8uvYEHTvlA0Kt-5fp0v-vp6SdP-QDsV8BF7PPs03NtNSiJwzDsZEiU-TGTKsmkXxGhoE5pd6EATZSy-GAhjnJ6T2SoUIJjuoSiKfO2XQqgoT5j2K4aTn32xP3wCUMGkMxP7BP33cMMK4',
        primaryAction: 'Track Status',
        secondaryAction: 'Details'
      }
    ],
    Completed: [
      {
        id: 4,
        status: 'Buyer Accepted',
        statusColor: 'green',
        title: 'Lumber',
        quantity: '2000 board feet',
        buyerId: '11223',
        deadline: '2024-08-25',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0CqPz1iiIG972tGDHC6VONV4IlCp6cNXx755WGsa_PUMJ20QUrRnYB8rnm9uDefCNTNSvyy5J3UR1iu18mKG4HYtkr9rQt92pOHhUEc2thQFh07EDzS8YUkS8zOL3Ddd8uvYEHTvlA0Kt-5fp0v-vp6SdP-QDsV8BF7PPs03NtNSiJwzDsZEiU-TGTKsmkXxGhoE5pd6EATZSy-GAhjnJ6T2SoUIJjuoSiKfO2XQqgoT5j2K4aTn32xP3wCUMGkMxP7BP33cMMK4',
        primaryAction: 'View Order Details',
        secondaryAction: 'Details'
      }
    ]
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Real API call
      // const response = await api.get(`/supplier/requests?status=${activeTab}`);
      // setRequests(response.data);
      
      // Mock data for now
      setRequests(mockRequests[activeTab] || []);
      setError(null);
    } catch (err) {
      setError('So\'rovlarni yuklashda xatolik yuz berdi');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePrimaryAction = (request) => {
    switch (request.primaryAction) {
      case 'Respond':
        navigate(`/supplier/respond-request/${request.id}`);
        break;
      case 'View Offer':
        navigate(`/supplier/view-offer/${request.id}`);
        break;
      case 'View Order Details':
        navigate(`/supplier/order-details/${request.id}`);
        break;
      case 'Track Status':
        navigate(`/supplier/track-status/${request.id}`);
        break;
      default:
        console.log('Primary action:', request.primaryAction);
    }
  };

  const handleSecondaryAction = (request) => {
    navigate(`/supplier/request-details/${request.id}`);
  };

  const handleSearch = () => {
    navigate('/supplier/search-requests');
  };

  const getStatusBadgeClass = (statusColor) => {
    const baseClass = "inline-block rounded-full px-3 py-1 text-xs font-semibold";
    switch (statusColor) {
      case 'blue':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'yellow':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'green':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'orange':
        return `${baseClass} bg-orange-100 text-orange-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white px-4 pt-6 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Mening So'rovlarim</h1>
          <button 
            onClick={handleSearch}
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">search</span>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="mt-4">
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-100 p-1">
            {['Active', 'Pending', 'Completed'].map((tab) => (
              <label 
                key={tab}
                className={`flex h-full flex-1 cursor-pointer items-center justify-center rounded-md px-2 text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="truncate">
                  {tab === 'Active' ? 'Faol' : 
                   tab === 'Pending' ? 'Kutilmoqda' : 'Tugallangan'}
                </span>
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
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center text-gray-500 pt-16">
              <span className="material-symbols-outlined text-6xl text-gray-300">
                assignment
              </span>
              <p className="mt-4 text-lg font-medium">Hozircha so'rovlar yo'q</p>
              <p className="text-sm">Yangi so'rov kelganda, bu yerda ko'rinadi.</p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className={getStatusBadgeClass(request.statusColor)}>
                        {request.status}
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-gray-900">
                        {request.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Miqdor:</span> {request.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Xaridor ID:</span> {request.buyerId}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Muddat:</span> {formatDate(request.deadline)}
                      </p>
                    </div>
                    <div 
                      className="ml-4 h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                      style={{backgroundImage: `url("${request.image}")`}}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-2 border-t border-gray-200 p-4">
                  <button 
                    onClick={() => handlePrimaryAction(request)}
                    className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
                  >
                    {request.primaryAction}
                  </button>
                  <button 
                    onClick={() => handleSecondaryAction(request)}
                    className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-200 transition-colors"
                  >
                    Tafsilotlar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => navigate('/supplier/dashboard')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Bosh sahifa</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs font-bold">So'rovlar</span>
          </button>
          <button 
            onClick={() => navigate('/supplier/products')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-xs font-medium">Mahsulotlar</span>
          </button>
          <button 
            onClick={() => navigate('/supplier/profile')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs font-medium">Profil</span>
          </button>
          <button 
            onClick={() => navigate('/supplier/analytics')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-xs font-medium">Tahlil</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SupplierMyRequests;
