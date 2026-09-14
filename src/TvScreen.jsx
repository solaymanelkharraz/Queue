import { useState, useEffect } from 'react'
import { announceNumber, playReminder } from './audio'
import AdCarousel from './AdCarousel'

export default function TvScreen() {
  const [ticket, setTicket] = useState(0)
  const [time, setTime] = useState(new Date())
  const [flash, setFlash] = useState(false)
  const [customMsg, setCustomMsg] = useState("")

  useEffect(() => {
    const clockTimer = setInterval(() => setTime(new Date()), 1000)

    const stored = localStorage.getItem('currentTicket')
    if (stored) setTicket(parseInt(stored, 10))
      
    const storedMsg = localStorage.getItem('customMessage')
    if (storedMsg) setCustomMsg(storedMsg)

    const handleStorageChange = (e) => {
      if (e.key === 'currentTicket') {
        const newTicket = parseInt(e.newValue, 10)
        if (newTicket > parseInt(e.oldValue || 0, 10)) {
           announceNumber()
           setFlash(true)
           setTimeout(() => setFlash(false), 1200)
        }
        setTicket(newTicket)
      }
      
      if (e.key === 'customMessage') {
        setCustomMsg(e.newValue || "")
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    const reminderTimer = setInterval(() => {
      playReminder()
    }, 5 * 60 * 1000)

    return () => {
      clearInterval(clockTimer)
      clearInterval(reminderTimer)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err))
    } else {
      document.exitFullscreen().catch(err => console.error(err))
    }
  }

  const prevNumbers = []
  for (let i = 1; i <= 3; i++) {
    if (ticket - i > 0) prevNumbers.push(ticket - i)
  }

  const timeString = time.toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit', hour12: true })
  const dateString = time.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  // Determine marquee text
  const marqueeText = customMsg 
    ? customMsg 
    : "إذا لم يكن لديك رقم، يرجى أخذ تذكرة الانتظار للتمتع بخدماتنا ✨ يرجى تحضير أوراقك الثبوتية قبل الوصول إلى الصندوق لتسريع العملية ✨ أهلاً وسهلاً بكم في وكالة تسهيلات"

  return (
    <div dir="rtl" className="h-screen w-screen bg-slate-900 text-white flex flex-col overflow-hidden group relative">
      
      {/* Fullscreen Button */}
      <button 
        onClick={toggleFullScreen}
        className="absolute top-6 left-6 z-50 bg-white/5 hover:bg-white/20 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
        title="وضع ملء الشاشة"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>

      {/* Top Header Bar */}
      <div className="flex justify-between items-center px-12 py-6 bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-2xl z-10">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
          <h2 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-teal-300">
            وكالة تسهيلات
          </h2>
        </div>
        <div className="text-left">
          <div className="text-4xl font-black text-white">{timeString}</div>
          <div className="text-xl text-blue-200 mt-1 font-semibold">{dateString}</div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-8 gap-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black relative">
        
        {/* Right Side: Main Queue Display */}
        <div className="w-3/5 flex flex-col justify-center items-center bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="bg-blue-900/40 text-blue-200 px-10 py-4 rounded-full text-4xl font-bold tracking-widest mb-12 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] z-10">
            رقم الدور
          </div>
          
          <div className={`text-[18rem] z-10 leading-none font-black tabular-nums transition-all ${flash ? 'animate-flash' : 'text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]'}`}>
            {ticket === 0 ? "—" : ticket}
          </div>

          {prevNumbers.length > 0 && (
            <div className="mt-20 flex flex-col items-center z-10">
              <p className="text-2xl text-slate-400 mb-6 font-bold tracking-wide">أرقام تم المناداة عليها مؤخراً</p>
              <div className="flex gap-6 justify-center">
                {prevNumbers.map(num => (
                  <div key={num} className="text-6xl font-black text-slate-400 bg-slate-950/50 px-8 py-4 rounded-3xl border border-white/5 shadow-inner">
                    {num}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Left Side: Advertisements & QR Code */}
        <div className="w-2/5 flex flex-col gap-6 relative">
          <div className="flex-1 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative">
            <AdCarousel />
          </div>
          
          {/* Static QR Code Banner */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 flex items-center justify-between border border-white/20 shadow-xl">
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-gray-200 mb-2">تواصل معنا عبر واتساب</p>
              <p className="text-4xl font-black text-green-400 tabular-nums tracking-widest font-mono" dir="ltr">+212 600-000000</p>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-lg shrink-0">
              <img src="/qr.png" alt="WhatsApp QR" className="w-24 h-24 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Moving News Ticker */}
      <div className="bg-red-700/90 backdrop-blur-md text-white text-5xl font-bold py-6 overflow-hidden border-t-4 border-red-500 shadow-[0_-10px_40px_rgba(220,38,38,0.3)] flex items-center">
        <div className="animate-marquee whitespace-nowrap px-[100vw]">
          {marqueeText}
          <span className="mx-16">✨</span>
          {marqueeText}
        </div>
      </div>
    </div>
  )
}
