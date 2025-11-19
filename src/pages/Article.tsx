import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Tag } from 'lucide-react';
import { articles } from '../data/articles';
import SEOHead from '../components/SEOHead';
import NotFound from './NotFound';

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return <NotFound />;
  }

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
        title={`${article.title} | ADalign.io Blog`}
        description={article.excerpt}
        keywords={`${article.tags.join(', ')}, adalign, ad optimization, landing page analysis, digital marketing`}
        url={`/articles/${article.slug}`}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Article Header */}
          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium rounded-full">
                  {article.category}
                </span>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                {article.title}
              </h1>

              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{article.author.name}</div>
                    <div className="text-gray-600">{article.author.role}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.publishedDate)}
                </div>
              </div>

              {/* Featured Images for articles */}
              {article.id === '1' && (
                <div className="mb-8">
                  <img 
                    src="/future-advertising-seo-convergence.jpg" 
                    alt="Digital marketing dashboard showing the convergence of SEO and paid advertising analytics, illustrating how AdAlign bridges the gap between online advertising and search engine optimization"
                    className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              )}
              
              {article.id === '3' && (
                <div className="mb-8">
                  <img 
                    src="/meta-google-tiktok-platform-strategies.jpg" 
                    alt="Comparison dashboard showing Meta, Google, and TikTok advertising platforms with different strategic approaches for optimal ad-to-page alignment"
                    className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">
                {article.excerpt}
              </div>

              {/* Render the article content */}
              <div className="article-content space-y-8 text-gray-800 leading-relaxed">
                {article.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h2 key={index} className="text-3xl font-bold mt-12 mb-6 text-gray-900 first:mt-0">
                        {paragraph.replace('# ', '')}
                      </h2>
                    );
                  } else if (paragraph.startsWith('## ')) {
                    return (
                      <h3 key={index} className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
                        {paragraph.replace('## ', '')}
                      </h3>
                    );
                  } else if (paragraph.trim()) {
                    return (
                      <p key={index} className="mb-6 text-lg leading-relaxed">
                        {paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                                 .split('<strong').map((part, i) => {
                                   if (i === 0) return part;
                                   const [before, after] = part.split('</strong>');
                                   return (
                                     <React.Fragment key={i}>
                                       <strong className="font-semibold text-gray-900">
                                         {before.replace(' class="font-semibold text-gray-900">', '')}
                                       </strong>
                                       {after}
                                     </React.Fragment>
                                   );
                                 })}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Articles CTA */}
            <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Optimize Your Ad Performance?</h3>
              <p className="text-gray-600 mb-6">
                Don't let misaligned ads waste your budget. Analyze your ad-to-landing page congruence with AdAlign's AI-powered tool.
              </p>
              <Link 
                to="/evaluate"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Analyze My Ads - Free
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default Article;