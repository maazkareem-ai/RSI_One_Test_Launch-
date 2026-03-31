import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertTriangle, Wrench, DollarSign, FileText, Shield } from 'lucide-react';

type NotificationType = 'critical' | 'maintenance' | 'financial';
type NotificationItem = {
  id: number;
  type: NotificationType;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  description: string;
  time: string;
  action: string;
};

export default function NotificationsPanel() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: 'critical',
      icon: Shield,
      title: 'Certificate Expired: The Wanderer',
      description: 'A critical compliance certificate expired 2 days ago. Immediate attention required for flight clearance.',
      time: '2h ago',
      action: 'View Details'
    },
    {
      id: 2,
      type: 'maintenance',
      icon: AlertTriangle,
      title: 'Engine Anomaly: N789XJ',
      description: 'AI detected an engine temperature anomaly on recent flight leg from London to Dubai.',
      time: '1d ago',
      action: 'View Details'
    },
    {
      id: 3,
      type: 'maintenance',
      icon: Wrench,
      title: 'Upcoming Service: The Wanderer',
      description: 'Scheduled 1000-hour engine service is approaching. Please select a service center.',
      time: '3d ago',
      action: 'Schedule'
    },
    {
      id: 4,
      type: 'financial',
      icon: DollarSign,
      title: 'Expense Anomaly: N789XJ',
      description: 'Fuel cost was 30% above average for the last trip due to rerouting.',
      time: '4d ago',
      action: 'View Report'
    },
    {
      id: 5,
      type: 'maintenance',
      icon: AlertTriangle,
      title: 'Pre-Flight Alert: G650',
      description: 'A minor hydraulic issue was flagged during pre-flight inspection. Estimated 2 flight hours.',
      time: '5d ago',
      action: 'Investigate'
    },
    {
      id: 6,
      type: 'maintenance',
      icon: FileText,
      title: 'Maintenance Report Ready',
      description: 'Your Q2 maintenance summary for \'The Wanderer\' is available for download.',
      time: '1w ago',
      action: 'Download'
    }
  ]);

  const [swipedId, setSwipedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleSwipe = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, id: number) => {
    const card = e.currentTarget;
    let startX = 0;
    let currentX = 0;

    const onStart = (ev: MouseEvent | TouchEvent) => {
      startX = 'touches' in ev ? ev.touches[0].clientX : (ev as MouseEvent).clientX;
    };

    const onMove = (ev: MouseEvent | TouchEvent) => {
      currentX = 'touches' in ev ? ev.touches[0].clientX : (ev as MouseEvent).clientX;
      const diff = startX - currentX;
      
      if (diff > 0) {
        card.style.transform = `translateX(-${Math.min(diff, 100)}px)`;
      }
    };

    const onEnd = () => {
      const diff = startX - currentX;
      
      if (diff > 80) {
        setDeletingId(id);
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
          setDeletingId(null);
        }, 300);
      } else {
        card.style.transform = 'translateX(0)';
      }
      
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('touchmove', onMove);
      card.removeEventListener('mouseup', onEnd);
      card.removeEventListener('touchend', onEnd);
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('touchmove', onMove);
    card.addEventListener('mouseup', onEnd);
    card.addEventListener('touchend', onEnd);

    onStart(e);
  };

  const getIconColor = (type) => {
    switch(type) {
      case 'critical': return '#EF4444';
      case 'maintenance': return '#d4af37';
      case 'financial': return '#FBBF24';
      default: return '#9CA3AF';
    }
  };

  const getIconBg = (type) => {
    switch(type) {
      case 'critical': return 'rgba(239, 68, 68, 0.1)';
      case 'maintenance': return 'rgba(212, 175, 55, 0.1)';
      case 'financial': return 'rgba(251, 191, 36, 0.1)';
      default: return 'rgba(156, 163, 175, 0.1)';
    }
  };

  const filteredNotifications = selectedFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === selectedFilter);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .notification-panel {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .filter-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .filter-button.active {
          background: #d4af37 !important;
          color: #000000 !important;
        }
        
        .filter-button:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05) !important;
        }
        
        .notification-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: grab;
          user-select: none;
        }

        .notification-card:active {
          cursor: grabbing;
        }

        .notification-card.deleting {
          opacity: 0;
          transform: translateX(-100%) !important;
          transition: all 0.3s ease-out;
        }
        
        .notification-card:hover {
          background: rgba(255, 255, 255, 0.02) !important;
          transform: translateX(4px);
        }
        
        .action-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .action-button:hover {
          background: #000000 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        
        .mark-read-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mark-read-button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .close-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: rotate(90deg);
        }
      `}</style>

      <div 
        className="notification-panel w-full rounded-2xl overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, rgba(26, 26, 26, 1) 0%, rgba(15, 15, 15, 1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '550px',
          height: '85vh'
        }}
      >
        {/* Header */}
        <div 
          className="px-6 py-5 border-b flex items-center justify-between"
          style={{ 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <div>
            <h2 className="text-xl font-light tracking-wide mb-1" style={{ color: '#E8D4B8' }}>
              Notifications & Alerts
            </h2>
            <p className="text-xs tracking-[0.15em] font-light" style={{ color: '#d4af37' }}>
              RSI ONE // SYSTEM NOTIFICATIONS
            </p>
          </div>
          <button 
            className="close-button w-9 h-9 rounded-full flex items-center justify-center"
            style={{ color: '#9CA3AF' }}
            onClick={() => navigate('/dashboard')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div 
          className="px-6 py-3 border-b flex items-center gap-2"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <button
            onClick={() => setSelectedFilter('all')}
            className={`filter-button px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider ${selectedFilter === 'all' ? 'active' : ''}`}
            style={{
              background: selectedFilter === 'all' ? '#d4af37' : 'rgba(0, 0, 0, 0.4)',
              color: selectedFilter === 'all' ? '#000000' : '#9CA3AF',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter('critical')}
            className={`filter-button px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider ${selectedFilter === 'critical' ? 'active' : ''}`}
            style={{
              background: selectedFilter === 'critical' ? '#d4af37' : 'rgba(0, 0, 0, 0.4)',
              color: selectedFilter === 'critical' ? '#000000' : '#9CA3AF',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            Critical
          </button>
          <button
            onClick={() => setSelectedFilter('maintenance')}
            className={`filter-button px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider ${selectedFilter === 'maintenance' ? 'active' : ''}`}
            style={{
              background: selectedFilter === 'maintenance' ? '#d4af37' : 'rgba(0, 0, 0, 0.4)',
              color: selectedFilter === 'maintenance' ? '#000000' : '#9CA3AF',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            Maintenance
          </button>
          <button
            onClick={() => setSelectedFilter('financial')}
            className={`filter-button px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider ${selectedFilter === 'financial' ? 'active' : ''}`}
            style={{
              background: selectedFilter === 'financial' ? '#d4af37' : 'rgba(0, 0, 0, 0.4)',
              color: selectedFilter === 'financial' ? '#000000' : '#9CA3AF',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            Financial
          </button>
          
          <div className="ml-auto">
            <button
              className="mark-read-button px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider"
              style={{
                background: 'transparent',
                color: '#9CA3AF',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              Mark All Read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="px-6 py-3 overflow-y-auto" style={{ height: 'calc(85vh - 155px)' }}>
          {filteredNotifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className={`notification-card mb-2.5 p-3 rounded-xl flex items-start gap-2.5 ${deletingId === notification.id ? 'deleting' : ''}`}
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
                onMouseDown={(e) => handleSwipe(e, notification.id)}
                onTouchStart={(e) => handleSwipe(e, notification.id)}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: getIconBg(notification.type),
                    border: `1px solid ${getIconColor(notification.type)}40`
                  }}
                >
                  <IconComponent size={16} style={{ color: getIconColor(notification.type) }} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-xs font-medium" style={{ color: '#E8D4B8' }}>
                      {notification.title}
                    </h3>
                    <span className="text-xs ml-3 flex-shrink-0" style={{ color: '#6B7280' }}>
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: '#9CA3AF' }}>
                    {notification.description}
                  </p>
                  <button
                    className="action-button px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider"
                    style={{
                      background: '#ffffff',
                      color: '#000000'
                    }}
                  >
                    {notification.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
