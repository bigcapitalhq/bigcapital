import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'style/pages/FinancialStatements/BalanceSheet.scss';

import { BalanceSheetAlerts, BalanceSheetLoadingBar } from './components';
import { FinancialStatement } from 'components';

import BalanceSheetHeader from './BalanceSheetHeader';
import BalanceSheetTable from './BalanceSheetTable';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import BalanceSheetActionsBar from './BalanceSheetActionsBar';
import { BalanceSheetProvider } from './BalanceSheetProvider';

import withBalanceSheetActions from './withBalanceSheetActions';
import withCurrentOrganization from '../../../containers/Organization/withCurrentOrganization';

import { compose } from 'utils';

/**
 * Balance sheet.
 */
function BalanceSheet({
  // #withCurrentOrganization
  organizationName,

  // #withBalanceSheetActions
  toggleBalanceSheetFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'cash',
    displayColumnsType: 'total',
    accountsFilter: 'without-zero-balance',
  });

  // Handle re-fetch balance sheet after filter change.
  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
    setFilter({
      ...filter,
      numberFormat: values,
    });
  };

  // Hides the balance sheet filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleBalanceSheetFilterDrawer(false);
    },
    [toggleBalanceSheetFilterDrawer],
  );

  return (
    <BalanceSheetProvider filter={filter}>
      <BalanceSheetActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <BalanceSheetLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <BalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <div class="financial-statement__body">
            <BalanceSheetTable companyName={organizationName} />
          </div>
        </FinancialStatement>
      </DashboardPageContent>

      <BalanceSheetAlerts />
    </BalanceSheetProvider>
  );
}

export default compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
  withBalanceSheetActions,
)(BalanceSheet);
