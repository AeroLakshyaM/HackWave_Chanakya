import React, { useState, useRef, useEffect } from 'react';
import { Home, Compass, Library, Puzzle, Users, MessageSquare, Code, Image as ImageIcon, FileText, GraduationCap, Lightbulb, CreditCard, Settings, LogOut, Paperclip, Send, ChevronDown, ChevronRight, MoreHorizontal, X, Bot, User, Loader } from 'lucide-react';

// Main App Component
export default function App() {
  return (
    <div className="bg-white text-gray-800 font-sans flex h-screen overflow-hidden">
      <Sidebar />
      <MainContent />
    </div>
  );
}

// ========= Sidebar Components =========

const Sidebar = ({ activePage, setActivePage, navigate }) => {
  return (
    <aside className="fixed top-0 left-0 h-full w-72 bg-gray-50 border-r border-gray-200 flex flex-col p-4 transition-all duration-300 z-50">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg">Chanakya</span>
          </div>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Pro</span>
        </div>

        
      </div>

      <nav className="flex-1 overflow-y-auto pr-2">
        <SidebarNav activePage={activePage} setActivePage={setActivePage} />
      </nav>

      <div className="flex-shrink-0 mt-auto pt-4 border-t border-gray-200">
        <SidebarFooter activePage={activePage} setActivePage={setActivePage} navigate={navigate} />
      </div>
    </aside>
  );
};

const SidebarNavItem = ({ item, isActive, onClick }) => (
    <li>
      <a href="#" onClick={onClick} className={`flex items-center space-x-3 p-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:scale-105'}`}>
        <item.icon size={20} />
        <span>{item.label}</span>
        {item.new && <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-auto">New</span>}
      </a>
    </li>
);

const SidebarNav = ({ activePage, setActivePage }) => {
  const navItems = [
    { icon: Bot, label: 'Chatbot' },
    { icon: BarChart2, label: 'Analytics Page' },
    { icon: Package, label: 'Product' },
    { icon: DollarSign, label: 'Investors List' },
    { icon: Video, label: 'Meeting Room' },
  ];

  return (
    <ul className="space-y-1 mb-8">
      {navItems.map((item, index) => (
        <SidebarNavItem 
            key={index} 
            item={item} 
            isActive={activePage === item.label}
            onClick={() => setActivePage(item.label)}
        />
      ))}
    </ul>
  );
};



const SidebarFooter = ({ activePage, setActivePage, navigate }) => {
  const footerItems = [
    { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
    { icon: LogOut, label: 'Logout', onClick: () => navigate('/auth') },
  ];

  return (
    <div className="space-y-1">
      {/* User Profile Section */}
      <div className="mb-4 p-3 rounded-lg bg-gray-100/50 border border-gray-200/50">
        <button 
          onClick={() => navigate('/userprofile')}
          className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-200/50 transition-colors duration-200"
        >
          <img src="https://placehold.co/40x40/E2E8F0/4A5568?text=NP" alt="User Avatar" className="w-10 h-10 rounded-full" />
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm text-gray-800">Nathaniel Poole</p>
            <p className="text-xs text-gray-600">nathanielpoole@gmail.com</p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>
      
      {/* Footer Navigation Items */}
      <ul className="space-y-1">
        {footerItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={item.onClick}
              className={`flex items-center space-x-3 p-2 rounded-md text-sm font-medium transition-all duration-200 w-full text-left ${
                activePage === item.label ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ========= Main Content Components =========

const MainContent = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatHistory.length > 0 && !isChatVisible) {
      setIsChatVisible(true);
    }
  }, [chatHistory, isChatVisible]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const callGeminiAPI = async (prompt) => {
    setIsLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', text: prompt }]);

    try {
      // Enhanced prompt to request Markdown formatting
      const enhancedPrompt = `Please provide your response in Markdown format with proper formatting including headers, lists, bold text, and code blocks where appropriate. 

${prompt}

Format your response using Markdown syntax for better readability.`;

      const payload = { 
        contents: [{ 
          role: "user", 
          parts: [{ text: enhancedPrompt }] 
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };
      
      const apiKey = "AIzaSyAnPu2pp1NmaAhAwnn_5X-qBQQ9U-_mV_w";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);

      const result = await response.json();
      
      let modelResponse = "Sorry, I couldn't get a response. Please try again.";
      if (result.candidates?.[0]?.content?.parts?.[0]) {
        modelResponse = result.candidates[0].content.parts[0].text;
      }
      
      setChatHistory(prev => [...prev, { role: 'model', text: modelResponse }]);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setChatHistory(prev => [...prev, { role: 'model', text: `**Error occurred:** ${error.message}\n\nPlease try again or check your connection.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-8">
        <div className={`w-full max-w-4xl mx-auto transition-opacity duration-500 ${isChatVisible ? 'opacity-100' : 'opacity-0'}`}>
          {!isChatVisible && chatHistory.length === 0 ? (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-2">Welcome to Chanakya AI</h1>
                <p className="text-gray-500 text-lg">Your strategic AI advisor for business growth, product development, and startup success</p>
              </div>
              <FeatureGrid onFeatureClick={callGeminiAPI} />
            </div>
          ) : (
            <div className="space-y-8">
              {chatHistory.map((message, index) => (
                <ChatMessage key={index} role={message.role} text={message.text} />
              ))}
              {isLoading && <LoadingIndicator />}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto p-8 pt-0">
        <UpgradeBanner />
        <ChatInput onSendMessage={callGeminiAPI} isLoading={isLoading} />
      </div>
    </main>
  );
};

const ChatMessage = ({ role, text }) => {
    const isUser = role === 'user';
    
    // Function to convert markdown to HTML with proper formatting
    const formatMarkdown = (inputText) => {
        return inputText
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mb-3">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>')
            
            // Bold and italic
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            
            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-3 border border-gray-200"><code class="text-sm font-mono text-gray-800">$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800 border border-gray-200">$1</code>')
            
            // Lists
            .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
            .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
            .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 mb-1">$1. $2</li>')
            
            // Wrap lists in proper HTML
            .replace(/(<li.*<\/li>)/g, '<ul class="list-disc list-inside space-y-1 my-3">$1</ul>')
            
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
            
            // Line breaks
            .replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed">')
            .replace(/\n/g, '<br>')
            
            // Wrap in paragraph tags
            .replace(/^(.+)$/gm, '<p class="mb-3 leading-relaxed">$1</p>')
            .replace(/<p class="mb-3"><\/p>/g, '')
            .replace(/<p class="mb-3"><br><\/p>/g, '');
    };

    return (
        <div className={`flex items-start gap-4 animate-fade-in-up ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                </div>
            )}
            <div className={`max-w-3xl p-6 rounded-xl shadow-sm ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                {isUser ? (
                    <div className="prose prose-sm max-w-none">
                        <p className="mb-0 text-white">{text}</p>
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200" dangerouslySetInnerHTML={{ __html: formatMarkdown(text) }} />
                )}
            </div>
            {isUser && (
                 <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                </div>
            )}
        </div>
    );
};

const LoadingIndicator = () => (
    <div className="flex items-start gap-4 animate-fade-in-up">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <Bot size={20} className="text-white" />
        </div>
        <div className="max-w-3xl p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center space-x-2">
                <Loader className="animate-spin text-blue-600" size={20} />
                <span className="text-sm text-gray-600">Chanakya AI is analyzing your request...</span>
            </div>
        </div>
    </div>
);

const FeatureGrid = ({ onFeatureClick }) => {
  const features = [
    { 
      icon: FileText, 
      title: 'Product Strategy', 
      description: 'Get expert guidance on product development and strategy',
      prompt: 'Help me analyze my product-market fit and suggest improvements for better user adoption. My product is a SaaS platform for small businesses.'
    },
    { 
      icon: GraduationCap, 
      title: 'Market Research', 
      description: 'Deep dive into market analysis and competitive landscape',
      prompt: 'Conduct a comprehensive market analysis for my fintech startup. Include competitor analysis, market size, and growth opportunities in the digital banking space.'
    },
    { 
      icon: ImageIcon, 
      title: 'Business Model Canvas', 
      description: 'Design and optimize your business model structure',
      prompt: 'Help me create a detailed Business Model Canvas for my AI-powered analytics platform. Include revenue streams, key partnerships, and value propositions.'
    },
    { 
      icon: Code, 
      title: 'Technical Architecture', 
      description: 'Get expert advice on system design and scalability',
      prompt: 'Review my technical architecture for a microservices-based e-commerce platform. Suggest improvements for scalability, security, and performance optimization.'
    },
    { 
      icon: Lightbulb, 
      title: '✨ Innovation Hub', 
      description: 'Discover breakthrough business ideas and opportunities',
      prompt: 'Give me 10 innovative startup ideas for 2025 that solve real problems. For each idea, provide: problem statement, solution, target market, revenue model, and competitive advantage.'
    },
    { 
      icon: Users, 
      title: 'Customer Acquisition', 
      description: 'Strategies to grow your user base and market share',
      prompt: 'Create a comprehensive customer acquisition strategy for my B2B SaaS platform. Include marketing channels, pricing strategies, and conversion optimization tactics.'
    },
    { 
      icon: CreditCard, 
      title: 'Funding Strategy', 
      description: 'Navigate fundraising and investment opportunities',
      prompt: 'Help me prepare for a Series A funding round. Create an investor pitch deck outline, financial projections, and key metrics to highlight for my AI startup.'
    },
    { 
      icon: Settings, 
      title: 'Operational Excellence', 
      description: 'Optimize business processes and team efficiency',
      prompt: 'Analyze my startup operations and suggest ways to improve efficiency. Include team structure, process optimization, and tools for better productivity.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} onClick={feature.prompt ? () => onFeatureClick(feature.prompt) : null} />
      ))}
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, onClick }) => (
  <div onClick={onClick} className={`p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}>
    <Icon size={24} className="text-blue-600 mb-3" />
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

const UpgradeBanner = () => (
  <div className="text-center mb-6">
    <p className="text-sm text-gray-600">
      <span role="img" aria-label="sparkles">✨</span>
      Upgrade to Enterprise for Unlimited Chanakya AI Business Insights
      <a href="#" className="text-blue-600 font-semibold ml-2 hover:underline">Upgrade now &rarr;</a>
    </p>
  </div>
);

const ChatInput = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="relative">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e); }}
                    placeholder={isLoading ? "Chanakya AI is analyzing..." : "How can Chanakya AI help your business today?"}
                    className="w-full h-24 p-4 pr-12 bg-transparent focus:outline-none resize-none"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading} className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                    <Send size={20} />
                </button>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                    <button type="button" className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                        <Bot size={16} />
                        <span>GPT-4o</span>
                        <ChevronDown size={14} />
                    </button>
                    <button type="button" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                        <Paperclip size={16} />
                        <span>Attach content</span>
                    </button>
                </div>
                <span className="text-xs text-gray-400">11233/25000</span>
            </div>
        </form>
    );
};