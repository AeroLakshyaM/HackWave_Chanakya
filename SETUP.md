# Market Analysis System Setup Guide

## Prerequisites

1. **Gemini AI API Key**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Node.js**: Version 16 or higher
3. **npm**: Package manager

## Installation

1. Install dependencies:
```bash
npm install chart.js react-chartjs-2
```

2. Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

3. Replace `your_actual_gemini_api_key_here` with your real Gemini API key.

**Important:** In Vite, environment variables must start with `VITE_` to be accessible in the browser.

## Features

### Market Analysis Dashboard
- **Search Bar**: Enter any website URL to analyze
- **Comprehensive Charts**:
  - Pie Chart: Market share distribution
  - Line Chart: Monthly traffic trends
  - Bar Charts: Demographics and performance metrics
  - Daily traffic patterns

### AI-Powered Insights
- **Gemini AI Integration**: Automated market analysis
- **Strategic Recommendations**: AI-generated suggestions
- **Risk Assessment**: Market position analysis
- **Competitive Intelligence**: Competitor analysis

### Data Visualization
- **Interactive Charts**: Hover for detailed information
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Dynamic data loading
- **Export Ready**: Chart data for reports

## Usage

1. Navigate to the Analytics page
2. Click on "Market Analysis" tab
3. Enter a website URL in the search bar
4. Click "Analyze" to generate insights
5. View comprehensive charts and AI analysis

## API Integration

The system is designed to work with:
- **SimilarWeb API** (for real traffic data)
- **SEMrush API** (for SEO analysis)
- **Google Analytics API** (for detailed metrics)
- **Social Media APIs** (for engagement data)

Currently uses mock data for demonstration. Replace mock functions in `src/services/marketAnalysisApi.js` with real API calls.

## Customization

- Modify chart colors and styles in `src/components/charts/MarketCharts.jsx`
- Update API endpoints in `src/services/marketAnalysisApi.js`
- Customize AI prompts in the Gemini integration
- Add new chart types as needed

## Troubleshooting

- **API Key Issues**: Ensure your Gemini API key is correct and has proper permissions
- **Environment Variables**: Make sure your `.env` file uses `VITE_` prefix (e.g., `VITE_GEMINI_API_KEY`)
- **Chart Rendering**: Check browser console for Chart.js errors
- **Data Loading**: Verify network connectivity and API endpoints
- **Performance**: Large datasets may require pagination or data limiting

## Security Notes

- Never commit your API keys to version control
- Use environment variables for sensitive configuration
- Implement rate limiting for production use
- Validate user inputs before API calls
