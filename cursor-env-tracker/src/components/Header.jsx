import React from 'react'
import logo from '../assets/circuitleaf.jpg'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="AI Footprint Logo" 
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl font-bold text-foreground">
            ai.footprint
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
