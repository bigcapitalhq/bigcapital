import React, { useCallback, useMemo } from 'react';
import { Button, Popover, Position } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import { Icon, DataTable } from 'components';
import { saveInvoke } from 'utils';

import { CLASSES } from 'common/classes';

import { NormalCell, BalanceCell, AccountActionsMenu } from './components';
import { TableFastCell } from 'components';

import TableVirtualizedListRows from 'components/Datatable/TableVirtualizedRows';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

/**
 * Accounts data-table.
 */
export default function AccountsDataTable({
  // #ownProps
  accounts,
  loading,
  onFetchData,
  onSelectedRowsChange,
  // onDeleteAccount,
  // onInactivateAccount,
  // onActivateAccount,
  // onEditAccount,
  // onNewChildAccount,
}) {
  const { formatMessage } = useIntl();

  const ActionsCell = useMemo(
    () => ({ row }) => (
      <Popover
        content={<AccountActionsMenu row={row} />}
        position={Position.RIGHT_TOP}
      >
        <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
      </Popover>
    ),
    [],
  );

  const RowContextMenu = useMemo(
    () => ({ row }) => <AccountActionsMenu row={row} />,
    [],
  );

  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: formatMessage({ id: 'account_name' }),
        accessor: 'name',
        className: 'account_name',
        width: 200,
      },
      {
        id: 'code',
        Header: formatMessage({ id: 'code' }),
        accessor: 'code',
        className: 'code',
        width: 80,
      },
      {
        id: 'type',
        Header: formatMessage({ id: 'type' }),
        accessor: 'account_type_label',
        className: 'type',
        width: 140,
      },
      {
        id: 'normal',
        Header: formatMessage({ id: 'normal' }),
        Cell: NormalCell,
        accessor: 'account_normal',
        className: 'normal',
        width: 80,
      },
      {
        id: 'currency',
        Header: formatMessage({ id: 'currency' }),
        accessor: (row) => 'USD',
        width: 75,
      },
      {
        id: 'balance',
        Header: formatMessage({ id: 'balance' }),
        accessor: 'amount',
        Cell: BalanceCell,
        width: 150,
      },
      {
        id: 'actions',
        Header: '',
        Cell: ActionsCell,
        className: 'actions',
        width: 50,
        skeletonWidthMin: 100,
      },
    ],
    [ActionsCell, formatMessage],
  );

  const handleDatatableFetchData = useCallback(
    (...params) => {
      saveInvoke(onFetchData, params);
    },
    [onFetchData],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      saveInvoke(onSelectedRowsChange, selectedRows);
    },
    [onSelectedRowsChange],
  );

  const rowClassNames = (row) => ({
    inactive: !row.original.active,
  });

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={accounts}
        onFetchData={handleDatatableFetchData}
        selectionColumn={true}
        expandable={true}
        sticky={true}
        onSelectedRowsChange={handleSelectedRowsChange}
        loading={loading}
        headerLoading={loading}
        rowContextMenu={RowContextMenu}
        rowClassNames={rowClassNames}
        autoResetExpanded={false}
        autoResetSortBy={false}
        autoResetSelectedRows={false}
        expandColumnSpace={1}
        expandToggleColumn={2}
        selectionColumnWidth={50}
        TableCellRenderer={TableFastCell}
        TableRowsRenderer={TableVirtualizedListRows}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        // #TableVirtualizedListRows props.
        vListrowHeight={42}
        vListOverscanRowCount={10}
      />
    </div>
  );
}
