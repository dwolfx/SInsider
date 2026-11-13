'use client';

import React, { useState, useEffect } from 'react';
import { EXACT_LIVE_BODY_HTML } from '@/lib/exact-live-body';

export const LivePageRenderer: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const header = document.querySelector('[data-si-barra-fixa]');
      if (!header) return;
      const y = window.scrollY || window.pageYOffset;
      if (y > 80) {
        header.classList.add('is-fixo');
      } else {
        header.classList.remove('is-fixo');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: EXACT_LIVE_BODY_HTML.trim() }}
    />
  );
};
