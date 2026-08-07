import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { useGeneralLedgerQuery } from './common';
import {
  GeneralLedgerSheetAlerts,
  GeneralLedgerSheetLoadingBar,
} from './components';
import { GeneralLedgerPdfDialog } from './dialogs/GeneralLedgerPdfDialog';
import { GeneralLedgerActionsBar } from './GeneralLedgerActionsBar';
import { GeneralLedgerBody } from './GeneralLedgerBody';
import { GeneralLedgerHeader } from './GeneralLedgerHeader';
import { GeneralLedgerProvider } from './GeneralLedgerProvider';
import { withGeneralLedgerActions } from './withGeneralLedgerActions';
import type { WithGeneralLedgerActionsProps } from './withGeneralLedgerActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { compose } from '@/utils';

interface GeneralLedgerFilterValues {
  fromDate: Date | string;
  toDate: Date | string;
  [key: string]: unknown;
}

/**
 * General Ledger (GL) sheet.
 */
function GeneralLedgerInner({
  // #withGeneralLedgerActions
  toggleGeneralLedgerFilterDrawer,
}: WithGeneralLedgerActionsProps) {
  // General ledger query.
  const { query, setLocationQuery } = useGeneralLedgerQuery();

  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback(
    (filter: GeneralLedgerFilterValues) => {
      const parsedFilter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
      };
      setLocationQuery(parsedFilter);
    },
    [setLocationQuery],
  );

  // Hide the filter drawer once the page unmount.
  useEffect(
    () => () => toggleGeneralLedgerFilterDrawer(false),
    [toggleGeneralLedgerFilterDrawer],
  );

  return (
    <GeneralLedgerProvider query={query}>
      <GeneralLedgerActionsBar />

      <DashboardPageContent>
        <FinancialStatement>
          <GeneralLedgerHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <GeneralLedgerSheetLoadingBar />
          <GeneralLedgerSheetAlerts />
          <GeneralLedgerBody />
        </FinancialStatement>
      </DashboardPageContent>

      <GeneralLedgerPdfDialog
        dialogName={DialogsName.GeneralLedgerPdfPreview}
      />
    </GeneralLedgerProvider>
  );
}

export const GeneralLedger = compose(withGeneralLedgerActions)(
  GeneralLedgerInner,
);
