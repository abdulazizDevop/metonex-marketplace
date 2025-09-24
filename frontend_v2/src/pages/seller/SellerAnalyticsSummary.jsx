import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerAnalyticsSummary = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [loading, setLoading] = useState(true);
  
  const [realTimeData, setRealTimeData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const intervalRef = useRef(null);
  
  const [analyticsData, setAnalyticsData] = useState({
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
        trendType: 'positive',
        icon: 'account_balance_wallet'
      },
      { 
        name: 'Daromad prognozi', 
        value: '28,500,000 so\'m',
        confidence: 92,
        trend: '+3.1%',
        trendType: 'positive',
        icon: 'trending_up'
      },
      { 
        name: 'Bitimlar soni', 
        value: '12',
        target: '15',
        progress: 80,
        trend: '+2',
        trendType: 'positive',
        icon: 'handshake'
      },
      { 
        name: 'Jami daromad', 
        value: '25,450,000 so\'m',
        trend: '+8.5%',
        trendType: 'positive',
        icon: 'attach_money'
      },
      { 
        name: 'Narx raqobatbardoshligi', 
        value: 'Top 15%',
        trend: '+2%',
        trendType: 'positive',
        icon: 'price_check'
      },
      { 
        name: 'Fikr-mulohaza reytingi', 
        value: '4.7',
        trend: '+0.2',
        trendType: 'positive',
        icon: 'star'
      }
    ],
    feedback: {
      rating: 4.7,
      totalReviews: 23,
      recentReviews: 5,
      positive: 'Mijozlar sizning tez javoblaringiz va sifatli materiallaringizni yaxshi ko\'rishadi.',
      issue: 'Ba\'zi fikr-mulohazalar yetkazib berishda vaqtincha kechikishlarni eslatib o\'tadi.',
      sentiment: {
        positive: 78,
        neutral: 17,
        negative: 5
      }
    },
    goal: {
      title: '2 ta ko\'proq buyurtmani yopish → bu hafta TOP-10 yetkazib beruvchilar orasiga kirish',
      progress: 66,
      current: 8,
      target: 10,
      deadline: '2024-08-20',
      priority: 'high'
    },
    performance: {
      responseTime: 4.2,
      marketAverage: 1.5,
      winRate: 68,
      marketWinRate: 45,
      customerSatisfaction: 4.7,
      marketSatisfaction: 4.2
    }
  });

  const periods = [
    { key: 'Today', label: 'Bugun' },
    { key: 'Week', label: 'Hafta' },
    { key: 'Month', label: 'Oy' },
    { key: 'Quarter', label: 'Chorak' },
    { key: 'Year', label: 'Yil' },
    { key: 'Custom', label: 'Maxsus' }
  ];

  // Real-time data fetching
  useEffect(() => {
    fetchAnalyticsData();
    
    // Set up real-time updates every 30 seconds
    intervalRef.current = setInterval(() => {
      fetchRealTimeUpdates();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Real API call
      // const response = await api.get(`/seller/analytics?period=${selectedPeriod}`);
      // setAnalyticsData(response.data);
      
      // Mock data with realistic updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
  };

  const fetchRealTimeUpdates = async () => {
    try {
      // Real API call for real-time updates
      // const response = await api.get('/seller/analytics/realtime');
      // setRealTimeData(response.data);
      
      // Mock real-time updates
      setAnalyticsData(prev => ({
        ...prev,
        metrics: prev.metrics.map(metric => ({
          ...metric,
          value: metric.name === 'Bitimlar soni' 
            ? (parseInt(metric.value) + Math.floor(Math.random() * 2)).toString()
            : metric.value
        }))
      }));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching real-time updates:', error);
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleSettings = () => {
    navigate('/seller/analytics-settings');
  };

  const handleSeeDetails = () => {
    navigate('/seller/analytics-deep-dive');
  };

  const handleLearnMore = () => {
    navigate('/seller/insights-guide');
  };

  const handleInsightAction = (insight) => {
    if (insight.actionable) {
      switch (insight.type) {
        case 'warning':
          navigate('/seller/response-time-optimization');
          break;
        case 'positive':
          navigate('/seller/success-strategies');
          break;
        default:
          navigate('/seller/insights-details');
      }
    }
  };

  const handleMetricClick = (metric) => {
    navigate(`/seller/metric-details/${metric.name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }, (_, index) => (
          <span key={index} className="material-symbols-outlined text-yellow-500">star</span>
        ))}
        {hasHalfStar && (
          <span className="material-symbols-outlined text-yellow-500">star_half</span>
        )}
        {Array.from({ length: 5 - Math.ceil(rating) }, (_, index) => (
          <span key={index} className="material-symbols-outlined text-gray-300">star</span>
        ))}
      </div>
    );
  };

  const getTrendIcon = (trendType) => {
    switch (trendType) {
      case 'positive':
        return 'trending_up';
      case 'negative':
        return 'trending_down';
      default:
        return 'trending_flat';
    }
  };

  const getTrendColor = (trendType) => {
    switch (trendType) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diff = now - lastUpdated;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Hozir yangilandi';
    if (minutes === 1) return '1 daqiqa oldin yangilandi';
    return `${minutes} daqiqa oldin yangilandi`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analitika ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-b from-[#5E5CE6] to-[#4583f8] pb-3 shadow-md text-white">
        <div className="flex items-center justify-between p-4">
          <div className="w-8"></div>
          <h1 className="text-white text-3xl font-bold text-center flex-1">Analitika</h1>
          <button 
            onClick={handleSettings}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">settings</span>
          </button>
        </div>
        
        <div className="px-4">
          <div className="flex space-x-1 rounded-full bg-white/20 p-1">
            {periods.map((period) => (
              <button
                key={period.key}
                onClick={() => handlePeriodChange(period.key)}
                className={`flex-1 rounded-full py-1.5 text-center text-sm font-medium transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-white text-[#5E5CE6] font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="px-4 pt-2">
          <div className="flex items-center justify-center gap-2 text-white/80 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{formatLastUpdated()}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4">
        <div className="space-y-6">
          {/* Insights */}
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Asosiy ko'rsatkichlar</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {analyticsData.insights.length} ta
              </span>
            </div>
            {analyticsData.insights.map((insight, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${index > 0 ? 'mt-3' : ''}`}
                onClick={() => handleInsightAction(insight)}
              >
                <div className="flex-shrink-0">
                  <span className={`material-symbols-outlined ${insight.iconColor} text-3xl`}>
                    {insight.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{insight.title}</p>
                    {insight.actionable && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Amal qilish mumkin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{insight.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.impact === 'high' ? 'Yuqori ta\'sir' :
                       insight.impact === 'medium' ? 'O\'rta ta\'sir' : 'Past ta\'sir'}
                    </span>
                  </div>
                </div>
                {insight.actionable && (
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                )}
              </div>
            ))}
            <button 
              onClick={handleLearnMore}
              className="mt-4 text-sm font-semibold text-[#5E5CE6] hover:text-[#4B4ACD] transition-colors"
            >
              Batafsil ma'lumot →
            </button>
          </div>

          {/* Key Metrics */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Asosiy ko'rsatkichlar</h2>
            <div className="mt-3 grid grid-cols-2 gap-4">
              {analyticsData.metrics.map((metric, index) => (
                <div 
                  key={index} 
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleMetricClick(metric)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="material-symbols-outlined text-gray-400 text-lg">
                      {metric.icon}
                    </span>
                    {metric.trend && (
                      <div className={`flex items-center ${getTrendColor(metric.trendType)}`}>
                        <span className="material-symbols-outlined text-sm">
                          {getTrendIcon(metric.trendType)}
                        </span>
                        <p className="text-xs font-bold ml-1">{metric.trend}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  
                  {/* Progress bar for metrics with targets */}
                  {metric.progress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Jarayon</span>
                        <span>{metric.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-[#5E5CE6] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${metric.progress}%` }}
                        ></div>
                      </div>
                      {metric.target && (
                        <p className="text-xs text-gray-500 mt-1">
                          Maqsad: {metric.target}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Confidence indicator for forecasts */}
                  {metric.confidence && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Ishonchlilik</span>
                        <span>{metric.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-green-500 h-1 rounded-full transition-all duration-500"
                          style={{ width: `${metric.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Customer Feedback */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mijoz fikr-mulohazasi</h2>
            <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <p className="text-5xl font-bold text-gray-900">{analyticsData.feedback.rating}</p>
                  {renderStars(analyticsData.feedback.rating)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {analyticsData.feedback.totalReviews} ta sharh asosida
                  </p>
                  <p className="text-xs text-gray-400">
                    {analyticsData.feedback.recentReviews} ta yangi sharh
                  </p>
                </div>
              </div>

              {/* Sentiment breakdown */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Sentiment tahlili</span>
                </div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500"
                    style={{ width: `${analyticsData.feedback.sentiment.positive}%` }}
                  ></div>
                  <div 
                    className="bg-yellow-500"
                    style={{ width: `${analyticsData.feedback.sentiment.neutral}%` }}
                  ></div>
                  <div 
                    className="bg-red-500"
                    style={{ width: `${analyticsData.feedback.sentiment.negative}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span className="text-green-600">{analyticsData.feedback.sentiment.positive}% ijobiy</span>
                  <span className="text-yellow-600">{analyticsData.feedback.sentiment.neutral}% neytral</span>
                  <span className="text-red-600">{analyticsData.feedback.sentiment.negative}% salbiy</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-green-600">Eng ijobiy:</span> {analyticsData.feedback.positive}
                </p>
                <p>
                  <span className="font-semibold text-orange-600">Asosiy muammo:</span> {analyticsData.feedback.issue}
                </p>
              </div>
            </div>
          </div>

          {/* Next Goal */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Keyingi maqsad</h2>
            <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800">{analyticsData.goal.title}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  analyticsData.goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                  analyticsData.goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {analyticsData.goal.priority === 'high' ? 'Yuqori' :
                   analyticsData.goal.priority === 'medium' ? 'O\'rta' : 'Past'} ustuvorlik
                </span>
              </div>
              
              <div className="mt-3 h-3 w-full rounded-full bg-gray-200">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-[#5E5CE6] to-[#4583f8] transition-all duration-500"
                  style={{ width: `${analyticsData.goal.progress}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-medium text-[#5E5CE6]">
                  {analyticsData.goal.current}/{analyticsData.goal.target} buyurtma
                </p>
                <p className="text-xs text-gray-500">
                  Muddati: {new Date(analyticsData.goal.deadline).toLocaleDateString('uz-UZ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
        <div className="p-4">
          <button 
            onClick={handleSeeDetails}
            className="w-full rounded-xl bg-[#5E5CE6] py-4 text-center text-base font-bold text-white shadow-lg shadow-purple-500/30 hover:bg-opacity-90 transition-all"
          >
            Batafsil ko'rish
          </button>
        </div>
        
        <div className="flex justify-around border-t border-gray-200 py-2">
          <button 
            onClick={() => navigate('/seller/dashboard')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5E5CE6] transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs">Bosh sahifa</span>
          </button>
          <button 
            onClick={() => navigate('/seller/requests')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5E5CE6] transition-colors"
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs">So'rovlar</span>
          </button>
          <button 
            onClick={() => navigate('/seller/products')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5E5CE6] transition-colors"
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-xs">Mahsulotlar</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#5E5CE6]">
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="text-xs font-semibold">Analitika</span>
          </button>
          <button 
            onClick={() => navigate('/seller/profile')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5E5CE6] transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SellerAnalyticsSummary;