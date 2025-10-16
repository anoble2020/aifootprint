import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
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

// Custom hook for safe GLTF loading with fallback
function useSafeGLTF(url) {
  try {
    return useGLTF(url)
  } catch (error) {
    console.warn(`Failed to load GLTF model: ${url}`, error)
    return null
  }
}

// Simple model preloader that triggers loading completion
function ModelPreloader({ onLoadingComplete }) {
  const treeVariants = ['', '_dark', '_fall']
  const flowerTypes = ['flower_purpleA', 'flower_purpleB', 'flower_purpleC', 'flower_redA', 'flower_redB', 'flower_redC', 'flower_yellowA', 'flower_yellowB', 'flower_yellowC']
  const mushroomTypes = ['mushroom_red', 'mushroom_redTall', 'mushroom_tan', 'mushroom_tanGroup']
  const logTypes = ['log', 'log_large', 'log_stack', 'log_stackLarge']
  const plantTypes = ['plant_bushSmall', 'plant_flatShort']
  
  // Preload all models
  treeVariants.forEach(variant => {
    useGLTF.preload(`/src/assets/kenney_nature-kit/Models/GLTF format/tree_oak${variant}.glb`)
  })
  
  flowerTypes.forEach(type => {
    useGLTF.preload(`/src/assets/kenney_nature-kit/Models/GLTF format/${type}.glb`)
  })
  
  mushroomTypes.forEach(type => {
    useGLTF.preload(`/src/assets/kenney_nature-kit/Models/GLTF format/${type}.glb`)
  })
  
  logTypes.forEach(type => {
    useGLTF.preload(`/src/assets/kenney_nature-kit/Models/GLTF format/${type}.glb`)
  })
  
  plantTypes.forEach(type => {
    useGLTF.preload(`/src/assets/kenney_nature-kit/Models/GLTF format/${type}.glb`)
  })
  
  useGLTF.preload('/src/assets/kenney_nature-kit/Models/GLTF format/ground_grass.glb')
  
  // Signal that preloading is complete
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete()
    }, 100) // Small delay to ensure preloading has started
    
    return () => clearTimeout(timer)
  }, [onLoadingComplete])
  
  return null
}


// Loading fallback component
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-200 to-green-200 z-50">
      <div className="flex items-end space-x-4">
        {/* Three bouncing trees */}
        <div className="flex flex-col items-center">
          <div className="text-2xl animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}>🌳</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-2xl animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }}>🌳</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-2xl animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }}>🌳</div>
        </div>
      </div>
    </div>
  )
}

// Tree component that loads GLTF models with fallback
function Tree({ position, scale, variant, rotation }) {
  const meshRef = useRef()
  const gltf = useSafeGLTF(`/src/assets/kenney_nature-kit/Models/GLTF format/tree_oak${variant}.glb`)
  
  // Add some subtle animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  // If GLTF model loaded successfully, use it
  if (gltf && gltf.scene) {
    const clonedScene = gltf.scene.clone()
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
  }

  // Fallback to simple geometry
  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 8, 6]} />
        <meshLambertMaterial color="#228B22" />
      </mesh>
    </group>
  )
}

// Flower component that loads GLTF models with fallback
function Flower({ position, scale, type }) {
  const meshRef = useRef()
  const gltf = useSafeGLTF(`/src/assets/kenney_nature-kit/Models/GLTF format/${type}.glb`)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  // If GLTF model loaded successfully, use it
  if (gltf && gltf.scene) {
    const clonedScene = gltf.scene.clone()
    return (
      <primitive 
        ref={meshRef}
        object={clonedScene} 
        position={position} 
        scale={scale}
        castShadow
      />
    )
  }

  // Fallback to simple geometry
  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow>
      <sphereGeometry args={[0.3, 8, 6]} />
      <meshLambertMaterial color="pink" />
    </mesh>
  )
}

// Mushroom component that loads GLTF models with fallback
function Mushroom({ position, scale, type }) {
  const meshRef = useRef()
  const gltf = useSafeGLTF(`/src/assets/kenney_nature-kit/Models/GLTF format/${type}.glb`)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  // If GLTF model loaded successfully, use it
  if (gltf && gltf.scene) {
    const clonedScene = gltf.scene.clone()
    return (
      <primitive 
        ref={meshRef}
        object={clonedScene} 
        position={position} 
        scale={scale}
        castShadow
      />
    )
  }

  // Fallback to simple geometry
  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow>
      <cylinderGeometry args={[0.2, 0.3, 0.4, 8]} />
      <meshLambertMaterial color="red" />
    </mesh>
  )
}

