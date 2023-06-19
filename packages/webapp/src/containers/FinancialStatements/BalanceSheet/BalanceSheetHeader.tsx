// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';

import { FormattedMessage as T } from '@/components';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';

import withBalanceSheet from './withBalanceSheet';
import withBalanceSheetActions from './withBalanceSheetActions';

import BalanceSheetHeaderGeneralPanel from './BalanceSheetHeaderGeneralPanel';
import BalanceSheetHeaderComparisonPanel from './BalanceSheetHeaderComparisonPanel';
import BalanceSheetHeaderDimensionsPanel from './BalanceSheetHeaderDimensionsPanel';
import FinancialStatementHeader from '../../FinancialStatements/FinancialStatementHeader';

import { compose, transformToForm } from '@/utils';
import {
  getBalanceSheetHeaderValidationSchema,
  getDefaultBalanceSheetQuery,
} from './utils';

/**
 * Balance sheet header.
 */
function BalanceSheetHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withBalanceSheet
  balanceSheetDrawerFilter,

  // #withBalanceSheetActions
  toggleBalanceSheetFilterDrawer: toggleFilterDrawer,
}) {
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
  );
  // Validation schema.
  const validationSchema = getBalanceSheetHeaderValidationSchema();

  // Handle form submit.
  const handleSubmit = (values, actions) => {
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
  // Determines the given feature whether is enabled.
  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);

  return (
    <BalanceSheetFinancialHeader
      isOpen={balanceSheetDrawerFilter}
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
              panel={<BalanceSheetHeaderGeneralPanel />}
            />
            <Tab
              id="comparison"
              title={<T id={'balance_sheet.comparisons'} />}
              panel={<BalanceSheetHeaderComparisonPanel />}
            />
            {isBranchesFeatureCan && (
              <Tab
                id="dimensions"
                title={<T id={'balance_sheet.dimensions'} />}
                panel={<BalanceSheetHeaderDimensionsPanel />}
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
    </BalanceSheetFinancialHeader>
  );
}

export default compose(
  withBalanceSheet(({ balanceSheetDrawerFilter }) => ({
    balanceSheetDrawerFilter,
  })),
  withBalanceSheetActions,
)(BalanceSheetHeader);

const BalanceSheetFinancialHeader = styled(FinancialStatementHeader)`
  .bp3-drawer {
    max-height: 520px;
  }
`;
