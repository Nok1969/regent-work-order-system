import { useState, useEffect } from "react";

/**
 * Hook to detect if the current device is a mobile device based on screen width
 * @param breakpoint The breakpoint at which a device is considered mobile (default: 768px)
 * @returns boolean indicating if the current device is mobile
 */
export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' 
      ? window.innerWidth < breakpoint 
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call once on mount to check initial state
    handleResize();

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}