// Log component that loads GLTF models with fallback
function Log({ position, scale, type }) {
  const meshRef = useRef()
  const gltf = useSafeGLTF(`/src/assets/kenney_nature-kit/Models/GLTF format/${type}.glb`)

  // If GLTF model loaded successfully, use it
  if (gltf && gltf.scene) {
    const clonedScene = gltf.scene.clone()
    return (
      <primitive 
        ref={meshRef}
        object={clonedScene} 
        position={position} 
        scale={scale}
        castShadow
      />
    )
  }

  // Fallback to simple geometry
  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow>
      <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
      <meshLambertMaterial color="brown" />
    </mesh>
  )
}

// Plant component that loads GLTF models with fallback
function Plant({ position, scale, type }) {
  const meshRef = useRef()
  const gltf = useSafeGLTF(`/src/assets/kenney_nature-kit/Models/GLTF format/${type}.glb`)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
    }
  })

  // If GLTF model loaded successfully, use it
  if (gltf && gltf.scene) {
    const clonedScene = gltf.scene.clone()
    return (
      <primitive 
        ref={meshRef}
        object={clonedScene} 
        position={position} 
        scale={scale}
        castShadow
      />
    )
  }

  // Fallback to simple geometry
  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow>
      <coneGeometry args={[0.4, 0.8, 6]} />
      <meshLambertMaterial color="green" />
    </mesh>
  )
}

// Ground component - separated layers to prevent z-fighting
function Ground({ position, size }) {
  return (
    <group position={position}>
      {/* Thick base layer (brown earth) - positioned lower */}
      <mesh 
        position={[0, -0.4, 0]}
        receiveShadow
      >
        <boxGeometry args={[size, 0.6, size]} />
        <meshLambertMaterial 
          color="#8B7355"
          roughness={0.8}
        />
      </mesh>
      
      {/* Green top surface (grass/forest floor) - positioned slightly higher */}
      <mesh 
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[size, size]} />
        <meshLambertMaterial 
          color="#4A7C59"
          roughness={0.7}
        />
      </mesh>
    </group>
  )
}

