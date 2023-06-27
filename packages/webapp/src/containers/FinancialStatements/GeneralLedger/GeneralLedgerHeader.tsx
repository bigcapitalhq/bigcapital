// @ts-nocheck
import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import { FormattedMessage as T } from '@/components';
import { getDefaultGeneralLedgerQuery } from './common';
import { compose, transformToForm, saveInvoke } from '@/utils';

import FinancialStatementHeader from '../FinancialStatementHeader';
import GeneralLedgerHeaderGeneralPane from './GeneralLedgerHeaderGeneralPane';
import GeneralLedgerHeaderDimensionsPanel from './GeneralLedgerHeaderDimensionsPanel';

import withGeneralLedger from './withGeneralLedger';
import withGeneralLedgerActions from './withGeneralLedgerActions';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';

/**
 * General Ledger (GL) - Header.
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
  const defaultValues = getDefaultGeneralLedgerQuery();

  // Initial values.
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
    fromDate: Yup.date().required(),
    toDate: Yup.date().min(Yup.ref('fromDate')).required(),
  });
  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    saveInvoke(onSubmitFilter, values);
    toggleDisplayFilterDrawer(false);
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
  // Determines the feature whether is enabled.
  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);

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
            {isBranchesFeatureCan && (
              <Tab
                id="dimensions"
                title={<T id={'dimensions'} />}
                panel={<GeneralLedgerHeaderDimensionsPanel />}
              />
            )}
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
