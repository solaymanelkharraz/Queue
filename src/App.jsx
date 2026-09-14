import { useState, useEffect } from 'react'
import WorkerScreen from './WorkerScreen'
import TvScreen from './TvScreen'

function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === '#/worker') {
    return <WorkerScreen />
  }

  if (route === '#/tv') {
    return <TvScreen />
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <h1 className="text-5xl font-bold text-gray-800 mb-12">نظام إدارة الطوابير</h1>
      <div className="flex gap-6">
        <a 
          href="#/worker"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:scale-105 text-2xl"
        >
          شاشة الموظف
        </a>
        <a 
          href="#/tv"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:scale-105 text-2xl"
        >
          شاشة التلفاز (علامة تبويب جديدة)
        </a>
      </div>
      <p className="mt-12 text-gray-600 max-w-lg text-center text-xl leading-relaxed">
        ملاحظة: ستفتح شاشة التلفاز في علامة تبويب جديدة. يمكنك سحبها إلى شاشتك الثانية وجعلها في وضع ملء الشاشة.
      </p>
    </div>
  )
}

export default App
