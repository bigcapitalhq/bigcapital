import React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import withVendorsBalanceSummary from './withVendorsBalanceSummary';
import withVendorsBalanceSummaryActions from './withVendorsBalanceSummaryActions';
import VendorsBalanceSummaryHeaderGeneral from './VendorsBalanceSummaryHeaderGeneral';

import { compose, transformToForm } from 'utils';

/**
 * Vendors balance summary drawer header.
 */
function VendorsBalanceSummaryHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  //#withVendorsBalanceSummary
  VendorsSummaryFilterDrawer,

  //#withVendorsBalanceSummaryActions
  toggleVendorSummaryFilterDrawer,
}) {
  // validation schema.
  const validationSchema = Yup.object().shape({
    asDate: Yup.date().required().label('asDate'),
  });

  // filter form initial values.
  const defaultValues = {
    ...pageFilter,
    asDate: moment().toDate(),
    vendorsIds: [],
  };
  // Initial form values.
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
    toggleVendorSummaryFilterDrawer(false);
    setSubmitting(false);
  };

  // handle cancel button click.
  const handleCancelClick = () => {
    toggleVendorSummaryFilterDrawer(false);
  };

  return (
    <FinancialStatementHeader
      isOpen={VendorsSummaryFilterDrawer}
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
    </FinancialStatementHeader>
  );
}

export default compose(
  withVendorsBalanceSummary(({ VendorsSummaryFilterDrawer }) => ({
    VendorsSummaryFilterDrawer,
  })),
  withVendorsBalanceSummaryActions,
)(VendorsBalanceSummaryHeader);
