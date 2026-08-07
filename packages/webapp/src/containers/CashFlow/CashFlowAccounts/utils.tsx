import { transformTableStateToQuery } from '@/utils';

export const transformAccountsStateToQuery = (
  tableState: { inactiveMode?: boolean } & Record<string, unknown>,
) => {
  return {
    ...transformTableStateToQuery(tableState),
    inactive_mode: tableState.inactiveMode,
  };
};
