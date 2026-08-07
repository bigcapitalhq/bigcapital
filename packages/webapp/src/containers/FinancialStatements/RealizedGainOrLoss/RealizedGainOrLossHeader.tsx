import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { RealizedGainOrLossGeneralPanel } from './RealizedGainOrLossGeneralPanel';
import { withRealizedGainOrLoss } from './withRealizedGainOrLoss';
import {
  withRealizedGainOrLossActions,
  WithRealizedGainOrLossActionsProps,
} from './withRealizedGainOrLossActions';
import type { FormikHelpers } from 'formik';
import { FormattedMessage as T } from '@/components';
import { compose, transformToForm } from '@/utils';

interface RealizedGainOrLossHeaderOwnProps {
  onSubmitFilter: (values: Record<string, unknown>) => void;
  pageFilter: Record<string, unknown>;
}

type RealizedGainOrLossHeaderProps = RealizedGainOrLossHeaderOwnProps & {
  isFilterDrawerOpen: boolean;
} & Pick<
    WithRealizedGainOrLossActionsProps,
    'toggleRealizedGainOrLossFilterDrawer'
  >;

function RealizedGainOrLossHeaderInner({
  onSubmitFilter,
  pageFilter,
  isFilterDrawerOpen,
  toggleRealizedGainOrLossFilterDrawer,
}: RealizedGainOrLossHeaderProps) {
  const defaultValues = {
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
  };

  const initialValues = transformToForm(
    {
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate as string).toDate(),
      toDate: moment(pageFilter.toDate as string).toDate(),
    },
    defaultValues,
  );

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
    values: Record<string, unknown>,
    { setSubmitting }: FormikHelpers<Record<string, unknown>>,
  ) => {
    onSubmitFilter(values);
    toggleRealizedGainOrLossFilterDrawer(false);
    setSubmitting(false);
  };

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

export const RealizedGainOrLossHeader = compose(
  withRealizedGainOrLoss(({ realizedGainOrLossDrawerFilter }) => ({
    isFilterDrawerOpen: realizedGainOrLossDrawerFilter,
  })),
  withRealizedGainOrLossActions,
)(RealizedGainOrLossHeaderInner);
