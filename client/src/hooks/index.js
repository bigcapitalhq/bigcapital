import { useRef, useEffect, useMemo } from 'react';
import useAsync from './async';
import useAutofocus from './useAutofocus';

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

const isCurrentFocus = (autoFocus, columnId, rowIndex) => {
  let _columnId;
  let _rowIndex;

  if (Array.isArray(autoFocus)) {
    _columnId = autoFocus[0];
    _rowIndex = autoFocus[1] || 0;
  }
  _rowIndex = parseInt(_rowIndex, 10);

  return columnId === _columnId && _rowIndex === rowIndex;
};

export function useCellAutoFocus(ref, autoFocus, columnId, rowIndex) {
  const focus = useMemo(() => isCurrentFocus(autoFocus, columnId, rowIndex), [
    autoFocus,
    columnId,
    rowIndex,
  ]);
  useEffect(() => {
    if (ref.current && focus) {
      ref.current.focus();
    }
  }, [ref, focus]);

  return ref;
}

export * from './useRequestPdf';
export { useAsync, useAutofocus };
