import React, { useState, useRef } from 'react';
import { Image, Upload, X, Info, Loader2, Link, FileImage } from 'lucide-react';
import { useAdEvaluation } from '../../context/AdEvaluationContext';
import { uploadAdImageSmart, validateFileSize, validateFileType } from '../../lib/storage-dynamic';
import { validateAdUrl, detectPlatform, getPlatformConfig, formatUrlForDisplay, isPreviewUrl, type UrlValidationResult } from '../../lib/platform-detection';
import VideoUsageBanner from '../VideoUsageBanner';
import { logger } from '../../lib/logger';

const SUPPORTED_PLATFORMS = [
  { id: 'meta', name: 'Meta (Facebook/Instagram)', guidance: 'Screenshot your ad from Facebook Ads Manager or Instagram promotion. Include the full ad creative and any text overlay.' },
  { id: 'tiktok', name: 'TikTok', guidance: 'Capture your ad preview from TikTok Ads Manager. For video ads, take a screenshot of a representative frame.' },
  { id: 'linkedin', name: 'LinkedIn', guidance: 'Screenshot from LinkedIn Campaign Manager. Include the full sponsored content or ad format.' },
  { id: 'google', name: 'Google Ads', guidance: 'Capture from Google Ads interface. Include display ads, search ads, or YouTube ad thumbnails.' },
  { id: 'reddit', name: 'Reddit', guidance: 'Screenshot your promoted post or ad from Reddit Ads. Include the full post format and any media.' }
];

type InputMode = 'upload' | 'url';

