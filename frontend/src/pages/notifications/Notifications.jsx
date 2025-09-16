import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import RoleGuard from '../../components/RoleGuard.jsx'
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from '../../utils/api.js'

export default function Notifications(){
  const [data, setData] = useState({ unread: 0, results: [] })
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [modal, setModal] = useState({ open: false, item: null })
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'

  async function load(){
    try{ const d = await getMyNotifications(); setData(d) } finally { setLoading(false) }
  }

  useEffect(()=>{
    let active = true
    load()
    const id = setInterval(()=>{ if(active) load() }, 5000)
    return ()=>{ active=false; clearInterval(id) }
  }, [])

  async function markAll(){
    setMarking(true)
    try{ await markAllNotificationsRead(); await load() } finally { setMarking(false) }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      'order_created': '📦',
      'order_payment_confirmed': '💳',
      'order_production_started': '🏭',
      'order_shipped': '🚚',
      'order_delivered': '✅',
      'order_completed': '🎉',
      'rating_received': '⭐',
      'rating_request': '📝',
      'new_offer': '💼',
      'offer_accepted': '✅',
      'offer_rejected': '❌',
      'new_request': '📋',
      'item_created': '🆕',
      'item_updated': '✏️',
      'item_deleted': '🗑️',
      'certificate_added': '📜',
      'member_added': '👥',
      'member_removed': '👤',
      'profile_updated': '👤',
      'company_profile_updated': '🏢',
      'info': 'ℹ️'
    }
    return icons[type] || '📢'
  }

  const getNotificationColor = (type) => {
    const colors = {
      'order_created': 'bg-blue-100 text-blue-800',
      'order_payment_confirmed': 'bg-green-100 text-green-800',
      'order_production_started': 'bg-yellow-100 text-yellow-800',
      'order_shipped': 'bg-purple-100 text-purple-800',
      'order_delivered': 'bg-green-100 text-green-800',
      'order_completed': 'bg-emerald-100 text-emerald-800',
      'rating_received': 'bg-yellow-100 text-yellow-800',
      'rating_request': 'bg-orange-100 text-orange-800',
      'new_offer': 'bg-blue-100 text-blue-800',
      'offer_accepted': 'bg-green-100 text-green-800',
      'offer_rejected': 'bg-red-100 text-red-800',
      'new_request': 'bg-indigo-100 text-indigo-800',
      'item_created': 'bg-green-100 text-green-800',
      'item_updated': 'bg-blue-100 text-blue-800',
      'item_deleted': 'bg-red-100 text-red-800',
      'certificate_added': 'bg-purple-100 text-purple-800',
      'member_added': 'bg-green-100 text-green-800',
      'member_removed': 'bg-red-100 text-red-800',
      'profile_updated': 'bg-gray-100 text-gray-800',
      'company_profile_updated': 'bg-gray-100 text-gray-800',
      'info': 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const filteredNotifications = data.results?.filter(notification => {
    if (filter === 'unread') return !notification.read_at
    if (filter === 'read') return notification.read_at
    return true
  }) || []

  return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bildirishnomalar</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Jami:</span>
              <span className="text-sm font-medium text-gray-900">{data.results?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">O'qilmagan:</span>
              <span className="text-sm font-medium text-blue-600">{data.unread || 0}</span>
            </div>
            <button 
              className="btn-outline" 
              onClick={markAll} 
              disabled={marking || data.unread===0}
            >
              {marking ? '...' : 'Barchasini o\'qilgan'}
            </button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'unread' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            O'qilmagan
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'read' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            O'qilgan
          </button>
        </div>
        <div className="card p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map(notification => {
                const raw = String(notification.message||'')
                let actor = ''
                let main = raw
                const idx = raw.indexOf(': ')
                if (idx > -1) { actor = raw.slice(0, idx); main = raw.slice(idx+2) }
                
                return (
                  <button 
                    key={notification.id} 
                    onClick={async()=>{ 
                      try{ await markNotificationRead(notification.id) }catch{}; 
                      setModal({ open:true, item:notification }) 
                    }} 
                    className={`w-full text-left px-6 py-4 transition-all duration-200 hover:bg-gray-50 ${
                      notification.read_at ? 'bg-white' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                              {notification.type_display || notification.type}
                            </span>
                            {!notification.read_at && (
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(notification.created_at).toLocaleString('uz-UZ')}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-900 font-medium mb-1">
                          {main}
                        </div>
                        
                        {actor && (
                          <div className="text-xs text-gray-500">
                            {actor}
                          </div>
                        )}
                        
                        {(notification.related_order_id || notification.related_request_title) && (
                          <div className="mt-2 flex items-center gap-2">
                            {notification.related_order_id && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Buyurtma: {notification.related_order_id.slice(0, 8)}...
                              </span>
                            )}
                            {notification.related_request_title && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                So'rov: {notification.related_request_title}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
              
              {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📭</div>
                  <div className="text-sm text-gray-500">
                    {filter === 'unread' ? 'O\'qilmagan xabarlar yo\'q' : 
                     filter === 'read' ? 'O\'qilgan xabarlar yo\'q' : 
                     'Hozircha xabar yo\'q'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {modal.open && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=> setModal({ open:false, item:null })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                    {getNotificationIcon(modal.item?.type)}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">Xabar tafsiloti</div>
                    <div className="text-sm text-gray-500">
                      {modal.item && new Date(modal.item.created_at).toLocaleString('uz-UZ')}
                    </div>
                  </div>
                </div>
                
                {(() => {
                  const raw = String(modal.item?.message || '')
                  let actor = ''
                  let main = raw
                  const idx = raw.indexOf(': ')
                  if (idx > -1) { actor = raw.slice(0, idx); main = raw.slice(idx + 2) }
                  return (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-900 font-medium whitespace-pre-wrap break-words">
                          {main || '-'}
                        </div>
                        {actor && (
                          <div className="text-xs text-gray-500 mt-2">
                            {actor}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Turi</div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(modal.item?.type)}`}>
                              {modal.item?.type_display || modal.item?.type || '-'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Holat</div>
                          <div className="text-sm font-medium text-gray-700">
                            {modal.item?.read_at ? 'O\'qilgan' : 'O\'qilmagan'}
                          </div>
                          {modal.item?.read_at && (
                            <div className="text-xs text-gray-500">
                              {new Date(modal.item.read_at).toLocaleString('uz-UZ')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {(modal.item?.related_order_id || modal.item?.related_request_title) && (
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-2">Bog'liq obyektlar</div>
                          <div className="flex flex-wrap gap-2">
                            {modal.item?.related_order_id && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Buyurtma: {modal.item.related_order_id}
                              </span>
                            )}
                            {modal.item?.related_request_title && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                So'rov: {modal.item.related_request_title}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
                
                <div className="flex items-center justify-end mt-6">
                  <button 
                    className="btn-outline" 
                    onClick={()=> setModal({ open:false, item:null })}
                  >
                    Yopish
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


