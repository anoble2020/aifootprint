import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Github, Sun, Moon } from 'lucide-react'
import logo from '../assets/circuitleaf.jpg'
import FAQModal from './FAQModal'
import SharePopover from './SharePopover'

const Header = ({ currentView = 'calculator' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <a href="/">
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="AI Footprint Logo" 
                className="h-10 w-10 object-contain"
              />
              <h1 className={`text-xl font-bold ${
                currentView === 'calculator' 
                  ? 'text-white dark:text-white' 
                  : 'text-foreground'
              }`}>
                ai.footprint
              </h1>
            </div>
          </a>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${
                currentView === 'calculator' 
                  ? 'text-white hover:text-white dark:text-white dark:hover:text-white' 
                  : 'text-foreground hover:text-foreground'
              }`}
              onClick={() => window.open('https://github.com/anoble2020/aifootprint', '_blank')}
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub Repository</span>
            </Button>
            
            <FAQModal currentView={currentView} />
            
            <SharePopover currentView={currentView} />
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${
                currentView === 'calculator' 
                  ? 'text-white hover:text-white dark:text-white dark:hover:text-white' 
                  : 'text-foreground hover:text-foreground'
              }`}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle dark mode</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
