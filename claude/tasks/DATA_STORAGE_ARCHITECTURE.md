# Data Storage Architecture - Scalable & Cost-Efficient 💾

## 🎯 **Storage Requirements Analysis**

### **Data Types to Store:**
1. **Ad Screenshots** - User uploaded images (1-10MB each)
2. **Landing Page Screenshots** - Auto-captured page images (2-5MB each)
3. **GPT-4 Vision Analysis** - JSON responses (5-50KB each)
4. **Performance Data** - GA4 metrics and correlations (1-5KB each)
5. **User Feedback** - Implementation tracking and ratings (1-2KB each)
6. **Micro-scoring Data** - Detailed analysis results (10-100KB each)

### **Scale Projections:**
- **Current**: ~50 evaluations/month
- **Year 1**: ~10,000 evaluations/month
- **Year 2**: ~100,000 evaluations/month
- **Enterprise**: ~1M evaluations/month

## 🏗️ **Recommended Storage Architecture**

### **Hybrid Storage Strategy** (Optimized for Cost + Performance)

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Supabase      │    │   Cloudflare R2  │    │   Supabase      │
│   PostgreSQL    │    │   Object Storage │    │   Edge Functions│
│                 │    │                  │    │                 │
│ • User Data     │    │ • Ad Images      │    │ • Image         │
│ • Analysis JSON │    │ • Page Screenshots│    │   Processing    │
│ • Performance   │    │ • Thumbnails     │    │ • GPT-4 Vision  │
│ • Correlations  │    │                  │    │ • Data Pipeline │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   Global CDN    │
                    │                 │
                    │ • Fast delivery │
                    │ • Cache images  │
                    │ • Global edge   │
                    └─────────────────┘
```

## 💾 **Storage Layer Breakdown**

### **1. Supabase PostgreSQL (Structured Data)**
**What**: Analysis results, user data, performance metrics
**Why**: ACID compliance, complex queries, real-time updates
**Cost**: ~$25-100/month for millions of records

```sql
-- Enhanced evaluations table with storage references
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  -- Basic evaluation data
  platform TEXT NOT NULL,
  landing_page_url TEXT NOT NULL,
  overall_score DECIMAL(3,1) NOT NULL,
  
  -- File storage references (not the files themselves)
  ad_image_url TEXT, -- URL to R2 storage
  landing_page_screenshot_url TEXT, -- URL to R2 storage
  ad_thumbnail_url TEXT, -- Small preview for UI
  
  -- Analysis results (JSON in database)
  gpt4_analysis JSONB NOT NULL, -- Full GPT-4 Vision response
  micro_scores JSONB, -- Detailed scoring breakdown
  persuasion_principles JSONB, -- Cialdini's principles analysis
  performance_prediction JSONB, -- CTR/CVR predictions
  
  -- Metadata
  processing_time_ms INTEGER, -- Performance tracking
  ai_cost DECIMAL(6,4), -- Cost tracking for optimization
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Separate table for large text content (avoid row size limits)
CREATE TABLE evaluation_content (
  evaluation_id UUID PRIMARY KEY REFERENCES evaluations(id),
  executive_summary TEXT,
  strategic_recommendations JSONB,
  psychological_insights JSONB,
  heatmap_zones JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **2. Cloudflare R2 Object Storage (Images & Large Files)**
**What**: Ad images, landing page screenshots, thumbnails
**Why**: 10x cheaper than AWS S3, no egress fees, global CDN
**Cost**: ~$15/TB/month storage + $4.50/million requests

```typescript
// R2 Storage Management
interface StorageManager {
  async uploadAdImage(
    evaluationId: string, 
    imageFile: File
  ): Promise<StorageResult> {
    
    // Generate optimized file paths
    const originalPath = `evaluations/${evaluationId}/ad-original.jpg`;
    const thumbnailPath = `evaluations/${evaluationId}/ad-thumb.jpg`;
    const compressedPath = `evaluations/${evaluationId}/ad-compressed.jpg`;
    
    // Upload multiple versions for optimization
    const [original, thumbnail, compressed] = await Promise.all([
      this.uploadToR2(originalPath, imageFile), // Full quality
      this.uploadToR2(thumbnailPath, await this.createThumbnail(imageFile)), // 200x200
      this.uploadToR2(compressedPath, await this.compressImage(imageFile)) // 1024px max
    ]);
    
    return {
      originalUrl: `https://cdn.adalign.io/${originalPath}`,
      thumbnailUrl: `https://cdn.adalign.io/${thumbnailPath}`,
      compressedUrl: `https://cdn.adalign.io/${compressedPath}`,
      fileSize: imageFile.size
    };
  }
  
  async capturePageScreenshot(
    evaluationId: string, 
    landingPageUrl: string
  ): Promise<string> {
    // Use Puppeteer in Edge Function to capture screenshot
    const screenshot = await this.captureWithPuppeteer(landingPageUrl);
    const path = `evaluations/${evaluationId}/landing-page.jpg`;
    
    await this.uploadToR2(path, screenshot);
    return `https://cdn.adalign.io/${path}`;
  }
}
```

### **3. Cloudflare CDN (Global Delivery)**
**What**: Fast image delivery worldwide
**Why**: Reduces load times, improves user experience
**Cost**: Included with R2, ~$0.045/GB delivered

```typescript
// CDN Configuration
const CDN_CONFIG = {
  domain: 'cdn.adalign.io',
  caching: {
    images: '30 days', // Cache images for 30 days
    thumbnails: '90 days', // Cache thumbnails longer
    analysis: '7 days' // Cache analysis results shorter
  },
  optimization: {
    autoWebP: true, // Convert to WebP for better compression
    autoResize: true, // Resize images based on request
    quality: 85 // Optimize quality vs size
  }
};
```

## 🔄 **Data Pipeline Architecture**

### **Upload & Processing Flow**
```
User Upload → Supabase Edge Function → Multiple Storage Operations
     │                 │                         │
     │                 ├─► Original to R2        │
     │                 ├─► Thumbnail to R2       │
     │                 ├─► Compressed to R2      │
     │                 ├─► GPT-4 Vision API      │
     │                 └─► Analysis to PostgreSQL│
     │                                          │
     └─► Return URLs ←─────────────────────────┘
