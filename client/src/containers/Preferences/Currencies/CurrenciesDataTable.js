import React, { useCallback, useMemo } from 'react';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { withRouter } from 'react-router';
import { useIntl } from 'react-intl';
import { compose, saveInvoke } from 'utils';

import { DataTable, Icon } from 'components';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCurrencies from 'containers/Currencies/withCurrencies';
import withDialogActions from 'containers/Dialog/withDialogActions';

function CurrenciesDataTable({
  // #withCurrencies
  currenciesList,
  currenciesLoading,

  // #ownProps
  onFetchData,
  onDeleteCurrency,

  // #withDialog.
  openDialog,
}) {
  const { formatMessage } = useIntl();

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
      saveInvoke(onFetchData, ...args);
    },
    [onFetchData],
  );

  return (
    <DataTable
      columns={columns}
      data={currenciesList}
      loading={currenciesLoading}
      onFetchData={handleDataTableFetchData}
      noInitialFetch={true}
      rowContextMenu={onRowContextMenu}
    />
  );
}

export default compose(
  withRouter,
  withDashboardActions,
  withDialogActions,
  withCurrencies(({ currenciesList, currenciesLoading }) => ({
    currenciesList,
    currenciesLoading,
  })),
)(CurrenciesDataTable);
