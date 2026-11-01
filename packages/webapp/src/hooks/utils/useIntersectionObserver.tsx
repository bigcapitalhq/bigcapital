import React from 'react';

interface UseIntersectionObserverArgs {
  root?: React.RefObject<HTMLElement | null>;
  target: React.RefObject<HTMLElement | null>;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true,
}: UseIntersectionObserverArgs) {
  React.useEffect(() => {
    if (!enabled) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root && root.current,
        rootMargin,
        threshold: 0.25,
      },
    );
    const el = target && target.current;

    if (!el) {
      return;
    }
    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.current, enabled, onIntersect, root]);
}
