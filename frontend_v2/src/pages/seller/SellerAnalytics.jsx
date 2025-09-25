import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerAnalytics = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('summary');
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(true);
  
  const [realTimeData, setRealTimeData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const intervalRef = useRef(null);
  
  const [analyticsData] = useState({
    insights: [
      {
        type: 'positive',
        icon: 'trending_up',
        iconColor: 'text-green-500',
        title: 'Sotuvlar +12% oshdi (o\'tgan haftaga nisbatan)',
        description: 'Ajoyib momentum! Davom eting.',
        impact: 'high',
        actionable: true
      },
      {
        type: 'warning',
        icon: 'warning',
        iconColor: 'text-orange-500',
        title: 'Javob vaqti 4s vs 1.5s bozor o\'rtachasi',
        description: 'Sekin javoblar g\'alaba qozonish darajasiga ta\'sir qilishi mumkin.',
        impact: 'medium',
        actionable: true
      },
      {
        type: 'info',
        icon: 'insights',
        iconColor: 'text-blue-500',
        title: 'Yangi xaridorlar +8% oshdi',
        description: 'Marketing kampaniyasi samarali ishlayapti.',
        impact: 'high',
        actionable: false
      }
    ],
    metrics: [
      { 
        name: 'Daromad rejasi', 
        value: '30,000,000 so\'m',
        target: '35,000,000 so\'m',
        progress: 85.7,
        trend: '+5.2%',
        color: 'text-green-600'
      },
      { 
        name: 'Buyurtmalar soni', 
        value: '127',
        target: '150',
        progress: 84.7,
        trend: '+8.1%',
        color: 'text-blue-600'
      },
      { 
        name: 'O\'rtacha buyurtma qiymati', 
        value: '236,220 so\'m',
        target: '250,000 so\'m',
        progress: 94.5,
        trend: '-2.3%',
        color: 'text-orange-600'
      },
      { 
        name: 'Konversiya darajasi', 
        value: '23.4%',
        target: '25%',
        progress: 93.6,
        trend: '+1.2%',
        color: 'text-purple-600'
      }
    ],
    priceCompetitiveness: {
      currentScore: 85,
      maxScore: 100,
      description: 'Your prices are generally competitive, putting you in the top 15% of sellers on the platform.',
      performanceData: [
        { week: '4w ago', score: 70 },
        { week: '3w ago', score: 75 },
        { week: '2w ago', score: 80 },
        { week: '1w ago', score: 82 },
        { week: 'Today', score: 85 }
      ],
      calculationMethods: [
        {
          icon: 'monitoring',
          title: 'Market Average Comparison',
          description: 'We compare your average prices for key products against the current market average on MetOneX.'
        },
        {
          icon: 'verified',
          title: 'Product Quality & Specs',
          description: 'Higher quality or specialized products are benchmarked against similar items, not just the base category average.'
        },
        {
          icon: 'local_shipping',
          title: 'Delivery Time & Cost',
          description: 'Your offered delivery speed and shipping costs are factored in, as they contribute to the total cost for the buyer.'
        }
      ],
      relatedMetrics: [
        {
          name: 'Conversion Rate',
          value: '40%',
          trend: '+2.1%',
          trendType: 'positive'
        },
        {
          name: 'Lost Sales (Price)',
          value: '$6k',
          period: 'Last 30 days',
          trendType: 'negative'
        }
      ]
    },
    revenueMetrics: [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: '$125k',
        change: '+5.2%',
        trend: 'up',
        color: 'text-green-500'
      },
      {
        id: 'aov',
        title: 'Avg. Order Value',
        value: '$2.5k',
        change: '+1.8%',
        trend: 'up',
        color: 'text-green-500'
      },
      {
        id: 'deals',
        title: 'Number of Deals',
        value: '50',
        change: '-3.5%',
        trend: 'down',
        color: 'text-red-500'
      },
      {
        id: 'conversion',
        title: 'Conversion Rate',
        value: '40%',
        change: '+2.1%',
        trend: 'up',
        color: 'text-green-500',
        valueColor: 'text-green-600'
      },
      {
        id: 'plan',
        title: 'Revenue Plan',
        value: '$150k',
        change: 'Target',
        trend: 'neutral',
        color: 'text-gray-500'
      }
    ]
  });

  useEffect(() => {
    // Simulate real-time data updates
    const updateRealTimeData = () => {
      setRealTimeData({
        activeOrders: Math.floor(Math.random() * 10) + 5,
        pendingOffers: Math.floor(Math.random() * 5) + 2,
        todayRevenue: Math.floor(Math.random() * 50000) + 100000
      });
      setLastUpdated(new Date());
    };

    updateRealTimeData();
    intervalRef.current = setInterval(updateRealTimeData, 30000); // Update every 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const renderSummarySection = () => (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <section className="rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Real-time Metrics</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="material-symbols-outlined text-base">schedule</span>
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{realTimeData?.activeOrders || 0}</p>
            <p className="text-sm text-gray-600">Active Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{realTimeData?.pendingOffers || 0}</p>
            <p className="text-sm text-gray-600">Pending Offers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${realTimeData?.todayRevenue?.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-600">Today's Revenue</p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          {analyticsData.metrics.map((metric, index) => (
            <div key={index} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                <span className={`text-sm font-semibold ${metric.color}`}>{metric.trend}</span>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">{metric.value}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {metric.target}</span>
                  <span>{metric.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.progress >= 90 ? 'bg-green-500' : 
                      metric.progress >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Insights */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">AI Insights</h2>
        <div className="space-y-4">
          {analyticsData.insights.map((insight, index) => (
            <div key={index} className={`rounded-xl border p-4 ${
              insight.type === 'positive' ? 'border-green-200 bg-green-50' :
              insight.type === 'warning' ? 'border-orange-200 bg-orange-50' :
              'border-blue-200 bg-blue-50'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`flex size-10 items-center justify-center rounded-full ${
                  insight.type === 'positive' ? 'bg-green-100' :
                  insight.type === 'warning' ? 'bg-orange-100' :
                  'bg-blue-100'
                }`}>
                  <span className={`material-symbols-outlined ${insight.iconColor}`}>
                    {insight.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  {insight.actionable && (
                    <button className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                      Learn more →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderPriceCompetitivenessSection = () => (
    <div className="space-y-6">
      {/* Score Overview */}
      <section className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="size-32 rounded-full bg-white shadow-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{analyticsData.priceCompetitiveness.currentScore}</p>
                <p className="text-sm text-gray-500">out of {analyticsData.priceCompetitiveness.maxScore}</p>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-4">Price Competitiveness Score</h2>
          <p className="text-gray-600 mt-2">{analyticsData.priceCompetitiveness.description}</p>
        </div>
      </section>

      {/* Performance Chart */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Over Time</h3>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            {analyticsData.priceCompetitiveness.performanceData.map((data, index) => (
              <div key={index} className="text-center">
                <div className="h-20 flex items-end justify-center mb-2">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ 
                      height: `${(data.score / 100) * 80}px`,
                      width: '20px'
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600">{data.week}</p>
                <p className="text-sm font-semibold text-gray-900">{data.score}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculation Methods */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">How We Calculate This Score</h3>
        <div className="space-y-4">
          {analyticsData.priceCompetitiveness.calculationMethods.map((method, index) => (
            <div key={index} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                  <span className="material-symbols-outlined text-blue-600">{method.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{method.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Metrics */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Related Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          {analyticsData.priceCompetitiveness.relatedMetrics.map((metric, index) => (
            <div key={index} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`text-sm font-semibold ${
                  metric.trendType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderRevenueSection = () => (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Analytics</h2>
        <div className="grid grid-cols-2 gap-4">
          {analyticsData.revenueMetrics.map((metric) => (
            <div key={metric.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                <span className={`text-sm font-semibold ${metric.color}`}>{metric.change}</span>
              </div>
              <p className={`text-xl font-bold ${metric.valueColor || 'text-gray-900'}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Revenue Chart Placeholder */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl mb-2">bar_chart</span>
              <p>Revenue chart will be displayed here</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'summary':
        return renderSummarySection();
      case 'price-competitiveness':
        return renderPriceCompetitivenessSection();
      case 'revenue':
        return renderRevenueSection();
      default:
        return renderSummarySection();
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between overflow-x-hidden bg-gray-50">
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">Analytics</h1>
          <div className="flex items-center gap-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
            >
              <option value="Today">Today</option>
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
              <option value="Year">This Year</option>
            </select>
          </div>
        </header>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { id: 'summary', label: 'Summary', icon: 'dashboard' },
            { id: 'price-competitiveness', label: 'Price Competitiveness', icon: 'trending_up' },
            { id: 'revenue', label: 'Revenue', icon: 'paid' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {renderSectionContent()}
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => navigate('/seller/dashboard')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate('/seller/requests')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs font-medium">Requests</span>
          </button>
          <button 
            onClick={() => navigate('/seller/products')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-xs font-medium">Products</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-xs font-bold">Analytics</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SellerAnalytics;
