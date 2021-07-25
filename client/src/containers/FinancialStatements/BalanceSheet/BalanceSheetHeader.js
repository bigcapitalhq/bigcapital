import React from 'react';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';

import withBalanceSheet from './withBalanceSheet';
import withBalanceSheetActions from './withBalanceSheetActions';

import { compose, transformToForm } from 'utils';
import BalanceSheetHeaderGeneralPanal from './BalanceSheetHeaderGeneralPanal';

/**
 * Balance sheet header.
 */
function BalanceSheetHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withBalanceSheet
  balanceSheetDrawerFilter,

  // #withBalanceSheetActions
  toggleBalanceSheetFilterDrawer: toggleFilterDrawer,
}) {
  const defaultValues = {
    basic: 'cash',
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
  };
  // Filter form initial values.
  const initialValues = transformToForm(
    {
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
  );

  // Validation schema.
  const validationSchema = Yup.object().shape({
    dateRange: Yup.string().optional(),
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
    accountsFilter: Yup.string(),
    displayColumnsType: Yup.string(),
  });

  // Handle form submit.
  const handleSubmit = (values, actions) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
    actions.setSubmitting(false);
  };

  // Handle cancel button click.
  const handleCancelClick = () => { toggleFilterDrawer(false); };

  // Handle drawer close action.
  const handleDrawerClose = () => { toggleFilterDrawer(false); };

  return (
    <FinancialStatementHeader
      isOpen={balanceSheetDrawerFilter}
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
  withBalanceSheet(({ balanceSheetDrawerFilter }) => ({
    balanceSheetDrawerFilter,
  })),
  withBalanceSheetActions,
)(BalanceSheetHeader);
