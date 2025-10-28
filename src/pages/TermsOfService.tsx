import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileCheck, AlertTriangle, Shield, CreditCard, Users } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const TermsOfService: React.FC = () => {
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
        title="Terms of Service - ADalign.io"
        description="Read the terms and conditions for using ADalign.io's ad analysis service."
        keywords="terms of service, terms and conditions, ad analysis terms"
        url="/terms-of-service"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                <Scale className="h-4 w-4" />
                Legal Terms
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
            >
              Terms of Service
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
                  <FileCheck className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    By accessing and using ADalign.io ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Use License</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Permission is granted to temporarily access ADalign.io for personal and commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Use the service to analyze content you don't have rights to</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">User Responsibilities</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>As a user of ADalign.io, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Ownership Rights:</strong> Only submit ads and landing pages you have the right to analyze</li>
                    <li><strong>Accurate Information:</strong> Provide accurate and complete information when using our service</li>
                    <li><strong>Lawful Use:</strong> Use the service only for lawful purposes and in accordance with these Terms</li>
                    <li><strong>Content Responsibility:</strong> Take full responsibility for any content you submit to our platform</li>
                    <li><strong>Account Security:</strong> Maintain the security of your account credentials if applicable</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Subscription and Payment Terms</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>For paid subscription services:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Billing:</strong> Subscriptions are billed monthly or annually as selected</li>
                    <li><strong>Automatic Renewal:</strong> Subscriptions automatically renew unless cancelled</li>
                    <li><strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings</li>
                    <li><strong>Refunds:</strong> Refunds are provided according to our refund policy</li>
                    <li><strong>Price Changes:</strong> We reserve the right to change pricing with 30 days notice</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Prohibited Uses</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>You may not use ADalign.io:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                    <li>To upload or transmit viruses or any other type of malicious code</li>
                    <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Your Content:</strong> You retain ownership of all content you submit to ADalign.io. By submitting content, you grant us a limited license to process and analyze it for the purpose of providing our service.
                  </p>
                  <p>
                    <strong>Our Content:</strong> The service and its original content, features, and functionality are and will remain the exclusive property of ADalign.io and its licensors.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We strive to provide continuous service availability but do not guarantee uninterrupted access. We reserve the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Modify or discontinue the service at any time</li>
                    <li>Perform maintenance and updates as needed</li>
                    <li>Limit usage to prevent abuse of the system</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    In no event shall ADalign.io, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, punitive, consequential, or special damages arising out of or related to your use of the service.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    You agree to defend, indemnify, and hold harmless ADalign.io from and against any loss, damage, liability, claim, or demand made against us due to or arising out of your use of the service or violation of these Terms.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including but not limited to a breach of the Terms.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    These Terms shall be interpreted and governed by the laws of [Jurisdiction], without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of [Jurisdiction].
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page and updating the "last updated" date.
                  </p>
                </div>
              </section>

              <section className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-2 text-gray-700">
                  <p>
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <p><strong>Email:</strong> legal@adalign.io</p>
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

export default TermsOfService;