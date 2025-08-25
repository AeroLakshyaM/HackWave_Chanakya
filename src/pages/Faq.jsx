"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial } from "@react-three/drei"
import bgimg from '../assets/bgimgfaq.jpg'
// --- SVG Icons ---
const SignUpIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
)
const AnalysisIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.75 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
)
const RefinementIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226.55-.22 1.156-.22 1.706 0 .55.22 1.02.684 1.11 1.226l.094.542c.065.395.333.74.716.855l.542.162a2.25 2.25 0 0 1 1.884 2.025l.06.568a2.25 2.25 0 0 1-1.232 2.33l-.503.252a2.25 2.25 0 0 0-1.088 1.088l-.252.503a2.25 2.25 0 0 1-2.33 1.232l-.568-.06a2.25 2.25 0 0 0-2.025-1.884l-.162-.542a2.25 2.25 0 0 0-.855-.716l-.542-.094a2.25 2.25 0 0 1-1.226-1.11c-.22-.55-.22-1.156 0-1.706.22-.55.684-1.02 1.226-1.11l.542-.094a2.25 2.25 0 0 0 .716-.855l.094-.542m0 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)
const GrowthIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
    />
  </svg>
)
const ChevronDownIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
)
const HolisticIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25a2.25 2.25 0 0 0 2.25-2.25V18a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
)
const StrategyIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
)
const DataIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.097 16.556 17.95 12 17.95s-8.25-1.853-8.25-4.125v-3.75"
    />
  </svg>
)
// --- 3D Blob Components ---
const Blob3D = ({ isActive, isClicked, onClick }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      meshRef.current.rotation.y += 0.005

      if (isClicked) {
        meshRef.current.scale.setScalar(1.3 + Math.sin(state.clock.elapsedTime * 8) * 0.1)
      } else if (isActive) {
        meshRef.current.scale.setScalar(1.2)
      } else if (hovered) {
        meshRef.current.scale.setScalar(1.1)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  return (
    <Sphere
      ref={meshRef}
      args={[1, 64, 64]}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial
        // COLOR CHANGE: Using new brand colors for the 3D blob
        color={isActive ? "#00296b" : "#2196f3"}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.8}
      />
    </Sphere>
  )
}

const BlobIcon = ({ isActive, isClicked, size = "w-16 h-16", onClick }) => (
  <motion.div
    className={`relative ${size} cursor-pointer`}
    // COLOR CHANGE: Using a placeholder color as background, since blob is the main visual
    animate={{
      backgroundColor: isActive ? "#00296b" : "#2196f3",
    }}
    transition={{ duration: 0.3 }}
    style={{ borderRadius: "50%" }}
  >
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {/* COLOR CHANGE: PointLight color updated to match new theme */}
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#2196f3" />
      <Blob3D isActive={isActive} isClicked={isClicked} onClick={onClick} />
    </Canvas>
  </motion.div>
)

// --- Content for each section (No changes needed here) ---
const roadmapSteps = [
  {
    title: "1. Lay the Foundation",
    description:
      "Every great empire begins with a solid foundation. Onboard by defining your product's territory—your goals, target audience, and current standing.",
    icon: SignUpIcon,
  },
  {
    title: "2. Gather Intelligence",
    description:
      "Our council of specialized AI agents acts as your trusted advisors. They perform a 360-degree analysis of your product's domain, providing a complete strategic overview.",
    icon: AnalysisIcon,
  },
  {
    title: "3. Forge Your Strategy (Niti)",
    description:
      "True wisdom comes from seeing all angles. Debate product features and marketing tactics with our AI, which visualizes data-driven pros and cons to help you forge a resilient roadmap.",
    icon: RefinementIcon,
  },
  {
    title: "4. Expand Your Dominion",
    description:
      "With a clear strategy, it's time to grow. Utilize AI-generated marketing campaigns, connect with investors, and continuously monitor your product's health to scale your empire.",
    icon: GrowthIcon,
  },
]

