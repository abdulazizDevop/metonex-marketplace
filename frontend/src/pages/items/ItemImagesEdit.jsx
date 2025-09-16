import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import RoleGuard from '../../components/RoleGuard.jsx'
import { getItem, getItemImages, addItemImages, deleteItemImage } from '../../utils/api.js'

export default function ItemImagesEdit(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmAdd, setConfirmAdd] = useState({ open: false, files: null })
  const [confirmDelete, setConfirmDelete] = useState({ open: false, imageId: null })
  const [deleting, setDeleting] = useState(false)

  async function refresh(){
    const [d, imgs] = await Promise.all([getItem(id), getItemImages(id)])
    setItem(d); setImages(imgs)
  }

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      try{ await refresh() } catch(e){ setError('Yuklashda xato') } finally{ if(mounted) setLoading(false) }
    })()
    return ()=>{ mounted = false }
  }, [id])

  async function onAdd(e){
    const files = e.target.files
    if(!files || !files.length) return
    
    // FileList ni Array ga aylantirish
    const filesArray = Array.from(files)
    console.log('Tanlangan rasmlar:', filesArray)
    console.log('Rasmlar soni:', filesArray.length)
    
    setConfirmAdd({ open: true, files: filesArray })
    e.target.value = ''
  }

  async function doAddImages(){
    setUploading(true)
    setError('')
    try{ 
      await addItemImages(id, confirmAdd.files)
      await refresh()
      // Spinner vaqtini ko'paytirish uchun qisqa kutish
      await new Promise(resolve => setTimeout(resolve, 1500))
      setConfirmAdd({ open: false, files: null })
    } catch(e){ 
      setError('Yuklashda xato: ' + (e?.response?.data?.detail || e.message))
    } finally { 
      setUploading(false)
    }
  }

  async function onDelete(imageId){
    setConfirmDelete({ open: true, imageId })
  }

  async function doDeleteImage(){
    setDeleting(true)
    try{ 
      await deleteItemImage(id, confirmDelete.imageId)
      setImages(prev=> prev.filter(i=> i.id !== confirmDelete.imageId))
      // Spinner vaqtini ko'paytirish uchun qisqa kutish
      await new Promise(resolve => setTimeout(resolve, 1000))
      setConfirmDelete({ open: false, imageId: null })
    } catch(e){ 
      setError('O\'chirishda xato: ' + (e?.response?.data?.detail || e.message))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <RoleGuard requiredRole="SELLER" requireCompany={true}>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Rasmlarni tahrirlash</h2>
          <div className="flex gap-2">
            <Link to={`/items/${id}`} className="btn-outline">Batafsil</Link>
            <button 
              className="btn-primary flex items-center gap-2" 
              disabled={saving}
              onClick={async()=>{
                setSaving(true)
                try {
                  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate save
                  navigate(-1)
                } finally {
                  setSaving(false)
                }
              }}
            >
              {saving && <div className="spinner w-4 h-4"></div>}
              {saving ? 'Saqlanmoqda…' : 'Saqlash'}
            </button>
          </div>
        </div>
        <div className="card p-5">
          {loading ? 'Yuklanmoqda…' : (
            <>
              {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
              <div className="mb-4">
                <label className="text-sm text-gray-700">Rasm qoʼshish</label>
                <input type="file" className="mt-1" accept="image/*" multiple disabled={uploading} onChange={onAdd} />
                {uploading && <div className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                  <div className="spinner w-4 h-4"></div>
                  Rasmlar yuklanmoqda...
                </div>}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map(img => (
                  <div key={img.id} className="card overflow-hidden">
                    <div className="aspect-video bg-gray-100">
                      <img src={img.url} alt="item" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{img.id.slice(0,8)}…</span>
                      <button 
                        className="btn-outline text-xs" 
                        style={{borderColor:'#fca5a5', color:'#dc2626'}}
                        onClick={()=>onDelete(img.id)}
                      >
                        Oʼchirish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Rasm qo'shish tasdiqlash modali */}
        {confirmAdd.open && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=> !uploading && setConfirmAdd({ open: false, files: null })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="text-lg font-semibold text-gray-900 mb-2">Rasm qo'shish</div>
                <div className="text-sm text-gray-600 mb-4">
                  Rostdan ham {confirmAdd.files ? confirmAdd.files.length : 0} ta rasm qo'shmoqchimisiz?
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="btn-outline" 
                    disabled={uploading}
                    onClick={()=> setConfirmAdd({ open: false, files: null })}
                  >
                    Bekor qilish
                  </button>
                  <button 
                    className="btn-outline flex items-center gap-2" 
                    disabled={uploading}
                    onClick={doAddImages}
                  >
                    {uploading && <div className="spinner w-4 h-4"></div>}
                    {uploading ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rasm o'chirish tasdiqlash modali */}
        {confirmDelete.open && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=> !deleting && setConfirmDelete({ open: false, imageId: null })} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="text-lg font-semibold text-gray-900 mb-2">Rasm o'chirish</div>
                <div className="text-sm text-gray-600 mb-4">
                  Rostdan ham ushbu rasmini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="btn-outline" 
                    disabled={deleting}
                    onClick={()=> setConfirmDelete({ open: false, imageId: null })}
                  >
                    Bekor qilish
                  </button>
                  <button 
                    className="btn-outline flex items-center gap-2" 
                    style={{borderColor:'#fca5a5', color:'#dc2626'}}
                    disabled={deleting}
                    onClick={doDeleteImage}
                  >
                    {deleting && <div className="spinner w-4 h-4"></div>}
                    {deleting ? 'O\'chirilmoqda...' : 'O\'chirish'}
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


