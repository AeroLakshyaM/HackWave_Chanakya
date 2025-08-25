"use client"

import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Loader2,
  AlertTriangle,
  Target,
  TrendingUp,
  Clock,
  Download,
  Share2,
  Plus,
  BarChart3,
} from "lucide-react"

// Mock questionnaire data
const mockQuestionnaires = [
  {
    id: "1",
    title: "Digital Marketing Assessment",
    description: "Evaluate your online presence, SEO, and digital marketing strategies",
    category: "marketing",
    questions: [
      {
        id: "q1",
        question: "Do you have a comprehensive SEO strategy in place?",
        type: "boolean",
        weight: 1,
        category: "seo",
      },
      {
        id: "q2",
        question: "Are you actively monitoring your website analytics?",
        type: "boolean",
        weight: 1,
        category: "analytics",
      },
      {
        id: "q3",
        question: "Do you have a content marketing calendar?",
        type: "boolean",
        weight: 1,
        category: "content",
      },
      {
        id: "q4",
        question: "Are you using social media for business growth?",
        type: "boolean",
        weight: 1,
        category: "social_media",
      },
      {
        id: "q5",
        question: "Do you have email marketing automation set up?",
        type: "boolean",
        weight: 1,
        category: "email_marketing",
      },
    ],
  },
  {
    id: "2",
    title: "Operations & Process Assessment",
    description: "Analyze your business operations, workflows, and process efficiency",
    category: "operations",
    questions: [
      {
        id: "q6",
        question: "Do you have documented standard operating procedures?",
        type: "boolean",
        weight: 1,
        category: "documentation",
      },
      {
        id: "q7",
        question: "Are your business processes automated where possible?",
        type: "boolean",
        weight: 1,
        category: "automation",
      },
      {
        id: "q8",
        question: "Do you regularly review and optimize your workflows?",
        type: "boolean",
        weight: 1,
        category: "optimization",
      },
      {
        id: "q9",
        question: "Is there clear communication between departments?",
        type: "boolean",
        weight: 1,
        category: "communication",
      },
      {
        id: "q10",
        question: "Do you have quality control measures in place?",
        type: "boolean",
        weight: 1,
        category: "quality_control",
      },
    ],
  },
  {
    id: "3",
    title: "Financial Management Assessment",
    description: "Review your financial planning, budgeting, and cash flow management",
    category: "finance",
    questions: [
      {
        id: "q11",
        question: "Do you have a detailed annual budget?",
        type: "boolean",
        weight: 1,
        category: "budgeting",
      },
      {
        id: "q12",
        question: "Are you tracking key financial metrics regularly?",
        type: "boolean",
        weight: 1,
        category: "metrics",
      },
      {
        id: "q13",
        question: "Do you have emergency cash reserves?",
        type: "boolean",
        weight: 1,
        category: "cash_flow",
      },
      {
        id: "q14",
        question: "Are you monitoring profit margins by product/service?",
        type: "boolean",
        weight: 1,
        category: "profitability",
      },
      {
        id: "q15",
        question: "Do you have financial forecasting in place?",
        type: "boolean",
        weight: 1,
        category: "forecasting",
      },
    ],
  },
]

