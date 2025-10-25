import React, { useState, useRef } from 'react';
import { Image, Upload, X, Info, Loader2 } from 'lucide-react';
import { useAdEvaluation } from '../../context/AdEvaluationContext';
import { uploadAdImage, validateFileSize, validateFileType, deleteAdImage } from '../../lib/storage';

const SUPPORTED_PLATFORMS = [
  { id: 'meta', name: 'Meta (Facebook/Instagram)', guidance: 'Screenshot your ad from Facebook Ads Manager or Instagram promotion. Include the full ad creative and any text overlay.' },
  { id: 'tiktok', name: 'TikTok', guidance: 'Capture your ad preview from TikTok Ads Manager. For video ads, take a screenshot of a representative frame.' },
  { id: 'linkedin', name: 'LinkedIn', guidance: 'Screenshot from LinkedIn Campaign Manager. Include the full sponsored content or ad format.' },
  { id: 'google', name: 'Google Ads', guidance: 'Capture from Google Ads interface. Include display ads, search ads, or YouTube ad thumbnails.' },
  { id: 'reddit', name: 'Reddit', guidance: 'Screenshot your promoted post or ad from Reddit Ads. Include the full post format and any media.' }
];

const AdAssetForm: React.FC = () => {
  const { adData, updateAdData } = useAdEvaluation();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
      // Upload to Supabase storage
      const result = await uploadAdImage(file, (progress) => {
        setUploadProgress(progress);
      });
      
      // Update ad data with Supabase URL and metadata
      updateAdData({ 
        imageUrl: result.url,
        imageStoragePath: result.path,
        imageFileSize: result.size
      });
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = async () => {
    // If there's a storage path, try to delete the file from Supabase
    if (adData.imageStoragePath) {
      try {
        await deleteAdImage(adData.imageStoragePath);
      } catch (error) {
        console.warn('Failed to delete image from storage:', error);
      }
    }
    
    updateAdData({ 
      imageUrl: null, 
      imageStoragePath: undefined,
      imageFileSize: undefined
    });
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
          Select your platform and upload a screenshot of your complete ad
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
      
      {/* Image Upload */}
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
    </div>
  );
};

export default AdAssetForm;