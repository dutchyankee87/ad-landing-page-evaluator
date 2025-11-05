import React from 'react';
import { Zap, ArrowUp, Clock } from 'lucide-react';

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
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    };
    return styles[effort as keyof typeof styles] || styles.MEDIUM;
  };

  const getSourceBadge = (source: string) => {
    const styles = {
      ad: 'bg-blue-100 text-blue-800',
      landing_page: 'bg-purple-100 text-purple-800',
      both: 'bg-gray-100 text-gray-800'
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
        <Zap className="h-6 w-6 text-orange-500" />
        <h2 className="text-2xl font-bold">🚀 Top 3 Quick Wins</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Start with these high-impact improvements to see immediate results. Prioritized by conversion impact.
      </p>
      
      <div className="grid gap-4">
        {quickWins.slice(0, 3).map((win, index) => {
          const sourceBadge = getSourceBadge(win.source);
          
          return (
            <div 
              key={index}
              className="bg-white border-l-4 border-orange-500 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{win.title}</h3>
                </div>
                
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceBadge.style}`}>
                    {sourceBadge.label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffortBadge(win.effort)}`}>
                    {win.effort} effort
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{win.description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUp className="h-4 w-4" />
                  <span className="font-medium">Impact: {win.expectedImpact}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    {win.effort === 'LOW' ? '< 1 day' : win.effort === 'MEDIUM' ? '1-3 days' : '1+ weeks'}
                  </span>
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