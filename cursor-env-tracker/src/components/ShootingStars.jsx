import { useEffect, useRef, useState } from 'react';

const ShootingStars = () => {
  const containerRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isDarkMode) return;

    // Generate random stars for the upper 1/3 of the screen
    const generateStars = () => {
      const starCount = 200; // More stars for better coverage
      const containerHeight = window.innerHeight;
      const starAreaHeight = containerHeight * 0.33; // Upper 1/3
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position in upper 1/3
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * starAreaHeight;
        
        // Random size (0.5px to 2px)
        const size = Math.random() * 1.5 + 0.5;
        
        // Base opacity (0.3 to 1)
        let baseOpacity = Math.random() * 0.7 + 0.3;
        
        // Fade out bottom 20% of stars
        const fadeStartY = starAreaHeight * 0.8; // Start fading at 80% of star area
        if (y > fadeStartY) {
          const fadeProgress = (y - fadeStartY) / (starAreaHeight - fadeStartY);
          baseOpacity *= (1 - fadeProgress); // Fade to 0
        }
        
        star.style.position = 'absolute';
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        star.style.opacity = baseOpacity;
        star.style.zIndex = '3';
        star.style.pointerEvents = 'none';
        
        // Add twinkling effect
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`;
        
        container.appendChild(star);
      }
    };

    // Create shooting star
    const createShootingStar = () => {
      // Random starting position in top 1/3 of container
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * (window.innerHeight * 0.33);
      
      // Random direction (diagonal)
      const angle = Math.random() * 60 + 15; // 15-75 degrees
      const distance = Math.random() * 300 + 200; // 200-500px
      
      const endX = startX + Math.cos(angle * Math.PI / 180) * distance;
      const endY = startY + Math.sin(angle * Math.PI / 180) * distance;

      // Create shooting star element
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;
      star.style.width = '2px';
      star.style.height = '2px';
      star.style.background = 'white';
      star.style.borderRadius = '50%';
      star.style.boxShadow = '0 0 6px white, 0 0 12px white';
      star.style.zIndex = '3';
      star.style.pointerEvents = 'none';
      
      // Create trail
      const trail = document.createElement('div');
      trail.style.position = 'absolute';
      trail.style.left = `${startX}px`;
      trail.style.top = `${startY}px`;
      trail.style.width = '100px';
      trail.style.height = '1px';
      trail.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)';
      trail.style.transformOrigin = 'left center';
      trail.style.transform = `rotate(${angle}deg)`;
      trail.style.zIndex = '3';
      trail.style.pointerEvents = 'none';

      container.appendChild(star);
      container.appendChild(trail);

      // Animate
      const duration = Math.random() * 1000 + 500; // 500-1500ms
      
      star.animate([
        { 
          transform: 'translate(0, 0) scale(1)',
          opacity: 0
        },
        { 
          transform: 'translate(0, 0) scale(1)',
          opacity: 1,
          offset: 0.1
        },
        { 
          transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`,
          opacity: 0,
          offset: 0.9
        },
        { 
          transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration,
        easing: 'linear'
      });

      trail.animate([
        { 
          transform: `rotate(${angle}deg) scaleX(0)`,
          opacity: 0
        },
        { 
          transform: `rotate(${angle}deg) scaleX(1)`,
          opacity: 1,
          offset: 0.1
        },
        { 
          transform: `rotate(${angle}deg) scaleX(0)`,
          opacity: 0,
          offset: 0.9
        }
      ], {
        duration,
        easing: 'linear'
      });

      // Clean up
      setTimeout(() => {
        if (star.parentNode) star.parentNode.removeChild(star);
        if (trail.parentNode) trail.parentNode.removeChild(trail);
      }, duration);
    };

    // Generate initial stars
    generateStars();

    // Create shooting stars every 4-5 seconds
    const interval = setInterval(() => {
      createShootingStar();
    }, Math.random() * 1000 + 4000); // 4-5 seconds

    // Handle window resize
    const handleResize = () => {
      // Clear existing stars
      const existingStars = container.querySelectorAll('.star');
      existingStars.forEach(star => star.remove());
      
      // Regenerate stars
      generateStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDarkMode]);

  if (!isDarkMode) return null;
  
  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} />;
};

export default ShootingStars;
