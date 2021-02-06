import React from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Formik, Form, validateYupSchema } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import APAgingSummaryHeaderGeneral from './APAgingSummaryHeaderGeneral';

import withAPAgingSummary from './withAPAgingSummary';
import withAPAgingSummaryActions from './withAPAgingSummaryActions';

import { compose } from 'utils';

/**
 * AP Aging Summary Report - Drawer Header.
 */
function APAgingSummaryHeader({
  pageFilter,
  onSubmitFilter,
  payableAgingFilter,

  // #withPayableAgingSummaryActions
  toggleFilterAPAgingSummary,
}) {
  const validationSchema = Yup.object({
    as_date: Yup.date().required().label('asDate'),
    aging_days_before: Yup.number()
      .required()
      .integer()
      .positive()
      .label('agingBeforeDays'),
    aging_periods: Yup.number()
      .required()
      .integer()
      .positive()
      .label('agingPeriods'),
  });

  // initial values.
  const initialValues = {
    as_date: moment(pageFilter.asDate).toDate(),
    aging_days_before: 30,
    aging_periods: 3,
  };

  // handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    setSubmitting(false);
  };

  // handle cancel button click.
  const handleCancelClick = () => toggleFilterAPAgingSummary();
  return (
    <FinancialStatementHeader isOpen={payableAgingFilter}>
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
              panel={<APAgingSummaryHeaderGeneral />}
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
  withAPAgingSummaryActions,
  withAPAgingSummary(({ payableAgingSummaryFilter }) => ({
    payableAgingFilter: payableAgingSummaryFilter,
  })),
)(APAgingSummaryHeader);
