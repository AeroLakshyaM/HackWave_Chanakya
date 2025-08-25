

"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { RocketLaunchIcon, BuildingOfficeIcon, CheckCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import { account, database } from "../config/Appwrite"
import { ID, Query } from "appwrite"

// This background component remains the same
const FloatingElement = ({ delay = 0, size = "medium", initialX = 0, initialY = 0 }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const [direction, setDirection] = useState({ x: 1, y: 1 })

  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-20 h-20",
    large: "w-32 h-32",
  }

  useEffect(() => {
    const moveElement = () => {
      setPosition((prev) => {
        let newX = prev.x + direction.x * (Math.random() * 0.5 + 0.2)
        let newY = prev.y + direction.y * (Math.random() * 0.5 + 0.2)

        if (newX <= 0 || newX >= window.innerWidth - 128) {
          setDirection((prevDir) => ({ ...prevDir, x: -prevDir.x }))
        }
        if (newY <= 0 || newY >= window.innerHeight - 128) {
          setDirection((prevDir) => ({ ...prevDir, y: -prevDir.y }))
        }
        return { x: newX, y: newY }
      })
    }
    const interval = setInterval(moveElement, 50)
    return () => clearInterval(interval)
  }, [direction])

  return (
    <div
      className={`absolute ${sizeClasses[size]} bg-blue-400/20 rounded-full blur-sm animate-pulse`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        animationDelay: `${delay}ms`,
        transition: "all 0.1s linear",
      }}
    />
  )
}

const startupQuestions = [
  { id: 1, name: "startupName", text: "What is your startup's name?", type: "text", placeholder: "e.g., Innovate Inc." },
  { id: 2, name: "productIdea", text: "Briefly describe your product idea.", type: "textarea", placeholder: "Describe the core concept and value..." },
  { id: 3, name: "teamSize", text: "What is the current size of your team?", type: "number", placeholder: "e.g., 5" },
  { id: 4, name: "primaryGoal", text: "What is your primary goal for the next 6 months?", type: "textarea", placeholder: "e.g., Launch MVP, acquire first 100 users..." },
  { id: 5, name: "mainChallenge", text: "What is the main challenge you are trying to solve?", type: "textarea", placeholder: "e.g., Streamlining our workflow..." },
  { id: 6, name: "targetAudience", text: "Who are you solving this problem for?", type: "textarea", placeholder: "e.g., Freelance Graphic Designers, Local Business Owners, etc." },
  { id: 7, name: "uniqueness", text: "What makes your solution unique?", type: "textarea", placeholder: "e.g., Unlike others, we focus on hyper-local content suggestions." },
  { id: 8, name: "feature", text: "How does this unique feature actually work?", type: "textarea", placeholder: "e.g., We use a combination of geo-location data and local event APIs to generate relevant content." },
  { id: 9, name: "competition", text: "What is your defense against a larger competitor adding this feature?", type: "textarea", placeholder: "e.g., We have exclusive partnerships with local business directories" },
  { id: 10, name: "websiteLink", text: "What is your domain or website? If not available, please provide a link to your LinkedIn profile.", type: "text", placeholder: "e.g., https://yourstartup.com or https://linkedin.com/in/yourprofile" }
]

