import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How does the AI analysis work?",
          answer: "Our AI compares your ad creative, copy, and landing page content across three key dimensions: visual alignment (colors, images, design), message consistency (headlines, promises, offers), and tone matching (urgency, formality, emotion). The analysis takes 60 seconds and provides specific recommendations."
        },
        {
          question: "Which ad platforms are supported?",
          answer: "We support all major advertising platforms including Meta (Facebook & Instagram), Google Ads, TikTok, LinkedIn, and Reddit. Simply upload your ad creative and provide your landing page URL for instant analysis."
        },
        {
          question: "How accurate is the analysis?",
          answer: "Our AI achieves 94% accuracy compared to manual expert analysis, based on testing with over 10,000 ad-to-page comparisons. The tool has been trained on successful campaigns across 50+ industries."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "Is my ad data secure and private?",
          answer: "Yes, absolutely. We securely store your ad content and landing page data to build industry benchmarks and improve our AI analysis accuracy. This anonymized data helps us provide better insights across different industries and platforms. We never share your specific ad content or landing page information with third parties. See our <a href='/privacy-policy' class='text-orange-600 hover:text-orange-700 underline'>Privacy Policy</a> for full details."
        },
        {
          question: "What happens to my uploaded images?",
          answer: "Ad images are securely stored and used to build industry benchmarks that help improve our AI analysis for all users. Your creative assets are anonymized and aggregated with data from other campaigns to identify trends and best practices across different industries and platforms. This helps us provide more accurate recommendations and insights."
        },
        {
          question: "How do you use my data for industry benchmarks?",
          answer: "We anonymize and aggregate your ad content and landing page data to create industry-wide benchmarks and performance insights. This helps us identify what works best across different sectors (e-commerce, SaaS, healthcare, etc.) and improve our AI recommendations. Your specific business information remains confidential and is never shared in identifiable form."
        },
        {
          question: "Do you share data with third parties?",
          answer: "No, we never share your ad content, landing page data, or analysis results with any third parties. Your business data remains completely private and confidential."
        }
      ]
    },
    {
      category: "Pricing & Plans",
      questions: [
        {
          question: "Is there really a free plan?",
          answer: "Yes! You get 3 free ad analyses per month with no credit card required and no time limits. This lets you test the tool and see the value before upgrading to a paid plan."
        },
        {
          question: "Can I use this for multiple ad accounts?",
          answer: "Yes! Our <a href='/pricing' class='text-orange-600 hover:text-orange-700 underline'>paid plans</a> support unlimited ad accounts and team collaboration. The free plan allows 3 analyses per month from any accounts."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Absolutely. Cancel with one click, no questions asked. No contracts, no hidden fees. If you cancel, you'll retain access until the end of your billing period."
        },
        {
          question: "What if I exceed my monthly limit?",
          answer: "No overage fees! We'll simply suggest upgrading to a plan that fits your usage. Your limits reset at the beginning of each month."
        }
      ]
    },
    {
      category: "Using the Tool",
      questions: [
        {
          question: "What file formats can I upload?",
          answer: "We support JPG, PNG, GIF, and WebP formats for ad images. For video ads, you can upload a screenshot of the key frame. File size limit is 10MB per upload."
        },
        {
          question: "Can I analyze video ads?",
          answer: "Currently, we analyze static images. For video ads, we recommend uploading a screenshot of the most important frame (usually the first 3 seconds) along with any text overlay or CTA from the video."
        },
        {
          question: "What if I don't agree with the recommendations?",
          answer: "Our recommendations are data-driven suggestions based on conversion optimization best practices. You can always choose which suggestions to implement. We also provide explanations for why each recommendation matters for performance."
        },
        {
          question: "How detailed are the analysis results?",
          answer: "You get specific scores for visual match, content alignment, and tone consistency, plus detailed recommendations for improvement. Each suggestion explains the issue and how to fix it."
        }
      ]
    },
    {
      category: "Technical Questions",
      questions: [
        {
          question: "Do I need to install any software?",
          answer: "No installation required! ADalign.io is a web-based tool that works in any modern browser. Simply visit our website, upload your ad, and get instant results."
        },
        {
          question: "Does it work on mobile devices?",
          answer: "Yes, our tool is fully mobile-responsive. You can upload ads and view analysis results on smartphones and tablets, though the desktop experience offers the best viewing for detailed recommendations."
        },
        {
          question: "What browsers are supported?",
          answer: "We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser."
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const flatIndex = faqs.slice(0, categoryIndex).reduce((acc, cat) => acc + cat.questions.length, 0) + questionIndex;
    setOpenIndex(openIndex === flatIndex ? null : flatIndex);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
      <SEOHead 
        title="Frequently Asked Questions - ADalign.io Help Center"
        description="Get answers to common questions about ADalign.io's AI-powered ad analysis tool. Learn about features, pricing, privacy, and how to optimize your ad performance."
        keywords="ADalign FAQ, ad analysis help, ad optimization questions, landing page analysis support"
        url="/faq"
      />

      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.flatMap(category => 
            category.questions.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer.replace(/<[^>]*>/g, '') // Strip HTML for schema
              }
            }))
          )
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50/20">
        <div className="container mx-auto px-4 py-8">
          
          {/* Hero Section */}
          <motion.section 
            className="mb-16 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <HelpCircle className="h-4 w-4" />
                Help Center
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              >
                Frequently Asked
                <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Questions
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
              >
                Everything you need to know about ADalign.io's AI-powered ad analysis tool
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link 
                  to="/evaluate"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Try Free Analysis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="text-gray-500 text-sm">Still have questions? <a href="#contact" className="text-orange-600 hover:text-orange-700 underline">Contact support</a></p>
              </motion.div>
            </div>
          </motion.section>

          {/* FAQ Content */}
          <motion.section 
            className="mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-4xl mx-auto">
              {faqs.map((category, categoryIndex) => (
                <motion.div 
                  key={categoryIndex}
                  variants={itemVariants}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {categoryIndex + 1}
                    </div>
                    {category.category}
                  </h2>
                  
                  <div className="space-y-4">
                    {category.questions.map((faq, questionIndex) => {
                      const flatIndex = faqs.slice(0, categoryIndex).reduce((acc, cat) => acc + cat.questions.length, 0) + questionIndex;
                      const isOpen = openIndex === flatIndex;
                      
                      return (
                        <motion.div
                          key={questionIndex}
                          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (categoryIndex * 3 + questionIndex) * 0.1 }}
                        >
                          <button
                            onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                            className="w-full text-left p-6 focus:outline-none focus:ring-4 focus:ring-orange-300 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                {faq.question}
                              </h3>
                              <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex-shrink-0"
                              >
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              </motion.div>
                            </div>
                          </button>
                          
                          <motion.div
                            initial={false}
                            animate={{
                              height: isOpen ? "auto" : 0,
                              opacity: isOpen ? 1 : 0
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6">
                              <div 
                                className="text-gray-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                              />
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Contact Support CTA */}
          <motion.section 
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8 lg:p-12 text-center"
            id="contact"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Still need help?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Can't find what you're looking for? Our team is here to help you get the most out of ADalign.io.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link 
                to="/pricing"
                className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Pricing Plans
              </Link>
              <Link 
                to="/evaluate"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
              >
                Try Free Analysis
              </Link>
            </div>
          </motion.section>

        </div>
      </div>
    </>
  );
};

export default FAQ;