import { useMemo } from 'react';
import type { InfiniteData } from '@tanstack/react-query';
import { flattenInfinityPages } from '@/utils';

export function useFlattenInfinityPages<TItem>(
  data: InfiniteData<{ data: TItem[] }> | undefined | null,
): TItem[];

export function useFlattenInfinityPages<TPage, TItem>(
  data: InfiniteData<TPage> | undefined | null,
  selector: (page: TPage) => TItem[],
): TItem[];
export function useFlattenInfinityPages<TPage, TItem>(
  data: InfiniteData<TPage> | undefined | null,
  selector?: (page: TPage) => TItem[],
): TItem[] {
  return useMemo(
    () =>
      selector
        ? flattenInfinityPages(data, selector)
        : (flattenInfinityPages(data as any) as TItem[]),
    [data, selector],
  );
}
