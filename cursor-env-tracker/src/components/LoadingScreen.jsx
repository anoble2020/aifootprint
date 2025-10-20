import React from 'react'

const LoadingScreen = ({ isDarkMode }) => {

  return (
    <div className="fixed inset-0 z-30">
      {/* Blurred background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${isDarkMode ? '/dark_frame1.png' : '/light_frame1.png'})`,
          filter: 'blur(4px)',
          transform: 'scale(1.05)' // Slight scale to prevent blur edge artifacts
        }}
      />
      
      {/* Color overlay for modal effect */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: isDarkMode ? 'rgba(48, 48, 48, 0.4)' : 'rgba(255, 255, 255, 0.4)'
        }}
      />
      
      {/* Centered loader GIF */}
      <div className="relative flex items-center justify-center h-full">
        <img
          src="/loader_nobg.gif"
          alt="Loading..."
          className="max-w-24 max-h-24 object-contain"
          
          style={{ 
            width: '6rem', 
            height: '6rem',
            imageRendering: 'auto'
          }}
        />
      </div>
    </div>
  )
}

export default LoadingScreen
