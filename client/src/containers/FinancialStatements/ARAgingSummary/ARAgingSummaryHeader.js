import React from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import ARAgingSummaryHeaderGeneral from './ARAgingSummaryHeaderGeneral';

import withARAgingSummary from './withARAgingSummary';
import withARAgingSummaryActions from './withARAgingSummaryActions';

import { compose } from 'utils';

/**
 * AR Aging Summary Report - Drawer Header.
 */
function ARAgingSummaryHeader({
  pageFilter,
  onSubmitFilter,
  receivableAgingFilter,

  // #withReceivableAgingSummary
  receivableAgingRefresh,

  // #withReceivableAgingSummaryActions
  refreshReceivableAgingSummary,
  toggleFilterARAgingSummary,
}) {
  const validationSchema = Yup.object().shape({
    asDate: Yup.date().required().label('asDate'),
    agingBeforeDays: Yup.number()
      .required()
      .integer()
      .positive()
      .label('agingBeforeDays'),
    agingPeriods: Yup.number()
      .required()
      .integer()
      .positive()
      .label('agingPeriods'),
  });
  // Initial values.
  const initialValues = {
    asDate: moment(pageFilter.asDate).toDate(),
    agingBeforeDays: 30,
    agingPeriods: 3,
  };
  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    setSubmitting(false);
  };
  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleFilterARAgingSummary();
  };

  return (
    <FinancialStatementHeader isOpen={receivableAgingFilter}>
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
              panel={<ARAgingSummaryHeaderGeneral />}
            />
          </Tabs>

          <div class="financial-header-drawer__footer">
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
  withARAgingSummaryActions,
  withARAgingSummary(
    ({ receivableAgingSummaryFilter, receivableAgingSummaryRefresh }) => ({
      receivableAgingFilter: receivableAgingSummaryFilter,
      receivableAgingRefresh: receivableAgingSummaryRefresh,
    }),
  ),
)(ARAgingSummaryHeader);
