import React from 'react';
import { Link, useLocation } from 'wouter';

// Type for DeploymentLink props
interface DeploymentLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  activeClass?: string;
  exactMatch?: boolean;
  prefetch?: boolean;
}

/**
 * DeploymentLink handles special cases for navigation in deployment environments.
 * It provides a consistent linking component that handles various deployment scenarios
 * where path bases might be different (root, /download, etc).
 */
const DeploymentLink: React.FC<DeploymentLinkProps> = ({
  to,
  className = '',
  children,
  onClick,
  activeClass = 'active',
  exactMatch = false,
  prefetch = false
}) => {
  const [location] = useLocation();
  
  // Check if this link is active based on current location
  const isActive = exactMatch
    ? location === to
    : location.startsWith(to) && (to !== '/' || location === '/');
  
  // Combine classes, including active state if needed
  const allClasses = isActive
    ? `${className} ${activeClass}`.trim()
    : className;
  
  // Check if we're in a deployment environment with path issues
  const isDeploymentEnvironment = () => {
    return (
      window.location.pathname.startsWith('/download') ||
      document.querySelector('meta[name="x-deployment-env"]') !== null
    );
  };
  
  // Helper to generate the right path for deployment environments
  const getDeploymentPath = (path: string) => {
    if (!isDeploymentEnvironment()) {
      return path;
    }
    
    // For the home page, handle specially
    if (path === '/') {
      return './';
    }
    
    // Ensure paths don't start with double slashes
    if (path.startsWith('/')) {
      return '.' + path;
    }
    
    return path;
  };

  // For prefetching support (can be expanded later)
  React.useEffect(() => {
    if (prefetch) {
      // In a real implementation, we might prefetch page data or components here
      console.info(`Prefetching link to ${to}`);
    }
  }, [prefetch, to]);

  // Handle special cases based on deployment environment
  if (isDeploymentEnvironment()) {
    return (
      <a
        href={getDeploymentPath(to)}
        className={allClasses}
        onClick={(e) => {
          // Prevent default navigation
          e.preventDefault();
          
          // Navigate using history API to avoid full page reloads
          window.history.pushState(null, '', to);
          
          // Dispatch a popstate event to notify the router of the change
          window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
          
          // Call the original onClick handler if provided
          if (onClick) onClick(e);
        }}
      >
        {children}
      </a>
    );
  }

  // In regular environments, use the wouter Link component
  return (
    <Link to={to} className={allClasses} onClick={onClick}>
      {children}
    </Link>
  );
};

export default DeploymentLink;