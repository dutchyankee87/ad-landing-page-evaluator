import React, { useState, useRef } from 'react';
import { Share2, Copy, CheckCircle, ExternalLink, Clock, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  generateShareToken, 
  generateShareUrl, 
  formatShareText, 
  createShareTitle,
  sanitizeEvaluationData,
  calculateExpirationDate,
  SHARE_DURATION_HOURS
} from '../../utils/shareUtils';

interface ShareButtonProps {
  evaluation: any; // Full evaluation data
  onShare?: (shareUrl: string) => void;
  onError?: (error: string) => void;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  title: string;
  evaluation: any;
  onCopy: () => void;
  copySuccess: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  shareUrl, 
  title, 
  evaluation, 
  onCopy, 
  copySuccess 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const shareText = formatShareText(shareUrl, title, evaluation.overallScore);
  
  const handleCopyText = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      navigator.clipboard.writeText(shareText);
      onCopy();
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    onCopy();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-blue-500" />
                  Share Report
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
              
              {/* Report Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Score: {evaluation.overallScore}/10
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires in {SHARE_DURATION_HOURS}h
                  </div>
                </div>
              </div>

              {/* Share URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
                  >
                    {copySuccess ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Share Text */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Message
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={shareText}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none text-sm"
                    rows={6}
                  />
                  <button
                    onClick={handleCopyText}
                    className="absolute top-2 right-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    {copySuccess ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.open(shareUrl, '_blank')}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>

              {/* Privacy Notice */}
              <div className="mt-4 text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
                <strong>Privacy:</strong> Shared reports contain only analysis scores and generic recommendations. 
                No personal data, screenshots, or URLs are included.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ShareButton: React.FC<ShareButtonProps> = ({ evaluation, onShare, onError }) => {
  const [isCreatingShare, setIsCreatingShare] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [title, setTitle] = useState('');

  const handleCreateShare = async () => {
    if (!evaluation) {
      onError?.('No evaluation data available to share');
      return;
    }

    setIsCreatingShare(true);
    
    try {
      // Generate share token and URL
      const shareToken = generateShareToken();
      const generatedUrl = generateShareUrl(shareToken);
      const shareTitle = createShareTitle(evaluation);
      
      // Sanitize evaluation data
      const sanitizedData = sanitizeEvaluationData(evaluation);
      
      // Create shared report (this would typically make an API call)
      const shareData = {
        shareToken,
        evaluationId: evaluation.id,
        title: shareTitle,
        sanitizedData,
        expiresAt: calculateExpirationDate(),
      };
      
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate success and show the modal
      setShareUrl(generatedUrl);
      setTitle(shareTitle);
      setShowModal(true);
      
      onShare?.(generatedUrl);
      
    } catch (error) {
      console.error('Error creating share:', error);
      onError?.('Failed to create shareable link. Please try again.');
    } finally {
      setIsCreatingShare(false);
    }
  };

  const handleCopy = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShareUrl('');
    setTitle('');
  };

  return (
    <>
      <button
        onClick={handleCreateShare}
        disabled={isCreatingShare}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        title="Share this analysis report"
      >
        {isCreatingShare ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span>Creating...</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </>
        )}
      </button>

      <ShareModal
        isOpen={showModal}
        onClose={handleCloseModal}
        shareUrl={shareUrl}
        title={title}
        evaluation={evaluation}
        onCopy={handleCopy}
        copySuccess={copySuccess}
      />
    </>
  );
};

export default ShareButton;