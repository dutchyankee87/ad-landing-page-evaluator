import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-orange-300 to-gray-300 bg-clip-text text-transparent">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6">This Page is Misaligned</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Just like a bad ad-to-page match, this URL doesn't lead anywhere useful. 
          Let's get you back on track!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg transform hover:-translate-y-0.5"
        >
          <Home className="h-5 w-5" />
          Back to adalign.io
        </Link>
      </div>
    </div>
  );
};

export default NotFound;