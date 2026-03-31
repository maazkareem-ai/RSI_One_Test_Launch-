import React, { useEffect, useState } from 'react';

export default function RSIPaymentGateway() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
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

  const handlePay = () => {
    console.log('Payment:', { cardNumber, expiryDate, cvv, cardHolderName });
    alert('Payment processed successfully!');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .star { animation: twinkle 3s ease-in-out infinite; }
        .form-appear { animation: fadeInUp 1s ease forwards; }
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

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-gray-300 transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1
              className="text-2xl font-light tracking-wider text-white"
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.15em' }}
            >
              PAYMENT GATEWAY
            </h1>
          </div>
        </div>

        <div className="w-full max-w-md form-appear" style={{ animationDelay: '0.2s' }}>
          <div
            className="backdrop-blur-xl border rounded-2xl p-8 shadow-2xl"
            style={{
              background: 'rgba(26, 26, 26, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                ADD PAYMENT
              </h2>
              <button className="text-white hover:text-gray-300 transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-medium mb-4 tracking-wider" style={{ letterSpacing: '0.1em', color: '#ffffff' }}>
                CREDIT / DEBIT CARD
              </h3>

              <div className="mb-4">
                <label className="block text-xs font-medium mb-2" style={{ color: '#E8D4B8' }}>
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  className="w-full rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontFamily: 'Inter, sans-serif',
                    color: '#E8D4B8',
                  }}
                />
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-2" style={{ color: '#E8D4B8' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM / YY"
                    className="w-full rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontFamily: 'Inter, sans-serif',
                      color: '#E8D4B8',
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-2" style={{ color: '#E8D4B8' }}>
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={3}
                    className="w-full rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontFamily: 'Inter, sans-serif',
                      color: '#E8D4B8',
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium mb-2" style={{ color: '#E8D4B8' }}>
                  Card Holder Name
                </label>
                <input
                  type="text"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontFamily: 'Inter, sans-serif',
                    color: '#E8D4B8',
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => {
                  console.log('Connecting to Google Pay...');
                  alert('Redirecting to Google Pay portal...');
                }}
                className="flex-1 rounded-xl px-4 py-3 font-medium transition-all hover:opacity-80 hover:scale-105 duration-300"
                style={{
                  background: 'rgba(66, 133, 244, 0.2)',
                  border: '1px solid rgba(66, 133, 244, 0.3)',
                  color: '#E8D4B8',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">G</span>
                  </div>
                  <span className="text-sm">Connect Google Pay</span>
                </div>
              </button>
              <button
                onClick={() => {
                  console.log('Connecting to PayPal...');
                  alert('Redirecting to PayPal portal...');
                }}
                className="flex-1 rounded-xl px-4 py-3 font-medium transition-all hover:opacity-80 hover:scale-105 duration-300"
                style={{
                  background: 'rgba(0, 112, 186, 0.2)',
                  border: '1px solid rgba(0, 112, 186, 0.3)',
                  color: '#E8D4B8',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">P</span>
                  </div>
                  <span className="text-sm">Connect PayPal</span>
                </div>
              </button>
            </div>

            <div className="flex gap-4">
              <button
                className="flex-1 rounded-xl px-6 py-3 font-bold transition-all"
                style={{
                  background: '#ffffff',
                  color: '#000000',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.1em',
                  fontSize: '0.95rem',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#000000';
                  e.target.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.color = '#000000';
                }}
              >
                ADD
              </button>
              <button
                onClick={handlePay}
                className="flex-1 text-black font-bold py-3 rounded-xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #c9a961 100%)',
                  letterSpacing: '0.1em',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 6px 25px rgba(212, 175, 55, 0.8), 0 0 40px rgba(212, 175, 55, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
                }}
              >
                PAY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
