import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, TrendingUp, Target, BookOpen, User } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { articles } from '../data/articles';

const Articles: React.FC = () => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEOHead 
        title="Expert Insights & Articles - Ad Optimization Best Practices"
        description="Expert insights on ad optimization, landing page analysis, and conversion rate improvements. Learn from real case studies and proven strategies."
        keywords="ad optimization articles, landing page best practices, facebook ads optimization, google ads tips, conversion rate optimization guides"
        url="/articles"
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
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <BookOpen className="h-4 w-4" />
                Latest Insights & Best Practices
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              >
                Master Ad Optimization
                <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  with Expert Insights
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
              >
                Learn from industry experts about ad alignment, conversion optimization, and the latest trends in digital marketing.
              </motion.p>
            </div>
          </motion.section>

          {/* Featured Article */}
          {articles.length > 0 && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {(() => {
                  const featured = articles[0]; // Use the first article as featured
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
                            {formatDate(featured.publishedDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {featured.readTime}
                          </div>
                        </div>
                        <Link 
                          to={`/articles/${featured.slug}`}
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
                            Latest Insights
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.section>
          )}

          {/* Articles Grid */}
          <motion.section 
            className="mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.article 
                  key={article.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{article.author.name}</div>
                          <div className="text-xs text-gray-500">{article.author.role}</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {formatDate(article.publishedDate)}
                      </div>
                    </div>
                    
                    <Link 
                      to={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{article.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.section 
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8 lg:p-12 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Optimize Your Ad Performance?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Don't let misaligned ads waste your budget. Analyze your ad-to-landing page congruence with AdAlign's AI-powered tool.
            </p>
            <Link 
              to="/evaluate"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Analyze My Ads - Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.section>

        </div>
      </div>
    </>
  );
};

export default Articles;