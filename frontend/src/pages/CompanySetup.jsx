import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { checkAuthOnPageLoadForCompanySetup } from '../utils/api.js'

const API_URL = import.meta.env.VITE_API_URL || 'https://metonex.pythonanywhere.com/api/v1'

export default function CompanySetup() {
  const token = localStorage.getItem('access')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [joining, setJoining] = useState(false)
  const [creating, setCreating] = useState(false)
  const [open, setOpen] = useState({ join: true, create: true })
  const [fieldError, setFieldError] = useState({ name: false })
  const [checkingAuth, setCheckingAuth] = useState(true)
  const joinRef = useRef(null)
  const createRef = useRef(null)

  // Sahifa yuklanganda token tekshirish
  useEffect(() => {
    async function checkExistingAuth() {
      try {
        const result = await checkAuthOnPageLoadForCompanySetup()
        
        if (result.shouldRedirect) {
          // Agar kompaniyasi bo'lsa, mos sahifaga yo'naltiramiz
          setTimeout(() => {
            window.location.href = result.target
          }, 600)
        } else {
          // Kompaniyasi yo'q bo'lsa, bu sahifada qoladi
          setCheckingAuth(false)
        }

      } catch (error) {
        console.error('Auth tekshirishda xato:', error)
        setCheckingAuth(false)
      }
    }

    checkExistingAuth()
  }, [])

  async function submitJoin(e) {
    e.preventDefault()
    setError(''); setOk(''); setJoining(true)
    const form = new FormData(e.currentTarget)
    try {
      await axios.post(`${API_URL}/companies/join/`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOk("Kompaniyaga qo'shildingiz")
      window.location.href = '/'
    } catch (err) {
      setError(err?.response?.data?.detail || 'Qo\'shilishda xato')
    } finally { setJoining(false) }
  }

  async function submitCreate(e) {
    e.preventDefault()
    setError(''); setOk(''); setCreating(true)
    const form = new FormData()
    const formEl = e.currentTarget
    const name = formEl.elements.namedItem('name')?.value?.trim()
    const inn = formEl.elements.namedItem('inn')?.value?.trim()
    const region = formEl.elements.namedItem('region')?.value?.trim()
    const description = formEl.elements.namedItem('description')?.value?.trim()
    if (!name) {
      setFieldError(prev=>({ ...prev, name: true }))
      setError("Kompaniya nomi majburiy")
      setCreating(false)
      formEl.elements.namedItem('name')?.focus()
      return
    }
    form.append('name', name)
    if (inn) form.append('inn', inn)
    if (region) form.append('region', region)
    if (description) form.append('description', description)
    // multiple files: documents[] va certificates[] (ba'zi backendlarda 'sertificate' nomi ishlatilgan bo'lishi mumkin)
    const docsInput = formEl.elements.namedItem('documents')
    const certsInput = formEl.elements.namedItem('sertificate')
    // Backendga mos: documents = FileField (har qanday fayl), lekin ochiq ko'rish uchun PDF bilan cheklaymiz
    // sertificate = ImageField (faqat rasm)
    const allowedDocs = new Set(['application/pdf'])
    const allowedCerts = new Set(['image/png','image/jpeg','image/jpg','image/gif','image/webp'])
    const isAllowedByExt = (file, exts) => {
      const name = file.name.toLowerCase()
      return exts.some(ext => name.endsWith(ext))
    }
    if (docsInput && docsInput.files && docsInput.files[0]) {
      const f = docsInput.files[0]
      const okType = allowedDocs.has(f.type) || isAllowedByExt(f, ['.pdf'])
      if (!okType) { setError(`Hujjat faqat PDF bo'lishi kerak: ${f.name}`); setCreating(false); return }
      form.append('documents', f)
    }
    if (certsInput && certsInput.files && certsInput.files.length) {
      for (const f of Array.from(certsInput.files)) {
        const okType = allowedCerts.has(f.type) || isAllowedByExt(f, ['.png','.jpg','.jpeg','.gif','.webp'])
        if (!okType) { setError(`Sertifikat rasm bo'lishi kerak (PNG/JPG/GIF/WebP): ${f.name}`); setCreating(false); return }
        // Bir nechta sertifikatni bir xil kalit bilan yuboramiz ('sertificate'): backend tomonda ko'p fayl qabul qilishga moslashtirish kerak bo'lishi mumkin
        form.append('sertificate', f)
      }
    }
    try {
      await axios.post(`${API_URL}/companies/create_for_user/`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setOk('Kompaniya yaratildi')
      window.location.href = '/'
    } catch (err) {
      const data = err?.response?.data
      // Field-based xabarlarni o'qish
      let msg = ''
      if (typeof data === 'string') msg = data
      else if (data?.detail) msg = data.detail
      else if (data && typeof data === 'object') {
        const firstKey = Object.keys(data)[0]
        msg = Array.isArray(data[firstKey]) ? data[firstKey][0] : String(data[firstKey])
      }
      setError(msg || 'Yaratishda xato')
      console.error('Company create error:', data)
    } finally { setCreating(false) }
  }

  return (
    <div className="min-h-[70vh] relative px-4 py-10 max-w-2xl mx-auto space-y-4">
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-green-400/5 blur-3xl pointer-events-none" />
      <div className="card p-0 overflow-hidden rounded-[16px] bg-sky-50/60">
        <div className="w-full flex items-center justify-between px-5 py-4 rounded-t-[16px] bg-sky-50/60">
          <span className="font-semibold text-gray-700">Kompaniyaga qo'shilish</span>
          <span className="text-gray-400 text-sm">Xodim sifatida</span>
        </div>
        <div
          ref={joinRef}
          className={`px-5 pb-5`}
        >
          <p className="muted mb-3">Kompaniya ID orqali mavjud kompaniyaga a'zo bo'ling.</p>
          <form onSubmit={submitJoin} className="space-y-3">
            <input name="company_id" className="input" placeholder="Kompaniya ID" required />
            <button disabled={joining} className="btn-primary w-full">{joining ? 'Yuborilmoqda...' : "Qo'shilish"}</button>
          </form>
        </div>
      </div>

      <div className="card p-0 overflow-hidden rounded-[16px] bg-sky-50/60">
        <div className="w-full flex items-center justify-between px-5 py-4 rounded-t-[16px] bg-sky-50/60">
          <span className="font-semibold text-gray-700">Kompaniya yaratish</span>
          <span className="text-gray-400 text-sm">Egasi sifatida</span>
        </div>
        <div
          ref={createRef}
          className={`px-5 pb-5`}
        >
          <p className="muted mb-3">Ma'lumotlarni to'ldiring. Siz egasi (owner) bo'lasiz.</p>
          <form onSubmit={submitCreate} className="space-y-3">
            <input
              name="name"
              className={`input ${fieldError.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="Kompaniya nomi"
              onInput={()=> setFieldError(prev=>({ ...prev, name: false }))}
              required
            />
            {fieldError.name && <div className="text-red-600 text-xs">Bu maydon majburiy</div>}
            <input name="inn" className="input" placeholder="INN (ixtiyoriy)" />
            <input name="region" className="input" placeholder="Hudud (ixtiyoriy)" />
            <textarea name="description" className="input" placeholder="Tavsif (ixtiyoriy)" rows={4} />
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm text-gray-600">Yuridik hujjat (faqat PDF, 1 ta)
                <input name="documents" type="file" className="block mt-1" accept=".pdf,application/pdf" />
              </label>
              <label className="text-sm text-gray-600">Mahsulot sertifikati(lar) (rasm formatlari: JPEG, PNG, GIF, WebP — ko'p fayl)
                <input name="sertificate" type="file" className="block mt-1" accept=".png,.jpg,.jpeg,.gif,.webp,image/png,image/jpeg,image/gif,image/webp" multiple />
              </label>
            </div>
            <button disabled={creating} className="btn-primary w-full">{creating ? 'Yaratilmoqda...' : 'Yaratish'}</button>
          </form>
        </div>
      </div>

      {(error || ok) && (
        <div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {ok && <div className="text-green-600 text-sm">{ok}</div>}
        </div>
      )}
      {checkingAuth && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="text-center">
            <div className="h-10 w-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">
              Tekshirilmoqda...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
