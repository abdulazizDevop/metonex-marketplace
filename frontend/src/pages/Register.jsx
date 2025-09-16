import { useState, useEffect } from 'react'
import axios from 'axios'
import { checkAuthOnPageLoad } from '../utils/api.js'

const API_URL = import.meta.env.VITE_API_URL || 'https://metonex.pythonanywhere.com/api/v1'

export default function Register() {
  const [form, setForm] = useState({ role: 'sotib_oluvchi', phone: '', name: '', password: '', verification_code: '' })
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Sahifa yuklanganda token tekshirish
  useEffect(() => {
    async function checkExistingAuth() {
      try {
        const result = await checkAuthOnPageLoad()
        
        if (result.shouldRedirect) {
          // Smooth transition bilan redirect qilamiz
          setTimeout(() => {
            window.location.href = result.target
          }, 600)
        } else {
          setCheckingAuth(false)
        }

      } catch (error) {
        console.error('Auth tekshirishda xato:', error)
        setCheckingAuth(false)
      }
    }

    checkExistingAuth()
  }, [])

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    setError(''); setOk('')
    try {
      await axios.post(`${API_URL}/auth/register/`, { ...form, verification_code: parseInt(form.verification_code, 10) })
      setOk('Muvaffaqiyatli. Endi kirishingiz mumkin.')
      const overlay=document.createElement('div');
      overlay.className='fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[60]';
      overlay.innerHTML='<div class="h-10 w-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>';
      document.body.appendChild(overlay);
      setTimeout(()=>{ window.location.href = '/login' }, 700)
    } catch (err) {
      setError('Ro’yxatdan o’tishda xato')
    }
  }

  async function sendCode() {
    setError(''); setOk('')
    try {
      const { data } = await axios.post(`${API_URL}/auth/send-code/`, { phone: form.phone })
      setCodeSent(true)
      setOk(`Kod yuborildi. Amal qilish vaqti: ${data.expires_in_seconds}s`)
    } catch (err) {
      setError('Kod yuborishda xato yoki cooldown')
    }
  }

  return (
    <div className="min-h-[70vh] grid md:grid-cols-2 gap-10 items-center relative px-4">
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex items-center justify-center">
            <img src="/logo.png" alt="logo" className="h-56 w-56 object-contain" />
          </div>
          <div className="h-40 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 hidden md:flex">Rol tanlash</div>
          <div className="h-40 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 hidden md:flex">SMS kod</div>
          <div className="col-span-2 h-28 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hidden md:flex">Tasdiqlash • Xavfsizlik</div>
        </div>
      </div>
      <div className="w-full max-w-md md:ml-auto">
        <div className="card glass glass-hover glass-scroll p-6">
          <h2 className="mb-4">Ro’yxatdan o’tish</h2>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {ok && <div className="text-green-600 text-sm mb-2">{ok}</div>}
          <form onSubmit={submit} className="space-y-3">
            <div className="flex gap-2">
              <button type="button" className={`flex-1 btn-outline ${form.role==='sotib_oluvchi' ? 'border-green-600 text-green-700' : ''}`} onClick={() => setForm({ ...form, role: 'sotib_oluvchi' })}>Sotib oluvchi</button>
              <button type="button" className={`flex-1 btn-outline ${form.role==='sotuvchi' ? 'border-blue-600 text-blue-700' : ''}`} onClick={() => setForm({ ...form, role: 'sotuvchi' })}>Sotuvchi</button>
            </div>
            <input name="name" className="input" placeholder="Ism" value={form.name} onChange={change} />
            <div className="flex gap-2">
              <input name="phone" className="input" placeholder="Telefon (+998901112233)" value={form.phone} onChange={change} />
              <button type="button" onClick={sendCode} className="btn-outline whitespace-nowrap">Kod yuborish</button>
            </div>
            {codeSent && (
              <input name="verification_code" className="input" placeholder="Tasdiqlash kodi" value={form.verification_code} onChange={change} />
            )}
            <input name="password" className="input" placeholder="Parol" type="password" value={form.password} onChange={change} />
            <button className="btn-primary w-full">Ro’yxatdan o’tish</button>
          </form>
        </div>
      </div>
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
