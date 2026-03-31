import React, { useEffect, useRef, useState } from 'react';

export default function RSINextSteps() {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    document.title = 'Asset Intelligence Management';
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((scrolled / maxScroll) * 100, 100);
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      year: 'Step 0',
      title: 'Access Confirmation',
      description:
        "Your payment will be verified within 48 hours and you'll receive confirmation of your access to RSI ONE.",
      position: 'left',
    },
    {
      year: 'Step 1',
      title: 'Authorize Initialization',
      description:
        "Book a meeting slot with us to initiate your onboard. Note: The call is necessary, and we suggest both the owner and the owner's management head to attend this call.",
      hasButton: true,
      position: 'right',
    },
    {
      year: 'Step 2',
      title: 'System Setup',
      description:
        'Our team will import the data to your system, and you would be ready to go. Onboarding time: 75 to 149 hours after our call.',
      position: 'left',
    },
    {
      year: 'Step 3',
      title: 'Start Saving Time',
      description:
        'Start taking benefit from this amazing tool and transform the way you manage your assets with RSI ONE.',
      position: 'right',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f5f5' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * { font-family: 'Inter', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        
        .nav-float { animation: float 4s ease-in-out infinite; }
        .fade-in { animation: fadeIn 0.8s ease forwards; }
        .pulse-dot { animation: pulse 2s ease-in-out infinite; }
        
        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            #000000 ${scrollProgress}%,
            rgba(0, 0, 0, 0.2) ${scrollProgress}%,
            rgba(0, 0, 0, 0.2) 100%
          );
          transition: all 0.3s ease;
        }
        
        .year-badge {
          font-size: 2rem;
          font-weight: 800;
          color: #000000;
          letter-spacing: -0.02em;
        }
        
        .step-circle {
          width: 20px;
          height: 20px;
          background: #d4af37;
          border-radius: 50%;
          flex-shrink: 0;
        }
      `}</style>

      <div className="text-center pt-12 mb-8 fade-in">
        <h1
          className="text-7xl md:text-8xl font-light tracking-widest mb-4"
          style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.3em' }}
        >
          <span className="text-black" style={{ fontWeight: 300 }}>
            RSI{' '}
          </span>
          <span style={{ fontWeight: 300, color: '#d4af37' }}>ONE</span>
        </h1>
        <p className="text-black text-sm tracking-wider opacity-70" style={{ letterSpacing: '0.25em' }}>
          ASSET INTELLIGENCE PLATFORM
        </p>
      </div>

      <h2
        className="text-5xl font-bold text-black text-center mb-20 fade-in"
        style={{ animationDelay: '0.2s', opacity: 0 }}
      >
        Next Steps
      </h2>

      <div ref={containerRef} className="flex-1 relative max-w-7xl mx-auto px-8 pb-20">
        <div className="timeline-line"></div>

        <div className="relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative mb-32 fade-in ${step.position === 'left' ? 'pr-[55%]' : 'pl-[55%]'}`}
              style={{ animationDelay: `${0.3 + index * 0.2}s`, opacity: 0 }}
            >
              <div className={`flex items-center gap-4 mb-6 ${step.position === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="step-circle pulse-dot" style={{ animationDelay: `${index * 0.3}s` }}></div>
                <h3 className="year-badge">{step.year}</h3>
              </div>

              <div
                className="bg-white rounded-3xl p-8 shadow-lg transition-all duration-500 relative"
                style={{
                  transform: hoveredStep === index ? 'translateY(-5px) scale(1.02)' : 'translateY(0)',
                  boxShadow:
                    hoveredStep === index
                      ? '0 20px 60px rgba(0, 0, 0, 0.15)'
                      : '0 10px 30px rgba(0, 0, 0, 0.08)',
                }}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <h3 className="text-2xl font-bold text-black mb-4" style={{ letterSpacing: '-0.01em' }}>
                  {step.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed mb-6">{step.description}</p>

                {step.hasButton && (
                  <button
                    className="w-full text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                    style={{
                      background: '#000000',
                      letterSpacing: '0.05em',
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #d4af37 0%, #c9a961 100%)';
                      e.target.style.color = '#ffffff';
                      e.target.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#000000';
                      e.target.style.color = '#ffffff';
                      e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4)';
                    }}
                  >
                    Authorize Initialization
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 z-50">
        <div className="max-w-2xl mx-auto px-4">
          <div
            className="backdrop-blur-xl rounded-full px-8 py-4 flex items-center justify-center gap-8 shadow-2xl nav-float transition-all duration-300"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {['Get Access', 'RSI', 'Support', 'News', 'App'].map((label) => (
              <button
                key={label}
                className="text-white hover:text-black transition-all duration-300 font-semibold px-4 py-2 rounded-xl"
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '1px' }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.color = '#000000';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#ffffff';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
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
