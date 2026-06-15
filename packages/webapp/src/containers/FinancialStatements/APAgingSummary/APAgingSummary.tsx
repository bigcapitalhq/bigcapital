import { useCallback, useEffect } from 'react';
import moment from 'moment';
import { useAPAgingSummaryQuery } from './common';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { APAgingSummaryHeader } from './APAgingSummaryHeader';
import { APAgingSummaryActionsBar } from './APAgingSummaryActionsBar';
import { APAgingSummaryBody } from './APAgingSummaryBody';
import { APAgingSummaryProvider } from './APAgingSummaryProvider';
import { APAgingSummarySheetLoadingBar } from './components';
import {
  withAPAgingSummaryActions,
  WithAPAgingSummaryActionsProps,
} from './withAPAgingSummaryActions';
import { APAgingSummaryPdfDialog } from './dialogs/APAgingSummaryPdfDialog';
import { DialogsName } from '@/constants/dialogs';
import { flow } from 'fp-ts/function';

type APAgingSummaryProps = Pick<
  WithAPAgingSummaryActionsProps,
  'toggleAPAgingSummaryFilterDrawer'
>;

function APAgingSummaryInner({
  toggleAPAgingSummaryFilterDrawer: toggleDisplayFilterDrawer,
}: APAgingSummaryProps) {
  const { query, setLocationQuery } = useAPAgingSummaryQuery();

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
        <FinancialStatement>
          <APAgingSummaryHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <APAgingSummaryBody />
        </FinancialStatement>
      </DashboardPageContent>

      <APAgingSummaryPdfDialog
        dialogName={DialogsName.APAgingSummaryPdfPreview}
      />
    </APAgingSummaryProvider>
  );
}

export const APAgingSummary = flow(withAPAgingSummaryActions)(
  APAgingSummaryInner,
);
