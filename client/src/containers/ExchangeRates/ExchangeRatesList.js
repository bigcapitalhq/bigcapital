import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery, queryCache } from 'react-query';
import { useParams } from 'react-router-dom';
import { Alert, Intent } from '@blueprintjs/core';
import {
  FormattedMessage as T,
  useIntl,
  FormattedHTMLMessage,
} from 'react-intl';
import AppToaster from 'components/AppToaster';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ExchangeRateTable from './ExchangeRateTable';
import ExchangeRateActionsBar from './ExchangeRateActionsBar';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withExchangeRatesActions from 'containers/ExchangeRates/withExchangeRatesActions';

import { compose } from 'utils';

function ExchangeRatesList({
  // #withDashboardActions
  changePageTitle,

  // #withResourceActions
  requestFetchResourceFields,

  // #withExchangeRatesActions
  requestFetchExchangeRates,
  requestDeleteExchangeRate,
  addExchangeRatesTableQueries,
  requestDeleteBulkExchangeRates,

  // #withDialog
  openDialog,
}) {
  const { id } = useParams();
  const [deleteExchangeRate, setDeleteExchangeRate] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const { formatMessage } = useIntl();
  const [bulkDelete, setBulkDelete] = useState(false);
  const [filter, setFilter] = useState({});

  const fetchExchangeRates = useQuery('exchange-rates-table', () =>
    requestFetchExchangeRates(),
  );

  useEffect(() => {
    id
      ? changePageTitle(formatMessage({ id: 'exchange_rate_details' }))
      : changePageTitle(formatMessage({ id: 'exchange_rates_list' }));
  }, [id, changePageTitle, formatMessage]);

  const handelDeleteExchangeRate = useCallback(
    (exchange_rate) => {
      setDeleteExchangeRate(exchange_rate);
    },
    [setDeleteExchangeRate],
  );

  const handelEditExchangeRate = (exchange_rate) => {
    openDialog('exchangeRate-form', { action: 'edit', id: exchange_rate.id });
  };

  const handelCancelExchangeRateDelete = useCallback(() => {
    setDeleteExchangeRate(false);
  }, [setDeleteExchangeRate]);

  const handelConfirmExchangeRateDelete = useCallback(() => {
    requestDeleteExchangeRate(deleteExchangeRate.id)
      .then(() => {
        setDeleteExchangeRate(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_exchange_rates_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        setDeleteExchangeRate(false);
      });
  }, [deleteExchangeRate, requestDeleteExchangeRate, formatMessage]);

  // Handle fetch data of Exchange_rates datatable.
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      addExchangeRatesTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
      });
    },
    [addExchangeRatesTableQueries],
  );

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (exchange_rates) => {
      setSelectedRows(exchange_rates);
    },
    [setSelectedRows],
  );

  // Handle Exchange Rates bulk delete.
  const handleBulkDelete = useCallback(
    (exchangeRatesIds) => {
      setBulkDelete(exchangeRatesIds);
    },
    [setBulkDelete],
  );

  //Handel cancel itemCategories bulk delete.
  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  // handle confirm Exchange Rates bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkExchangeRates(bulkDelete)
      .then(() => {
        setBulkDelete(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_exchange_rates_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        setBulkDelete(false);
      });
  }, [requestDeleteBulkExchangeRates, bulkDelete, formatMessage]);

  // Calculates the data table selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  return (
    <DashboardInsider loading={fetchExchangeRates.isFetching}>
      <ExchangeRateActionsBar
        onDeleteExchangeRate={handelDeleteExchangeRate}
        selectedRows={selectedRows}
        onBulkDelete={handleBulkDelete}
      />
      <DashboardPageContent>
        <ExchangeRateTable
          onDeleteExchangeRate={handelDeleteExchangeRate}
          onEditExchangeRate={handelEditExchangeRate}
          onFetchData={handleFetchData}
          onSelectedRowsChange={handleSelectedRowsChange}
        />
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={deleteExchangeRate}
          onCancel={handelCancelExchangeRateDelete}
          onConfirm={handelConfirmExchangeRateDelete}
        >
          <p>
            <FormattedHTMLMessage
              id={'once_delete_this_exchange_rate_you_will_able_to_restore_it'}
            />
          </p>
        </Alert>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={`${formatMessage({
            id: 'delete',
          })} (${selectedRowsCount})`}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={bulkDelete}
          onCancel={handleCancelBulkDelete}
          onConfirm={handleConfirmBulkDelete}
        >
          <p>
            <FormattedHTMLMessage
              id={
                'once_delete_these_exchange_rates_you_will_not_able_restore_them'
              }
            />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withExchangeRatesActions,
  withResourceActions,
  withDashboardActions,
  withDialogActions,
)(ExchangeRatesList);
