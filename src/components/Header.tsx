import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Home, BookOpen } from 'lucide-react';

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
          
          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-1 text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-black' 
                  : 'text-gray-600 hover:text-black transition-colors'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <a 
              href="/#articles" 
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Articles</span>
            </a>
            
            <Link 
              to="/evaluate" 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                location.pathname === '/evaluate' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-50 text-black hover:bg-gray-100 transition-colors'
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