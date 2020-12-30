import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import GeneralLedgerHeaderGeneralPane from './GeneralLedgerHeaderGeneralPane';

import withGeneralLedger from './withGeneralLedger';
import withGeneralLedgerActions from './withGeneralLedgerActions';

import { compose } from 'utils';

/**
 * Geenral Ledger (GL) - Header.
 */
function GeneralLedgerHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withGeneralLedgerActions
  toggleGeneralLedgerSheetFilter,

  // #withGeneralLedger
  generalLedgerSheetFilter,
}) {
  // Initial values.
  const initialValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate(),
    toDate: moment(pageFilter.toDate).toDate(),
  };

  // Validation schema.
  const validationSchema = Yup.object().shape({
    dateRange: Yup.string().optional(),
    fromDate: Yup.date().required(),
    toDate: Yup.date().min(Yup.ref('fromDate')).required(),
  });

  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    toggleGeneralLedgerSheetFilter();
    setSubmitting(false);
  };

  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleGeneralLedgerSheetFilter(false);
  };

  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleGeneralLedgerSheetFilter(false);
  };

  return (
    <FinancialStatementHeader
      isOpen={generalLedgerSheetFilter}
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
              panel={<GeneralLedgerHeaderGeneralPane />}
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
  withGeneralLedger(({ generalLedgerSheetFilter }) => ({
    generalLedgerSheetFilter,
  })),
  withGeneralLedgerActions,
)(GeneralLedgerHeader);
