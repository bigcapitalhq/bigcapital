import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';

import FinancialStatementHeader from '@/containers/FinancialStatements/FinancialStatementHeader';
import VendorsTransactionsHeaderGeneralPanel from './VendorsTransactionsHeaderGeneralPanel';

import withVendorsTransaction from './withVendorsTransaction';
import withVendorsTransactionsActions from './withVendorsTransactionsActions';

import { compose, transformToForm } from '@/utils';

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
  // Default form values.
  const defaultValues = {
    ...pageFilter,
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
    vendorsIds: [],
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
