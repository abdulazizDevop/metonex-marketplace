import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../utils/api';

const SupplierAcceptance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState(null);

  // URL dan request ID ni olish
  const requestId = location.state?.requestId || new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      // Real API call
      // const response = await api.get(`/supplier/requests/${requestId}`);
      // setRequestData(response.data);
      
      // Mock data for now
      setRequestData({
        id: requestId,
        title: 'Concrete Mix',
        quantity: '50 cubic yards',
        buyerId: '12345',
        deadline: '2024-08-15',
        status: 'accepted'
      });
    } catch (error) {
      console.error('Error fetching request details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      setLoading(true);
      // Real API call
      // await api.post(`/supplier/requests/${requestId}/accept`);
      
      // Mock success
      console.log('Request accepted successfully');
      
      // Navigate to success page or back to requests
      navigate('/supplier/requests', { 
        state: { 
          message: 'So\'rov muvaffaqiyatli qabul qilindi',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRequest = async () => {
    try {
      setLoading(true);
      // Real API call
      // await api.post(`/supplier/requests/${requestId}/decline`);
      
      // Mock success
      console.log('Request declined successfully');
      
      // Navigate back to requests
      navigate('/supplier/requests', { 
        state: { 
          message: 'So\'rov rad etildi',
          type: 'info'
        }
      });
    } catch (error) {
      console.error('Error declining request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/supplier/requests');
  };

  const handleDone = () => {
    navigate('/supplier/requests');
  };

  if (loading && !requestData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="w-8"></div>
        <h1 className="text-base font-semibold text-gray-900">MetOneX</h1>
        <button 
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-gray-900">
            close
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-8 pb-16">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-green-500" style={{fontSize: '64px'}}>
              check_circle
            </span>
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          So'rovni qabul qildingiz
        </h2>
        <p className="text-lg text-gray-600 max-w-xs mb-6">
          Xaridorning qabul qilishini kuting
        </p>

        {/* Request Details */}
        {requestData && (
          <div className="w-full max-w-sm bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              So'rov tafsilotlari
            </h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Mahsulot:</span>
                <span className="font-medium text-gray-900">{requestData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Miqdor:</span>
                <span className="font-medium text-gray-900">{requestData.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Xaridor ID:</span>
                <span className="font-medium text-gray-900">{requestData.buyerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Muddat:</span>
                <span className="font-medium text-gray-900">
                  {new Date(requestData.deadline).toLocaleDateString('uz-UZ')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Status Info */}
        <div className="w-full max-w-sm bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-blue-600 mr-2">
              info
            </span>
            <span className="text-blue-800 font-medium">Holat</span>
          </div>
          <p className="text-blue-700 text-sm">
            Sizning javobingiz xaridorga yuborildi. Xaridor qabul qilgandan so'ng, 
            buyurtma jarayoni boshlanadi.
          </p>
        </div>

        {/* Next Steps */}
        <div className="w-full max-w-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Keyingi qadamlar:
          </h4>
          <div className="space-y-2 text-left">
            <div className="flex items-start">
              <span className="material-symbols-outlined text-green-500 mr-2 mt-0.5">
                check_circle
              </span>
              <span className="text-gray-700 text-sm">
                So'rovni qabul qildingiz
              </span>
            </div>
            <div className="flex items-start">
              <span className="material-symbols-outlined text-yellow-500 mr-2 mt-0.5">
                schedule
              </span>
              <span className="text-gray-700 text-sm">
                Xaridorning javobini kuting
              </span>
            </div>
            <div className="flex items-start">
              <span className="material-symbols-outlined text-gray-400 mr-2 mt-0.5">
                pending
              </span>
              <span className="text-gray-500 text-sm">
                Buyurtma tasdiqlangandan so'ng to'lov jarayoni
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-white sticky bottom-0">
        <button 
          onClick={handleDone}
          disabled={loading}
          className="w-full h-12 px-5 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Yuklanmoqda...' : 'Tayyor'}
        </button>
      </footer>
    </div>
  );
};

export default SupplierAcceptance;
