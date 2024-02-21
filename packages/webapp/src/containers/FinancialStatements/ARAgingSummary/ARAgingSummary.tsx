// @ts-nocheck
import { useCallback, useEffect } from 'react';
import moment from 'moment';

import ARAgingSummaryHeader from './ARAgingSummaryHeader';
import ARAgingSummaryActionsBar from './ARAgingSummaryActionsBar';

import { FinancialStatement, DashboardPageContent } from '@/components';
import { ARAgingSummaryProvider } from './ARAgingSummaryProvider';
import { ARAgingSummarySheetLoadingBar } from './components';
import { ARAgingSummaryBody } from './ARAgingSummaryBody';

import withARAgingSummaryActions from './withARAgingSummaryActions';

import { useARAgingSummaryQuery } from './common';
import { ARAgingSummaryPdfDialog } from './dialogs/ARAgingSummaryPdfDialog';
import { DialogsName } from '@/constants/dialogs';
import { compose } from '@/utils';

/**
 * A/R aging summary report.
 */
function ReceivableAgingSummarySheet({
  // #withARAgingSummaryActions
  toggleARAgingSummaryFilterDrawer: toggleDisplayFilterDrawer,
}) {
  const { query, setLocationQuery } = useARAgingSummaryQuery();

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
    setLocationQuery({ ...query, numberFormat });
  };
  // Hide the filter drawer once the page unmount.
  useEffect(
    () => () => toggleDisplayFilterDrawer(false),
    [toggleDisplayFilterDrawer],
  );

  return (
    <ARAgingSummaryProvider filter={query}>
      <ARAgingSummaryActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <ARAgingSummarySheetLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <ARAgingSummaryHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <ARAgingSummaryBody />
        </FinancialStatement>
      </DashboardPageContent>

      <ARAgingSummaryPdfDialog
        dialogName={DialogsName.ARAgingSummaryPdfPreview}
      />
    </ARAgingSummaryProvider>
  );
}

export default compose(withARAgingSummaryActions)(ReceivableAgingSummarySheet);
