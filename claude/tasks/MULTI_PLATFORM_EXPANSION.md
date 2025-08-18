# Multi-Platform Ad Landing Page Evaluator Expansion Plan

## Project Goals
Expand the current Meta-focused ad evaluator to support multiple advertising platforms (TikTok, LinkedIn, Google Ads, Reddit) using preview links instead of just image uploads. Create a comprehensive audit system that matches ads with landing pages across all platforms.

## Current State Analysis
- ✅ React 18 + TypeScript + Vite architecture
- ✅ Supabase Edge Functions with OpenAI GPT-4 integration
- ✅ Multi-step form with file upload capability
- ✅ Mock evaluation fallback system
- ✅ Score visualization and recommendations

## Proposed Changes

### 1. Platform Support Strategy
**MVP Phase: Multi-Platform Screenshot Support**
1. **Primary Method: Screenshot Upload**
   - Users screenshot their ads from any platform (Meta, TikTok, LinkedIn, Google, Reddit)
   - Works for all static ads across platforms
   - No platform-specific API integrations needed
   - Immediate multi-platform support

2. **Platform Selection**
   - Dropdown to specify platform (Meta, TikTok, LinkedIn, Google Ads, Reddit)
   - Platform-specific evaluation criteria and best practices
   - Tailored recommendations per platform

**Future Enhancement: Preview Link Integration**
- Meta preview links: `https://fb.me/adspreview/facebook/[ID]`
- Automated scraping for supported platforms
- Fallback to screenshot method for unsupported platforms

### 2. Preview Link Integration Architecture

#### Frontend Changes
- **New Component**: `PreviewLinkForm.tsx`
  - URL validation for each platform
  - Platform auto-detection from URL patterns
  - Preview rendering capability
  - Fallback to image upload option

- **Enhanced AdAssetForm**: 
  - Tab-based interface: "Upload Images" vs "Preview Links"
  - Platform selector dropdown
  - URL input with real-time validation
  - Preview display before submission

#### Platform URL Patterns (Examples Needed)
```typescript
const PLATFORM_PATTERNS = {
  meta: /facebook\.com\/ads\/library\/preview/,
  tiktok: /ads\.tiktok\.com\/preview/,
  linkedin: /linkedin\.com\/campaign-manager\/preview/,
  google: /ads\.google\.com\/preview/,
  reddit: /ads\.reddit\.com\/preview/
}
```

### 3. Backend Enhancement Strategy

#### Supabase Edge Function Updates
- **New Function**: `scrape-ad-preview`
  - Platform-specific scraping logic
  - Image extraction from preview pages
  - Metadata collection (platform, format, dimensions)
  - Error handling for private/expired links

- **Enhanced**: `evaluate-ad` function
  - Platform-aware evaluation criteria
  - Multi-format support (image, video, carousel)
  - Platform-specific best practices integration

### 4. LLM Integration Strategy for Image-to-Page Matching

#### Recommended Architecture: **Multi-Modal Approach**

**Option A: OpenAI GPT-4 Vision (Recommended)**
- **Pros**: Built-in vision capabilities, excellent reasoning
- **Cons**: Cost, API limits
- **Implementation**: 
  ```typescript
  // Send both ad image and landing page screenshot
  const analysis = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Analyze ad-to-landing page congruence..." },
        { type: "image_url", image_url: { url: adImageUrl }},
        { type: "image_url", image_url: { url: landingPageScreenshot }}
      ]
    }]
  });
  ```

**Option B: Anthropic Claude 3 (Alternative)**
- **Pros**: Strong analytical capabilities, cost-effective
- **Cons**: Separate vision API needed
- **Implementation**: Similar multi-modal approach

**Option C: Hybrid Approach (Most Robust)**
- **Primary**: GPT-4 Vision for visual analysis
- **Secondary**: Text-based analysis for content matching
- **Fallback**: Rule-based scoring when APIs unavailable

#### Enhanced Evaluation Criteria by Platform

**Meta/Facebook Ads:**
- Visual brand consistency
- CTA button alignment
- Social proof correlation
- Mobile optimization check

**TikTok Ads:**
- Video-to-page energy matching
- Youth-oriented design alignment
- Mobile-first optimization
- Trend-aware content analysis

**LinkedIn Ads:**
- Professional tone consistency
- B2B value proposition alignment
- Corporate branding coherence
- Lead generation flow optimization

**Google Ads:**
- Search intent alignment
- Keyword relevance check
- Landing page speed correlation
- Quality Score factors

### 5. Multi-Platform Screenshot MVP Implementation Plan

#### Phase 1: Platform Selection & UI Enhancement (Week 1)
1. **Enhanced AdAssetForm**
   ```typescript
   const SUPPORTED_PLATFORMS = [
     { id: 'meta', name: 'Meta (Facebook/Instagram)' },
     { id: 'tiktok', name: 'TikTok' },
     { id: 'linkedin', name: 'LinkedIn' },
     { id: 'google', name: 'Google Ads' },
     { id: 'reddit', name: 'Reddit' }
   ];
   ```
   - Add platform selection dropdown
   - Enhanced image upload with platform context
   - User guidance for taking effective screenshots
   - Maintain existing upload functionality

2. **Context & State Management**
   - Update `AdEvaluationContext` to include platform
   - Enhanced validation with platform-specific rules
   - Better error messaging and user guidance

