import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import moment from 'moment';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { ProfitLossSheetHeaderComparisonPanel } from './ProfitLossSheetHeaderComparisonPanel';
import { ProfitLossSheetHeaderDimensionsPanel } from './ProfitLossSheetHeaderDimensionsPanel';
import { ProfitLossSheetHeaderGeneralPane } from './ProfitLossSheetHeaderGeneralPane';
import {
  useProfitLossHeaderValidationSchema,
  getDefaultProfitLossQuery,
} from './utils';
import { withProfitLoss, WithProfitLossProps } from './withProfitLoss';
import {
  withProfitLossActions,
  WithProfitLossActionsProps,
} from './withProfitLossActions';
import type { FormikHelpers } from 'formik';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { compose } from '@/utils';

type ProfitLossFormValues = ReturnType<typeof getDefaultProfitLossQuery>;

type FormValues = Partial<ProfitLossFormValues>;
interface ProfitLossSheetHeaderOwnProps {
  pageFilter: FormValues;
  onSubmitFilter: (values: FormValues) => void;
}

type ProfitLossSheetHeaderProps = ProfitLossSheetHeaderOwnProps &
  Pick<WithProfitLossProps, 'profitLossDrawerFilter'> &
  Pick<WithProfitLossActionsProps, 'toggleProfitLossFilterDrawer'>;

function ProfitLossSheetHeaderInner({
  pageFilter,
  onSubmitFilter,
  profitLossDrawerFilter,
  toggleProfitLossFilterDrawer: toggleFilterDrawer,
}: ProfitLossSheetHeaderProps) {
  const validationSchema = useProfitLossHeaderValidationSchema();

  const initialValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate().toString(),
    toDate: moment(pageFilter.toDate).toDate().toString(),
  } as FormValues;

  const handleSubmit = (
    values: FormValues,
    _actions: FormikHelpers<FormValues>,
  ) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
  };

  const handleCancelClick = () => {
    toggleFilterDrawer(false);
  };

  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };

  const { featureCan } = useFeatureCan();
  const isBranchesFeatureCan = featureCan(Features.Branches);

  return (
    <ProfitLossSheetHeaderStyled
      isOpen={profitLossDrawerFilter}
      drawerProps={{ onClose: handleDrawerClose }}
    >
      <Formik<FormValues>
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
            {isBranchesFeatureCan && (
              <Tab
                id="dimensions"
                title={<T id={'profit_loss_sheet.dimensions'} />}
                panel={<ProfitLossSheetHeaderDimensionsPanel />}
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
    </ProfitLossSheetHeaderStyled>
  );
}

export const ProfitLossSheetHeader = compose(
  withProfitLoss(({ profitLossDrawerFilter }) => ({
    profitLossDrawerFilter,
  })),
  withProfitLossActions,
)(ProfitLossSheetHeaderInner);

const ProfitLossSheetHeaderStyled = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 520px;
  }
`;
