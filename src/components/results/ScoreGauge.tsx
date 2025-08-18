import React from 'react';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  // Helper function to get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 7.5) return '#22C55E'; // Green
    if (score >= 5) return '#F59E0B';   // Amber
    return '#EF4444';                   // Red
  };

  // Calculate the percentage and angle
  const percentage = (score / 10) * 100;
  const angle = (percentage * 180) / 100;
  const scoreColor = getScoreColor(score);
  
  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      {/* Score Display */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center z-10">
        <div className="text-5xl font-bold" style={{ color: scoreColor }}>
          {score.toFixed(1)}
        </div>
        <div className="text-gray-500 text-lg font-medium">out of 10</div>
      </div>

      {/* Gauge */}
      <div className="pt-24 pb-6">
        <div className="relative">
          {/* Background Track */}
          <div className="h-4 bg-gray-100 rounded-full" />
          
          {/* Colored Progress */}
          <div 
            className="absolute top-0 left-0 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: scoreColor
            }}
          />

          {/* Labels */}
          <div className="flex justify-between mt-2 px-1">
            <span className="text-red-500 text-sm font-medium">Poor</span>
            <span className="text-amber-500 text-sm font-medium">Average</span>
            <span className="text-green-500 text-sm font-medium">Good</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;