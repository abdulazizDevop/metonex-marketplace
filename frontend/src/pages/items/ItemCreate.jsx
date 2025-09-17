import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import RoleGuard from '../../components/RoleGuard.jsx'
import { createItem, getItemMeta, myStatus } from '../../utils/api.js'

export default function ItemCreate() {
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState('')
  const [error, setError] = useState('')
  const [meta, setMeta] = useState({ categories: [], subcategories: [], units: [] })
  const [subOptions, setSubOptions] = useState([])
  const [razmerOptions, setRazmerOptions] = useState([])
  const [companyId, setCompanyId] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [unitValue, setUnitValue] = useState('')

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      try {
        const [ms, m] = await Promise.all([myStatus(), getItemMeta()])
        if (mounted) {
          setCompanyId(ms?.company_id || '')
          const cats = Array.isArray(m?.categories) ? m.categories : []
          const subs = Array.isArray(m?.subcategories) ? m.subcategories : []
          setMeta({ categories: cats, subcategories: subs, units: Array.isArray(m?.units) ? m.units : [] })
        }
      } catch {}
    })()
    return ()=>{ mounted = false }
  }, [])

  function onCategoryChange(e){
    const val = e.target.value
    const subs = (meta.subcategories||[]).filter(s=> String(s.category_id)===String(val))
    setSubOptions(subs)
    setSelectedSubcategory(null)
    setUnitValue('')
  }

  function onSubcategoryChange(e){
    const val = e.target.value
    const sub = subOptions.find(s => String(s.id) === String(val))
    setSelectedSubcategory(sub)
    setUnitValue(sub?.unit || '')
    loadRazmers(val)
  }

  async function loadRazmers(subcategoryId) {
    if (!subcategoryId) {
      setRazmerOptions([])
      return
    }
    try {
      const api = import.meta.env.VITE_API_URL || 'https://metonex.pythonanywhere.com/api/v1'
      const response = await fetch(`${api}/razmers/?subcategory=${subcategoryId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRazmerOptions(data.results || data || [])
      } else {
        setRazmerOptions([])
      }
    } catch (error) {
      console.error('Razmerlarni yuklashda xato:', error)
      setRazmerOptions([])
    }
  }

  async function submit(e) {
    e.preventDefault()
    setError(''); setOk(''); setLoading(true)
    const form = new FormData(e.currentTarget)
    try {
      await createItem(form)
      setOk('Mahsulot yaratildi')
      setTimeout(()=>{ window.location.href = '/items' }, 700)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Yaratishda xato')
    } finally { setLoading(false) }
  }

  return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Yangi mahsulot</h2>
        </div>
        <div className="card p-5">
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          {ok && <div className="text-green-600 text-sm mb-3">{ok}</div>}
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <input type="hidden" name="company" value={companyId} />
            <div>
              <label className="text-sm text-gray-700">Nomi</label>
              <input name="name" className="input mt-1" placeholder="Masalan: M300 sement 50kg" required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Kategoriya</label>
              <select name="category" className="input mt-1" required onChange={onCategoryChange}>
                <option value="">Tanlang</option>
                {meta.categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Subkategoriya</label>
              <select name="subcategory" className="input mt-1" required onChange={onSubcategoryChange}>
                <option value="">Tanlang</option>
                {subOptions.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Miqdor</label>
              <input name="quantity" type="number" className="input mt-1" min="1" step="1" placeholder="1" required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Narx (soʼm)</label>
              <input name="price" type="number" className="input mt-1" min="0" step="1000" placeholder="0" required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Birlik</label>
              <input 
                name="unit" 
                type="text"
                className="input mt-1 bg-gray-200 text-gray-600 cursor-not-allowed"
                value={unitValue}
                disabled={true}
                placeholder="Avtomatik tanlanadi"
                required
                readOnly
              />
              {unitValue && (
                <div className="text-xs text-gray-500 mt-1">
                  Sub kategoriya bo'yicha avtomatik tanlandi: <strong>{unitValue}</strong>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-700">Razmer</label>
              <select name="razmer" className="input mt-1">
                <option value="">Razmer tanlang</option>
                {razmerOptions.map(razmer => (
                  <option key={razmer.id} value={razmer.id}>{razmer.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Zavod</label>
              <input 
                name="zavod" 
                type="text"
                className="input mt-1"
                placeholder="Ishlab chiqaruvchi zavod nomi"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Sertifikatlar (koʼp fayl)</label>
              <input name="images" type="file" className="mt-1" accept="image/*" multiple />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button disabled={loading} className="btn-primary">{loading ? 'Yaratilmoqda…' : 'Yaratish'}</button>
              <a href="/items" className="btn-outline">Bekor qilish</a>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}


