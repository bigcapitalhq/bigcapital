// @ts-nocheck
import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import FinancialStatementHeader from '../FinancialStatementHeader';
import RealizedGainOrLossGeneralPanel from './RealizedGainOrLossGeneralPanel';

import withRealizedGainOrLoss from './withRealizedGainOrLoss';
import withRealizedGainOrLossActions from './withRealizedGainOrLossActions';

import { compose, transformToForm } from '@/utils';

/**
 * Realized Gain or Loss.header.
 */
function RealizedGainOrLossHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  //#withRealizedGainOrLoss
  isFilterDrawerOpen,

  //#withRealizedGainOrLossActions
  toggleRealizedGainOrLossFilterDrawer,
}) {
  // Filter form default values.
  const defaultValues = {
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
  };

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
    toggleRealizedGainOrLossFilterDrawer(false);
    setSubmitting(false);
  };

  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleRealizedGainOrLossFilterDrawer(false);
  };

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
              panel={<RealizedGainOrLossGeneralPanel />}
            />
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
  withRealizedGainOrLoss(({ realizedGainOrLossDrawerFilter }) => ({
    isFilterDrawerOpen: realizedGainOrLossDrawerFilter,
  })),
  withRealizedGainOrLossActions,
)(RealizedGainOrLossHeader);
