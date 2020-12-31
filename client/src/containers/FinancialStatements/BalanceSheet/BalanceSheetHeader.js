import React, { useEffect } from 'react';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';

import withBalanceSheet from './withBalanceSheetDetail';
import withBalanceSheetActions from './withBalanceSheetActions';

import { compose } from 'utils';
import BalanceSheetHeaderGeneralPanal from './BalanceSheetHeaderGeneralPanal';

function BalanceSheetHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withBalanceSheet
  balanceSheetFilter,

  // #withBalanceSheetActions
  toggleBalanceSheetFilter,
}) {
  const { formatMessage } = useIntl();

  // Filter form initial values.
  const initialValues = {
    basis: 'cash',
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate(),
    toDate: moment(pageFilter.toDate).toDate(),
  };

  // Validation schema.
  const validationSchema = Yup.object().shape({
    dateRange: Yup.string().optional(),
    fromDate: Yup.date()
      .required()
      .label(formatMessage({ id: 'fromDate' })),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(formatMessage({ id: 'toDate' })),
    accountsFilter: Yup.string(),
    displayColumnsType: Yup.string(),
  });

  // Handle form submit.
  const handleSubmit = (values, actions) => {
    onSubmitFilter(values);
    toggleBalanceSheetFilter();
    actions.setSubmitting(false);
  };

  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleBalanceSheetFilter();
  };
  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleBalanceSheetFilter();
  };

  return (
    <FinancialStatementHeader
      isOpen={balanceSheetFilter}
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
              panel={<BalanceSheetHeaderGeneralPanal />}
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
  withBalanceSheet(({ balanceSheetFilter }) => ({
    balanceSheetFilter,
  })),
  withBalanceSheetActions,
)(BalanceSheetHeader);
