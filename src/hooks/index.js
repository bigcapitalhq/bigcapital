import { isEqual } from 'lodash';
import React, { useRef, useEffect, useMemo } from 'react';
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
  const focus = useMemo(
    () => isCurrentFocus(autoFocus, columnId, rowIndex),
    [autoFocus, columnId, rowIndex],
  );
  useEffect(() => {
    if (ref.current && focus) {
      ref.current.focus();
    }
  }, [ref, focus]);

  return ref;
}

export * from './useRequestPdf';
export { useAsync, useAutofocus };

// Hook
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export function useMemorizedColumnsWidths(tableName) {
  const [get, save] = useLocalStorage(`${tableName}.columns_widths`, {});

  const handleColumnResizing = (current, columnWidth, columnsResizing) => {
    save(columnsResizing.columnWidths);
  };
  return [get, save, handleColumnResizing];
}

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export function useWhen(condition, callback) {
  React.useEffect(() => {
    if (condition) {
      callback();
    }
  }, [condition, callback]);
}

export function useWhenNot(condition, callback) {
  return useWhen(!condition, callback);
}

export function useWatch(state, callback, props) {
  const config = { immediate: false, ...props };

  const previosuState = usePrevious(state);
  const flag = React.useRef(false);

  React.useEffect(() => {
    if (!isEqual(previosuState, state) || (config.immediate && !flag.current)) {
      flag.current = true;
      callback(state);
    }
  }, [previosuState, state, config.immediate, callback]);
}
