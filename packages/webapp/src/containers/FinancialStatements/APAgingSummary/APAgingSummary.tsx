import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { APAgingSummaryActionsBar } from './APAgingSummaryActionsBar';
import { APAgingSummaryBody } from './APAgingSummaryBody';
import { APAgingSummaryHeader } from './APAgingSummaryHeader';
import { APAgingSummaryProvider } from './APAgingSummaryProvider';
import { useAPAgingSummaryQuery } from './common';
import { APAgingSummarySheetLoadingBar } from './components';
import { APAgingSummaryPdfDialog } from './dialogs/APAgingSummaryPdfDialog';
import {
  withAPAgingSummaryActions,
  WithAPAgingSummaryActionsProps,
} from './withAPAgingSummaryActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { compose } from '@/utils';

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

export const APAgingSummary = compose(withAPAgingSummaryActions)(
  APAgingSummaryInner,
);
