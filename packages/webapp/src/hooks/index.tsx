// @ts-nocheck
import { useRef, useEffect, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router';
import useAutofocus from './useAutofocus';
import { useLocalStorage } from './utils/useLocalStorage';

export * from './utils';
export * from './useQueryString';

export function useIsValuePassed(value, comparatorValue) {
  const cache = useRef([value]);

  useEffect(() => {
    if (cache.current.indexOf(value) === -1) {
      cache.current.push(value);
    }
  }, [value]);

  return cache.current.indexOf(comparatorValue) !== -1;
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

export { useAutofocus };

export function useMemorizedColumnsWidths(tableName) {
  const [get, save] = useLocalStorage(`${tableName}.columns_widths`, {});

  const handleColumnResizing = (current, columnWidth, columnsResizing) => {
    save(columnsResizing.columnWidths);
  };
  return [get, save, handleColumnResizing];
}