```

### **Processing Pipeline Implementation**
```typescript
// Complete evaluation processing pipeline
class EvaluationProcessor {
  async processEvaluation(
    userId: string,
    adImageFile: File,
    landingPageUrl: string,
    platform: string
  ): Promise<EvaluationResult> {
    
    const evaluationId = crypto.randomUUID();
    const startTime = Date.now();
    
    try {
      // Step 1: Upload and optimize images (parallel)
      const [adStorage, pageScreenshot] = await Promise.all([
        this.storageManager.uploadAdImage(evaluationId, adImageFile),
        this.storageManager.capturePageScreenshot(evaluationId, landingPageUrl)
      ]);
      
      // Step 2: AI Analysis (using compressed image for cost optimization)
      const gpt4Analysis = await this.analyzeWithGPT4Vision(
        adStorage.compressedUrl,
        landingPageUrl,
        platform
      );
      
      // Step 3: Enhanced analysis (parallel)
      const [microScores, benchmarkData] = await Promise.all([
        this.generateMicroScores(gpt4Analysis, platform),
        this.getBenchmarkData(platform, gpt4Analysis.industry)
      ]);
      
      // Step 4: Store everything in database
      const evaluation = await this.storeEvaluation({
        id: evaluationId,
        userId,
        platform,
        landingPageUrl,
        adImageUrl: adStorage.originalUrl,
        adThumbnailUrl: adStorage.thumbnailUrl,
        landingPageScreenshotUrl: pageScreenshot,
        gpt4Analysis,
        microScores,
        benchmarkData,
        processingTimeMs: Date.now() - startTime,
        aiCost: this.calculateAICost(adImageFile.size, gpt4Analysis)
      });
      
      return evaluation;
      
    } catch (error) {
      // Clean up any uploaded files on error
      await this.cleanupOnError(evaluationId);
      throw error;
    }
  }
}
```

## 💰 **Cost Optimization Strategies**

### **Image Optimization**
```typescript
class ImageOptimizer {
  // Multi-tier image storage for cost efficiency
  async optimizeForStorage(imageFile: File): Promise<OptimizedImages> {
    return {
      // Full quality for GPT-4 Vision analysis (delete after analysis)
      original: await this.processImage(imageFile, { quality: 95 }),
      
      // Compressed for display (keep long-term)
      display: await this.processImage(imageFile, { 
        quality: 85, 
        maxWidth: 1024, 
        format: 'webp' 
      }),
      
      // Thumbnail for lists (keep long-term)
      thumbnail: await this.processImage(imageFile, { 
        quality: 80, 
        maxWidth: 200, 
        maxHeight: 200, 
        format: 'webp' 
      })
    };
  }
  
  // Delete original after GPT-4 analysis to save storage costs
  async cleanupPostAnalysis(evaluationId: string) {
    await this.deleteFromR2(`evaluations/${evaluationId}/ad-original.jpg`);
    // Keep compressed and thumbnail versions
  }
}
```

### **Data Retention Policies**
```typescript
interface RetentionPolicy {
  // Free tier: 30 days retention
  free: {
    analysisData: 30, // days
    images: 7, // days (thumbnails only)
    screenshots: 0 // immediate deletion
  },
  
  // Pro tier: 1 year retention
  pro: {
    analysisData: 365, // days
    images: 365, // days (all versions)
    screenshots: 90 // days
  },
  
  // Enterprise: Custom retention
  enterprise: {
    analysisData: 'unlimited',
    images: 'unlimited',
    screenshots: 365 // days
  }
}

