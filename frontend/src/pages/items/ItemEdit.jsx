import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import RoleGuard from '../../components/RoleGuard.jsx'
import { getItem, getItemMeta, updateItem } from '../../utils/api.js'

export default function ItemEdit(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [meta, setMeta] = useState({ categories: [], units: [] })
  const [item, setItem] = useState(null)
  const statusOptions = [
    { value: 'mavjud', label: 'Mavjud' },
    { value: 'mavjud_emas', label: "Mavjud emas" },
    { value: 'sotildi', label: 'Sotildi' },
  ]

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      try{
        const [d, m] = await Promise.all([getItem(id), getItemMeta()])
        if(mounted){ setItem(d); setMeta({ categories: m.categories||[], units: m.units||[] }) }
      } catch(e){ setError('Yuklashda xato') }
      finally{ if(mounted) setLoading(false) }
    })()
    return ()=>{ mounted = false }
  }, [id])

  async function submit(e){
    e.preventDefault()
    setError(''); setSaving(true)
    const form = new FormData(e.currentTarget)
    // company maydonini yubormaymiz (backend e'tiborsiz qoldiradi baribir)
    form.delete('company')
    try{
      await updateItem(id, form)
      navigate(`/items/${id}`)
    } catch(err){ setError(err?.response?.data?.detail || 'Saqlashda xato') }
    finally{ setSaving(false) }
  }

  if(loading) return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
        <div className="card p-6">Yuklanmoqda…</div>
      </DashboardLayout>
    </RoleGuard>
  )

  if(!item) return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
        <div className="card p-6">Topilmadi</div>
      </DashboardLayout>
    </RoleGuard>
  )

  return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Mahsulotni tahrirlash</h2>
        </div>
        <div className="card p-5">
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">Kompaniya</label>
              <input className="input mt-1 bg-gray-100 text-gray-500" value={item.company_name||''} disabled readOnly />
            </div>
            <div>
              <label className="text-sm text-gray-700">Holati</label>
              <select name="status" className="input mt-1" defaultValue={item.status}>
                {statusOptions.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Nomi</label>
              <input name="name" className="input mt-1" defaultValue={item.name} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Kategoriya</label>
              <select name="category" className="input mt-1" defaultValue={item.category} required>
                <option value="">Tanlang</option>
                {meta.categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Birlik</label>
              <select name="unit" className="input mt-1" defaultValue={item.unit} required>
                <option value="">Tanlang</option>
                {meta.units.map(u=> <option key={u.value||u} value={u.value||u}>{u.label||u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Miqdor</label>
              <input name="quantity" type="number" className="input mt-1" min="1" step="1" defaultValue={item.quantity} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Narx (soʼm)</label>
              <input name="price" type="number" className="input mt-1" min="0" step="1000" defaultValue={item.price} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Zavod</label>
              <input 
                name="zavod" 
                type="text"
                className="input mt-1"
                defaultValue={item.zavod || ''}
                placeholder="Ishlab chiqaruvchi zavod nomi"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <div className="spinner w-4 h-4"></div>}
                {saving ? 'Saqlanmoqda…' : 'Saqlash'}
              </button>
              <button type="button" className="btn-outline" onClick={()=>navigate(-1)}>Bekor qilish</button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}


