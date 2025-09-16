import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import RoleGuard from '../../components/RoleGuard.jsx'
import BuyerHeader from '../../components/BuyerHeader.jsx'
import { getItems, getItemMeta } from '../../utils/api.js'

export default function BuyerCatalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState({ categories: [], subcategories: [], companies: [], regions: [], units: [] })
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    region: '',
    company: '',
    status: '',
    unit: '',
    sort: '-created_at'
  })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [subOptions, setSubOptions] = useState([])
  const [hovering, setHovering] = useState(null)
  const [slideIdx, setSlideIdx] = useState({})
  const [animating, setAnimating] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [cart, setCart] = useState([])

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

  useEffect(() => {
    loadItems()
  }, [filters, currentPage])

  useEffect(() => {
    loadMeta()
    // Savatni localStorage'dan yuklash
    const savedCart = localStorage.getItem('buyer_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Savat ma\'lumotlarini yuklashda xato:', error)
      }
    }
  }, [])

  async function loadMeta() {
    try {
      const metaData = await getItemMeta()
      const cats = Array.isArray(metaData?.categories) ? metaData.categories : []
      const subs = Array.isArray(metaData?.subcategories) ? metaData.subcategories : []
      const companies = Array.isArray(metaData?.companies) ? metaData.companies : []
      const regions = Array.isArray(metaData?.regions) ? metaData.regions : []
      const units = Array.isArray(metaData?.units) ? metaData.units : []
      
      setMeta({ categories: cats, subcategories: subs, companies, regions, units })
      
      // Agar kategoriya tanlangan bo'lsa, subkategoriyalarni yuklaymiz
      if (filters.category) {
        const sopts = subs.filter(s => String(s.category_id) === String(filters.category))
        setSubOptions(sopts)
      }
    } catch (error) {
      console.error('Meta ma\'lumotlarni yuklashda xato:', error)
    }
  }

  async function loadItems() {
    await loadItemsWithFilters(filters)
  }

  async function loadItemsWithFilters(filterParams) {
    try {
      setLoading(true)
      
      // Agar kategoriya tanlanmagan bo'lsa, hech narsa ko'rsatmaymiz
      if (!filterParams.category) {
        setItems([])
        setTotalPages(1)
        return
      }
      
      // API parametrlarini obyekt sifatida yaratamiz
      const paramsObj = {
        category: filterParams.category,
        page: currentPage,
        page_size: 12
      }
      
      if (filterParams.subcategory) paramsObj.subcategory = filterParams.subcategory
      if (filterParams.region) paramsObj.region = filterParams.region
      if (filterParams.company) paramsObj.company = filterParams.company
      if (filterParams.status) paramsObj.status = filterParams.status
      if (filterParams.unit) paramsObj.unit = filterParams.unit
      if (filterParams.sort) paramsObj.ordering = filterParams.sort
      
      console.log('Loading items with params:', paramsObj)
      
      const data = await getItems(paramsObj)
      console.log('Items response:', data)
      setItems(data.results || data)
      
      // Pagination ma'lumotlari
      if (data.count && data.page_size) {
        setTotalPages(Math.ceil(data.count / data.page_size))
      }
    } catch (error) {
      console.error('Mahsulotlarni yuklashda xato:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  function onCategoryChange(e) {
    const val = e.target.value
    setFilters(f => ({ ...f, category: val, subcategory: '' }))
    setCurrentPage(1)
    
    const subs = (meta.subcategories || []).filter(s => String(s.category_id) === String(val))
    setSubOptions(subs)
  }

  function handleCategorySelect(category) {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
    setCurrentPage(1)
    
    const subs = (meta.subcategories || []).filter(s => String(s.category_id) === String(category.id))
    setSubOptions(subs)
    
    // URL ni yangilash
    const newParams = new URLSearchParams(searchParams)
    newParams.set('category', category.id)
    newParams.delete('subcategory')
    setSearchParams(newParams)
    
    // Filters state'ni yangilash va keyin loadItems chaqirish
    setFilters(f => {
      const newFilters = { ...f, category: category.id, subcategory: '' }
      // setTimeout orqali state yangilanishini kutamiz
      setTimeout(() => loadItemsWithFilters(newFilters), 0)
      return newFilters
    })
  }

  function handleSubcategorySelect(subcategory) {
    setSelectedSubcategory(subcategory)
    setCurrentPage(1)
    
    // URL ni yangilash
    const newParams = new URLSearchParams(searchParams)
    newParams.set('subcategory', subcategory.id)
    setSearchParams(newParams)
    
    // Filters state'ni yangilash va keyin loadItems chaqirish
    setFilters(f => {
      const newFilters = { ...f, subcategory: subcategory.id }
      // setTimeout orqali state yangilanishini kutamiz
      setTimeout(() => loadItemsWithFilters(newFilters), 0)
      return newFilters
    })
  }

  function clearCategorySelection() {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setSubOptions([])
    setCurrentPage(1)
    
    // URL ni tozalash
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('category')
    newParams.delete('subcategory')
    setSearchParams(newParams)
    
    // Filters state'ni yangilash va keyin loadItems chaqirish
    setFilters(f => {
      const newFilters = { ...f, category: '', subcategory: '' }
      // setTimeout orqali state yangilanishini kutamiz
      setTimeout(() => loadItemsWithFilters(newFilters), 0)
      return newFilters
    })
  }


  // Autoplay funksiyasi - 3.5 soniyada bir marta
  useEffect(() => {
    const id = setInterval(() => {
      setSlideIdx(prev => {
        const next = { ...prev }
        const willAnimate = {}
        items.forEach(it => {
          const total = Array.isArray(it.images_urls) ? it.images_urls.length : 0
          if (!total) return
          const cur = prev[it.id] ?? 0
          next[it.id] = (cur + 1) % total
          willAnimate[it.id] = true
        })
        if (Object.keys(willAnimate).length) {
          setAnimating(s => ({ ...s, ...willAnimate }))
          setTimeout(() => {
            setAnimating(s => {
              const copy = { ...s }
              Object.keys(willAnimate).forEach(k => { delete copy[k] })
              return copy
            })
          }, 1000)
        }
        return next
      })
    }, 3500)
    return () => clearInterval(id)
  }, [items, hovering])

  function formatPrice(price) {
    if (!price && price !== 0) return '-'
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  function formatDate(iso) {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString('uz-UZ')
    } catch {
      return ''
    }
  }

  function formatQty(n) {
    if (!n && n !== 0) return '-'
    return new Intl.NumberFormat('uz-UZ').format(n)
  }

  function handlePageChange(page) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Savat funksiyalari
  function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(prev => prev.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart(prev => [...prev, { ...item, quantity: 1 }])
    }
  }

  function removeFromCart(itemId) {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  function updateCartQuantity(itemId, quantity) {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ))
  }

  function clearCart() {
    setCart([])
  }

  // Savatni localStorage'ga saqlash
  useEffect(() => {
    localStorage.setItem('buyer_cart', JSON.stringify(cart))
  }, [cart])


  function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <RoleGuard requiredRole="BUYER" requireCompany={true}>
      <div className="min-h-screen bg-white">
        <BuyerHeader showFilters={false} cartCount={getCartItemCount()} />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Category Selection - Ozon/Wildberries style */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Kategoriyalar</h2>
              {(selectedCategory || selectedSubcategory) && (
                <button
                  onClick={clearCategorySelection}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 font-medium transition-all duration-200"
                >
                  Barcha kategoriyalar
                </button>
              )}
            </div>
            
            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {meta.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    selectedCategory?.id === category.id
                      ? 'border-green-400 bg-green-300 text-gray-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="text-sm font-medium">{category.name}</div>
                </button>
              ))}
            </div>
            
            {/* Subcategories - if category selected */}
            {selectedCategory && subOptions.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-4">
                  {selectedCategory.name} - Subkategoriyalar
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {subOptions.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategorySelect(subcategory)}
                      className={`p-3 rounded-lg border transition-all duration-200 text-center ${
                        selectedSubcategory?.id === subcategory.id
                          ? 'border-green-400 bg-green-300 text-gray-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      <div className="text-sm font-medium">{subcategory.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Selected Path */}
            {(selectedCategory || selectedSubcategory) && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Tanlangan:</span>
                  {selectedCategory && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {selectedCategory.name}
                    </span>
                  )}
                  {selectedSubcategory && (
                    <>
                      <span className="text-gray-400">→</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {selectedSubcategory.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          

          {/* Items Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner w-8 h-8"></div>
            </div>
          ) : !filters.category ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kategoriya tanlang</h3>
              <p className="text-gray-600">Mahsulotlarni ko'rish uchun avval kategoriya tanlang</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mahsulot topilmadi</h3>
              <p className="text-gray-600">Bu kategoriyada hozircha mahsulot yo'q</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden hover:shadow-md hover:border-green-300 transition-all duration-200">
                    <Link to={`/buyer/items/${item.id}`}>
                      <div className="aspect-square bg-green-100 relative overflow-hidden"
                           onMouseEnter={() => setHovering(item.id)}
                           onMouseLeave={() => setHovering(null)}>
                        {Array.isArray(item.images_urls) && item.images_urls.length ? (
                          (() => {
                            const total = item.images_urls.length
                            const cur = slideIdx[item.id] ?? 0
                            const isHover = hovering === item.id
                            
                            if (isHover) {
                              return (
                                <img 
                                  src={item.images_urls[0]} 
                                  alt={item.name} 
                                  className="absolute inset-0 w-full h-full object-cover" 
                                />
                              )
                            }
                            
                            const nextIdx = (cur + 1) % total
                            const isAnim = !!animating[item.id]
                            
                            return (
                              <div className="absolute inset-0 overflow-hidden">
                                <div className={`flex w-[200%] h-full transition-transform duration-1000 ${isAnim ? '-translate-x-1/2' : 'translate-x-0'}`}>
                                  <img src={item.images_urls[cur]} alt={item.name} className="w-1/2 h-full object-cover" />
                                  <img src={item.images_urls[nextIdx]} alt={item.name} className="w-1/2 h-full object-cover" />
                                </div>
                              </div>
                            )
                          })()
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-green-400">
                            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 truncate text-sm">{item.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{item.category_name || '-'}</p>
                            {item.subcategory_name && (
                              <p className="text-xs text-gray-400">{item.subcategory_name}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            {formatQty(item.quantity)} {item.unit || 'dona'}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        
                        {item.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="text-xs text-gray-400 mb-3">
                          {formatDate(item.created_at)}
                        </div>
                        
                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addToCart(item)
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          Savatga qo'shish
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* No Items Message */}
              {!loading && items.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-green-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Mahsulot topilmadi</h3>
                  <p className="text-gray-600">Qidiruv shartlarini o'zgartiring yoki boshqa filterlarni sinab ko'ring</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Oldingi
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            currentPage === page
                              ? 'bg-green-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Keyingi
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </RoleGuard>
  )
}
