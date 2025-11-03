import React from 'react';
import { motion } from 'framer-motion';
import { Film, Image, Zap, Crown, AlertTriangle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { getUsageSummary, getTierLimits } from '../lib/usage-tracking';

const VideoUsageBanner: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id;
  const usageSummary = getUsageSummary(userId);

  // Don't show if no video capabilities
  if (usageSummary.video.limit === 0) {
    return null;
  }

  const isVideoLow = usageSummary.video.remaining <= 1 && usageSummary.video.limit > 1;
  const isVideoOut = usageSummary.video.remaining === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl p-4 mb-6 border ${
        isVideoOut 
          ? 'bg-red-50 border-red-200' 
          : isVideoLow 
            ? 'bg-orange-50 border-orange-200'
            : 'bg-purple-50 border-purple-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 p-2 rounded-lg ${
          isVideoOut 
            ? 'bg-red-100' 
            : isVideoLow 
              ? 'bg-orange-100'
              : 'bg-purple-100'
        }`}>
          {isVideoOut ? (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          ) : (
            <Film className="h-5 w-5 text-purple-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${
              isVideoOut ? 'text-red-800' : isVideoLow ? 'text-orange-800' : 'text-purple-800'
            }`}>
              {isVideoOut 
                ? 'Video Analysis Limit Reached' 
                : 'Video Analysis Available'
              }
            </h3>
            
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                usageSummary.tier === 'free' 
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200'
              }`}>
                {usageSummary.tier === 'free' ? (
                  'Free Tier'
                ) : (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    {usageSummary.tier.charAt(0).toUpperCase() + usageSummary.tier.slice(1)}
                  </>
                )}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Image Usage */}
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">
                <span className="font-medium">{usageSummary.image.used}</span>
                <span className="text-gray-500">/{usageSummary.image.limit}</span>
                <span className="text-gray-500 ml-1">images</span>
              </span>
            </div>
            
            {/* Video Usage */}
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-purple-600" />
              <span className="text-gray-700">
                <span className={`font-medium ${isVideoOut ? 'text-red-600' : ''}`}>
                  {usageSummary.video.used}
                </span>
                <span className="text-gray-500">/{usageSummary.video.limit}</span>
                <span className="text-gray-500 ml-1">videos</span>
              </span>
            </div>
          </div>
          
          {/* Progress Bars */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            {/* Image Progress */}
            <div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, (usageSummary.image.used / usageSummary.image.limit) * 100)}%` 
                  }}
                />
              </div>
            </div>
            
            {/* Video Progress */}
            <div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isVideoOut ? 'bg-red-500' : isVideoLow ? 'bg-orange-500' : 'bg-purple-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (usageSummary.video.used / usageSummary.video.limit) * 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-3">
            {isVideoOut ? (
              <p className="text-red-700 text-sm">
                You've used all {usageSummary.video.limit} video analysis{usageSummary.video.limit > 1 ? 'es' : ''} this month. 
                Upgrade your plan for more video evaluations.
              </p>
            ) : isVideoLow ? (
              <p className="text-orange-700 text-sm">
                Only {usageSummary.video.remaining} video analysis remaining this month.
              </p>
            ) : usageSummary.tier === 'free' ? (
              <p className="text-purple-700 text-sm">
                <Zap className="inline h-4 w-4 mr-1" />
                Video analysis uses advanced processing and counts toward your video evaluation limit.
              </p>
            ) : (
              <p className="text-purple-700 text-sm">
                {usageSummary.video.remaining} video analyses remaining this month. 
                Resets in {usageSummary.daysUntilReset} days.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoUsageBanner;