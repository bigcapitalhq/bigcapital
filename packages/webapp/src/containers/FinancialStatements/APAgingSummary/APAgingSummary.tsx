// @ts-nocheck
import React, { useCallback, useEffect } from 'react';
import moment from 'moment';

import { useAPAgingSummaryQuery } from './common';
import { FinancialStatement, DashboardPageContent } from '@/components';

import APAgingSummaryHeader from './APAgingSummaryHeader';
import APAgingSummaryActionsBar from './APAgingSummaryActionsBar';

import { APAgingSummaryBody } from './APAgingSummaryBody';
import { APAgingSummaryProvider } from './APAgingSummaryProvider';
import { APAgingSummarySheetLoadingBar } from './components';

import withAPAgingSummaryActions from './withAPAgingSummaryActions';

import { compose } from '@/utils';
import { APAgingSummaryPdfDialog } from './dialogs/APAgingSummaryPdfDialog';
import { DialogsName } from '@/constants/dialogs';

/**
 * A/P aging summary report.
 */
function APAgingSummary({
  // #withSettings
  organizationName,

  // #withAPAgingSummaryActions
  toggleAPAgingSummaryFilterDrawer: toggleDisplayFilterDrawer,
}) {
  const { query, setLocationQuery } = useAPAgingSummaryQuery();

  // Handle filter submit.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const _filter = {
        ...filter,
        asDate: moment(filter.asDate).format('YYYY-MM-DD'),
      };
      setLocationQuery(_filter);
    },
    [setLocationQuery],
  );
  // Handle number format submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    setLocationQuery({ ...filter, numberFormat });
  };
  // Hide the report filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleDisplayFilterDrawer(false);
    },
    [toggleDisplayFilterDrawer],
  );

  return (
    <APAgingSummaryProvider filter={query}>
      <APAgingSummaryActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <APAgingSummarySheetLoadingBar />

      <DashboardPageContent>
        <FinancialStatement name={'AP-aging-summary'}>
          <APAgingSummaryHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <APAgingSummaryBody organizationName={organizationName} />
        </FinancialStatement>
      </DashboardPageContent>

      <APAgingSummaryPdfDialog
        dialogName={DialogsName.APAgingSummaryPdfPreview}
      />
    </APAgingSummaryProvider>
  );
}

export default compose(withAPAgingSummaryActions)(APAgingSummary);
