import { Button, Intent, Tab, Tabs } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import * as FF from 'fp-ts/function';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { BudgetVsActualHeaderGeneralPanel } from './BudgetVsActualHeaderGeneralPanel';
import {
  getDefaultBudgetVsActualQuery,
  getBudgetVsActualQueryValidation,
} from './utils';
import {
  withBudgetVsActual,
  WithBudgetVsActualProps,
} from './withBudgetVsActual';
import {
  withBudgetVsActualActions,
  WithBudgetVsActualActionsProps,
} from './withBudgetVsActualActions';
import { FormattedMessage as T } from '@/components';
import { transformToForm } from '@/utils';

interface BudgetVsActualFormValues {
  budgetId: number | string;
  displayColumnsType: string;
  fromDate: Date | string;
  toDate: Date | string;
  accountsIds: number[];
  numberFormat: Record<string, unknown>;
  dateRange?: string;
  [key: string]: unknown;
}

interface BudgetVsActualHeaderOwnProps {
  onSubmitFilter: (values: Record<string, any>) => void;
  pageFilter: Record<string, any>;
}

type BudgetVsActualHeaderProps = Pick<
  WithBudgetVsActualProps,
  'budgetVsActualFilter'
> &
  Pick<WithBudgetVsActualActionsProps, 'toggleBudgetVsActualFilterDrawer'> &
  BudgetVsActualHeaderOwnProps;

/**
 * Budget vs actual header.
 */
function BudgetVsActualHeaderInner({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withBudgetVsActual
  budgetVsActualFilter,

  // #withBudgetVsActualActions
  toggleBudgetVsActualFilterDrawer: toggleFilterDrawer,
}: BudgetVsActualHeaderProps) {
  const defaultValues = getDefaultBudgetVsActualQuery();

  // Validation schema.
  const validationSchema = getBudgetVsActualQueryValidation();

  // Filter form initial values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      fromDate: pageFilter.fromDate ? moment(pageFilter.fromDate).toDate() : '',
      toDate: pageFilter.toDate ? moment(pageFilter.toDate).toDate() : '',
    },
    defaultValues,
  ) as BudgetVsActualFormValues;

  // Handle form submit.
  const handleSubmit = (
    values: BudgetVsActualFormValues,
    actions: FormikHelpers<BudgetVsActualFormValues>,
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

  return (
    <BudgetVsActualFinancialHeader
      isOpen={budgetVsActualFilter}
      drawerProps={{
        onClose: handleDrawerClose,
      }}
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
              panel={<BudgetVsActualHeaderGeneralPanel />}
            />
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
    </BudgetVsActualFinancialHeader>
  );
}

export const BudgetVsActualHeader = FF.pipe(
  BudgetVsActualHeaderInner,
  withBudgetVsActualActions,
  withBudgetVsActual(({ budgetVsActualFilter }) => ({
    budgetVsActualFilter,
  })),
);

const BudgetVsActualFinancialHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 380px;
  }
`;
