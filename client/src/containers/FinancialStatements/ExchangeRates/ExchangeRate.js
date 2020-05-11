import React, { useEffect, useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Alert, Intent } from '@blueprintjs/core';
import AppToaster from 'components/AppToaster';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ExchangeRateTable from './ExchangeRateTable';
import ExchangeRateActionsBar from './ExchangeRateActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboard';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withExchangeRatesActions from 'containers/FinancialStatements/ExchangeRates/withExchangeRatesActions';

import { compose } from 'utils';

import { FormattedMessage as T, useIntl } from 'react-intl';

function ExchangeRate({
  // #withDashboard
  changePageTitle,

  //#withExchangeRatesActions
  requestFetchResourceFields,

  requestFetchExchangeRates,
  requestDeleteExchangeRate,
  addExchangeRatesTableQueries,
}) {
  const { id } = useParams();
  const [deleteExchangeRate, setDeleteExchangeRate] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const { formatMessage } = useIntl();
 
  // const fetchExchangeRates = useQuery('exchange-rates-table', () => {
  //   return Promise.all([requestFetchExchangeRates()]);
  // });

   const fetchExchangeRates = useQuery('exchange-rates-table',
    () => requestFetchExchangeRates(),
    { refetchInterval: 3000 });


  useEffect(() => {
    id
      ? changePageTitle(formatMessage({id:'exchange_rate_details'}))
      : changePageTitle(formatMessage({id:'exchange_rate_list'}));
  }, [id, changePageTitle]);

  const handelDeleteExchangeRate = useCallback(
    (exchange_rate) => {
      setDeleteExchangeRate(exchange_rate);
    },
    [setDeleteExchangeRate]
  );

  const handelEditExchangeRate = (exchange_rate) => {};

  const handelCancelExchangeRateDelete = useCallback(() => {
    setDeleteExchangeRate(false);
  }, [setDeleteExchangeRate]);

  const handelConfirmExchangeRateDelete = useCallback(() => {
    requestDeleteExchangeRate(deleteExchangeRate.id).then(() => {
      setDeleteExchangeRate(false);
      AppToaster.show({
        message: 'the_exchange_rate_has_been_delete',
      });
    });
  }, [deleteExchangeRate, requestDeleteExchangeRate]);

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
    [addExchangeRatesTableQueries]
  );

  const handleSelectedRowsChange = useCallback(
    (exchange_rates) => {
      setSelectedRows(exchange_rates);
    },
    [setSelectedRows]
  );

  return (
    <DashboardInsider>
      <ExchangeRateActionsBar
        onDeleteExchangeRate={handelDeleteExchangeRate}
        selectedRows={selectedRows}
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
          confirmButtonText={<T id={'move_to_trash'} />}
          icon='trash'
          intent={Intent.DANGER}
          isOpen={deleteExchangeRate}
          onCancel={handelCancelExchangeRateDelete}
          onConfirm={handelConfirmExchangeRateDelete}
        >
          <p>
            Are you sure you want to move <b>filename</b> to Trash? You will be
            able to restore it later, but it will become private to you.
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withExchangeRatesActions,
  withResourceActions,
  withDashboardActions
)(ExchangeRate);
