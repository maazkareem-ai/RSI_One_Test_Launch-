import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plane, MapPin, Wrench, Gauge } from 'lucide-react';
import FlightLogReceipt from './flightlogereciept';

export default function RSIFlightLogModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [savedLog, setSavedLog] = useState(null);
  const [selectedPlane, setSelectedPlane] = useState('');
  const [preUseMaintenance, setPreUseMaintenance] = useState('');
  const [maintenanceCost, setMaintenanceCost] = useState('');
  const [date, setDate] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [fuel, setFuel] = useState('');
  const [flightHours, setFlightHours] = useState('');
  const [meteorology, setMeteorology] = useState('');

  const handleClose = () => {
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleSaveLog = () => {
    const payload = {
      selectedPlane,
      preUseMaintenance,
      maintenanceCost,
      date,
      origin,
      destination,
      distance,
      fuel,
      flightHours,
      meteorology
    };
    console.log('Flight log saved:', payload);
    alert('Flight log saved successfully!');
    setSavedLog(payload);
    setShowReceipt(true);
  };

  if (!isOpen) return null;

  if (showReceipt && savedLog) {
    return (
      <FlightLogReceipt
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
        
        .weather-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .weather-card:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(212, 175, 55, 0.3);
        }
        
        .weather-card.selected {
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
        
        .section-icon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
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
              NEW FLIGHT LOG
            </h2>
            <p className="text-xs tracking-[0.15em] font-light" style={{ color: '#d4af37' }}>
              RSI ONE // AVIATION DIVISION
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
          
          {/* Aircraft Configuration Section */}
          <div className="mb-8">
            <h3 className="text-xs font-medium tracking-[0.15em] mb-4 section-icon" style={{ color: '#d4af37' }}>
              <Plane size={16} />
              AIRCRAFT CONFIGURATION
            </h3>
            
            <div className="mb-4">
              <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                SELECT PLANE
              </label>
              <div className="relative">
                <Plane size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
                <select
                  value={selectedPlane}
                  onChange={(e) => setSelectedPlane(e.target.value)}
                  className="w-full rounded-xl px-12 py-3.5 text-sm input-focus transition-all"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: selectedPlane ? '#E8D4B8' : '#6B7280'
                  }}
                >
                  <option value="">SELECT AVAILABLE PLANE</option>
                  <option value="g700">Gulfstream G700</option>
                  <option value="g650">Gulfstream G650</option>
                  <option value="falcon">Dassault Falcon 8X</option>
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

          {/* Route Information Section */}
          <div className="mb-8">
            <h3 className="text-xs font-medium tracking-[0.15em] mb-4 section-icon" style={{ color: '#d4af37' }}>
              <MapPin size={16} />
              ROUTE INFORMATION
            </h3>
            
            <div className="mb-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                  ORIGIN (ICAO)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: '#d4af37' }}></div>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                    placeholder="KJFK"
                    maxLength={4}
                    className="w-full rounded-xl px-12 py-3.5 text-sm input-focus transition-all uppercase"
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
                  DESTINATION (ICAO)
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value.toUpperCase())}
                    placeholder="EGLL"
                    maxLength={4}
                    className="w-full rounded-xl px-12 py-3.5 text-sm input-focus transition-all uppercase"
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
          <div className="mb-6">
            <h3 className="text-xs font-medium tracking-[0.15em] mb-4 section-icon" style={{ color: '#d4af37' }}>
              <Gauge size={16} />
              TECHNICAL DATA
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                  EST. DISTANCE (NM)
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
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: '#6B7280' }}>NM</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                  EST. FUEL (LBS)
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
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: '#6B7280' }}>LBS</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 tracking-wider" style={{ color: '#9CA3AF' }}>
                EST. FLIGHT HOURS
              </label>
              <input
                type="text"
                value={flightHours}
                onChange={(e) => setFlightHours(e.target.value)}
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

          {/* Meteorology Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-medium tracking-[0.15em] section-icon" style={{ color: '#d4af37' }}>
                ☁️ METEOROLOGY
              </h3>
              <span className="text-xs px-3 py-1 rounded-full" style={{ 
                background: 'rgba(212, 175, 55, 0.2)', 
                color: '#d4af37',
                border: '1px solid rgba(212, 175, 55, 0.4)'
              }}>
                REQUIRED
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setMeteorology('critical')}
                className={`weather-card px-6 py-6 rounded-xl flex flex-col items-center gap-3 ${meteorology === 'critical' ? 'selected' : ''}`}
                style={{
                  background: meteorology === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 0, 0, 0.4)',
                  border: `2px solid ${meteorology === 'critical' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                <div className={meteorology === 'critical' ? 'pulse-animation' : ''}>
                  🌩️
                </div>
                <span className="text-xs font-bold tracking-wider" style={{ 
                  color: meteorology === 'critical' ? '#EF4444' : '#9CA3AF' 
                }}>
                  CRITICAL
                </span>
              </button>

              <button
                onClick={() => setMeteorology('adequate')}
                className={`weather-card px-6 py-6 rounded-xl flex flex-col items-center gap-3 ${meteorology === 'adequate' ? 'selected' : ''}`}
                style={{
                  background: meteorology === 'adequate' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(0, 0, 0, 0.4)',
                  border: `2px solid ${meteorology === 'adequate' ? 'rgba(251, 191, 36, 0.8)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                <div className={meteorology === 'adequate' ? 'pulse-animation' : ''}>
                  ☁️
                </div>
                <span className="text-xs font-bold tracking-wider" style={{ 
                  color: meteorology === 'adequate' ? '#FBBF24' : '#9CA3AF' 
                }}>
                  ADEQUATE
                </span>
              </button>

              <button
                onClick={() => setMeteorology('favorable')}
                className={`weather-card px-6 py-6 rounded-xl flex flex-col items-center gap-3 ${meteorology === 'favorable' ? 'selected' : ''}`}
                style={{
                  background: meteorology === 'favorable' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(0, 0, 0, 0.4)',
                  border: `2px solid ${meteorology === 'favorable' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                <div className={meteorology === 'favorable' ? 'pulse-animation' : ''}>
                  ☀️
                </div>
                <span className="text-xs font-bold tracking-wider" style={{ 
                  color: meteorology === 'favorable' ? '#22C55E' : '#9CA3AF' 
                }}>
                  FAVORABLE
                </span>
              </button>
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
            className="px-8 py-3 rounded-xl text-sm font-bold tracking-[0.1em] gold-hover flex items-center gap-2"
            style={{
              background: '#000000',
              color: '#ffffff',
              border: '2px solid #ffffff'
            }}
          >
            SAVE LOG ✓
          </button>
        </div>
      </div>
    </div>
  );
}
