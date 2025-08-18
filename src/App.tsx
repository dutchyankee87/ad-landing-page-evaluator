import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import EvaluationForm from './pages/EvaluationForm';
import Results from './pages/Results';
import NotFound from './pages/NotFound';
import { AdEvaluationProvider } from './context/AdEvaluationContext';

function App() {
  return (
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
              © {new Date().getFullYear()} Meta Ad Evaluator. All rights reserved.
            </div>
          </footer>
        </div>
      </AdEvaluationProvider>
    </Router>
  );
}

export default App;