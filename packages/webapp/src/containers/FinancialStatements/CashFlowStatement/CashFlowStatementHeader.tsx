// @ts-nocheck
import React from 'react';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import FinancialStatementHeader from '../FinancialStatementHeader';
import CashFlowStatementGeneralPanel from './CashFlowStatementGeneralPanel';
import CashFlowStatementDimensionsPanel from './CashFlowStatementDimensionsPanel';

import withCashFlowStatement from './withCashFlowStatement';
import withCashFlowStatementActions from './withCashFlowStatementActions';

import { getDefaultCashFlowSheetQuery } from './utils';
import { compose, transformToForm } from '@/utils';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';

/**
 * Cash flow statement header.
 */
function CashFlowStatementHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withCashFlowStatement
  isFilterDrawerOpen,

  // #withCashStatementActions
  toggleCashFlowStatementFilterDrawer,
}) {
  // Filter form default values.
  const defaultValues = getDefaultCashFlowSheetQuery();

  // Initial form values.
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
    displayColumnsType: Yup.string(),
  });

  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    toggleCashFlowStatementFilterDrawer(false);
    setSubmitting(false);
  };

  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleCashFlowStatementFilterDrawer(false);
  };

  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);

  return (
    <FinancialStatementHeader
      isOpen={isFilterDrawerOpen}
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
              panel={<CashFlowStatementGeneralPanel />}
            />
            {isBranchesFeatureCan && (
              <Tab
                id="dimensions"
                title={<T id={'dimensions'} />}
                panel={<CashFlowStatementDimensionsPanel />}
              />
            )}
          </Tabs>

          <div class="financial-header-drawer__footer">
            <Button className={'mr1'} intent={Intent.PRIMARY} type={'submit'}>
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={handleDrawerClose} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </FinancialStatementHeader>
  );
}

export default compose(
  withCashFlowStatement(({ cashFlowStatementDrawerFilter }) => ({
    isFilterDrawerOpen: cashFlowStatementDrawerFilter,
  })),
  withCashFlowStatementActions,
)(CashFlowStatementHeader);
