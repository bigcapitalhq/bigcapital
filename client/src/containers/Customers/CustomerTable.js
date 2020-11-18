import React, { useCallback, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Intent,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useIsValuePassed } from 'hooks';

import CustomersEmptyStatus from './CustomersEmptyStatus';
import { DataTable, Icon, Money, Choose, LoadingIndicator } from 'components';

import withCustomers from './withCustomers';
import withCustomersActions from './withCustomersActions';

import { compose, firstLettersArgs, saveInvoke } from 'utils';

const AvatarCell = (row) => {
  return <span className="avatar">{firstLettersArgs(row.display_name)}</span>;
};

const CustomerTable = ({
  //#withCustomers
  customers,
  customersLoading,
  customerPagination,
  customersTableQuery,
  customersCurrentViewId,

  // #withCustomersActions
  addCustomersTableQueries,

  //#OwnProps
  loading,
  onEditCustomer,
  onDeleteCustomer,
  onFetchData,
  onSelectedRowsChange,
}) => {
  const { formatMessage } = useIntl();
  const isLoadedBefore = useIsValuePassed(loading, false);

  // Customers actions list.
  const renderContextMenu = useMemo(
    () => ({ customer, onEditCustomer, onDeleteCustomer }) => {
      const handleEditCustomer = () => {
        saveInvoke(onEditCustomer, customer);
      };
      const handleDeleteCustomer = () => {
        saveInvoke(onDeleteCustomer, customer);
      };
      return (
        <Menu>
          <MenuItem
            icon={<Icon icon="reader-18" />}
            text={formatMessage({ id: 'view_details' })}
          />
          <MenuDivider />
          <MenuItem
            icon={<Icon icon="pen-18" />}
            text={formatMessage({ id: 'edit_customer' })}
            onClick={handleEditCustomer}
          />
          <MenuItem
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={formatMessage({ id: 'delete_customer' })}
            intent={Intent.DANGER}
            onClick={handleDeleteCustomer}
          />
        </Menu>
      );
    },
    [formatMessage],
  );

  // Renders actions table cell.
  const renderActionsCell = useMemo(
    () => ({ cell }) => (
      <Popover
        content={renderContextMenu({
          customer: cell.row.original,
          onEditCustomer,
          onDeleteCustomer,
        })}
        position={Position.RIGHT_BOTTOM}
      >
        <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
      </Popover>
    ),
    [onDeleteCustomer, onEditCustomer, renderContextMenu],
  );

  // Table columns.
  const columns = useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        accessor: AvatarCell,
        className: 'avatar',
        width: 50,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        id: 'display_name',
        Header: formatMessage({ id: 'display_name' }),
        accessor: 'display_name',
        className: 'display_name',
        width: 150,
      },
      {
        id: 'company_name',
        Header: formatMessage({ id: 'company_name' }),
        accessor: 'company_name',
        className: 'company_name',
        width: 150,
      },
      {
        id: 'phone_number',
        Header: formatMessage({ id: 'phone_number' }),
        accessor: (row) => (
          <div>
            <div className={'work_phone'}>{row.work_phone}</div>
            <div className={'personal_phone'}>{row.personal_phone}</div>
          </div>
        ),
        className: 'phone_number',
        width: 100,
      },
      {
        id: 'receivable_balance',
        Header: formatMessage({ id: 'receivable_balance' }),
        accessor: (r) => <Money amount={r.closing_balance} currency={'USD'} />,
        className: 'receivable_balance',
        width: 100,
      },
      {
        id: 'actions',
        Cell: renderActionsCell,
        className: 'actions',
        width: 70,
        disableResizing: true,
        disableSortBy: true,
      },
    ],
    [formatMessage, renderActionsCell],
  );

  // Handle fetch data table.
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      addCustomersTableQueries({
        page: pageIndex + 1,
        page_size: pageSize,
        ...(sortBy.length > 0
          ? {
              column_sort_order: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
      });
    },
    [addCustomersTableQueries],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );

  const rowContextMenu = (cell) =>
    renderContextMenu({
      customer: cell.row.original,
      onEditCustomer,
      onDeleteCustomer,
    });

  const showEmptyStatus = [
    customersCurrentViewId === -1,
    customers.length === 0,
  ].every(condition => condition === true);

  return (
    <LoadingIndicator
      loading={customersLoading && !isLoadedBefore}
      mount={false}
    >
      <Choose>
        <Choose.When condition={showEmptyStatus}>
          <CustomersEmptyStatus />
        </Choose.When>

        <Choose.Otherwise>
          <DataTable
            noInitialFetch={true}
            columns={columns}
            data={customers}
            // loading={customersLoading}
            onFetchData={handleFetchData}
            selectionColumn={true}
            expandable={false}
            sticky={true}
            onSelectedRowsChange={handleSelectedRowsChange}
            spinnerProps={{ size: 30 }}
            rowContextMenu={rowContextMenu}
            pagination={true}
            manualSortBy={true}
            pagesCount={customerPagination.pagesCount}
            autoResetSortBy={false}
            autoResetPage={false}
            initialPageSize={customersTableQuery.page_size}
            initialPageIndex={customersTableQuery.page - 1}
          />
        </Choose.Otherwise>
      </Choose>
    </LoadingIndicator>
  );
};

export default compose(
  withCustomers(
    ({
      customers,
      customersLoading,
      customerPagination,
      customersTableQuery,
      customersCurrentViewId,
    }) => ({
      customers,
      customersLoading,
      customerPagination,
      customersTableQuery,
      customersCurrentViewId
    }),
  ),
  withCustomersActions,
)(CustomerTable);
