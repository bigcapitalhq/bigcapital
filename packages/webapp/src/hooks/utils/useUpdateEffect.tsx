import { useRef, useEffect } from 'react';
import type { DependencyList, EffectCallback } from 'react';

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount.
 * Idea stolen from: https://stackoverflow.com/a/55075818/1526448
 */
export function useUpdateEffect(
  effect: EffectCallback,
  dependencies: DependencyList = [],
) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
