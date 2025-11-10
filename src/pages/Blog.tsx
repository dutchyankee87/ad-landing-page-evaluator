import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, TrendingUp, Target } from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishDate: string;
  featured?: boolean;
  tags: string[];
}

const Blog: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      slug: 'facebook-ads-landing-page-mismatch',
      title: 'Why 78% of Facebook Ads Fail: The Landing Page Mismatch Problem',
      excerpt: 'Discover the #1 reason Facebook ads underperform and how to fix landing page alignment for better conversion rates.',
      category: 'Meta Ads',
      readTime: 8,
      publishDate: '2025-11-10',
      featured: true,
      tags: ['facebook ads', 'landing page optimization', 'conversion rate']
    },
    {
      slug: 'google-ads-quality-score-landing-page',
      title: 'How Landing Page Alignment Affects Your Google Ads Quality Score',
      excerpt: 'Learn how Google evaluates ad-to-landing page relevance and proven strategies to boost your Quality Score.',
      category: 'Google Ads',
      readTime: 6,
      publishDate: '2025-11-08',
      tags: ['google ads', 'quality score', 'ad relevance']
    },
    {
      slug: 'tiktok-ad-creative-landing-page-best-practices',
      title: 'TikTok Ad Creative vs Landing Page: What Converts in 2025',
      excerpt: 'TikTok advertising requires unique landing page strategies. Here\'s how to match your creative with high-converting pages.',
      category: 'TikTok Ads',
      readTime: 7,
      publishDate: '2025-11-05',
      tags: ['tiktok ads', 'creative optimization', 'mobile landing pages']
    },
    {
      slug: 'linkedin-ads-b2b-landing-page-optimization',
      title: 'B2B LinkedIn Ads: Landing Page Best Practices That Convert',
      excerpt: 'LinkedIn B2B campaigns need specialized landing page approaches. Optimize for professional audiences and longer sales cycles.',
      category: 'LinkedIn Ads',
      readTime: 9,
      publishDate: '2025-11-02',
      tags: ['linkedin ads', 'b2b marketing', 'lead generation']
    },
    {
      slug: 'ai-ad-analysis-vs-manual-optimization',
      title: 'AI Ad Analysis vs Manual Optimization: Speed vs Accuracy in 2025',
      excerpt: 'Compare AI-powered ad analysis with traditional manual optimization methods. Results may surprise you.',
      category: 'AI & Marketing',
      readTime: 10,
      publishDate: '2025-10-30',
      tags: ['ai marketing', 'automation', 'efficiency']
    },
    {
      slug: 'multi-platform-ad-campaign-consistency',
      title: 'Multi-Platform Ad Campaigns: Maintaining Consistency Across Channels',
      excerpt: 'Run ads across Meta, Google, TikTok, and LinkedIn? Learn how to maintain brand and message consistency.',
      category: 'Strategy',
      readTime: 12,
      publishDate: '2025-10-28',
      tags: ['multi-platform', 'brand consistency', 'campaign management']
    }
  ];

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

  const categories = [...new Set(blogPosts.map(post => post.category))];

  return (
    <>
      <SEOHead 
        title="Ad Optimization Blog - Expert Insights & Best Practices"
        description="Expert insights on ad optimization, landing page analysis, and conversion rate improvements. Learn from real case studies and proven strategies."
        keywords="ad optimization blog, landing page best practices, facebook ads optimization, google ads tips, conversion rate optimization guides"
        url="/blog"
      />

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
                className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <TrendingUp className="h-4 w-4" />
                Expert Ad Optimization Insights
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              >
                Ad Optimization
                <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Expert Insights
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
              >
                Learn from real case studies, proven strategies, and expert insights to improve your ad performance across all platforms.
              </motion.p>
            </div>
          </motion.section>

          {/* Category Filter */}
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium transition-all hover:bg-orange-600">
                All Articles
              </button>
              {categories.map((category) => (
                <button 
                  key={category}
                  className="px-6 py-2 bg-white text-gray-700 rounded-full font-medium border border-gray-200 transition-all hover:bg-gray-50 hover:border-orange-200"
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Featured Article */}
          {blogPosts.find(post => post.featured) && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {(() => {
                  const featured = blogPosts.find(post => post.featured)!;
                  return (
                    <div className="md:flex">
                      <div className="md:w-1/2 p-8 lg:p-12">
                        <div className="flex items-center gap-2 mb-4">
                          <Target className="h-5 w-5 text-orange-500" />
                          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
                            Featured Article
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                          {featured.title}
                        </h2>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                          {featured.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(featured.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {featured.readTime} min read
                          </div>
                        </div>
                        <Link 
                          to={`/blog/${featured.slug}`}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                        >
                          Read Article
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                      <div className="md:w-1/2 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center p-8">
                        <div className="text-white text-center">
                          <TrendingUp className="h-24 w-24 mx-auto mb-4 opacity-80" />
                          <p className="text-xl font-semibold opacity-90">
                            Most Read Article
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.section>
          )}

          {/* Blog Grid */}
          <motion.section 
            className="mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.filter(post => !post.featured).map((post, index) => (
                <motion.article 
                  key={post.slug}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-orange-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min
                      </div>
                    </div>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          {/* Newsletter CTA */}
          <motion.section 
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8 lg:p-12 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Get Weekly Ad Optimization Tips
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join 2,500+ marketers getting actionable insights delivered to their inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg text-gray-900 flex-1"
              />
              <button className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.section>

        </div>
      </div>
    </>
  );
};

export default Blog;