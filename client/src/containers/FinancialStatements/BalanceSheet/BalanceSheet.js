import React, { useState } from 'react';
import moment from 'moment';

import 'style/pages/FinancialStatements/BalanceSheet.scss';

import BalanceSheetHeader from './BalanceSheetHeader';
import BalanceSheetTable from './BalanceSheetTable';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import BalanceSheetActionsBar from './BalanceSheetActionsBar';

import { FinancialStatement } from 'components';

import withSettings from 'containers/Settings/withSettings';
import { BalanceSheetProvider } from './BalanceSheetProvider';

import { compose } from 'utils';

/**
 * Balance sheet.
 */
function BalanceSheet({
  // #withPreferences
  organizationName,
}) {
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'cash',
    displayColumnsType: 'total',
    accountsFilter: 'all-accounts',
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

  const handleNumberFormatSubmit = (values) => {
    setFilter({
      ...filter,
      numberFormat: values,
    });
  };

  return (
    <BalanceSheetProvider query={filter}>
      <BalanceSheetActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
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
    </BalanceSheetProvider>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(BalanceSheet);
