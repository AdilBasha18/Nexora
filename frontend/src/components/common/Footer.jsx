import React from 'react';
import { useLocation } from 'react-router-dom';
import HalftoneWordmarkFooter from '../ui/halftone-wordmark-footer';

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Only render footer on public homepage as requested
  if (!isHome) {
    return null;
  }

  return (
    <HalftoneWordmarkFooter 
      wordmark="nexora"
      label="Nexora"
      meta="© 2026 Nexora Technologies Inc. All rights reserved."
      preset="night"
      dotGap={6}
      height="480px"
    />
  );
}
