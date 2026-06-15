import { useCallback, useEffect } from 'react';
import moment from 'moment';
import { ARAgingSummaryHeader } from './ARAgingSummaryHeader';
import { ARAgingSummaryActionsBar } from './ARAgingSummaryActionsBar';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { ARAgingSummaryProvider } from './ARAgingSummaryProvider';
import { ARAgingSummarySheetLoadingBar } from './components';
import { ARAgingSummaryBody } from './ARAgingSummaryBody';
import {
  withARAgingSummaryActions,
  WithARAgingSummaryActionsProps,
} from './withARAgingSummaryActions';
import { useARAgingSummaryQuery } from './common';
import { ARAgingSummaryPdfDialog } from './dialogs/ARAgingSummaryPdfDialog';
import { DialogsName } from '@/constants/dialogs';
import { flow } from 'fp-ts/function';

type ReceivableAgingSummarySheetProps = Pick<
  WithARAgingSummaryActionsProps,
  'toggleARAgingSummaryFilterDrawer'
>;

function ARAgingSummaryInner({
  toggleARAgingSummaryFilterDrawer: toggleDisplayFilterDrawer,
}: ReceivableAgingSummarySheetProps) {
  const { query, setLocationQuery } = useARAgingSummaryQuery();

  const handleFilterSubmit = useCallback(
    (filter: Record<string, unknown>) => {
      const _filter = {
        ...filter,
        asDate: moment(filter.asDate as string).format('YYYY-MM-DD'),
      };
      setLocationQuery(_filter);
    },
    [setLocationQuery],
  );

  const handleNumberFormatSubmit = (numberFormat: Record<string, unknown>) => {
    setLocationQuery({ ...query, numberFormat });
  };

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

export const ARAgingSummary = flow(withARAgingSummaryActions)(
  ARAgingSummaryInner,
);
