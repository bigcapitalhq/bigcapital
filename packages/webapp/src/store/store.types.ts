import type { IFilterRole } from '@/components/AdvancedFilter/interfaces';

export interface TableQuery {
  pageSize: number;
  pageIndex: number;
  filterRoles: IFilterRole[];
  viewSlug?: string | null;
  inactiveMode?: boolean;
  sortBy?: Array<{ id: string; desc: boolean }>;
}
