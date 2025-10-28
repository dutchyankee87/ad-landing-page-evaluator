import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ADalign.io</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              AI-powered tool that evaluates the congruence between your paid media ads and landing pages. 
              Optimize your ad performance with actionable insights on visual match, contextual alignment, and tone consistency.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/evaluate" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Evaluate Ad
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#privacy" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Statements */}
        <div className="border-t border-gray-200 py-8">
          <div className="space-y-6">
            {/* Privacy Statement */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Privacy & Data Handling</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                We respect your privacy. Ad assets and landing page URLs you provide are processed by our AI analysis system 
                and are not stored permanently on our servers. Data is transmitted securely and used solely for generating 
                your evaluation report. We do not share your content with third parties.
              </p>
            </div>

            {/* Disclaimer */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">AI Analysis Disclaimer</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our AI-powered analysis provides insights and recommendations based on algorithmic evaluation of visual, 
                contextual, and tonal elements. Results are for informational purposes only and should not be considered 
                as guaranteed performance indicators. Marketing success depends on many factors beyond ad-to-page congruence. 
                Always test and validate recommendations in your specific market context.
              </p>
            </div>

            {/* Terms Notice */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Terms of Use</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                By using ADalign.io, you agree to our terms of service. You retain ownership of all content you submit. 
                You are responsible for ensuring you have the right to analyze any ads or landing pages you submit to our service.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-xs text-gray-500">
              © {currentYear} ADalign.io. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400">Made with AI insights for marketers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;