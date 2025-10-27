import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, CreditCard } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-black bg-clip-text text-transparent">
              ADalign.io
            </span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <a 
              href="/#articles" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              <BookOpen className="h-4 w-4" />
              <span>Articles</span>
            </a>
            
            <Link 
              to="/pricing" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              <CreditCard className="h-4 w-4" />
              <span>Pricing</span>
            </Link>
            
            <Link 
              to="/evaluate" 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                location.pathname === '/evaluate' 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg hover:scale-105'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Start Evaluation</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;