import { useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false)
  // Headerdan global voqea orqali sidebarni boshqarish
  useEffect(()=>{
    const handler = ()=> setOpen(true)
    window.addEventListener('sidebar:toggle', handler)
    return ()=> window.removeEventListener('sidebar:toggle', handler)
  }, [])
  return (
    <div className="min-h-screen relative">
      <Sidebar isOpen={open} onToggle={()=>setOpen(v=>!v)} />
      <main className="relative z-10 lg:ml-64 px-3 md:px-4 py-4 md:py-6">
        {children}
      </main>
    </div>
  )
}