import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import RoleGuard from '../../components/RoleGuard.jsx'
import { getItem, deleteItem } from '../../utils/api.js'
import ImageLightbox from '../../components/ImageLightbox.jsx'

export default function ItemDetail(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [idx, setIdx] = useState(0)
  const images = Array.isArray(data?.images_urls) ? data.images_urls : []
  const [lbOpen, setLbOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletionReason, setDeletionReason] = useState('')

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      try{ const d = await getItem(id); if(mounted) setData(d) } finally { if(mounted) setLoading(false) }
    })()
    return ()=>{ mounted = false }
  }, [id])

  // Autoplay olib tashlandi: faqat tugmalar orqali o'zgaradi

  function formatPrice(n){
    if (!n && n !== 0) return '-'
    return new Intl.NumberFormat('uz-UZ').format(n) + ' soʼm'
  }
  function formatQty(n){
    if (!n && n !== 0) return '-'
    return new Intl.NumberFormat('uz-UZ').format(n)
  }

  return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
        {loading ? (
          <div className="card p-6">Yuklanmoqda…</div>
        ) : !data ? (
          <div className="card p-6">Topilmadi</div>
        ) : (
          <div className="grid gap-6">
            <div className="card overflow-hidden">
              <div className="aspect-video bg-gray-100">
                {images.length ? (
                  <img src={images[idx]} alt={data.name} className="w-full h-full object-cover cursor-zoom-in" onClick={()=> setLbOpen(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Rasm yoʼq</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex items-center justify-between p-3">
                  <button className="btn-outline" onClick={()=> setIdx(v => (v-1+images.length)%images.length)}>Oldingi</button>
                  <Link to={`/items/${id}/images`} className="btn-outline">Rasmlarni tahrirlash</Link>
                  <button className="btn-outline" onClick={()=> setIdx(v => (v+1)%images.length)}>Keyingi</button>
                </div>
              )}
            </div>
            {lbOpen && (
              <ImageLightbox
                images={images}
                index={idx}
                onClose={()=> setLbOpen(false)}
                onPrev={()=> setIdx(v => (v-1+images.length)%images.length)}
                onNext={()=> setIdx(v => (v+1)%images.length)}
              />
            )}
            <div className="card p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">{data.name}</div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">{data.status}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Link to={`/items/${id}/edit`} className="btn-outline">Tahrirlash</Link>
                    <Link to="/items" className="btn-outline">Orqaga</Link>
                    <button className="btn-outline" style={{borderColor:'#fca5a5', color:'#dc2626'}} onClick={()=> setConfirmOpen(true)}>Oʼchirish</button>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Yaratilgan: {new Date(data.created_at).toLocaleDateString('uz-UZ')}</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {[['Kompaniya', data.company_name], ['Tomonidan qoʼshgan', data.user_name], ['Miqdor', `${formatQty(data.quantity)} ${data.unit}`], ['Asosiy kategoriya', `${data.category_name||''}`], ['Subkategoriya', `${data.subcategory_name||''}`], ['Narx', formatPrice(data.price)]].map(([label, value], i)=> (
                  <div key={i} className="p-3 rounded border bg-white/50">
                    <div className="muted">{label}</div>
                    <div className="font-medium break-words">{value||'-'}</div>
                  </div>
                ))}
                <div className="p-3 rounded border bg-white/50 sm:col-span-2">
                  <div className="muted">Tavsif</div>
                  <div className="font-medium whitespace-pre-wrap">{data.description || '-'}</div>
                </div>
                {Object.entries(data).map(([k,v])=>{
                  if ([ 'id','name','category','category_name','subcategory','subcategory_name','company','company_name','user','user_name','status','description','quantity','unit','price','images','images_urls','created_at','updated_at' ].includes(k)) return null
                  try{
                    const txt = typeof v === 'object' ? JSON.stringify(v) : String(v)
                    return (
                      <div key={k} className="p-3 rounded border bg-white/50">
                        <div className="muted">{k}</div>
                        <div className="font-medium break-words whitespace-pre-wrap text-xs">{txt}</div>
                      </div>
                    )
                  }catch{return null}
                })}
              </div>
              
            </div>
            {confirmOpen && (
              <div className="fixed inset-0 z-[60]">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=> setConfirmOpen(false)} />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5">
                    <div className="text-lg font-semibold text-gray-900 mb-2">Mahsulotni o'chirish</div>
                    <div className="text-sm text-gray-600 mb-4">
                      Nima uchun ushbu mahsulotni o'chirmoqchisiz?
                    </div>
                    <div className="mb-4">
                      <textarea
                        className="input w-full"
                        rows={3}
                        placeholder="O'chirish sababini kiriting... (kamida 10 ta belgi)"
                        value={deletionReason}
                        onChange={e => setDeletionReason(e.target.value)}
                        required
                      />
                      <div className={`text-xs mt-1 ${
                        deletionReason.length >= 10 ? 'text-green-600' : 
                        deletionReason.length > 0 ? 'text-orange-500' : 'text-gray-500'
                      }`}>
                        {deletionReason.length}/10 belgi (minimum 10 ta belgi kerak)
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="btn-outline" 
                        onClick={()=> {
                          setConfirmOpen(false)
                          setDeletionReason('')
                        }}
                      >
                        Bekor qilish
                      </button>
                      <button 
                        className="btn-outline" 
                        style={{borderColor:'#fca5a5', color:'#dc2626'}} 
                        onClick={async()=>{ 
                          try{ 
                            await deleteItem(id, { deletion_reason: deletionReason })
                            window.location.href='/items' 
                          } catch(e){ 
                            setConfirmOpen(false) 
                          } 
                        }}
                        disabled={!deletionReason.trim() || deletionReason.trim().length < 10}
                      >
                        O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </RoleGuard>
  )
}


