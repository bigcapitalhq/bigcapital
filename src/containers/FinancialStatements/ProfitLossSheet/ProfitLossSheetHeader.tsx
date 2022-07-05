import React from 'react';
import moment from 'moment';
import { Formik, Form } from 'formik';
import * as R from 'ramda';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import styled from 'styled-components';

import { FormattedMessage as T } from '@/components';
import FinancialStatementHeader from '@/containers/FinancialStatements/FinancialStatementHeader';
import ProfitLossSheetHeaderGeneralPane from './ProfitLossSheetHeaderGeneralPane';
import ProfitLossSheetHeaderComparisonPanel from './ProfitLossSheetHeaderComparisonPanel';
import ProfitLossSheetHeaderDimensionsPanel from './ProfitLossSheetHeaderDimensionsPanel';

import withProfitLoss from './withProfitLoss';
import withProfitLossActions from './withProfitLossActions';

import { useProfitLossHeaderValidationSchema } from './utils';

/**
 * Profit/loss header.
 * @returns {React.JSX}
 */
function ProfitLossHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withProfitLoss
  profitLossDrawerFilter,

  // #withProfitLossActions
  toggleProfitLossFilterDrawer: toggleFilterDrawer,
}) {
  // Validation schema.
  const validationSchema = useProfitLossHeaderValidationSchema();

  // Initial values.
  const initialValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate(),
    toDate: moment(pageFilter.toDate).toDate(),
  };
  // Handle form submit.
  const handleSubmit = (values, actions) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
  };
  // Handles the cancel button click.
  const handleCancelClick = () => {
    toggleFilterDrawer(false);
  };
  // Handles the drawer close action.
  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };

  return (
    <ProfitLossSheetHeader
      isOpen={profitLossDrawerFilter}
      drawerProps={{ onClose: handleDrawerClose }}
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <Tabs animate={true} vertical={true} renderActiveTabPanelOnly={true}>
            <Tab
              id="general"
              title={<T id={'general'} />}
              panel={<ProfitLossSheetHeaderGeneralPane />}
            />
            <Tab
              id="comparison"
              title={<T id={'profit_loss_sheet.comparisons'} />}
              panel={<ProfitLossSheetHeaderComparisonPanel />}
            />
            <Tab
              id="dimensions"
              title={<T id={'profit_loss_sheet.dimensions'} />}
              panel={<ProfitLossSheetHeaderDimensionsPanel />}
            />
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
    </ProfitLossSheetHeader>
  );
}

export default R.compose(
  withProfitLoss(({ profitLossDrawerFilter }) => ({
    profitLossDrawerFilter,
  })),
  withProfitLossActions,
)(ProfitLossHeader);

const ProfitLossSheetHeader = styled(FinancialStatementHeader)`
  .bp3-drawer {
    max-height: 520px;
  }
`;
