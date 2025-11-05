import React from 'react';
import { CheckCircle, XCircle, AlertCircle, MinusCircle } from 'lucide-react';

interface ElementComparison {
  element: string;
  adValue: string;
  landingPageValue: string;
  status: 'match' | 'mismatch' | 'partial_match' | 'missing';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation?: string;
}

interface ComparisonGridProps {
  comparisons: ElementComparison[];
}

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ comparisons }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'mismatch':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'partial_match':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'missing':
        return <MinusCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <MinusCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'match':
        return { style: 'bg-green-100 text-green-800', label: '✅ Perfect Match' };
      case 'mismatch':
        return { style: 'bg-red-100 text-red-800', label: '❌ Mismatch' };
      case 'partial_match':
        return { style: 'bg-yellow-100 text-yellow-800', label: '⚠️ Partial Match' };
      case 'missing':
        return { style: 'bg-gray-100 text-gray-600', label: '➖ Missing' };
      default:
        return { style: 'bg-gray-100 text-gray-600', label: 'Unknown' };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'border-l-red-500';
      case 'MEDIUM': return 'border-l-yellow-500';
      case 'LOW': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  if (!comparisons || comparisons.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">🔍 Ad vs Landing Page Comparison</h2>
      <p className="text-gray-600 mb-6">
        Side-by-side analysis of key elements to identify exact discrepancies and alignment opportunities.
      </p>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
          <div>Element</div>
          <div>Your Ad</div>
          <div>Your Landing Page</div>
          <div>Status</div>
          <div>Action Needed</div>
        </div>
        
        {/* Rows */}
        <div className="divide-y divide-gray-200">
          {comparisons.map((comparison, index) => {
            const statusBadge = getStatusBadge(comparison.status);
            
            return (
              <div 
                key={index} 
                className={`grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 transition-colors border-l-4 ${getSeverityColor(comparison.severity)}`}
              >
                {/* Element */}
                <div className="font-medium text-gray-900">
                  {comparison.element}
                </div>
                
                {/* Ad Value */}
                <div className="text-sm">
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="text-blue-800 font-medium text-xs mb-1">AD</div>
                    <div className="text-gray-700">{comparison.adValue || '—'}</div>
                  </div>
                </div>
                
                {/* Landing Page Value */}
                <div className="text-sm">
                  <div className="bg-purple-50 p-2 rounded border border-purple-200">
                    <div className="text-purple-800 font-medium text-xs mb-1">LANDING PAGE</div>
                    <div className="text-gray-700">{comparison.landingPageValue || '—'}</div>
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex items-center gap-2">
                  {getStatusIcon(comparison.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.style}`}>
                    {statusBadge.label}
                  </span>
                </div>
                
                {/* Recommendation */}
                <div className="text-sm text-gray-600">
                  {comparison.recommendation ? (
                    <div className="bg-orange-50 p-2 rounded border border-orange-200">
                      <div className="text-orange-800 font-medium text-xs mb-1">RECOMMENDATION</div>
                      <div>{comparison.recommendation}</div>
                    </div>
                  ) : (
                    <div className="text-green-600 font-medium">No action needed</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>High Priority Fix</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Low Priority</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonGrid;