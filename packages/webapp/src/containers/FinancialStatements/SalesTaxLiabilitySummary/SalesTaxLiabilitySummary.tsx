import React, { useEffect } from 'react';
import moment from 'moment';

import { SalesTaxLiabilitySummaryLoadingBar } from './components';
import { FinancialStatement, DashboardPageContent } from '@/components';

import { SalesTaxLiabilitySummaryHeader } from './SalesTaxLiabilitySummaryHeader';
import { SalesTaxLiabilitySummaryActionsBar } from './SalesTaxLiabilitySummaryActionsBar';
import { SalesTaxLiabilitySummaryBoot } from './SalesTaxLiabilitySummaryBoot';
import { SalesTaxLiabilitySummaryBody } from './SalesTaxLiabilitySummaryBody';
import { useSalesTaxLiabilitySummaryQuery } from './utils';
import { SalesTaxLiabiltiyPdfDialog } from './SalesTaxLiabilityPdfDialog';
import {
  withSalesTaxLiabilitySummaryActions,
  WithSalesTaxLiabilitySummaryActionsProps,
} from './withSalesTaxLiabilitySummaryActions';
import { DialogsName } from '@/constants/dialogs';
import { flow } from 'fp-ts/function';

interface SalesTaxLiabilitySummaryProps
  extends WithSalesTaxLiabilitySummaryActionsProps {}

/**
 * Sales tax liability summary.
 */
function SalesTaxLiabilitySummaryInner({
  // #withSalesTaxLiabilitySummaryActions
  toggleSalesTaxLiabilitySummaryFilterDrawer,
}: SalesTaxLiabilitySummaryProps) {
  const [query, setQuery] = useSalesTaxLiabilitySummaryQuery();

  const handleFilterSubmit = (filter: Record<string, any>) => {
    const newFilter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setQuery({ ...newFilter });
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    setQuery({
      ...query,
      numberFormat: values,
    });
  };
  // Hides the filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleSalesTaxLiabilitySummaryFilterDrawer(false);
    },
    [toggleSalesTaxLiabilitySummaryFilterDrawer],
  );

  return (
    <SalesTaxLiabilitySummaryBoot filter={query}>
      <SalesTaxLiabilitySummaryActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <SalesTaxLiabilitySummaryLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <SalesTaxLiabilitySummaryHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <SalesTaxLiabilitySummaryBody />
        </FinancialStatement>
      </DashboardPageContent>

      <SalesTaxLiabiltiyPdfDialog
        dialogName={DialogsName.SalesTaxLiabilitySummaryPdfPreview}
      />
    </SalesTaxLiabilitySummaryBoot>
  );
}

export const SalesTaxLiabilitySummary = flow(
  withSalesTaxLiabilitySummaryActions,
)(SalesTaxLiabilitySummaryInner);