const advantageItems = [
  {
    icon: HolisticIcon,
    title: "Holistic Analysis",
    description:
      "Inspired by Chanakya's 'Saptanga' theory, our AI examines the seven critical limbs of your product: leadership, team, user base, infrastructure, finances, execution, and partnerships.",
  },
  {
    icon: StrategyIcon,
    title: "Strategic Counsel",
    description:
      "Go beyond raw data. Our platform provides actionable 'Niti' (strategy), simulating debates between AI agents to give you a multi-faceted view of every critical decision.",
  },
  {
    icon: DataIcon,
    title: "Data as Your Treasury",
    description:
      "We help you treat data as your most valuable resource ('Kosa'). Uncover hidden insights and convert them into a treasure trove of opportunities for growth and optimization.",
  },
]

const faqItems = [
  {
    question: "Why the name 'Chanakya'?",
    answer:
      "Chanakya was an ancient strategist renowned for his wisdom in statecraft, economics, and strategy. Our platform is inspired by his holistic and foresighted approach, providing you with the strategic counsel needed to build and grow a successful product 'empire'.",
  },
  {
    question: "What kind of AI agents do you use?",
    answer:
      "We employ a multi-agent AI system where each agent is a specialist in a domain—like a financial advisor, a marketing guru, or a UI/UX critic. They collaborate to provide comprehensive and well-rounded recommendations.",
  },
  {
    question: "Can Chanakya help with fundraising?",
    answer:
      "Yes. The 'Grow & Scale' phase is designed to make your product investor-ready. We help you refine your pitch deck with data-driven projections and can connect you with a network of venture capitalists and angel investors.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. In the spirit of a well-guarded fortress, we prioritize data privacy and security. All your product information is encrypted with industry-leading protocols and stored securely.",
  },
]

const CurvedPath = ({ className }) => (
  <svg className={className} viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 200 Q200 50 400 200 T750 200"
      stroke="currentColor"
      strokeWidth="3"
      strokeDasharray="8,8"
      fill="none"
      // COLOR CHANGE: Faint path color updated
      className="text-[#2196f3]/20"
    />
  </svg>
)

