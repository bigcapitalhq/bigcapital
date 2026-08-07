import moment from 'moment';
import React, { useEffect } from 'react';
import { SalesTaxLiabilitySummaryLoadingBar } from './components';
import { SalesTaxLiabiltiyPdfDialog } from './SalesTaxLiabilityPdfDialog';
import { SalesTaxLiabilitySummaryActionsBar } from './SalesTaxLiabilitySummaryActionsBar';
import { SalesTaxLiabilitySummaryBody } from './SalesTaxLiabilitySummaryBody';
import { SalesTaxLiabilitySummaryBoot } from './SalesTaxLiabilitySummaryBoot';
import { SalesTaxLiabilitySummaryHeader } from './SalesTaxLiabilitySummaryHeader';
import { useSalesTaxLiabilitySummaryQuery } from './utils';
import {
  withSalesTaxLiabilitySummaryActions,
  WithSalesTaxLiabilitySummaryActionsProps,
} from './withSalesTaxLiabilitySummaryActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { compose } from '@/utils';

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

export const SalesTaxLiabilitySummary = compose(
  withSalesTaxLiabilitySummaryActions,
)(SalesTaxLiabilitySummaryInner);
