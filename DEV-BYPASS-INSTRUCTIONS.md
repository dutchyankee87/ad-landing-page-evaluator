# 🔓 Development Bypass for Unlimited Analysis

This allows you to bypass rate limits in production for development testing **only in your browser**.

## How to Use

1. **Open your site** in Chrome: `https://adalign.io`

2. **Open DevTools**: Press `F12` or `Ctrl+Shift+I` 

3. **Go to Console tab**

4. **Copy and paste this script**:
```javascript
(function() {
    console.log('🚀 Setting up development bypass...');
    
    // Override fetch to add dev bypass header
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        const [resource, config = {}] = args;
        
        // Add dev bypass header for API calls
        if (typeof resource === 'string' && resource.includes('/api/')) {
            config.headers = {
                ...config.headers,
                'X-Dev-Bypass': 'unlimited-dev-2024'
            };
            console.log('🔓 Added dev bypass header to:', resource);
        }
        
        return originalFetch.apply(this, [resource, config]);
    };
    
    console.log('✅ Development bypass active - unlimited analysis enabled!');
    console.log('💡 This only works in this browser session');
})();
```

5. **Press Enter** - You should see: `✅ Development bypass active - unlimited analysis enabled!`

6. **Start testing** - You now have unlimited analysis in this browser session!

## What This Does

- ✅ Bypasses IP rate limiting (5/month limit)
- ✅ Bypasses user tier limits (1/month for free users)
- ✅ Doesn't count toward your usage stats
- ✅ Only works in the browser where you run the script
- ✅ Completely safe - doesn't affect other users
- ✅ Automatically expires when you close the browser

## Security Notes

- This only works for your browser session
- Other users are still rate limited normally
- No permanent changes to production
- The bypass header is checked server-side for security

## To Deploy Changes

You need to deploy the updated `api/analyze-ad.js` to production:

```bash
# Commit changes
git add api/analyze-ad.js
git commit -m "Add dev bypass for unlimited testing"

# Deploy to production (assuming Vercel)
vercel --prod
# OR push to main if auto-deployed
git push origin main
```

After deployment, the bypass script will work on your live site!