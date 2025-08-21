import React, { useState } from 'react';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface HeatmapZone {
  location: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  issue: string;
  suggestion: string;
  expectedImpact: string;
}

interface HeatmapOverlayProps {
  imageUrl: string;
  zones: HeatmapZone[];
  className?: string;
}

const ZONE_COORDINATES = {
  'header': { x: 0, y: 0, width: 100, height: 15 },
  'navigation': { x: 0, y: 0, width: 100, height: 10 },
  'hero-section': { x: 0, y: 15, width: 100, height: 40 },
  'cta-button': { x: 35, y: 45, width: 30, height: 8 },
  'content': { x: 0, y: 55, width: 100, height: 35 },
  'footer': { x: 0, y: 90, width: 100, height: 10 }
} as const;

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'HIGH': return 'bg-red-500/30 border-red-500 hover:bg-red-500/50';
    case 'MEDIUM': return 'bg-yellow-500/30 border-yellow-500 hover:bg-yellow-500/50';
    case 'LOW': return 'bg-blue-500/30 border-blue-500 hover:bg-blue-500/50';
    default: return 'bg-gray-500/30 border-gray-500 hover:bg-gray-500/50';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'HIGH': return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'MEDIUM': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    case 'LOW': return <Info className="w-4 h-4 text-blue-600" />;
    default: return <Info className="w-4 h-4 text-gray-600" />;
  }
};

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({
  imageUrl,
  zones,
  className = ''
}) => {
  const [selectedZone, setSelectedZone] = useState<HeatmapZone | null>(null);

  return (
    <div className={`relative ${className}`}>
      {/* Landing Page Screenshot */}
      <img 
        src={imageUrl} 
        alt="Landing page screenshot"
        className="w-full h-auto rounded-lg shadow-lg"
      />
      
      {/* Heatmap Zone Overlays */}
      {zones.map((zone, index) => {
        const coordinates = ZONE_COORDINATES[zone.location as keyof typeof ZONE_COORDINATES];
        if (!coordinates) return null;

        return (
          <button
            key={index}
            className={`absolute border-2 cursor-pointer transition-all duration-200 ${getSeverityColor(zone.severity)}`}
            style={{
              left: `${coordinates.x}%`,
              top: `${coordinates.y}%`,
              width: `${coordinates.width}%`,
              height: `${coordinates.height}%`,
            }}
            onClick={() => setSelectedZone(zone)}
            title={`Click to see ${zone.severity.toLowerCase()} priority issue`}
          >
            {/* Zone Label */}
            <div className="absolute -top-6 left-0 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium shadow-sm">
              {getSeverityIcon(zone.severity)}
              <span className="capitalize">{zone.location.replace('-', ' ')}</span>
            </div>
          </button>
        );
      })}

      {/* Suggestion Modal */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(selectedZone.severity)}
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {selectedZone.location.replace('-', ' ')}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      selectedZone.severity === 'HIGH' 
                        ? 'bg-red-100 text-red-700' 
                        : selectedZone.severity === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedZone.severity} Priority
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                  <p className="text-gray-600 text-sm">{selectedZone.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Issue Identified</h4>
                  <p className="text-gray-600 text-sm">{selectedZone.issue}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Recommendation</h4>
                  <p className="text-gray-600 text-sm">{selectedZone.suggestion}</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">Expected Impact</h4>
                  <p className="text-green-700 text-sm">{selectedZone.expectedImpact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};