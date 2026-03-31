
import { Mail, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SignupSuccessWindow() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes checkmarkScale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .checkmark-animation {
          animation: checkmarkScale 0.5s ease-out forwards;
        }
        
        @keyframes mailBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .mail-animation {
          animation: mailBounce 1s ease-in-out infinite;
        }
        
        .ok-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ok-button:hover {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
        }
      `}</style>

      <div 
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, rgba(26, 26, 26, 1) 0%, rgba(15, 15, 15, 1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Content */}
        <div className="px-8 py-12 text-center">
          
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div 
              className="checkmark-animation w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '2px solid rgba(34, 197, 94, 0.6)'
              }}
            >
              <Check size={40} style={{ color: '#22C55E' }} strokeWidth={3} />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-light tracking-wide mb-3" style={{ color: '#E8D4B8' }}>
            YOUR ACCOUNT IS CREATED
          </h2>
          
          {/* Email Icon and Message */}
          <div className="flex justify-center mb-4">
            <div className="mail-animation">
              <Mail size={32} style={{ color: '#d4af37' }} />
            </div>
          </div>

          <p className="text-sm tracking-wide leading-relaxed mb-8 mx-auto max-w-md" style={{ color: '#9CA3AF' }}>
            A login link has been sent to your email in order for you to login and proceed to next steps
          </p>

          {/* Button */}
          <button
            onClick={handleClose}
            className="ok-button w-full px-6 py-3.5 rounded-xl text-sm font-bold tracking-[0.1em]"
            style={{
              background: '#ffffff',
              color: '#000000',
              border: '2px solid #ffffff'
            }}
          >
            OK, GOT IT
          </button>

        </div>
      </div>
    </div>
  );
}
