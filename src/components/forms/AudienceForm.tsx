import React from 'react';
import { useAdEvaluation } from '../../context/AdEvaluationContext';

const ageRanges = [
  '13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'
];

const genders = [
  'All', 'Male', 'Female', 'Other'
];

const AudienceForm: React.FC = () => {
  const { audienceData, updateAudienceData } = useAdEvaluation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateAudienceData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Target Audience</h2>
        <p className="text-gray-600 mb-6">
          Describe the audience you're targeting with this ad
        </p>
      </div>
      
      {/* Age Range */}
      <div className="space-y-2">
        <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700">
          Age Range <span className="text-red-500">*</span>
        </label>
        <select
          id="ageRange"
          name="ageRange"
          value={audienceData.ageRange || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
        >
          <option value="" disabled>Select age range</option>
          {ageRanges.map(range => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
      </div>
      
      {/* Gender */}
      <div className="space-y-2">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          id="gender"
          name="gender"
          value={audienceData.gender || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
        >
          <option value="" disabled>Select gender</option>
          {genders.map(gender => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>
      </div>
      
      {/* Location */}
      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={audienceData.location || ''}
          onChange={handleInputChange}
          placeholder="E.g., United States, California, Global"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        <p className="text-xs text-gray-500">
          Enter countries, regions, or cities. Leave blank if targeting globally.
        </p>
      </div>
      
      {/* Interests */}
      <div className="space-y-2">
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
          Key Interests <span className="text-red-500">*</span>
        </label>
        <textarea
          id="interests"
          name="interests"
          value={audienceData.interests || ''}
          onChange={handleInputChange}
          placeholder="E.g., fitness, technology, travel, cooking, fashion"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
        />
        <p className="text-xs text-gray-500">
          List the main interests, behaviors, or demographics that define your target audience.
        </p>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Why this matters</h3>
        <p className="text-sm text-gray-600">
          Knowing your target audience helps us evaluate if your ad creative and messaging are properly tailored to appeal to this specific group. Ads that resonate with their intended audience typically perform better and achieve higher conversion rates.
        </p>
      </div>
    </div>
  );
};

export default AudienceForm;