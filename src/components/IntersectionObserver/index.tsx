// @ts-nocheck
import React from 'react';
import { useIntersectionObserver } from '@/hooks/utils';

/**
 * Intersection observer.
 */
export function IntersectionObserver({ onIntersect }) {
  const loadMoreButtonRef = React.useRef();

  useIntersectionObserver({
    // enabled: !isItemsLoading && !isResourceLoading,
    target: loadMoreButtonRef,
    onIntersect: () => {
      onIntersect && onIntersect();
    },
  });

  return (
    <div
      ref={loadMoreButtonRef}
      style={{ opacity: 0, height: 0, width: 0, padding: 0, margin: 0 }}
    >
      Load Newer
    </div>
  );
}
