import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useAdEvaluation } from '../../context/AdEvaluationContext';

const RunNewTestButton: React.FC = () => {
  const navigate = useNavigate();
  const { adData, landingPageData, audienceData, resetEvaluation, updateAdData, updateLandingPageData, updateAudienceData } = useAdEvaluation();

  const handleRunNewTest = () => {
    // Store the current data
    const currentAdData = { ...adData };
    const currentLandingPageData = { ...landingPageData };
    const currentAudienceData = { ...audienceData };

    // Reset evaluation state
    resetEvaluation();

    // Pre-populate with stored data
    updateAdData(currentAdData);
    updateLandingPageData(currentLandingPageData);
    updateAudienceData(currentAudienceData);

    // Navigate to evaluation form
    navigate('/evaluate');
  };

  return (
    <button
      onClick={handleRunNewTest}
      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      <RefreshCw className="h-4 w-4" />
      Run New Test with Same Data
    </button>
  );
};

export default RunNewTestButton;