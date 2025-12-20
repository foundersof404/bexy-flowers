/**
 * CRITICAL FIX: Mobile Performance Utility
 * Prevents catastrophic CSS conflicts from mobile optimizations
 */

// Remove conflicting CSS rules that cause layout thrashing
export const fixMobileCSS = () => {
  if (typeof window === 'undefined') return;
  
  const isMobile = window.innerWidth < 768;
  if (!isMobile) return;

  // Create a style element to override problematic CSS
  const style = document.createElement('style');
  style.id = 'mobile-performance-fix';
  style.textContent = `
    /* CRITICAL: Remove conflicting contain property that breaks layout */
    @media (max-width: 768px) {
      * {
        contain: none !important;
      }
      
      /* Allow proper image rendering */
      img {
        image-rendering: auto !important;
      }
      
      /* Fix transform conflicts */
      [style*="transform"] {
        transform: none !important;
      }
      
      /* Prevent CSS from breaking transforms */
      html, body {
        transform: none !important;
      }
    }
  `;
  
  // Remove old style if exists
  const oldStyle = document.getElementById('mobile-performance-fix');
  if (oldStyle) {
    oldStyle.remove();
  }
  
  document.head.appendChild(style);
};

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixMobileCSS);
  } else {
    fixMobileCSS();
  }
}

