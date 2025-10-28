import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import EvaluationForm from './pages/EvaluationForm';
import Results from './pages/Results';
import Article from './pages/Article';
import Pricing from './pages/Pricing';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCanceled from './pages/SubscriptionCanceled';
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
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/subscription/success" element={<SubscriptionSuccess />} />
                <Route path="/subscription/canceled" element={<SubscriptionCanceled />} />
                <Route path="/articles/:slug" element={<Article />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            
            <UsageLimitModal />
          </div>
        </AdEvaluationProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;