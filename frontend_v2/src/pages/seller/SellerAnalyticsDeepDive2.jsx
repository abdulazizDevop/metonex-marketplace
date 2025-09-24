import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerAnalyticsDeepDive2 = () => {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const metrics = [
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
    },
    {
      id: 'forecast',
      title: 'Revenue Forecast',
      value: '$135k',
      change: 'Projected',
      trend: 'up',
      color: 'text-blue-500'
    }
  ];

  const insights = [
    {
      icon: 'insights',
      title: 'High Average Order Value',
      description: 'Your AOV is 15% above competitors. Leverage this by offering premium bundles.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-[#a35ee8]'
    },
    {
      icon: 'bolt',
      title: 'Exceptional Response Time',
      description: 'Customers appreciate your quick replies. This is a key driver of your high conversion rate.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-[#a35ee8]'
    }
  ];

  const recommendations = [
    {
      icon: 'inventory_2',
      title: 'Introduce Product Bundles',
      description: 'Create curated packages to further increase your average order value.',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: 'support_agent',
      title: 'Highlight Fast Support',
      description: 'Prominently feature your excellent response time to build trust with new buyers.',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  const skuData = [
    { name: 'Cement', percentage: 35, color: 'bg-blue-800' },
    { name: 'Steel Beams', percentage: 25, color: 'bg-blue-600' },
    { name: 'Pipes', percentage: 20, color: 'bg-blue-500' },
    { name: 'Wiring', percentage: 10, color: 'bg-orange-500' },
    { name: 'Tools', percentage: 5, color: 'bg-amber-400' },
    { name: 'Other', percentage: 5, color: 'bg-amber-200' }
  ];

  const funnelData = [
    { stage: 'Requests', percentage: 100, loss: 0 },
    { stage: 'Responses', percentage: 85, loss: 15 },
    { stage: 'Orders', percentage: 50, loss: 35 },
    { stage: 'Paid', percentage: 40, loss: 10 }
  ];

  const lostSalesData = [
    { reason: 'High Price', percentage: 40 },
    { reason: 'Slow Response', percentage: 30 },
    { reason: 'Out of Stock', percentage: 20 },
    { reason: 'Other', percentage: 10 }
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleSettings = () => {
    navigate('/seller/settings');
  };

  const handleAIConsultant = () => {
    navigate('/ai-consultant-chat');
  };

  const handleDynamicMetrics = () => {
    navigate('/all-metrics-dynamic-view');
  };

  const handleDetailedView = () => {
    navigate('/sku-revenue-details');
  };

  const handleLoyaltyBonus = () => {
    // Implement loyalty bonus logic
    console.log('Implementing loyalty bonus for repeat buyers');
  };

  const renderTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <span className="material-symbols-outlined text-base">arrow_drop_up</span>;
      case 'down':
        return <span className="material-symbols-outlined text-base">arrow_drop_down</span>;
      case 'neutral':
        return <span className="material-symbols-outlined text-base">horizontal_rule</span>;
      default:
        return <span className="material-symbols-outlined text-base">trending_up</span>;
    }
  };

  const renderPieChart = () => {
    const colors = ['#1D4ED8', '#2563EB', '#3B82F6', '#F97316', '#FBBF24', '#FDE68A'];
    let cumulativePercentage = 0;
    
    return (
      <div className="pie-chart relative">
        {skuData.map((item, index) => {
          const startAngle = (cumulativePercentage / 100) * 360;
          const endAngle = ((cumulativePercentage + item.percentage) / 100) * 360;
          cumulativePercentage += item.percentage;
          
          return (
            <div
              key={index}
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${colors[index]} ${startAngle}deg ${endAngle}deg, transparent ${endAngle}deg)`
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between group/design-root overflow-x-hidden bg-[#f7f5f9]">
      <div>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-blue-500 py-4 px-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBack}
              className="flex size-8 items-center justify-center hover:bg-white/20 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <h1 className="text-xl font-bold">Seller Analytics</h1>
            <button 
              onClick={handleSettings}
              className="flex size-8 items-center justify-center hover:bg-white/20 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          {/* AI Deep Dive Report */}
          <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#140e1b]">AI Deep Dive Report</h2>
            <p className="mt-1 text-sm text-[#5a5361]">Your AI-powered insights for maximizing sales and customer satisfaction.</p>
            
            <div className="mt-4 space-y-4">
              {/* Insights */}
              <div>
                <h3 className="font-semibold text-[#140e1b]">Insights</h3>
                <div className="mt-2 space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${insight.bgColor} ${insight.iconColor}`}>
                        <span className="material-symbols-outlined">{insight.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#140e1b]">{insight.title}</p>
                        <p className="text-sm text-[#5a5361]">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-semibold text-[#140e1b]">Recommendations</h3>
                <div className="mt-2 space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${rec.bgColor} ${rec.iconColor}`}>
                        <span className="material-symbols-outlined">{rec.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#140e1b]">{rec.title}</p>
                        <p className="text-sm text-[#5a5361]">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleAIConsultant}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#a35ee8] py-3 text-sm font-bold text-white hover:bg-[#8e4dd1] transition-colors"
            >
              <span className="material-symbols-outlined">smart_toy</span>
              Ask AI Consultant
            </button>
          </section>

          {/* Metrics & Charts */}
          <h2 className="px-4 pb-3 pt-2 text-xl font-bold text-[#140e1b]">Metrics & Charts</h2>
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-[#5a5361]">{metric.title}</p>
                <p className={`text-2xl font-bold ${metric.valueColor || 'text-[#140e1b]'}`}>
                  {metric.value}
                </p>
                <p className={`flex items-center text-sm font-medium ${metric.color}`}>
                  {renderTrendIcon(metric.trend)}
                  <span>{metric.change}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Dynamic Metrics Button */}
          <div className="mt-4">
            <button 
              onClick={handleDynamicMetrics}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-600 transition-colors"
            >
              <span className="material-symbols-outlined">timeline</span>
              View Dynamic Metrics
            </button>
          </div>

          {/* Charts Grid */}
          <div className="mt-4 grid grid-cols-1 gap-4">
            {/* Revenue by SKU */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-[#140e1b]">Revenue by SKU</p>
                <button 
                  onClick={handleDetailedView}
                  className="flex items-center gap-1 text-sm text-[#a35ee8] hover:text-[#8e4dd1] transition-colors"
                >
                  <span>Detailed View</span>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              <div className="mt-4 flex flex-col items-center justify-center gap-6">
                <div className="pie-chart relative w-[150px] h-[150px] rounded-full overflow-hidden">
                  {renderPieChart()}
                </div>
                <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {skuData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`size-3 rounded-full ${item.color}`}></div>
                      <span className="font-medium text-[#140e1b]">
                        {item.name} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="mb-2 text-base font-medium text-[#140e1b]">Conversion Funnel</p>
              <div className="space-y-2">
                {funnelData.map((stage, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#5a5361]">{stage.stage}</p>
                      <p className="text-sm font-semibold text-[#140e1b]">
                        {stage.percentage}% 
                        {stage.loss > 0 && (
                          <span className="text-red-500"> (-{stage.loss}%)</span>
                        )}
                      </p>
                    </div>
                    <div className="relative h-2 rounded-full bg-purple-100">
                      <div 
                        className="absolute left-0 top-0 h-2 rounded-full bg-purple-500" 
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lost Sales Analysis */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h3 className="text-base font-medium text-[#140e1b]">Lost Sales Analysis</h3>
              <p className="text-2xl font-bold text-red-500">$15,000</p>
              <div className="mt-2 space-y-1 text-sm">
                {lostSalesData.map((item, index) => (
                  <p key={index}>
                    <span className="font-semibold">{item.reason}:</span> {item.percentage}%
                  </p>
                ))}
              </div>
            </div>

            {/* Response Time Trends */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h3 className="text-base font-medium text-[#140e1b]">Response Time Trends</h3>
              <p className="text-sm text-[#5a5361]">vs. Competitors</p>
              <div className="mt-4 h-40">
                <svg 
                  fill="none" 
                  height="100%" 
                  preserveAspectRatio="none" 
                  viewBox="0 0 300 100" 
                  width="100%" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M0 80 C 50 20, 100 60, 150 40 C 200 20, 250 80, 300 50" 
                    stroke="#a35ee8" 
                    strokeLinecap="round" 
                    strokeWidth="2"
                  />
                  <path 
                    d="M0 60 C 50 50, 100 70, 150 60 C 200 50, 250 70, 300 60" 
                    stroke="#cccccc" 
                    strokeDasharray="4 4" 
                    strokeLinecap="round" 
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="mt-2 flex justify-between text-xs text-[#5a5361]">
                <span>6m ago</span>
                <span>Now</span>
              </div>
            </div>

            {/* Customer Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <p className="text-sm font-medium text-[#5a5361]">Repeat Buyers</p>
                <p className="text-2xl font-bold text-[#140e1b]">30%</p>
              </div>
              <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <p className="text-sm font-medium text-[#5a5361]">Churn Rate</p>
                <p className="text-2xl font-bold text-red-500">15%</p>
              </div>
            </div>

            {/* Customer Rating */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-[#140e1b]">Customer Rating</h3>
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="text-lg font-bold">4.5</span>
                  <span className="material-symbols-outlined text-xl">star</span>
                </div>
              </div>
              <p className="text-sm text-[#5a5361]">Trend over last 3 months</p>
              <div className="mt-4 h-24">
                <svg 
                  fill="none" 
                  height="100%" 
                  preserveAspectRatio="none" 
                  viewBox="0 0 300 100" 
                  width="100%" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M0 60 C 100 20, 200 80, 300 50" 
                    stroke="#fbbf24" 
                    strokeLinecap="round" 
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <p className="mt-4 text-sm text-[#5a5361]">
                <span className="font-semibold text-[#140e1b]">AI Summary:</span> Customers love your product quality and fast delivery. Some mention pricing as a concern.
              </p>
              <button 
                onClick={handleLoyaltyBonus}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#a35ee8] py-2 text-sm font-bold text-[#a35ee8] hover:bg-[#a35ee8] hover:text-white transition-colors"
              >
                Offer loyalty bonus to repeat buyers
              </button>
            </div>
          </div>

          {/* Next Goal */}
          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#140e1b]">Next Goal</h3>
              <span className="material-symbols-outlined text-2xl text-amber-400">military_tech</span>
            </div>
            <p className="text-sm text-[#5a5361]">
              Reach $50k revenue this month to unlock the <span className="font-semibold text-[#a35ee8]">Top Supplier</span> badge!
            </p>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-2 flex-1 rounded-full bg-purple-100">
                <div className="h-2 rounded-full bg-[#a35ee8]" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm font-semibold text-[#140e1b]">$37.5k / $50k</p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white py-2">
        <nav className="flex justify-around">
          <button 
            onClick={() => navigate('/seller')}
            className="flex flex-col items-center gap-1 text-[#5a5361] hover:text-[#a35ee8] transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => navigate('/seller/my-requests')}
            className="flex flex-col items-center gap-1 text-[#5a5361] hover:text-[#a35ee8] transition-colors"
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs">Requests</span>
          </button>
          <button 
            onClick={() => navigate('/seller/add-product')}
            className="flex flex-col items-center gap-1 text-[#5a5361] hover:text-[#a35ee8] transition-colors"
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-xs">Products</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#a35ee8]">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-xs font-bold">Analytics</span>
          </button>
          <button 
            onClick={() => navigate('/seller/profile-1')}
            className="flex flex-col items-center gap-1 text-[#5a5361] hover:text-[#a35ee8] transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs">Profile</span>
          </button>
        </nav>
      </footer>
    </div>
  );
};

export default SellerAnalyticsDeepDive2;
