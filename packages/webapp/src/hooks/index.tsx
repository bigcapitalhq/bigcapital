import { useRef, useEffect, useMemo } from 'react';
import useAutofocus from './useAutofocus';
import { useLocalStorage } from './utils/useLocalStorage';
import type { RefObject } from 'react';

export * from './utils';
export * from './useQueryString';
export * from './useDateInputFormatter';

export function useIsValuePassed<T>(value: T, compatatorValue: T) {
  const cache = useRef<T[]>([value]);

  useEffect(() => {
    if (cache.current.indexOf(value) === -1) {
      cache.current.push(value);
    }
  }, [value]);

  return cache.current.indexOf(compatatorValue) !== -1;
}

const isCurrentFocus = (
  autoFocus: Array<string | number> | undefined,
  columnId: string | number | undefined,
  rowIndex: number,
) => {
  let _columnId;
  let _rowIndex;

  if (Array.isArray(autoFocus)) {
    _columnId = autoFocus[0];
    _rowIndex = autoFocus[1] || 0;
  }
  _rowIndex = parseInt(String(_rowIndex), 10);

  return columnId === _columnId && _rowIndex === rowIndex;
};

export function useCellAutoFocus(
  ref: RefObject<HTMLElement | null>,
  autoFocus: Array<string | number> | undefined,
  columnId: string | number | undefined,
  rowIndex: number,
) {
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

export function useMemorizedColumnsWidths(tableName: string) {
  const [get, save] = useLocalStorage<Record<string, number>>(
    `${tableName}.columns_widths`,
    {},
  );

  const handleColumnResizing = (
    _current: unknown,
    _columnWidth: unknown,
    columnsResizing: { columnWidths: Record<string, number> },
  ) => {
    save(columnsResizing.columnWidths);
  };
  return [get, save, handleColumnResizing];
}
