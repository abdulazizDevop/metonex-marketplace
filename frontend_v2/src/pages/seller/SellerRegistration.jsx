import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SellerRegistration = () => {
  const navigate = useNavigate()
  
  // Tasdiqlangan telefon raqamni localStorage'dan olish
  const verifiedPhone = localStorage.getItem('registrationPhone') || ''
  
  const [formData, setFormData] = useState({
    // User data
    phone: verifiedPhone, // Avtomatik olinadi va o'zgartirib bo'lmaydi
    password: '',
    confirmPassword: '',
    supplierType: 'manufacturer', // manufacturer or dealer
    
    // Company data
    companyName: '',
    legalAddress: '',
    innStir: '',
    
    // Bank details
    bankName: '',
    accountNumber: '',
    mfo: '',
    inn: '',
    
    // Accountant contact
    accountantName: '',
    accountantPhone: '',
    accountantEmail: '',
    
    // Additional
    telegramOwner: '',
    
    // Documents
    companyLicense: null,
    taxCertificate: null,
    bankStatement: null,
    otherDocuments: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleFileUpload = (fieldName, file) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }))
    setError('')
  }

  const handleMultipleFileUpload = (files) => {
    setFormData(prev => ({
      ...prev,
      otherDocuments: [...prev.otherDocuments, ...files]
    }))
    setError('')
  }

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      otherDocuments: prev.otherDocuments.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.phone.trim() || !formData.password.trim() || !formData.companyName.trim() || !formData.innStir.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store registration data
      const registrationData = {
        user: {
          phone: formData.phone,
          password: formData.password,
          role: 'supplier',
          supplier_type: formData.supplierType
        },
        company: {
          name: formData.companyName,
          legal_address: formData.legalAddress,
          inn_stir: formData.innStir,
          bank_details: {
            bank_name: formData.bankName,
            account_number: formData.accountNumber,
            mfo: formData.mfo,
            inn: formData.inn
          },
          accountant_contact: {
            name: formData.accountantName,
            phone: formData.accountantPhone,
            email: formData.accountantEmail
          },
          telegram_owner: formData.telegramOwner
        },
        completedAt: new Date().toISOString()
      }
      
      localStorage.setItem('sellerRegistrationData', JSON.stringify(registrationData))
      
      // Navigate to seller dashboard
      navigate('/seller/dashboard')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/registration/phone-verification-code')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm z-10 px-6 py-4">
        <div className="relative flex items-center justify-center">
          <button onClick={handleBack} className="absolute left-0 text-gray-800">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Supplier Registration</h1>
        </div>
      </header>

      <main className="flex-grow px-6 py-8">
        <form id="registration-form" onSubmit={handleSubmit} className="space-y-6">
          {/* User Information Section */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                  Phone Number * (Verified)
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="+998XXXXXXXXX"
                  type="tel"
                  disabled
                  required
                />
                <p className="text-xs text-green-600 mt-1">✓ Phone number verified</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter password"
                  type="password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirmPassword">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Confirm password"
                  type="password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Supplier Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      id: 'manufacturer',
                      icon: 'factory',
                      label: 'Manufacturer',
                      description: 'I produce equipment'
                    },
                    {
                      id: 'dealer',
                      icon: 'local_shipping',
                      label: 'Dealer',
                      description: 'I resell equipment'
                    }
                  ].map((role) => (
                    <div
                      key={role.id}
                      className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        formData.supplierType === role.id 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, supplierType: role.id }))}
                    >
                      <div className="flex flex-col items-center text-center">
                        <span 
                          className={`material-symbols-outlined text-3xl mb-2 ${
                            formData.supplierType === role.id ? 'text-blue-500' : 'text-gray-400'
                          }`}
                        >
                          {role.icon}
                        </span>
                        <span className={`text-sm font-semibold mb-1 ${
                          formData.supplierType === role.id ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {role.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {role.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Company Information Section */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="companyName">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Your Company LLC"
                  type="text"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="legalAddress">
                  Legal Address
                </label>
                <textarea
                  id="legalAddress"
                  name="legalAddress"
                  value={formData.legalAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter legal address"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="innStir">
                  INN/STIR *
                </label>
                <input
                  id="innStir"
                  name="innStir"
                  value={formData.innStir}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter INN/STIR"
                  type="text"
                  required
                />
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bankName">
                  Bank Name
                </label>
                <input
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Bank name"
                  type="text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="accountNumber">
                  Account Number
                </label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Account number"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="mfo">
                    MFO
                  </label>
                  <input
                    id="mfo"
                    name="mfo"
                    value={formData.mfo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="MFO"
                    type="text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="inn">
                    INN
                  </label>
                  <input
                    id="inn"
                    name="inn"
                    value={formData.inn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="INN"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Accountant Contact Section */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accountant Contact</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="accountantName">
                  Accountant Name
                </label>
                <input
                  id="accountantName"
                  name="accountantName"
                  value={formData.accountantName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Accountant name"
                  type="text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="accountantPhone">
                  Accountant Phone
                </label>
                <input
                  id="accountantPhone"
                  name="accountantPhone"
                  value={formData.accountantPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="+998XXXXXXXXX"
                  type="tel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="accountantEmail">
                  Accountant Email
                </label>
                <input
                  id="accountantEmail"
                  name="accountantEmail"
                  value={formData.accountantEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="accountant@company.com"
                  type="email"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="telegramOwner">
                Telegram Owner
              </label>
              <input
                id="telegramOwner"
                name="telegramOwner"
                value={formData.telegramOwner}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="@username"
                type="text"
              />
            </div>
          </div>

          {/* Documents Upload Section */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
            
            <div className="space-y-4">
              {/* Company License */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company License *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('companyLicense', e.target.files[0])}
                    className="hidden"
                    id="companyLicense"
                  />
                  <label htmlFor="companyLicense" className="cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                    <p className="text-sm text-gray-600">
                      {formData.companyLicense ? formData.companyLicense.name : 'Click to upload company license'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  </label>
                </div>
              </div>

              {/* Tax Certificate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Certificate *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('taxCertificate', e.target.files[0])}
                    className="hidden"
                    id="taxCertificate"
                  />
                  <label htmlFor="taxCertificate" className="cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                    <p className="text-sm text-gray-600">
                      {formData.taxCertificate ? formData.taxCertificate.name : 'Click to upload tax certificate'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  </label>
                </div>
              </div>

              {/* Bank Statement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Statement
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('bankStatement', e.target.files[0])}
                    className="hidden"
                    id="bankStatement"
                  />
                  <label htmlFor="bankStatement" className="cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                    <p className="text-sm text-gray-600">
                      {formData.bankStatement ? formData.bankStatement.name : 'Click to upload bank statement'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  </label>
                </div>
              </div>

              {/* Other Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleMultipleFileUpload(Array.from(e.target.files))}
                    className="hidden"
                    id="otherDocuments"
                  />
                  <label htmlFor="otherDocuments" className="cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                    <p className="text-sm text-gray-600">Click to upload other documents</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB each)</p>
                  </label>
                </div>
                
                {/* Uploaded Files List */}
                {formData.otherDocuments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.otherDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg border">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </form>
      </main>

      <footer className="px-6 py-4 bg-white sticky bottom-0">
        <button
          type="submit"
          form="registration-form"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Registering...
            </div>
          ) : (
            'Complete Registration'
          )}
        </button>
      </footer>
    </div>
  )
}

export default SellerRegistration
