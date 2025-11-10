import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();
  
  // Generate breadcrumbs from current path if no custom items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];
    
    // Map common paths to user-friendly labels
    const pathLabels: Record<string, string> = {
      'evaluate': 'Ad Analysis',
      'results': 'Analysis Results',
      'pricing': 'Pricing',
      'partners': 'Partners',
      'privacy-policy': 'Privacy Policy',
      'terms-of-service': 'Terms of Service',
      'disclaimer': 'Disclaimer',
      'articles': 'Articles'
    };
    
    pathnames.forEach((path, index) => {
      const href = '/' + pathnames.slice(0, index + 1).join('/');
      const label = pathLabels[path] || path.charAt(0).toUpperCase() + path.slice(1);
      
      breadcrumbs.push({
        label,
        href: index === pathnames.length - 1 ? undefined : href // Don't link current page
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items || generateBreadcrumbs();
  
  // Generate structured data for breadcrumbs
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://adalign.io${item.href}` : undefined
    }))
  };
  
  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <nav className={`flex items-center space-x-1 text-sm text-gray-500 mb-4 ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
              )}
              
              {item.href ? (
                <Link 
                  to={item.href}
                  className="hover:text-orange-600 transition-colors flex items-center gap-1"
                >
                  {index === 0 && <Home className="h-4 w-4" />}
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium flex items-center gap-1">
                  {index === 0 && <Home className="h-4 w-4" />}
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;