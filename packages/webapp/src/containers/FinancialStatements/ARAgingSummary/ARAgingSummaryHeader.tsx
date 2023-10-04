// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { FormattedMessage as T } from '@/components';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import FinancialStatementHeader from '@/containers/FinancialStatements/FinancialStatementHeader';
import ARAgingSummaryHeaderGeneral from './ARAgingSummaryHeaderGeneral';
import ARAgingSummaryHeaderDimensions from './ARAgingSummaryHeaderDimensions';

import withARAgingSummary from './withARAgingSummary';
import withARAgingSummaryActions from './withARAgingSummaryActions';

import { compose, transformToForm } from '@/utils';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';
import {
  getARAgingSummaryQuerySchema,
  getDefaultARAgingSummaryQuery,
} from './common';

/**
 * AR Aging Summary Report - Drawer Header.
 */
function ARAgingSummaryHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withReceivableAgingSummaryActions
  toggleARAgingSummaryFilterDrawer: toggleFilterDrawerDisplay,

  // #withARAgingSummary
  isFilterDrawerOpen,
}) {
  // Validation schema.
  const validationSchema = getARAgingSummaryQuerySchema();

  // Initial values.
  const defaultValues = getDefaultARAgingSummaryQuery();

  // Initial values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      asDate: moment(pageFilter.asDate).toDate(),
    },
    defaultValues,
  );
  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    toggleFilterDrawerDisplay(false);
    setSubmitting(false);
  };
  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleFilterDrawerDisplay(false);
  };
  // Handle the drawer close.
  const handleDrawerClose = () => {
    toggleFilterDrawerDisplay(false);
  };
  // Detarmines the feature whether is enabled.
  const { featureCan } = useFeatureCan();
  const isBranchesFeatureCan = featureCan(Features.Branches);

  return (
    <ARAgingDrawerHeader
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
              panel={<ARAgingSummaryHeaderGeneral />}
            />
            {isBranchesFeatureCan && (
              <Tab
                id="dimensions"
                title={<T id={'dimensions'} />}
                panel={<ARAgingSummaryHeaderDimensions />}
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
    </ARAgingDrawerHeader>
  );
}

export default compose(
  withARAgingSummaryActions,
  withARAgingSummary(({ ARAgingSummaryFilterDrawer }) => ({
    isFilterDrawerOpen: ARAgingSummaryFilterDrawer,
  })),
)(ARAgingSummaryHeader);

const ARAgingDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 520px;
  }
`;
