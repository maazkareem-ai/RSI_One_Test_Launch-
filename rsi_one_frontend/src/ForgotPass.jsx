import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RSIForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [step, setStep] = useState(1); // 1: email, 2: OTP
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Asset Intelligence Management ';
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

  const handleRequestOTP = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to send OTP');
      }

      alert('OTP sent to your email! Please check your inbox.');
      setStep(2);
    } catch (err) {
      alert(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const verificationCode = code.join('');
    
    if (!newPassword || !confirmPassword) {
      alert('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: verificationCode,
          newPassword
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Password reset failed');
      }

      alert('Password reset successful!');
      navigate('/password-reset-success');
    } catch (err) {
      alert(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
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
        
        .nav-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease forwards;
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

        <div className="w-full max-w-md fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="flex items-center gap-4 mb-6">
            <Link to="/login" className="text-black hover:opacity-70 transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <h2
              className="text-2xl font-normal tracking-wider text-black"
              style={{ letterSpacing: '0.15em' }}
            >
              FORGOT PASSWORD
            </h2>
          </div>

          <p className="text-black text-sm opacity-80 mb-8 text-center">
            {step === 1 
              ? "Enter your email address to receive a password reset OTP." 
              : "Enter the OTP sent to your email and set a new password."
            }
          </p>

          <div className="mb-6">
            <label
              className="block text-black text-xs font-medium mb-2 tracking-wider"
              style={{ letterSpacing: '0.05em' }}
            >
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="j***n@email.com"
              disabled={step === 2}
              className="w-full rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none transition-all duration-300 bg-white border-2 border-gray-300 focus:border-black disabled:bg-gray-100"
            />
          </div>

          {step === 2 && (
            <>
              <div className="mb-4">
                <label
                  className="block text-black text-xs font-medium mb-2 tracking-wider"
                  style={{ letterSpacing: '0.05em' }}
                >
                  VERIFICATION CODE
                </label>
                <div className="flex justify-between gap-2 mb-4">
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
                      className="verification-input w-12 h-12 text-center text-xl font-semibold bg-white text-black rounded-xl border-2 border-gray-300 focus:outline-none focus:border-black transition-all"
                    />
                  ))}
                </div>
              </div>

              <div className="text-center mb-6">
                <button className="font-semibold hover:opacity-70 transition-all" style={{ color: '#d4af37' }}>
                  RESEND CODE
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6">
                <label
                  className="block text-black text-xs font-medium mb-2 tracking-wider"
                  style={{ letterSpacing: '0.05em' }}
                >
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none transition-all duration-300 bg-white border-2 border-gray-300 focus:border-black"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-black text-xs font-medium mb-2 tracking-wider"
                  style={{ letterSpacing: '0.05em' }}
                >
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none transition-all duration-300 bg-white border-2 border-gray-300 focus:border-black"
                />
              </div>
            </>
          )}

          <button
            onClick={step === 1 ? handleRequestOTP : handleResetPassword}
            className="w-full text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
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
            PROCEED
          </button>
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