// Forest scene component (3D only, no UI elements)
function ForestScene({ trees, flowers, mushrooms, logs, plants, groundTiles }) {
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

      {/* Mushrooms */}
      {mushrooms.map((mushroom, index) => (
        <Mushroom
          key={`mushroom-${index}`}
          position={[mushroom.x, 0, mushroom.y]}
          scale={[mushroom.scale, mushroom.scale, mushroom.scale]}
          type={mushroom.type}
        />
      ))}

      {/* Logs */}
      {logs.map((log, index) => (
        <Log
          key={`log-${index}`}
          position={[log.x, 0, log.y]}
          scale={[log.scale, log.scale, log.scale]}
          type={log.type}
        />
      ))}

      {/* Plants */}
      {plants.map((plant, index) => (
        <Plant
          key={`plant-${index}`}
          position={[plant.x, 0, plant.y]}
          scale={[plant.scale, plant.scale, plant.scale]}
          type={plant.type}
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
  const [mushrooms, setMushrooms] = useState([])
  const [logs, setLogs] = useState([])
  const [plants, setPlants] = useState([])
  const [groundTiles, setGroundTiles] = useState([])
  const [showStats, setShowStats] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Debug loading state
  useEffect(() => {
    console.log('isLoading state changed:', isLoading)
  }, [isLoading])

  // Calculate number of trees needed based on tokens
  const co2Grams = tokens * 0.09
  const co2Kg = co2Grams / 1000
  const treesNeeded = Math.max(1, Math.ceil(co2Kg / 21.77))
  const flowersNeeded = Math.floor(treesNeeded / 3)
  const mushroomsNeeded = Math.floor(treesNeeded / 10) // 1 per 10 trees
  const logsNeeded = Math.floor(treesNeeded / 10) // 1 per 10 trees
  const plantsNeeded = Math.floor(treesNeeded / 5) // 1 per 5 trees


  // Handle model loading completion
  const handleAllModelsLoaded = () => {
    console.log('Models loaded, starting 2-second timer...')
    // Add a minimum loading time to ensure loader is visible
    setTimeout(() => {
      console.log('Setting isLoading to false')
      setIsLoading(false)
    }, 2000) // 2 second minimum loading time
  }

  const handleModelError = (url, error) => {
    console.warn(`Model failed to load: ${url}`, error)
  }

  // Show stats after models are loaded
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowStats(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  // Generate forest elements
  useEffect(() => {
    const generateForest = () => {
      // Tree variants
      const treeVariants = ['', '_dark', '_fall']
      const flowerTypes = ['flower_purpleA', 'flower_purpleB', 'flower_purpleC', 'flower_redA', 'flower_redB', 'flower_redC', 'flower_yellowA', 'flower_yellowB', 'flower_yellowC']
      const mushroomTypes = ['mushroom_red', 'mushroom_redTall', 'mushroom_tan', 'mushroom_tanGroup']
      const logTypes = ['log', 'log_large', 'log_stack', 'log_stackLarge']
      const plantTypes = ['plant_bushSmall', 'plant_flatShort']
      
      const newTrees = []
      const newFlowers = []
      const newMushrooms = []
      const newLogs = []
      const newPlants = []
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
      
      // Generate mushrooms (1 per 10 trees)
      for (let i = 0; i < mushroomsNeeded; i++) {
        const mushroomType = mushroomTypes[Math.floor(Math.random() * mushroomTypes.length)]
        
        const x = (Math.random() - 0.5) * forestArea
        const y = (Math.random() - 0.5) * forestArea
        
        newMushrooms.push({
          x: x,
          y: y,
          scale: 0.5 + Math.random() * 0.3,
          type: mushroomType
        })
      }
      
      // Generate logs (1 per 10 trees)
      for (let i = 0; i < logsNeeded; i++) {
        const logType = logTypes[Math.floor(Math.random() * logTypes.length)]
        
        const x = (Math.random() - 0.5) * forestArea
        const y = (Math.random() - 0.5) * forestArea
        
        newLogs.push({
          x: x,
          y: y,
          scale: 0.7 + Math.random() * 0.4,
          type: logType
        })
      }
      
      // Generate plants (1 per 5 trees)
      for (let i = 0; i < plantsNeeded; i++) {
        const plantType = plantTypes[Math.floor(Math.random() * plantTypes.length)]
        
        const x = (Math.random() - 0.5) * forestArea
        const y = (Math.random() - 0.5) * forestArea
        
        newPlants.push({
          x: x,
          y: y,
          scale: 0.6 + Math.random() * 0.4,
          type: plantType
        })
      }
      
      setGroundTiles(newGroundTiles)
      setTrees(newTrees)
      setFlowers(newFlowers)
      setMushrooms(newMushrooms)
      setLogs(newLogs)
      setPlants(newPlants)
    }

    generateForest()
  }, [treesNeeded, flowersNeeded, mushroomsNeeded, logsNeeded, plantsNeeded])

  return (
    <div className="w-full h-screen relative">
      {/* Show loader until models are loaded */}
      {isLoading && <LoadingFallback />}
      
      {/* Instructions overlay */}
      {!isLoading && (
        <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-600 max-w-xs">
          <h3 className="font-semibold mb-2">Controls:</h3>
          <ul className="space-y-1 text-xs">
            <li>• <strong>Drag:</strong> Rotate view</li>
            <li>• <strong>Scroll:</strong> Zoom in/out</li>
            <li>• <strong>Right-click + drag:</strong> Pan view</li>
          </ul>
        </div>
      )}

      {/* Stats overlay */}
      {!isLoading && showStats && (
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
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mushrooms:</span>
                <span className="font-semibold text-red-600">{mushrooms.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Logs:</span>
                <span className="font-semibold text-amber-600">{logs.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plants:</span>
                <span className="font-semibold text-green-500">{plants.length}</span>
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
          <Suspense fallback={null}>
            <ModelPreloader onLoadingComplete={handleAllModelsLoaded} />
            {!isLoading && (
              <ForestScene 
                trees={trees} 
                flowers={flowers} 
                mushrooms={mushrooms}
                logs={logs}
                plants={plants}
                groundTiles={groundTiles}
              />
            )}
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
