import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import {
  getVendorTransactionsQuerySchema,
  getVendorsTransactionsDefaultQuery,
} from './_utils';
import { VendorsTransactionsHeaderGeneralPanel } from './VendorsTransactionsHeaderGeneralPanel';
import { withVendorsTransaction } from './withVendorsTransaction';
import {
  withVendorsTransactionsActions,
  WithVendorsTransactionsActionsProps,
} from './withVendorsTransactionsActions';
import { FormattedMessage as T } from '@/components';
import { compose, transformToForm } from '@/utils';

interface VendorsTransactionsHeaderOwnProps {
  onSubmitFilter: (values: Record<string, unknown>) => void;
  pageFilter: Record<string, unknown>;
}

interface FormValues {
  fromDate: Date;
  toDate: Date;
  vendorsIds: string[];
  [key: string]: unknown;
}

type VendorsTransactionsHeaderProps = VendorsTransactionsHeaderOwnProps & {
  isFilterDrawerOpen: boolean;
} & WithVendorsTransactionsActionsProps;

/**
 * Vendors transactions header.
 */
function VendorsTransactionsHeaderInner({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  //#withVendorsTransaction
  isFilterDrawerOpen,

  //#withVendorsTransactionsActions
  toggleVendorsTransactionsFilterDrawer: toggleFilterDrawer,
}: VendorsTransactionsHeaderProps) {
  // Default form values.
  const defaultValues = getVendorsTransactionsDefaultQuery();

  // Initial form values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate as string).toDate(),
      toDate: moment(pageFilter.toDate as string).toDate(),
    },
    defaultValues,
  ) as FormValues;
  // Validation schema.
  const validationSchema = getVendorTransactionsQuerySchema();

  // Handle form submit.
  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
    setSubmitting(false);
  };
  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };

  return (
    <FinancialStatementHeader
      isOpen={isFilterDrawerOpen}
      drawerProps={{ onClose: handleDrawerClose }}
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
              panel={<VendorsTransactionsHeaderGeneralPanel />}
            />
          </Tabs>

          <div className="financial-header-drawer__footer">
            <Button className={'mr1'} intent={Intent.PRIMARY} type={'submit'}>
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={handleDrawerClose} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </FinancialStatementHeader>
  );
}
export const VendorsTransactionsHeader = compose(
  withVendorsTransactionsActions,
  withVendorsTransaction(({ vendorsTransactionsDrawerFilter }) => ({
    isFilterDrawerOpen: vendorsTransactionsDrawerFilter,
  })),
)(VendorsTransactionsHeaderInner);
