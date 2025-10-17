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
    <div className="h-screen bg-background overflow-hidden">
      <Header />
      <main className={view === 'forest' ? '' : 'pb-20'}>
        {renderView()}
      </main>
      <Footer currentView={view} />
    </div>
  )
}

export default App