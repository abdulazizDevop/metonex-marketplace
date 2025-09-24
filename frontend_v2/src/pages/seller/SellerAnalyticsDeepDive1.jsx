import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerAnalyticsDeepDive1 = () => {
  const navigate = useNavigate();
  
  const [analyticsData] = useState({
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
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleBackToAnalytics = () => {
    navigate('/seller/analytics-summary');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScorePercentage = (score) => {
    return (score / analyticsData.maxScore) * 100;
  };

  const getStrokeDashoffset = (score) => {
    const circumference = 2 * Math.PI * 54; // radius = 54
    return circumference - (circumference * score / 100);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 py-3 px-4 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-[#1e293b] hover:text-[#334155]"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
            <span className="text-base font-semibold">Analytics</span>
          </button>
          <h1 className="text-lg font-bold text-[#1e293b]">Price Competitiveness</h1>
          <div className="w-12"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Current Score Section */}
        <section className="mb-6 flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-[#64748b]">Your Current Score</p>
          <div className="relative my-4 flex items-center justify-center">
            <svg className="h-40 w-40 transform -rotate-90" viewBox="0 0 120 120">
              <circle 
                className="text-gray-200" 
                cx="60" 
                cy="60" 
                fill="none" 
                r="54" 
                strokeWidth="12"
              />
              <circle 
                className={getScoreColor(analyticsData.currentScore)} 
                cx="60" 
                cy="60" 
                fill="none" 
                r="54" 
                stroke="currentColor" 
                strokeDasharray="339.292" 
                strokeDashoffset={getStrokeDashoffset(analyticsData.currentScore)} 
                strokeLinecap="round" 
                strokeWidth="12"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-[#1e293b]">{analyticsData.currentScore}</span>
              <span className="text-lg font-medium text-[#64748b]">/{analyticsData.maxScore}</span>
            </div>
          </div>
          <p className="text-center text-sm text-[#64748b]">{analyticsData.description}</p>
        </section>

        {/* Performance Over Time */}
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1e293b]">Performance Over Time</h2>
              <p className="text-sm text-[#64748b]">Last 30 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#7c3aed]"></div>
                <span>Your Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full border-2 border-dashed border-gray-400"></div>
                <span>Market Avg.</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-56">
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 224">
              {/* Grid lines */}
              <g className="text-gray-200">
                <line stroke="currentColor" strokeWidth="1" x1="0" x2="400" y1="44.8" y2="44.8"></line>
                <line stroke="currentColor" strokeWidth="1" x1="0" x2="400" y1="89.6" y2="89.6"></line>
                <line stroke="currentColor" strokeWidth="1" x1="0" x2="400" y1="134.4" y2="134.4"></line>
                <line stroke="currentColor" strokeWidth="1" x1="0" x2="400" y1="179.2" y2="179.2"></line>
              </g>
              
              {/* Market average line */}
              <polyline 
                fill="none" 
                points="0,67.2 400,67.2" 
                stroke="#9ca3af" 
                strokeDasharray="4 4" 
                strokeWidth="2"
              />
              
              {/* Your score line */}
              <polyline 
                className="stroke-[#7c3aed]" 
                fill="none" 
                points="20,89.6 80,67.2 140,56 200,78.4 260,44.8 320,56 380,33.6" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2.5"
              />
              
              {/* Data points */}
              <g className="fill-[#7c3aed]">
                <circle cx="20" cy="89.6" r="4"></circle>
                <circle cx="80" cy="67.2" r="4"></circle>
                <circle cx="140" cy="56" r="4"></circle>
                <circle cx="200" cy="78.4" r="4"></circle>
                <circle cx="260" cy="44.8" r="4"></circle>
                <circle cx="320" cy="56" r="4"></circle>
                <circle cx="380" cy="33.6" r="4"></circle>
              </g>
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute top-0 bottom-0 -left-1 flex flex-col justify-between text-right text-xs text-[#64748b] py-1.5" style={{ fontSize: '10px' }}>
              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2 text-center text-xs text-[#64748b]" style={{ fontSize: '10px' }}>
              <span>4w ago</span>
              <span>3w ago</span>
              <span>2w ago</span>
              <span>1w ago</span>
              <span>Today</span>
            </div>
          </div>
        </section>

        {/* How Score is Calculated */}
        <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-base font-bold text-[#1e293b]">How Your Score is Calculated</h2>
          <div className="mt-4 space-y-4">
            {analyticsData.calculationMethods.map((method, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#7c3aed]">
                  <span className="material-symbols-outlined text-base">{method.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e293b]">{method.title}</h3>
                  <p className="text-sm text-[#64748b]">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Metrics */}
        <section className="mt-6">
          <h2 className="px-4 pb-2 text-base font-bold text-[#1e293b]">Related Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            {analyticsData.relatedMetrics.map((metric, index) => (
              <div key={index} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-[#64748b]">{metric.name}</p>
                <p className={`text-3xl font-bold ${
                  metric.trendType === 'negative' ? 'text-red-500' : 'text-[#1e293b]'
                }`}>
                  {metric.value}
                </p>
                {metric.trend && (
                  <p className={`flex items-center text-sm font-medium ${
                    metric.trendType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <span className="material-symbols-outlined text-base">arrow_upward</span>
                    <span>{metric.trend}</span>
                  </p>
                )}
                {metric.period && (
                  <p className="text-sm text-[#64748b]">{metric.period}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Back Button */}
        <button 
          onClick={handleBackToAnalytics}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c3aed] py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#6d28d9] transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Analytics
        </button>
      </main>
    </div>
  );
};

export default SellerAnalyticsDeepDive1;