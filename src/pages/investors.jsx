"use client"

import { useState, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { ChevronDown, DollarSign, Users, Mail, Phone, Globe, Clock, MapPin, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";

const investors = [
  {
    id: "1",
    companyName: "TechVenture Capital",
    logo: "https://placehold.co/80x80/dbeafe/3b82f6?text=TVC",
    description:
      "Leading early-stage venture capital firm focused on transformative technology companies with global impact.",
    searchingFor: ["AI/ML startups", "SaaS platforms", "Fintech solutions"],
    investmentRange: "$500K - $5M",
    industries: ["Technology", "Healthcare", "Fintech"],
    stage: "Seed to Series A",
    location: "San Francisco, CA",
    portfolio: ["OpenAI", "Stripe", "Airbnb"],
    contactEmail: "investments@techventure.com",
    phoneNumber: "+1 (415) 555-0123",
    website: "www.techventure.com",
    foundedYear: "2015",
    totalFunds: "$250M",
    numberOfInvestments: "85+",
    applicationProcess: [
      "Submit pitch deck via email",
      "Initial screening call (30 mins)",
      "Partner presentation (1 hour)",
      "Due diligence process (2-4 weeks)",
      "Final investment committee decision",
    ],
    requirements: [
      "Minimum $1M ARR for Series A",
      "Strong technical team",
      "Scalable business model",
      "Clear market opportunity",
      "Defensible technology",
    ],
    timeline: "4-6 weeks from initial contact to term sheet",
    partnerName: "Sarah Chen",
    partnerTitle: "Managing Partner",
    linkedIn: "linkedin.com/in/sarahchen-vc",
    twitter: "@sarahchen_vc",
    fundSize: "$250M Fund III",
    investmentCriteria: ["B2B SaaS", "Enterprise AI", "Developer Tools"],
    geographicFocus: ["North America", "Europe"],
    averageInvestment: "$2.5M",
    followOnCapacity: "Up to $10M in follow-on rounds",
  },
  {
    id: "2",
    companyName: "Blue Ocean Partners",
    logo: "https://placehold.co/80x80/dbeafe/1e40af?text=BOP",
    description:
      "Strategic investment firm specializing in sustainable and innovative business models that create positive environmental impact.",
    searchingFor: ["Clean energy", "Sustainable tech", "B2B marketplaces"],
    investmentRange: "$1M - $10M",
    industries: ["Clean Energy", "E-commerce", "Manufacturing"],
    stage: "Series A to Series B",
    location: "New York, NY",
    portfolio: ["Tesla", "Beyond Meat", "Shopify"],
    contactEmail: "deals@blueocean.com",
    phoneNumber: "+1 (212) 555-0456",
    website: "www.blueoceanpartners.com",
    foundedYear: "2012",
    totalFunds: "$500M",
    numberOfInvestments: "120+",
    applicationProcess: [
      "Online application form",
      "Executive summary review",
      "Management team interview",
      "Market analysis and due diligence",
      "Investment committee approval",
    ],
    requirements: [
      "Proven revenue growth",
      "Sustainable business practices",
      "Experienced management team",
      "Clear ESG impact metrics",
      "Market leadership potential",
    ],
    timeline: "6-8 weeks from application to funding",
    partnerName: "Michael Rodriguez",
    partnerTitle: "Senior Partner",
    linkedIn: "linkedin.com/in/mrodriguez-impact",
    twitter: "@mrodriguez_vc",
    fundSize: "$500M Impact Fund II",
    investmentCriteria: ["ESG-focused", "Climate Tech", "Circular Economy"],
    geographicFocus: ["Global", "Emerging Markets"],
    averageInvestment: "$5M",
    followOnCapacity: "Up to $25M in growth rounds",
  },
  {
    id: "3",
    companyName: "Innovation Labs Fund",
    logo: "https://placehold.co/80x80/dbeafe/4338ca?text=ILF",
    description:
      "Corporate venture capital arm investing in breakthrough technologies and disruptive innovations that reshape industries.",
    searchingFor: ["Blockchain solutions", "IoT platforms", "Cybersecurity"],
    investmentRange: "$250K - $3M",
    industries: ["Blockchain", "IoT", "Cybersecurity"],
    stage: "Pre-seed to Seed",
    location: "Austin, TX",
    portfolio: ["Coinbase", "Ring", "CrowdStrike"],
    contactEmail: "funding@innovationlabs.com",
    phoneNumber: "+1 (512) 555-0789",
    website: "www.innovationlabs.com",
    foundedYear: "2018",
    totalFunds: "$150M",
    numberOfInvestments: "65+",
    applicationProcess: [
      "Pitch deck submission",
      "Technical review by experts",
      "Founder interview session",
      "Product demonstration",
      "Final investment decision",
    ],
    requirements: [
      "Innovative technology solution",
      "Strong technical founding team",
      "Early traction or pilot customers",
      "Intellectual property protection",
      "Scalable go-to-market strategy",
    ],
    timeline: "3-4 weeks from pitch to funding decision",
    partnerName: "Dr. Emily Watson",
    partnerTitle: "Investment Director",
    linkedIn: "linkedin.com/in/emilywatson-tech",
    twitter: "@ewatson_innovation",
    fundSize: "$150M Early Stage Fund",
    investmentCriteria: ["Deep Tech", "Enterprise Security", "Web3"],
    geographicFocus: ["US", "Canada"],
    averageInvestment: "$1.2M",
    followOnCapacity: "Up to $5M in subsequent rounds",
  },
  {
    id: "4",
    companyName: "Global Growth Ventures",
    logo: "https://placehold.co/80x80/dbeafe/0e7490?text=GGV",
    description:
      "International investment firm focused on scaling high-growth companies globally with strategic partnerships and market expansion.",
    searchingFor: ["EdTech platforms", "Healthcare innovation", "Mobile applications"],
    investmentRange: "$2M - $15M",
    industries: ["Education", "Healthcare", "Mobile"],
    stage: "Series A to Series C",
    location: "London, UK",
    portfolio: ["Coursera", "Teladoc", "Uber"],
    contactEmail: "investments@globalgrowth.com",
    phoneNumber: "+44 20 7555 0123",
    website: "www.globalgrowthventures.com",
    foundedYear: "2010",
    totalFunds: "$800M",
    numberOfInvestments: "200+",
    applicationProcess: [
      "Initial inquiry and NDA",
      "Comprehensive business plan review",
      "Multi-round management presentations",
      "Financial and legal due diligence",
      "Investment committee final approval",
    ],
    requirements: [
      "Proven international market potential",
      "Strong unit economics",
      "Experienced leadership team",
      "Clear competitive advantages",
      "Regulatory compliance readiness",
    ],
    timeline: "8-12 weeks from initial contact to closing",
    partnerName: "James Thompson",
    partnerTitle: "Managing Director",
    linkedIn: "linkedin.com/in/jamesthompson-ggv",
    twitter: "@jthompson_ggv",
    fundSize: "$800M Growth Fund IV",
    investmentCriteria: ["Global Scalability", "Market Leadership", "Digital Transformation"],
    geographicFocus: ["Europe", "Asia-Pacific", "North America"],
    averageInvestment: "$7.5M",
    followOnCapacity: "Up to $50M in growth capital",
  },
  {
    id: "5",
    companyName: "NextGen Capital",
    logo: "https://placehold.co/80x80/dbeafe/5b21b6?text=NGC",
    description:
      "Forward-thinking investment firm backing the next generation of technology leaders in emerging and frontier technologies.",
    searchingFor: ["AR/VR solutions", "Quantum computing", "Space technology"],
    investmentRange: "$1M - $8M",
    industries: ["AR/VR", "Quantum Computing", "Aerospace"],
    stage: "Seed to Series A",
    location: "Seattle, WA",
    portfolio: ["Meta", "SpaceX", "Palantir"],
    contactEmail: "hello@nextgencapital.com",
    phoneNumber: "+1 (206) 555-0456",
    website: "www.nextgencapital.com",
    foundedYear: "2016",
    totalFunds: "$300M",
    numberOfInvestments: "75+",
    applicationProcess: [
      "Technology assessment submission",
      "Founder background verification",
      "Technical advisory board review",
      "Market opportunity analysis",
      "Investment committee decision",
    ],
    requirements: [
      "Breakthrough technology innovation",
      "PhD-level technical expertise",
      "Clear path to commercialization",
      "Strong IP portfolio",
      "Visionary leadership team",
    ],
    timeline: "5-7 weeks from submission to term sheet",
    partnerName: "Dr. Alex Kim",
    partnerTitle: "Founding Partner",
    linkedIn: "linkedin.com/in/alexkim-nextgen",
    twitter: "@alexkim_future",
    fundSize: "$300M Frontier Tech Fund",
    investmentCriteria: ["Frontier Tech", "Deep Science", "Moonshot Projects"],
    geographicFocus: ["Silicon Valley", "Boston", "International"],
    averageInvestment: "$3.5M",
    followOnCapacity: "Up to $15M in follow-on investments",
  },
]

function Geometry({ type }) {
  switch (type) {
    case "sphere":
      return <sphereGeometry args={[1, 32, 32]} />
    case "torus":
      return <torusGeometry args={[1, 0.4, 16, 100]} />
    case "cylinder":
      return <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
    case "cone":
      return <coneGeometry args={[1, 2, 32]} />
    case "torusKnot":
      return <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />
    case "octahedron":
      return <octahedronGeometry args={[1]} />
    case "icosahedron":
      return <icosahedronGeometry args={[1]} />
    case "dodecahedron":
      return <dodecahedronGeometry args={[1]} />
    case "tetrahedron":
      return <tetrahedronGeometry args={[1]} />
    default:
      return <boxGeometry args={[1, 1, 1]} />
  }
}

function FloatingElements() {
  const meshRefs = useRef([])

  const elements = useMemo(
    () => [
      { type: "sphere", position: [-12, 6, -20], scale: 3.5, color: "#3b82f6", speed: 0.2 },
      { type: "torus", position: [10, -4, -15], scale: 2.8, color: "#1e40af", speed: 0.3 },
      { type: "cylinder", position: [-6, -8, -12], scale: 3.2, color: "#60a5fa", speed: 0.15 },
      { type: "cone", position: [14, 5, -25], scale: 3.0, color: "#2563eb", speed: 0.4 },
      { type: "sphere", position: [4, 10, -30], scale: 2.8, color: "#1d4ed8", speed: 0.25 },
      { type: "torusKnot", position: [-15, -3, -18], scale: 2.5, color: "#3730a3", speed: 0.2 },
      { type: "octahedron", position: [8, -12, -22], scale: 2.6, color: "#4f46e5", speed: 0.35 },
      { type: "icosahedron", position: [-4, 12, -28], scale: 2.4, color: "#6366f1", speed: 0.25 },
      { type: "dodecahedron", position: [12, -2, -35], scale: 3.9, color: "#5b21b6", speed: 0.3 },
      { type: "tetrahedron", position: [-10, 8, -32], scale: 2.7, color: "#7c3aed", speed: 0.28 },
      { type: "sphere", position: [18, 3, -40], scale: 4.0, color: "#2dd4bf", speed: 0.12 },
      { type: "torus", position: [-18, -6, -38], scale: 3.3, color: "#0891b2", speed: 0.18 },
      { type: "cylinder", position: [3, -15, -35], scale: 3.8, color: "#0284c7", speed: 0.22 },
      { type: "cone", position: [-12, 9, -45], scale: 3.4, color: "#0369a1", speed: 0.26 },
      { type: "icosahedron", position: [15, -8, -50], scale: 3.1, color: "#075985", speed: 0.32 },
    ],
    [],
  )

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    meshRefs.current.forEach((mesh, index) => {
      if (mesh) {
        const element = elements[index]
        const speed = element.speed
        const amplitude = 3 + index * 0.5

        // Enhanced rotation patterns
        mesh.rotation.x = time * speed * (index % 3 === 0 ? 1 : -1) * 0.6
        mesh.rotation.y = time * speed * 0.8 * (index % 2 === 0 ? 1 : -1)
        mesh.rotation.z = time * speed * 0.4

        // Complex movement patterns
        const radius = 4 + index * 0.6
        const figure8Factor = Math.sin(time * speed * 0.3 + index) * 0.8
        const spiralFactor = Math.cos(time * speed * 0.2 + index * 0.7) * 0.5

        mesh.position.x = element.position[0] + Math.cos(time * speed + index) * radius * 0.3 + figure8Factor
        mesh.position.y = element.position[1] + Math.sin(time * speed * 0.8 + index) * amplitude * 0.4 + spiralFactor
        mesh.position.z =
          element.position[2] + Math.sin(time * speed * 0.5 + index) * 3 + Math.cos(time * speed * 0.2) * 2

        // Enhanced pulsing effect
        const pulseScale = 1 + Math.sin(time * 1.2 + index) * 0.15 + Math.cos(time * 0.6 + index * 0.3) * 0.1
        mesh.scale.setScalar(element.scale * pulseScale)
      }
    })
  })

  return (
    <>
      {elements.map((element, index) => (
        <mesh
          key={index}
          ref={(el) => (meshRefs.current[index] = el)}
          position={element.position}
          castShadow
          receiveShadow
        >
          <Geometry type={element.type} />
          <meshStandardMaterial
            color={element.color}
            transparent
            opacity={0.3}
            wireframe={index % 5 === 0}
            metalness={0.8}
            roughness={0.1}
            emissive={element.color}
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
    </>
  )
}

function InvestorsThreeBackground() {
  return (
    <motion.div
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, ease: "easeInOut" }}
    >
      <Canvas
        camera={{ position: [0, 0, 25], fov: 60 }}
        style={{ background: "transparent" }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#f1f5f9", 30, 100]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[20, 20, 20]} intensity={1.5} color="#3b82f6" castShadow />
        <pointLight position={[-20, -20, -20]} intensity={1.0} color="#1e40af" />
        <pointLight position={[0, 20, 15]} intensity={0.8} color="#60a5fa" />
        <pointLight position={[15, -15, 10]} intensity={0.7} color="#2563eb" />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color="#ffffff" />
        <FloatingElements />
      </Canvas>
    </motion.div>
  )
}

export default function InvestorsPage() {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState(null)

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      <InvestorsThreeBackground />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={handleBackToDashboard}
          className="backdrop-blur-md bg-white/20 hover:bg-white/30 text-gray-800 border border-white/40 rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-light bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 bg-clip-text text-transparent mb-4">
            Investment Partners
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-lg font-light">
            Connect with leading investors. Click any card to explore detailed information.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-6">
          {investors.map((investor, index) => (
            <motion.div
              key={investor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group cursor-pointer"
              onClick={() => toggleCard(investor.id)}
            >
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 hover:border-white/30 overflow-hidden">
                {/* Minimal Card Content */}
                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden">
                        <img
                          src={investor.logo || "/placeholder.svg"}
                          alt={`${investor.companyName} logo`}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "https://placehold.co/48x48/dbeafe/3b82f6?text=VC"
                          }}
                        />
                      </div>

                      <div>
                        <h3 className="text-2xl font-medium text-slate-800 mb-1">{investor.companyName}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {investor.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {investor.investmentRange}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">{investor.totalFunds}</div>
                        <div className="text-xs text-slate-500">Total Fund</div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedCard === investor.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {investor.searchingFor.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50/50 backdrop-blur-sm text-blue-700 rounded-full text-xs font-medium border border-blue-100/50"
                      >
                        {item}
                      </span>
                    ))}
                    {investor.searchingFor.length > 3 && (
                      <span className="px-3 py-1 bg-slate-50/50 text-slate-600 rounded-full text-xs">
                        +{investor.searchingFor.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedCard === investor.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-white/20"
                    >
                      <div className="p-8 bg-white/5 backdrop-blur-sm">
                        <p className="text-slate-700 mb-8 text-lg leading-relaxed">{investor.description}</p>

                        <div className="grid lg:grid-cols-2 gap-8">
                          {/* Left Column */}
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-4 text-lg">Contact Information</h4>
                              <div className="space-y-3">
                                <a
                                  href={`mailto:${investor.contactEmail}`}
                                  className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/40"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Mail className="w-4 h-4" />
                                  {investor.contactEmail}
                                </a>
                                <a
                                  href={`tel:${investor.phoneNumber}`}
                                  className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/40"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Phone className="w-4 h-4" />
                                  {investor.phoneNumber}
                                </a>
                                <a
                                  href={`https://${investor.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/40"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Globe className="w-4 h-4" />
                                  {investor.website}
                                </a>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-slate-800 mb-4 text-lg">Investment Focus</h4>
                              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/30">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-slate-700">Stage:</span>
                                    <p className="text-slate-600 mt-1">{investor.stage}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-slate-700">Average:</span>
                                    <p className="text-slate-600 mt-1">{investor.averageInvestment}</p>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <span className="font-medium text-slate-700">Industries:</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {investor.industries.map((industry, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-blue-100/60 text-blue-700 rounded text-xs"
                                      >
                                        {industry}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-4 text-lg">Application Process</h4>
                              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/30">
                                <div className="space-y-3">
                                  {investor.applicationProcess.slice(0, 3).map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                      <div className="w-5 h-5 bg-blue-100/80 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                                        {idx + 1}
                                      </div>
                                      <p className="text-sm text-slate-600 flex-1">{step}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 p-3 bg-blue-50/40 rounded-lg border border-blue-100/50">
                                  <div className="flex items-center gap-2 text-sm text-blue-700">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">Timeline:</span> {investor.timeline}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-slate-800 mb-4 text-lg">Key Contact</h4>
                              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/30">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100/80 to-blue-200/80 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-800">{investor.partnerName}</p>
                                    <p className="text-sm text-slate-600">{investor.partnerTitle}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <a
                                    href={`https://${investor.linkedIn}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center py-2 px-3 bg-blue-600/80 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    LinkedIn
                                  </a>
                                  <a
                                    href={`https://twitter.com/${investor.twitter.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center py-2 px-3 bg-slate-600/80 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Twitter
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">
                          <h4 className="font-semibold text-slate-800 mb-4 text-lg">Notable Portfolio</h4>
                          <div className="flex flex-wrap gap-2">
                            {investor.portfolio.map((company, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-slate-100/60 text-slate-700 rounded-lg text-sm font-medium"
                              >
                                {company}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