export default function App() {
  const [activeStep, setActiveStep] = useState(0)
  const [openFAQ, setOpenFAQ] = useState(null)
  const [clickedStep, setClickedStep] = useState(null)

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  }
  const stepPositions = [
    { x: "6%", y: "50%" },
    { x: "25%", y: "12%" },
    { x: "50%", y: "50%" },
    { x: "75%", y: "12%" },
  ]

  const handleStepClick = (index) => {
    setActiveStep(index)
    setClickedStep(index)
    setTimeout(() => setClickedStep(null), 1500)
  }

  return (
    <div className="bg-white font-sans text-black antialiased">
      <div className="relative min-h-screen overflow-hidden">
        {/* COLOR CHANGE: Background blobs updated to new palette */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2196f3]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00296b]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#2196f3]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

        <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10">
          <motion.section
            className="text-center mb-20 sm:mb-24 relative overflow-hidden rounded-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <div className="absolute inset-0 z-0 -mx-4 sm:-mx-6 lg:-mx-8">
              <img
                src={bgimg}
                alt=""
                className="w-full h-full object-cover scale-150 opacity-40"
              />
            </div>

            {/* Content with higher z-index */}
            <div className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
              <motion.h1
                variants={itemVariants}
                // COLOR CHANGE: Gradient updated to start with the new brand color
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 tracking-tight leading-tight"
              >
                Give your chaotic startup idea a major glow-up. 
              </motion.h1>
              <motion.p variants={itemVariants} className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto font-medium">
                Chanakya is the AI bestie that turns your napkin-scratch 'what if' into a market-ready 'what is'.
              </motion.p>
            </div>
          </motion.section>

          <motion.section
            className="mb-20 sm:mb-32 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-black mb-4 tracking-tight"
            >
              How It Works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-700 max-w-3xl mx-auto mb-12 sm:mb-16">
              Follow our four-step path to transform your idea into a market-leading product, guided by timeless
              principles and modern AI.
            </motion.p>

            <div className="relative w-full max-w-6xl mx-auto">
              {/* Mobile Layout */}
              <div className="block md:hidden">
                <div className="relative flex flex-col items-center space-y-12">
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 transform -translate-x-1/2 opacity-30"></div>
                  {roadmapSteps.map((step, index) => {
                    const isActive = activeStep === index
                    return (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="relative flex flex-col items-center cursor-pointer group w-full max-w-sm"
                        onClick={() => handleStepClick(index)}
                      >
                        <div className="relative flex items-center justify-center z-10">
                          <BlobIcon
                            isActive={isActive}
                            isClicked={clickedStep === index}
                            onClick={() => handleStepClick(index)}
                          />
                          <step.icon className="absolute w-8 h-8 transition-colors duration-300 z-10 pointer-events-none text-white" />
                        </div>
                        <div className="mt-4 text-center">
                          {/* COLOR CHANGE: Active step text color updated */}
                          <h3
                            className={`font-semibold text-xl transition-colors duration-300 ${isActive ? "text-[#00296b]" : "text-black"}`}
                          >
                            {step.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2 px-4 leading-relaxed">{step.description}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
              {/* Desktop Layout */}
              <div className="hidden md:block">
                <div className="relative h-80 lg:h-96">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CurvedPath className="w-full h-full opacity-60" />
                  </div>
                  {roadmapSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="absolute cursor-pointer group"
                      style={{
                        left: stepPositions[index].x,
                        top: stepPositions[index].y,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => handleStepClick(index)}
                    >
                      <div className="relative flex items-center justify-center z-10">
                        <BlobIcon
                          isActive={activeStep === index}
                          isClicked={clickedStep === index}
                          size="w-20 h-20"
                          onClick={() => handleStepClick(index)}
                        />
                        <step.icon className="absolute w-10 h-10 transition-colors duration-300 z-10 pointer-events-none text-white" />
                      </div>
                      <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                        {/* COLOR CHANGE: Active and hover step text color updated */}
                        <h3
                          className={`font-semibold text-base lg:text-lg transition-colors duration-300 ${activeStep === index ? "text-[#00296b]" : "text-black group-hover:text-[#2196f3]"}`}
                        >
                          {step.title}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 text-center min-h-[100px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      className="max-w-2xl mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-700 text-lg leading-relaxed">{roadmapSteps[activeStep].description}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="mb-20 sm:mb-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-black text-center mb-4 tracking-tight"
            >
              The Chanakya Advantage
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12 sm:mb-16"
            >
              Our philosophy is built on three core pillars, inspired by ancient wisdom and powered by modern
              technology.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {advantageItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-50/80 p-6 rounded-xl border border-gray-100 text-center flex flex-col items-center"
                >
                  {/* COLOR CHANGE: Advantage icon background and text colors updated */}
                  <div className="bg-[#2196f3]/10 p-3 rounded-full mb-4">
                    <item.icon className="w-8 h-8 text-[#00296b]" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-black text-center mb-8 sm:mb-12 tracking-tight"
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = openFAQ === index
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    <AnimatePresence>
                      {/* COLOR CHANGE: FAQ active border updated */}
                      {isOpen && (
                        <motion.div
                          className="absolute inset-0 rounded-xl border-2 border-[#2196f3]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        ></motion.div>
                      )}
                    </AnimatePresence>
                    <div className="relative">
                      <header
                        className="flex justify-between items-center p-4 sm:p-6 cursor-pointer group"
                        onClick={() => setOpenFAQ(isOpen ? null : index)}
                      >
                        {/* COLOR CHANGE: FAQ hover text updated */}
                        <h3 className="text-base sm:text-lg font-semibold text-black group-hover:text-[#00296b] transition-colors pr-4">
                          {item.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDownIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                        </motion.div>
                      </header>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            className="overflow-hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <p className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        </main>
      </div>
      <style jsx global>{`
        .animate-blob {
          animation: blob 12s infinite;
        }
        .animation-delay-2000 {
          animation-delay: -4s;
        }
        .animation-delay-4000 {
          animation-delay: -8s;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  )
}
