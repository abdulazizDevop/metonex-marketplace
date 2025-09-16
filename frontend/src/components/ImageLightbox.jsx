import { useEffect } from 'react'

export default function ImageLightbox({ images = [], index = 0, onClose, onPrev, onNext }){
  useEffect(()=>{
    function onKey(e){
      if(e.key === 'Escape') onClose && onClose()
      if(e.key === 'ArrowLeft') onPrev && onPrev()
      if(e.key === 'ArrowRight') onNext && onNext()
    }
    document.addEventListener('keydown', onKey)
    return ()=> document.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  if (!images.length) return null
  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative max-w-5xl w-full">
          <img src={images[index]} alt="preview" className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
          <button aria-label="Close" onClick={onClose} className="absolute top-3 right-3 bg-white/95 hover:bg-white text-gray-800 rounded-full w-12 h-12 shadow flex items-center justify-center text-lg border border-gray-300 ring-1 ring-black/10">✕</button>
          {images.length > 1 && (
            <>
              <button aria-label="Prev" onClick={onPrev} className="absolute top-1/2 -translate-y-1/2 left-3 bg-white/95 hover:bg-white text-gray-800 rounded-full w-12 h-12 shadow flex items-center justify-center text-lg border border-gray-300 ring-1 ring-black/10">←</button>
              <button aria-label="Next" onClick={onNext} className="absolute top-1/2 -translate-y-1/2 right-3 bg-white/95 hover:bg-white text-gray-800 rounded-full w-12 h-12 shadow flex items-center justify-center text-lg border border-gray-300 ring-1 ring-black/10">→</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


