import {useRef, useEffect} from 'react';
import useAsync from './async';

// import use from 'async';

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * Idea stolen from: https://stackoverflow.com/a/55075818/1526448
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
  }, dependencies);
}


export function useIsValuePassed(value, compatatorValue) {
  const cache = useRef([value]);

  useEffect(() => {
    if (cache.current.indexOf(value) === -1) {
      cache.current.push(value);
    }
  }, [value]);

  return cache.current.indexOf(compatatorValue) !== -1;
}


export default {
  useAsync,
  useUpdateEffect,
}