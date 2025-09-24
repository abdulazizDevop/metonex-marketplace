import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FullOrderDetails = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const orderDetails = {
    orderId: 'ORD-2024-001',
    status: 'In Progress',
    orderDate: '2024-01-10',
    deliveryDate: '2024-01-15',
    supplier: {
      name: 'Metro Construction Supplies',
      rating: 4.8,
      location: 'Tashkent, Uzbekistan',
      phone: '+998 90 123 45 67'
    },
    product: {
      name: 'Concrete Mix M300',
      category: 'Construction Materials',
      quantity: 100,
      unit: 'bags',
      unitPrice: 25.00,
      totalPrice: 2500.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDICQME4K3tqpbsec2hFc6iWZGwttVSNo-i0s5VE8X5IveiOvfGMrlwuQ5e-FKH--LDFAdNCWkstx89kbUWUAsbjiduNs0sW4aVLupGnPKdc7otgz7ASCo02iZAnW1lo9pJVL3XeUeiok1W6yQhDuoDp_DssIkI5DGtxQ2C6BsMbykjRYM3A1zu0qQ9j8PgbS58M5ES4YvXpnTJbzDZt7vrm1lypaM6zkT3oltLk1MzsrV6THbBQDOgh2841POfA_2BBNJMWbvcZN8'
    },
    delivery: {
      address: 'Tashkent, Chilonzor district, Bunyodkor avenue, 12',
      method: 'Standard Delivery',
      trackingNumber: 'TRK-2024-001',
      status: 'In Transit'
    },
    payment: {
      method: 'Bank Transfer',
      status: 'Paid',
      transactionId: 'TXN-2024-001234',
      paidDate: '2024-01-10'
    }
  }

  const orderTimeline = [
    { date: '2024-01-10', time: '09:00', status: 'Order Placed', description: 'Order was successfully placed' },
    { date: '2024-01-10', time: '10:30', status: 'Payment Confirmed', description: 'Payment has been received' },
    { date: '2024-01-11', time: '14:15', status: 'Processing', description: 'Order is being prepared' },
    { date: '2024-01-12', time: '11:00', status: 'Shipped', description: 'Order has been shipped' },
    { date: '2024-01-13', time: '16:30', status: 'In Transit', description: 'Order is on the way' }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'info' },
    { id: 'timeline', label: 'Timeline', icon: 'schedule' },
    { id: 'documents', label: 'Documents', icon: 'description' },
    { id: 'support', label: 'Support', icon: 'support_agent' }
  ]

  const handleBack = () => {
    navigate(-1)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in progress': return 'text-blue-600 bg-blue-100'
      case 'in transit': return 'text-purple-600 bg-purple-100'
      case 'paid': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-600">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{orderDetails.orderId}</h2>
              <p className="text-gray-600">Ordered on {orderDetails.orderDate}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
              {orderDetails.status}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Delivery Date</p>
              <p className="font-medium">{orderDetails.deliveryDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-bold text-purple-600">${orderDetails.product.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Product Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
                  <div className="flex items-start space-x-4">
                    <img 
                      src={orderDetails.product.image}
                      alt={orderDetails.product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{orderDetails.product.name}</h4>
                      <p className="text-gray-600">{orderDetails.product.category}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">Quantity: {orderDetails.product.quantity} {orderDetails.product.unit}</span>
                        <span className="text-sm text-gray-600">Unit Price: ${orderDetails.product.unitPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supplier Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Supplier Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{orderDetails.supplier.name}</h4>
                      <div className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                        <span className="text-sm font-medium">{orderDetails.supplier.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{orderDetails.supplier.location}</p>
                    <p className="text-gray-600 text-sm">{orderDetails.supplier.phone}</p>
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium text-right max-w-xs">{orderDetails.delivery.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium">{orderDetails.delivery.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="font-medium">{orderDetails.delivery.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderDetails.delivery.status)}`}>
                        {orderDetails.delivery.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium">{orderDetails.payment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderDetails.payment.status)}`}>
                        {orderDetails.payment.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium">{orderDetails.payment.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid Date:</span>
                      <span className="font-medium">{orderDetails.payment.paidDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Timeline</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
                  {orderTimeline.map((event, index) => (
                    <div key={index} className="relative flex items-start space-x-4 pb-6">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-white text-sm">check</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{event.status}</h4>
                          <span className="text-sm text-gray-600">{event.date} at {event.time}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Documents</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Invoice.pdf', type: 'Invoice', size: '2.4 MB' },
                    { name: 'Contract.pdf', type: 'Contract', size: '1.8 MB' },
                    { name: 'Receipt.pdf', type: 'Receipt', size: '0.9 MB' }
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-purple-600">description</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors">
                        <span className="material-symbols-outlined text-green-600 text-sm">download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Support & Help</h3>
                <div className="space-y-3">
                  <button className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="material-symbols-outlined text-purple-600">message</span>
                      <div>
                        <p className="font-medium text-gray-900">Contact Supplier</p>
                        <p className="text-sm text-gray-600">Send a message to the supplier</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="material-symbols-outlined text-purple-600">local_shipping</span>
                      <div>
                        <p className="font-medium text-gray-900">Track Order</p>
                        <p className="text-sm text-gray-600">Track your order delivery</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="material-symbols-outlined text-purple-600">support_agent</span>
                      <div>
                        <p className="font-medium text-gray-900">Contact Support</p>
                        <p className="text-sm text-gray-600">Get help from our support team</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullOrderDetails
