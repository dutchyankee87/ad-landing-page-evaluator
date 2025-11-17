import React from 'react';
import { Settings, Image, Sparkles } from 'lucide-react';

export type OptimizationPath = 'ad' | 'landing';

interface OptimizationPathSelectorProps {
  selectedPath: OptimizationPath;
  onPathChange: (path: OptimizationPath) => void;
  aiPreferredPath?: OptimizationPath;
  className?: string;
}

const OptimizationPathSelector: React.FC<OptimizationPathSelectorProps> = ({
  selectedPath,
  onPathChange,
  aiPreferredPath,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex bg-gray-100 rounded-lg p-1 relative">
        <button
          onClick={() => onPathChange('ad')}
          className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            selectedPath === 'ad'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Image className="h-4 w-4" />
          Optimize Ad
          {aiPreferredPath === 'ad' && (
            <div className="absolute -top-1 -right-1">
              <div className="relative">
                <Sparkles className="h-3 w-3 text-blue-600" />
                <span className="absolute -top-6 -left-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200">
                  AdAlign Preferred
                </span>
              </div>
            </div>
          )}
        </button>
        <button
          onClick={() => onPathChange('landing')}
          className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            selectedPath === 'landing'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Settings className="h-4 w-4" />
          Optimize Landing Page
          {aiPreferredPath === 'landing' && (
            <div className="absolute -top-1 -right-1">
              <div className="relative group">
                <Sparkles className="h-3 w-3 text-blue-600" />
                <span className="absolute -top-6 -left-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  AdAlign Preferred
                </span>
              </div>
            </div>
          )}
        </button>
      </div>
      
      {aiPreferredPath && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-blue-600" />
          <span className="hidden sm:inline">AdAlign suggests {aiPreferredPath === 'ad' ? 'optimizing your ad' : 'optimizing your landing page'}</span>
          <span className="sm:hidden">AI suggests {aiPreferredPath === 'ad' ? 'ad' : 'page'}</span>
        </div>
      )}
    </div>
  );
};

export default OptimizationPathSelector;