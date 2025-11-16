import React from 'react';
import { CheckCircle, XCircle, AlertCircle, MinusCircle, Target, Palette, Heart, Shield, Smartphone } from 'lucide-react';

interface ElementComparison {
  element: string;
  adValue: string;
  landingPageValue: string;
  status: 'match' | 'mismatch' | 'partial_match' | 'missing';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation?: string;
  category?: 'content' | 'visual' | 'emotional' | 'trust' | 'mobile';
  colorAnalysis?: {
    adColors: string[];
    pageColors: string[];
    matchScore: number;
  };
  emotionalTone?: {
    adTone: string;
    pageTone: string;
    alignment: number;
  };
  trustSignals?: {
    adSignals: string[];
    pageSignals: string[];
    credibilityGap: string;
  };
  mobileOptimization?: {
    adMobileFriendly: boolean;
    pageMobileFriendly: boolean;
    consistencyScore: number;
  };
}

interface ComparisonGridProps {
  comparisons: ElementComparison[];
}

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ comparisons }) => {
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'visual':
        return <Palette className="h-4 w-4 text-purple-500" />;
      case 'emotional':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'trust':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4 text-blue-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderColorAnalysis = (colorAnalysis?: ElementComparison['colorAnalysis']) => {
    if (!colorAnalysis) return null;
    
    return (
      <div className="mt-2 p-2 bg-gray-50 rounded">
        <div className="text-xs font-medium text-gray-600 mb-1">Color Match: {colorAnalysis.matchScore}/10</div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            {colorAnalysis.adColors.map((color, i) => (
              <div key={i} className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: color }} title={color} />
            ))}
          </div>
          <span className="text-xs text-gray-400">vs</span>
          <div className="flex gap-1">
            {colorAnalysis.pageColors.map((color, i) => (
              <div key={i} className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: color }} title={color} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEmotionalTone = (emotionalTone?: ElementComparison['emotionalTone']) => {
    if (!emotionalTone) return null;
    
    return (
      <div className="mt-2 p-2 bg-gray-50 rounded">
        <div className="text-xs font-medium text-gray-600 mb-1">Emotional Alignment: {emotionalTone.alignment}/10</div>
        <div className="text-xs">
          <span className="text-blue-600">{emotionalTone.adTone}</span> ↔ <span className="text-purple-600">{emotionalTone.pageTone}</span>
        </div>
      </div>
    );
  };

  const renderTrustSignals = (trustSignals?: ElementComparison['trustSignals']) => {
    if (!trustSignals) return null;
    
    return (
      <div className="mt-2 p-2 bg-gray-50 rounded">
        <div className="text-xs font-medium text-gray-600 mb-1">Trust Signals</div>
        <div className="text-xs text-gray-500">
          Ad: {trustSignals.adSignals.join(', ') || 'None'}
        </div>
        <div className="text-xs text-gray-500">
          Page: {trustSignals.pageSignals.join(', ') || 'None'}
        </div>
        {trustSignals.credibilityGap && (
          <div className="text-xs text-orange-600 mt-1">{trustSignals.credibilityGap}</div>
        )}
      </div>
    );
  };

  const renderMobileOptimization = (mobileOpt?: ElementComparison['mobileOptimization']) => {
    if (!mobileOpt) return null;
    
    return (
      <div className="mt-2 p-2 bg-gray-50 rounded">
        <div className="text-xs font-medium text-gray-600 mb-1">Mobile Score: {mobileOpt.consistencyScore}/10</div>
        <div className="text-xs">
          Ad: {mobileOpt.adMobileFriendly ? '📱 Optimized' : '❌ Not optimized'}
        </div>
        <div className="text-xs">
          Page: {mobileOpt.pageMobileFriendly ? '📱 Optimized' : '❌ Not optimized'}
        </div>
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'mismatch':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial_match':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'missing':
        return <MinusCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <MinusCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'match':
        return { style: 'bg-green-100 text-green-700', label: '✅ Perfect Match' };
      case 'mismatch':
        return { style: 'bg-red-100 text-red-700', label: '❌ Mismatch' };
      case 'partial_match':
        return { style: 'bg-yellow-100 text-yellow-700', label: '⚠️ Partial Match' };
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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Target className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Ad vs Landing Page Comparison
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Side-by-side analysis of key elements to identify exact discrepancies and alignment opportunities
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden lg:block">
          {/* Header */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
            <div>Element</div>
            <div className="text-blue-600">Your Ad</div>
            <div className="text-purple-600">Your Landing Page</div>
            <div>Status</div>
            <div>Action Needed</div>
          </div>
          
          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {comparisons.map((comparison, index) => {
              const statusBadge = getStatusBadge(comparison.status);
              
              return (
                <div 
                  key={index} 
                  className={`grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 transition-colors border-l-4 ${getSeverityColor(comparison.severity)}`}
                >
                  {/* Element */}
                  <div className="font-medium text-gray-900 text-sm">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(comparison.category)}
                      {comparison.element}
                    </div>
                  </div>
                  
                  {/* Ad Value */}
                  <div className="text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-blue-700 font-medium text-xs mb-1 uppercase tracking-wide">AD</div>
                      <div className="text-gray-800 text-xs leading-relaxed">{comparison.adValue || '—'}</div>
                      {renderColorAnalysis(comparison.colorAnalysis)}
                      {renderEmotionalTone(comparison.emotionalTone)}
                      {renderTrustSignals(comparison.trustSignals)}
                      {renderMobileOptimization(comparison.mobileOptimization)}
                    </div>
                  </div>
                  
                  {/* Landing Page Value */}
                  <div className="text-sm">
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <div className="text-purple-700 font-medium text-xs mb-1 uppercase tracking-wide">LANDING PAGE</div>
                      <div className="text-gray-800 text-xs leading-relaxed">{comparison.landingPageValue || '—'}</div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(comparison.status)}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.style}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                  
                  {/* Recommendation */}
                  <div className="text-sm">
                    {comparison.recommendation ? (
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <div className="text-orange-700 font-medium text-xs mb-1 uppercase tracking-wide">RECOMMENDATION</div>
                        <div className="text-gray-800 text-xs leading-relaxed">{comparison.recommendation}</div>
                      </div>
                    ) : (
                      <div className="text-green-600 font-medium bg-green-50 p-3 rounded-lg text-xs">✅ No action needed</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          <div className="divide-y divide-gray-100">
            {comparisons.map((comparison, index) => {
              const statusBadge = getStatusBadge(comparison.status);
              
              return (
                <div 
                  key={index} 
                  className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getSeverityColor(comparison.severity)}`}
                >
                  {/* Element Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-semibold text-gray-900 text-base">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(comparison.category)}
                        {comparison.element}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(comparison.status)}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.style}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content Comparison */}
                  <div className="space-y-3 mb-4">
                    {/* Ad Value */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-blue-700 font-semibold text-sm mb-2 uppercase tracking-wide">YOUR AD</div>
                      <div className="text-gray-800 text-sm leading-relaxed">{comparison.adValue || '—'}</div>
                      {renderColorAnalysis(comparison.colorAnalysis)}
                      {renderEmotionalTone(comparison.emotionalTone)}
                      {renderTrustSignals(comparison.trustSignals)}
                      {renderMobileOptimization(comparison.mobileOptimization)}
                    </div>
                    
                    {/* Landing Page Value */}
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <div className="text-purple-700 font-semibold text-sm mb-2 uppercase tracking-wide">LANDING PAGE</div>
                      <div className="text-gray-800 text-sm leading-relaxed">{comparison.landingPageValue || '—'}</div>
                    </div>
                  </div>
                  
                  {/* Recommendation */}
                  {comparison.recommendation && (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <div className="text-orange-700 font-semibold text-sm mb-2 uppercase tracking-wide">RECOMMENDATION</div>
                      <div className="text-gray-800 text-sm leading-relaxed">{comparison.recommendation}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3 text-sm">
          Priority Legend:
        </h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium text-gray-700 text-sm">High Priority Fix</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-medium text-gray-700 text-sm">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-gray-700 text-sm">Low Priority</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonGrid;