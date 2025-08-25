import React, { useState, useEffect } from 'react';
import { getMarketData, getGeminiAnalysis } from '../services/marketAnalysisApi';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const MarketAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState(null);
  const [aiAnalysisData, setAiAnalysisData] = useState({
    strengths: [],
    improvements: [],
    recommendations: [],
    risks: []
  });
  const [tabLoading, setTabLoading] = useState({
    strengths: false,
    improvements: false,
    recommendations: false,
    risks: false
  });
  const [activeTab, setActiveTab] = useState('strengths');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');
  
  // SWOT Analysis states
  const [swotData, setSwotData] = useState({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });
  const [swotLoading, setSwotLoading] = useState(false);
  const [swotError, setSwotError] = useState('');

  // Load market data on component mount
  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
    setLoading(true);
    setError('');
      
      console.log('Loading market data...');
      const data = await getMarketData();
      console.log('Market data loaded:', data);
      
      setMarketData(data);

      // Generate AI analysis for all tabs
      await generateAllAnalysis(data);
      
      // Generate SWOT analysis
      await generateSwotAnalysis(data);
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading market data:', err);
      setError(err.message || 'Failed to load market data. Please ensure you have completed your profile setup.');
    } finally {
      setLoading(false);
    }
  };

  const generateAllAnalysis = async (data) => {
    try {
      // Generate analysis for all tabs in parallel
      const [strengths, improvements, recommendations, risks] = await Promise.all([
        generateTabAnalysis(data, 'strengths'),
        generateTabAnalysis(data, 'improvements'),
        generateTabAnalysis(data, 'recommendations'),
        generateTabAnalysis(data, 'risks')
      ]);

      setAiAnalysisData({
        strengths,
        improvements,
        recommendations,
        risks
      });
    } catch (error) {
      console.error('Error generating analysis:', error);
      // Set fallback data if API fails
      setAiAnalysisData({
        strengths: ['Analysis failed. Please try again.'],
        improvements: ['Analysis failed. Please try again.'],
        recommendations: ['Analysis failed. Please try again.'],
        risks: ['Analysis failed. Please try again.']
      });
    }
  };

  const generateTabAnalysis = async (data, tabType) => {
    setTabLoading(prev => ({ ...prev, [tabType]: true }));
    
    try {
      const analysis = await getGeminiAnalysis(data.productData, data.marketData, tabType);
      
      // Parse the analysis response into bullet points
      const bulletPoints = parseAnalysisToBulletPoints(analysis, tabType);
      return bulletPoints;
    } catch (error) {
      console.error(`Error generating ${tabType} analysis:`, error);
      return [`Failed to generate ${tabType} analysis. Please try again.`];
    } finally {
      setTabLoading(prev => ({ ...prev, [tabType]: false }));
    }
  };

  const parseAnalysisToBulletPoints = (analysis, tabType) => {
    try {
      // Split the analysis by lines and filter out empty lines
      const lines = analysis.split('\n').filter(line => line.trim());
      
      // Look for bullet points or numbered lists
      const bulletPoints = lines
        .filter(line => {
          const trimmed = line.trim();
          return trimmed.startsWith('-') || 
                 trimmed.startsWith('•') || 
                 trimmed.startsWith('*') ||
                 /^\d+\./.test(trimmed) ||
                 trimmed.length > 20; // Lines that are likely content
        })
        .map(line => {
          // Clean up the line by removing bullet markers and extra spaces
          return line.replace(/^[-•*\s\d.]+/, '').trim();
        })
        .filter(line => line.length > 10); // Filter out very short lines
      
      // If we have good filtered points, return them
      if (bulletPoints.length >= 3) {
        return bulletPoints.slice(0, 7); // Limit to 7 points
      }
      
      // Fallback: split by sentences if bullet parsing fails
      const sentences = analysis.split(/[.!?]+/).filter(s => s.trim().length > 20);
      return sentences.slice(0, 6).map(s => s.trim());
      
    } catch (error) {
      console.error('Error parsing analysis:', error);
      return [`Analysis for ${tabType} is available but could not be parsed properly.`];
    }
  };

  const refreshTabAnalysis = async (tabType) => {
    setTabLoading(prev => ({ ...prev, [tabType]: true }));
    try {
      const analysis = await getGeminiAnalysis(marketData.productData, marketData.marketData, tabType);
      const bulletPoints = parseAnalysisToBulletPoints(analysis, tabType);
      setAiAnalysisData(prev => ({ ...prev, [tabType]: bulletPoints }));
      setLastUpdated(new Date());
    } catch (error) {
      console.error(`Error refreshing ${tabType} analysis:`, error);
      setAiAnalysisData(prev => ({ ...prev, [tabType]: [`Failed to refresh ${tabType} analysis. Please try again.`] }));
    } finally {
      setTabLoading(prev => ({ ...prev, [tabType]: false }));
    }
  };

  const generateSwotAnalysis = async (data) => {
    try {
      setSwotLoading(true);
      setSwotError('');

      const prompt = `Based on the following business data, provide a comprehensive SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for this company and its product in the market. 

Business Data:
- Industry: ${data.marketData?.industry || 'Technology'}
- Target Market: ${data.marketData?.targetMarket || 'General'}
- Company Size: ${data.productData?.companySize || 'Startup'}
- Market Position: ${data.marketData?.marketPosition || 'Emerging'}
- Key Features: ${data.productData?.keyFeatures || 'Innovation'}
- Competitive Landscape: ${data.marketData?.competitors || 'Moderate competition'}

Please provide specific, actionable insights for each SWOT category. Format the response as a JSON object with arrays for each category:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "threats": ["threat1", "threat2", "threat3"]
}

Focus on market-relevant insights that can help with strategic decision-making.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          botPersonality: "Strategic Business Analyst",
          botExpertise: "Market Analysis and Strategic Planning",
          botName: "SWOT Analyst"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate SWOT analysis');
      }

      const result = await response.json();
      
      // Try to parse JSON response, fallback to text parsing if needed
      let swotResult;
      try {
        swotResult = JSON.parse(result.message);
      } catch (parseError) {
        // Fallback: extract SWOT data from text response
        const text = result.message;
        swotResult = {
          strengths: extractPoints(text, 'strengths', 'weaknesses'),
          weaknesses: extractPoints(text, 'weaknesses', 'opportunities'),
          opportunities: extractPoints(text, 'opportunities', 'threats'),
          threats: extractPoints(text, 'threats', '')
        };
      }

      setSwotData(swotResult);
    } catch (error) {
      console.error('Error generating SWOT analysis:', error);
      setSwotError('.');
      
      // Fallback SWOT data
      setSwotData({
        strengths: [
          'Innovative product features',
          'Agile development approach',
          'Strong customer focus',
          'Technical expertise'
        ],
        weaknesses: [
          'Limited market presence',
          'Resource constraints',
          'Brand recognition',
          'Distribution channels'
        ],
        opportunities: [
          'Growing market demand',
          'Technology advancements',
          'Partnership potential',
          'International expansion'
        ],
        threats: [
          'Intense competition',
          'Market volatility',
          'Regulatory changes',
          'Economic uncertainty'
        ]
      });
    } finally {
      setSwotLoading(false);
    }
  };

  const extractPoints = (text, startKeyword, endKeyword) => {
    const startIndex = text.toLowerCase().indexOf(startKeyword.toLowerCase());
    if (startIndex === -1) return [];
    
    const endIndex = endKeyword ? text.toLowerCase().indexOf(endKeyword.toLowerCase(), startIndex) : text.length;
    const section = text.substring(startIndex, endIndex);
    
    // Extract bullet points or numbered items
    const points = section.match(/(?:^|\n)[•\-\*]\s*(.+?)(?=\n|$)/g) || 
                   section.match(/(?:^|\n)\d+\.\s*(.+?)(?=\n|$)/g) ||
                   section.match(/(?:^|\n)([A-Z][^.!?]+[.!?])/g);
    
    return points ? points.map(p => p.replace(/^[•\-\*\d\.\s]+/, '').trim()).filter(p => p.length > 10) : [];
  };

  const renderTabContent = () => {
    const currentData = aiAnalysisData[activeTab];
    const isLoading = tabLoading[activeTab];
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Generating {activeTab} analysis...</span>
        </div>
      );
    }

    if (!currentData || currentData.length === 0) {
        return (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-lg font-medium text-gray-600 mb-2">No Analysis Data Available</p>
            <p className="text-gray-500 mb-4">Click "Refresh All" to generate AI-powered analysis for all tabs.</p>
            <button
            onClick={loadMarketData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Generate Analysis
            </button>
          </div>
        );
    }

    const getTabIcon = (tabType) => {
      switch (tabType) {
        case 'strengths':
          return (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          );
        case 'improvements':
        case 'risks':
          return (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
        case 'recommendations':
          return (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          );
        default:
          return null;
      }
    };

    const getTabTitle = (tabType) => {
      switch (tabType) {
        case 'strengths': return 'Key Strengths';
        case 'improvements': return 'Areas of Improvement';
        case 'recommendations': return 'Strategic Recommendations';
        case 'risks': return 'Risk Factors';
        default: return tabType;
      }
    };

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-blue-700 mb-4">{getTabTitle(activeTab)}</h4>
        <div className="grid gap-3">
          {currentData.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                {getTabIcon(activeTab)}
              </div>
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Market Analysis</h2>
          <p className="text-gray-500">Analyzing your product data and generating insights...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
              </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Analysis</h2>
          <p className="text-gray-500 mb-4">{error}</p>
              <button
            onClick={loadMarketData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
              </button>
            </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Market Analysis Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time insights for {marketData?.productData?.productName || marketData?.productData?.companyName || 'your product'}
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
          )}
        </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Industry */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
                  <div>
              <p className="text-sm font-medium text-gray-600">Industry</p>
              <p className="text-2xl font-bold text-gray-900">{marketData.marketData.industry}</p>
                  </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
                    </div>
                  </div>
                </div>

        {/* Market Size */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Global Market</p>
              <p className="text-2xl font-bold text-gray-900">${marketData.marketData.marketSize.globalMarket}B</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
                </div>
              </div>

        {/* Your Market Share */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Market Share</p>
              <p className="text-2xl font-bold text-gray-900">{(marketData.marketData.marketSize.userMarketShare * 100).toFixed(3)}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
                </div>
                </div>
              </div>

        {/* Growth Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">{marketData.marketData.marketSize.growthRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
                </div>
              </div>
            </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Traffic Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Traffic Growth</h3>
          <div className="h-64">
                  <Line 
                    data={{
                labels: marketData.marketData.trafficData.monthly.map(m => m.month),
                      datasets: [{
                  label: 'Monthly Visitors',
                  data: marketData.marketData.trafficData.monthly.map(m => m.visitors),
                  borderColor: '#1E40AF',
                  backgroundColor: 'rgba(30, 64, 175, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                  pointBackgroundColor: '#1E40AF',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                  y: { 
                    beginAtZero: true, 
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                      callback: function(value) {
                        return (value / 1000).toFixed(0) + 'K';
                      }
                    }
                  },
                        x: { grid: { color: 'rgba(0, 0, 0, 0.05)' } }
                      }
                    }}
                  />
                </div>
              </div>

        {/* Competitor Market Share */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Market Share</h3>
          <div className="h-64">
            <Pie 
              data={{
                labels: marketData.marketData.competitors.map(c => c.name),
                datasets: [{
                  data: marketData.marketData.competitors.map(c => c.share),
                  backgroundColor: [
                    '#1E40AF', // Dark blue
                    '#3B82F6', // Blue
                    '#60A5FA', // Light blue
                    '#93C5FD', // Lighter blue
                    '#BFDBFE', // Very light blue
                    '#DBEAFE'  // Lightest blue
                  ],
                  borderWidth: 2,
                  borderColor: '#fff'
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return context.label + ': ' + context.parsed + '%';
                      }
                    }
                  }
                }
              }}
            />
                </div>
              </div>
            </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Load Time</span>
              <span className="font-semibold">{marketData.marketData.performance.loadTime}s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-700 h-2 rounded-full" 
                style={{ width: `${(marketData.marketData.performance.loadTime / 5) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">SEO Score</span>
              <span className="font-semibold">{marketData.marketData.performance.seoScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${marketData.marketData.performance.seoScore}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bounce Rate</span>
              <span className="font-semibold">{marketData.marketData.performance.bounceRate}%</span>
                </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${marketData.marketData.performance.bounceRate}%` }}
              ></div>
              </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold">{marketData.marketData.performance.conversionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-400 h-2 rounded-full" 
                style={{ width: `${(marketData.marketData.performance.conversionRate / 5) * 100}%` }}
              ></div>
                </div>
              </div>
            </div>

        {/* Growth Projections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Projections</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Next 6 Months</span>
              <span className="font-semibold text-blue-600">+{marketData.marketData.growthProjections.next6Months}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Next 12 Months</span>
              <span className="font-semibold text-blue-600">+{marketData.marketData.growthProjections.next12Months}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Risk Level</span>
              <span className="font-semibold text-blue-600">{marketData.marketData.growthProjections.riskLevel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Funding Needs</span>
              <span className="font-semibold text-blue-600">{marketData.marketData.growthProjections.fundingNeeds}</span>
            </div>
          </div>
        </div>
            </div>

            {/* AI-Powered Market Analysis with Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">AI-Powered Market Analysis</h3>
                <div className="flex space-x-2">
                  <button
              onClick={loadMarketData}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh All</span>
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                {[
                  { key: 'strengths', label: 'Key Strengths' },
                  { key: 'improvements', label: 'Areas of Improvement' },
                  { key: 'recommendations', label: 'Strategic Recommendations' },
                  { key: 'risks', label: 'Risk Factors' }
                ].map((tab) => (
                  <div key={tab.key} className="flex-1 relative">
                    <button
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.key
                          ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>{tab.label}</span>
                        {tabLoading[tab.key] && (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </button>
                    {/* Refresh button for individual tab */}
                    {aiAnalysisData[tab.key] && aiAnalysisData[tab.key].length > 0 && (
                      <button
                        onClick={() => refreshTabAnalysis(tab.key)}
                        disabled={tabLoading[tab.key]}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                        title={`Refresh ${tab.label}`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>

      {/* Competitor Comparison Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 mt-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">Competitor Analysis & Comparison</h3>
          <p className="text-blue-700">Detailed comparison with your top competitors in the market</p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm border border-blue-200">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-4 text-left font-semibold rounded-tl-lg">Metrics</th>
                <th className="px-6 py-4 text-center font-semibold">Your Product</th>
                <th className="px-6 py-4 text-center font-semibold">Competitor 1</th>
                <th className="px-6 py-4 text-center font-semibold rounded-tr-lg">Competitor 2</th>
              </tr>
            </thead>
            <tbody>
              {/* Market Position */}
              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">Market Position</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {marketData?.marketData?.competitors?.find(c => c.isUser)?.strength || 'Emerging'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {marketData?.marketData?.competitors?.[0]?.strength || 'Market Leader'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {marketData?.marketData?.competitors?.[1]?.strength || 'Established Player'}
                  </span>
                </td>
              </tr>

              {/* Market Share */}
              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">Market Share</td>
                <td className="px-6 py-4 text-center font-semibold text-blue-700">
                  {(marketData?.marketData?.marketSize?.userMarketShare * 100).toFixed(3)}%
                </td>
                <td className="px-6 py-4 text-center font-semibold text-blue-700">
                  {marketData?.marketData?.competitors?.[0]?.share || '0'}%
                </td>
                <td className="px-6 py-4 text-center font-semibold text-blue-700">
                  {marketData?.marketData?.competitors?.[1]?.share || '0'}%
                </td>
              </tr>

              {/* Performance Metrics */}
              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">Load Time</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">{marketData?.marketData?.performance?.loadTime}s</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {(parseFloat(marketData?.marketData?.performance?.loadTime) * 0.8).toFixed(2)}s
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {(parseFloat(marketData?.marketData?.performance?.loadTime) * 0.9).toFixed(2)}s
                  </span>
                </td>
              </tr>

              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">SEO Score</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">{marketData?.marketData?.performance?.seoScore}/100</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {Math.min(100, marketData?.marketData?.performance?.seoScore + 5)}/100
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {Math.min(100, marketData?.marketData?.performance?.seoScore + 3)}/100
                  </span>
                </td>
              </tr>

              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">Bounce Rate</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">{marketData?.marketData?.performance?.bounceRate}%</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {(parseFloat(marketData?.marketData?.performance?.bounceRate) * 0.9).toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {(parseFloat(marketData?.marketData?.performance?.bounceRate) * 0.95).toFixed(1)}%
                  </span>
                </td>
              </tr>

              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">Conversion Rate</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">{marketData?.marketData?.performance?.conversionRate}%</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {(parseFloat(marketData?.marketData?.performance?.conversionRate) * 1.2).toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {(parseFloat(marketData?.marketData?.performance?.conversionRate) * 1.1).toFixed(2)}%
                  </span>
                </td>
              </tr>

              {/* Traffic & Growth */}
              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">Monthly Traffic</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {marketData?.marketData?.trafficData?.monthly?.[11]?.visitors?.toLocaleString() || '0'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {(marketData?.marketData?.trafficData?.monthly?.[11]?.visitors * 10).toLocaleString() || '0'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {(marketData?.marketData?.trafficData?.monthly?.[11]?.visitors * 5).toLocaleString() || '0'}
                  </span>
                </td>
              </tr>

              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">Growth Rate</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">{marketData?.marketData?.marketSize?.growthRate}%</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {(marketData?.marketData?.marketSize?.growthRate * 0.7).toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-700">
                    {(marketData?.marketData?.marketSize?.growthRate * 0.8).toFixed(1)}%
                  </span>
                </td>
              </tr>

              {/* Pricing & Business Model */}
              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">Business Model</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {marketData?.productData?.userType === 'startup' ? 'Innovation-Focused' : 'Established'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Enterprise
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Mid-Market
                  </span>
                </td>
              </tr>

              {/* Technology Stack */}
              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">Technology Stack</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Modern
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Legacy + Modern
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Hybrid
                  </span>
                </td>
              </tr>

              {/* Customer Support */}
              <tr className="border-b border-blue-100">
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50">Customer Support</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Personalized
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    24/7 Enterprise
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Business Hours
                  </span>
                </td>
              </tr>

              {/* Innovation Score */}
              <tr>
                <td className="px-6 py-4 font-medium text-blue-900 bg-blue-50 rounded-bl-lg">Innovation Score</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-blue-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="font-semibold text-blue-700">85%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-blue-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="font-semibold text-blue-700">65%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center rounded-br-lg">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-blue-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="font-semibold text-blue-700">75%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Key Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-blue-900">Your Advantages</h4>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Higher innovation potential
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Agility and flexibility
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Personalized customer approach
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-blue-900">Areas to Improve</h4>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Market share expansion
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Performance optimization
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Customer acquisition
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-blue-900">Strategic Actions</h4>
                  </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Focus on unique value props
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Leverage agility advantage
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Build customer loyalty
              </li>
            </ul>
              </div>
            </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={loadMarketData}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Competitor Analysis</span>
          </button>
          </div>
      </div>

      {/* SWOT Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-12"
      >
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            SWOT Analysis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Comprehensive analysis of your company's Strengths, Weaknesses, Opportunities, and Threats in the market
          </motion.p>
        </div>

        {swotLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-12"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating SWOT Analysis...</p>
            </div>
          </motion.div>
        )}

        {swotError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
          >
            <p className="text-yellow-800 text-sm">{swotError}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-sky-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Strengths</h3>
              </div>
            </div>
            <div className="p-6">
              <AnimatePresence>
                {swotData.strengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                    className="flex items-start space-x-3 mb-4 last:mb-0"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">{strength}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Weaknesses */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-sky-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Weaknesses</h3>
              </div>
            </div>
            <div className="p-6">
              <AnimatePresence>
                {swotData.weaknesses.map((weakness, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                    className="flex items-start space-x-3 mb-4 last:mb-0"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">{weakness}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Opportunities */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Opportunities</h3>
              </div>
            </div>
            <div className="p-6">
              <AnimatePresence>
                {swotData.opportunities.map((opportunity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                    className="flex items-start space-x-3 mb-4 last:mb-0"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">{opportunity}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Threats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-sky-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Threats</h3>
              </div>
            </div>
            <div className="p-6">
              <AnimatePresence>
                {swotData.threats.map((threat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.6 + index * 0.1 }}
                    className="flex items-start space-x-3 mb-4 last:mb-0"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">{threat}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* SWOT Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => generateSwotAnalysis(marketData)}
            disabled={swotLoading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 mx-auto disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh SWOT Analysis</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MarketAnalysis;
