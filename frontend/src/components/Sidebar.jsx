import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ isOpen, onToggle, collapsed = true, onCollapseToggle }) {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(collapsed)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Mahsulotlar', href: '/items', icon: '📦' },
    { name: 'Soʼrovlar', href: '/requests', icon: '📝' },
    { name: 'Buyurtmalar', href: '/orders/seller', icon: '🧾' },
    { name: 'Kompaniya profil', href: '/company/profile', icon: '🏢' },
    { name: 'Profil', href: '/profile', icon: '👤' },
    { name: 'Bildirishnomalar', href: '/notifications', icon: '🔔' },
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-[98] lg:hidden" onClick={onToggle} />}
      <div
        className={`fixed inset-y-0 left-0 z-[99] w-64 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} bg-white/95 backdrop-blur-sm border-r border-gray-200 transform transition-[width,transform] duration-700 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        onMouseEnter={() => { if (isCollapsed) { setIsCollapsed(false); onCollapseToggle && onCollapseToggle(false) } }}
        onMouseLeave={() => { if (!isCollapsed) { setIsCollapsed(true); onCollapseToggle && onCollapseToggle(true) } }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200/80">
            <div className="hidden lg:flex items-center justify-center w-full select-none relative">
              {isCollapsed ? (
                <img src="/src/assets/image.png" alt="logo" className="h-10 w-10" />
              ) : (
                <span className={`text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 drop-shadow-sm`}>
                  MetOneX
                </span>
              )}
            </div>
            <button onClick={onToggle} className="lg:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Toggle sidebar">✖️</button>
          </div>

          <nav className="flex-1 p-3 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center ${isCollapsed ? 'lg:justify-center' : ''} px-3 py-2 text-sm rounded-lg transition-all duration-200 ${isActive ? 'bg-sky-50 text-sky-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => onToggle && onToggle()}
                >
                  <span className={`mr-3 ${isCollapsed ? 'lg:mr-0' : 'lg:mr-3'}`}>{item.icon}</span>
                  <span className={`inline ${isCollapsed ? 'lg:hidden' : 'lg:inline'}`}>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={async ()=>{
                try {
                  const api = (import.meta.env.VITE_API_URL||'https://metonex.pythonanywhere.com/api/v1')
                  const refresh = localStorage.getItem('refresh')
                  const access = localStorage.getItem('access')
                  await fetch(api + '/auth/logout/', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access}` }, body: JSON.stringify({ refresh }) })
                } catch {}
                finally {
                  localStorage.removeItem('access'); localStorage.removeItem('refresh'); window.location.href='/'
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : ''} px-3 py-2 text-sm rounded-lg transition-all duration-200 bg-red-50 hover:bg-red-100 text-red-600`}
            >
              <span className={`${isCollapsed ? '' : 'mr-3'}`}>🚪</span>
              {!isCollapsed && 'Chiqish'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}


