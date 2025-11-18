import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const PrivacyPolicy: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
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
        title="Privacy Policy - ADalign.io"
        description="Learn how ADalign.io protects your privacy and handles your data during ad analysis."
        keywords="privacy policy, data protection, ad analysis privacy"
        url="/privacy-policy"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                <Shield className="h-4 w-4" />
                Your Privacy Matters
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
            >
              Privacy Policy
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Last updated: October 28, 2024
            </motion.p>
          </motion.div>

          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            
            <div className="space-y-8">
              
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    When you use ADalign.io, we may collect the following information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Ad Content:</strong> Images, headlines, descriptions, and other creative assets you submit for analysis</li>
                    <li><strong>Landing Page Data:</strong> URLs and publicly accessible content from landing pages you analyze</li>
                    <li><strong>Usage Data:</strong> Information about how you interact with our service, including analysis requests and results</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, device information, and access logs</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide AI-powered ad analysis and generate evaluation reports</li>
                    <li>Build anonymized industry benchmarks and performance insights to improve recommendations</li>
                    <li>Improve our analysis algorithms and service quality through aggregated data analysis</li>
                    <li>Monitor and analyze usage patterns to enhance user experience</li>
                    <li>Ensure security and prevent fraudulent use of our service</li>
                    <li>Communicate with you about your account and service updates</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Data Storage & Security</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We implement industry-standard security measures to protect your data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Encryption:</strong> All data is transmitted using SSL/TLS encryption</li>
                    <li><strong>Secure Storage:</strong> Ad content and landing page data are securely stored and anonymized for building industry benchmarks</li>
                    <li><strong>Access Controls:</strong> Strict access controls limit who can view your data</li>
                    <li><strong>Data Retention:</strong> Analysis results and anonymized data may be stored to improve service quality and build industry insights</li>
                    <li><strong>Anonymization:</strong> All stored data is anonymized and aggregated to protect your business privacy while enabling industry benchmarks</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Industry Benchmarks & Data Usage</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We use your ad content and landing page data to create valuable industry insights:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Anonymized Benchmarks:</strong> Your data is anonymized and aggregated to build performance benchmarks across industries</li>
                    <li><strong>Trend Analysis:</strong> We identify what works best across different sectors (e-commerce, SaaS, healthcare, etc.)</li>
                    <li><strong>AI Improvement:</strong> Aggregated data helps train and improve our AI models for better recommendations</li>
                    <li><strong>Privacy Protection:</strong> All data is stripped of identifying information before being used for benchmarks</li>
                  </ul>
                  <p>
                    This approach allows us to provide increasingly accurate recommendations while maintaining your business privacy.
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="h-6 w-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Data Sharing</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform (e.g., OpenAI for AI analysis)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>You have the following rights regarding your personal data:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> Request information about what personal data we have about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate personal data</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
                    <li><strong>Objection:</strong> Object to processing of your personal data</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We use cookies and similar technologies to improve your experience and analyze usage patterns. You can control cookie settings through your browser preferences.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.
                  </p>
                </div>
              </section>

              <section className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <div className="space-y-2 text-gray-700">
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <p><strong>Email:</strong> privacy@adalign.io</p>
                  <p><strong>Address:</strong> [Company Address]</p>
                </div>
              </section>

            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;