import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { UnrealizedGainOrLossGeneralPanel } from './UnrealizedGainOrLossGeneralPanel';
import { withUnrealizedGainOrLoss } from './withUnrealizedGainOrLoss';
import {
  withUnrealizedGainOrLossActions,
  WithUnrealizedGainOrLossActionsProps,
} from './withUnrealizedGainOrLossActions';
import type { FormikHelpers } from 'formik';
import { FormattedMessage as T } from '@/components';
import { compose, transformToForm } from '@/utils';

interface UnrealizedGainOrLossHeaderOwnProps {
  onSubmitFilter: (values: Record<string, unknown>) => void;
  pageFilter: Record<string, unknown>;
}

type UnrealizedGainOrLossHeaderProps = UnrealizedGainOrLossHeaderOwnProps & {
  isFilterDrawerOpen: boolean;
} & Pick<
    WithUnrealizedGainOrLossActionsProps,
    'toggleUnrealizedGainOrLossFilterDrawer'
  >;

function UnrealizedGainOrLossHeaderInner({
  onSubmitFilter,
  pageFilter,
  isFilterDrawerOpen,
  toggleUnrealizedGainOrLossFilterDrawer,
}: UnrealizedGainOrLossHeaderProps) {
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
    toggleUnrealizedGainOrLossFilterDrawer(false);
    setSubmitting(false);
  };

  const handleDrawerClose = () => {
    toggleUnrealizedGainOrLossFilterDrawer(false);
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
              panel={<UnrealizedGainOrLossGeneralPanel />}
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

export const UnrealizedGainOrLossHeader = compose(
  withUnrealizedGainOrLoss(({ unrealizedGainOrLossDrawerFilter }) => ({
    isFilterDrawerOpen: unrealizedGainOrLossDrawerFilter,
  })),
  withUnrealizedGainOrLossActions,
)(UnrealizedGainOrLossHeaderInner);
