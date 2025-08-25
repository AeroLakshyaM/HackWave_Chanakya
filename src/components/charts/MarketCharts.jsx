import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Market Share Pie Chart
export const MarketSharePieChart = ({ competitors }) => {
  const data = {
    labels: competitors.map(comp => comp.name),
    datasets: [
      {
        data: competitors.map(comp => comp.share),
        backgroundColor: [
          '#3B82F6', // Blue-500
          '#1D4ED8', // Blue-700
          '#60A5FA', // Blue-400
          '#2563EB', // Blue-600
          '#93C5FD', // Blue-300
          '#1E40AF'  // Blue-800
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#1e40af'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
            weight: '600',
            family: 'Inter, system-ui, sans-serif'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.backgroundColor[i],
                  lineWidth: 0,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3B82F6',
        borderWidth: 2,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          title: function(context) {
            return `Competitor: ${context[0].label}`;
          },
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `Market Share: ${percentage}% (${context.parsed.toFixed(2)})`;
          }
        }
      }
    }
  };

  return (
    <div className="h-80">
      <Pie data={data} options={options} />
    </div>
  );
};

// Traffic Line Chart
export const TrafficLineChart = ({ monthlyData }) => {
  const data = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Visitors',
        data: monthlyData.map(item => item.visitors),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#1D4ED8',
        pointHoverBorderColor: '#fff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `Visitors: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280',
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  return (
    <div className="h-96">
      <Line data={data} options={options} />
    </div>
  );
};

// Demographics Bar Chart
export const DemographicsBarChart = ({ ageGroups, locations }) => {
  const ageData = {
    labels: ageGroups.map(item => item.age),
    datasets: [
      {
        label: 'Age Distribution (%)',
        data: ageGroups.map(item => item.percentage),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(29, 78, 216, 0.9)'
      }
    ]
  };

  const locationData = {
    labels: locations.map(item => item.country),
    datasets: [
      {
        label: 'Geographic Distribution (%)',
        data: locations.map(item => item.percentage),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(29, 78, 216, 0.9)'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280'
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280',
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Age Distribution</h3>
        <div className="h-80">
          <Bar data={ageData} options={options} />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Geographic Distribution</h3>
        <div className="h-80">
          <Bar data={locationData} options={options} />
        </div>
      </div>
    </div>
  );
};

// Performance Metrics Chart
export const PerformanceMetricsChart = ({ performance }) => {
  const data = {
    labels: ['Load Time (s)', 'Bounce Rate (%)', 'Conversion Rate (%)', 'SEO Score (/100)'],
    datasets: [
      {
        label: 'Current Performance',
        data: [
          performance.loadTime,
          performance.bounceRate,
          performance.conversionRate,
          performance.seoScore
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Blue-500
          'rgba(59, 130, 246, 0.8)',   // Blue-500
          'rgba(59, 130, 246, 0.8)',   // Blue-500
          'rgba(59, 130, 246, 0.8)'    // Blue-500
        ],
        borderColor: [
          '#3B82F6',
          '#3B82F6',
          '#3B82F6',
          '#3B82F6'
        ],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: [
          'rgba(29, 78, 216, 0.9)',    // Blue-700
          'rgba(29, 78, 216, 0.9)',    // Blue-700
          'rgba(29, 78, 216, 0.9)',    // Blue-700
          'rgba(29, 78, 216, 0.9)'     // Blue-700
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const labels = ['Load Time', 'Bounce Rate', 'Conversion Rate', 'SEO Score'];
            const units = ['s', '%', '%', '/100'];
            return `${labels[context.dataIndex]}: ${context.parsed.y.toFixed(2)}${units[context.dataIndex]}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280'
        }
      }
    }
  };

  return (
    <div className="h-96">
      <Bar data={data} options={options} />
    </div>
  );
};

// Daily Traffic Chart
export const DailyTrafficChart = ({ dailyData }) => {
  const data = {
    labels: dailyData.map(item => `Day ${item.day}`),
    datasets: [
      {
        label: 'Daily Visitors',
        data: dailyData.map(item => item.visitors),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#1D4ED8',
        pointHoverBorderColor: '#fff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `Visitors: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280',
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Daily Traffic Pattern (Last 30 Days)</h3>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
