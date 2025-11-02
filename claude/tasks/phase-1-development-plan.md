# Phase 1 Development Plan - Multi-Platform Ad URL Integration

## Objective
Extend existing ScreenshotAPI.net integration to support ad library URLs from Meta, TikTok, Google, LinkedIn, and Reddit platforms while maintaining current screenshot functionality.

## Phase 1 Scope (2 months)
- URL input for ad library links
- Platform detection and validation
- Extended ScreenshotAPI.net integration
- Basic multi-platform UI
- Database schema updates

## Development Tasks

### 1. Platform Detection & URL Validation
**Goal**: Identify platform and validate ad library URLs

**Implementation**:
- Create platform detection utility
- Add URL validation for each platform
- Implement security checks for safe URLs

### 2. Extended ScreenshotAPI.net Integration
**Goal**: Use existing service for ad library screenshots

**Implementation**:
- Extend current `/api/analyze-ad.js` integration
- Add ad-specific screenshot parameters
- Implement error handling and fallbacks

### 3. UI/UX Enhancements
**Goal**: Add URL input alongside existing file upload

**Implementation**:
- Update `AdAssetForm.tsx` with URL input option
- Add platform selection/detection
- Implement file upload OR URL input toggle

### 4. Database Schema Updates
**Goal**: Support ad URLs and platform tracking

**Implementation**:
- Add `ad_url` and `platform` fields
- Update evaluation tracking
- Maintain backward compatibility

### 5. Testing & Validation
**Goal**: Ensure reliable ad URL processing

**Implementation**:
- Test with real ad library URLs
- Validate screenshot quality
- Test error scenarios

## Technical Architecture

### URL Processing Flow
```
User Input (Ad URL) → Platform Detection → URL Validation → ScreenshotAPI.net → Analysis Pipeline
```

### Platform URL Patterns
- **Meta**: `facebook.com/ads/library/*`
- **TikTok**: `library.tiktok.com/ads/*`
- **Google**: `adstransparency.google.com/*`
- **LinkedIn**: `linkedin.com/ad-library/*`
- **Reddit**: Various ad transparency URLs

### Database Schema Additions
```sql
ALTER TABLE evaluations ADD COLUMN ad_url TEXT;
ALTER TABLE evaluations ADD COLUMN platform TEXT DEFAULT 'meta';
ALTER TABLE evaluations ADD COLUMN ad_source_type TEXT DEFAULT 'upload'; -- 'upload' or 'url'
```

## Success Criteria
- ✅ All 5 platforms detected and validated
- ✅ Screenshots captured successfully for ad URLs
- ✅ UI seamlessly integrates URL and file upload options
- ✅ No regression in existing functionality
- ✅ Error handling for invalid/inaccessible URLs

---

*Ready to begin implementation with focus on extending existing ScreenshotAPI.net infrastructure.*