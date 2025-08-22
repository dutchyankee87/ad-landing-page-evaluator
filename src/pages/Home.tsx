import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const Home: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="Optimize Your Ad Performance with AI-Powered Landing Page Analysis"
        description="Analyze ad-to-landing page congruence with AI. Optimize Meta, Google, TikTok & LinkedIn ads for better conversion rates. Free analysis available."
        keywords="ad landing page optimization tool, paid ad performance, ad congruence analysis, meta ads optimization, google ads analyzer, tiktok ad optimization, linkedin ad performance, conversion rate optimization, AI marketing tool"
        url="/"
      />
      <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="h-4 w-4" />
78% of paid ads lose money due to poor landing page alignment
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Stop Burning Money on
            <span className="block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Misaligned Paid Ads
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Discover exactly why your Meta, TikTok, LinkedIn, Reddit & Google ads aren't converting with our AI-powered congruence analyzer. Get a detailed report in under 60 seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              to="/evaluate" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Analyze My Ads Now - Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle className="h-5 w-5" />
              No signup required • Results in 60 seconds
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Average 34% CTR improvement
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              Save $2,400/month in ad spend
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl border-2 border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">Why Your Paid Ads Fail</h2>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">×</span>
                  <span>Ad promises don't match landing page reality</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">×</span>
                  <span>Visual disconnect confuses potential customers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">×</span>
                  <span>Tone and messaging inconsistency kills trust</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">×</span>
                  <span>No systematic way to identify these gaps</span>
                </li>
              </ul>
            </div>
            
            {/* Solution */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl border-2 border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Our AI Solution Delivers</h2>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Precise visual alignment scoring (0-10 scale)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Content congruence analysis with GPT-4</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Tone consistency evaluation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Actionable fixes to boost conversions 2x</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Get Your Congruence Score in 3 Steps</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Takes less time than grabbing coffee ☕</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Ad</h3>
              <p className="text-gray-600">
                Paste your ad image URL, headline, and description. Works with Meta, TikTok, LinkedIn, Reddit & Google ads.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Enter Landing Page URL</h3>
              <p className="text-gray-600">
                Our AI scrapes and analyzes your landing page content, design, and messaging automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Get Your Report</h3>
              <p className="text-gray-600">
                Receive detailed scores and specific recommendations to improve your conversion rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Preview */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">See Exactly What's Killing Your Conversions</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Real analysis from our AI engine</p>
          
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Congruence Analysis Report</h3>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-sm">Overall Score</span>
                  <div className="text-3xl font-bold">4.2/10</div>
                </div>
              </div>
            </div>
            
            <div className="p-8 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">2.8</span>
                </div>
                <h4 className="font-semibold text-red-600 mb-2">Visual Match</h4>
                <p className="text-sm text-gray-600">Ad shows luxury watch, landing page features budget accessories</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">5.1</span>
                </div>
                <h4 className="font-semibold text-yellow-600 mb-2">Content Alignment</h4>
                <p className="text-sm text-gray-600">Messaging partially matches but lacks key value propositions</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">4.7</span>
                </div>
                <h4 className="font-semibold text-orange-600 mb-2">Tone Consistency</h4>
                <p className="text-sm text-gray-600">Ad uses urgent language, page feels corporate and slow</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 border-t">
              <h4 className="font-semibold mb-3">🎯 Priority Fixes</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Replace landing page hero image with luxury watch to match ad visual</li>
                <li>• Add urgency elements ("Limited time offer") to page headline</li>
                <li>• Update product descriptions to emphasize premium quality mentioned in ad</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Join 2,847 Marketers Already Saving Money</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">+73%</div>
              <p className="text-gray-600 font-medium mb-3">Average CTR Increase</p>
              <p className="text-sm text-gray-500">"Fixed our TikTok ad-page disconnect in one day. CTR jumped from 1.2% to 2.1%"</p>
              <div className="mt-3 text-sm font-medium text-gray-700">- Sarah K, E-commerce Director</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">$4,200</div>
              <p className="text-gray-600 font-medium mb-3">Monthly Ad Spend Saved</p>
              <p className="text-sm text-gray-500">"Stopped wasting money on misaligned LinkedIn campaigns. ROI improved 2.3x"</p>
              <div className="mt-3 text-sm font-medium text-gray-700">- Mike T, SaaS Marketing</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">60 sec</div>
              <p className="text-gray-600 font-medium mb-3">Average Analysis Time</p>
              <p className="text-sm text-gray-500">"Tested our Google & Meta ads - way faster than hiring expensive consultants"</p>
              <div className="mt-3 text-sm font-medium text-gray-700">- Jennifer L, Agency Owner</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 text-white p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <DollarSign className="h-4 w-4" />
                Stop losing $2,400+ monthly to misaligned ads
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Your Competitors Are Already 
                <span className="block">Optimizing Their Ad Alignment</span>
              </h2>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Don't let another day pass burning money on misaligned paid ads. Get your congruence score and fix what's broken.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/evaluate" 
                  className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold text-lg px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Analyze My Ads Now - It's Free
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-6 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Results in 60 seconds
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Used by 2,847+ marketers
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;