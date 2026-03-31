import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RSIOneLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [stars, setStars] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const handleSignIn = async () => {
    if (!email || !password) {
      setStatus('Please enter email and password.');
      return;
    }

    setStatus('');
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      // Store access token and user profile using auth context
      const token = data.session?.access_token;
      const user = data.user;
      if (token && user) {
        login(user, token, rememberMe);
        setStatus('Login successful. Redirecting...');
        navigate('/signin-success');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setStatus(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignIn();
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
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
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
        
        .gradient-shimmer {
          background: linear-gradient(
            90deg,
            #d4af37 0%,
            #f7e7ce 50%,
            #d4af37 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
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
                htmlFor="email"
                className="block text-white text-sm font-medium mb-2"
                style={{ letterSpacing: '0.05em' }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="your@email.com"
                className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.borderColor = '#ffffff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-white text-sm font-medium mb-2"
                style={{ letterSpacing: '0.05em' }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.borderColor = '#ffffff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2 focus:ring-white"
                  style={{ accentColor: '#ffffff' }}
                />
                <span className="ml-2 text-white text-sm opacity-80">Remember me</span>
              </label>
              <Link
                to="/forgot"
                className="text-white hover:text-gray-300 text-sm transition-all duration-300 font-medium"
                style={{ letterSpacing: '0.02em' }}
                onMouseEnter={(e) => {
                  e.target.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.textShadow = 'none';
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <p className="text-center text-xs text-white opacity-80 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Need an account?{' '}
              <Link to="/signup" className="text-[#d4af37] hover:underline">
                Sign Up
              </Link>
            </p>

            <button
              onClick={handleSignIn}
              className="w-full text-black font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
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
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
            {status && (
              <p className="text-center text-xs text-white opacity-80 mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                {status}
              </p>
            )}
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
