import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RSIOneSignup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stars, setStars] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

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

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      setStatus('Please fill all fields.');
      return;
    }

    setStatus('');
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role: 'pilot',
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Signup failed');
      }

      setStatus('Signup successful. Redirecting...');
      setFullName('');
      setEmail('');
      setPassword('');
      navigate('/signup-success');
    } catch (err) {
      setStatus(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignUp();
    }
  };

  const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * 20;
  const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * 20;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
        
        .star {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .nav-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .title-appear {
          animation: fadeInDown 1s ease forwards;
        }
        
        .form-appear {
          animation: fadeInUp 1s ease forwards 0.3s;
          opacity: 0;
        }
        
        .nav-appear {
          animation: fadeInUp 1s ease forwards 0.6s;
          opacity: 0;
        }
        
        .glow-text {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${parallaxX}px, ${parallaxY}px)`,
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
              animationDelay: `${star.animationDelay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-12 title-appear">
          <h1
            className="text-8xl md:text-9xl font-light tracking-widest mb-4"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.3em' }}
          >
            <span className="text-white glow-text" style={{ fontWeight: 300 }}>
              RSI{' '}
            </span>
            <span style={{ fontWeight: 300, color: '#E8D4B8' }}>ONE</span>
          </h1>
          <p
            className="text-white text-sm tracking-wider opacity-70"
            style={{ letterSpacing: '0.25em' }}
          >
            ASSET INTELLIGENCE PLATFORM
          </p>
        </div>

        <div className="w-full max-w-md form-appear">
          <div
            className="backdrop-blur-xl border rounded-2xl p-10 shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <div className="mb-6">
              <label
                htmlFor="fullName"
                className="block text-white text-sm font-medium mb-2"
                style={{ letterSpacing: '0.05em' }}
              >
                FULL NAME
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your full name"
                className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                style={{
                  background: fullName ? '#E8D4B8' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontFamily: 'Inter, sans-serif',
                  color: fullName ? '#000000' : '#ffffff',
                }}
                onFocus={(e) => {
                  e.target.style.background = fullName ? '#f0e4d0' : 'rgba(255, 255, 255, 0.08)';
                  e.target.style.borderColor = fullName ? '#E8D4B8' : '#ffffff';
                  e.target.style.boxShadow = fullName
                    ? '0 0 0 3px rgba(232, 212, 184, 0.15)'
                    : '0 0 0 3px rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.background = fullName ? '#E8D4B8' : 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-white text-sm font-medium mb-2"
                style={{ letterSpacing: '0.05em' }}
              >
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                style={{
                  background: email ? '#E8D4B8' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontFamily: 'Inter, sans-serif',
                  color: email ? '#000000' : '#ffffff',
                }}
                onFocus={(e) => {
                  e.target.style.background = email ? '#f0e4d0' : 'rgba(255, 255, 255, 0.08)';
                  e.target.style.borderColor = email ? '#E8D4B8' : '#ffffff';
                  e.target.style.boxShadow = email
                    ? '0 0 0 3px rgba(232, 212, 184, 0.15)'
                    : '0 0 0 3px rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.background = email ? '#E8D4B8' : 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-white text-sm font-medium mb-2"
                style={{ letterSpacing: '0.05em' }}
              >
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Create a strong password"
                className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                style={{
                  background: password ? '#E8D4B8' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontFamily: 'Inter, sans-serif',
                  color: password ? '#000000' : '#ffffff',
                }}
                onFocus={(e) => {
                  e.target.style.background = password ? '#f0e4d0' : 'rgba(255, 255, 255, 0.08)';
                  e.target.style.borderColor = password ? '#E8D4B8' : '#ffffff';
                  e.target.style.boxShadow = password
                    ? '0 0 0 3px rgba(232, 212, 184, 0.15)'
                    : '0 0 0 3px rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.background = password ? '#E8D4B8' : 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              onClick={handleSignUp}
              className="w-full text-black font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden mb-4"
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #c9a961 100%)',
                letterSpacing: '0.1em',
                fontSize: '0.95rem',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                fontFamily: 'Inter, sans-serif',
              }}
              disabled={loading}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
              }}
            >
              {loading ? 'Signing up...' : 'NEXT STEP'}
            </button>

            {status && (
              <p className="text-center text-xs text-white opacity-80 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {status}
              </p>
            )}
            <p className="text-center text-xs text-white opacity-80 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-[#d4af37] hover:underline">
                Sign In
              </Link>
            </p>
            <p
              className="text-center text-xs text-white opacity-60"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              By creating an account, you agree to our{' '}
              <button className="text-[#d4af37] hover:underline">Terms of Service</button> and{' '}
              <button className="text-[#d4af37] hover:underline">Privacy Policy</button>
            </p>
          </div>
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
            <button
              className="font-semibold px-4 py-2 rounded-xl transition-all duration-300"
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '1px', color: '#d4af37' }}
            >
              Get Access
            </button>
            {['RSI', 'Support', 'News', 'App'].map((label) => (
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