const AdAssetForm: React.FC = () => {
  const { adData, updateAdData } = useAdEvaluation();
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [adUrl, setAdUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlValidation, setUrlValidation] = useState<UrlValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Reset error state
    setUploadError(null);
    
    // Validate file type
    if (!validateFileType(file)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }
    
    // Validate file size (5MB limit)
    if (!validateFileSize(file, 5)) {
      setUploadError('File size must be less than 5MB');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Smart upload - tries Supabase first, falls back to base64
      const result = await uploadAdImageSmart(file, (progress) => {
        setUploadProgress(progress);
      });
      
      // Update ad data with result
      updateAdData({ 
        imageUrl: result.url,
        imageFileSize: result.size,
        imageStoragePath: result.isSupabase ? result.path : undefined
      });
      
      // Show success message if using Supabase
      if (result.isSupabase) {
        logger.log('✅ Image uploaded to storage service');
      } else {
        logger.log('ℹ️ Using local storage (base64)');
      }
      
    } catch (error) {
      logger.error('Upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
    updateAdData({ 
      imageUrl: null, 
      imageFileSize: undefined,
      adUrl: null
    });
    setAdUrl('');
    setUrlError(null);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setAdUrl(url);
    setUrlError(null);
    setUrlValidation(null);
    
    if (url.trim()) {
      const validation = validateAdUrl(url);
      setUrlValidation(validation);
      
      if (!validation.isValid) {
        setUrlError(validation.error || 'Invalid URL');
      } else {
        // Auto-detect and update platform if different
        if (validation.platform && validation.platform !== adData.platform) {
          updateAdData({ platform: validation.platform });
        }
        // Store the URL and media type in adData
        updateAdData({ 
          adUrl: url,
          mediaType: validation.mediaType
        });
      }
    } else {
      updateAdData({ adUrl: null });
    }
  };

  const handleModeToggle = (mode: InputMode) => {
    setInputMode(mode);
    setUploadError(null);
    setUrlError(null);
    
    // Clear data from the mode we're switching away from
    if (mode === 'upload') {
      // Switching to upload mode - clear URL data
      updateAdData({ adUrl: null });
      setAdUrl('');
    } else {
      // Switching to URL mode - clear image data
      updateAdData({ 
        imageUrl: null, 
        imageFileSize: undefined,
        imageStoragePath: undefined
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateAdData({ [name]: value });
  };

  const selectedPlatform = SUPPORTED_PLATFORMS.find(p => p.id === adData.platform);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Ad Assets</h2>
        <p className="text-gray-600 mb-6">
          Select your platform and upload a screenshot or paste an ad library URL
        </p>
      </div>

      {/* Platform Selection */}
      <div className="space-y-2">
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
          Advertising Platform <span className="text-red-500">*</span>
        </label>
        <select
          id="platform"
          name="platform"
          value={adData.platform || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Select a platform...</option>
          {SUPPORTED_PLATFORMS.map(platform => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>
        {selectedPlatform && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              <strong>Screenshot Tip:</strong> {selectedPlatform.guidance}
            </p>
          </div>
        )}
      </div>

      {/* Video Usage Banner - shown when video is detected */}
      {urlValidation?.isVideoAd && <VideoUsageBanner />}
      
      {/* Input Mode Toggle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Ad Input Method <span className="text-red-500">*</span>
        </label>
        <div className="flex rounded-lg border border-gray-300 p-1 bg-gray-50">
          <button
            type="button"
            onClick={() => handleModeToggle('upload')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'upload' 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileImage className="h-4 w-4" />
            Upload Screenshot
          </button>
          <button
            type="button"
            onClick={() => handleModeToggle('url')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'url' 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Link className="h-4 w-4" />
            Paste Ad URL
          </button>
        </div>
      </div>

      {/* URL Input */}
      {inputMode === 'url' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ad Library URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={adUrl}
              onChange={handleUrlChange}
              placeholder="Paste ad library URL or preview link (e.g., fb.me/adspreview/facebook/... or v-ttam.tiktok.com/s/...)"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pl-10 ${
                urlError ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          {selectedPlatform && !urlError && adUrl && urlValidation?.isValid && (
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-medium">✓ Valid {selectedPlatform.name} URL detected</p>
                  
                  {/* URL Type Badge */}
                  {urlValidation.isPreviewUrl && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                      🔗 Preview Link
                    </span>
                  )}
                  {!urlValidation.isPreviewUrl && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 border border-cyan-200">
                      📚 Library URL
                    </span>
                  )}
                  
                  {/* Media Type Badge */}
                  {urlValidation.isVideoAd && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                      🎥 Video Ad
                    </span>
                  )}
                  {urlValidation.mediaType === 'image' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      📸 Image Ad
                    </span>
                  )}
                </div>
                <p className="mb-2">
                  {urlValidation.isPreviewUrl 
                    ? `Preview link detected! We'll capture a screenshot of the ad preview for analysis.${urlValidation.isVideoAd ? ' Video frames will be extracted for comprehensive assessment.' : ''}`
                    : urlValidation.isVideoAd 
                      ? getPlatformConfig(selectedPlatform.id)?.videoGuidance || 'Video content will be analyzed using representative frames.'
                      : getPlatformConfig(selectedPlatform.id)?.screenshotTips
                  }
                </p>
                {urlValidation.isVideoAd && (
                  <div className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                    <strong>Note:</strong> Video analysis uses additional processing and counts toward video evaluation limits.
                  </div>
                )}
                {urlValidation.isPreviewUrl && (
                  <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 mt-2">
                    <strong>Preview Link:</strong> Make sure the preview link is still valid and accessible. Preview links may expire after 30 days.
                  </div>
                )}
              </div>
            </div>
          )}
          
          {urlError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <Info className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{urlError}</p>
            </div>
          )}
        </div>
      )}

      {/* Image Upload */}
      {inputMode === 'upload' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ad Screenshot <span className="text-red-500">*</span>
          </label>
        
        {!adData.imageUrl ? (
          <div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 
                isUploading ? 'border-blue-500 bg-blue-50' :
                'border-gray-300 hover:border-gray-400'
              } ${isUploading ? 'cursor-not-allowed' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                {isUploading ? (
                  <>
                    <Loader2 className="h-10 w-10 text-blue-500 mb-2 animate-spin" />
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Uploading... {uploadProgress}%
                    </p>
                    <div className="w-48 bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WebP up to 5MB • Complete ad screenshot including all text and visuals
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
            
            {uploadError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{uploadError}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative border rounded-lg overflow-hidden">
            <img
              src={adData.imageUrl}
              alt="Ad preview"
              className="w-full h-64 object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default AdAssetForm;