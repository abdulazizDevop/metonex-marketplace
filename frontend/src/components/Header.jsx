import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getMyNotifications, myStatus, getCompany } from '../utils/api.js'
import BuyerHeader from './BuyerHeader.jsx'

export default function Header() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isAuthed = Boolean(localStorage.getItem('access'))
  const userRole = (localStorage.getItem('user_role')||'').toLowerCase()
  const isSeller = userRole === 'sotuvchi'
  const isBuyer = userRole === 'buyer' || userRole === 'sotib_oluvchi'
  const [notifOpen, setNotifOpen] = useState(false)
  const [notif, setNotif] = useState({ unread: 0, results: [] })
  const [companyName, setCompanyName] = useState('MetOneX')
  useEffect(()=>{
    if (!isAuthed) return
    let active = true
    ;(async()=>{ try{ const d = await getMyNotifications(); if(active) setNotif(d) }catch{} })()
    const id = setInterval(async()=>{ try{ const d = await getMyNotifications(); if(active) setNotif(d) }catch{} }, 5000)
    return ()=>{ active=false; clearInterval(id) }
  }, [isAuthed])
  useEffect(()=>{
    if (!isAuthed) { setCompanyName('MetOneX'); return }
    let alive = true
    ;(async()=>{
      try{
        const st = await myStatus()
        const cid = st?.company_id
        if (cid) {
          const c = await getCompany(cid)
          if (alive) setCompanyName(c?.name || 'MetOneX')
        } else {
          if (alive) setCompanyName('MetOneX')
        }
      }catch{ if (alive) setCompanyName('MetOneX') }
    })()
    return ()=>{ alive=false }
  }, [isAuthed])
  function smoothGo(url){
    // Overlaysiz: faqat smooth exit (opacity + translate)
    document.documentElement.classList.add('page-exit')
    setTimeout(()=>{ window.location.href=url }, 600)
  }
  async function doLogout(){
    try{
      const api = (import.meta.env.VITE_API_URL||'https://metonex.pythonanywhere.com/api/v1')
      const refresh = localStorage.getItem('refresh')
      const access = localStorage.getItem('access')
      await fetch(api + '/auth/logout/', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access}` }, body: JSON.stringify({ refresh }) })
    }catch{} finally{
      localStorage.removeItem('access'); localStorage.removeItem('refresh');
      document.documentElement.classList.add('page-exit')
      setTimeout(()=>{ window.location.href='/' }, 500)
    }
  }
  
  // Agar buyer bo'lsa, BuyerHeader'ni qaytar
  if (isAuthed && isBuyer) {
    return <BuyerHeader showFilters={false} />
  }
  
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 md:px-4 h-16 md:h-20 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 truncate max-w-[60vw] md:max-w-none">{companyName}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2 text-sm relative">
          {!isAuthed && (
            <>
              <a href="#features" className="px-3 py-2 rounded hover:bg-gray-100">Xususiyatlar</a>
              <a href="#contact" className="px-3 py-2 rounded hover:bg-gray-100">Aloqa</a>
              <button onClick={()=>smoothGo('/login')} className="px-4 py-2 rounded btn-outline">Kirish</button>
              <button onClick={()=>smoothGo('/register')} className="px-4 py-2 rounded btn-primary">Roʼyxatdan oʼtish</button>
            </>
          )}
          {isAuthed && isSeller && (
            <>
              <Link to="/dashboard" className={`px-3 py-2 text-gray-700 hover:font-bold transition ${location.pathname === '/dashboard' ? 'text-blue-600 font-bold' : ''}`}>Dashboard</Link>
              <Link to="/items" className={`px-3 py-2 text-gray-700 hover:font-bold transition ${location.pathname.startsWith('/items') ? 'text-blue-600 font-bold' : ''}`}>Mahsulotlar</Link>
              <Link to="/orders/seller" className={`px-3 py-2 text-gray-700 hover:font-bold transition ${location.pathname.startsWith('/orders') ? 'text-blue-600 font-bold' : ''}`}>Buyurtmalar</Link>
              <Link to="/requests" className={`px-3 py-2 text-gray-700 hover:font-bold transition ${location.pathname.startsWith('/requests') ? 'text-blue-600 font-bold' : ''}`}>So'rovlar</Link>
              <button aria-label="Notif" onClick={()=> setNotifOpen(v=>!v)} className="relative px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:font-bold transition">
                🔔
                {notif.unread>0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">{notif.unread}</span>
                )}
              </button>
              <button onClick={doLogout} className="px-3 py-2 rounded border border-red-300 bg-red-100 text-red-700 hover:bg-red-200 hover:font-bold transition">🚪 Chiqish</button>
              {notifOpen && (
                <div className="absolute right-0 top-14 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50">
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="text-sm font-medium">Bildirishnomalar</div>
                    <Link to="/notifications" className="text-xs text-sky-600 hover:underline" onClick={()=> setNotifOpen(false)}>Hammasi</Link>
                  </div>
                  <div className="max-h-64 overflow-auto space-y-1">
                    {(notif.results||[]).slice(0,5).map(n=> {
                      const raw = String(n.message||'')
                      let actor = ''
                      let main = raw
                      const idx = raw.indexOf(': ')
                      if (idx > -1) { actor = raw.slice(0, idx); main = raw.slice(idx+2) }
                      return (
                        <button key={n.id} onClick={()=>{ window.location.href='/notifications' }} className={`w-full text-left px-3 py-2 rounded border transition ${n.read_at ? 'border-blue-100 bg-white' : 'border-sky-200 bg-white'} hover:bg-sky-50`}>
                          <div className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString('uz-UZ')}</div>
                          <div className="text-sm text-gray-900 font-medium line-clamp-2 whitespace-pre-wrap">{main}</div>
                          <div className="text-xs text-gray-500">{actor}</div>
                        </button>
                      )
                    })}
                    {(!notif.results || notif.results.length===0) && <div className="text-xs text-gray-500 px-2 py-2">Hozircha xabar yoʼq</div>}
                  </div>
                </div>
              )}
            </>
          )}
        </nav>
        <button aria-label="Menu" className="md:hidden inline-flex items-center justify-center px-3 h-10 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition shrink-0 text-sm font-medium text-gray-800" onClick={()=>{ window.dispatchEvent(new Event('sidebar:toggle')) }}>
          Menu
        </button>
      </div>
      {/* Mobilda header ichida dropdown nav olib tashlandi; sidebar orqali boshqariladi */}
    </header>
  )
}