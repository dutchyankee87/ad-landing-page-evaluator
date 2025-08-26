import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Home from './pages/Home';
import EvaluationForm from './pages/EvaluationForm';
import Results from './pages/Results';
import NotFound from './pages/NotFound';
import UsageLimitModal from './components/UsageLimitModal';
import { AdEvaluationProvider } from './context/AdEvaluationContext';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AdEvaluationProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/evaluate" element={<EvaluationForm />} />
                <Route path="/results" element={<Results />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <footer className="bg-white py-6 border-t border-gray-200">
              <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} adalign.io. All rights reserved.
              </div>
            </footer>
            
            <UsageLimitModal />
          </div>
        </AdEvaluationProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;