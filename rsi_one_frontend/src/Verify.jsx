import React, { useEffect, useRef, useState } from 'react';

export default function RSITwoStepVerification() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    document.title = 'Asset Intelligence Management';
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const verificationCode = code.join('');
    console.log('Verification code:', verificationCode);
    alert('Verification code submitted: ' + verificationCode);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E8D4B8' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            text-shadow: 0 0 30px rgba(255,255,255,0.4), 
                         0 0 60px rgba(255,255,255,0.3),
                         0 0 90px rgba(255,255,255,0.2);
          }
          50% { 
            text-shadow: 0 0 40px rgba(255,255,255,0.6), 
                         0 0 80px rgba(255,255,255,0.5),
                         0 0 120px rgba(255,255,255,0.3);
          }
        }
        
        .nav-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
        
        .glow-text {
          animation: glow 3s ease-in-out infinite;
        }
        
        .verification-input {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: textfield;
        }
        
        .verification-input::-webkit-outer-spin-button,
        .verification-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-12 fade-in">
          <h1
            className="text-7xl md:text-8xl font-light tracking-widest mb-4"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.3em' }}
          >
            <span className="text-black" style={{ fontWeight: 300 }}>
              RSI{' '}
            </span>
            <span style={{ fontWeight: 300, color: '#d4af37' }}>ONE</span>
          </h1>
          <p
            className="text-black text-sm tracking-wider opacity-70"
            style={{ letterSpacing: '0.25em' }}
          >
            ASSET INTELLIGENCE PLATFORM
          </p>
        </div>

        <div className="w-full max-w-lg fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="text-center mb-8">
            <h2
              className="text-2xl font-normal tracking-wider text-black mb-3"
              style={{ letterSpacing: '0.15em' }}
            >
              TWO-STEP VERIFICATION
            </h2>
            <p className="text-black text-sm opacity-80">
              A 6-digit verification code has been<br />
              sent to your email.
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="verification-input w-14 h-14 text-center text-2xl font-semibold bg-white text-black rounded-xl border-2 border-gray-300 focus:outline-none focus:border-black transition-all"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                }}
              />
            ))}
          </div>

          <button
            onClick={handleConfirm}
            className="w-full text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 mb-6"
            style={{
              background: '#000000',
              letterSpacing: '0.1em',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.5)';
              e.target.style.background = '#ffffff';
              e.target.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              e.target.style.background = '#000000';
              e.target.style.color = '#ffffff';
            }}
          >
            CONFIRM &amp; SAVE LOGIN INFO
          </button>

          <div className="text-center">
            <p className="text-black text-sm">
              Didn't receive a code?{' '}
              <button className="underline font-semibold hover:opacity-70 transition-all">Resend</button>
            </p>
          </div>
        </div>
      </div>

      <div className="pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <div
            className="backdrop-blur-xl rounded-full px-8 py-4 flex items-center justify-center gap-8 shadow-2xl nav-float transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
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
