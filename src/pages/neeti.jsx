"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import { useNavigate } from "react-router-dom"
import {
  Send,
  User,
  Briefcase,
  PiggyBank,
  Scale,
  Palette,
  Code,
  TrendingUp,
  Users,
  Shield,
  ChevronDown,
  Loader,
  ArrowLeft,
} from "lucide-react"

// --- Helper & UI Components ---

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

const Button = ({ children, className, ...props }) => (
  <button className={cn("flex items-center justify-center", className)} {...props}>
    {children}
  </button>
)

const Input = ({ className, ...props }) => <input className={cn("outline-none", className)} {...props} />

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  const selectedChild = React.Children.toArray(children)
    .find((child) => child.type === SelectContent)
    ?.props.children.find((item) => item.props.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [selectRef])

  return (
    <div className="relative" ref={selectRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {React.Children.map(children, (child) => {
          if (child.type === SelectTrigger) {
            const displayValue = selectedChild ? selectedChild.props.children : child.props.children
            return React.cloneElement(child, { children: displayValue })
          }
          return null
        })}
      </div>
      <AnimatePresence>
        {isOpen &&
          React.Children.map(children, (child) => {
            if (child.type === SelectContent) {
              return React.cloneElement(child, { onValueChange, setIsOpen })
            }
            return null
          })}
      </AnimatePresence>
    </div>
  )
}

const SelectTrigger = ({ children, className }) => (
  <div className={cn("flex items-center justify-between", className)}>
    {children}
    <ChevronDown className="w-4 h-4 opacity-50" />
  </div>
)

const SelectValue = ({ placeholder }) => <span className="text-slate-600">{placeholder}</span>

const SelectContent = ({ children, className, onValueChange, setIsOpen }) => (
  <motion.div
    className={cn("absolute top-full left-0 right-0 mt-2 z-50", className)}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {React.Children.map(children, (child) =>
      React.cloneElement(child, {
        onClick: () => {
          onValueChange(child.props.value)
          setIsOpen(false)
        },
      }),
    )}
  </motion.div>
)

const SelectItem = ({ children, className, ...props }) => (
  <div className={cn("transition-colors", className)} {...props}>
    {children}
  </div>
)

// --- Integrated Three.js Background Component ---

function ThreeBackground() {
  const mountRef = useRef(null)
  const sceneRef = useRef()
  const rendererRef = useRef()
  const frameRef = useRef()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    rendererRef.current = renderer

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0) // Transparent background
    mountRef.current.appendChild(renderer.domElement)

    const spheres = []

    // Create 5 large spheres with different sizes and positions
    for (let i = 0; i < 5; i++) {
      const radius = Math.random() * 3 + 2 // Increased from 2 + 1.5
      const geometry = new THREE.SphereGeometry(radius, 32, 32)

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.7, 0.6), // Blue variations
        wireframe: true,
        transparent: true,
        opacity: 0.3, // Increased from 0.15 for better visibility
      })

      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20) // Increased spread
      scene.add(sphere)
      spheres.push(sphere)
    }

    const rings = []
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.TorusGeometry(3, 0.5, 16, 100) // Increased size
      const material = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.25, // Increased from 0.1
      })

      const ring = new THREE.Mesh(geometry, material)
      ring.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15)
      scene.add(ring)
      rings.push(ring)
    }

    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 100 // Increased from 50
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50 // Increased spread
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.1, // Increased from 0.03
      transparent: true,
      opacity: 0.6, // Increased from 0.4
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    camera.position.z = 20 // Moved camera back slightly

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      const time = Date.now() * 0.005 // Increased from 0.002

      spheres.forEach((sphere, index) => {
        const speed = 1.0 + index * 0.3 // Increased from 0.5 + index * 0.2
        sphere.rotation.x += 0.02 // Increased from 0.01
        sphere.rotation.y += 0.03 // Increased from 0.015
        const radius = 15 + index * 4 // Increased from 12 + index * 3
        sphere.position.x = Math.cos(time * speed + index) * radius
        sphere.position.z = Math.sin(time * speed + index) * radius
        sphere.position.y += Math.sin(time * 6 + index) * 0.15 // Increased from 0.05
      })

      rings.forEach((ring, index) => {
        ring.rotation.x += 0.04 + index * 0.015 // Increased from 0.02 + index * 0.008
        ring.rotation.y += 0.03 + index * 0.01 // Increased from 0.015 + index * 0.005
        ring.position.y += Math.sin(time * 8 + index * 2) * 0.2 // Increased from 0.08
        // Add circular movement to rings
        const ringRadius = 10 + index * 3
        ring.position.x += Math.cos(time * 0.5 + index) * 0.1
        ring.position.z += Math.sin(time * 0.5 + index) * 0.1
      })

      particles.rotation.y += 0.008 // Increased from 0.003
      particles.rotation.x += 0.004 // Increased from 0.001
      // Add floating motion to particles
      particles.position.y = Math.sin(time * 2) * 0.5

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener("resize", handleResize)
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
      spheres.forEach((sphere) => {
        sphere.geometry.dispose()
        if (Array.isArray(sphere.material)) {
          sphere.material.forEach((m) => m.dispose())
        } else {
          sphere.material.dispose()
        }
      })
      rings.forEach((ring) => {
        ring.geometry.dispose()
        if (Array.isArray(ring.material)) {
          ring.material.forEach((m) => m.dispose())
        } else {
          ring.material.dispose()
        }
      })
      particleGeometry.dispose()
      particleMaterial.dispose()
      rendererRef.current?.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 70%, #94a3b8 100%)",
      }}
    />
  )
}

