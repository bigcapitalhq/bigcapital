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
        onClick={safeCallback(onDelete, original)}
      />
    </Menu>
  );
}

/**
 * From transaction table cell.
 */
export function FromTransactionCell({
  row: { original },
  payload: { onFromTranscationClick }
}) {
  // Handle the link click
  const handleAnchorClick = () => {
    onFromTranscationClick && onFromTranscationClick(original);
  };

  return (
    <a href="#" onClick={handleAnchorClick}>
      {original.from_transaction_type} → {original.from_transaction_id}
    </a>
  );
}

/**
 * Retrieve bill located landed cost table columns.
 */
export function useLocatedLandedCostColumns() {
  return React.useMemo(
    () => [
      {
        Header: intl.get('name'),
        accessor: 'description',
        width: 150,
        className: 'name',
      },
      {
        Header: intl.get('amount'),
        accessor: 'formatted_amount',
        width: 100,
        className: 'amount',
      },
      {
        id: 'from_transaction',
        Header: intl.get('From transaction'),
        Cell: FromTransactionCell,
        width: 100,
        className: 'from-transaction',
      },
      {
        Header: intl.get('allocation_method'),
        accessor: 'allocation_method_formatted',
        width: 100,
        className: 'allocation-method',
      },
    ],
    [],
  );
}
