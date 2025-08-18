import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Home } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meta Ad Evaluator
            </span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-1 text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 transition-colors'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/evaluate" 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                location.pathname === '/evaluate' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors'
              }`}
            >
              Start Evaluation
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;