const establishedQuestions = [
  { id: 1, name: "companyName", text: "What is your company's name?", type: "text", placeholder: "e.g., Global Corp" },
  { id: 2, name: "yourRole", text: "What is your role in the company?", type: "text", placeholder: "e.g., Product Manager" },
  { id: 3, name: "employeeCount", text: "How many employees will be using this account?", type: "number", placeholder: "e.g., 25" },
  { id: 4, name: "mainChallenge", text: "What is the main challenge you are trying to solve?", type: "textarea", placeholder: "e.g., Streamlining our workflow..." },
  { id: 5, name: "primaryProduct", text: "What is your primary product or service?", type: "textarea", placeholder: "e.g., A subscription-based project management software." },
  { id: 6, name: "userBase", text: "Who are your primary customers?", type: "textarea", placeholder: "e.g., Mid-sized tech companies, marketing agencies." },
  { id: 7, name: "productGoal", text: "What is the main goal for your product right now?", type: "textarea", placeholder: "e.g., Increase user retention, launch new features, expand to new markets." },
  { id: 8, name: "biggestChallenge", text: "What is the biggest challenge your product is facing?", type: "textarea", placeholder: "e.g., High user churn after the first month, difficulty competing with a new feature from a rival." },
  { id: 9, name: "websiteLink", text: "What is your domain or website? If not available, please provide a link to your LinkedIn profile.", type: "text", placeholder: "e.g., https://yourcompany.com or https://linkedin.com/in/yourprofile" }
]

