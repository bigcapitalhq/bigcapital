import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { TrialBalanceSheetHeaderDimensionsPanel } from './TrialBalanceSheetHeaderDimensionsPanel';
import { TrialBalanceSheetHeaderGeneralPanel } from './TrialBalanceSheetHeaderGeneralPanel';
import { withTrialBalance, WithTrialBalanceProps } from './withTrialBalance';
import {
  withTrialBalanceActions,
  WithTrialBalanceActionsProps,
} from './withTrialBalanceActions';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { compose, transformToForm } from '@/utils';

interface TrialBalanceFormValues {
  fromDate: Date;
  toDate: Date;
  branchesIds: string[];
  filterByOption: string;
  [key: string]: unknown;
}

interface TrialBalanceSheetHeaderOwnProps {
  pageFilter: Record<string, unknown>;
  onSubmitFilter: (values: Record<string, unknown>) => void;
}

type TrialBalanceSheetHeaderProps = TrialBalanceSheetHeaderOwnProps &
  WithTrialBalanceProps &
  Pick<WithTrialBalanceActionsProps, 'toggleTrialBalanceFilterDrawer'>;

/**
 * Trial balance sheet header.
 */
function TrialBalanceSheetHeaderInner({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withTrialBalance
  trialBalanceDrawerFilter,

  // #withTrialBalanceActions
  toggleTrialBalanceFilterDrawer: toggleFilterDrawer,
}: TrialBalanceSheetHeaderProps) {
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
  const defaultValues: TrialBalanceFormValues = {
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
    branchesIds: [],
    filterByOption: 'with-transactions',
  };

  // Initial values.
  const initialValues = transformToForm(
    {
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate as string).toDate(),
      toDate: moment(pageFilter.toDate as string).toDate(),
    },
    defaultValues,
  ) as TrialBalanceFormValues;
  // Handle form submit.
  const handleSubmit = (
    values: TrialBalanceFormValues,
    { setSubmitting }: FormikHelpers<TrialBalanceFormValues>,
  ) => {
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
      <Formik<TrialBalanceFormValues>
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

          <div className="financial-header-drawer__footer">
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

export const TrialBalanceSheetHeader = compose(
  withTrialBalance(({ trialBalanceDrawerFilter }) => ({
    trialBalanceDrawerFilter,
  })),
  withTrialBalanceActions,
)(TrialBalanceSheetHeaderInner);

const TrialBalanceSheetDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
