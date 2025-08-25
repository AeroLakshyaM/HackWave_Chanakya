"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Float, Sphere, Box, Octahedron, Environment, Torus, Cone, Cylinder } from "@react-three/drei"
import { account } from "../config/Appwrite"
import { useNavigate, Link } from "react-router-dom"

const Background3D = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
    >
      <Environment preset="dawn" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#60a5fa" />

      {/* Large floating geometric shapes */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[3.5]} position={[-12, 4, -8]}>
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.7} roughness={0.2} metalness={0.8} />
        </Sphere>
      </Float>

      <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
        <Box args={[4, 4, 4]} position={[15, -3, -12]}>
          <meshStandardMaterial color="#1e40af" transparent opacity={0.6} roughness={0.3} metalness={0.7} />
        </Box>
      </Float>

      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={2.5}>
        <Octahedron args={[3.2]} position={[-10, -6, -10]}>
          <meshStandardMaterial color="#2563eb" transparent opacity={0.8} roughness={0.1} metalness={0.9} />
        </Octahedron>
      </Float>

      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1.8}>
        <Torus args={[2.5, 1.2, 16, 32]} position={[12, 6, -6]}>
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.7} roughness={0.2} metalness={0.8} />
        </Torus>
      </Float>

      <Float speed={2.2} rotationIntensity={2.5} floatIntensity={2}>
        <Cone args={[2.8, 5.5, 8]} position={[-15, 2, -15]}>
          <meshStandardMaterial color="#1d4ed8" transparent opacity={0.5} roughness={0.4} metalness={0.6} />
        </Cone>
      </Float>

      <Float speed={1.6} rotationIntensity={1.2} floatIntensity={2.2}>
        <Cylinder args={[2, 3.5, 6, 12]} position={[8, -8, -14]}>
          <meshStandardMaterial color="#3730a3" transparent opacity={0.6} roughness={0.3} metalness={0.7} />
        </Cylinder>
      </Float>

      {/* Additional large elements for more visual impact */}
      <Float speed={3} rotationIntensity={3} floatIntensity={1}>
        <Sphere args={[2.8]} position={[-6, 8, -5]}>
          <meshStandardMaterial color="#93c5fd" transparent opacity={0.8} roughness={0.1} metalness={0.9} />
        </Sphere>
      </Float>

      <Float speed={2.5} rotationIntensity={2} floatIntensity={3}>
        <Box args={[3.2, 3.2, 3.2]} position={[18, 3, -18]}>
          <meshStandardMaterial color="#1e3a8a" transparent opacity={0.4} roughness={0.5} metalness={0.5} />
        </Box>
      </Float>

      <Float speed={1.4} rotationIntensity={1.8} floatIntensity={2.8}>
        <Torus args={[3.8, 1.8, 16, 32]} position={[-8, -2, -20]}>
          <meshStandardMaterial color="#4f46e5" transparent opacity={0.6} roughness={0.2} metalness={0.8} />
        </Torus>
      </Float>

      <Float speed={2.8} rotationIntensity={2.2} floatIntensity={1.6}>
        <Octahedron args={[4.5]} position={[10, 8, -25]}>
          <meshStandardMaterial color="#6366f1" transparent opacity={0.5} roughness={0.3} metalness={0.7} />
        </Octahedron>
      </Float>
    </Canvas>
  )
}

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signup") // Default to signup tab
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" })
  const [loginData, setLoginData] = useState({ email: "", password: "" })

  const navigate = useNavigate()

  // Animation on mount and session check
  useEffect(() => {
    setMounted(true)
    
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        // Only check session if we haven't already determined the user is not logged in
        if (!mounted) {
          const session = await account.get()
          console.log("User already logged in:", session)
          // If user is logged in, redirect to dashboard
          navigate("/dashboard")
        }
      } catch (error) {
        // Only log once to avoid spam
        if (mounted) {
          console.log("No active session - user needs to authenticate")
        }
        // User is not logged in, stay on auth page
      }
    }
    
    // Check for OAuth redirect parameters
    const checkOAuthRedirect = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const userId = urlParams.get('userId')
      const sessionId = urlParams.get('sessionId')
      
      if (userId && sessionId) {
        console.log('OAuth redirect detected:', { userId, sessionId })
        // OAuth was successful, redirect to dashboard
        navigate("/dashboard", { replace: true })
      }
    }
    
    // Only check session once on mount
    checkSession()
    checkOAuthRedirect()
    
    // Clear form fields on mount to prevent auto-fill
    const clearFields = () => {
      setLoginData({ email: '', password: '' })
      setSignupData({ name: '', email: '', password: '' })
      
      // Force clear any auto-filled values
      setTimeout(() => {
        const emailInputs = document.querySelectorAll('input[type="email"]')
        const passwordInputs = document.querySelectorAll('input[type="password"]')
        const textInputs = document.querySelectorAll('input[type="text"]')
        
        emailInputs.forEach(input => {
          input.value = ''
          input.setAttribute('value', '')
        })
        
        passwordInputs.forEach(input => {
          input.value = ''
          input.setAttribute('value', '')
        })
        
        textInputs.forEach(input => {
          if (input.placeholder && !input.placeholder.includes('hidden')) {
            input.value = ''
            input.setAttribute('value', '')
          }
        })
      }, 100)
    }
    
    clearFields()
  }, [navigate]) // Remove mounted from dependency to prevent re-runs

  // Clear fields only when switching tabs or on mount
  useEffect(() => {
    if (activeTab === "login") {
      // Clear fields when login tab becomes active
      setLoginData({ email: '', password: '' })
      
      // Immediate DOM clearing
      const clearFieldsImmediately = () => {
        const emailInput = document.querySelector('input[name="user_email_input"]')
        const passwordInput = document.querySelector('input[name="user_password_input"]')
        
        if (emailInput) {
          emailInput.value = ''
          emailInput.setAttribute('value', '')
        }
        
        if (passwordInput) {
          passwordInput.value = ''
          passwordInput.setAttribute('value', '')
        }
      }
      
      // Clear immediately and then once more after a delay
      clearFieldsImmediately()
      setTimeout(clearFieldsImmediately, 100)
    } else if (activeTab === "signup") {
      // Clear fields when signup tab becomes active
      setSignupData({ name: '', email: '', password: '' })
      
      // Immediate DOM clearing
      const clearFieldsImmediately = () => {
        const nameInput = document.querySelector('input[name="user_name_input"]')
        const emailInput = document.querySelector('input[name="user_signup_email_input"]')
        const passwordInput = document.querySelector('input[name="user_signup_password_input"]')
        
        if (nameInput) {
          nameInput.value = ''
          nameInput.setAttribute('value', '')
        }
        
        if (emailInput) {
          emailInput.value = ''
          emailInput.setAttribute('value', '')
        }
        
        if (passwordInput) {
          passwordInput.value = ''
          passwordInput.setAttribute('value', '')
        }
      }
      
      // Clear immediately and then once more after a delay
      clearFieldsImmediately()
      setTimeout(clearFieldsImmediately, 100)
    }
  }, [activeTab])

  // Continuous anti-auto-fill protection for both tabs
  useEffect(() => {
    if (activeTab === "login") {
      const interval = setInterval(() => {
        const emailInput = document.querySelector('input[name="user_email_input"]')
        const passwordInput = document.querySelector('input[name="user_password_input"]')
        
        // Only clear if fields have auto-filled values but React state is empty
        if (emailInput && emailInput.value && !loginData.email) {
          emailInput.value = ''
          emailInput.setAttribute('value', '')
        }
        
        if (passwordInput && passwordInput.value && !loginData.password) {
          passwordInput.value = ''
          passwordInput.setAttribute('value', '')
        }
      }, 1000) // Check every 1 second for faster response
      
      return () => clearInterval(interval)
    } else if (activeTab === "signup") {
      const interval = setInterval(() => {
        const nameInput = document.querySelector('input[name="user_name_input"]')
        const emailInput = document.querySelector('input[name="user_signup_email_input"]')
        const passwordInput = document.querySelector('input[name="user_signup_password_input"]')
        
        // Only clear if fields have auto-filled values but React state is empty
        if (nameInput && nameInput.value && !signupData.name) {
          nameInput.value = ''
          nameInput.setAttribute('value', '')
        }
        
        if (emailInput && emailInput.value && !signupData.email) {
          emailInput.value = ''
          emailInput.setAttribute('value', '')
        }
        
        if (passwordInput && passwordInput.value && !signupData.password) {
          passwordInput.value = ''
          passwordInput.setAttribute('value', '')
        }
      }, 1000) // Check every 1 second for faster response
      
      return () => clearInterval(interval)
    }
  }, [activeTab, loginData.email, loginData.password, signupData.name, signupData.email, signupData.password])

  // Additional aggressive anti-auto-fill that runs on every render
  useEffect(() => {
    if (activeTab === "login") {
      // Force clear any auto-filled values on every render
      const emailInput = document.querySelector('input[name="user_email_input"]')
      const passwordInput = document.querySelector('input[name="user_password_input"]')
      
      if (emailInput && emailInput.value && !loginData.email) {
        emailInput.value = ''
        emailInput.setAttribute('value', '')
      }
      
      if (passwordInput && passwordInput.value && !loginData.password) {
        passwordInput.value = ''
        passwordInput.setAttribute('value', '')
      }
    } else if (activeTab === "signup") {
      // Force clear any auto-filled values on every render
      const nameInput = document.querySelector('input[name="user_name_input"]')
      const emailInput = document.querySelector('input[name="user_signup_email_input"]')
      const passwordInput = document.querySelector('input[name="user_signup_password_input"]')
      
      if (nameInput && nameInput.value && !signupData.name) {
        nameInput.value = ''
        nameInput.setAttribute('value', '')
      }
      
      if (emailInput && emailInput.value && !signupData.email) {
        emailInput.value = ''
        emailInput.setAttribute('value', '')
      }
      
      if (passwordInput && passwordInput.value && !signupData.password) {
        passwordInput.value = ''
        passwordInput.setAttribute('value', '')
      }
    }
  })

  // Signup function
  const handleSignup = async (e) => {
    e.preventDefault()
    
    if (!signupData.name || !signupData.email || !signupData.password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Attempting signup with:", signupData.email)
      // Generate a valid user ID from the email (Appwrite requirement)
      const userId = signupData.email.toLowerCase().replace(/[^a-z0-9]/g, '')
      
      const response = await account.create(
        userId, // Use generated userId instead of name
        signupData.email,
        signupData.password,
        signupData.name, // Display name can contain special characters
      )
      console.log("Signup successful!", response)
      
      // Automatically log the user in after successful signup
      try {
        console.log("Auto-logging in user after signup...")
        const session = await account.createEmailPasswordSession(signupData.email, signupData.password)
        console.log("Auto-login successful!", session)
        alert("SignUp successful! Redirecting to profile setup...")
        
        // Now redirect to startupornot since user is authenticated
        navigate("/startupornot", { replace: true })
      } catch (loginError) {
        console.log("Auto-login failed:", loginError)
        setError("Signup successful but auto-login failed. Please login manually.")
        // Redirect to login tab
        setActiveTab('login')
      }
      
    } catch (error) {
      console.log("Signup error:", error)
      setError(error.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Attempting login with:", loginData.email)
      
      // First, try to get current session to check if user is already logged in
      try {
        const currentSession = await account.get()
        console.log("User already logged in:", currentSession)
        // If we reach here, user is already logged in, so just navigate
        navigate("/dashboard")
        return
      } catch (sessionError) {
        // User is not logged in, proceed with login
        console.log("No active session, proceeding with login")
      }
      
      const session = await account.createEmailPasswordSession(loginData.email, loginData.password)
      console.log("Login successful!", session)
      navigate("/dashboard")
    } catch (error) {
      console.log("Login error:", error)
      if (error.message.includes("session is active")) {
        setError("You are already logged in. Redirecting to analytics...")
        setTimeout(() => navigate("/analytics"), 2000)
      } else if (error.code === 401) {
        setError("Invalid email or password or Try with a verified email. Please try again.")
      } else if (error.code === 429) {
        setError("Too many login attempts. Please try again later.")
      } else {
        setError(error.message || "Login failed. Please check your credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth functions
  const handleGoogleAuth = async (type) => {
    try {
      setGoogleLoading(true)
      setError("")
      
      // Set proper success and failure URLs
      const successUrl = window.location.origin + "/dashboard"
      const failureUrl = window.location.origin + "/auth"
      
      console.log(`Starting Google OAuth for ${type}...`)
      console.log('Success URL:', successUrl)
      console.log('Failure URL:', failureUrl)
      
      // Create OAuth session
      await account.createOAuth2Session('google', successUrl, failureUrl)
      
      // If we reach here, OAuth was successful
      console.log('Google OAuth successful!')
      
    } catch (error) {
      console.log("Google OAuth error:", error)
      
      // Handle specific OAuth errors
      if (error.code === 401) {
        setError("Google authentication failed. Please try again.")
      } else if (error.code === 503) {
        setError("Google OAuth service is temporarily unavailable. Please try again later.")
      } else if (error.message.includes("popup")) {
        setError("Please allow popups for this site to use Google sign-in.")
      } else {
        setError(`Google ${type} failed: ${error.message || 'Unknown error'}. Please try again.`)
      }
      
      // Reset loading state
      setGoogleLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center justify-center p-6 relative overflow-hidden">
      <Background3D />

      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'float 8s ease-in-out infinite'
          }}></div>
        </div>
        
        {/* Animated Light Rays */}
        
        {/* Floating Icons */}
        
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 4 === 0 ? 'bg-blue-400/60' : 
              i % 4 === 1 ? 'bg-purple-400/60' : 
              i % 4 === 2 ? 'bg-cyan-400/60' : 'bg-pink-400/60'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`
            }}
          ></div>
        ))}
      </div>

      <div
        className={`w-full relative transition-all duration-1000 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center justify-center gap-12">
          {/* Logo/Brand - Left Side */}
          <div className="flex-1 max-w-md animate-fade-in">
            <h1 className="text-[100px] -translate-x-40 font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4 animate-slide-up ">
              Chanakya
            </h1>
            <p className="text-[28px] text-blue-600 font-medium animate-slide-up animation-delay-200 -translate-x-36 mb-4">
              Welcome To This New Generation of Arthashastra
            </p>
          </div>

          {/* Auth Card - Right Side */}
          <div className="flex-1 max-w-md">
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 animate-slide-up animation-delay-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
              <div className="relative z-10">
                {/* Enhanced Tab Navigation */}
                <div className="flex mb-6 bg-white/20 backdrop-blur-md rounded-xl p-1 relative overflow-hidden border border-white/20">
                  {/* Animated background for active tab */}
                  <div
                    className={`absolute top-1 bottom-1 bg-white/40 backdrop-blur-sm rounded-lg shadow-md transition-all duration-500 ease-out transform border border-white/30 ${
                      activeTab === "signup" ? "left-1 w-1/2 scale-100" : "left-[calc(50%-2px)] w-1/2 scale-100"
                    }`}
                  ></div>

                  {/* Glowing effect for active tab */}

                  <button
                    onClick={() => {
                      setActiveTab("signup")
                      setError("")
                      // Clear fields when switching tabs
                      setLoginData({ email: "", password: "" })
                      setSignupData({ name: "", email: "", password: "" })
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 transform hover:scale-105 active:scale-95 ${
                      activeTab === "signup" ? "text-blue-700 drop-shadow-sm" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <span className="relative">
                      Sign Up
                      {activeTab === "signup" && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5  rounded-full animate-pulse"></span>
                      )}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("login")
                      setError("")
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 transform hover:scale-105 active:scale-95 ${
                      activeTab === "login" ? "text-blue-700 drop-shadow-sm" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <span className="relative">
                      Login
                      {activeTab === "login" && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full animate-pulse"></span>
                      )}
                    </span>
                  </button>
                </div>

                {/* Enhanced Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl animate-shake relative overflow-hidden">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-pink-100/50 animate-pulse"></div>

                    <div className="flex items-center relative z-10">
                      <div className="relative">
                        <svg
                          className="w-5 h-5 text-red-500 mr-2 animate-pulse"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {/* Sparkle effect */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-sparkle"></div>
                      </div>
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>

                    {/* Ripple effect on error */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-400/30 rounded-full animate-ripple transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                )}

                {/* Signup Form */}
                {activeTab === "signup" && (
                  <form onSubmit={handleSignup} className="space-y-4 animate-fade-in">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-800 mb-2 focus:text-blue-600 transition-colors duration-200">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="user_name_input"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-white/30 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-400 transition-all duration-200 bg-white/30 backdrop-blur-sm text-gray-800 placeholder-gray-600"
                          placeholder="Enter your full name "
                          disabled={loading}
                          required
                          pattern="[A-Za-zÀ-ÿ\s\-'\.]+"
                          title="Please enter a valid name with letters, spaces, hyphens, apostrophes, and periods"
                          autoComplete="off"
                          autoFill="off"
                          data-form-type="other"
                          data-lpignore="true"
                          data-1p-ignore="true"
                          data-bwignore="true"
                          data-testid="name-input"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-800 mb-2 transition-colors duration-200">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="user_signup_email_input"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-white/30 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-400 transition-all duration-200 bg-white/30 backdrop-blur-sm text-gray-800 placeholder-gray-600"
                          placeholder="Enter your email"
                          disabled={loading}
                          required
                          autoComplete="off"
                          autoFill="off"
                          data-form-type="other"
                          data-lpignore="true"
                          data-1p-ignore="true"
                          data-bwignore="true"
                          data-testid="signup-email-input"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="user_signup_password_input"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-white/30 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-400 transition-all duration-200 bg-white/30 backdrop-blur-sm text-gray-800 placeholder-gray-600"
                          placeholder="Create your password"
                          disabled={loading}
                          required
                          autoComplete="off"
                          autoFill="off"
                          data-form-type="other"
                          data-lpignore="true"
                          data-1p-ignore="true"
                          data-bwignore="true"
                          data-testid="signup-password-input"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-6 rounded-xl font-semibold text-base transition-all duration-300 transform  active:scale-95 relative overflow-hidden ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full opacity-0 hover:opacity-100 hover:animate-bounce transition-all duration-300"></div>
                      <div className="absolute top-3 right-6 w-1 h-1 bg-white/60 rounded-full opacity-0 hover:opacity-100 hover:animate-bounce animation-delay-200 transition-all duration-300"></div>
                      <div className="absolute bottom-3 left-6 w-1 h-1 bg-white/60 rounded-full opacity-0 hover:opacity-100 hover:animate-bounce animation-delay-400 transition-all duration-300"></div>

                      <span className="relative z-10">
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Creating Account...
                          </div>
                        ) : (
                          <span className="flex items-center justify-center">
                            Create Account
                            <svg
                              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </span>
                        )}
                      </span>
                    </button>
                  </form>
                )}

                {/* Login Form */}
                {activeTab === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
                    {/* ... existing hidden fields ... */}
                    <input type="text" style={{ display: "none" }} autoComplete="off" />
                    <input type="password" style={{ display: "none" }} autoComplete="off" />
                    <input type="email" style={{ display: "none" }} autoComplete="off" />
                    <input type="text" name="username" style={{ display: "none" }} autoComplete="off" />
                    <input type="password" name="password" style={{ display: "none" }} autoComplete="off" />
                    <input type="email" name="email" style={{ display: "none" }} autoComplete="off" />
                    <input type="text" name="login" style={{ display: "none" }} autoComplete="off" />
                    <input type="text" name="user" style={{ display: "none" }} autoComplete="off" />
                    <input type="text" name="account" style={{ display: "none" }} autoComplete="off" />

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors duration-200">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="user_email_input"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          onFocus={(e) => {
                            if (e.target.value && !loginData.email) {
                              e.target.value = ""
                              setLoginData({ ...loginData, email: "" })
                            }
                          }}
                          className="w-full px-4 py-4 border-2 border-white/30 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-400 transition-all duration-200 bg-white/30 backdrop-blur-sm text-gray-800 placeholder-gray-600"
                          placeholder="Enter your email"
                          disabled={loading}
                          required
                          autoComplete="off"
                          autoFill="off"
                          data-form-type="other"
                          data-lpignore="true"
                          data-1p-ignore="true"
                          data-bwignore="true"
                          data-autocomplete="off"
                          data-akamai-gtm="off"
                          data-testid="email-input"
                          style={{
                            WebkitTextFillColor: "inherit",
                            WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                            transition: "background-color 5000s ease-in-out 0s",
                          }}
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors duration-200">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="user_password_input"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          onFocus={(e) => {
                            if (e.target.value && !loginData.password) {
                              e.target.value = ""
                              setLoginData({ ...loginData, password: "" })
                            }
                          }}
                          className="w-full px-4 py-4 border-2 border-white/30 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-400 transition-all duration-200 bg-white/30 backdrop-blur-sm text-gray-800 placeholder-gray-600"
                          placeholder="Enter your password"
                          disabled={loading}
                          required
                          autoComplete="off"
                          autoFill="off"
                          data-form-type="other"
                          data-lpignore="true"
                          data-1p-ignore="true"
                          data-bwignore="true"
                          data-testid="password-input"
                          style={{
                            WebkitTextFillColor: "inherit",
                            WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                            transition: "background-color 5000s ease-in-out 0s",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-6 rounded-xl font-semibold text-base transition-all duration-300 transform  active:scale-95 relative overflow-hidden ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full opacity-0 hover:opacity-100 hover:animate-bounce transition-all duration-300"></div>
                      <div className="absolute top-3 right-6 w-1 h-1 bg-white/60 rounded-full opacity-0 hover:opacity-100 hover:animate-bounce animation-delay-200 transition-all duration-300"></div>
                      <div className="absolute bottom-3 left-6 w-1 h-1 bg-white/60 rounded-full opacity-0 hover:opacity-100 hover:animate-bounce animation-delay-400 transition-all duration-300"></div>

                      <span className="relative z-10">
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Signing In...
                          </div>
                        ) : (
                          <span className="flex items-center justify-center">
                            Sign In
                            <svg
                              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </span>
                        )}
                      </span>
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  <span className="px-4 text-sm text-gray-700 font-medium">or continue with</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </div>

                {/* Google OAuth Button */}
                <button
                  onClick={() => handleGoogleAuth(activeTab)}
                  disabled={googleLoading}
                  className={`w-full py-3 px-6 border-2 border-white/30 rounded-xl font-semibold transition-all duration-300 transform  active:scale-95 flex items-center justify-center gap-3 ${
                    googleLoading
                      ? "bg-white/20 cursor-not-allowed"
                      : "bg-white/30 backdrop-blur-sm text-gray-800 hover:border-blue-300/50 hover:shadow-lg hover:bg-white/40"
                  }`}
                >
                  {/* ... existing Google SVG ... */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.938,3.042l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,12,24,12c3.059,0,5.842,1.154,7.938,3.042l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.859,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.193l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.541,5.036C9.782,39.556,16.413,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.104,5.591c0.001-0.001,0.001-0.001,0.002-0.001l6.19,5.238C36.95,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                  {googleLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Connecting...
                    </div>
                  ) : (
                    `Continue with Google`
                  )}
                </button>

                {/* Terms and Privacy */}
                <p className="mt-6 text-xs text-gray-700 text-center leading-relaxed">
                  By continuing, you agree to our{" "}
                  <Link to="#" className="text-blue-700 hover:underline font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-blue-700 hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
