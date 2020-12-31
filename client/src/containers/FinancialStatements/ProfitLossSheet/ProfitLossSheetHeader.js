import React, { useEffect } from 'react';
import moment from 'moment';
import { Formik, Form } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import ProfitLossSheetHeaderGeneralPane from './ProfitLossSheetHeaderGeneralPane';

import withProfitLoss from './withProfitLoss';
import withProfitLossActions from './withProfitLossActions';

import { compose } from 'utils';

function ProfitLossHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withProfitLoss
  profitLossSheetFilter,

  // #withProfitLossActions
  toggleProfitLossSheetFilter,
}) {
  const { formatMessage } = useIntl();

  // Validation schema.
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date()
      .required()
      .label(formatMessage({ id: 'from_date' })),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(formatMessage({ id: 'to_date' })),
    accountsFilter: Yup.string(),
    displayColumnsType: Yup.string(),
  });

  // Initial values.
  const initialValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate(),
    toDate: moment(pageFilter.toDate).toDate(),
  };

  // Handle form submit.
  const handleSubmit = (values, actions) => {
    onSubmitFilter(values);
    toggleProfitLossSheetFilter();
  };

  // Handles the cancel button click.
  const handleCancelClick = () => {
    toggleProfitLossSheetFilter();
  };
  // Handles the drawer close action.
  const handleDrawerClose = () => {
    toggleProfitLossSheetFilter();
  };

  return (
    <FinancialStatementHeader
      isOpen={profitLossSheetFilter}
      drawerProps={{ onClose: handleDrawerClose }}
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <Tabs animate={true} vertical={true} renderActiveTabPanelOnly={true}>
            <Tab
              id="general"
              title={<T id={'general'} />}
              panel={<ProfitLossSheetHeaderGeneralPane />}
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
  withProfitLoss(({ profitLossSheetFilter }) => ({
    profitLossSheetFilter,
  })),
  withProfitLossActions,
)(ProfitLossHeader);
