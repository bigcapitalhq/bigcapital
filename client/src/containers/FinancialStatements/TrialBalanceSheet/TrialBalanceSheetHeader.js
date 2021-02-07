import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import TrialBalanceSheetHeaderGeneralPanel from './TrialBalanceSheetHeaderGeneralPanel';

import withTrialBalance from './withTrialBalance';
import withTrialBalanceActions from './withTrialBalanceActions';

import { compose } from 'utils';

function TrialBalanceSheetHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withTrialBalance
  trialBalanceSheetFilter,

  // #withTrialBalanceActions
  toggleTrialBalanceFilter
}) {
  const { formatMessage } = useIntl();

  // Form validation schema.
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date()
      .required()
      .label(formatMessage({ id: 'from_date' })),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(formatMessage({ id: 'to_date' })),
  });

  // Initial values.
  const initialValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate(),
    toDate: moment(pageFilter.toDate).toDate(),
  };

  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    setSubmitting(false);
    toggleTrialBalanceFilter(false);
  };

  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleTrialBalanceFilter(false);
  };

  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleTrialBalanceFilter(false);
  };

  return (
    <FinancialStatementHeader
      isOpen={trialBalanceSheetFilter}
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
              panel={<TrialBalanceSheetHeaderGeneralPanel />}
            />
          </Tabs>

          <div class="financial-header-drawer__footer">
            <Button
              className={'mr1'}
              intent={Intent.PRIMARY}
              type={'submit'}
            >
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
  withTrialBalance(({ trialBalanceSheetFilter, trialBalanceSheetRefresh }) => ({
    trialBalanceSheetFilter,
    trialBalanceSheetRefresh,
  })),
  withTrialBalanceActions,
)(TrialBalanceSheetHeader);
