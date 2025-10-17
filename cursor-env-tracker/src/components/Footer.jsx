import React, { useState, useEffect } from 'react'
import { Leaf, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'

const Footer = ({ currentView }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // Show/hide footer based on current view
  useEffect(() => {
    if (currentView === 'cta' || currentView === 'forest') {
      setIsVisible(false)
      setIsExpanded(false)
    } else {
      setIsVisible(true)
      setIsExpanded(true)
    }
  }, [currentView])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className={`transition-all duration-500 ease-in-out transform ${
          isExpanded ? 'translate-y-0 bg-card/80 backdrop-blur-sm' : 'translate-y-0'
        }`}>
          {/* Footer content - animated */}
          <div className={`transition-all duration-500 ease-in-out transform ${
            isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <footer className="border-t bg-accent/5 px-6 bg-card/80 backdrop-blur-sm py-4">
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
                    <Leaf className="h-3 w-3 text-muted-foreground mr-1" />
                    <p className="text-xs text-muted-foreground italic">
                      Built with awareness for a sustainable future
                    </p>
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
            </footer>
          </div>
          
          {/* Toggle button - moves with animation but always visible */}
          <div className="flex justify-center">
            <button
              onClick={toggleExpanded}
              className="border-t border-l border-r border-border rounded-t-lg px-4 py-1 hover:bg-card/100 transition-colors opacity-80"
            >
              <ChevronUp className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <footer className={`border-t bg-accent/5 px-6 mt-auto fixed bottom-0 left-0 right-0 z-10 bg-card/80 backdrop-blur-sm transition-all duration-500 ease-in-out ${
      isExpanded ? 'py-4 opacity-100' : 'py-0 opacity-0 h-0 overflow-hidden'
    }`}>
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
            <p className="text-xs text-muted-foreground">
              Built with awareness for a sustainable future
            </p>
            
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
    </footer>
  )
}

export default Footer
