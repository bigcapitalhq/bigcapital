import { Button, Intent, Tab, Tabs } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../../FinancialStatements/FinancialStatementHeader';
import { SalesTaxLiabilitySummaryHeaderGeneral } from './SalesTaxLiabilitySummaryHeaderGeneralPanel';
import {
  getDefaultSalesTaxLiablitySummaryQuery,
  getSalesTaxLiabilitySummaryQueryValidation,
} from './utils';
import {
  withSalesTaxLiabilitySummary,
  WithSalesTaxLiabilitySummaryProps,
} from './withSalesTaxLiabilitySummary';
import {
  withSalesTaxLiabilitySummaryActions,
  WithSalesTaxLiabilitySummaryActionsProps,
} from './withSalesTaxLiabilitySummaryActions';
import { FormattedMessage as T } from '@/components';
import { useFeatureCan } from '@/hooks/state';
import { compose, transformToForm } from '@/utils';

interface SalesTaxLiabilitySummaryFormValues {
  fromDate: Date;
  toDate: Date;
  basis: string;
  [key: string]: unknown;
}

interface SalesTaxLiabilitySummaryHeaderOwnProps {
  onSubmitFilter: (values: Record<string, any>) => void;
  pageFilter: Record<string, any>;
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
  const defaultValues = getDefaultSalesTaxLiablitySummaryQuery();

  // Validation schema.
  const validationSchema = getSalesTaxLiabilitySummaryQueryValidation();

  // Filter form initial values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
  ) as SalesTaxLiabilitySummaryFormValues;

  // Handle form submit.
  const handleSubmit = (
    values: SalesTaxLiabilitySummaryFormValues,
    actions: FormikHelpers<SalesTaxLiabilitySummaryFormValues>,
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
  // Detarmines the given feature whether is enabled.
  const { featureCan } = useFeatureCan();

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

export const SalesTaxLiabilitySummaryHeader = compose(
  withSalesTaxLiabilitySummary(({ salesTaxLiabilitySummaryFilter }) => ({
    salesTaxLiabilitySummaryFilter,
  })),
  withSalesTaxLiabilitySummaryActions,
)(SalesTaxLiabilitySummaryHeaderInner);

const SalesTaxSummaryFinancialHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 320px;
  }
`;