#### Phase 2: Platform-Specific Analysis (Week 1-2)
1. **GPT-4 Vision Integration with Platform Context**
   - Platform-aware prompt engineering
   - Specific evaluation criteria per platform:
     - **Meta**: Social engagement, mobile optimization, brand consistency
     - **TikTok**: Visual energy, youth appeal, trend alignment
     - **LinkedIn**: Professional tone, B2B value props, credibility
     - **Google**: Search intent alignment, conversion focus
     - **Reddit**: Authenticity, community fit, non-promotional tone

2. **Enhanced Scoring Algorithm**
   - Platform-specific scoring weights
   - Tailored recommendation templates
   - Best practice suggestions per platform

#### Phase 3: User Experience & Optimization (Week 2-3)
1. **Screenshot Guidance System**
   - Platform-specific screenshot instructions
   - Image quality validation
   - Optimal resolution recommendations
   - Tips for capturing full ad context

2. **Results Enhancement**
   - Platform-specific result templates
   - Comparative benchmarking (if available)
   - Platform-specific improvement suggestions

#### Phase 4: Testing & Refinement (Week 3-4)
1. **Cross-Platform Testing**
   - Test with real ads from each platform
   - Validate scoring accuracy and relevance
   - Refine platform-specific criteria

2. **Performance & Cost Optimization**
   - Image compression and preprocessing
   - Response caching strategies
   - Cost monitoring across platforms

### 6. Data Architecture

#### New Database Tables (Supabase)
```sql
-- Platform configurations
CREATE TABLE platforms (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  url_pattern TEXT NOT NULL,
  evaluation_criteria JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced evaluations table
ALTER TABLE evaluations ADD COLUMN platform TEXT;
ALTER TABLE evaluations ADD COLUMN preview_url TEXT;
ALTER TABLE evaluations ADD COLUMN ad_metadata JSONB;
```

#### Configuration Management
```typescript
interface PlatformConfig {
  name: string;
  urlPattern: RegExp;
  scrapingConfig: ScrapingConfig;
  evaluationWeights: EvaluationWeights;
  bestPractices: string[];
}
```

### 7. Cost Analysis & Budget Recommendations

#### GPT-4 Vision Cost Breakdown (Per Evaluation)
- **Base text processing**: ~$0.01-0.03 (analysis + recommendations)
- **Image processing**: ~$0.02-0.06 (2 images: ad + landing page screenshot)
- **Total estimated cost**: **$0.05-0.15 per evaluation**

#### Volume-Based Projections
- **100 evaluations/month**: $5-15/month
- **1,000 evaluations/month**: $50-150/month  
- **10,000 evaluations/month**: $500-1,500/month

#### Cost Optimization Strategy
- **Caching Layer**: 50% cost reduction for repeat evaluations
- **Image Optimization**: WebP conversion, compress to 1024px max
- **Smart Batching**: Group similar requests
- **Fallback Tiers**: 
  - Premium: GPT-4 Vision ($0.10/eval)
  - Standard: GPT-4 text-only + rule-based visual ($0.03/eval)
  - Basic: Mock evaluation (free)

#### Recommended Pricing Strategy
- **Free Tier**: 5 evaluations/month (showcase quality)
- **Starter**: $19/month (100 evaluations)
- **Professional**: $99/month (1000 evaluations)
- **Enterprise**: Custom pricing (10k+ evaluations)

### 8. Success Metrics

#### Technical Metrics
- Platform detection accuracy: >95%
- Preview link scraping success rate: >90%
- Evaluation completion time: <30 seconds
- API cost per evaluation: <$0.50

#### Business Metrics
- User adoption across platforms
- Recommendation implementation rate
- Ad performance improvement correlation
- Customer satisfaction scores

## Multi-Platform Screenshot MVP Next Steps

### Immediate Actions (This Week)
1. **Add Platform Selection**: Implement dropdown for Meta, TikTok, LinkedIn, Google, Reddit
2. **Screenshot Guidance**: Create platform-specific screenshot instructions
3. **Platform Context**: Update evaluation prompts with platform-specific criteria
4. **Cost Validation**: Test GPT-4 Vision with multi-platform scenarios

### Key Benefits of Screenshot Approach
✅ **Immediate Multi-Platform Support** - No API integrations needed
✅ **Universal Compatibility** - Works for all static ads across platforms
✅ **User Control** - Users choose what to capture and evaluate
✅ **No Technical Barriers** - No preview link expiration or access issues
✅ **Cost Effective** - Same $0.05-0.15/evaluation across all platforms

### Success Criteria for MVP
- ✅ Support 5 platforms (Meta, TikTok, LinkedIn, Google, Reddit)
- ✅ Platform-specific evaluation criteria and recommendations
- ✅ Screenshot guidance system for optimal capture
- ✅ Enhanced GPT-4 Vision analysis with platform context
- ✅ Maintain current system reliability with existing fallbacks

### Future Enhancements
- **Video Ad Support**: For TikTok video ads (extract frames)
- **Preview Link Integration**: Automated scraping where possible
- **Platform API Integration**: Direct ad library access (long-term)
- **Carousel/Multi-Image**: Support for complex ad formats

**Estimated Cost**: $0.05-0.15 per evaluation (same across platforms)
**Timeline**: 3-4 weeks for full multi-platform MVP
**Immediate Value**: 5x platform coverage with minimal complexity

This approach gives you immediate multi-platform capabilities while keeping the technical implementation simple and reliable. Perfect for validating demand across platforms before investing in complex integrations.