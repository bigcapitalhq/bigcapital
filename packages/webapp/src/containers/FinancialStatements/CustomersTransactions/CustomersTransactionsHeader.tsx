import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { Formik, Form, FormikHelpers } from 'formik';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { CustomersTransactionsHeaderGeneralPanel } from './CustomersTransactionsHeaderGeneralPanel';
import { withCustomersTransactions } from './withCustomersTransactions';
import {
  withCustomersTransactionsActions,
  WithCustomersTransactionsActionsProps,
} from './withCustomersTransactionsActions';
import { transformToForm } from '@/utils';
import {
  getCustomersTransactionsDefaultQuery,
  getCustomersTransactionsQuerySchema,
} from './_utils';
import { flow } from 'fp-ts/function';

interface CustomersTransactionsHeaderFormValues {
  fromDate: Date;
  toDate: Date;
  customersIds: string[];
  filterByOption: string;
  [key: string]: unknown;
}

interface CustomersTransactionsHeaderOwnProps {
  onSubmitFilter: (values: Record<string, any>) => void;
  pageFilter: Record<string, any>;
}

type CustomersTransactionsHeaderProps = {
  isFilterDrawerOpen: boolean;
} & Pick<
  WithCustomersTransactionsActionsProps,
  'toggleCustomersTransactionsFilterDrawer'
> &
  CustomersTransactionsHeaderOwnProps;

/**
 * Customers transactions header.
 */
function CustomersTransactionsHeaderInner({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  //#withCustomersTransactions
  isFilterDrawerOpen,

  //#withCustomersTransactionsActions
  toggleCustomersTransactionsFilterDrawer: toggleFilterDrawer,
}: CustomersTransactionsHeaderProps) {
  // Default form values.
  const defaultValues = getCustomersTransactionsDefaultQuery();

  // Initial form values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
  ) as CustomersTransactionsHeaderFormValues;

  // Validation schema.
  const validationSchema = getCustomersTransactionsQuerySchema();

  // Handle form submit.
  const handleSubmit = (
    values: CustomersTransactionsHeaderFormValues,
    { setSubmitting }: FormikHelpers<CustomersTransactionsHeaderFormValues>,
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
    <CustomerTransactionsDrawerHeader
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
              panel={<CustomersTransactionsHeaderGeneralPanel />}
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
    </CustomerTransactionsDrawerHeader>
  );
}

export const CustomersTransactionsHeader = flow(
  withCustomersTransactionsActions,
  withCustomersTransactions(({ customersTransactionsDrawerFilter }) => ({
    isFilterDrawerOpen: customersTransactionsDrawerFilter,
  })),
)(CustomersTransactionsHeaderInner);

const CustomerTransactionsDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
