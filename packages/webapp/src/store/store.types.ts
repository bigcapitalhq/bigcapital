export interface TableQuery {
  pageSize: number;
  pageIndex: number;
  filterRoles: Array<unknown>;
  viewSlug?: string | null;
}
