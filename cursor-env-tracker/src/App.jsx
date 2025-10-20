import React, { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Calculator from './components/Calculator'
import Forest3D from './components/Forest3D'
import ForestFallback from './components/ForestFallback'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

const App = () => {
  const [view, setView] = useState('calculator') // 'calculator', 'forest', 'cta'
  const [calculatedTokens, setCalculatedTokens] = useState(null)
  const [useFallback, setUseFallback] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [minTimerElapsed, setMinTimerElapsed] = useState(false)
  const videoRef = useRef(null)

  // Detect dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }

    // Check initial state
    checkDarkMode()

    // Listen for dark mode changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  // Minimum loading timer (800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimerElapsed(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Video loading detection
  const handleVideoLoaded = () => {
    console.log('Video loaded')
    setVideoLoaded(true)
  }

  // Hide loading screen when conditions are met
  useEffect(() => {
    console.log('Loading conditions:', { videoLoaded, minTimerElapsed })
    if (videoLoaded && minTimerElapsed) {
      // Add a small delay to ensure video is actually playing smoothly
      const timer = setTimeout(() => {
        console.log('Hiding loading screen')
        setIsLoading(false)
      }, 100) // Increased to 100ms for more reliable video start
      
      return () => clearTimeout(timer)
    }
  }, [videoLoaded, minTimerElapsed])

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
      {/* Hidden video for loading detection */}
      {view === 'calculator' && isLoading && (
        <video
          ref={videoRef}
          key={`loading-video-${isDarkMode ? 'dark' : 'light'}`}
          autoPlay
          loop
          muted
          playsInline
          className="hidden"
          onLoadedData={handleVideoLoaded}
          onCanPlayThrough={handleVideoLoaded}
        >
          <source 
            src={isDarkMode ? "https://videos.pexels.com/video-files/25649447/11903096_2560_1440_30fps.mp4" : "https://videos.pexels.com/video-files/1448735/1448735-uhd_2732_1440_24fps.mp4"} 
            type="video/mp4" 
          />
        </video>
      )}

      {/* Video Background for Calculator View - shown after loading */}
      {view === 'calculator' && !isLoading && (
        <video
          key={isDarkMode ? 'video-dark' : 'video-light'}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0"
          style={{ minHeight: '100vh', minWidth: '100vw' }}
        >
          <source 
            src={isDarkMode ? "https://videos.pexels.com/video-files/25649447/11903096_2560_1440_30fps.mp4" : "https://videos.pexels.com/video-files/1448735/1448735-uhd_2732_1440_24fps.mp4"} 
            type="video/mp4" 
          />
        </video>
      )}
      
      {/* Loading Screen - only show on calculator page */}
      {view === 'calculator' && isLoading && (
        <LoadingScreen isDarkMode={isDarkMode} />
      )}
      
      {/* Overlay for better text readability on calculator view */}
      {view === 'calculator' && !isLoading && (
        <div className="fixed inset-0 bg-black/20 z-10"></div>
      )}
      
      <Header currentView={view} />
      <main className={`flex-1 ${view === 'forest' ? '' : 'pb-20'} relative z-20 flex flex-col`}>
        {/* Only show calculator content when not loading */}
        {view === 'calculator' ? (
          !isLoading && (
            <div 
              className="animate-in fade-in duration-300"
              style={{ 
                animation: 'fadeIn 300ms ease-in-out'
              }}
            >
              <Calculator onCalculate={handleCalculate} />
            </div>
          )
        ) : renderView()}
      </main>
      <Footer currentView={view} />
    </div>
  )
}

export default App