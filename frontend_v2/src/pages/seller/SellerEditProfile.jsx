import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerEditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: 'MetOneX Construction',
    contactPerson: 'Alex Doe',
    phoneNumber: '+1 234 567 890',
    taxId: '••••-•••-••98',
    password: '••••••••'
  });

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'John Smith',
      role: 'Admin',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSOmfLWSDpgKz_inzQemxovmCtBRH4BZw9AIps3MQKStbFtH5Zk88SSkv6eAB-sHYNTOXfqOAZksZNVc48HscC4MDiOzh4_pylEL_1M49EtLKjgPLS73mIDc0thQSQM3ch-iv3ltmDVZhtTDPTA_SeGtRGoY0enPJOOAC1ZZ6250ooa6jIwHmnFQhFUyNyXlLdqDdsIEh3-v-XVOnebZbRKR3tno9VibeUdn6k4Bgg6yRIT4gYCA4sszrozR0MV1H4sKLvCzGJ4ko'
    }
  ]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', formData);
    navigate('/seller/profile');
  };

  const handleCancel = () => {
    navigate('/seller/profile');
  };

  const handleSupport = () => {
    navigate('/support');
  };

  const handlePhoneEdit = () => {
    navigate('/registration/step-1');
  };

  const handleTaxIdEdit = () => {
    console.log('Edit Tax ID');
  };

  const handleBankAccounts = () => {
    console.log('Manage bank accounts');
  };

  const handlePasswordChange = () => {
    console.log('Change password');
  };

  const handleDeleteTeamMember = (memberId) => {
    setShowDeleteConfirm(memberId);
  };

  const confirmDeleteTeamMember = (memberId) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    setShowDeleteConfirm(null);
  };

  const handleAddTeamMember = () => {
    navigate('/manage-team-members');
  };

  const handleProductCategories = () => {
    console.log('Manage product categories');
  };

  const handleBusinessHours = () => {
    console.log('Manage business hours');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between group/design-root overflow-x-hidden bg-gray-50">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10">
          <button 
            onClick={handleCancel}
            className="text-gray-800 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>
          <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Edit Profile</h2>
          <button 
            onClick={handleSupport}
            className="text-purple-600 text-base font-medium leading-normal hover:text-purple-700 transition-colors"
          >
            Support
          </button>
        </div>

        {/* Main Content */}
        <div className="px-4 mt-2">
          {/* Company Information */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <label className="flex flex-col">
                <p className="text-gray-500 text-xs font-medium leading-normal pb-1">Company Name</p>
                <input 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 focus:outline-0 focus:ring-0 border-none bg-transparent p-0 text-base font-normal leading-normal"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                />
              </label>
            </div>
            <div className="p-4">
              <label className="flex flex-col">
                <p className="text-gray-500 text-xs font-medium leading-normal pb-1">Contact Person</p>
                <input 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 focus:outline-0 focus:ring-0 border-none bg-transparent p-0 text-base font-normal leading-normal"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder="Enter contact person name"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Account & Security */}
        <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">Account & Security</h2>
        <div className="px-4">
          <div className="bg-white rounded-xl shadow-sm">
            <button 
              onClick={handlePhoneEdit}
              className="p-4 border-b flex items-center justify-between w-full hover:bg-gray-50 transition-colors"
            >
              <p className="text-gray-900 text-base font-normal leading-normal">Phone Number</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-base font-normal leading-normal">{formData.phoneNumber}</p>
                <div className="text-gray-400">
                  <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </div>
              </div>
            </button>
            
            <button 
              onClick={handleTaxIdEdit}
              className="p-4 border-b flex items-center justify-between w-full hover:bg-gray-50 transition-colors"
            >
              <p className="text-gray-900 text-base font-normal leading-normal">Tax ID Number (TIN)</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-base font-normal leading-normal">{formData.taxId}</p>
                <div className="text-gray-400">
                  <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </div>
              </div>
            </button>
            
            <button 
              onClick={handleBankAccounts}
              className="p-4 border-b flex items-center justify-between w-full hover:bg-gray-50 transition-colors"
            >
              <p className="text-gray-900 text-base font-normal leading-normal">Bank Accounts</p>
              <div className="text-gray-400">
                <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                </svg>
              </div>
            </button>
            
            <button 
              onClick={handlePasswordChange}
              className="p-4 flex items-center justify-between w-full hover:bg-gray-50 transition-colors"
            >
              <p className="text-gray-900 text-base font-normal leading-normal">Password</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-base font-normal leading-normal">{formData.password}</p>
                <div className="text-gray-400">
                  <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Team Management */}
        <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">Team Management</h2>
        <div className="px-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <img 
                  alt="Team member avatar" 
                  className="rounded-full size-12" 
                  src={member.avatar}
                />
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-gray-900 text-base font-medium leading-normal line-clamp-1">{member.name}</p>
                  <p className="text-gray-500 text-sm font-normal leading-normal line-clamp-2">{member.role}</p>
                </div>
                <button 
                  onClick={() => handleDeleteTeamMember(member.id)}
                  className="text-red-500 flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM200,208H56V64H200ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                  </svg>
                </button>
              </div>
            ))}
            
            <button 
              onClick={handleAddTeamMember}
              className="flex items-center gap-4 mt-4 pt-4 border-t hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="text-purple-600 flex items-center justify-center rounded-lg shrink-0 size-12 bg-purple-50">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                </svg>
              </div>
              <p className="text-purple-600 text-base font-medium leading-normal flex-1 truncate">Add Team Member</p>
            </button>
          </div>
        </div>

        {/* More Options */}
        <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">More Options</h2>
        <div className="px-4 pb-4">
          <div className="bg-white rounded-xl shadow-sm p-2">
            <button 
              onClick={handleProductCategories}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 w-full transition-colors"
            >
              <div className="text-gray-600 flex items-center justify-center rounded-lg bg-gray-100 shrink-0 size-10">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path>
                </svg>
              </div>
              <p className="text-gray-900 text-base font-normal leading-normal flex-1 truncate">Product Categories</p>
            </button>
            
            <button 
              onClick={handleBusinessHours}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 w-full transition-colors"
            >
              <div className="text-gray-600 flex items-center justify-center rounded-lg bg-gray-100 shrink-0 size-10">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                </svg>
              </div>
              <p className="text-gray-900 text-base font-normal leading-normal flex-1 truncate">Business Hours</p>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm pt-4 pb-2">
        <div className="flex justify-stretch px-4 gap-3">
          <button 
            onClick={handleCancel}
            className="flex flex-1 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-gray-200 text-gray-800 text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 transition-colors"
          >
            <span className="truncate">Cancel</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex flex-1 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#a35ee8] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#8e4dd1] transition-colors"
          >
            <span className="truncate">Save Changes</span>
          </button>
        </div>
        
        {/* Bottom Navigation */}
        <div className="flex gap-2 border-t border-gray-200 mt-4 px-4 pb-3 pt-2">
          <button 
            onClick={() => handleNavigation('/seller')}
            className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <div className="flex h-8 items-center justify-center">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
              </svg>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
          </button>
          
          <button 
            onClick={() => handleNavigation('/seller/my-requests')}
            className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <div className="flex h-8 items-center justify-center">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path>
              </svg>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Requests</p>
          </button>
          
          <button 
            onClick={() => handleNavigation('/seller/add-product')}
            className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <div className="flex h-8 items-center justify-center">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"></path>
              </svg>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Products</p>
          </button>
          
          <button className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-purple-600">
            <div className="flex h-8 items-center justify-center">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M172,120a44,44,0,1,1-44-44A44.05,44.05,0,0,1,172,120Zm60,8A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88.09,88.09,0,0,0-91.47-87.93C77.43,41.89,39.87,81.12,40,128.25a87.65,87.65,0,0,0,22.24,58.16A79.71,79.71,0,0,1,84,165.1a4,4,0,0,1,4.83.32,59.83,59.83,0,0,0,78.28,0,4,4,0,0,1,4.83-.32,79.71,79.71,0,0,1,21.79,21.31A87.62,87.62,0,0,0,216,128Z"></path>
              </svg>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Profile</p>
          </button>
        </div>
        <div className="h-5 bg-gray-50"></div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Team Member</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to remove this team member? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => confirmDeleteTeamMember(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerEditProfile;
