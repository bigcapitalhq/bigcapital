import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { getVendorsBalanceQuerySchema } from './utils';
import { VendorsBalanceSummaryHeaderGeneral } from './VendorsBalanceSummaryHeaderGeneral';
import {
  withVendorsBalanceSummary,
  WithVendorsBalanceSummaryProps,
} from './withVendorsBalanceSummary';
import {
  withVendorsBalanceSummaryActions,
  WithVendorsBalanceSummaryActionsProps,
} from './withVendorsBalanceSummaryActions';
import { FormattedMessage as T } from '@/components';
import { compose, transformToForm } from '@/utils';

interface VendorsBalanceSummaryHeaderOwnProps {
  pageFilter: Record<string, unknown>;
  onSubmitFilter: (values: Record<string, unknown>) => void;
}

interface FormValues {
  asDate: Date;
  vendorsIds: string[];
  [key: string]: unknown;
}

type VendorsBalanceSummaryHeaderProps = VendorsBalanceSummaryHeaderOwnProps &
  WithVendorsBalanceSummaryProps &
  WithVendorsBalanceSummaryActionsProps;

/**
 * Vendors balance summary drawer header.
 */
function VendorsBalanceSummaryHeaderInner({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  //#withVendorsBalanceSummary
  VendorsSummaryFilterDrawer,

  //#withVendorsBalanceSummaryActions
  toggleVendorSummaryFilterDrawer,
}: VendorsBalanceSummaryHeaderProps) {
  // Validation schema.
  const validationSchema = getVendorsBalanceQuerySchema();

  // filter form initial values.
  const defaultValues: FormValues = {
    ...pageFilter,
    asDate: moment().toDate(),
    vendorsIds: [],
  };
  // Initial form values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      asDate: moment(pageFilter.asDate as string).toDate(),
    },
    defaultValues,
  ) as FormValues;

  // handle form submit.
  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    onSubmitFilter(values);
    toggleVendorSummaryFilterDrawer(false);
    setSubmitting(false);
  };

  // handle cancel button click.
  const handleCancelClick = () => {
    toggleVendorSummaryFilterDrawer(false);
  };

  return (
    <VendorBalanceDrawerHeader
      isOpen={!!VendorsSummaryFilterDrawer}
      drawerProps={{ onClose: handleCancelClick }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Tabs animate={true} vertical={true} renderActiveTabPanelOnly={true}>
            <Tab
              id={'general'}
              title={<T id={'general'} />}
              panel={<VendorsBalanceSummaryHeaderGeneral />}
            />
          </Tabs>

          <div className={'financial-header-drawer__footer'}>
            <Button className={'mr1'} intent={Intent.PRIMARY} type={'submit'}>
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={handleCancelClick} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </VendorBalanceDrawerHeader>
  );
}

export const VendorsBalanceSummaryHeader = compose(
  withVendorsBalanceSummary(({ VendorsSummaryFilterDrawer }) => ({
    VendorsSummaryFilterDrawer,
  })),
  withVendorsBalanceSummaryActions,
)(VendorsBalanceSummaryHeaderInner);

const VendorBalanceDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