// Automated cleanup job
class DataRetentionManager {
  async cleanupExpiredData() {
    const expiredEvaluations = await this.getExpiredEvaluations();
    
    for (const evaluation of expiredEvaluations) {
      // Delete from R2 storage
      await this.deleteFromR2(evaluation.adImageUrl);
      await this.deleteFromR2(evaluation.landingPageScreenshotUrl);
      
      // Archive or delete from database
      await this.archiveEvaluation(evaluation.id);
    }
  }
}
```

## 🔒 **Privacy & Security**

### **Data Privacy Implementation**
```typescript
class PrivacyManager {
  // User data deletion (GDPR compliance)
  async deleteUserData(userId: string) {
    const evaluations = await this.getUserEvaluations(userId);
    
    // Delete all stored images
    for (const eval of evaluations) {
      await this.deleteFromR2(eval.adImageUrl);
      await this.deleteFromR2(eval.landingPageScreenshotUrl);
    }
    
    // Delete database records
    await this.deleteUserEvaluations(userId);
    await this.deleteUser(userId);
  }
  
  // Data anonymization for analytics
  async anonymizeForAnalytics(evaluation: Evaluation) {
    return {
      ...evaluation,
      userId: null, // Remove user identification
      landingPageUrl: this.hashUrl(evaluation.landingPageUrl), // Hash URLs
      adImageUrl: null // Remove image references
    };
  }
}
```

### **Access Control**
```typescript
// Row Level Security (RLS) in Supabase
CREATE POLICY "Users can only access their own evaluations"
ON evaluations
FOR ALL
USING (auth.uid() = user_id);

// Signed URLs for secure image access
class SecureAccess {
  async getSignedImageUrl(evaluationId: string, userId: string): Promise<string> {
    // Verify user owns the evaluation
    const evaluation = await this.getEvaluation(evaluationId, userId);
    if (!evaluation) throw new Error('Unauthorized');
    
    // Generate temporary signed URL (expires in 1 hour)
    return this.generateSignedUrl(evaluation.adImageUrl, { expiresIn: 3600 });
  }
}
```

## 📊 **Storage Cost Projections**

### **Cost Breakdown by Scale**

**Small Scale (1,000 evaluations/month)**
```
PostgreSQL (Supabase): $25/month
R2 Storage (20GB): $15/month  
CDN Delivery (100GB): $5/month
Total: ~$45/month
Cost per evaluation: $0.045
```

**Medium Scale (10,000 evaluations/month)**
```
PostgreSQL (Supabase): $75/month
R2 Storage (200GB): $150/month
CDN Delivery (1TB): $50/month
Total: ~$275/month
Cost per evaluation: $0.0275
```

**Large Scale (100,000 evaluations/month)**
```
PostgreSQL (Supabase): $200/month
R2 Storage (2TB): $1,500/month
CDN Delivery (10TB): $500/month
Total: ~$2,200/month
Cost per evaluation: $0.022
```

### **Cost Optimization Strategies**
1. **Tiered Storage** - Delete originals after analysis
2. **Smart Compression** - WebP format, optimized quality
3. **Retention Policies** - Auto-delete based on user tier
4. **Lazy Loading** - Only load images when viewed
5. **Thumbnail Caching** - Aggressive caching for list views

## 🚀 **Implementation Roadmap**

### **Phase 1: Basic Storage (Week 1)**
- Supabase PostgreSQL for structured data
- Basic image upload to Supabase Storage
- GPT-4 Vision analysis storage

### **Phase 2: Optimization (Week 2)**
- Migrate to Cloudflare R2 for cost savings
- Implement image compression and thumbnails
- Add CDN for global delivery

### **Phase 3: Advanced Features (Week 3)**
- Automated screenshot capture
- Data retention policies
- Performance monitoring and optimization

### **Phase 4: Scale Preparation (Week 4)**
- Background processing jobs
- Advanced caching strategies
- Cost monitoring and alerting

## 🏆 **Recommended Final Architecture**

```typescript
// Complete storage solution
interface StorageArchitecture {
  database: {
    provider: 'Supabase PostgreSQL',
    purpose: 'User data, analysis results, performance metrics',
    cost: '$25-200/month',
    features: ['ACID compliance', 'Real-time updates', 'Complex queries']
  },
  
  objectStorage: {
    provider: 'Cloudflare R2',
    purpose: 'Images, screenshots, large files',
    cost: '$15/TB/month',
    features: ['No egress fees', '10x cheaper than S3', 'S3 compatible API']
  },
  
  cdn: {
    provider: 'Cloudflare CDN',
    purpose: 'Fast global image delivery',
    cost: 'Included with R2',
    features: ['Global edge cache', 'Auto WebP conversion', 'Image optimization']
  },
  
  processing: {
    provider: 'Supabase Edge Functions',
    purpose: 'Image processing, AI analysis, data pipeline',
    cost: 'Pay per request',
    features: ['Global deployment', 'Automatic scaling', 'Direct database access']
  }
}
```

This architecture provides:
✅ **Scalable** - Handles 1 evaluation to 1M+ evaluations  
✅ **Cost-Effective** - 10x cheaper than traditional cloud storage  
✅ **Fast** - Global CDN delivery under 100ms  
✅ **Secure** - Enterprise-grade privacy and access control  
✅ **Reliable** - 99.99% uptime with automatic backups  

**Total cost starts at ~$45/month for 1K evaluations and scales efficiently with usage!** 💰📈