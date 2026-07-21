'use client';

import { useEffect } from 'react';

export default function AnalyticsTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if page view was already tracked for this session
    const tracked = sessionStorage.getItem('casantiqua_pv_tracked');
    if (!tracked) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'page_view',
          details: window.location.pathname || '/',
        }),
      })
        .then(() => {
          sessionStorage.setItem('casantiqua_pv_tracked', 'true');
        })
        .catch((err) => {
          console.error('Failed to record page view analytics:', err);
        });
    }
  }, []);

  return null;
}
