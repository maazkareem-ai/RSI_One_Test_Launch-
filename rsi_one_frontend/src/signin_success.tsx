import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LogSuccessWindow() {
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  const handleManageLogs = () => {
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
        
        .dashboard-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .dashboard-button:hover {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
        }
        
        .manage-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .manage-button:hover {
          background: linear-gradient(135deg, #d4af37 0%, #f0d78c 100%) !important;
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
          transform: translateY(-1px);
        }
      `}</style>

      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
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
          <h2 className="text-2xl font-light tracking-wide mb-2" style={{ color: '#E8D4B8' }}>
            LOG ADDED SUCCESSFULLY
          </h2>

          <p className="text-sm tracking-wider mb-8" style={{ color: '#9CA3AF' }}>
            Your log has been securely recorded
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleReturnToDashboard}
              className="dashboard-button w-full px-6 py-3.5 rounded-xl text-sm font-bold tracking-[0.1em]"
              style={{
                background: '#ffffff',
                color: '#000000',
                border: '2px solid #ffffff'
              }}
            >
              RETURN TO DASHBOARD
            </button>

            <button
              onClick={handleManageLogs}
              className="manage-button w-full px-6 py-3.5 rounded-xl text-sm font-bold tracking-[0.1em]"
              style={{
                background: '#d4af37',
                color: '#000000'
              }}
            >
              MANAGE LOGS
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
