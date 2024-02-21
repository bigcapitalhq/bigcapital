// @ts-nocheck
import React, { useCallback, useEffect } from 'react';
import moment from 'moment';

import GeneralLedgerHeader from './GeneralLedgerHeader';
import GeneralLedgerActionsBar from './GeneralLedgerActionsBar';
import { GeneralLedgerBody } from './GeneralLedgerBody';
import { useGeneralLedgerQuery } from './common';
import { GeneralLedgerProvider } from './GeneralLedgerProvider';
import { FinancialStatement, DashboardPageContent } from '@/components';

import {
  GeneralLedgerSheetAlerts,
  GeneralLedgerSheetLoadingBar,
} from './components';

import withGeneralLedgerActions from './withGeneralLedgerActions';
import { compose } from '@/utils';
import { GeneralLedgerPdfDialog } from './dialogs/GeneralLedgerPdfDialog';
import { DialogsName } from '@/constants/dialogs';

/**
 * General Ledger (GL) sheet.
 */
function GeneralLedger({
  // #withGeneralLedgerActions
  toggleGeneralLedgerFilterDrawer,
}) {
  // General ledger query.
  const { query, setLocationQuery } = useGeneralLedgerQuery();

  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback(
    (filter) => {
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

export default compose(withGeneralLedgerActions)(GeneralLedger);
