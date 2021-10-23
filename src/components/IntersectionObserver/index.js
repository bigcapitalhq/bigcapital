import React from 'react';
import { useIntersectionObserver } from 'hooks/utils';

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
    <div ref={loadMoreButtonRef} style={{ opacity: 0 }}>
      Load Newer
    </div>
  );
}
