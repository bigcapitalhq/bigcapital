import { flatten, map } from 'lodash';
import type { InfiniteData } from '@tanstack/react-query';

export function flattenInfinityPages<TItem>(
  data: InfiniteData<{ data: TItem[] }> | undefined | null,
): TItem[];
export function flattenInfinityPages<TPage, TItem>(
  data: InfiniteData<TPage> | undefined | null,
  selector: (page: TPage) => TItem[],
): TItem[];
export function flattenInfinityPages<TPage, TItem>(
  data: InfiniteData<TPage> | undefined | null,
  selector: (page: TPage) => TItem[] = (page: any) => page.data,
): TItem[] {
  if (!data?.pages) return [];
  return flatten(map(data.pages, selector));
}
