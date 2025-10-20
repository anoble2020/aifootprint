import React, { useState, useEffect } from 'react'
import { Leaf, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'

const Footer = ({ currentView = 'calculator' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

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

  // Show footer on all pages, but start collapsed on forest/cta
  useEffect(() => {
    if (currentView === 'cta' || currentView === 'forest') {
      setIsExpanded(false)
    } else {
      setIsExpanded(true)
    }
  }, [currentView])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Calculator page - always show footer, no toggle button
  if (currentView === 'calculator') {
    return (
      <footer className="border-t bg-white/10 backdrop-blur-md px-6 py-4 border-white/20 fixed bottom-0 left-0 right-0 z-50">
        <div className="w-full px-6">
          <div className="flex flex-col items-start gap-2 text-center">
            
            <p className="text-xs text-white/90 drop-shadow-sm max-w-4xl">
              Calculations based on research from{" "}
              <a 
                href="https://anuragsridharan.substack.com/p/we-can-use-tokens-to-track-ais-carbon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:underline inline-flex items-center"
              >
                Anurag Sridharan's analysis 
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              {" "}of AI carbon emissions (~0.09g CO₂ per token).
            </p>
            
            <div className="flex justify-between items-center w-full">
              <p className="text-xs text-white/90 italic inline-flex drop-shadow-sm">
              <Leaf className="h-3 w-3 text-white/90 mr-1" />
                Built with awareness for a sustainable future
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href={isDarkMode ? "https://www.pexels.com/video/the-night-sky-with-stars-and-trees-in-the-distance-25649447/" : "https://www.pexels.com/video/video-of-forest-1448735/"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-white/90 hover:text-white hover:underline inline-flex items-center drop-shadow-sm"
                >
                  Video by {isDarkMode ? "Alexey Chudin" : "Ruvim Miksanskiy"}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <a 
                  href="https://kenney.nl/assets/nature-kit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-white/90 hover:text-white hover:underline inline-flex items-center drop-shadow-sm"
                >
                  3D Assets created by Kenney
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Other pages - collapsible footer
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${isExpanded ? 'backdrop-blur-sm' : ''}`}>
      {/* Footer content - animated */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <footer className="border-t bg-card/90 px-6 py-4 border-border">
          <div className="w-full px-6">
            <div className="flex flex-col items-start gap-2 text-center">
              
              <p className="text-xs text-muted-foreground max-w-4xl">
                Calculations based on research from{" "}
                <a 
                  href="https://anuragsridharan.substack.com/p/we-can-use-tokens-to-track-ais-carbon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Anurag Sridharan's analysis 
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                {" "}of AI carbon emissions (~0.09g CO₂ per token).
              </p>
              
              <div className="flex justify-between items-center w-full">
                <p className="text-xs text-muted-foreground italic inline-flex">
                <Leaf className="h-3 w-3 text-muted-foreground mr-1" />
                  Built with awareness for a sustainable future
                </p>
                <div className="flex items-center gap-4">
                  <a 
                    href={isDarkMode ? "https://www.pexels.com/video/the-night-sky-with-stars-and-trees-in-the-distance-25649447/" : "https://www.pexels.com/video/video-of-forest-1448735/"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary hover:underline inline-flex items-center"
                  >
                    Video by {isDarkMode ? "Alexey Chudin" : "Ruvim Miksanskiy"}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                  <a 
                    href="https://kenney.nl/assets/nature-kit" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary hover:underline inline-flex items-center"
                  >
                    3D Assets created by Kenney
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Toggle button - always visible */}
      <div className="flex justify-center">
        <button
          onClick={toggleExpanded}
          className="border-t border-l border-r border-border rounded-t-lg px-4 py-1 transition-colors hover:bg-accent/10 bg-card/90"
        >
          <ChevronUp className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  )

}

export default Footer
