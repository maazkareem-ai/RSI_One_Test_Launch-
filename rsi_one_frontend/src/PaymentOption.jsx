import React, { useEffect, useState } from 'react';

export default function RSIPaymentOptions() {
  const [selectedPayment, setSelectedPayment] = useState('visa');
  const [stars, setStars] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.title = 'Asset Intelligence Management';
  }, []);

  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 300; i++) {
      newStars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.3,
        animationDelay: Math.random() * 3,
      });
    }
    setStars(newStars);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * 20;
  const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * 20;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.3), 0 0 90px rgba(255,255,255,0.2); }
          50% { text-shadow: 0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.5), 0 0 120px rgba(255,255,255,0.3); }
        }
        
        .star { animation: twinkle 3s ease-in-out infinite; }
        .nav-float { animation: float 4s ease-in-out infinite; }
        .title-appear { animation: fadeInDown 1s ease forwards; }
        .form-appear { animation: fadeInUp 1s ease forwards 0.3s; opacity: 0; }
        .nav-appear { animation: fadeInUp 1s ease forwards 0.6s; opacity: 0; }
        .glow-text { animation: glow 3s ease-in-out infinite; }
      `}</style>

      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
      >
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.animationDelay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-8">
        <div className="text-center mb-8 title-appear">
          <h1
            className="text-7xl md:text-8xl font-light tracking-widest mb-4"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.3em' }}
          >
            <span className="text-white glow-text" style={{ fontWeight: 300 }}>
              RSI{' '}
            </span>
            <span style={{ fontWeight: 300, color: '#E8D4B8' }}>ONE</span>
          </h1>
          <p className="text-white text-sm tracking-wider opacity-70" style={{ letterSpacing: '0.25em' }}>
            ASSET INTELLIGENCE PLATFORM
          </p>
        </div>

        <div className="w-full max-w-md mb-6 form-appear">
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-gray-300 transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h2 className="text-xl font-light tracking-wider text-white" style={{ letterSpacing: '0.15em' }}>
              PAYMENT OPTIONS
            </h2>
          </div>
        </div>

        <div className="w-full max-w-md mb-6 form-appear">
          <div className="rounded-2xl p-6 text-white border-2" style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium" style={{ color: '#E8D4B8' }}>
                RSI ONE EXECUTIVE - ANNUAL
              </span>
              <span className="text-sm font-semibold" style={{ color: '#E8D4B8' }}>
                $10,656.00
              </span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b" style={{ borderColor: '#2a2a2a' }}>
              <span className="text-sm" style={{ color: '#E8D4B8', opacity: 0.8 }}>
                Taxes &amp; Fees
              </span>
              <span className="text-sm" style={{ color: '#E8D4B8', opacity: 0.8 }}>
                $344.00
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg" style={{ color: '#E8D4B8' }}>
                Total
              </span>
              <span className="font-semibold text-lg" style={{ color: '#E8D4B8' }}>
                $11,000.00
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mb-6 form-appear">
          <h3 className="text-sm font-medium tracking-wider text-white mb-4" style={{ letterSpacing: '0.1em' }}>
            SELECT PAYMENT METHOD
          </h3>

          {[
            { key: 'googlepay', label: 'Google Pay', badge: 'G', badgeClass: 'bg-blue-500' },
            { key: 'paypal', label: 'PayPal', badge: 'P', badgeClass: 'bg-blue-600' },
            { key: 'visa', label: 'Visa Card', badge: 'V', badgeClass: 'bg-blue-500' },
          ].map((opt, idx) => (
            <button
              key={opt.key}
              onClick={() => setSelectedPayment(opt.key)}
              className={`w-full ${idx < 2 ? 'mb-3' : 'mb-6'} p-4 rounded-xl border-2 text-left transition-all ${
                selectedPayment === opt.key ? '' : 'border-gray-200 bg-white'
              }`}
              style={selectedPayment === opt.key ? { backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${opt.badgeClass} rounded flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{opt.badge}</span>
                  </div>
                  <span className={`font-medium ${selectedPayment === opt.key ? 'text-white' : 'text-black'}`}>
                    {opt.label}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === opt.key ? 'border-yellow-500 bg-yellow-500' : 'border-gray-400'
                  }`}
                >
                  {selectedPayment === opt.key && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </button>
          ))}

          <button
            className="w-full text-black font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 mb-4"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #c9a961 100%)',
              letterSpacing: '0.1em',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
            }}
          >
            🔒 CONFIRM TO GET ACCESS
          </button>

          <p className="text-center text-xs text-gray-400">
            By completing this purchase, you agree to our{' '}
            <button className="text-white underline hover:text-gray-300">Terms of Service</button> and{' '}
            <button className="text-white underline hover:text-gray-300">Privacy Policy</button>
          </p>
        </div>
      </div>

      <div className="relative z-10 pb-8 nav-appear">
        <div className="max-w-2xl mx-auto px-4">
          <div
            className="backdrop-blur-xl rounded-full px-8 py-4 flex items-center justify-center gap-8 shadow-2xl nav-float transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {['RSI', 'Get Access', 'Support', 'News', 'App'].map((label) => (
              <button
                key={label}
                className={`font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${
                  label === 'Get Access' ? 'text-black' : 'text-white'
                }`}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '1px',
                  background:
                    label === 'Get Access' ? 'linear-gradient(135deg, #d4af37 0%, #c9a961 100%)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (label === 'Get Access') {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.5)';
                  } else {
                    e.target.style.background = '#ffffff';
                    e.target.style.color = '#000000';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (label === 'Get Access') {
                    e.target.style.background = 'linear-gradient(135deg, #d4af37 0%, #c9a961 100%)';
                    e.target.style.color = '#000000';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  } else {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#ffffff';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
