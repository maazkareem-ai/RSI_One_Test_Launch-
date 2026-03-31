import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, TrendingUp, Send, Clock, Menu, Zap, Maximize2 } from 'lucide-react';

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
};

type Ripple = {
  x: number;
  y: number;
  id: number;
};

export default function RSIDashboard() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [speedometerProgress, setSpeedometerProgress] = useState(0);

  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      newStars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        animationDelay: Math.random() * 3
      });
    }
    setStars(newStars);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const duration = 2500;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setSpeedometerProgress(eased * 0.85);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [isLoaded]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const assets = [
    {
      type: 'PRIMARY ASSET',
      name: 'Gulfstream G700',
      location: 'Teterboro, NJ',
      detail: 'Range: 7,500 nm',
      status: 'READY',
      statusColor: '#22c55e',
      count: '01 / 12'
    },
    {
      type: 'VESSEL',
      name: 'Benetti FB803',
      location: 'Monaco',
      detail: 'Length: 351 ft',
      status: 'DOCKED',
      statusColor: '#3b82f6',
      count: '02 / 12'
    },
    {
      type: 'ESTATE',
      name: 'Wayne Manor',
      location: 'Gotham, NY',
      detail: 'Area: 42,500 sq ft',
      status: 'ACTIVE',
      statusColor: '#8b5cf6',
      count: '03 / 12'
    }
  ];

  const currentAsset = assets[currentAssetIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAssetIndex((prev) => (prev + 1) % assets.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const parallaxX = -(mousePosition.x / (typeof window !== 'undefined' ? window.innerWidth : 1920) - 0.5) * 10;
  const parallaxY = -(mousePosition.y / (typeof window !== 'undefined' ? window.innerHeight : 1080) - 0.5) * 10;

  const efficiencyScore = 94;

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden relative rsi-dashboard" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translate3d(0, 20px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }

        @keyframes crossFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes needleSweep {
          0% { stroke-dashoffset: 126; }
          100% { stroke-dashoffset: var(--final-offset); }
        }
        
        .star {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .glass-entrance {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        .breathe-text {
          animation: breathe 6s ease-in-out infinite;
        }

        .btn-gold {
          background: linear-gradient(135deg, #d4af37 0%, #c9a961 100%);
          color: #000;
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-gold:hover {
          box-shadow: 0 0 25px rgba(212, 175, 55, 0.6);
          transform: translate3d(0, -4px, 0) scale(1.02);
        }

        .btn-white {
          background: #ffffff;
          color: #000;
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }
        .btn-white:hover {
          background: #000000;
          color: #ffffff;
          border-color: #ffffff;
        }

        .btn-black {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-black:hover {
          background: #ffffff;
          color: #000000;
        }

        .btn-beige {
          background: rgba(245, 245, 220, 0.1);
          color: #F5F5DC;
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-beige:hover {
          background: rgba(245, 245, 220, 0.2);
          box-shadow: inset 0 0 20px rgba(245, 245, 220, 0.3);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-outline:hover {
          border-color: rgba(212, 175, 55, 0.7);
          background: rgba(212, 175, 55, 0.1);
        }

        .efficiency-ring {
          animation: pulse 2s ease-in-out infinite;
        }

        .card-hover {
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .card-hover:hover {
          transform: translate3d(0, 0, 0) scale(1.01);
          border-color: rgba(245, 245, 220, 0.2) !important;
          box-shadow: 0 0 20px rgba(245, 245, 220, 0.1);
        }

        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.6);
          animation: ripple 600ms ease-out;
          pointer-events: none;
        }

        .asset-fade {
          animation: crossFade 0.5s ease-in-out;
        }

        /* Keep dashboard text crisp; removes ghosted/dupe-looking edges some GPUs add on dark blur surfaces */
        .rsi-dashboard {
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }
        .asset-text {
          text-shadow: none;
          filter: none;
        }

        .grain-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.02;
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="3" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
          background-repeat: repeat;
          z-index: 9999;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        ::-webkit-scrollbar-thumb {
          background: #F5F5DC;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #d4af37;
        }
      `}</style>

      {/* Grain Overlay */}
      <div className="grain-overlay"></div>

      {/* Starfield Background with Parallax */}
      <div
        className="fixed inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`
        }}
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
              animationDelay: `${star.animationDelay}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 backdrop-blur-2xl" style={{ background: 'rgba(0, 0, 0, 0.5)', borderBottom: '1px solid rgba(245, 245, 220, 0.15)' }}>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-light tracking-widest breathe-text" style={{ color: '#F5F5DC' }}>
            RSI <span style={{ color: '#F5F5DC' }}>ONE</span>
          </h1>
        </div>
        <div className="flex items-center gap-5">
          {/* Efficiency Score Ring */}
          <div className="relative w-10 h-10 efficiency-ring">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="rgba(34, 197, 94, 0.2)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#22c55e"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - efficiencyScore / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold" style={{ color: '#22c55e' }}>{efficiencyScore}</span>
            </div>
          </div>

          <button className="relative">
            <Bell size={18} style={{ color: '#F5F5DC' }} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: '#F5F5DC' }}></span>
          </button>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs" style={{ color: '#F5F5DC', letterSpacing: '0.1em' }}>MEMBER</div>
              <div className="text-xs font-medium" style={{ color: '#F5F5DC' }}>Bruce Wayne</div>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #c9a961 100%)', color: '#000' }}>BW</div>
          </div>

          <button className="p-2 hover:bg-white/5 rounded-lg transition-all">
            <Menu size={20} style={{ color: '#F5F5DC' }} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5">
        {/* Page Title */}
        <div className="mb-6" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.6s' }}>
          <h2 className="text-4xl font-bold mb-1" style={{ letterSpacing: '0.05em' }}>DASHBOARD</h2>
          <p className="text-xs" style={{ color: '#F5F5DC', letterSpacing: '0.15em' }}>TIME-EFFICIENCY COMMAND CENTER</p>
        </div>

        {/* Grid Layout - Fixed Overlap Architecture */}
        <div className="w-full" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 8px' }}>
          <div
            className="grid grid-cols-12 gap-6"
            style={{ rowGap: '12px' }}
          >

            {/* HERO ROW */}
            {/* Asset Window - LEFT (col-span-8) */}
            <div className="col-span-8 glass-entrance" style={{ animationDelay: isLoaded ? '0.1s' : '0s' }}>
              <div className="backdrop-blur-2xl rounded-2xl overflow-hidden border card-hover flex flex-col text-pad" style={{ background: 'rgba(0, 0, 0, 0.6)', borderColor: 'rgba(245, 245, 220, 0.15)', height: '520px' }}>
                <div className="relative bg-gradient-to-br from-gray-900 to-black asset-fade flex-1" key={currentAssetIndex}>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90"></div>
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-end">
                    <span className="text-sm font-light" style={{ color: "#F5F5DC" }}>{currentAsset.count}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="text-xs tracking-wider asset-text" style={{ color: "#F5F5DC", letterSpacing: "0.2em" }}>{currentAsset.type}</div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md" style={{ background: `${currentAsset.statusColor}20`, color: currentAsset.statusColor, border: `1px solid ${currentAsset.statusColor}40`, letterSpacing: "0.08em" }}>
                        {currentAsset.status}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-2 asset-text" style={{ letterSpacing: '0.02em' }}>{currentAsset.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-300 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} style={{ color: '#d4af37' }} />
                        <span>{currentAsset.location}</span>
                      </div>
                      <span className="text-gray-600">•</span>
                      <span>{currentAsset.detail}</span>
                    </div>
                    <div className="flex gap-2">
                      {assets.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentAssetIndex(idx)}
                          className={`h-1 rounded-full transition-all ${idx === currentAssetIndex ? 'w-8' : 'w-4'}`}
                          style={{ background: idx === currentAssetIndex ? '#d4af37' : '#4b5563' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <button className="w-full py-3 rounded-xl font-bold text-sm tracking-wider btn-gold" style={{ letterSpacing: '0.1em' }}>
                    MANAGE ASSETS
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - FLEX FIX (col-span-4) */}
            <div className="col-span-4 flex flex-col" style={{ gap: '16px', paddingTop: '4px' }}>

              {/* Action Required - Row 1 */}
              <div className="glass-entrance overflow-hidden" style={{ animationDelay: isLoaded ? '0.2s' : '0s' }}>
                <div className="backdrop-blur-2xl rounded-2xl p-5 border flex flex-col card-hover relative overflow-hidden text-pad" style={{ background: 'rgba(0, 0, 0, 0.6)', borderLeft: '4px solid #d4af37', borderTop: '1px solid rgba(245, 245, 220, 0.15)', borderRight: '1px solid rgba(245, 245, 220, 0.15)', borderBottom: '1px solid rgba(245, 245, 220, 0.15)', minHeight: '260px' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#d4af37' }}></div>
                    <span className="text-xs font-medium tracking-wider" style={{ color: '#d4af37', letterSpacing: '0.15em' }}>ACTION REQUIRED</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ letterSpacing: '0.02em' }}>Engine Inspection Cycle A</h3>
                  <p className="text-xs text-gray-400 mb-4">Scheduled maintenance due for G700 starboard engine.</p>
                  <div className="mb-4">
                    <div className="text-4xl font-bold mb-1">3</div>
                    <div className="text-xs text-gray-400 mb-2">days remaining</div>
                    <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
                      <div className="h-2 rounded-full" style={{ width: '70%', background: 'linear-gradient(90deg, #d4af37 0%, #c9a961 100%)' }}></div>
                    </div>
                  </div>
                  <button
                    className="w-full py-3 rounded-xl font-bold text-sm tracking-wider btn-white mt-4"
                    style={{ letterSpacing: '0.1em' }}
                    onClick={(e) => createRipple(e)}
                  >
                    APPROVE SCHEDULE
                  </button>
                  {ripples.map(ripple => (
                    <div
                      key={ripple.id}
                      className="ripple-effect"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 20,
                        height: 20
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Finance Graph - Row 2 */}
              <div className="glass-entrance overflow-hidden" style={{ animationDelay: isLoaded ? '0.3s' : '0s' }}>
                <div className="backdrop-blur-2xl rounded-2xl p-5 border h-full flex flex-col card-hover overflow-hidden text-pad" style={{ background: 'rgba(0, 0, 0, 0.6)', borderColor: 'rgba(245, 245, 220, 0.15)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium tracking-wider" style={{ color: '#F5F5DC', letterSpacing: '0.15em' }}>FINANCIALS</span>
                    <TrendingUp size={14} style={{ color: '#22c55e' }} />
                  </div>
                  <div className="mb-4">
                    <div className="text-2xl font-bold mb-1">$450,290</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Monthly Spend</span>
                      <span style={{ color: '#22c55e' }}>+ 5.2%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 h-20 items-end mb-auto">
                    {[
                      { height: 40, color: '#ef4444' },
                      { height: 60, color: '#3b82f6' },
                      { height: 45, color: '#ef4444' },
                      { height: 70, color: '#3b82f6' },
                      { height: 55, color: '#22c55e' },
                      { height: 85, color: '#22c55e' },
                      { height: 100, color: '#22c55e' }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80" style={{
                        height: `${bar.height}%`,
                        background: bar.color
                      }}></div>
                    ))}
                  </div>
                  <button className="w-full py-3 rounded-xl font-bold text-sm tracking-wider btn-black mt-4" style={{ letterSpacing: '0.1em' }}>
                    SEE MORE
                  </button>
                </div>
              </div>

            </div>

            {/* OPERATIONS ROW - with explicit row gap buffer */}
            {/* Usage Logs - LEFT (col-span-4) */}
            <div className="col-span-4 glass-entrance" style={{ animationDelay: isLoaded ? '0.4s' : '0s' }}>
              <div className="backdrop-blur-2xl rounded-2xl p-5 border card-hover text-pad" style={{ background: 'rgba(0, 0, 0, 0.6)', borderColor: 'rgba(245, 245, 220, 0.15)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#d4af37' }}></div>
                    <h3 className="text-xs font-medium tracking-wider" style={{ letterSpacing: '0.15em' }}>USAGE LOGS</h3>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-4 pb-3" style={{ borderBottom: '1px solid rgba(245, 245, 220, 0.1)' }}>
                    <div className="text-center">
                      <div className="text-xs" style={{ color: '#F5F5DC' }}>OCT</div>
                      <div className="text-2xl font-bold">12</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">LHR → JFK</span>
                        <span className="ml-auto px-2 py-0.5 rounded text-xs" style={{ background: '#064e3b', color: '#6ee7b7' }}>DONE</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">7h 20m flight time</div>
                      <div className="flex gap-1 h-8 items-end">
                        {[30, 50, 40, 60, 45, 70, 55].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t" style={{
                            height: `${h}%`,
                            background: i < 2 ? '#ef4444' : i < 5 ? '#3b82f6' : '#22c55e'
                          }}></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-3" style={{ borderBottom: '1px solid rgba(245, 245, 220, 0.1)' }}>
                    <div className="text-center">
                      <div className="text-xs" style={{ color: '#F5F5DC' }}>OCT</div>
                      <div className="text-2xl font-bold">02</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Monaco → Ibiza</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">3 Days voyage</div>
                      <div className="flex gap-2 items-center">
                        <div className="relative w-6 h-6">
                          <svg className="w-6 h-6 transform -rotate-90">
                            <circle cx="12" cy="12" r="10" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" fill="none" />
                            <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="63" strokeDashoffset="20" strokeLinecap="round" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-400">Activity: High</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 py-2 rounded-lg font-medium text-xs transition-all btn-outline"
                    onClick={() => navigate('/addyatchlog')}
                  >
                    + YACHT LOGS
                  </button>
                  <button
                    className="flex-1 py-2 rounded-lg font-medium text-xs transition-all btn-outline"
                    onClick={() => navigate('/addflightlog')}
                  >
                    + FLIGHT LOGS
                  </button>
                </div>
                <button className="w-full py-2 mt-2 rounded-lg font-medium text-xs transition-all btn-black">
                  EXPLORE ALL
                </button>
              </div>
            </div>

            {/* My Calendar - CENTER (col-span-3) */}
            <div className="col-span-3 glass-entrance" style={{ animationDelay: isLoaded ? '0.5s' : '0s' }}>
              <div className="backdrop-blur-2xl rounded-2xl p-5 border card-hover text-pad" style={{ background: 'rgba(0, 0, 0, 0.6)', borderColor: 'rgba(245, 245, 220, 0.15)' }}>
                <h3 className="text-xs font-medium tracking-wider mb-4" style={{ letterSpacing: '0.15em' }}>MY CALENDAR</h3>
                <div className="space-y-4 mb-4">
                  <div className="pb-3" style={{ borderBottom: '1px solid rgba(245, 245, 220, 0.1)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#d4af37' }}></div>
                      <span className="text-xs text-gray-400">Oct 20 - Oct 22</span>
                    </div>
                    <div className="font-medium text-sm mb-1">G700 Downtime</div>
                    <div className="text-xs text-gray-500 mb-2">Scheduled Maintenance</div>
                    <div className="flex gap-1">
                      <div className="h-1 flex-1 rounded" style={{ background: '#d4af37' }}></div>
                      <div className="h-1 flex-1 rounded bg-gray-700"></div>
                      <div className="h-1 flex-1 rounded bg-gray-700"></div>
                    </div>
                  </div>

                  <div className="pb-3" style={{ borderBottom: '1px solid rgba(245, 245, 220, 0.1)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                      <span className="text-xs text-gray-400">Oct 14</span>
                    </div>
                    <div className="font-medium text-sm mb-1">Deep Clean</div>
                    <div className="text-xs text-gray-500">Wayne Manor</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }}></div>
                      <span className="text-xs text-gray-400">Oct 28</span>
                    </div>
                    <div className="font-medium text-sm">Yacht Refuel</div>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl font-bold text-sm tracking-wider btn-black" style={{ letterSpacing: '0.1em' }}>
                  EDIT CALENDAR
                </button>
              </div>
            </div>

            {/* Time Savings Hub - RIGHT (col-span-5) */}
            <div className="col-span-5 glass-entrance" style={{ animationDelay: isLoaded ? '0.6s' : '0s' }}>
              <div className="backdrop-blur-2xl rounded-2xl p-5 border card-hover text-pad" style={{ background: 'rgba(0, 0, 0, 0.6)', borderColor: 'rgba(245, 245, 220, 0.15)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} style={{ color: '#22c55e' }} />
                    <span className="text-xs font-medium tracking-wider" style={{ color: '#F5F5DC', letterSpacing: '0.1em' }}>TIME SAVED</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} style={{ color: '#22c55e' }} />
                    <span className="text-sm font-bold" style={{ color: '#22c55e' }}>1.4x</span>
                  </div>
                </div>

                {/* Velocity Speedometer */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-4xl font-bold" style={{ color: '#22c55e' }}>847</div>
                      <div className="text-xs text-gray-400 tracking-wider">TOTAL HOURS</div>
                    </div>
                    <div className="relative w-32 h-16">
                      <svg className="w-32 h-16" viewBox="0 0 120 60">
                        <path
                          d="M 15,50 A 45,45 0 0,1 105,50"
                          fill="none"
                          stroke="rgba(34, 197, 94, 0.15)"
                          strokeWidth="10"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 15,50 A 45,45 0 0,1 105,50"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray="141.37"
                          strokeDashoffset={141.37 - (141.37 * speedometerProgress)}
                          style={{
                            filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.9))',
                            transition: 'stroke-dashoffset 2.5s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        />
                        <text x="60" y="45" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="bold">1.4x</text>
                      </svg>
                    </div>
                  </div>

                  {/* Large Area Chart */}
                  <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none" className="mb-4">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgba(34, 197, 94, 0.4)" />
                        <stop offset="50%" stopColor="rgba(34, 197, 94, 0.2)" />
                        <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                      </linearGradient>
                    </defs>
                    <path d="M0,75 L50,70 L100,65 L150,55 L200,58 L250,45 L300,38 L350,30 L400,25 L400,100 L0,100 Z" fill="url(#areaGradient)" />
                    <path d="M0,75 L50,70 L100,65 L150,55 L200,58 L250,45 L300,38 L350,30 L400,25" stroke="#22c55e" strokeWidth="2.5" fill="none" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))' }} />
                    <circle cx="0" cy="75" r="2.5" fill="#ef4444" />
                    <circle cx="50" cy="70" r="2.5" fill="#ef4444" />
                    <circle cx="100" cy="65" r="2.5" fill="#3b82f6" />
                    <circle cx="150" cy="55" r="2.5" fill="#3b82f6" />
                    <circle cx="200" cy="58" r="2.5" fill="#3b82f6" />
                    <circle cx="250" cy="45" r="2.5" fill="#22c55e" />
                    <circle cx="300" cy="38" r="2.5" fill="#22c55e" />
                    <circle cx="350" cy="30" r="2.5" fill="#22c55e" />
                    <circle cx="400" cy="25" r="3.5" fill="#22c55e" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.8))' }} />
                  </svg>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                      <div className="font-bold text-base" style={{ color: '#22c55e' }}>124h</div>
                      <div className="text-gray-400">This Month</div>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                      <div className="font-bold text-base" style={{ color: '#22c55e' }}>+18%</div>
                      <div className="text-gray-400">Velocity</div>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                      <div className="font-bold text-base" style={{ color: '#a78bfa' }}>32d</div>
                      <div className="text-gray-400">Avg/Month</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 rounded-lg font-medium text-xs tracking-wider btn-beige">
                    NEED HELP
                  </button>
                  <button className="py-2 rounded-lg font-medium text-xs tracking-wider btn-beige">
                    YOUR TEAM
                  </button>
                </div>
              </div>
            </div>

            {/* Team Chat - FULL WIDTH BOTTOM (col-span-12) */}
            <div className="col-span-12 glass-entrance" style={{ animationDelay: isLoaded ? '0.7s' : '0s' }}>
              <div className="backdrop-blur-2xl rounded-2xl p-5 border card-hover text-pad" style={{ background: 'rgba(0, 0, 0, 0.6)', borderColor: 'rgba(245, 245, 220, 0.15)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium tracking-wider" style={{ letterSpacing: '0.15em' }}>TEAM CONCIERGE</h3>
                  <div className="flex items-center gap-3">
                    <button className="p-1.5 hover:bg-white/5 rounded transition-all">
                      <Maximize2 size={16} style={{ color: '#F5F5DC' }} />
                    </button>
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-medium" style={{ background: 'rgba(212, 175, 55, 0.3)', borderColor: '#000' }}>JD</div>
                      <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-medium" style={{ background: 'rgba(212, 175, 55, 0.3)', borderColor: '#000' }}>MK</div>
                      <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-medium" style={{ background: 'rgba(212, 175, 55, 0.3)', borderColor: '#000' }}>+3</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="flex gap-3 items-start flex-1">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium" style={{ background: 'rgba(212, 175, 55, 0.3)' }}>JD</div>
                    <div className="backdrop-blur-md rounded-xl rounded-tl-none px-4 py-3 flex-1" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      <p className="text-sm text-gray-300">Flight plan to Tokyo updated. Departure confirmed for 0800 hours tomorrow.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start flex-1 justify-end">
                    <div className="rounded-xl rounded-tr-none px-4 py-3 max-w-md" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #c9a961 100%)', color: '#000' }}>
                      <p className="text-sm font-medium">Perfect, thanks for the update. Please confirm catering arrangements as well.</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                    placeholder="Type a message to your team..."
                    className="w-full backdrop-blur-md rounded-xl px-5 py-3 pr-12 text-sm focus:outline-none transition-all"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(245, 245, 220, 0.15)' }}
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 transition-all hover:scale-110" style={{ color: '#F5F5DC' }}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div> {/* end grid */}
        </div> {/* end overflow */}
      </div> {/* end main content */}
    </div>
  );
}
