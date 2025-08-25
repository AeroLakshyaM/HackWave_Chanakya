"use client"

import { useState, useEffect } from "react"
import { Users, Clock, MessageCircle, Send } from "lucide-react"

// Simple Button component
const Button = ({ children, onClick, size = "md", className = "", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      size === "lg" ? "px-6 py-3 text-lg" : "px-4 py-2"
    } ${className} ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
    }`}
  >
    {children}
  </button>
)

// Simple Badge component
const Badge = ({ children, variant = "default", className = "" }) => (
  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
    variant === "destructive" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
  } ${className}`}>
    {children}
  </div>
)

// Simple Card component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
    {children}
  </div>
)

// Simple Avatar component
const Avatar = ({ children, className = "" }) => (
  <div className={`inline-flex items-center justify-center rounded-full ${className}`}>
    {children}
  </div>
)

// Simple AvatarFallback component
const AvatarFallback = ({ children, className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    {children}
  </div>
)

const AI_BOTS = [
  {
    id: "strategist",
    name: "Alex Strategy",
    expertise: "Business Strategy",
    personality:
      "Analytical and forward-thinking strategist who focuses on long-term planning and competitive analysis",
    color: "bg-blue-600",
    position: { top: "10%", left: "50%" },
    keywords: ["strategy", "business", "plan", "growth", "market", "competitive", "roadmap", "vision"],
  },
  {
    id: "creative",
    name: "Maya Creative",
    expertise: "Creative Design",
    personality: "Innovative and artistic designer who brings fresh perspectives and visual solutions",
    color: "bg-black",
    position: { top: "30%", left: "80%" },
    keywords: ["design", "creative", "art", "visual", "brand", "aesthetic", "innovation", "concept"],
  },
  {
    id: "tech",
    name: "Sam Tech",
    expertise: "Technology",
    personality: "Logical and solution-oriented developer who focuses on technical implementation and scalability",
    color: "bg-blue-600",
    position: { top: "70%", left: "80%" },
    keywords: ["tech", "code", "development", "software", "system", "digital", "architecture", "programming"],
  },
  {
    id: "marketing",
    name: "Jordan Marketing",
    expertise: "Marketing",
    personality: "Persuasive and data-driven marketer who understands audience behavior and campaign optimization",
    color: "bg-black",
    position: { top: "90%", left: "50%" },
    keywords: ["marketing", "campaign", "audience", "brand", "promotion", "social", "engagement", "conversion"],
  },
  {
    id: "finance",
    name: "Riley Finance",
    expertise: "Finance",
    personality: "Precise and risk-aware financial analyst who focuses on ROI and budget optimization",
    color: "bg-blue-600",
    position: { top: "70%", left: "20%" },
    keywords: ["finance", "budget", "cost", "revenue", "investment", "profit", "ROI", "financial"],
  },
  {
    id: "hr",
    name: "Casey HR",
    expertise: "Human Resources",
    personality: "Empathetic and people-focused HR specialist who prioritizes team culture and talent development",
    color: "bg-black",
    position: { top: "30%", left: "20%" },
    keywords: ["team", "people", "culture", "hiring", "employee", "talent", "management", "development"],
  },
]

export default function MeetingRoom() {
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [selectedBot, setSelectedBot] = useState(null)
  const [userInput, setUserInput] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [meetingStarted, setMeetingStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (!meetingStarted || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [meetingStarted, timeLeft])

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const generateBotResponseWithGemini = async (bot, userMessage) => {
    const hasKeyword = bot.keywords.some((keyword) => userMessage.toLowerCase().includes(keyword.toLowerCase()))

    if (!hasKeyword && Math.random() > 0.3) return null // 30% chance to respond if no keywords

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          botPersonality: bot.personality,
          botExpertise: bot.expertise,
          botName: bot.name,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()
      return data.message
    } catch (error) {
      console.error("Error getting AI response:", error)
      // Fallback to simple responses if API fails
      return generateFallbackResponse(bot, userMessage)
    }
  }

  const generateFallbackResponse = (bot, userMessage) => {
    const responses = {
      strategist: [
        "From a strategic perspective, we should consider the long-term implications of this approach.",
        "Let's analyze the competitive landscape and market positioning for this initiative.",
        "I recommend developing a comprehensive roadmap with clear milestones and success metrics.",
      ],
      creative: [
        "What if we approached this from a completely different creative angle?",
        "The visual impact and brand storytelling potential here could be significant.",
        "Let me conceptualize some innovative design solutions for this challenge.",
      ],
      tech: [
        "We need to evaluate the technical feasibility and scalability requirements carefully.",
        "I can architect a robust solution that supports future growth and integration needs.",
        "The system design should prioritize performance, security, and maintainability.",
      ],
      marketing: [
        "How will this resonate with our target audience and drive engagement?",
        "We should implement A/B testing and analytics to optimize campaign performance.",
        "The messaging strategy needs to align with our brand voice and market positioning.",
      ],
      finance: [
        "What's the projected ROI and how does this fit within our budget constraints?",
        "We need to conduct a thorough cost-benefit analysis before proceeding.",
        "Let's review the financial implications and identify potential revenue opportunities.",
      ],
      hr: [
        "How will this impact team dynamics, morale, and overall productivity?",
        "We should consider the change management and training requirements for our people.",
        "Let's ensure we have the right talent and resources to execute this successfully.",
      ],
    }

    const botResponses = responses[bot.id] || [
      "That's an interesting perspective to explore further.",
    ]
    return botResponses[Math.floor(Math.random() * botResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!userInput.trim() || !meetingStarted) return

    setIsLoading(true)

    // Generate responses from relevant bots using Gemini API
    const responsePromises = AI_BOTS.map(async (bot) => {
      const response = await generateBotResponseWithGemini(bot, userInput)
      if (response) {
        return {
          bot,
          response,
          delay: Math.random() * 2000 + 500, // Random delay between 0.5-2.5 seconds
        }
      }
      return null
    })

    const responses = await Promise.all(responsePromises)

    responses.forEach((responseData) => {
      if (responseData) {
        setTimeout(() => {
          const newMessage = {
            id: Date.now().toString() + responseData.bot.id,
            botId: responseData.bot.id,
            botName: responseData.bot.name,
            message: responseData.response,
            timestamp: new Date(),
          }
          setChatMessages((prev) => [...prev, newMessage])
        }, responseData.delay)
      }
    })

    setUserInput("")
    setIsLoading(false)
  }

  const startMeeting = () => {
    setMeetingStarted(true)
    setChatMessages([
      {
        id: "welcome",
        botId: "system",
        botName: "Meeting Assistant",
        message:
          "Welcome to your AI meeting room! Share your thoughts and our expert AI team will provide insights from their respective fields.",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="h-full bg-gray-50 flex">
      {/* Main Meeting Room - Left Side */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Header with Timer */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Meeting Room</h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={timeLeft > 300 ? "default" : "destructive"} className="text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(timeLeft)}
            </Badge>
            {!meetingStarted && (
              <Button onClick={startMeeting} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Meeting
              </Button>
            )}
          </div>
        </div>

        {/* Round Table Interface */}
        <div className="flex-1 relative">
          <Card className="w-full h-full relative overflow-hidden bg-white border-2 border-gray-200">
            {/* Central Table */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-64 rounded-full bg-blue-100 border-4 border-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-900 font-medium">AI Collaboration</p>
                  <p className="text-xs text-gray-600">Hub</p>
                </div>
              </div>
            </div>

            {/* AI Bot Avatars around the table */}
            {AI_BOTS.map((bot) => (
              <div
                key={bot.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
                style={{ top: bot.position.top, left: bot.position.left }}
                onClick={() => setSelectedBot(selectedBot === bot.id ? null : bot.id)}
              >
                <div className={`relative ${selectedBot === bot.id ? "ring-4 ring-blue-500 rounded-full" : ""}`}>
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                    <AvatarFallback className={`${bot.color} text-white font-bold text-lg`}>
                      {bot.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {meetingStarted && (
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </div>

                {/* Bot Info Tooltip */}
                {selectedBot === bot.id && (
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 rounded-lg p-3 shadow-lg min-w-48 z-10">
                    <h3 className="font-semibold text-sm text-gray-900">{bot.name}</h3>
                    <p className="text-xs text-blue-600 font-medium">{bot.expertise}</p>
                    <p className="text-xs text-gray-600 mt-1">{bot.personality}</p>
                  </div>
                )}
              </div>
            ))}
          </Card>
        </div>

        {meetingStarted && (
          <div className="mt-6 flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              placeholder="Share your thoughts with the AI team..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Chat Sidebar - Right Side */}
      <div className="w-96 bg-gray-100 border-l-2 border-gray-200 flex flex-col">
        <div className="p-4 border-b-2 border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Meeting Chat</h2>
          <p className="text-sm text-gray-600">{chatMessages.length} messages</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div key={message.id} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-gray-900">{message.botName}</span>
                <span className="text-xs text-gray-500">
                  {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{message.message}</p>
            </div>
          ))}

          {chatMessages.length === 0 && meetingStarted && (
            <div className="text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="font-medium">Start the conversation!</p>
              <p className="text-xs">The AI bots will respond based on your message.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
