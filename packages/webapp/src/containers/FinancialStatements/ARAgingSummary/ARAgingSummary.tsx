import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { ARAgingSummaryActionsBar } from './ARAgingSummaryActionsBar';
import { ARAgingSummaryBody } from './ARAgingSummaryBody';
import { ARAgingSummaryHeader } from './ARAgingSummaryHeader';
import { ARAgingSummaryProvider } from './ARAgingSummaryProvider';
import { useARAgingSummaryQuery } from './common';
import { ARAgingSummarySheetLoadingBar } from './components';
import { ARAgingSummaryPdfDialog } from './dialogs/ARAgingSummaryPdfDialog';
import {
  withARAgingSummaryActions,
  WithARAgingSummaryActionsProps,
} from './withARAgingSummaryActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { compose } from '@/utils';

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

export const ARAgingSummary = compose(withARAgingSummaryActions)(
  ARAgingSummaryInner,
);
