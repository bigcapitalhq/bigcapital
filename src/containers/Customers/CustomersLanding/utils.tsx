// @ts-nocheck
import { transformTableStateToQuery } from '@/utils';

export const transformCustomersStateToQuery = (tableState) => {
  return {
    ...transformTableStateToQuery(tableState),
    inactive_mode: tableState.inactiveMode,
  };
};
