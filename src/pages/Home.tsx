import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Globe } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Evaluate Your Meta Ads for Maximum Performance
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Analyze how well your Facebook and Instagram ads match their landing pages — both visually and contextually.
          </p>
          <Link 
            to="/evaluate" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full transition-colors shadow-lg hover:shadow-xl"
          >
            Start Free Evaluation
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Input Ad Details</h3>
              <p className="text-gray-600">
                Upload your ad creative, headline, and description to begin the evaluation process.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Landing Page</h3>
              <p className="text-gray-600">
                Enter your landing page URL and we'll automatically analyze its content and visuals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Comprehensive Scoring</h3>
              <p className="text-gray-700 mb-4">
                Receive an overall relevance score from 0-10 that measures how well your ad and landing page align.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 text-blue-600 mt-0.5">✓</span>
                  <span className="text-gray-600">Visual Match Assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 text-blue-600 mt-0.5">✓</span>
                  <span className="text-gray-600">Contextual Content Analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 text-blue-600 mt-0.5">✓</span>
                  <span className="text-gray-600">Tone of Voice Alignment</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-purple-700">Actionable Insights</h3>
              <p className="text-gray-700 mb-4">
                Get specific recommendations to improve your ad performance and conversion rates.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 text-purple-600 mt-0.5">✓</span>
                  <span className="text-gray-600">Copy Improvement Suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 text-purple-600 mt-0.5">✓</span>
                  <span className="text-gray-600">Visual Congruence Tips</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 text-purple-600 mt-0.5">✓</span>
                  <span className="text-gray-600">CTA Optimization Advice</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-2xl shadow-xl">
          <BarChart3 className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Ad Performance?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start evaluating your Meta ads now and discover opportunities for improvement.
          </p>
          <Link 
            to="/evaluate" 
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-full transition-colors"
          >
            Start Evaluation
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;