import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import RoleGuard from '../../components/RoleGuard.jsx'
import { Link, useSearchParams } from 'react-router-dom'
import { getItems, getItemMeta } from '../../utils/api.js'

export default function ItemsList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ categories: [], subcategories: [], units: [], companies: [], regions: [] })
  const [filters, setFilters] = useState({ 
    q: '', 
    category: '', 
    subcategory: '', 
    unit: '', 
    status: '', 
    min_price: '',
    max_price: '',
    region: '',
    company: '',
    sort: '-created_at' 
  })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [subOptions, setSubOptions] = useState([])
  const [hovering, setHovering] = useState(null)
  const [slideIdx, setSlideIdx] = useState({})
  const [animating, setAnimating] = useState({})

  // URL parametrlarini o'qish
  useEffect(() => {
    const categoryId = searchParams.get('category')
    const subcategoryId = searchParams.get('subcategory')
    
    if (categoryId && meta.categories.length > 0) {
      const category = meta.categories.find(c => c.id === categoryId)
      if (category) {
        setSelectedCategory(category)
        setFilters(f => ({ ...f, category: categoryId, subcategory: subcategoryId || '' }))
        
        const subs = (meta.subcategories || []).filter(s => String(s.category_id) === String(categoryId))
        setSubOptions(subs)
        
        if (subcategoryId) {
          const subcategory = subs.find(s => s.id === subcategoryId)
          if (subcategory) {
            setSelectedSubcategory(subcategory)
          }
        }
      }
    }
  }, [searchParams, meta.categories, meta.subcategories])

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      try {
        const [data, metaData] = await Promise.all([
          getItems({ 
            search: filters.q || undefined, 
            category: filters.category || undefined, 
            subcategory: filters.subcategory || undefined, 
            unit: filters.unit || undefined, 
            status: filters.status || undefined,
            min_price: filters.min_price || undefined,
            max_price: filters.max_price || undefined,
            region: filters.region || undefined,
            company: filters.company || undefined,
            ordering: filters.sort || undefined 
          }),
          getItemMeta()
        ])
        const list = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : [])
        if (mounted) {
          setItems(list)
          const cats = Array.isArray(metaData?.categories) ? metaData.categories : (Array.isArray(metaData) ? metaData : [])
          const subs = Array.isArray(metaData?.subcategories) ? metaData.subcategories : []
          const companies = Array.isArray(metaData?.companies) ? metaData.companies : []
          const regions = Array.isArray(metaData?.regions) ? metaData.regions : []
          setMeta({ 
            categories: cats, 
            subcategories: subs, 
            units: Array.isArray(metaData?.units) ? metaData.units : [],
            companies,
            regions
          })
          const sopts = subs.filter(s=> String(s.category_id)===String(filters.category))
          setSubOptions(sopts)
        }
      } finally { if (mounted) setLoading(false) }
    })()
    return ()=>{ mounted = false }
  }, [filters])

  function onCategoryChange(e){
    const val = e.target.value
    setFilters(f=> ({ ...f, category: val, subcategory: '' }))
    const subs = (meta.subcategories||[]).filter(s=> String(s.category_id)===String(val))
    setSubOptions(subs)
  }

  function handleCategorySelect(category) {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
    setFilters(f => ({ ...f, category: category.id, subcategory: '' }))
    
    const subs = (meta.subcategories || []).filter(s => String(s.category_id) === String(category.id))
    setSubOptions(subs)
    
    // Avtomatik filterlash - useEffect orqali amalga oshadi
  }

  function handleSubcategorySelect(subcategory) {
    setSelectedSubcategory(subcategory)
    setFilters(f => ({ ...f, subcategory: subcategory.id }))
    
    // Avtomatik filterlash - useEffect orqali amalga oshadi
  }

  function clearCategorySelection() {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setFilters(f => ({ ...f, category: '', subcategory: '' }))
    setSubOptions([])
    
    // Avtomatik filterlash - useEffect orqali amalga oshadi
  }

  // autoplay 2s, pause on hover, reset to 0 on hover
  useEffect(()=>{
    const id = setInterval(()=>{
      setSlideIdx(prev => {
        const next = { ...prev }
        const willAnimate = {}
        items.forEach(it => {
          const total = Array.isArray(it.images_urls) ? it.images_urls.length : 0
          if (!total) return
          const cur = prev[it.id] ?? 0
          // indeksni doim oldinga oshiramiz, hover bo'lsa ham oshishda davom etadi
          next[it.id] = (cur + 1) % total
          willAnimate[it.id] = true
        })
        if (Object.keys(willAnimate).length) {
          setAnimating(s => ({ ...s, ...willAnimate }))
          setTimeout(()=>{
            setAnimating(s => {
              const copy = { ...s }
              Object.keys(willAnimate).forEach(k=>{ delete copy[k] })
              return copy
            })
          }, 1000)
        }
        return next
      })
    }, 3500)
    return ()=> clearInterval(id)
  }, [items, hovering])

  function formatPrice(n){
    if (!n && n !== 0) return '-'
    return new Intl.NumberFormat('uz-UZ').format(n) + ' soʼm'
  }
  function formatDate(iso){
    if(!iso) return ''
    try{ const d=new Date(iso); return d.toLocaleDateString('uz-UZ') }catch{ return '' }
  }
  function formatQty(n){
    if (!n && n !== 0) return '-'
    return new Intl.NumberFormat('uz-UZ').format(n)
  }

  return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Mahsulotlar</h2>
          <Link to="/items/new" className="btn-primary hover:shadow-lg hover:-translate-y-0.5">Yangi mahsulot</Link>
        </div>
        

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Qidiruv va filterlar</h3>
            <button
              onClick={() => {
                setFilters({
                  q: '',
                  category: '',
                  subcategory: '',
                  unit: '',
                  status: '',
                  min_price: '',
                  max_price: '',
                  region: '',
                  company: '',
                  sort: '-created_at'
                })
                clearCategorySelection()
              }}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 font-medium transition-all duration-200"
            >
              Filterlarni tozalash
            </button>
          </div>
          
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qidiruv</label>
              <input 
                className="input w-full" 
                placeholder="Mahsulot nomi bo'yicha qidirish..." 
                value={filters.q} 
                onChange={e=>setFilters(f=>({ ...f, q: e.target.value }))} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Holat</label>
              <select className="input w-full" value={filters.status} onChange={e=>setFilters(f=>({ ...f, status: e.target.value }))}>
                <option value="">Barchasi</option>
                <option value="mavjud">Mavjud</option>
                <option value="mavjud_emas">Mavjud emas</option>
                <option value="sotildi">Sotildi</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Viloyat</label>
              <select className="input w-full" value={filters.region} onChange={e=>setFilters(f=>({ ...f, region: e.target.value }))}>
                <option value="">Barchasi</option>
                {meta.regions.map((r)=> <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kompaniya</label>
              <select className="input w-full" value={filters.company} onChange={e=>setFilters(f=>({ ...f, company: e.target.value }))}>
                <option value="">Barchasi</option>
                {meta.companies.map((c)=> <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          
          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birlik</label>
              <select className="input w-full" value={filters.unit} onChange={e=>setFilters(f=>({ ...f, unit: e.target.value }))}>
                <option value="">Barchasi</option>
                {meta.units.map((u)=> <option key={u.value||u} value={u.value||u}>{u.label||u}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Saralash</label>
              <select className="input w-full" value={filters.sort} onChange={e=>setFilters(f=>({ ...f, sort: e.target.value }))}>
                <option value="-created_at">Yangi → Eski</option>
                <option value="created_at">Eski → Yangi</option>
                <option value="-price">Narx: yuqoridan</option>
                <option value="price">Narx: pastdan</option>
                <option value="-name">Ism: A → Z</option>
                <option value="name">Ism: Z → A</option>
              </select>
            </div>
          </div>
          
          {/* Third Row - Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Narx (min)</label>
              <input 
                type="number"
                className="input w-full" 
                placeholder="0"
                value={filters.min_price} 
                onChange={e=>setFilters(f=>({ ...f, min_price: e.target.value }))} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Narx (max)</label>
              <input 
                type="number"
                className="input w-full" 
                placeholder="∞"
                value={filters.max_price} 
                onChange={e=>setFilters(f=>({ ...f, max_price: e.target.value }))} 
              />
            </div>
          </div>
        </div>
        
        <div className="card p-4 space-y-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({length:6}).map((_,i)=>(
                <div key={i} className="card overflow-hidden">
                  <div className="aspect-video bg-gray-50 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-50 rounded w-2/3 animate-pulse" />
                    <div className="h-3 bg-gray-50 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))
            ) : items.length ? (
              items.map((it)=> (
                <div key={it.id} className="card overflow-hidden hover:shadow-xl transition hover:-translate-y-0.5">
                  <div className="aspect-video bg-gray-100 overflow-hidden relative"
                       onMouseEnter={()=> setHovering(it.id)}
                       onMouseLeave={()=> setHovering(null)}>
                    {Array.isArray(it.images_urls) && it.images_urls.length ? (
                      (()=>{
                        const total = it.images_urls.length
                        const cur = slideIdx[it.id] ?? 0
                        const isHover = hovering===it.id
                        if (isHover) {
                          return (
                            <img src={it.images_urls[0]} alt={it.name} className="absolute inset-0 w-full h-full object-cover" />
                          )
                        }
                        const nextIdx = (cur + 1) % total
                        const isAnim = !!animating[it.id]
                        return (
                          <div className="absolute inset-0 overflow-hidden">
                            <div className={`flex w-[200%] h-full transition-transform duration-1000 ${isAnim ? '-translate-x-1/2' : 'translate-x-0'}`}>
                              <img src={it.images_urls[cur]} alt={it.name} className="w-1/2 h-full object-cover" />
                              <img src={it.images_urls[nextIdx]} alt={it.name} className="w-1/2 h-full object-cover" />
                            </div>
                          </div>
                        )
                      })()
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Rasm yoʼq</div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{it.name}</div>
                        <div className="text-xs muted">{it.category_name || '-'}</div>
                        <div className="text-xs muted">{it.subcategory_name || ''}</div>
                        <div className="text-xs text-gray-500">{formatQty(it.quantity)} {it.unit || '-'}</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 whitespace-nowrap text-right">
                        {formatPrice(it.price)}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 line-clamp-2">{it.description}</div>
                    <div className="flex items-center justify-between mt-3">
                      <Link to={`/items/${it.id}`} className="btn-primary text-xs">Batafsil</Link>
                      <Link to={`/items/${it.id}/edit`} className="btn-outline text-xs">Tahrirlash</Link>
                    </div>
                    <div className="mt-2 text-[11px] text-gray-400">Yaratilgan: {formatDate(it.created_at)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm muted py-6">Mahsulotlar hali qoʼshilmagan</div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}


