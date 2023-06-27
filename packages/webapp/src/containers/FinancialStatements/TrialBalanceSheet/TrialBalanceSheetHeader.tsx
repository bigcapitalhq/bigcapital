// @ts-nocheck
import React from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import moment from 'moment';
import { Formik, Form } from 'formik';
import intl from 'react-intl-universal';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import { FormattedMessage as T } from '@/components';

import FinancialStatementHeader from '../FinancialStatementHeader';
import TrialBalanceSheetHeaderGeneralPanel from './TrialBalanceSheetHeaderGeneralPanel';
import TrialBalanceSheetHeaderDimensionsPanel from './TrialBalanceSheetHeaderDimensionsPanel';

import withTrialBalance from './withTrialBalance';
import withTrialBalanceActions from './withTrialBalanceActions';

import { compose, transformToForm } from '@/utils';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';

/**
 * Trial balance sheet header.
 */
function TrialBalanceSheetHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withTrialBalance
  trialBalanceDrawerFilter,

  // #withTrialBalanceActions
  toggleTrialBalanceFilterDrawer: toggleFilterDrawer,
}) {
  // Form validation schema.
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('from_date')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('to_date')),
  });
  // Determines whether the feature is enabled.
  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);

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
    },
    defaultValues,
  );
  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    setSubmitting(false);
    toggleFilterDrawer(false);
  };
  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };

  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleFilterDrawer(false);
  };

  return (
    <TrialBalanceSheetDrawerHeader
      isOpen={trialBalanceDrawerFilter}
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
            {isBranchesFeatureCan && (
              <Tab
                id="dimensions"
                title={<T id={'dimensions'} />}
                panel={<TrialBalanceSheetHeaderDimensionsPanel />}
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
    </TrialBalanceSheetDrawerHeader>
  );
}

export default compose(
  withTrialBalance(({ trialBalanceDrawerFilter }) => ({
    trialBalanceDrawerFilter,
  })),
  withTrialBalanceActions,
)(TrialBalanceSheetHeader);

const TrialBalanceSheetDrawerHeader = styled(FinancialStatementHeader)`
  .bp3-drawer {
    max-height: 450px;
  }
`;
