# Article Section Cleanup Plan

## Problem Analysis

After examining the codebase, I've identified the duplicate article sections issue:

### Current State:
1. **Home.tsx (line 540)**: Contains an `<ArticleSection />` component that displays 3 real articles from `articles.ts` with the heading "Latest Insights & Best Practices"
2. **Blog.tsx**: A separate blog page at `/blog` route with 6 mock articles that don't exist as actual content
3. **App.tsx**: Has routes for both `/blog` and `/articles/:slug` where only the articles route has real content

### Real vs Mock Content:
- **Real Articles (3 total)** in `/src/data/articles.ts`:
  - "The Future of Online Advertising & SEO — How AdAlign Bridges the Gap" (full content)
  - "5 Critical Mistakes That Kill Your Ad Performance" (full content) 
  - "Meta vs. Google vs. TikTok: Platform-Specific Ad Alignment Strategies" (full content)

- **Mock Articles (6 total)** in `Blog.tsx`:
  - All have titles, excerpts, and metadata but no actual content pages
  - Links point to `/blog/:slug` but no corresponding content exists

## Solution Plan

### 1. Remove Blog Page with Mock Data
- Delete `/src/pages/Blog.tsx` entirely
- Remove the `/blog` and `/blog/:slug` routes from `App.tsx`
- This eliminates all mock article data

### 2. Keep ArticleSection on Home Page
- The ArticleSection component on Home page (line 540) will remain as the primary articles section
- This section contains the real articles with actual content
- Links correctly point to `/articles/:slug` which has working content pages

### 3. Update Navigation Links
- Check Header/Navigation components for any "Blog" or "Articles" menu items
- Ensure they link to the Home page articles section (`/#articles`) instead of the removed `/blog`
- Update any "View All Articles" links to scroll to or highlight the articles section on Home

### 4. Clean Up Unused Imports
- Remove any unused imports related to the deleted Blog page
- Clean up lazy loading imports in App.tsx

## Implementation Steps

1. Remove Blog.tsx file
2. Update App.tsx routes (remove blog routes, keep articles route)
3. Find and update navigation links 
4. Update ArticleSection "View All Articles" link to scroll to articles section or remove it
5. Test all article links work correctly

## Expected Outcome

- Single source of truth for articles on the Home page
- All 3 real articles accessible via Home page ArticleSection
- No broken links to mock content
- Clean navigation that doesn't confuse users
- Eliminates duplicate article sections as requested

---

## Review - Implementation Completed

### Changes Made

1. **Removed Blog.tsx file** (src/pages/Blog.tsx)
   - Deleted the entire file containing 6 mock articles with no actual content
   - This eliminates all mock article data as requested

2. **Updated App.tsx routes**
   - Removed lazy loading imports for Blog and BlogPost components
   - Removed `/blog` and `/blog/:slug` routes from the routing table
   - Kept `/articles/:slug` route which serves the real articles

3. **Updated Header.tsx navigation**
   - Changed "Blog" link to "Articles" link
   - Updated link destination from `/blog` to `/#articles` 
   - Updated active state detection to check for `#articles` hash
   - Applied changes to both desktop and mobile navigation

4. **Updated ArticleSection component**
   - Removed "View All Articles" link at the bottom since all articles are already displayed
   - This prevents confusion as there's no longer a separate articles page

### Current State After Changes

- **Home page**: Contains ArticleSection component displaying 3 real articles ("Latest Insights & Best Practices")
- **Navigation**: "Articles" link in header now points to `/#articles` section on Home page
- **Article pages**: Individual articles still accessible via `/articles/:slug` with full content
- **No duplicate sections**: Eliminated the duplicate/mock blog section

### Real Articles That Remain Accessible

1. "The Future of Online Advertising & SEO — How AdAlign Bridges the Gap" (full content)
2. "5 Critical Mistakes That Kill Your Ad Performance (And How to Fix Them)" (full content)  
3. "Meta vs. Google vs. TikTok: Platform-Specific Ad Alignment Strategies" (full content)

### Testing

- Build completed successfully with no errors
- All TypeScript compilation passed
- No broken imports or references remain

The implementation successfully resolves the user's issue by:
- Removing all mock article data
- Eliminating duplicate article sections
- Consolidating articles to one location on the Home page
- Ensuring navigation points to the real articles section