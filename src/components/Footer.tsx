import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ADalign.io</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md mb-4">
              AI-powered tool that evaluates the congruence between your paid media ads and landing pages. 
              Optimize your ad performance with actionable insights on visual match, contextual alignment, and tone consistency.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                to="/evaluate" 
                className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Start Analysis
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/evaluate" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Ad Analysis Tool
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Blog & Guides
                </Link>
              </li>
              <li>
                <Link to="/ecommerce" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  E-commerce Solutions
                </Link>
              </li>
              <li>
                <Link to="/blog/facebook-ads-landing-page-mismatch" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Why 78% of Ads Fail
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Support & Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#help" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Contact Support
                </a>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Disclaimer
                </Link>
              </li>
            </ul>
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