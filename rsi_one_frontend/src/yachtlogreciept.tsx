
type YachtLogData = {
  selectedYacht?: string;
  preUseMaintenance?: string;
  maintenanceCost?: string;
  date?: string;
  location?: string;
  distance?: string;
  fuel?: string;
  usageHours?: string;
  waterType?: string;
  generalNotes?: string;
};

type YachtUsageReceiptProps = {
  data: YachtLogData;
  onAuthorize: () => void;
  onEdit: () => void;
};

export default function YachtUsageReceipt({ data, onAuthorize, onEdit }: YachtUsageReceiptProps) {

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .auth-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .auth-button:hover {
          background: linear-gradient(135deg, #d4af37 0%, #f0d78c 100%) !important;
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
          transform: translateY(-1px);
        }
        
        .edit-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .edit-button:hover {
          background: #ffffff !important;
          color: #000000 !important;
          transform: translateY(-1px);
        }
      `}</style>

      <div 
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, rgba(26, 26, 26, 1) 0%, rgba(15, 15, 15, 1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header */}
        <div 
          className="px-8 py-6 border-b"
          style={{ 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <h2 className="text-xl font-light tracking-wide mb-1" style={{ color: '#E8D4B8' }}>
            YACHT USAGE DETAILS
          </h2>
          <p className="text-xs tracking-[0.15em] font-light" style={{ color: '#d4af37' }}>
            REVIEW BEFORE AUTHORIZATION
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          
          {/* Yacht Configuration */}
          <div className="mb-6">
            <h3 className="text-xs font-medium tracking-wider mb-3" style={{ color: '#d4af37' }}>
              YACHT CONFIGURATION
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Selected Yacht:</span>
                <span className="text-xs font-medium" style={{ color: '#E8D4B8' }}>
                  {data.selectedYacht || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Pre-Use Maintenance:</span>
                <span className="text-xs font-medium" style={{ color: '#E8D4B8' }}>
                  {data.preUseMaintenance || 'None'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Maintenance Cost:</span>
                <span className="text-xs font-medium" style={{ color: '#E8D4B8' }}>
                  ${data.maintenanceCost || '0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Routine Information */}
          <div className="mb-6">
            <h3 className="text-xs font-medium tracking-wider mb-3" style={{ color: '#d4af37' }}>
              ROUTINE INFORMATION
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Date:</span>
                <span className="text-xs font-medium" style={{ color: '#E8D4B8' }}>
                  {data.date || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Location:</span>
                <span className="text-xs font-medium" style={{ color: '#E8D4B8' }}>
                  {data.location || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Data */}
          <div className="mb-6">
            <h3 className="text-xs font-medium tracking-wider mb-3" style={{ color: '#d4af37' }}>
              TECHNICAL DATA
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Est. Distance:</span>
                <span className="text-xs font-medium" style={{ color: '#E8D4B8' }}>
                  {data.distance ? `${data.distance} KM` : 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Est. Fuel:</span>
                <span className="text-xs font-medium" style={{ color: '#E8D4B8' }}>
                  {data.fuel ? `${data.fuel} L` : 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Est. Usage Hours:</span>
                <span className="text-xs font-medium" style={{ color: '#E8D4B8' }}>
                  {data.usageHours || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Water Type */}
          <div className="mb-6">
            <h3 className="text-xs font-medium tracking-wider mb-3" style={{ color: '#d4af37' }}>
              WATER TYPE
            </h3>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>Water Condition:</span>
              <span className="text-xs font-medium uppercase" style={{ color: '#E8D4B8' }}>
                {data.waterType === 'sea' ? 'SEA WATER' : data.waterType === 'fresh' ? 'FRESH WATER' : 'Not specified'}
              </span>
            </div>
          </div>

          {/* General Notes */}
          <div className="mb-4">
            <h3 className="text-xs font-medium tracking-wider mb-3" style={{ color: '#d4af37' }}>
              GENERAL NOTES
            </h3>
            <div className="py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <span className="text-xs block mb-2" style={{ color: '#9CA3AF' }}>Pre-departure notes:</span>
              <p className="text-xs font-medium" style={{ color: '#E8D4B8' }}>
                {data.generalNotes || 'None provided'}
              </p>
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
            onClick={onEdit}
            className="edit-button px-6 py-3 rounded-xl text-sm font-bold tracking-[0.1em]"
            style={{
              color: '#9CA3AF',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'transparent'
            }}
          >
            MAKE EDIT
          </button>
          <button
            onClick={onAuthorize}
            className="auth-button px-8 py-3 rounded-xl text-sm font-bold tracking-[0.1em]"
            style={{
              background: '#d4af37',
              color: '#000000'
            }}
          >
            AUTHORIZE ADDITION
          </button>
        </div>
      </div>
    </div>
  );
}
