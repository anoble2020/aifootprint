import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows, Preload } from '@react-three/drei'
import { Button } from './ui/button'
import { ArrowRight, TreePine } from 'lucide-react'
import * as THREE from 'three'

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Forest3D Error:', error, errorInfo)
    if (this.props.onError) {
      this.props.onError()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-green-200">
          <div className="text-center p-8 bg-white/90 rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Forest Loading Error</h2>
            <p className="text-gray-600 mb-4">
              There was an issue loading the 3D forest. This might be due to WebGL not being supported on your device.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700"
            >
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Preload GLTF models for better performance
function ModelPreloader() {
  const treeVariants = ['', '_dark', '_fall']
  const flowerTypes = ['flower_purpleA', 'flower_purpleB', 'flower_purpleC', 'flower_redA', 'flower_redB', 'flower_redC', 'flower_yellowA', 'flower_yellowB', 'flower_yellowC']
  
  // Preload tree models
  treeVariants.forEach(variant => {
    useGLTF.preload(`/src/assets/kenney_nature-kit/Models/GLTF format/tree_oak${variant}.glb`)
  })
  
  // Preload flower models
  flowerTypes.forEach(type => {
    useGLTF.preload(`/src/assets/kenney_nature-kit/Models/GLTF format/${type}.glb`)
  })
  
  // Ground is now a simple plane geometry, no need to preload
  
  return null
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-200 to-green-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your forest...</p>
      </div>
    </div>
  )
}

// Tree component that loads and renders a GLTF model
function Tree({ position, scale, variant, rotation }) {
  try {
    const { scene } = useGLTF(`/src/assets/kenney_nature-kit/Models/GLTF format/tree_oak${variant}.glb`)
    const meshRef = useRef()
    
    // Clone the scene to avoid sharing geometry between instances
    const clonedScene = scene.clone()
    
    // Add some subtle animation
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = rotation + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      }
    })

    return (
      <primitive 
        ref={meshRef}
        object={clonedScene} 
        position={position} 
        scale={scale}
        castShadow
        receiveShadow
      />
    )
  } catch (error) {
    console.warn('Failed to load tree model:', error)
    // Fallback to a simple box geometry
    return (
      <mesh position={position} scale={scale} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshLambertMaterial color="green" />
      </mesh>
    )
  }
}

// Flower component
function Flower({ position, scale, type }) {
  try {
    const { scene } = useGLTF(`/src/assets/kenney_nature-kit/Models/GLTF format/${type}.glb`)
    const meshRef = useRef()
    
    const clonedScene = scene.clone()
    
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
      }
    })

    return (
      <primitive 
        ref={meshRef}
        object={clonedScene} 
        position={position} 
        scale={scale}
        castShadow
      />
    )
  } catch (error) {
    console.warn('Failed to load flower model:', error)
    // Fallback to a simple sphere geometry
    return (
      <mesh position={position} scale={scale} castShadow>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshLambertMaterial color="pink" />
      </mesh>
    )
  }
}

// Ground component
function Ground({ position, size, rotation }) {
  // Use a simple plane geometry for a clean ground surface
  // Rotate -90 degrees around X-axis to make it horizontal
  return (
    <mesh 
      position={position} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[size, size]} />
      <meshLambertMaterial 
        color="#D2B48C"
      />
    </mesh>
  )
}

// Forest scene component (3D only, no UI elements)
function ForestScene({ trees, flowers, groundTiles }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.2} />
      <hemisphereLight 
        skyColor="#87CEEB" 
        groundColor="#90EE90" 
        intensity={0.3} 
      />

      {/* Ground plane */}
      {groundTiles.map((tile, index) => (
        <Ground
          key={`ground-${index}`}
          position={[tile.x, 0, tile.y]}
          size={tile.size}
          rotation={[0, tile.rotation, 0]}
        />
      ))}

      {/* Trees */}
      {trees.map((tree, index) => (
        <Tree
          key={`tree-${index}`}
          position={[tree.x, 0, tree.y]}
          scale={[tree.scale, tree.scale, tree.scale]}
          variant={tree.variant}
          rotation={tree.rotation}
        />
      ))}

      {/* Flowers */}
      {flowers.map((flower, index) => (
        <Flower
          key={`flower-${index}`}
          position={[flower.x, 0, flower.y]}
          scale={[flower.scale, flower.scale, flower.scale]}
          type={flower.type}
        />
      ))}

      {/* Contact shadows for better ground contact */}
      <ContactShadows 
        position={[0, -0.1, 0]} 
        opacity={0.25} 
        scale={50} 
        blur={1.5} 
        far={0.8} 
      />
    </>
  )
}

