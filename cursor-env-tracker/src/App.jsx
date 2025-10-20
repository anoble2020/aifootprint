import React, { useState } from 'react'
import Header from './components/Header'
import Calculator from './components/Calculator'
import Forest3D from './components/Forest3D'
import ForestFallback from './components/ForestFallback'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'

const App = () => {
  const [view, setView] = useState('calculator') // 'calculator', 'forest', 'cta'
  const [calculatedTokens, setCalculatedTokens] = useState(null)
  const [useFallback, setUseFallback] = useState(false)

  const handleCalculate = (tokens) => {
    setCalculatedTokens(tokens)
    setView('forest')
  }

  const handleForestComplete = () => {
    setView('cta')
  }

  const handleForestError = () => {
    setUseFallback(true)
  }

  const renderView = () => {
    switch (view) {
      case 'calculator':
        return <Calculator onCalculate={handleCalculate} />
      case 'forest':
        return useFallback ? 
          <ForestFallback tokens={calculatedTokens} onComplete={handleForestComplete} /> :
          <Forest3D tokens={calculatedTokens} onComplete={handleForestComplete} onError={handleForestError} />
      case 'cta':
        return <CallToAction />
      default:
        return <Calculator onCalculate={handleCalculate} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Video Background for Calculator View */}
      {view === 'calculator' && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0"
          style={{ minHeight: '100vh', minWidth: '100vw' }}
        >
          <source src="https://videos.pexels.com/video-files/1448735/1448735-uhd_2732_1440_24fps.mp4" type="video/mp4" />
        </video>
      )}
      
      {/* Overlay for better text readability on calculator view */}
      {view === 'calculator' && (
        <div className="fixed inset-0 bg-black/20 z-10"></div>
      )}
      
      <Header currentView={view} />
      <main className={`flex-1 ${view === 'forest' ? '' : 'pb-20'} relative z-20 flex flex-col`}>
        {renderView()}
      </main>
      <Footer currentView={view} />
    </div>
  )
}

export default App