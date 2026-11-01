import type { TableQuery } from '@/store/store.types';
import { transformTableStateToQuery } from '@/utils';

export const transformCustomersStateToQuery = (
  tableState: Partial<TableQuery> & { inactiveMode?: boolean },
) => ({
  ...transformTableStateToQuery(tableState),
  inactive_mode: tableState.inactiveMode,
});
