import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RSIPricing() {
  const [essentialPlan, setEssentialPlan] = useState('annual');
  const [executivePlan, setExecutivePlan] = useState('annual');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Asset Intelligence Management';
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleSelectPlan = () => {
    // Redirect to dashboard after selecting a plan
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header with user info and logout */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-700">
        <div className="text-white">
          <span className="text-sm">Welcome, </span>
          <span className="font-semibold">{user?.profile?.full_name || user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes buttonHover {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }
        
        .select-button:hover {
          animation: buttonHover 0.6s ease-in-out;
        }
        
        .pricing-container {
          display: flex;
          flex-direction: row;
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .pricing-card {
          flex: 1;
          min-width: 0;
        }
      `}</style>

      <div className="pt-12 pb-8 text-center">
        <h1
          className="text-7xl md:text-8xl font-light tracking-widest mb-2"
          style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.3em' }}
        >
          <span
            className="text-white"
            style={{ fontWeight: 300, textShadow: '0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.3)' }}
          >
            RSI{' '}
          </span>
          <span style={{ fontWeight: 300, color: '#E8D4B8' }}>ONE</span>
        </h1>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-light tracking-wider text-white" style={{ letterSpacing: '0.15em' }}>
          SOLUTION PRICING
        </h2>
      </div>

      <div className="pricing-container pb-16">
        <div className="pricing-card bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-normal tracking-wider mb-3" style={{ letterSpacing: '0.1em' }}>
            ESSENTIAL ACCESS
          </h3>

          <div className="mb-3">
            <span className="text-4xl font-bold text-black">
              ${essentialPlan === 'monthly' ? '478' : essentialPlan === 'annual' ? '367' : '299'}
            </span>
            <span className="text-base text-gray-500 ml-2">/month</span>
          </div>

          <p className="text-xs text-gray-600 mb-5">+ $350 Initial Onboarding Fee</p>

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-yellow-500 flex items-center justify-center">
                <span className="text-white text-xs">📁</span>
              </div>
              <span className="text-gray-800 text-xs">3 Assets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-yellow-500 flex items-center justify-center">
                <span className="text-white text-xs">👥</span>
              </div>
              <span className="text-gray-800 text-xs">3 Team Members</span>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            <button
              onClick={() => setEssentialPlan('monthly')}
              className={`w-full p-2.5 rounded-lg border-2 text-left transition-all ${
                essentialPlan === 'monthly' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black text-xs">Monthly</div>
                  <div className="text-xs text-gray-500">$478 / month</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    essentialPlan === 'monthly' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
                  }`}
                >
                  {essentialPlan === 'monthly' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </button>

            <button
              onClick={() => setEssentialPlan('annual')}
              className={`w-full p-2.5 rounded-lg border-2 text-left transition-all ${
                essentialPlan === 'annual' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black text-xs">Annual</div>
                  <div className="text-xs text-gray-500">$367 / month equivalent</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    essentialPlan === 'annual' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
                  }`}
                >
                  {essentialPlan === 'annual' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </button>

            <button
              onClick={() => setEssentialPlan('biannual')}
              className={`w-full p-2.5 rounded-lg border-2 text-left transition-all ${
                essentialPlan === 'biannual' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black text-xs">Bi-Annual</div>
                  <div className="text-xs text-gray-500">$299 / month equivalent</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    essentialPlan === 'biannual' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
                  }`}
                >
                  {essentialPlan === 'biannual' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </button>
          </div>

          <button
            className="select-button w-full bg-black text-white font-semibold py-3 rounded-lg transition-all tracking-wider text-xs hover:bg-gray-800 hover:shadow-lg"
            style={{ transition: 'all 0.3s ease' }}
            onClick={handleSelectPlan}
          >
            SELECT PLAN
          </button>
        </div>

        <div className="pricing-card bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-normal tracking-wider mb-3" style={{ letterSpacing: '0.1em' }}>
            EXECUTIVE ACCESS
          </h3>

          <div className="mb-3">
            <span className="text-4xl font-bold text-black">
              ${executivePlan === 'monthly' ? '999' : executivePlan === 'annual' ? '888' : '777'}
            </span>
            <span className="text-base text-gray-500 ml-2">/month</span>
          </div>

          <p className="text-xs text-gray-600 mb-5">+ $500 Initial Onboarding Fee</p>

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-yellow-500 flex items-center justify-center">
                <span className="text-white text-xs">⛵</span>
              </div>
              <span className="text-gray-800 text-xs">7 Assets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-yellow-500 flex items-center justify-center">
                <span className="text-white text-xs">👥</span>
              </div>
              <span className="text-gray-800 text-xs">7 Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-yellow-500 flex items-center justify-center">
                <span className="text-white text-xs">🎧</span>
              </div>
              <span className="text-gray-800 text-xs">24/7 Priority Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-yellow-500 flex items-center justify-center">
                <span className="text-white text-xs">🤝</span>
              </div>
              <span className="text-gray-800 text-xs">Dedicated Concierge</span>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            <button
              onClick={() => setExecutivePlan('monthly')}
              className={`w-full p-2.5 rounded-lg border-2 text-left transition-all ${
                executivePlan === 'monthly' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black text-xs">Monthly</div>
                  <div className="text-xs text-gray-500">$999 / month</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    executivePlan === 'monthly' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
                  }`}
                >
                  {executivePlan === 'monthly' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </button>

            <button
              onClick={() => setExecutivePlan('annual')}
              className={`w-full p-2.5 rounded-lg border-2 text-left transition-all ${
                executivePlan === 'annual' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black text-xs">Annual</div>
                  <div className="text-xs text-gray-500">$888 / month equivalent</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    executivePlan === 'annual' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
                  }`}
                >
                  {executivePlan === 'annual' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </button>

            <button
              onClick={() => setExecutivePlan('biannual')}
              className={`w-full p-2.5 rounded-lg border-2 text-left transition-all ${
                executivePlan === 'biannual' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black text-xs">Bi-Annual</div>
                  <div className="text-xs text-gray-500">$777 / month equivalent</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    executivePlan === 'biannual' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
                  }`}
                >
                  {executivePlan === 'biannual' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </button>
          </div>

          <button
            className="select-button w-full font-semibold py-3 rounded-lg transition-all tracking-wider text-black text-xs hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #c9a961 100%)',
              transition: 'all 0.3s ease',
            }}
            onClick={handleSelectPlan}
          >
            SELECT PLAN
          </button>
        </div>
      </div>
    </div>
  );
}

//testing psuh to github repository
