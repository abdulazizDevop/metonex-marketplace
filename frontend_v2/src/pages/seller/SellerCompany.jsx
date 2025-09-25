import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerCompany = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'team', 'settings'

  const [companyData] = useState({
    name: 'BuildRight Supplies',
    id: '789012',
    type: 'Construction Materials Supplier',
    established: '2015',
    location: 'Tashkent, Uzbekistan',
    employees: 25,
    rating: 4.7,
    totalOrders: 500,
    revenue: '$2.5M',
    team: [
      {
        id: 1,
        name: 'Ava Chen',
        position: 'CEO',
        email: 'ava.chen@buildright.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://placehold.co/40x40',
        isActive: true
      },
      {
        id: 2,
        name: 'Leo Martinez',
        position: 'Accountant',
        email: 'leo.martinez@buildright.com',
        phone: '+1 (555) 234-5678',
        avatar: 'https://placehold.co/40x40',
        isActive: true
      },
      {
        id: 3,
        name: 'Sarah Johnson',
        position: 'Sales Manager',
        email: 'sarah.johnson@buildright.com',
        phone: '+1 (555) 345-6789',
        avatar: 'https://placehold.co/40x40',
        isActive: false
      }
    ],
    settings: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      privacy: {
        profileVisible: true,
        contactVisible: true,
        ordersVisible: false
      },
      business: {
        workingHours: '9:00 AM - 6:00 PM',
        timezone: 'UZT (UTC+5)',
        currency: 'UZS'
      }
    }
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditCompany = () => {
    console.log('Editing company details...');
  };

  const handleAddTeamMember = () => {
    console.log('Adding new team member...');
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Company Info */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Company Information</h2>
          <button
            onClick={handleEditCompany}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Company Name</p>
            <p className="font-semibold text-gray-900">{companyData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Company ID</p>
            <p className="font-semibold text-gray-900">{companyData.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-semibold text-gray-900">{companyData.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Established</p>
            <p className="font-semibold text-gray-900">{companyData.established}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold text-gray-900">{companyData.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Employees</p>
            <p className="font-semibold text-gray-900">{companyData.employees}</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-purple-600">{companyData.rating}</p>
          <p className="text-sm text-gray-500">Rating</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{companyData.totalOrders}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{companyData.revenue}</p>
          <p className="text-sm text-gray-500">Revenue</p>
        </div>
      </section>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
        <button
          onClick={handleAddTeamMember}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          Add Member
        </button>
      </div>

      <div className="space-y-4">
        {companyData.team.map((member) => (
          <div key={member.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                    member.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{member.position}</p>
                <p className="text-sm text-gray-600">{member.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCall(member.phone)}
                  className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">call</span>
                </button>
                <button
                  onClick={() => handleEmail(member.email)}
                  className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">mail</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Notifications */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Notification Settings</h2>
        <div className="space-y-4">
          {Object.entries(companyData.settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">{key} Notifications</p>
                <p className="text-sm text-gray-500">Receive {key} notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={value}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Privacy Settings</h2>
        <div className="space-y-4">
          {Object.entries(companyData.settings.privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-sm text-gray-500">Make {key.replace(/([A-Z])/g, ' $1').toLowerCase()} visible to others</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={value}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Business */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Business Settings</h2>
        <div className="space-y-4">
          {Object.entries(companyData.settings.business).map(([key, value]) => (
            <div key={key}>
              <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'team':
        return renderTeam();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between overflow-x-hidden bg-gray-50">
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">My Company</h1>
          <div className="w-10"></div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { id: 'overview', label: 'Overview', icon: 'business' },
            { id: 'team', label: 'Team', icon: 'group' },
            { id: 'settings', label: 'Settings', icon: 'settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {renderTabContent()}
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => navigate('/seller/dashboard')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate('/seller/requests')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs font-medium">Requests</span>
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
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <span className="material-symbols-outlined">business</span>
            <span className="text-xs font-bold">Company</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SellerCompany;
