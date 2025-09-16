import { useEffect, useState } from 'react'
import RoleGuard from '../components/RoleGuard.jsx'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { myStatus, getCompanyMetrics } from '../utils/api.js'

export default function SellerDashboard() {
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState([
    { key: 'items_total', label: "Mahsulotlar (jami)", value: '—' },
    { key: 'items_active', label: "Faol mahsulotlar", value: '—' },
    { key: 'items_added_7d', label: "7 kunda qoʼshilgan", value: '—' },
    { key: 'members_total', label: "Aʼzolar (jami)", value: '—' },
    { key: 'orders_in_progress', label: "Faol buyurtmalar", value: '—' },
    { key: 'ratings_avg', label: "Oʼrtacha reyting", value: '—' },
  ])

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      try {
        const status = await myStatus()
        const companyId = status?.company_id || localStorage.getItem('company_id')
        if (status?.company_id) localStorage.setItem('company_id', status.company_id)
        if (companyId) {
          try {
            const m = await getCompanyMetrics(companyId)
            setCards([
              { key: 'items_total', label: "Mahsulotlar (jami)", value: String(m.items.total||0) },
              { key: 'items_active', label: "Faol mahsulotlar", value: String(m.items.active||0) },
              { key: 'items_added_7d', label: "7 kunda qoʼshilgan", value: String(m.items.added_7d||0) },
              { key: 'members_total', label: "Aʼzolar (jami)", value: String(m.members.total||0) },
              { key: 'orders_in_progress', label: "Faol buyurtmalar", value: String(m.orders.in_progress||0) },
              { key: 'ratings_avg', label: "Oʼrtacha reyting", value: (m.ratings.avg||0).toFixed(1) },
            ])
          } catch {}
        }
      } catch {}
      finally { if (mounted) setLoading(false) }
    })()
    return ()=>{ mounted = false }
  }, [])

  return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((c)=> (
            <div key={c.key} className="card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              <div className="text-sm muted">{c.label}</div>
              <div className="text-2xl font-semibold text-gray-900 mt-1">
                {loading ? <span className="inline-block h-5 w-16 bg-gray-100 rounded animate-pulse" /> : c.value}
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="card p-5">
          <div className="font-semibold text-gray-900 mb-2">Tez amallar</div>
          <div className="flex flex-wrap gap-3">
            <a href="/items/new" className="btn-primary hover:shadow-lg hover:-translate-y-0.5">Yangi mahsulot</a>
            <a href="/requests" className="btn-outline hover:-translate-y-0.5">Soʼrovlar</a>
            <a href="/orders" className="btn-outline hover:-translate-y-0.5">Buyurtmalar</a>
          </div>
        </div>

        {/* Recent lists */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="font-semibold text-gray-900 mb-3">Soʼnggi soʼrovlar</div>
            <div className="space-y-2">
              {loading ? (
                Array.from({length:4}).map((_,i)=>(<div key={i} className="h-10 bg-gray-50 rounded animate-pulse" />))
              ) : (
                <div className="text-sm muted">Hozircha maʼlumot yoʼq</div>
              )}
            </div>
          </div>
          <div className="card p-5">
            <div className="font-semibold text-gray-900 mb-3">Soʼnggi buyurtmalar</div>
            <div className="space-y-2">
              {loading ? (
                Array.from({length:4}).map((_,i)=>(<div key={i} className="h-10 bg-gray-50 rounded animate-pulse" />))
              ) : (
                <div className="text-sm muted">Hozircha maʼlumot yoʼq</div>
              )}
            </div>
          </div>
        </div>
      </div>
      </DashboardLayout>
    </RoleGuard>
  )
}


