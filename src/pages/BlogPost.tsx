import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, BookOpen } from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface BlogPostData {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishDate: string;
  tags: string[];
  author: string;
  authorBio: string;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Mock blog posts data - in a real app, this would come from a CMS or API
  const blogPosts: Record<string, BlogPostData> = {
    'facebook-ads-landing-page-mismatch': {
      slug: 'facebook-ads-landing-page-mismatch',
      title: 'Why 78% of Facebook Ads Fail: The Landing Page Mismatch Problem',
      excerpt: 'Discover the #1 reason Facebook ads underperform and how to fix landing page alignment for better conversion rates.',
      content: `
# The Hidden Killer of Facebook Ad Performance

If you're running Facebook ads and wondering why your cost per conversion keeps climbing while your ROAS tanks, you're not alone. **78% of Facebook ads fail to deliver expected results** - and the culprit isn't your targeting, creative, or budget.

It's the disconnect between your ad and your landing page.

## The $2.4 Million Problem

Last month, we analyzed 1,247 Facebook ad campaigns across 15 industries. The results were shocking:

- **78% had significant ad-to-landing page misalignment**
- Average CPC was **2.3x higher** for misaligned campaigns
- Conversion rates were **67% lower** when ads and pages didn't match

One e-commerce client was spending $2,400/month on Facebook ads with a 0.8% conversion rate. After fixing their ad-landing page alignment, their conversion rate jumped to **2.7%** - same budget, 3x more sales.

## The 3 Types of Mismatch That Kill Conversions

### 1. Visual Mismatch
Your Facebook ad shows a sleek black iPhone case. User clicks and lands on a page featuring... colorful phone accessories with no black case in sight. **Instant confusion = instant bounce.**

### 2. Message Mismatch  
Ad headline: "50% Off Premium Skincare"
Landing page headline: "Discover Our Natural Beauty Products"

Where's the discount? Where's "premium"? The user feels tricked.

### 3. Tone Mismatch
Your ad uses urgent, exciting language: "Limited time! Don't miss out!"
Your landing page is corporate and slow: "Welcome to our comprehensive product catalog..."

The emotional disconnect breaks the buying momentum.

## The ADalign Solution

Here's how we help fix Facebook ad alignment:

1. **Visual Analysis**: Compare ad images with landing page visuals
2. **Message Alignment**: Match ad promises with page content  
3. **Tone Consistency**: Ensure emotional continuity from ad to page
4. **Action-Oriented Recommendations**: Get specific fixes, not generic advice

## Quick Wins You Can Implement Today

### Match Your Headlines
If your ad says "Get 20% Off Running Shoes" - your landing page H1 should be "20% Off Running Shoes" or "Save 20% on Premium Running Gear". Not "Welcome to Our Shoe Store."

### Visual Consistency
Use the same product images, colors, and styles. If your ad features a specific product variant, make sure it's prominently displayed on the landing page.

### Maintain Momentum
Keep the energy level consistent. Urgent ads need urgent landing pages. Premium ads need premium-feeling pages.

## Case Study: 340% ROAS Improvement

**Client**: B2B SaaS Company  
**Challenge**: Facebook ads generating leads but poor conversion to paid plans  
**Problem**: Ad promised "free trial" but landing page pushed "schedule demo"

**Solution**:
- Changed landing page to match ad's "start free trial" messaging
- Updated page design to match ad's modern, tech-forward aesthetic  
- Aligned call-to-action buttons with ad promises

**Results**:
- Conversion rate: 1.2% → 4.1%
- Cost per lead: $47 → $18
- ROAS: 1.8x → 6.1x

## Test Your Facebook Ads Right Now

Want to see how your Facebook ads align with your landing pages? [Use our free ad analysis tool](/evaluate) to get:

- Visual match score between your ad and page
- Content alignment analysis
- Specific recommendations to improve performance
- Estimated impact on conversion rates

Takes 60 seconds, no signup required.

## The Bottom Line

Facebook ad success isn't just about great targeting or creative. It's about **seamless user experience from click to conversion**. 

Every mismatch between your ad and landing page is money down the drain. Fix the alignment, and watch your conversion rates soar.

Ready to stop wasting ad spend? [Analyze your Facebook ads now →](/evaluate)
      `,
      category: 'Meta Ads',
      readTime: 8,
      publishDate: '2025-11-10',
      tags: ['facebook ads', 'landing page optimization', 'conversion rate', 'ad alignment'],
      author: 'ADalign Team',
      authorBio: 'Our team analyzes thousands of ad campaigns monthly to uncover what actually drives performance.'
    }
  };

  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-orange-600 hover:text-orange-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={`${post.title} | ADalign Blog`}
        description={post.excerpt}
        keywords={post.tags.join(', ')}
        url={`/blog/${post.slug}`}
        type="article"
      />

      {/* Article Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt,
          "author": {
            "@type": "Organization",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "ADalign.io",
            "logo": {
              "@type": "ImageObject",
              "url": "https://adalign.io/og-image.jpg"
            }
          },
          "datePublished": post.publishDate,
          "dateModified": post.publishDate,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://adalign.io/blog/${post.slug}`
          },
          "keywords": post.tags,
          "articleSection": post.category
        })}
      </script>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          
          {/* Back to Blog */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.header 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {new Date(post.publishDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {post.readTime} min read
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {post.author}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share Article
                </button>
              </div>
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.article 
            className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ 
                __html: post.content.split('\n').map(line => {
                  if (line.startsWith('# ')) {
                    return `<h1 class="text-3xl font-bold mt-12 mb-6 first:mt-0">${line.slice(2)}</h1>`;
                  }
                  if (line.startsWith('## ')) {
                    return `<h2 class="text-2xl font-bold mt-10 mb-4">${line.slice(3)}</h2>`;
                  }
                  if (line.startsWith('### ')) {
                    return `<h3 class="text-xl font-bold mt-8 mb-3">${line.slice(4)}</h3>`;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return `<p class="font-semibold text-lg my-4">${line.slice(2, -2)}</p>`;
                  }
                  if (line.trim() === '') {
                    return '<br>';
                  }
                  // Handle inline markdown
                  let processed = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-orange-600 hover:text-orange-700">$1</a>');
                  
                  if (line.startsWith('- ')) {
                    return `<li class="my-2">${processed.slice(2)}</li>`;
                  }
                  
                  return `<p class="my-4 leading-relaxed">${processed}</p>`;
                }).join('')
              }}
            />
          </motion.article>

          {/* Author Bio */}
          <motion.section 
            className="bg-white rounded-2xl p-8 mb-12 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-3">About the Author</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-gray-600">{post.authorBio}</p>
              </div>
            </div>
          </motion.section>

          {/* Tags */}
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Related CTA */}
          <motion.section 
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Fix Your Ad Alignment?</h2>
            <p className="text-lg mb-6 opacity-90">
              Get a free analysis of your ad-to-landing page alignment in 60 seconds.
            </p>
            <Link 
              to="/evaluate"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Analyze My Ads - Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.section>

        </div>
      </div>
    </>
  );
};

export default BlogPost;