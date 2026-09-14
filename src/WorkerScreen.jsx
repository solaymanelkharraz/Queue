import { useState, useEffect } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { db } from './firebase'

export default function WorkerScreen() {
  const [ticket, setTicket] = useState(0)
  const [stats, setStats] = useState([])
  const [customMsg, setCustomMsg] = useState("")

  // Load data from Firebase
  useEffect(() => {
    const queueRef = ref(db, 'queueData')
    const unsubscribe = onValue(queueRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setTicket(data.currentTicket || 0)
        setCustomMsg(data.customMessage || "")

        const today = new Date().toLocaleDateString()
        if (data.stats && data.stats.date === today) {
          setStats(data.stats.times || [])
        } else {
          setStats([])
        }
      }
    })
    
    return () => unsubscribe()
  }, [])

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in the custom message box
      if (e.target.tagName === 'INPUT') return;
      
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [ticket, stats, customMsg])

  const handleNext = () => {
    const nextTicket = ticket + 1
    const newStats = [...stats, Date.now()]
    
    // Update Firebase directly
    set(ref(db, 'queueData'), {
      currentTicket: nextTicket,
      customMessage: customMsg,
      stats: {
        date: new Date().toLocaleDateString(),
        times: newStats
      }
    })
  }

  const handleUndo = () => {
    if (ticket > 0) {
      set(ref(db, 'queueData/currentTicket'), ticket - 1)
    }
  }

  const handleReset = () => {
    if (window.confirm("هل أنت متأكد أنك تريد تصفير العداد؟")) {
      set(ref(db, 'queueData/currentTicket'), 0)
    }
  }

  const handleMsgChange = (e) => {
    const newMsg = e.target.value
    setCustomMsg(newMsg)
    set(ref(db, 'queueData/customMessage'), newMsg)
  }

  // Calculate average time
  let averageTime = "—"
  if (stats.length > 1) {
    const totalDiffMs = stats[stats.length - 1] - stats[0]
    const avgMs = totalDiffMs / (stats.length - 1)
    const avgMins = Math.round(avgMs / 60000)
    averageTime = avgMins > 0 ? `${avgMins} دقيقة` : "أقل من دقيقة"
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center border-t-8 border-blue-600 mb-8">
        <h2 className="text-3xl font-bold text-gray-700 mb-2">لوحة تحكم الموظف</h2>
        
        <div className="my-10">
          <p className="text-gray-500 text-2xl font-semibold">الرقم الحالي</p>
          <div className="text-8xl font-black text-blue-600 mt-2 tabular-nums">
            {ticket === 0 ? "—" : ticket}
          </div>
        </div>

        <button 
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded-2xl shadow-lg text-4xl transition active:scale-95 mb-4"
        >
          الزبون التالي
        </button>
        <p className="text-sm text-gray-400 mb-6 font-semibold">💡 اختصار: يمكنك ضغط المسطرة (Space) أو Enter</p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={handleUndo}
            disabled={ticket === 0}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-bold py-4 px-4 rounded-xl text-xl transition active:scale-95"
          >
            تراجع (الرقم السابق)
          </button>
        </div>

        <div className="pt-6 border-t border-gray-100 mb-6">
          <button 
            onClick={handleReset}
            className="text-red-500 hover:text-red-700 font-bold py-2 px-4 rounded text-xl"
          >
            تصفير العداد
          </button>
        </div>
      </div>

      {/* Control Panel for Extras */}
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg w-full">
        
        {/* Custom Message */}
        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-3 text-lg">رسالة الشريط الإخباري للشاشة:</label>
          <input 
            type="text" 
            value={customMsg}
            onChange={handleMsgChange}
            placeholder="اكتب هنا لتغيير النص المتحرك على الشاشة..."
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-semibold"
          />
        </div>

        {/* Daily Stats */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-4">إحصائيات اليوم</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 font-semibold">عدد الزبائن:</span>
            <span className="text-2xl font-black text-blue-600">{stats.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">متوسط وقت الانتظار:</span>
            <span className="text-xl font-bold text-gray-700">{averageTime}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
