import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import VendorsTransactionsHeaderGeneralPanel from './VendorsTransactionsHeaderGeneralPanel';

import withVendorsTransaction from './withVendorsTransaction';
import withVendorsTransactionsActions from './withVendorsTransactionsActions';

import { compose } from 'utils';

/**
 * Vendors transactions header.
 */

function VendorsTransactionsHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  //#withVendorsTransaction
  isFilterDrawerOpen,

  //#withVendorsTransactionsActions
  toggleVendorsTransactionsFilterDrawer: toggleFilterDrawer,
}) {
  const { formatMessage } = useIntl();

  // Filter form initial values.
  const initialValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate(),
    toDate: moment(pageFilter.toDate).toDate(),
  };

  // Validation schema.
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date()
      .required()
      .label(formatMessage({ id: 'fromDate' })),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(formatMessage({ id: 'toDate' })),
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
    </FinancialStatementHeader>
  );
}
export default compose(
  withVendorsTransactionsActions,
  withVendorsTransaction(({ vendorsTransactionsDrawerFilter }) => ({
    isFilterDrawerOpen: vendorsTransactionsDrawerFilter,
  })),
)(VendorsTransactionsHeader);
