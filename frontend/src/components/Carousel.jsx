import { useEffect, useRef, useState } from 'react'

export default function Carousel({ items = [], interval = 3000 }) {
  const [index, setIndex] = useState(0)
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % (items.length || 1))
    }, interval)
    return () => clearInterval(timer.current)
  }, [items.length, interval])

  if (!items.length) return null

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200">
      <div className="whitespace-nowrap transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
        {items.map((item, i) => (
          <div key={i} className="inline-block align-top w-full h-56 md:h-72 bg-gray-100 flex items-center justify-center">
            {/* Rasm joyi: item.src qo'ying */}
            <span className="text-gray-500 text-sm">Rasm {i + 1} uchun joy</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`h-2 w-2 rounded-full ${i === index ? 'bg-blue-600' : 'bg-gray-300'}`}></button>
        ))}
      </div>
    </div>
  )
}
