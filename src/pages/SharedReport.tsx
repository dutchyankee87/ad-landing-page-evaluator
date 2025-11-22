import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, AlertTriangle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import ScoreGauge from '../components/results/ScoreGauge';
import ComponentScores from '../components/results/ComponentScores';
import SEOHead from '../components/SEOHead';
import { isValidShareToken, isExpired, SHARE_DURATION_HOURS } from '../utils/shareUtils';

interface SharedReportData {
  shareToken: string;
  title: string;
  sanitizedData: any;
  expiresAt: string;
  viewCount: number;
  lastViewedAt: string | null;
  createdAt: string;
}

const SharedReport: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [reportData, setReportData] = useState<SharedReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!shareToken) {
      setError('Invalid share link');
      setLoading(false);
      return;
    }

    if (!isValidShareToken(shareToken)) {
      setError('Invalid share token format');
      setLoading(false);
      return;
    }

    fetchSharedReport(shareToken);
  }, [shareToken]);

  const fetchSharedReport = async (token: string) => {
    try {
      // In a real implementation, this would fetch from /api/shared-report/:token
      // For now, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Mock shared report data
      const mockData: SharedReportData = {
        shareToken: token,
        title: 'Meta Ad Analysis - 7/10 Score (11/22/2025)',
        sanitizedData: {
          overallScore: 7.2,
          visualScore: 6.8,
          contextualScore: 7.5,
          toneScore: 7.3,
          platform: 'meta',
          componentScores: {
            visual: 6.8,
            contextual: 7.5,
            tone: 7.3
          },
          visualSuggestions: [
            'Consider using more consistent brand colors across ad and landing page',
            'Align image styles to create better visual continuity'
          ],
          contextualSuggestions: [
            'Ensure headline messaging is consistent between ad and page',
            'Optimize value proposition alignment'
          ],
          toneSuggestions: [
            'Maintain consistent voice and urgency level',
            'Align emotional appeal across touchpoints'
          ],
          createdAt: new Date().toISOString(),
          targetAgeRange: '25-44',
          targetGender: 'All',
          targetLocation: 'United States',
          analysisModel: 'GPT-4'
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        viewCount: 12,
        lastViewedAt: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      };

      // Check if expired
      const expirationDate = new Date(mockData.expiresAt);
      if (isExpired(expirationDate)) {
        setExpired(true);
        setError('This shared report has expired');
        setLoading(false);
        return;
      }

      setReportData(mockData);
      setLoading(false);

      // Track view (in real implementation)
      // await fetch(`/api/shared-report/${token}/view`, { method: 'POST' });

    } catch (err) {
      console.error('Error fetching shared report:', err);
      setError('Failed to load shared report');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared report...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <>
        <SEOHead 
          title="Shared Report Not Found - adalign.io"
          description="The shared ad analysis report you're looking for is not available."
          noindex={true}
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {expired ? 'Report Expired' : 'Report Not Found'}
            </h1>
            <p className="text-gray-600 mb-6">
              {expired 
                ? `This shared report has expired. Shared reports are available for ${SHARE_DURATION_HOURS} hours.`
                : 'The shared report link is invalid or the report has been removed.'
              }
            </p>
            <Link
              to="/evaluate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium"
            >
              Create Your Own Analysis
            </Link>
          </div>
        </div>
      </>
    );
  }

  const { sanitizedData } = reportData;
  const timeRemaining = Math.ceil((new Date(reportData.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60));

  return (
    <>
      <SEOHead 
        title={`${reportData.title} - Shared Ad Analysis`}
        description="View shared ad analysis report with optimization recommendations and performance insights."
        noindex={true}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/evaluate"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Create Your Own Analysis</span>
              </Link>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{reportData.viewCount} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Expires in {timeRemaining}h</span>
                </div>
              </div>
            </div>

            {/* Shared Report Notice */}
            <motion.div 
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 text-blue-800 text-sm">
                <ExternalLink className="h-4 w-4" />
                <span className="font-medium">Shared Analysis Report</span>
              </div>
              <p className="text-blue-700 text-xs mt-1">
                This is a shared report containing analysis insights and recommendations. Personal data and screenshots have been removed for privacy.
              </p>
            </motion.div>

            {/* Main Report */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-100">
                <h1 className="text-xl font-semibold text-gray-800 mb-1">
                  {reportData.title}
                </h1>
                <p className="text-gray-600 text-sm">
                  Shared ad analysis for {sanitizedData.platform || 'unknown platform'} campaign
                </p>
              </div>
              
              <div className="p-6">
                {/* Overall Score */}
                <motion.section 
                  className="mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        Alignment Score
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        This score reveals how well the ad and landing page work together to convert visitors.
                        Higher scores typically indicate better conversion potential.
                      </p>
                      <div className="text-sm text-gray-500">
                        <div className="font-medium">out of 10</div>
                        <div className="font-semibold text-gray-700">
                          {getScoreDescription(sanitizedData.overallScore)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ScoreGauge score={sanitizedData.overallScore} />
                    </div>
                  </div>
                </motion.section>

                {/* Component Scores */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ComponentScores componentScores={sanitizedData.componentScores} />
                </motion.div>

                {/* Recommendations */}
                <motion.section 
                  className="mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                    Key Recommendations
                  </h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Visual Recommendations */}
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h3 className="font-semibold text-purple-900 mb-3">Visual Alignment</h3>
                      <div className="space-y-2">
                        {sanitizedData.visualSuggestions?.slice(0, 3).map((suggestion: string, index: number) => (
                          <div key={index} className="text-sm text-purple-800">
                            • {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contextual Recommendations */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-3">Content Alignment</h3>
                      <div className="space-y-2">
                        {sanitizedData.contextualSuggestions?.slice(0, 3).map((suggestion: string, index: number) => (
                          <div key={index} className="text-sm text-blue-800">
                            • {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tone Recommendations */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-3">Tone Alignment</h3>
                      <div className="space-y-2">
                        {sanitizedData.toneSuggestions?.slice(0, 3).map((suggestion: string, index: number) => (
                          <div key={index} className="text-sm text-green-800">
                            • {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Analysis Metadata */}
                <motion.section 
                  className="mt-12 pt-8 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="font-medium text-gray-700">Platform</div>
                      <div className="capitalize">{sanitizedData.platform}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Target Age</div>
                      <div>{sanitizedData.targetAgeRange || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Analysis Model</div>
                      <div>{sanitizedData.analysisModel || 'GPT-4'}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Generated</div>
                      <div>{new Date(sanitizedData.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </motion.section>
              </div>
            </div>

            {/* CTA Section */}
            <motion.div 
              className="text-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Want to analyze your own ads?
              </h3>
              <p className="text-gray-600 mb-4">
                Get personalized recommendations and detailed insights for your campaigns.
              </p>
              <Link
                to="/evaluate"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium"
              >
                Try adalign.io Free
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to get score description
const getScoreDescription = (score: number): string => {
  if (score >= 9) return 'Excellent Alignment';
  if (score >= 7) return 'Strong Alignment';
  if (score >= 5) return 'Moderate Alignment';
  if (score >= 3) return 'Weak Alignment';
  return 'Poor Alignment';
};

export default SharedReport;