import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import styled from 'styled-components';
import { APAgingSummaryHeaderDimensions } from './APAgingSummaryHeaderDimensions';
import { APAgingSummaryHeaderGeneral } from './APAgingSummaryHeaderGeneral';
import {
  getAPAgingSummaryQuerySchema,
  getDefaultAPAgingSummaryQuery,
} from './common';
import { withAPAgingSummary } from './withAPAgingSummary';
import {
  withAPAgingSummaryActions,
  WithAPAgingSummaryActionsProps,
} from './withAPAgingSummaryActions';
import type { FormikHelpers } from 'formik';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { FinancialStatementHeader } from '@/containers/FinancialStatements/FinancialStatementHeader';
import { useFeatureCan } from '@/hooks/state';
import { transformToForm, compose } from '@/utils';

type APAgingSummaryFormValues = ReturnType<
  typeof getDefaultAPAgingSummaryQuery
>;

interface APAgingSummaryHeaderOwnProps {
  pageFilter: APAgingSummaryFormValues;
  onSubmitFilter: (values: APAgingSummaryFormValues) => void;
}

type APAgingSummaryHeaderProps = APAgingSummaryHeaderOwnProps & {
  isFilterDrawerOpen: boolean;
} & Pick<WithAPAgingSummaryActionsProps, 'toggleAPAgingSummaryFilterDrawer'>;

function APAgingSummaryHeaderInner({
  pageFilter,
  onSubmitFilter,
  toggleAPAgingSummaryFilterDrawer: toggleFilterDrawerDisplay,
  isFilterDrawerOpen,
}: APAgingSummaryHeaderProps) {
  const validationSchema = getAPAgingSummaryQuerySchema();
  const defaultValues = getDefaultAPAgingSummaryQuery();
  const initialValues = transformToForm(
    { ...defaultValues, ...pageFilter },
    defaultValues,
  ) as APAgingSummaryFormValues;

  const handleSubmit = (
    values: APAgingSummaryFormValues,
    { setSubmitting }: FormikHelpers<APAgingSummaryFormValues>,
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
    <APAgingDrawerHeader
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
              id={'general'}
              title={<T id={'general'} />}
              panel={<APAgingSummaryHeaderGeneral />}
            />
            {isBranchesFeatureCan && (
              <Tab
                id="dimensions"
                title={<T id={'dimensions'} />}
                panel={<APAgingSummaryHeaderDimensions />}
              />
            )}
          </Tabs>
          <div className={'financial-header-drawer__footer'}>
            <Button className={'mr1'} intent={Intent.PRIMARY} type={'submit'}>
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={handleCancelClick} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </APAgingDrawerHeader>
  );
}

export const APAgingSummaryHeader = compose(
  withAPAgingSummaryActions,
  withAPAgingSummary(({ APAgingSummaryFilterDrawer }) => ({
    isFilterDrawerOpen: APAgingSummaryFilterDrawer,
  })),
)(APAgingSummaryHeaderInner);

const APAgingDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 520px;
  }
`;
