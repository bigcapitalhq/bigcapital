import React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import styled from 'styled-components';

import { FormattedMessage as T } from '@/components';

import FinancialStatementHeader from '@/containers/FinancialStatements/FinancialStatementHeader';
import withCustomersBalanceSummary from './withCustomersBalanceSummary';
import withCustomersBalanceSummaryActions from './withCustomersBalanceSummaryActions';
import CustomersBalanceSummaryGeneralPanel from './CustomersBalanceSummaryGeneralPanel';

import { compose, transformToForm } from '@/utils';

/**
 * Customers balance summary.
 */
function CustomersBalanceSummaryHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withCustomersBalanceSummary
  customersBalanceDrawerFilter,

  // #withCustomersBalanceSummaryActions
  toggleCustomerBalanceFilterDrawer,
}) {
  // validation schema.
  const validationSchema = Yup.object().shape({
    asDate: Yup.date().required().label('asDate'),
  });
  // Default form values.
  const defaultValues = {
    ...pageFilter,
    asDate: moment().toDate(),
    customersIds: [],
  };

  // Filter form initial values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      asDate: moment(pageFilter.asDate).toDate(),
    },
    defaultValues,
  );
  // handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    toggleCustomerBalanceFilterDrawer(false);
    setSubmitting(false);
  };
  // handle close drawer.
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

          <div class="financial-header-drawer__footer">
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

export default compose(
  withCustomersBalanceSummary(({ customersBalanceDrawerFilter }) => ({
    customersBalanceDrawerFilter,
  })),
  withCustomersBalanceSummaryActions,
)(CustomersBalanceSummaryHeader);

const CustomerBalanceDrawerHeader = styled(FinancialStatementHeader)`
  .bp3-drawer {
    max-height: 450px;
  }
`;