// The main page component now uses React Router navigation
const StartupOrNotPage = () => {
  const [selectedCard, setSelectedCard] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  
  const questions = selectedCard === "startup" ? startupQuestions : establishedQuestions

  // Check if user is authenticated and has a profile
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        console.log("StartupOrNotPage: Checking authentication...");
        const currentUser = await account.get()
        console.log("StartupOrNotPage: User authenticated:", currentUser)
        setUser(currentUser)
        
        // Check if user already has a profile
        try {
          console.log("StartupOrNotPage: Checking for existing profile...");
          const existingProfiles = await database.listDocuments(
            "68a80162002e7f4da4d7", // Database ID
            "user_profiles", // Collection ID
            [
              // Query for user's profile
              Query.equal('userId', currentUser.$id)
            ]
          )
          
          console.log("StartupOrNotPage: Existing profiles found:", existingProfiles.documents.length);
          
          if (existingProfiles.documents.length > 0) {
            console.log("StartupOrNotPage: User already has a profile, redirecting to dashboard")
            navigate("/dashboard")
            return
          } else {
            console.log("StartupOrNotPage: No existing profile, user can continue")
          }
        } catch (profileError) {
          console.log("StartupOrNotPage: Error checking profile:", profileError)
          console.log("StartupOrNotPage: No existing profile found, user can continue")
        }
        
      } catch (error) {
        console.log("StartupOrNotPage: User not authenticated:", error)
        console.log("StartupOrNotPage: Redirecting to login")
        navigate("/auth")
        return
      }
    }
    
    checkAuthAndProfile()
  }, [navigate])

  const handleCardSelect = (type) => {
    setSelectedCard(type)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAnswers(prev => ({ ...prev, [name]: value }))
  }

  // Save user profile data to Appwrite
  const saveUserProfile = async (profileData) => {
    try {
      setLoading(true)
      
      // Validate required fields (website link is optional)
      const requiredFields = profileData.userType === 'startup' 
        ? ['startupName', 'productIdea', 'teamSize', 'primaryGoal', 'mainChallenge', 'targetAudience', 'uniqueness', 'feature', 'competition']
        : ['companyName', 'yourRole', 'employeeCount', 'mainChallenge', 'primaryProduct', 'userBase', 'productGoal', 'biggestChallenge']
      
      const missingFields = requiredFields.filter(field => !profileData[field] || !profileData[field].trim())
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }
      
      // Format website link if provided
      let formattedWebsiteLink = profileData.websiteLink
      if (formattedWebsiteLink && formattedWebsiteLink.trim()) {
        formattedWebsiteLink = formattedWebsiteLink.trim()
        // Add https:// if not present (except for LinkedIn)
        if (!formattedWebsiteLink.startsWith('http') && !formattedWebsiteLink.includes('linkedin.com')) {
          formattedWebsiteLink = `https://${formattedWebsiteLink}`
        }
      }
      
      // Prepare the profile data with Boolean attributes
      const profilePayload = {
        userId: user.$id,
        userEmail: user.email,
        userName: user.name,
        userType: profileData.userType,
        websiteLink: formattedWebsiteLink || '',
        // Boolean attributes based on user type
        startupProfile: profileData.userType === 'startup',
        establlishedProfile: profileData.userType === 'established',
        // Store raw data as backup
        rawProfileData: JSON.stringify(profileData),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      console.log("Saving profile data:", profilePayload)
      
      // Create user profile document in Appwrite
      const profileDocument = await database.createDocument(
        "68a80162002e7f4da4d7", // Database ID
        "user_profiles", // Collection ID
        ID.unique(),
        profilePayload
      )
      
      console.log("Profile saved successfully:", profileDocument)
      return profileDocument
      
    } catch (error) {
      console.error("Error saving profile:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Show summary step
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const finalAnswers = { ...answers, userType: selectedCard }
      console.log("Final Answers:", finalAnswers)
      
      // Save profile to Appwrite
      await saveUserProfile(finalAnswers)
      
      // Show success message
      alert("Profile created successfully! Redirecting to dashboard...")
      
      // Navigate to dashboard after successful profile creation
      navigate('/dashboard')
    } catch (error) {
      console.error("Failed to save profile:", error)
      setError("Failed to save your profile. Please try again.")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    } else {
      setSelectedCard(null)
      setAnswers({})
    }
  }

  const currentQuestion = questions[currentStep]
  
  // Enhanced validation for different field types
  const validateCurrentField = () => {
    if (!currentQuestion) return false
    
    const value = answers[currentQuestion.name]
    if (!value || !value.trim()) return false
    
    // Additional validation for specific fields
    if (currentQuestion.name === 'teamSize' || currentQuestion.name === 'employeeCount') {
      const numValue = parseInt(value)
      return !isNaN(numValue) && numValue > 0
    }
    
    if (currentQuestion.name === 'websiteLink') {
      // Enhanced URL validation
      const trimmedValue = value.trim()
      
      // Allow LinkedIn profiles
      if (trimmedValue.includes('linkedin.com')) return true
      
      // Allow empty values (optional field)
      if (!trimmedValue) return true
      
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
      return urlPattern.test(trimmedValue)
    }
    
    return true
  }
  
  const isNextDisabled = !validateCurrentField()

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile setup...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we verify your account</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
      <FloatingElement delay={0} size="large" initialX={100} initialY={200} />
      <FloatingElement delay={500} size="medium" initialX={typeof window !== 'undefined' ? window.innerWidth - 200 : 800} initialY={100} />
      <FloatingElement delay={1000} size="small" initialX={500} initialY={typeof window !== 'undefined' ? window.innerHeight - 150 : 600} />
      <FloatingElement delay={1500} size="medium" initialX={typeof window !== 'undefined' ? window.innerWidth - 400 : 600} initialY={typeof window !== 'undefined' ? window.innerHeight - 250 : 500} />

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 max-w-2xl w-full relative z-10 transition-all duration-500 hover:bg-white/15">
        
        {!selectedCard ? (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
              <p className="text-gray-700">Tell us about your business to personalize your experience.</p>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="relative cursor-pointer transition-all duration-300 transform hover:scale-105"
                onClick={() => handleCardSelect("startup")}
              >
                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 text-center h-full shadow-xl hover:shadow-2xl hover:border-blue-200/40 hover:bg-white/25 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-100/60 text-blue-600 border border-blue-200/50">
                    <RocketLaunchIcon className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Startup</h2>
                  <p className="text-gray-700 text-sm leading-relaxed">Develop your business or startup idea</p>
                </div>
              </div>
              <div
                className="relative cursor-pointer transition-all duration-300 transform hover:scale-105"
                onClick={() => handleCardSelect("established")}
              >
                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 text-center h-full shadow-xl hover:shadow-2xl hover:border-blue-200/40 hover:bg-white/25 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-100/60 text-blue-600 border border-blue-200/50">
                    <BuildingOfficeIcon className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Established Company</h2>
                  <p className="text-gray-700 text-sm leading-relaxed">Manage your account with colleagues</p>
                </div>
              </div>
            </div>
          </div>
        ) : currentStep === questions.length ? (
          // Summary Step
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Your Profile</h2>
              <p className="text-gray-600">Please review your answers before saving to Appwrite</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-8 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                {selectedCard === 'startup' ? 'Startup Profile' : 'Company Profile'}
              </h3>
              
              {/* Website Link Display */}
              {answers.websiteLink && (
                <div className="mb-6 p-4 bg-blue-50/50 border border-blue-200/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 2 2 0 001.414 2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 2 2 0 00-2.828 0l-3 3a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828-2.828z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-blue-800">Website/LinkedIn</span>
                  </div>
                  <div className="text-blue-700 break-all">
                    {answers.websiteLink}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {Object.entries(answers).filter(([key]) => key !== 'websiteLink').map(([key, value]) => (
                  <div key={key} className="border-b border-white/20 pb-3 last:border-b-0">
                    <div className="font-medium text-gray-700 capitalize mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </div>
                    <div className="text-gray-600 text-sm">
                      {typeof value === 'string' && value.length > 100 
                        ? `${value.substring(0, 100)}...` 
                        : value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border bg-white/30 text-gray-700 hover:bg-white/50 hover:scale-105 border-white/40 flex items-center space-x-2 hover:shadow-lg"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                  !loading
                    ? "bg-gradient-to-r from-green-500/90 to-green-600/90 text-white hover:from-green-600/90 hover:to-green-700/90 hover:scale-105 shadow-xl border-green-400/50 hover:shadow-2xl"
                    : "bg-gray-300/30 text-gray-500 cursor-not-allowed border-gray-300/30"
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving to Appwrite...</span>
                  </div>
                ) : (
                  <span className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Save Profile
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          // Question Step
          <div className="animate-fade-in-up">
            <div className="mb-6">
                <div className="w-full bg-white/30 backdrop-blur-sm rounded-full h-3 mb-4 overflow-hidden border border-white/20">
                    <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-lg" 
                        style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xl font-semibold text-gray-800" htmlFor={currentQuestion.name}>
                        {currentQuestion.text}
                    </label>
                    <span className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">
                        {currentStep + 1} of {questions.length}
                    </span>
                </div>
                {currentQuestion.placeholder && (
                    <p className="text-sm text-gray-600 mb-4 italic">
                        💡 {currentQuestion.placeholder}
                    </p>
                )}
            </div>
            
            <div className="mb-8">
                {currentQuestion.type === 'textarea' ? (
                    <textarea
                        id={currentQuestion.name}
                        name={currentQuestion.name}
                        value={answers[currentQuestion.name] || ''}
                        onChange={handleInputChange}
                        placeholder={currentQuestion.placeholder}
                        rows="4"
                        className="w-full p-4 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/50 focus:outline-none transition-all duration-300 placeholder-gray-500/70"
                    />
                ) : (
                    <input
                        id={currentQuestion.name}
                        name={currentQuestion.name}
                        type={currentQuestion.type}
                        value={answers[currentQuestion.name] || ''}
                        onChange={handleInputChange}
                        placeholder={currentQuestion.placeholder}
                        className="w-full p-4 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/50 focus:outline-none transition-all duration-300 placeholder-gray-500/70"
                    />
                )}
            </div>
            
            <div className="flex justify-between items-center">
                <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border bg-white/30 text-gray-700 hover:bg-white/50 hover:scale-105 border-white/40 flex items-center space-x-2 hover:shadow-lg"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Back</span>
                </button>
                <button
                    onClick={handleNext}
                    disabled={isNextDisabled || loading}
                    className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                        !isNextDisabled && !loading
                        ? "bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white hover:from-blue-600/90 hover:to-blue-700/90 hover:scale-105 shadow-xl border-blue-400/50 hover:shadow-2xl"
                        : "bg-gray-300/30 text-gray-500 cursor-not-allowed border-gray-300/30"
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                        </div>
                    ) : (
                        "Next"
                    )}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StartupOrNotPage;