// Main Forest3D component
const Forest3D = ({ tokens, onComplete, onError }) => {
  const [trees, setTrees] = useState([])
  const [flowers, setFlowers] = useState([])
  const [groundTiles, setGroundTiles] = useState([])
  const [showStats, setShowStats] = useState(false)

  // Calculate number of trees needed based on tokens
  const co2Grams = tokens * 0.09
  const co2Kg = co2Grams / 1000
  const treesNeeded = Math.max(1, Math.ceil(co2Kg / 21.77))
  const flowersNeeded = Math.floor(treesNeeded / 3)

  // Tree variants
  const treeVariants = ['', '_dark', '_fall']
  const flowerTypes = ['flower_purpleA', 'flower_purpleB', 'flower_purpleC', 'flower_redA', 'flower_redB', 'flower_redC', 'flower_yellowA', 'flower_yellowB', 'flower_yellowC']

  // Show stats after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStats(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Generate forest elements
  useEffect(() => {
    const generateForest = () => {
      const newTrees = []
      const newFlowers = []
      const newGroundTiles = []
      
      // Calculate dynamic ground size based on tree count
      // For 1 tree: small ground (4x4)
      // For many trees: larger ground but keep density high
      const baseSize = 4 // Minimum size for 1 tree
      const maxSize = 25 // Maximum size for many trees
      const groundSize = Math.min(baseSize + Math.sqrt(treesNeeded) * 2, maxSize)
      
      // Calculate forest area (smaller than ground for density)
      const forestArea = groundSize * 0.7 // Use 70% of ground area for trees
      
      // Generate a single ground plane with dynamic size
      newGroundTiles.push({
        x: 0,
        y: 0,
        size: groundSize,
        rotation: 0
      })
      
      // Generate trees with natural positioning within forest area
      for (let i = 0; i < treesNeeded; i++) {
        const variant = treeVariants[Math.floor(Math.random() * treeVariants.length)]
        
        // Position trees within the forest area
        const x = (Math.random() - 0.5) * forestArea
        const y = (Math.random() - 0.5) * forestArea
        
        newTrees.push({
          x: x,
          y: y,
          scale: 0.8 + Math.random() * 0.4,
          variant: variant,
          rotation: Math.random() * Math.PI * 2
        })
      }
      
      // Generate flowers within the same forest area
      for (let i = 0; i < flowersNeeded; i++) {
        const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)]
        
        const x = (Math.random() - 0.5) * forestArea
        const y = (Math.random() - 0.5) * forestArea
        
        newFlowers.push({
          x: x,
          y: y,
          scale: 0.6 + Math.random() * 0.4,
          type: flowerType
        })
      }
      
      setGroundTiles(newGroundTiles)
      setTrees(newTrees)
      setFlowers(newFlowers)
    }

    generateForest()
  }, [treesNeeded, flowersNeeded])

  return (
    <div className="w-full h-screen relative">
      {/* Instructions overlay */}
      <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-600 max-w-xs">
        <h3 className="font-semibold mb-2">Controls:</h3>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Drag:</strong> Rotate view</li>
          <li>• <strong>Scroll:</strong> Zoom in/out</li>
          <li>• <strong>Right-click + drag:</strong> Pan view</li>
        </ul>
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
                <h2 className="text-2xl font-bold text-gray-800">Your 3D Oak Forest</h2>
                <p className="text-sm text-gray-600">Drag to explore your forest from any angle</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tokens consumed:</span>
                <span className="font-semibold">{tokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CO₂ emissions:</span>
                <span className="font-semibold">{(tokens * 0.09 / 1000).toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Oak trees planted:</span>
                <span className="font-semibold text-green-600">{trees.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Flowers added:</span>
                <span className="font-semibold text-pink-600">{flowers.length}</span>
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
      
      <ErrorBoundary onError={onError}>
        <Canvas
          camera={{ 
            position: [15, 15, 15], 
            fov: 50 
          }}
          shadows
          className="bg-gradient-to-b from-sky-200 to-green-200"
        >
          <Suspense fallback={<LoadingFallback />}>
            <ModelPreloader />
            <ForestScene 
              trees={trees} 
              flowers={flowers} 
              groundTiles={groundTiles}
            />
          </Suspense>
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}

export default Forest3D
