import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import {
  getCustomersTransactionsDefaultQuery,
  getCustomersTransactionsQuerySchema,
} from './_utils';
import { CustomersTransactionsHeaderGeneralPanel } from './CustomersTransactionsHeaderGeneralPanel';
import { withCustomersTransactions } from './withCustomersTransactions';
import {
  withCustomersTransactionsActions,
  WithCustomersTransactionsActionsProps,
} from './withCustomersTransactionsActions';
import { FormattedMessage as T } from '@/components';
import { compose, transformToForm } from '@/utils';

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

export const CustomersTransactionsHeader = compose(
  withCustomersTransactions(({ customersTransactionsDrawerFilter }) => ({
    isFilterDrawerOpen: customersTransactionsDrawerFilter,
  })),
  withCustomersTransactionsActions,
)(CustomersTransactionsHeaderInner);

const CustomerTransactionsDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
