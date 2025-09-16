import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import RoleGuard from '../components/RoleGuard.jsx'
import { getMyProfile, updateMyProfile, changeMyPassword, sendPasswordChangeSMS, verifyPasswordChangeSMS, myStatus, getCompanyMembers, addCompanyMember, removeCompanyMember } from '../utils/api.js'

export default function Profile(){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [preview, setPreview] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [pwOpen, setPwOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'members'
  
  // Members state
  const [companyId, setCompanyId] = useState('')
  const [members, setMembers] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [phone, setPhone] = useState('')
  const [confirm, setConfirm] = useState({ open: false, user_id: null })
  const [confirmAdd, setConfirmAdd] = useState({ open: false, phone: '' })

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      try{ 
        const d = await getMyProfile()
        if(mounted){
          setData(d)
          setPreview(d.image||'')
        }
        
        // Members ma'lumotlarini olish
        const ms = await myStatus()
        if(ms?.company_id && mounted){
          setCompanyId(ms.company_id)
          setCurrentUserId(ms.user_id)
          const list = await getCompanyMembers(ms.company_id)
          if(mounted) setMembers(list)
        }
      } finally { 
        if(mounted) setLoading(false) 
      }
    })()
    return ()=>{ mounted = false }
  }, [])

  async function submit(e){
    e.preventDefault()
    setError('')
    setOk('')
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    try{
      const d = await updateMyProfile({ name: fd.get('name'), image: fd.get('image')?.size ? fd.get('image') : undefined })
      setData(d)
      setPreview(d.image||'')
      setOk('Saqlandi')
      setEditMode(false)
    }catch{ setError('Saqlashda xato') } finally { setSaving(false) }
  }

  function onPickImg(e){
    const f = e.target.files?.[0]
    if(!f) return
    setPreview(URL.createObjectURL(f))
  }

  // Members functions
  async function addMember(e){
    e.preventDefault()
    setError('')
    setOk('')
    setConfirmAdd({ open: true, phone })
  }
  
  async function doAdd(){
    setError('')
    setOk('')
    try{ 
      const m = await addCompanyMember(companyId, { phone: confirmAdd.phone })
      setMembers(prev=>[...prev, m])
      setOk('Qo\'shildi')
      setPhone('')
      setConfirmAdd({ open:false, phone:'' })
    } catch{ 
      setError('Qo\'shishda xato')
      setConfirmAdd({ open:false, phone:'' })
    }
  }

  async function doRemove(user_id){
    try{ 
      await removeCompanyMember(companyId, user_id)
      setMembers(prev=> prev.filter(m=> m.user !== user_id))
      setConfirm({ open:false, user_id:null })
    } catch{ 
      setError('O\'chirishda xato')
      setConfirm({ open:false, user_id:null })
    }
  }

  return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Profil</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'profile' 
                ? 'bg-sky-600 text-white shadow-sm hover:bg-sky-700 hover:text-white' 
                : 'bg-sky-50 text-sky-800 hover:bg-sky-600 hover:text-white'
            }`}
          >
            Shaxsiy ma'lumotlar
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'members' 
                ? 'bg-sky-600 text-white shadow-sm hover:bg-sky-700 hover:text-white' 
                : 'bg-sky-50 text-sky-800 hover:bg-sky-600 hover:text-white'
            }`}
          >
            Kompaniya a'zolari
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium">Mening profili</div>
              <div className="flex gap-2">
                <button className="btn-outline" onClick={()=> setEditMode(v=>!v)}>
                  {editMode ? 'Bekor qilish' : 'Tahrirlash'}
                </button>
                <button 
                  className="btn-outline" 
                  style={{borderColor:'#22c55e', color:'#16a34a'}} 
                  onClick={(e)=>{ e.preventDefault(); setPwOpen(v=>!v) }}
                >
                  {pwOpen ? 'Yopish' : 'Parolni o\'zgartirish'}
                </button>
              </div>
            </div>
            {loading ? 'Yuklanmoqda…' : editMode ? (
              <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
                {error && <div className="text-red-600 text-sm sm:col-span-2">{error}</div>}
                {ok && <div className="text-green-600 text-sm sm:col-span-2">{ok}</div>}
                <div className="sm:row-span-2 flex flex-col items-center gap-3">
                  <div className="h-28 w-28 rounded-full bg-gray-100 overflow-hidden">
                    {preview ? <img src={preview} alt="avatar" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-400">👤</div>}
                  </div>
                  <label className="btn-outline text-xs cursor-pointer">
                    Rasm tanlash
                    <input name="image" type="file" accept="image/*" className="hidden" onChange={onPickImg} />
                  </label>
                </div>
                <div>
                  <label className="text-sm text-gray-700">Ism</label>
                  <input name="name" className="input mt-1" defaultValue={data?.name||''} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Telefon</label>
                  <input name="phone" className="input mt-1 bg-gray-100 text-gray-500" defaultValue={data?.phone||''} disabled readOnly />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <button disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving && <div className="spinner w-4 h-4"></div>}
                    {saving ? 'Saqlanmoqda…' : 'Saqlash'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:row-span-2 flex flex-col items-center gap-3">
                  <div className="h-28 w-28 rounded-full bg-gray-100 overflow-hidden">
                    {preview ? <img src={preview} alt="avatar" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-400">👤</div>}
                  </div>
                </div>
                <div>
                  <div className="muted text-sm">Ism</div>
                  <div className="font-medium">{data?.name||'—'}</div>
                </div>
                <div>
                  <div className="muted text-sm">Telefon</div>
                  <div className="font-medium">{data?.phone||'—'}</div>
                </div>
              </div>
            )}
            {pwOpen && (
              <PasswordChanger onClose={()=> setPwOpen(false)} />
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-5">
              <div className="font-medium mb-3">A'zo qo'shish</div>
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
              {ok && <div className="text-green-600 text-sm mb-2">{ok}</div>}
              <form onSubmit={addMember} className="space-y-3">
                <div>
                  <label className="text-sm text-gray-700">Telefon raqam</label>
                  <input className="input mt-1" placeholder="+99890xxxxxxx" value={phone} onChange={e=>setPhone(e.target.value)} required />
                </div>
                <button className="btn-primary">Qo'shish</button>
              </form>
            </div>
            <div className="card p-5 md:col-span-2">
              {loading ? 'Yuklanmoqda…' : (
                <div className="space-y-2">
                  {members.map(m => {
                    const uid = (m.user || m.id || '').toString()
                    const isMe = currentUserId && uid === currentUserId
                    return (
                    <div key={m.id||m.user} className={`flex items-center justify-between p-3 rounded border ${isMe ? 'border-sky-400 bg-sky-50/60' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400">
                          {m.user_image_url ? <img src={m.user_image_url} alt="avatar" className="w-full h-full object-cover" /> : (m.user_image ? <img src={m.user_image} alt="avatar" className="w-full h-full object-cover" /> : <span>👤</span>)}
                        </div>
                        <div>
                          <div className="font-medium">{m.user_name || m.user?.name || m.user_username || '—'}</div>
                          <div className="text-xs text-gray-500">{m.user_phone || m.user?.phone || '—'}</div>
                          <div className="text-[11px] text-gray-400">ID: {(m.user || m.id || '').toString().slice(0,8)}…</div>
                          <div className="text-xs mt-1">{m.role}</div>
                        </div>
                      </div>
                      {String(m.role).toLowerCase() !== 'egasi' && (
                        <button className="btn-outline text-xs" onClick={()=> setConfirm({ open:true, user_id: m.user })}>O'chirish</button>
                      )}
                    </div>
                  )})}
                  {!members.length && <div className="muted text-sm">A'zolar mavjud emas</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals */}
        {confirm.open && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=> setConfirm({ open:false, user_id:null })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="text-lg font-semibold text-gray-900 mb-2">A'zoni o'chirish</div>
                <div className="text-sm text-gray-600 mb-4">Rostdan ham ushbu a'zoni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.</div>
                <div className="flex items-center justify-end gap-2">
                  <button className="btn-outline" onClick={()=> setConfirm({ open:false, user_id:null })}>Bekor qilish</button>
                  <button className="btn-outline" style={{borderColor:'#fca5a5', color:'#dc2626'}} onClick={()=> doRemove(confirm.user_id)}>O'chirish</button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {confirmAdd?.open && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=> setConfirmAdd({ open:false, phone:'' })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="text-lg font-semibold text-gray-900 mb-2">A'zo qo'shish</div>
                <div className="text-sm text-gray-600 mb-4">Rostdan ham ushbu foydalanuvchini qo'shmoqchimisiz? Telefon: {confirmAdd.phone}</div>
                <div className="flex items-center justify-end gap-2">
                  <button className="btn-outline" onClick={()=> setConfirmAdd({ open:false, phone:'' })}>Bekor qilish</button>
                  <button className="btn-outline" onClick={doAdd}>Qo'shish</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </RoleGuard>
  )
}

function PasswordChanger({ onClose }){
  const [oldp, setOldp] = useState('')
  const [newp, setNewp] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [step, setStep] = useState(1) // 1: parol kiritish, 2: SMS kod kiritish
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  async function submit(e){
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

  async function verifySMS(e){
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
        <div className="font-medium mb-2">Parolni o'zgartirish</div>
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        {ok && <div className="text-green-600 text-sm mb-2">{ok}</div>}
        
        {console.log('Current step:', step)}
        {step === 1 ? (
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 max-w-xl">
            <div>
              <label className="text-sm text-gray-700">Eski parol</label>
              <input type="password" className="input mt-1" value={oldp} onChange={e=>setOldp(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Yangi parol</label>
              <input type="password" className="input mt-1" value={newp} onChange={e=>setNewp(e.target.value)} required />
            </div>
            <div className="sm:col-span-2 pt-1">
              <button disabled={loading} className="btn-primary flex items-center gap-2">
                {loading && <div className="spinner w-4 h-4"></div>}
                {loading ? 'SMS yuborilmoqda…' : 'SMS kod yuborish'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={verifySMS} className="max-w-xl">
            <div className="mb-3">
              <label className="text-sm text-gray-700">SMS kod (6 ta raqam)</label>
              <div className="text-xs text-gray-500 mb-2">
                Telefon raqamingizga yuborilgan 6 ta raqamli kodni kiriting
              </div>
              <input 
                type="text" 
                className="input mt-1" 
                value={smsCode} 
                onChange={e=>setSmsCode(e.target.value)} 
                placeholder="123456"
                maxLength="6"
                required 
              />
            </div>
            <div className="flex gap-2">
              <button disabled={loading} className="btn-primary flex items-center gap-2">
                {loading && <div className="spinner w-4 h-4"></div>}
                {loading ? 'Tekshirilmoqda…' : 'Tasdiqlash'}
              </button>
              <button 
                type="button" 
                className="btn-outline" 
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
              <div className="text-sm text-gray-600">
                {modalMessage}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
