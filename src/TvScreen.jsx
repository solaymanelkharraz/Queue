import { useState, useEffect, useRef } from 'react'
import { announceNumber, playReminder } from './audio'
import AdCarousel from './AdCarousel'
import { ref, onValue } from 'firebase/database'
import { db } from './firebase'

export default function TvScreen() {
  const [ticket, setTicket] = useState(0)
  const [time, setTime] = useState(new Date())
  const [flash, setFlash] = useState(false)
  const [customMsg, setCustomMsg] = useState("")

  const prevTicketRef = useRef(0)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    const clockTimer = setInterval(() => setTime(new Date()), 1000)

    // Listen to Firebase Realtime Database
    const queueRef = ref(db, 'queueData')
    const unsubscribe = onValue(queueRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const newTicket = data.currentTicket || 0
        
        // Trigger animations and audio if number increased (not on initial load)
        if (!isInitialLoad.current) {
          if (newTicket > prevTicketRef.current) {
             announceNumber()
             setFlash(true)
             setTimeout(() => setFlash(false), 1200)
          }
        } else {
          isInitialLoad.current = false
        }
        
        setTicket(newTicket)
        prevTicketRef.current = newTicket
        
        if (data.customMessage !== undefined) {
          setCustomMsg(data.customMessage)
        }
      }
    })
    
    const reminderTimer = setInterval(() => {
      playReminder()
    }, 5 * 60 * 1000)

    return () => {
      clearInterval(clockTimer)
      clearInterval(reminderTimer)
      unsubscribe()
    }
  }, [])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err))
    } else {
      document.exitFullscreen().catch(err => console.error(err))
    }
  }

  const timeString = time.toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit', hour12: true })
  const dateString = time.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  // Combine custom message with the default phrases and the WhatsApp number
  const basePhrases = "إذا لم يكن لديك رقم، يرجى أخذ تذكرة الانتظار للتمتع بخدماتنا ✨ يرجى تحضير أوراقك الثبوتية قبل الوصول إلى الصندوق لتسريع العملية ✨ أهلاً وسهلاً بكم في وكالة تسهيلات ✨ للتواصل معنا عبر واتساب: 0600-000000"
  
  const marqueeText = customMsg 
    ? `${customMsg} ✨ ${basePhrases}`
    : basePhrases

  return (
    <div dir="rtl" className="h-screen w-screen bg-slate-900 text-white flex flex-col overflow-hidden group relative">
      
      {/* Fullscreen Button */}
      <button 
        onClick={toggleFullScreen}
        className="absolute top-4 left-4 z-50 bg-white/5 hover:bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
        title="وضع ملء الشاشة"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>

      {/* Smaller Top Header Bar */}
      <div className="flex justify-between items-center px-8 py-3 bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
          <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-teal-300">
            وكالة تسهيلات
          </h2>
        </div>
        <div className="text-left flex items-center gap-4">
          <div className="text-sm text-blue-200 font-semibold">{dateString}</div>
          <div className="text-2xl font-black text-white">{timeString}</div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-8 gap-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black relative">
        
        {/* Right Side: Main Queue Display */}
        <div className="w-3/5 flex flex-col justify-center items-center bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="bg-blue-900/40 text-blue-200 px-10 py-3 rounded-full text-3xl font-bold tracking-widest mb-10 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] z-10">
            رقم الدور
          </div>
          
          <div className={`text-[12rem] z-10 leading-none font-black tabular-nums transition-all ${flash ? 'animate-flash' : 'text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]'}`}>
            {ticket === 0 ? "—" : ticket}
          </div>
        </div>

        {/* Left Side: Advertisements */}
        <div className="w-2/5 flex flex-col gap-6 relative">
          <div className="flex-1 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative">
            <AdCarousel />
          </div>
        </div>
      </div>
      
      {/* Footer Moving News Ticker (Seamless Infinite Loop) */}
      <div className="bg-red-700/90 backdrop-blur-md text-white text-4xl font-bold py-5 overflow-hidden border-t-4 border-red-500 shadow-[0_-10px_40px_rgba(220,38,38,0.3)] flex items-center">
        <div className="animate-marquee whitespace-nowrap flex">
          <div className="flex items-center px-8 whitespace-nowrap">
            {marqueeText} <span className="mx-16">✨</span>
          </div>
          <div className="flex items-center px-8 whitespace-nowrap">
            {marqueeText} <span className="mx-16">✨</span>
          </div>
        </div>
      </div>
    </div>
  )
}
