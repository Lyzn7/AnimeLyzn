import React, { useEffect, useRef, useState } from 'react';

/**
 * Lightweight pull-to-refresh for touch devices.
 * Refreshes via window.location.reload by default so it works for every page.
 */
const PullToRefresh = ({ children, threshold = 70, maxPull = 120, onRefresh }) => {
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const distanceRef = useRef(0);

  const reset = () => {
    distanceRef.current = 0;
    setDistance(0);
  };

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (refreshing) return;
      if (window.scrollY > 0) return;
      const touch = e.touches[0];
      startYRef.current = touch.clientY;
      pullingRef.current = true;
    };

    const handleTouchMove = (e) => {
      if (!pullingRef.current || refreshing) return;
      const touch = e.touches[0];
      const delta = touch.clientY - startYRef.current;
      if (delta <= 0) {
        reset();
        return;
      }
      if (window.scrollY > 0) {
        pullingRef.current = false;
        reset();
        return;
      }
      const pull = Math.min(delta, maxPull);
      distanceRef.current = pull;
      setDistance(pull);
      if (pull > 0) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      const pulled = distanceRef.current;
      reset();
      if (refreshing) return;
      if (pulled >= threshold) {
        try {
          setRefreshing(true);
          if (onRefresh) {
            await onRefresh();
          } else {
            window.location.reload();
          }
        } finally {
          setRefreshing(false);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [maxPull, threshold, refreshing, onRefresh]);

  const indicatorText = refreshing
    ? 'Merefresh...'
    : distance >= threshold
      ? 'Lepas untuk refresh'
      : 'Tarik ke bawah untuk refresh';

  return (
    <div className="ptr-wrapper">
      <div
        className={`ptr-indicator ${distance > 0 || refreshing ? 'visible' : ''} ${refreshing ? 'refreshing' : ''}`}
      >
        {indicatorText}
      </div>
      <div
        className="ptr-content"
        style={distance ? { transform: `translateY(${distance}px)` } : undefined}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
