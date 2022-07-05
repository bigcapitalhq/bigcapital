import React from 'react';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import styled from 'styled-components';

import FinancialStatementHeader from '@/containers/FinancialStatements/FinancialStatementHeader';
import CustomersTransactionsHeaderGeneralPanel from './CustomersTransactionsHeaderGeneralPanel';

import withCustomersTransactions from './withCustomersTransactions';
import withCustomersTransactionsActions from './withCustomersTransactionsActions';

import { compose, transformToForm } from '@/utils';

/**
 * Customers transactions header.
 */
function CustomersTransactionsHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  //#withCustomersTransactions
  isFilterDrawerOpen,

  //#withCustomersTransactionsActions
  toggleCustomersTransactionsFilterDrawer: toggleFilterDrawer,
}) {
  // Default form values.
  const defaultValues = {
    ...pageFilter,
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
    customersIds: [],
  };
  // Initial form values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
  );

  // Validation schema.
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
  });

  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
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
    </CustomerTransactionsDrawerHeader>
  );
}

export default compose(
  withCustomersTransactions(({ customersTransactionsDrawerFilter }) => ({
    isFilterDrawerOpen: customersTransactionsDrawerFilter,
  })),
  withCustomersTransactionsActions,
)(CustomersTransactionsHeader);

const CustomerTransactionsDrawerHeader = styled(FinancialStatementHeader)`
  .bp3-drawer {
    max-height: 450px;
  }
`;
