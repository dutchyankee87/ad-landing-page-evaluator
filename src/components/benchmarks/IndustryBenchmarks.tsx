import React from 'react';
import { TrendingUp, Award, BarChart3 } from 'lucide-react';
import { safeFormatTitle } from '../../lib/string-utils';

interface IndustryBenchmarksProps {
  score: number;
  platform: string;
  industry: string;
  benchmarkData?: {
    percentile10: number;
    percentile25: number;
    percentile50: number;
    percentile75: number;
    percentile90: number;
    sampleSize: number;
  };
  userPercentile?: number;
}

export const IndustryBenchmarks: React.FC<IndustryBenchmarksProps> = ({
  score,
  platform,
  industry,
  benchmarkData,
  userPercentile
}) => {
  if (!benchmarkData) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-center mb-2">
          <BarChart3 className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="font-medium text-gray-600">Industry Benchmarks</h3>
        </div>
        <p className="text-sm text-gray-500">
          Benchmarks will be available once we have more data for {industry} on {platform}.
        </p>
      </div>
    );
  }

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return 'text-green-600';
    if (percentile >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLevel = (percentile: number) => {
    if (percentile >= 90) return 'Exceptional';
    if (percentile >= 75) return 'Above Average';
    if (percentile >= 50) return 'Average';
    if (percentile >= 25) return 'Below Average';
    return 'Needs Improvement';
  };

  const formatIndustry = (industry: string) => {
    return safeFormatTitle(industry) || 'Unknown Industry';
  };

  const formatPlatform = (platform: string) => {
    const platformNames = {
      meta: 'Meta',
      tiktok: 'TikTok',
      linkedin: 'LinkedIn',
      google: 'Google Ads',
      reddit: 'Reddit'
    };
    return platformNames[platform as keyof typeof platformNames] || platform;
  };

  return (
    <div className="bg-white rounded-lg p-6 border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Award className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="font-medium text-gray-900">Industry Benchmarks</h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {benchmarkData.sampleSize.toLocaleString()} evaluations
        </span>
      </div>

      <div className="space-y-4">
        {/* Your Performance */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Your Performance</span>
            {userPercentile && (
              <div className="flex items-center">
                <TrendingUp className={`w-4 h-4 mr-1 ${getPercentileColor(userPercentile)}`} />
                <span className={`text-sm font-semibold ${getPercentileColor(userPercentile)}`}>
                  {userPercentile}th percentile
                </span>
              </div>
            )}
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold text-blue-600">{score.toFixed(1)}</span>
            <span className="text-sm text-gray-600 mb-1">
              {formatIndustry(industry)} · {formatPlatform(platform)}
            </span>
          </div>
          {userPercentile && (
            <p className="text-sm text-gray-600 mt-2">
              {getPerformanceLevel(userPercentile)} - Your ad scores better than {userPercentile}% 
              of {formatIndustry(industry).toLowerCase()} ads on {formatPlatform(platform)}.
            </p>
          )}
        </div>

        {/* Benchmark Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Score Distribution</h4>
          <div className="relative">
            {/* Benchmark bars */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Top 10%</span>
                <span>{benchmarkData.percentile90}+</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Top 25%</span>
                <span>{benchmarkData.percentile75}+</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Average</span>
                <span>{benchmarkData.percentile50}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Bottom 25%</span>
                <span>{benchmarkData.percentile25}-</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Bottom 10%</span>
                <span>{benchmarkData.percentile10}-</span>
              </div>
            </div>

            {/* Visual distribution */}
            <div className="mt-4">
              <div className="relative h-8 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg overflow-hidden">
                {/* Score marker */}
                {userPercentile && (
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-blue-600 z-10"
                    style={{ left: `${userPercentile}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center whitespace-nowrap">
                        You
                      </div>
                      <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-blue-600 border-transparent mx-auto"></div>
                    </div>
                  </div>
                )}
                
                {/* Percentile markers */}
                <div className="absolute inset-0 flex justify-between items-center px-1">
                  <span className="text-xs font-medium text-gray-700">0</span>
                  <span className="text-xs font-medium text-gray-700">5</span>
                  <span className="text-xs font-medium text-gray-700">10</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Poor</span>
                <span>Average</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Potential */}
        {userPercentile && userPercentile < 75 && (
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <h4 className="text-sm font-medium text-orange-800 mb-1">Improvement Potential</h4>
            <p className="text-sm text-orange-700">
              {userPercentile < 50 
                ? `Significant room for improvement. Top performers in ${formatIndustry(industry).toLowerCase()} average ${benchmarkData.percentile75}+ on ${formatPlatform(platform)}.`
                : `You're doing well, but could reach the top 25% with a score of ${benchmarkData.percentile75}+.`
              }
            </p>
          </div>
        )}

        {/* Top Performer Insight */}
        {userPercentile && userPercentile >= 75 && (
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-1">Strong Performance</h4>
            <p className="text-sm text-green-700">
              {userPercentile >= 90 
                ? `Exceptional! You're in the top 10% for ${formatIndustry(industry).toLowerCase()} on ${formatPlatform(platform)}.`
                : `Great work! You're performing above average for ${formatIndustry(industry).toLowerCase()} on ${formatPlatform(platform)}.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};