// --- Main Application ---

const personas = [
  {
    id: "business",
    name: "Business Advisor",
    description: "Strategic planning and operations expert",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    id: "finance",
    name: "Finance Advisor",
    description: "Expert in financial planning and investment",
    icon: <PiggyBank className="w-4 h-4" />,
  },
  {
    id: "legal",
    name: "Legal Advisor",
    description: "Specialized in business law and compliance",
    icon: <Scale className="w-4 h-4" />,
  },
  {
    id: "ux",
    name: "UX/UI Expert",
    description: "Design thinking and user experience specialist",
    icon: <Palette className="w-4 h-4" />,
  },
  {
    id: "tech",
    name: "Tech Consultant",
    description: "Software development and technology solutions",
    icon: <Code className="w-4 h-4" />,
  },
  {
    id: "marketing",
    name: "Marketing Strategist",
    description: "Brand building and growth marketing expert",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: "hr",
    name: "HR Specialist",
    description: "Human resources and talent management",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "security",
    name: "Security Expert",
    description: "Cybersecurity and risk management",
    icon: <Shield className="w-4 h-4" />,
  },
]

export default function NeetiAI() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [selectedPersona, setSelectedPersona] = useState("")
  const [isCompact, setIsCompact] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const handleBackToDashboard = () => {
    navigate("/dashboard")
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedPersona || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsCompact(true)
    setIsLoading(true)

    // Add a temporary loading message
    const loadingMessageId = (Date.now() + 1).toString()
    const selectedPersonaData = personas.find((p) => p.id === selectedPersona)
    const loadingMessage = {
      id: loadingMessageId,
      content: "...",
      sender: "ai",
      persona: selectedPersona,
      isLoading: true,
    }
    setMessages((prev) => [...prev, loadingMessage])

    const prompt = `You are a ${selectedPersonaData?.name}, a world-class ${selectedPersonaData?.description}. A user has the following request: "${inputValue}". Provide a detailed, professional, and insightful response in your area of expertise. Structure your response in a professional format. Use bullet points (e.g., using hyphens '-') to elaborate on key points and display information clearly. Do not use markdown formatting like '#' or '*' in your response.`

    // --- Gemini API Call ---
    const apiKey = "AIzaSyAUnSI5NhvOFxiy4dI04ac1mnRdfsQbpBA" // Leave this empty, it will be handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`

    const chatHistory = []
    chatHistory.push({ role: "user", parts: [{ text: prompt }] })
    const payload = { contents: chatHistory }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const result = await response.json()
      let aiResponseText = "Sorry, I couldn't generate a response. Please try again."

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const rawText = result.candidates[0].content.parts[0].text
        // Clean the response to remove markdown characters as a fallback
        aiResponseText = rawText.replace(/[#*]/g, "")
      }

      const aiMessage = {
        id: loadingMessageId, // Use the same ID to replace the loading message
        content: aiResponseText,
        sender: "ai",
        persona: selectedPersona,
      }

      setMessages((prev) => prev.map((msg) => (msg.id === loadingMessageId ? aiMessage : msg)))
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      const errorMessage = {
        id: loadingMessageId,
        content: "There was an error processing your request. Please check the console for details.",
        sender: "ai",
        persona: selectedPersona,
      }
      setMessages((prev) => prev.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg)))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      <ThreeBackground />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Button
          onClick={handleBackToDashboard}
          className="backdrop-blur-md bg-white/20 hover:bg-white/30 text-slate-800 border border-white/40 rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          className={`transition-all duration-700 ease-out ${isCompact ? "mb-6" : "mb-12"}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className={`font-light text-center bg-gradient-to-r from-blue-600 via-slate-800 to-blue-500 bg-clip-text text-transparent`}
            animate={{
              fontSize: isCompact ? "1.875rem" : "4.5rem",
              marginBottom: isCompact ? "0.5rem" : "1rem",
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            Neeti AI
          </motion.h1>
          <AnimatePresence>
            {!isCompact && (
              <motion.p
                className="text-slate-600 text-center mt-3 text-xl font-light tracking-wide"
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                Your intelligent business companion
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className={`backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl transition-all duration-700 ${
            isCompact ? "w-full max-w-4xl h-[70vh]" : "w-full max-w-xl"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-6 h-full flex flex-col">
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                <SelectTrigger className="w-full cursor-pointer backdrop-blur-md bg-white/30 border border-white/40 rounded-xl h-12 text-slate-800 hover:bg-white/40 transition-all duration-300 p-3">
                  {selectedPersona ? (
                    personas.find((p) => p.id === selectedPersona)?.name
                  ) : (
                    <SelectValue placeholder="Choose your AI specialist..." />
                  )}
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-white/90 border border-white/50 rounded-xl p-1">
                  {personas.map((persona) => (
                    <SelectItem
                      key={persona.id}
                      value={persona.id}
                      className="cursor-pointer hover:bg-blue-100/50 focus:bg-blue-100/50 text-slate-800 rounded-lg m-1 p-2"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <span className="text-blue-600">{persona.icon}</span>
                        <div>
                          <div className="font-medium text-slate-800">{persona.name}</div>
                          <div className="text-sm text-slate-600">{persona.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <AnimatePresence>
              {isCompact && (
                <motion.div
                  className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      className={`flex items-start ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      {message.sender === "ai" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-blue-600 mr-3 mt-1">
                          {message.isLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            message.persona && personas.find((p) => p.id === message.persona)?.icon
                          )}
                        </div>
                      )}
                      <div
                        className={`backdrop-blur-md rounded-2xl p-3 max-w-[75%] shadow-lg ${
                          message.sender === "user"
                            ? "bg-blue-500/20 border border-blue-400/40 text-slate-800"
                            : "bg-white/40 border border-white/50 text-slate-800"
                        }`}
                      >
                        {message.sender === "ai" && message.persona && (
                          <div className="text-xs font-bold text-blue-700 mb-1.5">
                            {personas.find((p) => p.id === message.persona)?.name}
                          </div>
                        )}
                        <p className="leading-relaxed text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.sender === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 ml-3 mt-1">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedPersona ? "Ask your question..." : "Select a specialist first..."}
                className="flex-1 backdrop-blur-md bg-white/30 border border-white/40 rounded-xl h-12 text-slate-800 placeholder:text-slate-600 focus:bg-white/40 focus:border-white/60 transition-all duration-300 p-3"
                disabled={!selectedPersona || isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !selectedPersona || isLoading}
                className="backdrop-blur-md bg-blue-500/30 hover:bg-blue-500/40 text-slate-800 border border-blue-400/40 rounded-xl h-12 w-12 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
