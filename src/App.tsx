import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import ProductHuntBanner from './components/ProductHuntBanner';
import Home from './pages/Home';
import UsageLimitModal from './components/UsageLimitModal';
import { AdEvaluationProvider } from './context/AdEvaluationContext';

// Lazy load heavy components for better performance
const EvaluationForm = React.lazy(() => import('./pages/EvaluationForm'));
const Results = React.lazy(() => import('./pages/Results'));
const Article = React.lazy(() => import('./pages/Article'));
const Articles = React.lazy(() => import('./pages/Articles'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const EcommerceLanding = React.lazy(() => import('./pages/EcommerceLanding'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Partners = React.lazy(() => import('./pages/Partners'));
const ProductHunt = React.lazy(() => import('./pages/ProductHunt'));
const SubscriptionSuccess = React.lazy(() => import('./pages/SubscriptionSuccess'));
const SubscriptionCanceled = React.lazy(() => import('./pages/SubscriptionCanceled'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const Disclaimer = React.lazy(() => import('./pages/Disclaimer'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading component for lazy-loaded routes
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AdEvaluationProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <ProductHuntBanner enabled={import.meta.env.VITE_PRODUCT_HUNT_BANNER_ENABLED === 'true'} />
            <Header />
            <main className="flex-grow">
              <div className="container mx-auto px-4 pt-4">
                <Breadcrumbs />
              </div>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/evaluate" element={<EvaluationForm />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/ecommerce" element={<EcommerceLanding />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/producthunt" element={<ProductHunt />} />
                  <Route path="/subscription/success" element={<SubscriptionSuccess />} />
                  <Route path="/subscription/canceled" element={<SubscriptionCanceled />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/articles/:slug" element={<Article />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
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