// Development Bypass Script for Chrome Console
// Run this in your browser's console on adalign.io to enable unlimited analysis

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