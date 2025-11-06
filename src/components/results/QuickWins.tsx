import React from 'react';
import { Zap, ArrowUp, Clock, TrendingUp } from 'lucide-react';

interface QuickWin {
  title: string;
  description: string;
  expectedImpact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  source: 'ad' | 'landing_page' | 'both';
}

interface QuickWinsProps {
  quickWins: QuickWin[];
}

const QuickWins: React.FC<QuickWinsProps> = ({ quickWins }) => {
  const getEffortBadge = (effort: string) => {
    const styles = {
      LOW: 'bg-green-100 text-green-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      HIGH: 'bg-red-100 text-red-700'
    };
    return styles[effort as keyof typeof styles] || styles.MEDIUM;
  };

  const getSourceBadge = (source: string) => {
    const styles = {
      ad: 'bg-blue-100 text-blue-700',
      landing_page: 'bg-purple-100 text-purple-700',
      both: 'bg-gray-100 text-gray-700'
    };
    
    const labels = {
      ad: 'Fix Ad',
      landing_page: 'Fix Landing Page',
      both: 'Fix Both'
    };
    
    return {
      style: styles[source as keyof typeof styles] || styles.both,
      label: labels[source as keyof typeof labels] || labels.both
    };
  };

  if (!quickWins || quickWins.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Zap className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Top 3 Quick Wins
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            High-impact optimizations you can implement immediately to boost conversions
          </p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {quickWins.slice(0, 3).map((quickWin, index) => {
          const sourceBadge = getSourceBadge(quickWin.source);
          
          return (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-sm font-medium ${sourceBadge.style}`}>
                    {sourceBadge.label}
                  </span>
                </div>
                
                <span className={`px-3 py-1 rounded-md text-sm font-medium ${getEffortBadge(quickWin.effort)}`}>
                  {quickWin.effort} effort
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{quickWin.title}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{quickWin.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium text-sm">Impact: {quickWin.expectedImpact}</span>
                </div>
                
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Quick implementation</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QuickWins;