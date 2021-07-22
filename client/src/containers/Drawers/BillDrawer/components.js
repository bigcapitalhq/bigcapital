import React from 'react';
import intl from 'react-intl-universal';
import { Intent, MenuItem, Menu } from '@blueprintjs/core';
import { safeCallback } from 'utils';
import { Icon } from 'components';

/**
 * Actions menu.
 */
export function ActionsMenu({ row: { original }, payload: { onDelete } }) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('delete_transaction')}
        intent={Intent.DANGER}
        // onClick={safeCallback(onDelete, original)}
      />
    </Menu>
  );
}

export function useLocatedLandedCostColumns() {
  return React.useMemo(() => [
    {
      Header: intl.get('name'),
      accessor: 'name',
      width: 150,
    },
    {
      Header: intl.get('amount'),
      accessor: 'amount',
      width: 100,
    },
    {
      Header: intl.get('allocation_method'),
      accessor: 'allocation_method',
      width: 100,
    },
  ]);
}
