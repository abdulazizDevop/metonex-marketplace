import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userApi from '../../utils/userApi';

const BuyerEditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Flow tracking state
  const [flowData, setFlowData] = useState({
    fromRegistration: false,
    flowStep: null,
    nextStep: null,
    registrationData: null
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    companyName: '',
    contactPerson: '',
    address: '',
    taxId: '',
    password: '••••••••'
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Load profile data from backend
  const loadProfileData = async () => {
    setInitialLoading(true);
    try {
      const [profileRes, companyRes, teamRes] = await Promise.allSettled([
        userApi.getProfile(),
        userApi.getCompany(),
        userApi.getTeamMembers()
      ]);

      if (profileRes.status === 'fulfilled') {
        const profile = profileRes.value;
        setFormData(prev => ({
          ...prev,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phoneNumber: profile.phone || '',
          email: profile.email || ''
        }));
      }

      if (companyRes.status === 'fulfilled') {
        const company = companyRes.value;
        setFormData(prev => ({
          ...prev,
          companyName: company.name || '',
          contactPerson: company.accountant_contact?.name || '',
          address: company.legal_address || '',
          taxId: company.inn_stir || ''
        }));
      }

      if (teamRes.status === 'fulfilled') {
        setTeamMembers(teamRes.value || []);
      }

    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Initialize flow data from location state
  useEffect(() => {
    if (location.state) {
      setFlowData({
        fromRegistration: location.state.fromRegistration || false,
        flowStep: location.state.flowStep || null,
        nextStep: location.state.nextStep || null,
        registrationData: location.state.registrationData || null
      });
      
      // Pre-populate form with registration data if available
      if (location.state.registrationData) {
        const regData = location.state.registrationData;
        setFormData(prev => ({
          ...prev,
          companyName: regData.company?.name || prev.companyName,
          contactPerson: regData.company?.accountant_contact?.name || prev.contactPerson,
          phoneNumber: regData.user?.phone || prev.phoneNumber,
          email: regData.company?.accountant_contact?.email || prev.email,
          address: regData.company?.legal_address || prev.address
        }));
      }
    }
    
    // Load profile data
    loadProfileData();
  }, [location.state]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // User profile ma'lumotlarini yangilash
      const userUpdateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email
      };

      // Company ma'lumotlarini yangilash
      const companyUpdateData = {
        name: formData.companyName,
        legal_address: formData.address,
        inn_stir: formData.taxId,
        accountant_contact: {
          name: formData.contactPerson,
          email: formData.email
        }
      };

      // API chaqiruvlari
      const [userRes, companyRes] = await Promise.allSettled([
        userApi.updateProfile(userUpdateData),
        userApi.updateCompany(companyUpdateData)
      ]);

      if (userRes.status === 'rejected') {
        console.error('User yangilashda xatolik:', userRes.reason);
      }

      if (companyRes.status === 'rejected') {
        console.error('Company yangilashda xatolik:', companyRes.reason);
      }

      // Muvaffaqiyatli saqlandi
      alert('Ma\'lumotlar muvaffaqiyatli saqlandi');
      
      // Navigate based on flow context
      if (flowData.fromRegistration && flowData.nextStep) {
        navigate(flowData.nextStep, { 
          state: { 
            fromProfileSetup: true,
            flowStep: 'dashboard-entry'
          } 
        });
      } else {
        navigate('/buyer/profile');
      }
    } catch (error) {
      console.error('Ma\'lumotlarni saqlashda xatolik:', error);
      alert('Ma\'lumotlarni saqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (flowData.fromRegistration) {
      // If from registration, go back to registration
      navigate('/buyer/registration');
    } else {
      navigate('/buyer/profile');
    }
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

  const handleAddTeamMember = async () => {
    try {
      const newMemberData = {
        name: 'Yangi a\'zo',
        role: 'MEMBER',
        phone: '',
        email: ''
      };
      
      const response = await userApi.addTeamMember(newMemberData);
      setTeamMembers(prev => [...prev, response]);
      alert('Yangi a\'zo qo\'shildi');
    } catch (error) {
      console.error('A\'zo qo\'shishda xatolik:', error);
      alert('A\'zo qo\'shishda xatolik yuz berdi');
    }
  };

  const handleTeamMemberChange = async (id, field, value) => {
    // Local state'ni darhol yangilash
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
    
    // Backend'ga yuborish (debounce qilish mumkin)
    try {
      const member = teamMembers.find(m => m.id === id);
      if (member) {
        const updateData = { ...member, [field]: value };
        await userApi.updateTeamMember(id, updateData);
      }
    } catch (error) {
      console.error('A\'zo yangilashda xatolik:', error);
    }
  };

  const handleDeleteTeamMember = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDeleteTeamMember = async (id) => {
    try {
      await userApi.deleteTeamMember(id);
      setTeamMembers(prev => prev.filter(member => member.id !== id));
      setShowDeleteConfirm(null);
      alert('A\'zo o\'chirildi');
    } catch (error) {
      console.error('A\'zo o\'chirishda xatolik:', error);
      alert('A\'zo o\'chirishda xatolik yuz berdi');
      setShowDeleteConfirm(null);
    }
  };

  const handleUploadAvatar = (id) => {
    console.log('Upload avatar for member:', id);
    // In real app, this would open file picker
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4FFF] mb-4"></div>
        <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>

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
            disabled={loading}
            className="flex-1 h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#a35ee8] text-base font-bold text-white shadow-lg shadow-[#a35ee8]/30 hover:bg-[#8e4dd1] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="truncate">Saving...</span>
              </div>
            ) : (
              <span className="truncate">Save Changes</span>
            )}
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
