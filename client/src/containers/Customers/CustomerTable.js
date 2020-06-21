import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';

import { FormattedMessage as T, useIntl } from 'react-intl';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import { useUpdateEffect } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import withCustomers from './withCustomers';

import { compose } from 'utils';

const CustomerTable = ({
  loading,

  //#withCustomers
  customers,
  customersLoading,

  //#props
  onEditCustomer,
  onDeleteCustomer,
  onFetchData,
  onSelectedRowsChange,
}) => {
  const { formatMessage } = useIntl();

  const [initialMount, setInitialMount] = useState(false);

  useUpdateEffect(() => {
    if (!customersLoading) {
      setInitialMount(true);
    }
  }, [customersLoading, setInitialMount]);

  const handleEditCustomer = useCallback(
    (customer) => () => {
      onEditCustomer && onEditCustomer(customer);
    },
    [onEditCustomer],
  );

  const handleDeleteCustomer = useCallback(
    (customer) => () => {
      onDeleteCustomer && onDeleteCustomer(customer);
    },
    [onDeleteCustomer],
  );
  const actionMenuList = useCallback((customer) => (
    <Menu>
      <MenuItem text={<T id={'view_details'} />} />
      <MenuDivider />
      <MenuItem
        text={<T id={'edit_customer'} />}
        onClick={handleEditCustomer(customer)}
      />
      <MenuItem
        text={<T id={'delete_customer'} />}
        onClick={handleDeleteCustomer(customer)}
      />
    </Menu>
  ));

  const columns = useMemo(
    () => [
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
        accessor: 'work_phone',
        className: 'phone_number',
        width: 100,
      },
      {
        id: 'receivable_balance',
        Header: formatMessage({ id: 'receivable_balance' }),
        // accessor: '',
        className: 'receivable_balance',
        width: 100,
      },

      {
        id: 'actions',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_BOTTOM}
          >
            <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
      },
    ],
    [actionMenuList, formatMessage],
  );

  const selectionColumn = useMemo(
    () => ({
      minWidth: 42,
      width: 42,
      maxWidth: 42,
    }),
    [],
  );

  const handleFetchDate = useCallback((...args) => {
    onFetchData && onFetchData(...args);
  });

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );

  return (
    <LoadingIndicator loading={loading} mount={false}>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={customers}
        selectionColumn={selectionColumn}
        onFetchData={handleFetchDate}
        expandable={true}
        treeGraph={true}
        onSelectedRowsChange={handleSelectedRowsChange}
        loading={customersLoading && !initialMount}
        spinnerProps={{ size: 30 }}
      />
    </LoadingIndicator>
  );
};

export default compose(
  withCustomers(({ customers, customersLoading }) => ({
    customers,
    customersLoading,
  })),
)(CustomerTable);