export default function BlindSpotDetectorApp() {
  const [currentView, setCurrentView] = useState("home") // home, questionnaire-list, questionnaire, results
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState({})
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [completedAssessments, setCompletedAssessments] = useState([])

  // Generate mock analysis based on responses
  const generateAnalysis = (questionnaire, responses) => {
    const totalQuestions = questionnaire.questions.length
    const negativeResponses = Object.values(responses).filter((r) => r === false).length
    const riskScore = Math.round((negativeResponses / totalQuestions) * 100)

    const blindSpots = questionnaire.questions
      .filter((q) => responses[q.id] === false)
      .map((q) => ({
        title: `${q.category.replace("_", " ").toUpperCase()} Gap`,
        description: `Based on your response to "${q.question}", there appears to be a gap in your ${q.category.replace("_", " ")} strategy.`,
        risk_level: Math.min(90, 60 + Math.random() * 30),
        impact: `This could impact your business growth and competitive advantage in the ${q.category.replace("_", " ")} area.`,
        category: q.category,
      }))

    const recommendations = blindSpots.map((spot) => ({
      title: `Improve ${spot.category.replace("_", " ").toUpperCase()}`,
      description: `Develop and implement a comprehensive strategy to address the ${spot.category.replace("_", " ")} gap identified in your assessment.`,
      priority: spot.risk_level > 80 ? "high" : spot.risk_level > 60 ? "medium" : "low",
      estimated_effort: spot.risk_level > 80 ? "2-4 weeks" : "1-2 weeks",
    }))

    return {
      id: Date.now().toString(),
      questionnaire_title: questionnaire.title,
      category: questionnaire.category,
      blind_spots: blindSpots,
      recommendations: recommendations,
      risk_score: riskScore,
      priority_areas: [...new Set(blindSpots.map((bs) => bs.category))],
      analysis_summary:
        riskScore > 70
          ? "Your assessment reveals several critical areas that need immediate attention to prevent potential business risks."
          : riskScore > 40
            ? "Your business shows good fundamentals with some areas for improvement to optimize performance."
            : "Excellent! Your business demonstrates strong practices across most areas with minimal blind spots.",
      created_at: new Date().toISOString(),
    }
  }

  const handleQuestionnaireSelect = (questionnaire) => {
    setSelectedQuestionnaire(questionnaire)
    setCurrentQuestionIndex(0)
    setResponses({})
    setCurrentView("questionnaire")
  }

  const handleResponse = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const nextQuestion = () => {
    if (selectedQuestionnaire && currentQuestionIndex < selectedQuestionnaire.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const submitAssessment = async () => {
    if (!selectedQuestionnaire) return

    setIsAnalyzing(true)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const analysis = generateAnalysis(selectedQuestionnaire, responses)
    setAnalysisResult(analysis)
    setCompletedAssessments((prev) => [...prev, analysis])
    setCurrentView("results")
    setIsAnalyzing(false)
  }

  const getRiskColor = (riskLevel) => {
    if (riskLevel >= 80) return "text-red-600 bg-red-50 border-red-200"
    if (riskLevel >= 60) return "text-orange-600 bg-orange-50 border-orange-200"
    if (riskLevel >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-green-600 bg-green-50 border-green-200"
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  // Home View
  if (currentView === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative mx-auto max-w-7xl px-6 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6 animate-fade-in">Blind Spot Detector</h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Uncover hidden risks and missed opportunities in your business. Get AI-powered insights to identify
                blind spots before they become problems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  onClick={() => setCurrentView("questionnaire-list")}
                >
                  Start Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                {completedAssessments.length > 0 && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold transition-all duration-300 bg-transparent"
                    onClick={() => setCurrentView("dashboard")}
                  >
                    <BarChart3 className="mr-2 h-5 w-5" />
                    View Dashboard
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Blind Spots Matter</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Most business failures aren't caused by what you know you don't know, but by what you don't know you
                don't know.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl mb-3">Identify Hidden Risks</CardTitle>
                <CardDescription className="text-base">
                  Discover potential problems before they impact your business performance and growth.
                </CardDescription>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl mb-3">Get Actionable Insights</CardTitle>
                <CardDescription className="text-base">
                  Receive specific, prioritized recommendations to address your most critical gaps.
                </CardDescription>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-3">Accelerate Growth</CardTitle>
                <CardDescription className="text-base">
                  Turn blind spots into competitive advantages and unlock new opportunities.
                </CardDescription>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Uncover Your Blind Spots?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Take our comprehensive assessment and get personalized insights in minutes.
            </p>
            <Button
              size="lg"
              className="px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={() => setCurrentView("questionnaire-list")}
            >
              Start Your Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard View
  if (currentView === "dashboard") {
    const totalAssessments = completedAssessments.length
    const averageRiskScore =
      totalAssessments > 0
        ? Math.round(completedAssessments.reduce((sum, a) => sum + a.risk_score, 0) / totalAssessments)
        : 0
    const totalBlindSpots = completedAssessments.reduce((sum, a) => sum + a.blind_spots.length, 0)
    const totalRecommendations = completedAssessments.reduce((sum, a) => sum + a.recommendations.length, 0)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("home")}
                  className="text-xl font-bold text-gray-900"
                >
                  Blind Spot Detector
                </Button>
                <Badge variant="secondary">Dashboard</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600">Here's an overview of your business analysis journey.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssessments}</div>
                <p className="text-xs text-muted-foreground">Completed analyses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${averageRiskScore >= 70 ? "text-red-600" : averageRiskScore >= 40 ? "text-yellow-600" : "text-green-600"}`}
                >
                  {averageRiskScore}
                </div>
                <p className="text-xs text-muted-foreground">Out of 100</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blind Spots Found</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{totalBlindSpots}</div>
                <p className="text-xs text-muted-foreground">Areas to improve</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalRecommendations}</div>
                <p className="text-xs text-muted-foreground">Action items</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Assessments</CardTitle>
                <Button size="sm" onClick={() => setCurrentView("questionnaire-list")}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {completedAssessments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No assessments yet</p>
                  <Button onClick={() => setCurrentView("questionnaire-list")}>Take Your First Assessment</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedAssessments.slice(0, 5).map((assessment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{assessment.questionnaire_title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {assessment.category.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(assessment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${assessment.risk_score >= 70 ? "text-red-600" : assessment.risk_score >= 40 ? "text-yellow-600" : "text-green-600"}`}
                          >
                            {assessment.risk_score}
                          </div>
                          <div className="text-xs text-gray-500">Risk Score</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAnalysisResult(assessment)
                            setCurrentView("results")
                          }}
                        >
                          View Results
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Questionnaire List View
  if (currentView === "questionnaire-list") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("home")}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Assessment</h1>
            <p className="text-lg text-gray-600">Select the area you'd like to analyze for potential blind spots</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockQuestionnaires.map((questionnaire) => (
              <Card
                key={questionnaire.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 transform hover:-translate-y-1"
                onClick={() => handleQuestionnaireSelect(questionnaire)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="mb-2">
                      {questionnaire.category.toUpperCase()}
                    </Badge>
                    <Circle className="h-5 w-5 text-gray-400" />
                  </div>
                  <CardTitle className="text-xl">{questionnaire.title}</CardTitle>
                  <CardDescription className="text-base">{questionnaire.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{questionnaire.questions.length} questions</span>
                    <Button variant="outline" size="sm">
                      Start Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Questionnaire Form View
  if (currentView === "questionnaire" && selectedQuestionnaire) {
    const currentQuestion = selectedQuestionnaire.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / selectedQuestionnaire.questions.length) * 100
    const isLastQuestion = currentQuestionIndex === selectedQuestionnaire.questions.length - 1
    const currentResponse = responses[currentQuestion.id]

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="mx-auto max-w-3xl px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <Button variant="ghost" onClick={() => setCurrentView("questionnaire-list")} className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>

            <Badge variant="secondary" className="mb-4">
              {selectedQuestionnaire.category.toUpperCase()}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedQuestionnaire.title}</h1>
            <p className="text-gray-600 mb-6">{selectedQuestionnaire.description}</p>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Question {currentQuestionIndex + 1} of {selectedQuestionnaire.questions.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-8 border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
              <CardDescription>Category: {currentQuestion.category.replace("_", " ").toUpperCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={currentResponse?.toString() || ""}
                onValueChange={(value) => handleResponse(currentQuestion.id, value === "true")}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-green-50 transition-colors">
                  <RadioGroupItem value="true" id="yes" />
                  <Label htmlFor="yes" className="flex-1 cursor-pointer text-base">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      Yes, we have this covered
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-red-50 transition-colors">
                  <RadioGroupItem value="false" id="no" />
                  <Label htmlFor="no" className="flex-1 cursor-pointer text-base">
                    <div className="flex items-center">
                      <Circle className="h-5 w-5 text-red-600 mr-2" />
                      No, this is a gap for us
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={submitAssessment}
                disabled={currentResponse === undefined || isAnalyzing}
                size="lg"
                className="px-8"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Complete Assessment
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={nextQuestion} disabled={currentResponse === undefined} size="lg">
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Question indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {selectedQuestionnaire.questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index < currentQuestionIndex
                    ? "bg-green-500"
                    : index === currentQuestionIndex
                      ? "bg-blue-500"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Results View
  if (currentView === "results" && analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("questionnaire-list")}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {analysisResult.category.toUpperCase()}
                </Badge>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Analysis Results</h1>
                <p className="text-lg text-gray-600">{analysisResult.questionnaire_title}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Overall Risk Score */}
          <Card className="mb-8 border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                Overall Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">{analysisResult.risk_score}</div>
                  <div className="text-sm text-gray-600">Risk Score</div>
                </div>
                <div className="flex-1">
                  <Progress value={analysisResult.risk_score} className="h-3 mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Low Risk</span>
                    <span>High Risk</span>
                  </div>
                </div>
              </div>

              <Alert className="mb-4">
                <AlertDescription className="text-base">{analysisResult.analysis_summary}</AlertDescription>
              </Alert>

              {analysisResult.priority_areas.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Priority Areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.priority_areas.map((area, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {area.replace("_", " ").toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Blind Spots */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                Identified Blind Spots
              </h2>

              <div className="space-y-4">
                {analysisResult.blind_spots.map((blindSpot, index) => (
                  <Card key={index} className={`border-2 ${getRiskColor(blindSpot.risk_level)}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{blindSpot.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {blindSpot.category.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{Math.round(blindSpot.risk_level)}</div>
                          <div className="text-xs text-gray-600">Risk Level</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">{blindSpot.description}</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="font-medium text-sm mb-1">Potential Impact:</h5>
                        <p className="text-sm text-gray-600">{blindSpot.impact}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="h-6 w-6 text-green-600" />
                Actionable Recommendations
              </h2>

              <div className="space-y-4">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <Card key={index} className="border-2 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg flex-1">{recommendation.title}</CardTitle>
                        <Badge className={`${getPriorityColor(recommendation.priority)} flex items-center gap-1`}>
                          {getPriorityIcon(recommendation.priority)}
                          {recommendation.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">{recommendation.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Estimated effort: {recommendation.estimated_effort}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl">Next Steps</CardTitle>
              <CardDescription>Ready to address these blind spots?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setCurrentView("questionnaire-list")}
                >
                  Take Another Assessment
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setCurrentView("dashboard")}>
                  View Dashboard
                </Button>
                <Button className="flex-1">Schedule Consultation</Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Details */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Analysis completed on {new Date(analysisResult.created_at).toLocaleDateString()} at{" "}
              {new Date(analysisResult.created_at).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
