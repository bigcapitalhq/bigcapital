import React from 'react';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import type { FormikHelpers } from 'formik';

import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { CashFlowStatementHeaderGeneralPanel as CashFlowStatementGeneralPanel } from './CashFlowStatementGeneralPanel';
import { CashFlowStatementDimensionsPanel } from './CashFlowStatementDimensionsPanel';

import {
  withCashFlowStatement,
  WithCashFlowStatementProps,
} from './withCashFlowStatement';
import {
  withCashFlowStatementActions,
  WithCashFlowStatementActionsProps,
} from './withCashFlowStatementActions';

import { getDefaultCashFlowSheetQuery } from './utils';
import { transformToForm } from '@/utils';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';
import { flow } from 'fp-ts/function';

type CashFlowSheetFormValues = ReturnType<typeof getDefaultCashFlowSheetQuery>;

interface CashFlowStatementHeaderOwnProps {
  onSubmitFilter: (values: CashFlowSheetFormValues) => void;
  pageFilter: CashFlowSheetFormValues;
}

type CashFlowStatementHeaderProps = CashFlowStatementHeaderOwnProps &
  Pick<WithCashFlowStatementProps, 'cashFlowStatementDrawerFilter'> &
  Pick<
    WithCashFlowStatementActionsProps,
    'toggleCashFlowStatementFilterDrawer'
  >;

function CashFlowStatementHeaderInner({
  onSubmitFilter,
  pageFilter,
  cashFlowStatementDrawerFilter: isFilterDrawerOpen,
  toggleCashFlowStatementFilterDrawer,
}: CashFlowStatementHeaderProps) {
  const defaultValues = getDefaultCashFlowSheetQuery();

  const initialValues = transformToForm(
    {
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
  ) as CashFlowSheetFormValues;

  const validationSchema = Yup.object().shape({
    dateRange: Yup.string().optional(),
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
    displayColumnsType: Yup.string(),
  });

  const handleSubmit = (
    values: CashFlowSheetFormValues,
    { setSubmitting }: FormikHelpers<CashFlowSheetFormValues>,
  ) => {
    onSubmitFilter(values);
    toggleCashFlowStatementFilterDrawer(false);
    setSubmitting(false);
  };

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

          <div className="financial-header-drawer__footer">
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

export const CashFlowStatementHeader = flow(
  withCashFlowStatementActions,
  withCashFlowStatement(({ cashFlowStatementDrawerFilter }) => ({
    cashFlowStatementDrawerFilter,
  })),
)(CashFlowStatementHeaderInner);
