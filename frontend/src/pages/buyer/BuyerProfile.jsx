import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RoleGuard from '../../components/RoleGuard.jsx'
import BuyerHeader from '../../components/BuyerHeader.jsx'
import { getMyProfile, updateMyProfile, myStatus, getCompany, updateCompanyProfile, getCompanyMembers, addCompanyMember, removeCompanyMember, getCertificates, addCertificates, deleteCertificate, changeMyPassword, sendPasswordChangeSMS, verifyPasswordChangeSMS } from '../../utils/api.js'

export default function BuyerProfile() {
  const [userData, setUserData] = useState(null)
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'company'
  const [editMode, setEditMode] = useState(false)
  const [editCompanyMode, setEditCompanyMode] = useState(false)
  const [companyId, setCompanyId] = useState('')
  const [preview, setPreview] = useState('')
  const [pwOpen, setPwOpen] = useState(false)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('buyer_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })
  
  // Members state
  const [members, setMembers] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [phone, setPhone] = useState('')
  const [confirm, setConfirm] = useState({ open: false, user_id: null })
  const [confirmAdd, setConfirmAdd] = useState({ open: false, phone: '' })
  
  // Certificates state
  const [certificates, setCertificates] = useState([])
  const [editCertificates, setEditCertificates] = useState(false)
  const [confirmAddCert, setConfirmAddCert] = useState({ open: false, files: null })
  const [confirmDeleteCert, setConfirmDeleteCert] = useState({ open: false, certId: null })
  const [addingCert, setAddingCert] = useState(false)
  const [deletingCert, setDeletingCert] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  async function loadData() {
    try {
      setLoading(true)
      const [user, status] = await Promise.all([
        getMyProfile(),
        myStatus()
      ])
      
      setUserData(user)
      setPreview(user?.image || '')
      setCompanyId(status?.company_id || '')
      setCurrentUserId(status?.user_id || '')
      
      // Agar company bo'lsa, company ma'lumotlarini yuklaymiz
      if (status?.company_id) {
        try {
          const [company, membersList, certsList] = await Promise.all([
            getCompany(status.company_id),
            getCompanyMembers(status.company_id),
            getCertificates(status.company_id)
          ])
          setCompanyData(company)
          setMembers(membersList)
          setCertificates(certsList)
        } catch (error) {
          console.log('Company ma\'lumotlari topilmadi')
        }
      }
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xato:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveUserProfile(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setOk('')
    try {
      const form = e.target
      const fd = new FormData(form)
      const data = await updateMyProfile({ 
        name: fd.get('name'), 
        image: fd.get('image')?.size ? fd.get('image') : undefined 
      })
      setUserData(data)
      setPreview(data?.image || '')
      setOk('Profil saqlandi')
      setEditMode(false)
    } catch (error) {
      setError('Saqlashda xato')
    } finally {
      setSaving(false)
    }
  }

  function onPickImg(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setPreview(URL.createObjectURL(f))
  }

  async function saveCompanyProfile(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setOk('')
    try {
      const form = e.target
      const fd = new FormData(form)
      const payload = {
        inn: fd.get('inn'),
        region: fd.get('region'),
        description: fd.get('description'),
        documents: fd.get('documents')?.size ? fd.get('documents') : undefined,
        logo: fd.get('logo')?.size ? fd.get('logo') : undefined,
      }
      const data = await updateCompanyProfile(companyId, payload)
      setCompanyData(data)
      setOk('Kompaniya saqlandi')
      setEditCompanyMode(false)
    } catch (error) {
      setError('Saqlashda xato')
    } finally {
      setSaving(false)
    }
  }

  // Members functions
  async function addMember(e) {
    e.preventDefault()
    setError('')
    setOk('')
    setConfirmAdd({ open: true, phone })
  }
  
  async function doAdd() {
    setError('')
    setOk('')
    try { 
      const m = await addCompanyMember(companyId, { phone: confirmAdd.phone })
      setMembers(prev => [...prev, m])
      setOk('Qo\'shildi')
      setPhone('')
      setConfirmAdd({ open: false, phone: '' })
    } catch { 
      setError('Qo\'shishda xato')
      setConfirmAdd({ open: false, phone: '' })
    }
  }

  async function doRemove(user_id) {
    try { 
      await removeCompanyMember(companyId, user_id)
      setMembers(prev => prev.filter(m => m.user !== user_id))
      setConfirm({ open: false, user_id: null })
    } catch { 
      setError('O\'chirishda xato')
      setConfirm({ open: false, user_id: null })
    }
  }

  // Certificates functions
  async function onAddCertificates(e) {
    const files = e.target.files
    if (!files?.length) return
    const valid = [].every.call(files, f => f.type && f.type.startsWith('image/'))
    if (!valid) { 
      setError('Faqat rasm fayllari yuklang')
      e.target.value = ''
      return 
    }
    
    const filesArray = Array.from(files)
    setConfirmAddCert({ open: true, files: filesArray })
    e.target.value = ''
  }

  async function doAddCertificates() {
    if (!companyId) {
      setError('Kompaniya ID topilmadi')
      return
    }
    setAddingCert(true)
    setError('')
    setOk('')
    try { 
      await addCertificates(companyId, confirmAddCert.files)
      const updatedCerts = await getCertificates(companyId)
      setCertificates(updatedCerts)
      setOk('Sertifikat qo\'shildi')
    } catch (e) { 
      setError('Sertifikat qo\'shilmadi: ' + (e?.response?.data?.detail || e.message))
    } finally { 
      setAddingCert(false)
      setConfirmAddCert({ open: false, files: null })
    }
  }

  async function onDeleteCertificate(id) {
    setConfirmDeleteCert({ open: true, certId: id })
  }

  async function doDeleteCertificate() {
    setDeletingCert(true)
    setError('')
    setOk('')
    try { 
      await deleteCertificate(companyId, confirmDeleteCert.certId)
      const updatedCerts = await getCertificates(companyId)
      setCertificates(updatedCerts)
      setOk('Sertifikat o\'chirildi')
    } catch { 
      setError('Sertifikat o\'chmadi')
    } finally { 
      setDeletingCert(false)
      setConfirmDeleteCert({ open: false, certId: null })
    }
  }

  if (loading) {
    return (
      <RoleGuard requiredRole="BUYER" requireCompany={true}>
        <div className="min-h-screen bg-gray-50">
          <BuyerHeader showFilters={false} cartCount={getCartItemCount()} />
          <div className="flex items-center justify-center h-64">
          <div className="spinner w-8 h-8"></div>
          </div>
        </div>
      </RoleGuard>
    )
  }

  return (
    <RoleGuard requiredRole="BUYER" requireCompany={true}>
      <div className="min-h-screen bg-green-50">
        <BuyerHeader showFilters={false} cartCount={getCartItemCount()} />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil</h1>
            <p className="text-gray-600">Shaxsiy va kompaniya ma'lumotlarini boshqaring</p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="bg-green-50 rounded-lg p-1">
              <nav className="flex space-x-1">
                {[
                  { id: 'profile', name: 'Shaxsiy ma\'lumotlar', icon: '' },
                  { id: 'company', name: 'Kompaniya', icon: '' },
                  { id: 'members', name: 'Kompaniya a\'zolari', icon: '' }
                ].map((tab) => (
            <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all duration-200 border ${
                      activeTab === tab.id
                        ? 'bg-green-700 text-white shadow-sm border-green-700'
                        : 'bg-transparent text-green-700 hover:text-green-800 hover:bg-green-100 border-green-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.name}
            </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {ok && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{ok}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Shaxsiy ma'lumotlar</h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setPwOpen(!pwOpen)}
                      className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Parol o'zgartirish
                    </button>
                    <button 
                      onClick={() => setEditMode(!editMode)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {editMode ? 'Bekor qilish' : 'Tahrirlash'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
              {editMode ? (
                  <form onSubmit={saveUserProfile} className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden">
                          {preview ? (
                            <img src={preview} alt="avatar" className="w-full h-full object-cover"/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">👤</div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rasm yuklash
                        </label>
                        <input 
                          name="image" 
                          type="file" 
                          accept="image/*" 
                          onChange={onPickImg}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ism
                        </label>
                      <input
                          name="name" 
                        type="text"
                        defaultValue={userData?.name || ''}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefon
                        </label>
                      <input
                        name="phone"
                          type="text" 
                          value={userData?.phone || ''} 
                          disabled
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving && <div className="spinner w-4 h-4"></div>}
                      {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </form>
              ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden">
                      {userData?.image ? (
                            <img src={userData.image} alt="avatar" className="w-full h-full object-cover"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">👤</div>
                      )}
                    </div>
                  </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">{userData?.name || '—'}</h3>
                        <p className="text-gray-600">{userData?.phone || '—'}</p>
                        <p className="text-sm text-gray-500">Sotib oluvchi</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <dt className="text-sm font-medium text-gray-500">Ism</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData?.name || '—'}</dd>
                    </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData?.phone || '—'}</dd>
                    </div>
                  </div>
                </div>
              )}
                
                {/* Password Change Component */}
                {pwOpen && (
                  <PasswordChanger onClose={() => setPwOpen(false)} />
                )}
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Kompaniya ma'lumotlari</h2>
                  {companyData && (
                    <button 
                      onClick={() => setEditCompanyMode(!editCompanyMode)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {editCompanyMode ? 'Bekor qilish' : 'Tahrirlash'}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {!companyData ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🏢</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Kompaniya ma'lumotlari yo'q</h3>
                    <p className="text-gray-600 mb-6">Siz hali kompaniya ma'lumotlarini to'ldirmagansiz</p>
                    <Link 
                      to="/company-setup"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Kompaniya yaratish
                    </Link>
                  </div>
                ) : editCompanyMode ? (
                  <form onSubmit={saveCompanyProfile} className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden">
                          {companyData?.logo ? (
                            <img src={companyData.logo} alt="logo" className="w-full h-full object-cover"/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">🏢</div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo yuklash
                        </label>
                        <input 
                          name="logo" 
                          type="file" 
                          accept="image/*" 
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                      </div>
              </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kompaniya nomi
                        </label>
                      <input
                          name="name" 
                        type="text"
                          value={companyData?.name || ''} 
                          disabled
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          INN
                        </label>
                      <input
                          name="inn" 
                          type="text" 
                          defaultValue={companyData?.inn || ''} 
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hudud
                        </label>
                      <input
                          name="region" 
                          type="text" 
                          defaultValue={companyData?.region || ''} 
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Hujjat
                        </label>
                      <input
                          name="documents" 
                          type="file" 
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {companyData?.documents && (
                          <p className="mt-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                            <button 
                              type="button" 
                              onClick={() => window.open(companyData.documents, '_blank')} 
                              className="text-green-500 hover:text-green-600 hover:underline"
                            >
                              Yuklangan hujjatni ko'rish
                            </button>
                          </p>
                        )}
                    </div>
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tavsif
                      </label>
                    <textarea
                      name="description"
                        rows={4}
                      defaultValue={companyData?.description || ''}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving && <div className="spinner w-4 h-4"></div>}
                      {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </form>
              ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden">
                          {companyData?.logo ? (
                            <img src={companyData.logo} alt="logo" className="w-full h-full object-cover"/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">🏢</div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">{companyData?.name || '—'}</h3>
                        <p className="text-gray-600">{companyData?.type || '—'}</p>
                        <p className="text-sm text-gray-500">
                          Yaratilgan: {companyData?.created_at ? new Date(companyData.created_at).toLocaleDateString('uz-UZ') : '—'}
                        </p>
                      </div>
                    </div>
                    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <dt className="text-sm font-medium text-gray-500">INN</dt>
                        <dd className="mt-1 text-sm text-gray-900">{companyData?.inn || '—'}</dd>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <dt className="text-sm font-medium text-gray-500">Hudud</dt>
                        <dd className="mt-1 text-sm text-gray-900">{companyData?.region || '—'}</dd>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Tavsif</dt>
                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{companyData?.description || '—'}</dd>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Hujjat</dt>
                        <dd className="mt-1">
                          {companyData?.documents ? (
                            <div className="bg-gray-50 px-3 py-2 rounded-lg">
                              <button 
                                onClick={() => window.open(companyData.documents, '_blank')} 
                                className="text-green-500 hover:text-green-600 hover:underline text-sm"
                              >
                                Hujjatni ko'rish
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Yuklangan hujjat yo'q</span>
                          )}
                        </dd>
                      </div>
                    </div>
                    
                    {/* Certificates Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">Sertifikatlar</h3>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setEditCertificates(!editCertificates)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              {editCertificates ? 'Saqlash' : 'Tahrirlash'}
                            </button>
                            {editCertificates && (
                              <label className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer">
                                Sertifikat qo'shish
                                <input 
                                  type="file" 
                                  multiple 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={onAddCertificates} 
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {certificates.map(cert => (
                            <div key={cert.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                              <div className="aspect-[4/3] bg-gray-100">
                                <img 
                                  src={cert.image} 
                                  alt="Sertifikat" 
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(cert.image, '_blank')}
                                />
                              </div>
                              {editCertificates && (
                                <div className="p-3 flex items-center justify-between">
                                  <span className="text-xs text-gray-500">ID: {cert.id.slice(0, 8)}…</span>
                                  <button 
                                    onClick={() => onDeleteCertificate(cert.id)}
                                    className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                                  >
                                    O'chirish
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {!certificates.length && (
                          <div className="text-center py-8">
                            <div className="text-gray-400 text-4xl mb-2">📄</div>
                            <p className="text-gray-500">Sertifikatlar mavjud emas</p>
                          </div>
                        )}
                    </div>
                    </div>
                    </div>
                )}
                    </div>
                  </div>
          )}

          {/* Company Members Tab */}
          {activeTab === 'members' && (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Add Member Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="font-medium mb-3 text-gray-900">A'zo qo'shish</div>
                {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
                {ok && <div className="text-green-600 text-sm mb-2">{ok}</div>}
                <form onSubmit={addMember} className="space-y-3">
                    <div>
                    <label className="text-sm text-gray-700">Telefon raqam</label>
                    <input 
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500 mt-1" 
                      placeholder="+99890xxxxxxx" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      required 
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Qo'shish
                  </button>
                </form>
              </div>

              {/* Members List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:col-span-2">
                <div className="font-medium mb-3 text-gray-900">Kompaniya a'zolari</div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="spinner w-6 h-6 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Yuklanmoqda...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map(m => {
                      const uid = (m.user || m.id || '').toString()
                      const isMe = currentUserId && uid === currentUserId
                      return (
                        <div key={m.id || m.user} className={`flex items-center justify-between p-3 rounded-lg border ${isMe ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400">
                              {m.user_image_url ? (
                                <img src={m.user_image_url} alt="avatar" className="w-full h-full object-cover" />
                              ) : m.user_image ? (
                                <img src={m.user_image} alt="avatar" className="w-full h-full object-cover" />
                              ) : (
                                <span>👤</span>
                      )}
                    </div>
                    <div>
                              <div className="font-medium text-gray-900">{m.user_name || m.user?.name || m.user_username || '—'}</div>
                              <div className="text-xs text-gray-500">{m.user_phone || m.user?.phone || '—'}</div>
                              <div className="text-[11px] text-gray-400">ID: {(m.user || m.id || '').toString().slice(0,8)}…</div>
                              <div className="text-xs mt-1 px-2 py-1 bg-gray-100 rounded-full inline-block">{m.role}</div>
                            </div>
                          </div>
                          {String(m.role).toLowerCase() !== 'egasi' && (
                            <button 
                              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500" 
                              onClick={() => setConfirm({ open: true, user_id: m.user })}
                            >
                              O'chirish
                            </button>
                          )}
                        </div>
                      )
                    })}
                    {!members.length && (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">👥</div>
                        <p className="text-gray-500">A'zolar mavjud emas</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Confirmation Modals */}
        {confirm.open && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirm({ open: false, user_id: null })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="text-lg font-semibold text-gray-900 mb-2">A'zoni o'chirish</div>
                <div className="text-sm text-gray-600 mb-4">Rostdan ham ushbu a'zoni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.</div>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500" 
                    onClick={() => setConfirm({ open: false, user_id: null })}
                  >
                    Bekor qilish
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500" 
                    onClick={() => doRemove(confirm.user_id)}
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {confirmAdd?.open && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAdd({ open: false, phone: '' })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="text-lg font-semibold text-gray-900 mb-2">A'zo qo'shish</div>
                <div className="text-sm text-gray-600 mb-4">Rostdan ham ushbu foydalanuvchini qo'shmoqchimisiz? Telefon: {confirmAdd.phone}</div>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500" 
                    onClick={() => setConfirmAdd({ open: false, phone: '' })}
                  >
                    Bekor qilish
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500" 
                    onClick={doAdd}
                  >
                    Qo'shish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sertifikat qo'shish tasdiqlash modali */}
        {confirmAddCert.open && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAddCert({ open: false, files: null })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="text-lg font-semibold text-gray-900 mb-2">Sertifikat qo'shish</div>
                <div className="text-sm text-gray-600 mb-4">
                  {confirmAddCert.files?.length} ta sertifikat qo'shishni tasdiqlaysizmi?
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500" 
                    disabled={addingCert}
                    onClick={() => setConfirmAddCert({ open: false, files: null })}
                  >
                    Bekor qilish
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2" 
                    disabled={addingCert}
                    onClick={doAddCertificates}
                  >
                    {addingCert && <div className="spinner w-4 h-4"></div>}
                    {addingCert ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sertifikat o'chirish tasdiqlash modali */}
        {confirmDeleteCert.open && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDeleteCert({ open: false, certId: null })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="text-lg font-semibold text-gray-900 mb-2">Sertifikat o'chirish</div>
                <div className="text-sm text-gray-600 mb-4">
                  Rostdan ham ushbu sertifikatni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500" 
                    disabled={deletingCert}
                    onClick={() => setConfirmDeleteCert({ open: false, certId: null })}
                  >
                    Bekor qilish
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2" 
                    disabled={deletingCert}
                    onClick={doDeleteCertificate}
                  >
                    {deletingCert && <div className="spinner w-4 h-4"></div>}
                    {deletingCert ? 'O\'chirilmoqda...' : 'O\'chirish'}
                  </button>
                </div>
                    </div>
                  </div>
                </div>
              )}
      </div>
    </RoleGuard>
  )
}

function PasswordChanger({ onClose }) {
  const [oldp, setOldp] = useState('')
  const [newp, setNewp] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [step, setStep] = useState(1) // 1: parol kiritish, 2: SMS kod kiritish
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  async function submit(e) {
    e.preventDefault()
    setErr('')
    setOk('')
    setLoading(true)
    
    try {
      // Eski parol bilan yangi parolni solishtirish
      if (oldp === newp) {
        setErr('Yangi parol eski parol bilan bir xil bo\'lishi mumkin emas')
        return
      }
      
      // SMS kod yuborish
      await sendPasswordChangeSMS({ old_password: oldp, new_password: newp })
      console.log('SMS yuborildi, step 2 ga o\'tmoqda')
      setStep(2) // SMS kod kiritish bosqichiga o'tish
      setOk('SMS kod telefon raqamingizga yuborildi')
    } catch(e) {
      setErr(e?.response?.data?.detail || 'Xato')
    } finally {
      setLoading(false)
    }
  }

  async function verifySMS(e) {
    e.preventDefault()
    setErr('')
    setLoading(true)
    
    try {
      await verifyPasswordChangeSMS({ code: smsCode, old_password: oldp, new_password: newp })
      
      // Muvaffaqiyatli yangilandi
      setModalMessage('Parol yangilandi')
      setModalOpen(true)
      setTimeout(() => {
        setModalOpen(false)
        setOldp('')
        setNewp('')
        setSmsCode('')
        setStep(1)
        onClose && onClose()
      }, 2000)
      
    } catch(e) {
      // SMS kod noto'g'ri
      setModalMessage('SMS kod kiritilmadi parol yangilanmadi')
      setModalOpen(true)
      setTimeout(() => {
        setModalOpen(false)
        setOldp('')
        setNewp('')
        setSmsCode('')
        setStep(1)
        onClose && onClose()
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mt-6 border-t pt-4">
        
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        {ok && <div className="text-green-600 text-sm mb-2">{ok}</div>}
        
        {step === 1 ? (
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Eski parol</label>
              <input 
                type="password" 
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500" 
                value={oldp} 
                onChange={e=>setOldp(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yangi parol</label>
              <input 
                type="password" 
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500" 
                value={newp} 
                onChange={e=>setNewp(e.target.value)} 
                required 
              />
            </div>
            <div className="sm:col-span-2 pt-1">
              <button 
                disabled={loading} 
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <div className="spinner w-4 h-4"></div>}
                {loading ? 'SMS yuborilmoqda…' : 'SMS kod yuborish'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={verifySMS} className="max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMS kod (6 ta raqam)</label>
              <div className="text-xs text-gray-500 mb-2">
                Telefon raqamingizga yuborilgan 6 ta raqamli kodni kiriting
              </div>
              <input 
                type="text" 
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500" 
                value={smsCode} 
                onChange={e=>setSmsCode(e.target.value)} 
                placeholder="123456"
                maxLength="6"
                required 
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button 
                disabled={loading} 
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <div className="spinner w-4 h-4"></div>}
                {loading ? 'Tekshirilmoqda…' : 'Tasdiqlash'}
              </button>
              <button 
                type="button" 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500" 
                onClick={() => {
                  setStep(1)
                  setSmsCode('')
                  setErr('')
                  setOk('')
                }}
              >
                Orqaga
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Natija modali */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {modalMessage.includes('yangilandi') ? '✅ Muvaffaqiyat' : '❌ Xato'}
              </div>
              <div className="text-sm text-gray-600">{modalMessage}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}