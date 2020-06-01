import React, { useCallback, useMemo,useState } from 'react';
import Icon from 'components/Icon';
import DialogConnect from 'connectors/Dialog.connector';
import DataTable from 'components/DataTable';
import { Button, Popover, Menu, MenuItem, Position } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';

import withExchangeRatesActions from 'containers/ExchangeRates/withExchangeRatesActions';
import withExchangeRates from 'containers/ExchangeRates/withExchangeRates';

import { compose } from 'utils';


function ExchangeRateTable({
  // #withExchangeRates
  exchangeRatesList,
  exchangeRatesLoading,
  // #withDialog.
  openDialog,

  // own properties
  loading,
  onFetchData,
  onDeleteExchangeRate,
  onEditExchangeRate,
  onSelectedRowsChange,
}) {

  const [initialMount, setInitialMount] = useState(false);
  const { formatMessage } = useIntl();

  const handelEditExchangeRate = (exchange_rate) => () => {
    openDialog('exchangeRate-form', { action: 'edit', id: exchange_rate.id });
    onEditExchangeRate(exchange_rate.id);
  };

  const handleDeleteExchangeRate = (exchange_rate) => () => {
    onDeleteExchangeRate(exchange_rate);
  };

  const actionMenuList = useCallback(
    (ExchangeRate) => (
      <Menu>
        <MenuItem
          text={<T id={'edit_exchange_rate'} />}
          onClick={handelEditExchangeRate(ExchangeRate)}
        />
        <MenuItem
          text={<T id={'delete_exchange_rate'} />}
          onClick={handleDeleteExchangeRate(ExchangeRate)}
        />
      </Menu>
    ),
    [handelEditExchangeRate, handleDeleteExchangeRate]
  );

  const columns = useMemo(() => [
    {
      id: 'date',
      Header: formatMessage({ id: 'date' }),
      // accessor: 'date',
      width: 150,
    },
    {
      id: 'currency_code',
      Header: formatMessage({ id: 'currency_code' }),
      accessor: 'currency_code',
      className: 'currency_code',
      width: 150,
    },
    {
      id: 'exchange_rate',
      Header: formatMessage({ id: 'exchange_rate' }),
      accessor: 'exchange_rate',
      className: 'exchange_rate',
      width: 150,
    },
    {
      id: 'actions',
      Header: '',
      Cell: ({ cell }) => (
        <Popover
          content={actionMenuList(cell.row.original)}
          position={Position.RIGHT_BOTTOM}
        >
          <Button icon={<Icon icon='more-h-16' iconSize={16} />} />
        </Popover>
      ),
      className: 'actions',
      width: 50,
      disableResizing: false,
    },
  ], [actionMenuList,formatMessage]);

  const selectionColumn = useMemo(() => ({
    minWidth: 42,
    width: 42,
    maxWidth: 42,
  }), []);

  const handelFetchData = useCallback(
    (...params) => {
      onFetchData && onFetchData(...params);
    },
    [onFetchData]
  );

  const handelSelectedRowsChange = useCallback((selectRows) => {
    onSelectedRowsChange && onSelectedRowsChange(selectRows.map((c) => c.original));
  }, [onSelectedRowsChange]);

  return (
    <DataTable
      columns={columns}
      data={exchangeRatesList}
      onFetchData={handelFetchData}
      loading={exchangeRatesLoading && !initialMount}
      manualSortBy={true}
      selectionColumn={selectionColumn}
      expandable={true}
      treeGraph={true}
      onSelectedRowsChange={handelSelectedRowsChange}
      spinnerProps={{ size: 30 }}
    />
  );
}

export default compose(
  DialogConnect,
  withExchangeRatesActions,
  withExchangeRates(({ exchangeRatesList ,exchangeRatesLoading }) => ({
    exchangeRatesList,
    exchangeRatesLoading
  }))
)(ExchangeRateTable);
