import { useState, useEffect } from 'react'
import axios from 'axios'
import { checkAuthOnPageLoad } from '../utils/api.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Sahifa yuklanganda token tekshirish
  useEffect(() => {
    async function checkExistingAuth() {
      try {
        const result = await checkAuthOnPageLoad()
        
        if (result.shouldRedirect) {
          // Smooth transition bilan redirect qilamiz
          setExiting(true)
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

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const { data } = await axios.post(`${API_URL}/auth/login/`, { phone, password })
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      // kompaniya holatini tekshiramiz
      try {
        const statusRes = await axios.get(`${API_URL}/companies/my_status/`, {
          headers: { Authorization: `Bearer ${data.access}` }
        })
        // cache status for guards
        try {
          localStorage.setItem('user_role', String(statusRes?.data?.user_role || ''))
          localStorage.setItem('has_company', statusRes?.data?.has_company ? '1' : '0')
        } catch {}
        let target = '/'
        if (statusRes?.data?.has_company === false) {
          target = '/company-setup'
        } else {
          // role ga qarab redirect qilamiz
          const role = String(statusRes?.data?.user_role || '').toLowerCase()
          if (role === 'sotib_oluvchi') {
            target = '/buyer'
          } else if (role === 'sotuvchi') {
            target = '/seller-dashboard'
          } else {
            // default buyer
            target = '/buyer'
          }
        }
        setExiting(true)
        setTimeout(()=>{ window.location.href = target }, 600)
      } catch (e) {
        setExiting(true)
        setTimeout(()=>{ window.location.href = '/' }, 600)
      }
    } catch (err) {
      setError('Login xatosi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-[70vh] grid md:grid-cols-2 gap-10 items-center relative px-4 transition-all duration-500 ${exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex items-center justify-center">
            <img src="/logo.png" alt="logo" className="h-56 w-56 object-contain" />
          </div>
          <div className="h-40 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 hidden md:flex">Xavfsiz tizim</div>
          <div className="h-40 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 hidden md:flex">Tez login</div>
        </div>
      </div>
      <div className="w-full max-w-md md:ml-auto">
        <div className="card glass glass-hover p-6">
          <h2 className="mb-4">Kirish</h2>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input className="input" placeholder="Telefon (+998901112233)" value={phone} onChange={e=>setPhone(e.target.value)} />
            <input className="input" placeholder="Parol" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button disabled={loading} className="btn-primary w-full opacity-100 disabled:opacity-70">{loading ? 'Yuklanmoqda…' : 'Kirish'}</button>
          </form>
        </div>
      </div>
      {(loading || checkingAuth) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[16px]">
          <div className="text-center">
            <div className="h-8 w-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-600 text-sm">
              {checkingAuth ? 'Tekshirilmoqda...' : 'Yuklanmoqda...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
