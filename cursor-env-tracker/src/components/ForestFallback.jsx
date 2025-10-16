import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { ArrowRight, TreePine } from 'lucide-react'

const ForestFallback = ({ tokens, onComplete }) => {
  const [showStats, setShowStats] = useState(false)

  // Calculate number of trees needed based on tokens
  const co2Grams = tokens * 0.09
  const co2Kg = co2Grams / 1000
  const treesNeeded = Math.max(1, Math.ceil(co2Kg / 21.77))
  const flowersNeeded = Math.floor(treesNeeded / 3)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStats(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 relative overflow-hidden">
      {/* Simple 2D forest representation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌳</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Forest</h2>
          <p className="text-gray-600 mb-8">
            {treesNeeded} oak trees and {flowersNeeded} flowers to offset your impact
          </p>
          
          {/* Simple tree representation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Array.from({ length: Math.min(treesNeeded, 20) }).map((_, i) => (
              <div key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                🌳
              </div>
            ))}
          </div>
          
          {treesNeeded > 20 && (
            <p className="text-sm text-gray-500 mb-4">
              ... and {treesNeeded - 20} more trees
            </p>
          )}
        </div>
      </div>

      {/* Stats overlay */}
      {showStats && (
        <div className="absolute top-8 left-8 right-8 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <TreePine className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Your Forest Impact</h2>
                <p className="text-sm text-gray-600">Simple view of your environmental impact</p>
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
                <span className="text-gray-600">Oak trees needed:</span>
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
  )
}

export default ForestFallback
