import React from 'react';

interface ComponentScoresProps {
  componentScores: {
    visualMatch: number;
    contextualMatch: number;
    toneAlignment: number;
  };
}

const ComponentScores: React.FC<ComponentScoresProps> = ({ componentScores }) => {
  // Helper function to get appropriate color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 7.5) return 'text-green-600';
    if (score >= 5) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Helper function to get appropriate description based on score
  const getScoreDescription = (score: number): string => {
    if (score >= 8) return 'Excellent';
    if (score >= 7) return 'Very Good';
    if (score >= 6) return 'Good';
    if (score >= 5) return 'Average';
    if (score >= 4) return 'Fair';
    if (score >= 3) return 'Poor';
    return 'Very Poor';
  };
  
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Component Breakdown</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Visual Match */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium">Visual Match</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className={`text-2xl font-bold ${getScoreColor(componentScores.visualMatch)}`}>
                  {componentScores.visualMatch}
                </span>
                <span className="text-sm text-gray-500 ml-2">/ 10</span>
              </div>
              <span className="text-sm font-medium">
                {getScoreDescription(componentScores.visualMatch)}
              </span>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full mb-4">
              <div 
                className={`h-full rounded-full ${
                  componentScores.visualMatch >= 7.5 
                    ? 'bg-green-500' 
                    : componentScores.visualMatch >= 5 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                }`}
                style={{ width: `${componentScores.visualMatch * 10}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-600">
              How well the visuals in your ad match the aesthetics of your landing page.
            </p>
          </div>
        </div>
        
        {/* Contextual Match */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium">Contextual Match</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className={`text-2xl font-bold ${getScoreColor(componentScores.contextualMatch)}`}>
                  {componentScores.contextualMatch}
                </span>
                <span className="text-sm text-gray-500 ml-2">/ 10</span>
              </div>
              <span className="text-sm font-medium">
                {getScoreDescription(componentScores.contextualMatch)}
              </span>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full mb-4">
              <div 
                className={`h-full rounded-full ${
                  componentScores.contextualMatch >= 7.5 
                    ? 'bg-green-500' 
                    : componentScores.contextualMatch >= 5 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                }`}
                style={{ width: `${componentScores.contextualMatch * 10}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-600">
              How well the messaging in your ad aligns with the content on your landing page.
            </p>
          </div>
        </div>
        
        {/* Tone Alignment */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium">Tone of Voice Alignment</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className={`text-2xl font-bold ${getScoreColor(componentScores.toneAlignment)}`}>
                  {componentScores.toneAlignment}
                </span>
                <span className="text-sm text-gray-500 ml-2">/ 10</span>
              </div>
              <span className="text-sm font-medium">
                {getScoreDescription(componentScores.toneAlignment)}
              </span>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full mb-4">
              <div 
                className={`h-full rounded-full ${
                  componentScores.toneAlignment >= 7.5 
                    ? 'bg-green-500' 
                    : componentScores.toneAlignment >= 5 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                }`}
                style={{ width: `${componentScores.toneAlignment * 10}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-600">
              How consistent the tone and voice are between your ad and landing page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentScores;