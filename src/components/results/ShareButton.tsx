import React, { useState, useRef } from 'react';
import { Share2, Copy, CheckCircle, ExternalLink, Clock, Eye, Link as LinkIcon, MessageSquare } from 'lucide-react';
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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-lg mx-4 border border-gray-100"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Share2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Share Report</h3>
                      <p className="text-blue-100 text-sm">Share this analysis with your team</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
              
                {/* Report Info */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${
                            evaluation.overallScore >= 7 ? 'bg-green-500' :
                            evaluation.overallScore >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium">Score: {evaluation.overallScore}/10</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          <span>Expires in {SHARE_DURATION_HOURS}h</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        evaluation.overallScore >= 7 ? 'text-green-600' :
                        evaluation.overallScore >= 4 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {evaluation.overallScore}/10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share URL */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <LinkIcon className="h-4 w-4 text-blue-600" />
                    <label className="text-sm font-semibold text-gray-900">
                      Share Link
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg bg-gray-50 text-sm font-mono text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Copy link"
                    >
                      {copySuccess ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {copySuccess && (
                    <motion.p
                      className="text-xs text-green-600 mt-2 flex items-center gap-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <CheckCircle className="h-3 w-3" />
                      Link copied to clipboard!
                    </motion.p>
                  )}
                </div>

                {/* Share Text */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <label className="text-sm font-semibold text-gray-900">
                      Share Message
                    </label>
                  </div>
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={shareText}
                      readOnly
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg resize-none text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={5}
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <button
                      onClick={handleCopyText}
                      className="absolute top-3 right-3 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Copy message"
                    >
                      {copySuccess ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(shareUrl, '_blank')}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Preview Report
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-semibold"
                  >
                    Done
                  </button>
                </div>
                
                {/* Quick Copy Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-3 text-center">Quick actions</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleCopyUrl}
                      className="px-4 py-2 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1.5 font-medium"
                    >
                      <LinkIcon className="h-3 w-3" />
                      Copy Link
                    </button>
                    <button
                      onClick={handleCopyText}
                      className="px-4 py-2 text-xs bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors flex items-center gap-1.5 font-medium"
                    >
                      <MessageSquare className="h-3 w-3" />
                      Copy Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="mt-4 text-xs text-gray-500 bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-green-800">Privacy Protected:</span>
                    <span className="text-green-700 ml-1">
                      Shared reports contain only analysis scores and recommendations. No personal data, screenshots, or URLs are included.
                    </span>
                  </div>
                </div>
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
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-lg"
        title="Share this analysis report"
      >
        {isCreatingShare ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/30"></div>
            <span>Creating Link...</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            <span>Share Report</span>
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