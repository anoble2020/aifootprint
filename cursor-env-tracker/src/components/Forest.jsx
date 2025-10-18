import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { ArrowRight, TreePine } from 'lucide-react'

const Forest = ({ tokens, onComplete }) => {
  const [trees, setTrees] = useState([])
  const [flowers, setFlowers] = useState([])
  const [groundTiles, setGroundTiles] = useState([])
  const [showStats, setShowStats] = useState(false)

  // Calculate number of trees needed based on tokens
  const co2Grams = tokens * 0.09
  const co2Kg = co2Grams / 1000
  const treesNeeded = Math.max(1, Math.ceil(co2Kg / 21.77))
  const flowersNeeded = Math.floor(treesNeeded / 3) // 1 flower per 3 trees

  // Only use oak trees
  const treeType = 'tree_oak'
  const treeVariants = ['', '_dark', '_fall']

  // Flower types
  const flowerTypes = ['flower_purpleA', 'flower_purpleB', 'flower_purpleC', 'flower_redA', 'flower_redB', 'flower_redC', 'flower_yellowA', 'flower_yellowB', 'flower_yellowC']

  // Generate forest elements
  useEffect(() => {
    const generateForest = () => {
      const newTrees = []
      const newFlowers = []
      const newGroundTiles = []
      
      // Create a larger area for more natural distribution
      const forestWidth = 800
      const forestHeight = 600
      const tileSize = 32
      
      // Generate ground tiles to cover the entire forest area
      for (let x = 0; x < forestWidth; x += tileSize) {
        for (let y = 0; y < forestHeight; y += tileSize) {
          const direction = ['NE', 'NW', 'SE', 'SW'][Math.floor(Math.random() * 4)]
          newGroundTiles.push({
            id: `ground-${x}-${y}`,
            x: x,
            y: y,
            direction,
            opacity: 0.7 + Math.random() * 0.3 // Vary opacity for natural look
          })
        }
      }
      
      // Generate trees with natural, randomized positioning
      for (let i = 0; i < treesNeeded; i++) {
        const variant = treeVariants[Math.floor(Math.random() * treeVariants.length)]
        const direction = ['NE', 'NW', 'SE', 'SW'][Math.floor(Math.random() * 4)]
        
        // Create natural clustering and randomization
        let attempts = 0
        let x, y
        do {
          // Use Poisson disk sampling for more natural distribution
          const baseX = forestWidth * 0.1 + Math.random() * forestWidth * 0.8
          const baseY = forestHeight * 0.1 + Math.random() * forestHeight * 0.8
          
          // Add some clustering - trees tend to grow near other trees
          const clusterRadius = 60
          const clusterX = baseX + (Math.random() - 0.5) * clusterRadius
          const clusterY = baseY + (Math.random() - 0.5) * clusterRadius
          
          x = Math.max(20, Math.min(forestWidth - 20, clusterX))
          y = Math.max(20, Math.min(forestHeight - 20, clusterY))
          
          attempts++
        } while (attempts < 10) // Prevent infinite loops
        
        newTrees.push({
          id: i,
          type: treeType,
          variant,
          direction,
          x: x,
          y: y,
          scale: 0.8 + Math.random() * 0.4, // More size variation
          rotation: Math.random() * 360, // Random rotation for natural look
          zIndex: Math.floor(Math.random() * 10) // Random z-index for overlapping
        })
      }
      
      // Generate flowers with natural positioning
      for (let i = 0; i < flowersNeeded; i++) {
        const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)]
        const direction = ['NE', 'NW', 'SE', 'SW'][Math.floor(Math.random() * 4)]
        
        // Position flowers more randomly, not necessarily between trees
        const x = Math.random() * forestWidth
        const y = Math.random() * forestHeight
        
        newFlowers.push({
          id: i,
          type: flowerType,
          direction,
          x: x,
          y: y,
          scale: 0.6 + Math.random() * 0.4,
          zIndex: Math.floor(Math.random() * 5) // Lower z-index than trees
        })
      }
      
      setGroundTiles(newGroundTiles)
      setTrees(newTrees)
      setFlowers(newFlowers)
    }

    generateForest()
  }, [treesNeeded, flowersNeeded])

  // Show stats after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStats(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const getTreeImage = (tree) => {
    const imageName = `${tree.type}${tree.variant}_${tree.direction}.png`
    return new URL(`../assets/Isometric/${imageName}`, import.meta.url).href
  }

  const getFlowerImage = (flower) => {
    const imageName = `${flower.type}_${flower.direction}.png`
    return new URL(`../assets/Isometric/${imageName}`, import.meta.url).href
  }

  const getGroundImage = (tile) => {
    const imageName = `ground_grass_${tile.direction}.png`
    return new URL(`../assets/Isometric/${imageName}`, import.meta.url).href
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 relative overflow-hidden">
      {/* Forest Container with Isometric Perspective */}
      <div 
        className="relative w-full h-screen flex items-center justify-center"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 40%'
        }}
      >
        {/* Main Forest Scene */}
        <div 
          className="relative"
          style={{
            transform: 'rotateX(60deg) rotateY(-10deg)',
            transformOrigin: 'center center',
            width: '900px',
            height: '700px'
          }}
        >
          {/* Ground Tiles Layer - Fixed at base level */}
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            {groundTiles.map((tile) => (
              <div
                key={tile.id}
                className="absolute"
                style={{
                  left: `${tile.x}px`,
                  top: `${tile.y}px`,
                  transform: 'translateZ(0px)'
                }}
              >
                <img
                  src={getGroundImage(tile)}
                  alt="Ground"
                  className="w-8 h-8 object-contain"
                  style={{
                    imageRendering: 'pixelated',
                    opacity: tile.opacity // Use varied opacity for natural look
                  }}
                />
              </div>
            ))}
          </div>

          {/* All Forest Elements - Mixed layer with z-index sorting */}
          <div className="absolute inset-0" style={{ zIndex: 3 }}>
            {/* Combine trees and flowers, then sort by z-index for proper layering */}
            {[...trees, ...flowers]
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((element) => {
                const isTree = 'type' in element && element.type === treeType
                const isFlower = 'type' in element && flowerTypes.includes(element.type)
                
                if (isTree) {
                  return (
                    <div
                      key={`tree-${element.id}`}
                      className="absolute transition-all duration-1000 ease-out"
                      style={{
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        transform: `scale(${element.scale}) translateZ(${element.zIndex + 10}px)`,
                        animationDelay: `${element.id * 30}ms`,
                        animation: 'treeGrow 1.2s ease-out forwards'
                      }}
                    >
                      <img
                        src={getTreeImage(element)}
                        alt={`Oak Tree ${element.id + 1}`}
                        className="w-16 h-16 object-contain"
                        style={{
                          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                          imageRendering: 'pixelated'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'block'
                        }}
                      />
                      {/* Fallback tree icon */}
                      <div 
                        className="w-16 h-16 items-center justify-center text-green-600 text-2xl"
                        style={{ display: 'none' }}
                      >
                        🌳
                      </div>
                    </div>
                  )
                } else if (isFlower) {
                  return (
                    <div
                      key={`flower-${element.id}`}
                      className="absolute transition-all duration-800 ease-out"
                      style={{
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        transform: `scale(${element.scale}) translateZ(${element.zIndex + 5}px)`,
                        animationDelay: `${(element.id + trees.length) * 20}ms`,
                        animation: 'flowerGrow 1s ease-out forwards'
                      }}
                    >
                      <img
                        src={getFlowerImage(element)}
                        alt={`Flower ${element.id + 1}`}
                        className="w-8 h-8 object-contain"
                        style={{
                          filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
                          imageRendering: 'pixelated'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'block'
                        }}
                      />
                      {/* Fallback flower icon */}
                      <div 
                        className="w-8 h-8 items-center justify-center text-pink-500 text-lg"
                        style={{ display: 'none' }}
                      >
                        🌸
                      </div>
                    </div>
                  )
                }
                return null
              })}
          </div>
        </div>

        {/* Stats Overlay */}
        {showStats && (
          <div className="absolute top-8 left-8 right-8 z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <TreePine className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Your Oak Forest</h2>
                  <p className="text-sm text-gray-600">Trees and flowers to offset your impact</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tokens consumed:</span>
                  <span className="font-semibold">{tokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CO₂ emissions:</span>
                  <span className="font-semibold">{co2Kg.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Oak trees planted:</span>
                  <span className="font-semibold text-green-600">{treesNeeded}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Flowers added:</span>
                  <span className="font-semibold text-pink-600">{flowersNeeded}</span>
                </div>
              </div>
              
              <Button 
                onClick={onComplete}
                className="w-full mt-6 bg-green-600 hover:bg-green-700"
              >
                Continue to Action
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes treeGrow {
          0% {
            opacity: 0;
            transform: scale(0) translateY(20px) translateZ(10px);
          }
          50% {
            opacity: 0.7;
            transform: scale(0.5) translateY(5px) translateZ(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0px) translateZ(10px);
          }
        }
        
        @keyframes flowerGrow {
          0% {
            opacity: 0;
            transform: scale(0) translateY(10px) translateZ(5px);
          }
          60% {
            opacity: 0.8;
            transform: scale(0.6) translateY(2px) translateZ(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0px) translateZ(5px);
          }
        }
      `}</style>
    </div>
  )
}

export default Forest
