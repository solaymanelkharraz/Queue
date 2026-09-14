import { useState, useEffect } from 'react'

const ADS = [
  '/ads/ad1.jpg',
  '/ads/ad2.jpg',
  '/ads/ad3.jpg'
]

export default function AdCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ADS.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div dir="rtl" className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-black">
      {ADS.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={src} 
            alt={`إعلان ${idx + 1}`} 
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      <div className="absolute inset-0 flex items-center justify-center -z-10 bg-gray-800">
        <p className="text-2xl text-gray-400 font-semibold">جاري تحميل الإعلانات...</p>
      </div>
    </div>
  )
}
