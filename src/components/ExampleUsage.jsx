import React from 'react';

const ExampleUsage = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">
        🚀 Market Analysis System Ready!
      </h3>
      
      <div className="space-y-3 text-sm text-blue-800">
        <p><strong>What's New:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>🔍 <strong>Search Bar:</strong> Enter any website URL to analyze</li>
          <li>📊 <strong>Interactive Charts:</strong> Pie charts, bar charts, line graphs</li>
          <li>🤖 <strong>AI Analysis:</strong> Gemini-powered market insights</li>
          <li>📈 <strong>Performance Metrics:</strong> Traffic, SEO, demographics</li>
          <li>💡 <strong>Strategic Recommendations:</strong> AI-generated suggestions</li>
        </ul>
        
        <div className="mt-4 p-3 bg-blue-100 rounded border border-blue-300">
          <p className="font-medium text-blue-900 mb-2">Quick Start:</p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Click the "Market Analysis" tab above</li>
            <li>Enter a website URL (e.g., "google.com")</li>
            <li>Click "Analyze" to generate insights</li>
            <li>Explore charts and AI recommendations</li>
          </ol>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
          <p className="font-medium text-yellow-900 mb-2">⚠️ Setup Required:</p>
          <p className="text-yellow-800">
            To use real AI analysis, add your Gemini API key to a <code className="bg-yellow-200 px-1 rounded">.env</code> file:
          </p>
                     <code className="block bg-yellow-200 px-2 py-1 rounded mt-2 text-xs">
             VITE_GEMINI_API_KEY=your_api_key_here
           </code>
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;
