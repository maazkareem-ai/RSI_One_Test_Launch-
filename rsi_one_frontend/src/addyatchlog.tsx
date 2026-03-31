import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Anchor, MapPin, Wrench, Gauge, Droplets } from 'lucide-react';
import YachtUsageReceipt from './yachtlogreciept';

type YachtLogData = {
  selectedYacht: string;
  preUseMaintenance: string;
  maintenanceCost: string;
  date: string;
  location: string;
  distance: string;
  fuel: string;
  usageHours: string;
  waterType: string;
  generalNotes: string;
};

export default function RSIYachtUsageModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [savedLog, setSavedLog] = useState<YachtLogData | null>(null);
  const [selectedYacht, setSelectedYacht] = useState('');
  const [preUseMaintenance, setPreUseMaintenance] = useState('');
  const [maintenanceCost, setMaintenanceCost] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [fuel, setFuel] = useState('');
  const [usageHours, setUsageHours] = useState('');
  const [waterType, setWaterType] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');

  const handleClose = () => {
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleSaveLog = () => {
    const payload: YachtLogData = {
      selectedYacht,
      preUseMaintenance,
      maintenanceCost,
      date,
      location,
      distance,
      fuel,
      usageHours,
      waterType,
      generalNotes
    };
    console.log('Yacht usage log saved:', payload);
    alert('Yacht usage log saved successfully!');
    setSavedLog(payload);
    setShowReceipt(true);
  };

  if (!isOpen) return null;

  if (showReceipt && savedLog) {
    return (
      <YachtUsageReceipt
        data={savedLog}
        onAuthorize={() => navigate('/dashboard')}
        onEdit={() => setShowReceipt(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .modal-content {
          animation: modalSlideIn 0.3s ease-out forwards;
        }
        
        .input-focus:focus {
          border-color: rgba(212, 175, 55, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1) !important;
          outline: none;
        }
        
        .gold-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .gold-hover:hover {
          background: #ffffff !important;
          color: #000000 !important;
          box-shadow: 0 8px 30px rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        
        .section-icon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .water-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .water-card:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(212, 175, 55, 0.3);
        }
        
        .water-card.selected {
          border-color: rgba(212, 175, 55, 0.8) !important;
          background: rgba(212, 175, 55, 0.1) !important;
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
        }
      `}</style>

      <div 
        className="modal-content w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, rgba(26, 26, 26, 1) 0%, rgba(15, 15, 15, 1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div 
          className="px-8 py-6 border-b flex items-center justify-between"
          style={{ 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <div>
            <h2 className="text-2xl font-light tracking-wide mb-1" style={{ color: '#E8D4B8' }}>
              YACHT USAGE
            </h2>
            <p className="text-xs tracking-[0.15em] font-light" style={{ color: '#d4af37' }}>
              RSI ONE // MARITIME DIVISION
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/5"
            style={{ color: '#9CA3AF' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          
          {/* Yacht Configuration Section */}
          <div className="mb-8">
            <h3 className="text-xs font-medium tracking-[0.15em] mb-4 section-icon" style={{ color: '#d4af37' }}>
              <Anchor size={16} />
              YACHT CONFIGURATION
            </h3>
            
            <div className="mb-4">
              <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                SELECT YACHT
              </label>
              <div className="relative">
                <Anchor size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
                <select
                  value={selectedYacht}
                  onChange={(e) => setSelectedYacht(e.target.value)}
                  className="w-full rounded-xl px-12 py-3.5 text-sm input-focus transition-all"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: selectedYacht ? '#E8D4B8' : '#6B7280'
                  }}
                >
                  <option value="">SELECT AVAILABLE VESSEL</option>
                  <option value="oceania">Oceania - 150ft</option>
                  <option value="serenity">Serenity - 180ft</option>
                  <option value="navigator">Navigator - 200ft</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                  ANY PRE-USE MAINTENANCE
                </label>
                <div className="relative">
                  <Wrench size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
                  <input
                    type="text"
                    value={preUseMaintenance}
                    onChange={(e) => setPreUseMaintenance(e.target.value)}
                    placeholder="Optional notes"
                    className="w-full rounded-xl px-12 py-3.5 text-sm input-focus transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#E8D4B8'
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                  PRE-USE MAINTENANCE COST
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#6B7280' }}>$</span>
                  <input
                    type="text"
                    value={maintenanceCost}
                    onChange={(e) => setMaintenanceCost(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl px-12 py-3.5 text-sm input-focus transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#E8D4B8'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Routine Information Section */}
          <div className="mb-8">
            <h3 className="text-xs font-medium tracking-[0.15em] mb-4 section-icon" style={{ color: '#d4af37' }}>
              <MapPin size={16} />
              ROUTINE INFORMATION
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                  DATE
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl px-4 py-3.5 text-sm input-focus transition-all"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#E8D4B8'
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                  LOCATION
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Marina, Port, etc."
                    className="w-full rounded-xl px-12 py-3.5 text-sm input-focus transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#E8D4B8'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Technical Data Section */}
          <div className="mb-8">
            <h3 className="text-xs font-medium tracking-[0.15em] mb-4 section-icon" style={{ color: '#d4af37' }}>
              <Gauge size={16} />
              TECHNICAL DATA
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                  EST. DISTANCE (KM)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="0000"
                    className="w-full rounded-xl px-4 py-3.5 text-sm input-focus transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#E8D4B8'
                    }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: '#6B7280' }}>KM</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                  EST. FUEL (LITERS)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    placeholder="0000"
                    className="w-full rounded-xl px-4 py-3.5 text-sm input-focus transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#E8D4B8'
                    }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: '#6B7280' }}>L</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                EST. USAGE HOURS
              </label>
              <input
                type="text"
                value={usageHours}
                onChange={(e) => setUsageHours(e.target.value)}
                placeholder="00:00"
                className="w-full rounded-xl px-4 py-3.5 text-sm input-focus transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#E8D4B8'
                }}
              />
            </div>
          </div>

          {/* Water Type Section */}
          <div className="mb-8">
            <h3 className="text-xs font-medium tracking-[0.15em] mb-4 section-icon" style={{ color: '#d4af37' }}>
              <Droplets size={16} />
              WATER TYPE
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setWaterType('sea')}
                className={`water-card px-6 py-6 rounded-xl flex flex-col items-center gap-3 ${waterType === 'sea' ? 'selected' : ''}`}
                style={{
                  background: waterType === 'sea' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.4)',
                  border: `2px solid ${waterType === 'sea' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                <Droplets 
                  size={32} 
                  className={waterType === 'sea' ? 'pulse-animation' : ''} 
                  style={{ color: waterType === 'sea' ? '#3B82F6' : '#6B7280' }}
                />
                <span className="text-xs font-bold tracking-wider" style={{ 
                  color: waterType === 'sea' ? '#3B82F6' : '#9CA3AF' 
                }}>
                  SEA WATER
                </span>
              </button>

              <button
                onClick={() => setWaterType('fresh')}
                className={`water-card px-6 py-6 rounded-xl flex flex-col items-center gap-3 ${waterType === 'fresh' ? 'selected' : ''}`}
                style={{
                  background: waterType === 'fresh' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0, 0, 0, 0.4)',
                  border: `2px solid ${waterType === 'fresh' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                <Droplets 
                  size={32} 
                  className={waterType === 'fresh' ? 'pulse-animation' : ''} 
                  style={{ color: waterType === 'fresh' ? '#22C55E' : '#6B7280' }}
                />
                <span className="text-xs font-bold tracking-wider" style={{ 
                  color: waterType === 'fresh' ? '#22C55E' : '#9CA3AF' 
                }}>
                  FRESH WATER
                </span>
              </button>
            </div>
          </div>

          {/* General Notes Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium tracking-[0.15em] mb-4 section-icon" style={{ color: '#d4af37' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              GENERAL NOTES
            </h3>
            
            <div>
              <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                ANY ISSUES NOTICED DURING OR AFTER USAGE
              </label>
              <textarea
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="List any checks performed prior to departure..."
                rows={4}
                className="w-full rounded-xl px-4 py-3.5 text-sm input-focus transition-all resize-none"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#E8D4B8'
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="px-8 py-6 border-t flex items-center justify-end gap-4"
          style={{ 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <button
            onClick={handleClose}
            className="px-6 py-3 rounded-xl text-sm font-bold tracking-[0.1em] transition-all hover:bg-white/5"
            style={{
              color: '#9CA3AF',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            CANCEL
          </button>
          <button
            onClick={handleSaveLog}
            className="px-8 py-3 rounded-xl text-sm font-bold tracking-[0.1em] gold-hover"
            style={{
              background: '#000000',
              color: '#ffffff',
              border: '2px solid #ffffff'
            }}
          >
            SAVE USAGE LOG
          </button>
        </div>
      </div>
    </div>
  );
}
