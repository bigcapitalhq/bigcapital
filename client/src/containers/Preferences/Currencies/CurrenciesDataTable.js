import React, { useCallback, useState, useMemo } from 'react';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { withRouter } from 'react-router';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { compose } from 'utils';
import { useUpdateEffect } from 'hooks';
import LoadingIndicator from 'components/LoadingIndicator';
import { DataTable, Icon } from 'components';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCurrencies from 'containers/Currencies/withCurrencies';
import withDialogActions from 'containers/Dialog/withDialogActions';

function CurrenciesDataTable({
  // #withCurrencies
  currenciesList,
  currenciesLoading,

  loading,
  onFetchData,
  onSelectedRowsChange,
  onDeleteCurrency,

  // #withDialog.
  openDialog,
}) {
  const [initialMount, setInitialMount] = useState(false);

  const { formatMessage } = useIntl();

  useUpdateEffect(() => {
    if (!currenciesLoading) {
      setInitialMount(true);
    }
  }, [currenciesLoading, setInitialMount]);

  const handleEditCurrency = useCallback(
    (currency) => {
      openDialog('currency-form', {
        action: 'edit',
        currencyCode: currency.currency_code,
      });
    },
    [openDialog],
  );

  const actionMenuList = useCallback(
    (currency) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_currency' })}
          onClick={() => handleEditCurrency(currency)}
        />

        <MenuItem
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={formatMessage({ id: 'delete_currency' })}
          onClick={() => onDeleteCurrency(currency)}
          intent={Intent.DANGER}
        />
      </Menu>
    ),
    [handleEditCurrency, onDeleteCurrency, formatMessage],
  );

  const onRowContextMenu = useCallback(
    (cell) => {
      return actionMenuList(cell.row.original);
    },
    [actionMenuList],
  );

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'currency_name' }),
        accessor: 'currency_name',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'currency_code' }),
        accessor: 'currency_code',
        className: 'currency_code',
        width: 120,
      },
      {
        Header: 'Currency sign',
        width: 120,
      },
      {
        id: 'actions',
        Header: '',
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
        disableResizing: true,
      },
    ],
    [actionMenuList, formatMessage],
  );

  const handleDataTableFetchData = useCallback(
    (...args) => {
      onFetchData && onFetchData(...args);
    },
    [onFetchData],
  );

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
        columns={columns}
        data={currenciesList}
        onFetchData={handleDataTableFetchData}
        noInitialFetch={true}
        loading={currenciesLoading && !initialMount}
        onSelectedRowsChange={handleSelectedRowsChange}
        rowContextMenu={onRowContextMenu}
      />
    </LoadingIndicator>
  );
}

export default compose(
  withRouter,
  withDashboardActions,
  withDialogActions,
  withCurrencies(({ currenciesList }) => ({
    currenciesList,
  })),
)(CurrenciesDataTable);
