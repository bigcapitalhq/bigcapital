import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { FormattedMessage as T } from '@/components';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FinancialStatementHeader } from '@/containers/FinancialStatements/FinancialStatementHeader';
import { ARAgingSummaryHeaderGeneral } from './ARAgingSummaryHeaderGeneral';
import { ARAgingSummaryHeaderDimensions } from './ARAgingSummaryHeaderDimensions';
import { withARAgingSummary } from './withARAgingSummary';
import {
  withARAgingSummaryActions,
  WithARAgingSummaryActionsProps,
} from './withARAgingSummaryActions';
import { transformToForm } from '@/utils';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';
import {
  getARAgingSummaryQuerySchema,
  getDefaultARAgingSummaryQuery,
} from './common';
import type { FormikHelpers } from 'formik';
import { flow } from 'fp-ts/function';

type ARAgingSummaryFormValues = ReturnType<
  typeof getDefaultARAgingSummaryQuery
>;

interface ARAgingSummaryHeaderOwnProps {
  pageFilter: ARAgingSummaryFormValues;
  onSubmitFilter: (values: ARAgingSummaryFormValues) => void;
}

type ARAgingSummaryHeaderProps = ARAgingSummaryHeaderOwnProps & {
  isFilterDrawerOpen: boolean;
} & Pick<WithARAgingSummaryActionsProps, 'toggleARAgingSummaryFilterDrawer'>;

function ARAgingSummaryHeaderInner({
  pageFilter,
  onSubmitFilter,
  toggleARAgingSummaryFilterDrawer: toggleFilterDrawerDisplay,
  isFilterDrawerOpen,
}: ARAgingSummaryHeaderProps) {
  const validationSchema = getARAgingSummaryQuerySchema();
  const defaultValues = getDefaultARAgingSummaryQuery();

  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      asDate: moment(pageFilter.asDate).toDate(),
    },
    defaultValues,
  ) as ARAgingSummaryFormValues;

  const handleSubmit = (
    values: ARAgingSummaryFormValues,
    { setSubmitting }: FormikHelpers<ARAgingSummaryFormValues>,
  ) => {
    onSubmitFilter(values);
    toggleFilterDrawerDisplay(false);
    setSubmitting(false);
  };

  const handleCancelClick = () => {
    toggleFilterDrawerDisplay(false);
  };

  const handleDrawerClose = () => {
    toggleFilterDrawerDisplay(false);
  };

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
    </ARAgingDrawerHeader>
  );
}

export const ARAgingSummaryHeader = flow(
  withARAgingSummary(({ ARAgingSummaryFilterDrawer }) => ({
    isFilterDrawerOpen: ARAgingSummaryFilterDrawer,
  })),
  withARAgingSummaryActions,
)(ARAgingSummaryHeaderInner);

const ARAgingDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 520px;
  }
`;
