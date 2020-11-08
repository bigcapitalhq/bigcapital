import React, { useState, useCallback, useMemo } from 'react';
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
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import { Money } from 'components';
import { useUpdateEffect } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import withCustomers from './withCustomers';

import { compose, firstLettersArgs, saveInvoke } from 'utils';

const AvatarCell = (row) => {
  return <span className="avatar">{firstLettersArgs(row.display_name)}</span>;
};

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
  const renderActionsCell = useMemo(() => ({ cell }) => (
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
  ), [onDeleteCustomer, onEditCustomer, renderContextMenu]);

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
        accessor: 'work_phone',
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

  const rowContextMenu = (cell) =>
    renderContextMenu({
      customer: cell.row.original,
      onEditCustomer,
      onDeleteCustomer,
    });

  return (
    <LoadingIndicator loading={loading} mount={false}>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={customers}
        selectionColumn={selectionColumn}
        onFetchData={handleFetchDate}
        expandable={false}
        treeGraph={false}
        onSelectedRowsChange={handleSelectedRowsChange}
        loading={customersLoading && !initialMount}
        spinnerProps={{ size: 30 }}
        rowContextMenu={rowContextMenu}
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
