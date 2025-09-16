import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import RoleGuard from '../../components/RoleGuard.jsx'
import { myStatus, getCompany, updateCompanyProfile, getCertificates, addCertificates, deleteCertificate, getCompanyRatings } from '../../utils/api.js'
import ImageLightbox from '../../components/ImageLightbox.jsx'

export default function CompanyProfile(){
  const [companyId, setCompanyId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [company, setCompany] = useState(null)
  const [certs, setCerts] = useState([])
  const [ratings, setRatings] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [editCerts, setEditCerts] = useState(false)
  const [lightbox, setLightbox] = useState({ open: false, list: [], idx: 0 })
  const [confirmAddCert, setConfirmAddCert] = useState({ open: false, files: null })
  const [confirmDeleteCert, setConfirmDeleteCert] = useState({ open: false, certId: null })
  const [addingCert, setAddingCert] = useState(false)
  const [deletingCert, setDeletingCert] = useState(false)
  const [savingCerts, setSavingCerts] = useState(false)

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      try{
        console.log('Kompaniya ma\'lumotlari yuklanmoqda...')
        const ms = await myStatus()
        console.log('My status:', ms)
        if (!ms?.company_id) throw new Error('company yo\'q')
        if(!mounted) return
        setCompanyId(ms.company_id)
        console.log('Company ID o\'rnatildi:', ms.company_id)
        const [c, ce, ratingsData] = await Promise.all([
          getCompany(ms.company_id), 
          getCertificates(ms.company_id),
          getCompanyRatings(ms.company_id).catch(() => ({ ratings: [], average_rating: 0, total_ratings: 0 }))
        ])
        if(!mounted) return
        console.log('Kompaniya ma\'lumotlari:', c)
        console.log('Sertifikatlar:', ce)
        console.log('Rating\'lar:', ratingsData)
        setCompany(c)
        setCerts(ce)
        setRatings(ratingsData.ratings || [])
        setAverageRating(ratingsData.average_rating || 0)
        setTotalRatings(ratingsData.total_ratings || 0)
      }catch(e){ 
        console.error('Yuklashda xato:', e)
        setError('Yuklashda xato: ' + e.message) 
      }
      finally{ if(mounted) setLoading(false) }
    })()
    return ()=>{ mounted = false }
  }, [])


  async function onAddCertificates(e){
    const files = e.target.files
    console.log('Tanlangan fayllar:', files)
    console.log('Fayllar soni:', files?.length)
    if(!files?.length) return
    const valid = [].every.call(files, f => f.type && f.type.startsWith('image/'))
    if(!valid){ setError('Faqat rasm fayllari yuklang'); e.target.value=''; return }
    
    // FileList ni Array ga aylantirish
    const filesArray = Array.from(files)
    console.log('Fayllar array ga aylantirildi:', filesArray)
    console.log('Array uzunligi:', filesArray.length)
    
    setConfirmAddCert({ open: true, files: filesArray })
    e.target.value = ''
  }

  async function doAddCertificates(){
    if (!companyId) {
      setError('Kompaniya ID topilmadi')
      return
    }
    setAddingCert(true)
    setSavingCerts(true)
    setError('')
    setOk('')
    try{ 
      console.log('Sertifikat qo\'shish boshlanmoqda...', { companyId, files: confirmAddCert.files })
      console.log('Files type:', typeof confirmAddCert.files)
      console.log('Files isArray:', Array.isArray(confirmAddCert.files))
      console.log('Files length:', confirmAddCert.files?.length)
      
      await addCertificates(companyId, confirmAddCert.files)
      console.log('Sertifikat qo\'shildi, yangi ro\'yxat olinmoqda...')
      // Sertifikat qo'shishdan keyin to'liq ro'yxatni olish
      const updatedCerts = await getCertificates(companyId)
      console.log('Yangilangan sertifikatlar:', updatedCerts)
      setCerts(updatedCerts)
      setOk('Sertifikat qo\'shildi')
    }catch(e){ 
      console.error('Sertifikat qo\'shish xatosi:', e)
      setError('Sertifikat qo\'shilmadi: ' + (e?.response?.data?.detail || e.message)) 
    } finally { 
      setAddingCert(false)
      setSavingCerts(false)
      setConfirmAddCert({ open: false, files: null })
    }
  }

  async function onDeleteCertificate(id){
    setConfirmDeleteCert({ open: true, certId: id })
  }

  async function doDeleteCertificate(){
    setDeletingCert(true)
    setSavingCerts(true)
    setError('')
    setOk('')
    try{ 
      await deleteCertificate(companyId, confirmDeleteCert.certId)
      // Sertifikat o'chirishdan keyin to'liq ro'yxatni olish
      const updatedCerts = await getCertificates(companyId)
      setCerts(updatedCerts)
      setOk('Sertifikat o\'chirildi')
    }catch{ 
      setError('Sertifikat o\'chmadi') 
    } finally { 
      setDeletingCert(false)
      setSavingCerts(false)
      setConfirmDeleteCert({ open: false, certId: null })
    }
  }

  async function doSaveCompany(e){
    e.preventDefault()
    if (!companyId) {
      setError('Kompaniya ID topilmadi')
      return
    }
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
      console.log('Kompaniya saqlanmoqda...', payload)
      const d = await updateCompanyProfile(companyId, payload)
      console.log('Kompaniya saqlandi:', d)
      setCompany(d)
      setOk('Saqlandi')
      setEditMode(false)
    } catch(err) {
      console.error('Kompaniya saqlash xatosi:', err)
      setError('Saqlashda xato: ' + (err?.response?.data?.detail || err.message))
    } finally {
      setSaving(false)
    }
  }

  return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Kompaniya profili</h2>
          {!loading && company && (
            <div className="flex gap-2">
              <button className="btn-outline" onClick={()=> setEditMode(v=>!v)}>{editMode ? 'Bekor qilish' : 'Tahrirlash'}</button>
              <button 
                className="btn-outline flex items-center gap-2" 
                onClick={()=> setEditCerts(v=>!v)}
                disabled={saving || savingCerts}
              >
                {(saving || savingCerts) && <div className="spinner w-4 h-4"></div>}
                {editCerts ? 'Saqlash' : 'Sertifikatlarni tahrirlash'}
              </button>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ambient-wrap">
          <div className="ambient-blob ambient-blob-blue w-64 h-64 -z-10 -top-6 -left-10" />
          <div className="ambient-blob ambient-blob-purple w-72 h-72 -z-10 bottom-0 right-0" />
          <div className="card p-5 md:col-span-2 lg:col-span-1">
            {loading ? 'Yuklanmoqda…' : company ? (
              editMode ? (
                <form onSubmit={doSaveCompany} className="space-y-3">
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {ok && <div className="text-green-600 text-sm">{ok}</div>}
                  <div>
                    <label className="text-sm text-gray-700">Nomi (read-only)</label>
                    <input className="input mt-1 bg-gray-100 text-gray-500" value={company.name||''} disabled readOnly />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-700">INN</label>
                      <input name="inn" className="input mt-1" defaultValue={company.inn||''} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Hudud</label>
                      <input name="region" className="input mt-1" defaultValue={company.region||''} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Hujjat (bitta fayl)</label>
                    <input name="documents" type="file" className="mt-1" />
                    {company.documents && (
                      <div className="mt-2 text-xs">
                        <button type="button" onClick={()=> window.open(company.documents, '_blank')} className="text-sky-600 hover:underline">Yuklangan hujjatni ko‘rish</button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Logo</label>
                    <input name="logo" type="file" className="mt-1" accept="image/*" />
                    {company.logo && (
                      <div className="mt-2 flex items-center gap-3">
                        <img src={company.logo} alt="logo" className="h-12 w-12 rounded object-cover border" />
                        <button type="button" className="btn-outline text-xs" onClick={async()=>{ try{ await import('../../utils/api.js').then(m=>m.deleteCompanyLogo(companyId)); const fresh = await getCompany(companyId); setCompany(fresh) }catch{} }}>Logoni oʼchirish</button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Tavsif</label>
                    <textarea name="description" className="input mt-1" rows={4} defaultValue={company.description||''} />
                  </div>
                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={saving} 
                      className="btn-primary flex items-center gap-2"
                    >
                      {saving && <div className="spinner w-4 h-4"></div>}
                      {saving ? 'Saqlanmoqda…' : 'Saqlash'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400">
                      {company.logo ? (
                        <img src={company.logo} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        <span>🏢</span>
                      )}
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-gray-900">{company.name}</div>
                      <div className="text-sm text-gray-500">Turi: {company.type}</div>
                      <div className="text-[11px] text-gray-400">Yaratilgan: {new Date(company.created_at).toLocaleDateString('uz-UZ')}</div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded border bg-white/50">
                      <div className="muted">STIR</div>
                      <div className="font-medium">{company.inn || '—'}</div>
                    </div>
                    <div className="p-3 rounded border bg-white/50">
                      <div className="muted">Hudud</div>
                      <div className="font-medium">{company.region || '—'}</div>
                    </div>
                    <div className="p-3 rounded border bg-white/50 sm:col-span-2">
                      <div className="muted">Tavsif</div>
                      <div className="font-medium whitespace-pre-line">{company.description || '—'}</div>
                    </div>
                    <div className="p-3 rounded border bg-white/50 sm:col-span-2">
                      <div className="muted">Hujjat</div>
                      {company.documents ? (
                        <button className="btn-outline text-xs mt-2" onClick={()=> window.open(company.documents, '_blank')}>Hujjatni koʼrish</button>
                      ) : (
                        <div className="text-sm text-gray-500">Yuklangan hujjat yoʼq</div>
                      )}
                    </div>
                    <div className="p-3 rounded border bg-white/50 sm:col-span-2">
                      <div className="muted">Reyting</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({totalRatings} ta baho)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-sm muted">Kompaniya maʼlumoti topilmadi</div>
            )}
          </div>
          {lightbox.open && (
            <ImageLightbox
              images={lightbox.list}
              index={lightbox.idx}
              onClose={()=> setLightbox({ open: false, list: [], idx: 0 })}
              onPrev={()=> setLightbox(s=> ({ ...s, idx: (s.idx-1 + s.list.length) % s.list.length }))}
              onNext={()=> setLightbox(s=> ({ ...s, idx: (s.idx+1) % s.list.length }))}
            />
          )}

          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Sertifikatlar</div>
              {editCerts && (
                <div className="flex gap-2">
                  <label className="btn-outline cursor-pointer text-xs">
                    Sertifikat qo'shish
                    <input type="file" multiple accept="image/*" className="hidden" onChange={onAddCertificates} />
                  </label>
                </div>
              )}
            </div>
            <div className="glass-scroll max-h-[28rem] pr-1 space-y-4">
              {certs.map(c=> (
                <div key={c.id} className="card overflow-hidden">
                  <div className="aspect-[16/9] bg-gray-100">
                    <img src={c.image} alt="cert" className="w-full h-full object-cover cursor-zoom-in" onClick={()=> setLightbox({ open: true, list: certs.map(x=>x.image), idx: certs.findIndex(x=>x.id===c.id) })} />
                  </div>
                  {editCerts ? (
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{c.id.slice(0,8)}…</span>
                      <button 
                        className="btn-outline text-xs" 
                        style={{borderColor:'#fca5a5', color:'#dc2626'}}
                        onClick={()=>onDeleteCertificate(c.id)}
                      >
                        Sertifikat o'chirish
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 text-xs text-gray-500">ID: {c.id.slice(0,8)}…</div>
                  )}
                </div>
              ))}
              {!certs.length && <div className="muted text-sm">Sertifikatlar mavjud emas</div>}
            </div>
          </div>

          {/* Rating'lar qismi */}
          <div className="card p-5">
            <div className="font-medium mb-3">Mijozlar bahosi</div>
            {ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rating, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {rating.rater_company_name || 'Noma\'lum kompaniya'}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(rating.overall_score) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{rating.overall_score}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(rating.created_at).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-gray-700">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="muted text-sm">Hali hech kim baho bermagan</div>
            )}
          </div>
        </div>

        {/* Sertifikat qo'shish tasdiqlash modali */}
        {confirmAddCert.open && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=> !addingCert && setConfirmAddCert({ open: false, files: null })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="text-lg font-semibold text-gray-900 mb-2">Sertifikat qo'shish</div>
                <div className="text-sm text-gray-600 mb-4">
                  Rostdan ham {confirmAddCert.files ? confirmAddCert.files.length : 0} ta sertifikat qo'shmoqchimisiz?
                  {console.log('Modal da files:', confirmAddCert.files)}
                  {console.log('Modal da files type:', typeof confirmAddCert.files)}
                  {console.log('Modal da files isArray:', Array.isArray(confirmAddCert.files))}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="btn-outline" 
                    disabled={addingCert}
                    onClick={()=> setConfirmAddCert({ open: false, files: null })}
                  >
                    Bekor qilish
                  </button>
                  <button 
                    className="btn-outline flex items-center gap-2" 
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=> setConfirmDeleteCert({ open: false, certId: null })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="text-lg font-semibold text-gray-900 mb-2">Sertifikat o'chirish</div>
                <div className="text-sm text-gray-600 mb-4">
                  Rostdan ham ushbu sertifikatni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="btn-outline" 
                    disabled={deletingCert}
                    onClick={()=> setConfirmDeleteCert({ open: false, certId: null })}
                  >
                    Bekor qilish
                  </button>
                  <button 
                    className="btn-outline flex items-center gap-2" 
                    style={{borderColor:'#fca5a5', color:'#dc2626'}}
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

      </DashboardLayout>
    </RoleGuard>
  )
}


