import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { CustomersBalanceSummaryGeneralPanel } from './CustomersBalanceSummaryGeneralPanel';
import {
  getCustomersBalanceQuerySchema,
  getDefaultCustomersBalanceQuery,
} from './utils';
import {
  withCustomersBalanceSummary,
  WithCustomersBalanceSummaryProps,
} from './withCustomersBalanceSummary';
import {
  withCustomersBalanceSummaryActions,
  WithCustomersBalanceSummaryActionsProps,
} from './withCustomersBalanceSummaryActions';
import type { FormikHelpers } from 'formik';
import { FormattedMessage as T } from '@/components';
import { compose, transformToForm } from '@/utils';

type CustomerBalanceFormValues = ReturnType<
  typeof getDefaultCustomersBalanceQuery
>;

interface CustomersBalanceSummaryHeaderOwnProps {
  onSubmitFilter: (values: CustomerBalanceFormValues) => void;
  pageFilter: CustomerBalanceFormValues;
}

type CustomersBalanceSummaryHeaderProps =
  CustomersBalanceSummaryHeaderOwnProps &
    Pick<WithCustomersBalanceSummaryProps, 'customersBalanceDrawerFilter'> &
    Pick<
      WithCustomersBalanceSummaryActionsProps,
      'toggleCustomerBalanceFilterDrawer'
    >;

function CustomersBalanceSummaryHeaderInner({
  onSubmitFilter,
  pageFilter,
  customersBalanceDrawerFilter,
  toggleCustomerBalanceFilterDrawer,
}: CustomersBalanceSummaryHeaderProps) {
  const validationSchema = getCustomersBalanceQuerySchema();

  const defaultValues = {
    ...pageFilter,
    asDate: moment().toDate(),
    customersIds: [],
  };

  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      asDate: moment(pageFilter.asDate).toDate(),
    },
    defaultValues,
  ) as CustomerBalanceFormValues;

  const handleSubmit = (
    values: CustomerBalanceFormValues,
    { setSubmitting }: FormikHelpers<CustomerBalanceFormValues>,
  ) => {
    onSubmitFilter(values);
    toggleCustomerBalanceFilterDrawer(false);
    setSubmitting(false);
  };

  const handleDrawerClose = () => {
    toggleCustomerBalanceFilterDrawer(false);
  };

  return (
    <CustomerBalanceDrawerHeader
      isOpen={customersBalanceDrawerFilter}
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
              panel={<CustomersBalanceSummaryGeneralPanel />}
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
    </CustomerBalanceDrawerHeader>
  );
}

export const CustomersBalanceSummaryHeader = compose(
  withCustomersBalanceSummary(({ customersBalanceDrawerFilter }) => ({
    customersBalanceDrawerFilter,
  })),
  withCustomersBalanceSummaryActions,
)(CustomersBalanceSummaryHeaderInner);

const CustomerBalanceDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
