import { Button, Intent, Tab, Tabs } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import * as FF from 'fp-ts/function';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../../FinancialStatements/FinancialStatementHeader';
import { SalesTaxLiabilitySummaryHeaderGeneral } from './SalesTaxLiabilitySummaryHeaderGeneralPanel';
import { getSalesTaxLiabilitySummaryQueryValidation } from './utils';
import {
  withSalesTaxLiabilitySummary,
  WithSalesTaxLiabilitySummaryProps,
} from './withSalesTaxLiabilitySummary';
import {
  withSalesTaxLiabilitySummaryActions,
  WithSalesTaxLiabilitySummaryActionsProps,
} from './withSalesTaxLiabilitySummaryActions';
import type { useSalesTaxLiabilitySummaryQuery } from './utils';
import { FormattedMessage as T } from '@/components';
import { NS } from '@/constants/classes';

interface SalesTaxLiabilitySummaryHeaderOwnProps {
  onSubmitFilter: (values: Record<string, any>) => void;
  pageFilter: ReturnType<typeof useSalesTaxLiabilitySummaryQuery>[0];
}

type SalesTaxLiabilitySummaryHeaderProps = Pick<
  WithSalesTaxLiabilitySummaryProps,
  'salesTaxLiabilitySummaryFilter'
> &
  Pick<
    WithSalesTaxLiabilitySummaryActionsProps,
    'toggleSalesTaxLiabilitySummaryFilterDrawer'
  > &
  SalesTaxLiabilitySummaryHeaderOwnProps;

/**
 * Sales tax liability summary header.
 */
function SalesTaxLiabilitySummaryHeaderInner({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withSalesTaxLiabilitySummary
  salesTaxLiabilitySummaryFilter,

  // #withSalesTaxLiabilitySummaryActions
  toggleSalesTaxLiabilitySummaryFilterDrawer: toggleFilterDrawer,
}: SalesTaxLiabilitySummaryHeaderProps) {
  // Validation schema.
  const validationSchema = getSalesTaxLiabilitySummaryQueryValidation();

  // Filter form initial values.
  const initialValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate(),
    toDate: moment(pageFilter.toDate).toDate(),
  };

  // Handle form submit.
  const handleSubmit = (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>,
  ) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
    actions.setSubmitting(false);
  };
  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleFilterDrawer(false);
  };
  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };

  return (
    <SalesTaxSummaryFinancialHeader
      isOpen={salesTaxLiabilitySummaryFilter}
      drawerProps={{
        onClose: handleDrawerClose,
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Tabs animate={true} vertical={true} renderActiveTabPanelOnly={true}>
            <Tab
              id="general"
              title={<T id={'general'} />}
              panel={<SalesTaxLiabilitySummaryHeaderGeneral />}
            />
          </Tabs>

          <div className="financial-header-drawer__footer">
            <Button className={'mr1'} intent={Intent.PRIMARY} type={'submit'}>
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={handleCancelClick} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </SalesTaxSummaryFinancialHeader>
  );
}

export const SalesTaxLiabilitySummaryHeader = FF.pipe(
  SalesTaxLiabilitySummaryHeaderInner,
  withSalesTaxLiabilitySummaryActions,
  withSalesTaxLiabilitySummary(({ salesTaxLiabilitySummaryFilter }) => ({
    salesTaxLiabilitySummaryFilter,
  })),
);

const SalesTaxSummaryFinancialHeader = styled(FinancialStatementHeader)`
  .${NS}-drawer {
    max-height: 320px;
  }
`;
