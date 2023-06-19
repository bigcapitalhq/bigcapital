// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import withProjectProfitabilitySummary from './withProjectProfitabilitySummary';
import withProjectProfitabilitySummaryActions from './withProjectProfitabilitySummaryActions';

import ProjectProfitabilitySummaryHeaderGeneralPanel from './ProjectProfitabilitySummaryHeaderGeneralPanel';
import FinancialStatementHeader from '../FinancialStatementHeader';

import {
  getProjectProfitabilitySummaryValidationSchema,
  getDefaultProjectProfitabilitySummaryQuery,
} from './utils';
import { compose, transformToForm } from '@/utils';

/**
 * Project profitability summary header.
 */
function ProjectProfitabilitySummaryHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withProjectProfitabilitySummary
  isFilterDrawerOpen,

  // #withProjectProfitabilitySummaryActions
  toggleProjectProfitabilitySummaryFilterDrawer: toggleFilterDrawer,
}) {
  // Filter form default values.
  const defaultValues = getDefaultProjectProfitabilitySummaryQuery();

  // Filter form initial values.
  const initialValues = transformToForm(
    {
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
  );

  // Validation schema.
  const validationSchema = getProjectProfitabilitySummaryValidationSchema();

  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
    setSubmitting(false);
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
    <ProjectProfitabilityDrawerHeader
      isOpen={isFilterDrawerOpen}
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
              panel={<ProjectProfitabilitySummaryHeaderGeneralPanel />}
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
    </ProjectProfitabilityDrawerHeader>
  );
}

export default compose(
  withProjectProfitabilitySummary(
    ({ projectProfitabilitySummaryDrawerFilter }) => ({
      isFilterDrawerOpen: projectProfitabilitySummaryDrawerFilter,
    }),
  ),
  withProjectProfitabilitySummaryActions,
)(ProjectProfitabilitySummaryHeader);

const ProjectProfitabilityDrawerHeader = styled(FinancialStatementHeader)`
  .bp3-drawer {
    max-height: 520px;
  }
`;
