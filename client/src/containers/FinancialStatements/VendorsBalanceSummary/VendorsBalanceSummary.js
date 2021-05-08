import React, { useEffect, useState } from 'react';
import moment from 'moment';

import 'style/pages/FinancialStatements/ContactsBalanceSummary.scss';

import { FinancialStatement } from 'components';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import VendorsBalanceSummaryActionsBar from './VendorsBalanceSummaryActionsBar';
import VendorsBalanceSummaryHeader from './VendorsBalanceSummaryHeader';
import VendorsBalanceSummaryTable from './VendorsBalanceSummaryTable';

import { VendorsBalanceSummaryProvider } from './VendorsBalanceSummaryProvider';
import { VendorsSummarySheetLoadingBar } from './components';
import withVendorsBalanceSummaryActions from './withVendorsBalanceSummaryActions';

import withSettings from 'containers/Settings/withSettings';

import { compose } from 'utils';

/**
 * Vendors Balance summary.
 */
function VendorsBalanceSummary({
  // #withPreferences
  organizationName,

  // #withVendorsBalanceSummaryActions
  toggleVendorSummaryFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
  });

  // Handle refetch vendors balance summary.
  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      asDate: moment(filter.asDate).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (format) => {
    setFilter({
      ...filter,
      numberFormat: format,
    });
  };

  useEffect(
    () => () => {
      toggleVendorSummaryFilterDrawer(false);
    },
    [toggleVendorSummaryFilterDrawer],
  );

  return (
    <VendorsBalanceSummaryProvider filter={filter}>
      <VendorsBalanceSummaryActionsBar
        numberFormat={filter?.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <VendorsSummarySheetLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <div className="financial-statement--balance-summary ">
            <VendorsBalanceSummaryHeader
              pageFilter={filter}
              onSubmitFilter={handleFilterSubmit}
            />
            <div className={'financial-statement__body'}>
              <VendorsBalanceSummaryTable organizationName={organizationName} />
            </div>
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </VendorsBalanceSummaryProvider>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings?.name,
  })),
  withVendorsBalanceSummaryActions,
)(VendorsBalanceSummary);
