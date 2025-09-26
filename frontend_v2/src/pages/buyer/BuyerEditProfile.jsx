import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerEditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: 'O\'zbekiston Qurilish MChJ',
    contactPerson: 'John Doe',
    phoneNumber: '+998 90 123 45 67',
    email: 'john.doe@uzbekiston-qurilish.uz',
    address: 'Tashkent, Uzbekistan',
    taxId: '••••-•••-••98',
    password: '••••••••'
  });

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      role: 'Purchasing Manager',
      phone: '+998 90 123 45 67',
      email: 'john.doe@uzbekiston-qurilish.uz',
      avatar: 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=JD'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      role: 'Accountant',
      phone: '+998 90 234 56 78',
      email: 'sarah.wilson@uzbekiston-qurilish.uz',
      avatar: 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=SW'
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
    navigate('/buyer/profile');
  };

  const handleCancel = () => {
    navigate('/buyer/profile');
  };

  const handleSupport = () => {
    navigate('/support');
  };

  const handlePhoneEdit = () => {
    navigate('/registration/step-1');
  };

  const handleTaxIdEdit = () => {
    console.log('Edit Tax ID');
    // In real app, this would open a modal or navigate to tax ID edit page
  };

  const handlePasswordEdit = () => {
    console.log('Edit Password');
    // In real app, this would open a modal or navigate to password change page
  };

  const handleAddTeamMember = () => {
    const newMember = {
      id: Date.now(),
      name: '',
      role: '',
      phone: '',
      email: '',
      avatar: 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=+'
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const handleTeamMemberChange = (id, field, value) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleDeleteTeamMember = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDeleteTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleUploadAvatar = (id) => {
    console.log('Upload avatar for member:', id);
    // In real app, this would open file picker
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between group/design-root overflow-x-hidden bg-white">
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleCancel}
            className="flex size-10 items-center justify-center rounded-full text-[#140e1b] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#140e1b]">Edit Profile</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-white p-4">
          <div className="space-y-6">
            {/* Company Information */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b] mb-4">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                    />
                    <button
                      onClick={handlePhoneEdit}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Security Information */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b] mb-4">Security Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                    />
                    <button
                      onClick={handleTaxIdEdit}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                    />
                    <button
                      onClick={handlePasswordEdit}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Team Members */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#140e1b]">Team Members</h2>
                <button
                  onClick={handleAddTeamMember}
                  className="px-4 py-2 bg-[#a35ee8] text-white rounded-lg hover:bg-[#8e4dd1] transition-colors"
                >
                  Add Member
                </button>
              </div>
              
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <button
                          onClick={() => handleUploadAvatar(member.id)}
                          className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#a35ee8] text-white rounded-full flex items-center justify-center text-xs hover:bg-[#8e4dd1] transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">camera_alt</span>
                        </button>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#a35ee8] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => handleTeamMemberChange(member.id, 'role', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#a35ee8] focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                            <input
                              type="text"
                              value={member.phone}
                              onChange={(e) => handleTeamMemberChange(member.id, 'phone', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#a35ee8] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                            <input
                              type="email"
                              value={member.email}
                              onChange={(e) => handleTeamMemberChange(member.id, 'email', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#a35ee8] focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteTeamMember(member.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 border-t border-gray-100 bg-white/95 pb-safe">
        <div className="flex gap-4 p-4">
          <button 
            onClick={handleCancel}
            className="flex-1 h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-gray-300 text-base font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="truncate">Cancel</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#a35ee8] text-base font-bold text-white shadow-lg shadow-[#a35ee8]/30 hover:bg-[#8e4dd1] transition-colors"
          >
            <span className="truncate">Save Changes</span>
          </button>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-bold text-[#140e1b] mb-2">Delete Team Member</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this team member? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteTeamMember(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default BuyerEditProfile;
