import React, { useState, useRef } from 'react';
import { Image, Upload, X } from 'lucide-react';
import { useAdEvaluation } from '../../context/AdEvaluationContext';

const AdAssetForm: React.FC = () => {
  const { adData, updateAdData } = useAdEvaluation();
  const [isDragging, setIsDragging] = useState(false);
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

  const handleFileUpload = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        updateAdData({ imageUrl: e.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    updateAdData({ imageUrl: null });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateAdData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Ad Assets</h2>
        <p className="text-gray-600 mb-6">
          Upload your ad creative and enter the headline and description
        </p>
      </div>
      
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Ad Image <span className="text-red-500">*</span>
        </label>
        
        {!adData.imageUrl ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Drag and drop or click to upload
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
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
      
      {/* Headline */}
      <div className="space-y-2">
        <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
          Headline <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="headline"
          name="headline"
          value={adData.headline || ''}
          onChange={handleInputChange}
          placeholder="Enter your ad headline"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          maxLength={40}
        />
        <p className="text-xs text-gray-500">
          Max 40 characters. {adData.headline ? 40 - adData.headline.length : 40} characters remaining.
        </p>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={adData.description || ''}
          onChange={handleInputChange}
          placeholder="Enter your ad description"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          maxLength={125}
        />
        <p className="text-xs text-gray-500">
          Max 125 characters. {adData.description ? 125 - adData.description.length : 125} characters remaining.
        </p>
      </div>
    </div>
  );
};

export default AdAssetForm;