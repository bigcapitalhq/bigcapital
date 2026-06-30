export interface TableQuerySortBy {
  id: string;
  desc: boolean;
}

export interface TableQuery {
  pageSize: number;
  pageIndex: number;
  filterRoles: Array<unknown>;
  viewSlug?: string | null;
  inactiveMode?: boolean;
  sortBy?: Array<TableQuerySortBy>;
}
