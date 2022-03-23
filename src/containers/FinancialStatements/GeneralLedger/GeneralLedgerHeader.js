import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import styled from 'styled-components';

import { FormattedMessage as T } from 'components';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import GeneralLedgerHeaderGeneralPane from './GeneralLedgerHeaderGeneralPane';
import GeneralLedgerHeaderDimensionsPanel from './GeneralLedgerHeaderDimensionsPanel';

import withGeneralLedger from './withGeneralLedger';
import withGeneralLedgerActions from './withGeneralLedgerActions';

import { compose, transformToForm, saveInvoke } from 'utils';

/**
 * Geenral Ledger (GL) - Header.
 */
function GeneralLedgerHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withGeneralLedgerActions
  toggleGeneralLedgerFilterDrawer: toggleDisplayFilterDrawer,

  // #withGeneralLedger
  isFilterDrawerOpen,
}) {
  // Default values.
  const defaultValues = {
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
    branchesIds: [],
  };

  // Initial values.
  const initialValues = transformToForm(
    {
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
      branchesIds: [],
    },
    defaultValues,
  );

  // Validation schema.
  const validationSchema = Yup.object().shape({
    dateRange: Yup.string().optional(),
    fromDate: Yup.date().required(),
    toDate: Yup.date().min(Yup.ref('fromDate')).required(),
  });

  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    saveInvoke(onSubmitFilter, values);
    toggleDisplayFilterDrawer();
    setSubmitting(false);
  };

  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleDisplayFilterDrawer(false);
  };

  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleDisplayFilterDrawer(false);
  };

  return (
    <GeneralLedgerDrawerHeader
      isOpen={isFilterDrawerOpen}
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
            <Tab
              id="dimensions"
              title={<T id={'dimensions'} />}
              panel={<GeneralLedgerHeaderDimensionsPanel />}
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
    </GeneralLedgerDrawerHeader>
  );
}

export default compose(
  withGeneralLedger(({ generalLedgerFilterDrawer }) => ({
    isFilterDrawerOpen: generalLedgerFilterDrawer,
  })),
  withGeneralLedgerActions,
)(GeneralLedgerHeader);

const GeneralLedgerDrawerHeader = styled(FinancialStatementHeader)`
  .bp3-drawer {
    max-height: 520px;
  }
`;
