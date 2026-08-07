import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../../FinancialStatements/FinancialStatementHeader';
import { BalanceSheetHeaderComparisonPanal } from './BalanceSheetHeaderComparisonPanal';
import { BalanceSheetHeaderDimensionsPanel } from './BalanceSheetHeaderDimensionsPanel';
import { BalanceSheetHeaderGeneralPanal } from './BalanceSheetHeaderGeneralPanal';
import {
  getBalanceSheetHeaderValidationSchema,
  getDefaultBalanceSheetQuery,
} from './utils';
import { withBalanceSheet } from './withBalanceSheet';
import { withBalanceSheetActions } from './withBalanceSheetActions';
import type { WithBalanceSheetProps } from './withBalanceSheet';
import type { WithBalanceSheetActionsProps } from './withBalanceSheetActions';
import type { FormikHelpers } from 'formik';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { compose, transformToForm } from '@/utils';

type BalanceSheetFormValues = Omit<
  ReturnType<typeof getDefaultBalanceSheetQuery>,
  'fromDate' | 'toDate'
> & {
  fromDate: Date;
  toDate: Date;
};

interface BalanceSheetHeaderOwnProps {
  onSubmitFilter: (values: BalanceSheetFormValues) => void;
  pageFilter: ReturnType<typeof getDefaultBalanceSheetQuery>;
}

type BalanceSheetHeaderProps = BalanceSheetHeaderOwnProps &
  Pick<WithBalanceSheetProps, 'balanceSheetDrawerFilter'> &
  Pick<WithBalanceSheetActionsProps, 'toggleBalanceSheetFilterDrawer'>;

function BalanceSheetHeaderInner({
  onSubmitFilter,
  pageFilter,
  balanceSheetDrawerFilter,
  toggleBalanceSheetFilterDrawer: toggleFilterDrawer,
}: BalanceSheetHeaderProps) {
  const defaultValues = getDefaultBalanceSheetQuery();

  // Filter form initial values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
  ) as BalanceSheetFormValues;
  // Validation schema.
  const validationSchema = getBalanceSheetHeaderValidationSchema();

  // Handle form submit.
  const handleSubmit = (
    values: BalanceSheetFormValues,
    actions: FormikHelpers<BalanceSheetFormValues>,
  ) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
    actions.setSubmitting(false);
  };
  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleFilterDrawer(false);
  };
  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };
  // Detarmines the given feature whether is enabled.
  const { featureCan } = useFeatureCan();
  const isBranchesFeatureCan = featureCan(Features.Branches);

  return (
    <BalanceSheetFinancialHeader
      isOpen={balanceSheetDrawerFilter}
      drawerProps={{
        onClose: handleDrawerClose,
      }}
    >
      <Formik<BalanceSheetFormValues>
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
            <Tab
              id="comparison"
              title={<T id={'balance_sheet.comparisons'} />}
              panel={<BalanceSheetHeaderComparisonPanal />}
            />
            {isBranchesFeatureCan && (
              <Tab
                id="dimensions"
                title={<T id={'balance_sheet.dimensions'} />}
                panel={<BalanceSheetHeaderDimensionsPanel />}
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
    </BalanceSheetFinancialHeader>
  );
}

export const BalanceSheetHeader = compose(
  withBalanceSheet(({ balanceSheetDrawerFilter }) => ({
    balanceSheetDrawerFilter,
  })),
  withBalanceSheetActions,
)(BalanceSheetHeaderInner);

const BalanceSheetFinancialHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 520px;
  }
`;
