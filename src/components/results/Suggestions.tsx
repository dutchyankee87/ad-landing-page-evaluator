import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

interface SuggestionsProps {
  suggestions: {
    visual: string[];
    contextual: string[];
    tone: string[];
  };
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions }) => {
  const [openCategory, setOpenCategory] = useState<string>('visual');
  
  const toggleCategory = (category: string) => {
    if (openCategory === category) {
      setOpenCategory('');
    } else {
      setOpenCategory(category);
    }
  };
  
  const categories = [
    { id: 'visual', label: 'Visual Improvements', items: suggestions.visual },
    { id: 'contextual', label: 'Content & Message Alignment', items: suggestions.contextual },
    { id: 'tone', label: 'Tone & Voice Optimization', items: suggestions.tone },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Improvement Suggestions</h2>
      
      <div className="space-y-4">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleCategory(category.id)}
              className={`w-full text-left px-4 py-3 flex items-center justify-between font-medium transition-colors ${
                openCategory === category.id ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
              {openCategory === category.id ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {openCategory === category.id && (
              <div className="p-4 bg-white">
                {category.items.length > 0 ? (
                  <ul className="space-y-3">
                    {category.items.map((item, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-blue-600" />
                          </div>
                        </div>
                        <div className="text-gray-700">
                          <div className="mb-1">{item}</div>
                          {item.includes('#') && (
                            <div className="text-xs text-gray-500 italic">
                              💡 Technical recommendation with specific values
                            </div>
                          )}
                          {item.includes('"') && (
                            <div className="text-xs text-gray-500 italic">
                              ✏️ Copy-ready suggestion
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No suggestions available for this category.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Suggestions;