import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import {
  getDefaultGeneralLedgerQuery,
  getGeneralLedgerQuerySchema,
} from './common';
import { GeneralLedgerHeaderDimensionsPanel } from './GeneralLedgerHeaderDimensionsPanel';
import { GLHeaderGeneralPane as GeneralLedgerHeaderGeneralPane } from './GeneralLedgerHeaderGeneralPane';
import { withGeneralLedger } from './withGeneralLedger';
import { withGeneralLedgerActions } from './withGeneralLedgerActions';
import type { WithGeneralLedgerProps } from './withGeneralLedger';
import type { WithGeneralLedgerActionsProps } from './withGeneralLedgerActions';
import type { FormikHelpers } from 'formik';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { compose, transformToForm } from '@/utils';

type GeneralLedgerFormValues = Omit<
  ReturnType<typeof getDefaultGeneralLedgerQuery>,
  'fromDate' | 'toDate'
> & {
  fromDate: Date;
  toDate: Date;
};

interface GeneralLedgerHeaderOwnProps {
  onSubmitFilter: (values: GeneralLedgerFormValues) => void;
  pageFilter: ReturnType<typeof getDefaultGeneralLedgerQuery>;
}

type GeneralLedgerHeaderProps = GeneralLedgerHeaderOwnProps &
  Pick<WithGeneralLedgerProps, 'generalLedgerFilterDrawer'> &
  Pick<WithGeneralLedgerActionsProps, 'toggleGeneralLedgerFilterDrawer'>;

/**
 * Geenral Ledger (GL) - Header.
 */
function GeneralLedgerHeaderInner({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withGeneralLedgerActions
  toggleGeneralLedgerFilterDrawer: toggleDisplayFilterDrawer,

  // #withGeneralLedger
  generalLedgerFilterDrawer,
}: GeneralLedgerHeaderProps) {
  // Default values.
  const defaultValues = getDefaultGeneralLedgerQuery();

  // Initial values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
  ) as GeneralLedgerFormValues;
  // Validation schema.
  const validationSchema = getGeneralLedgerQuerySchema();

  // Handle form submit.
  const handleSubmit = (
    values: GeneralLedgerFormValues,
    actions: FormikHelpers<GeneralLedgerFormValues>,
  ) => {
    onSubmitFilter(values);
    toggleDisplayFilterDrawer(false);
    actions.setSubmitting(false);
  };
  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleDisplayFilterDrawer(false);
  };
  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleDisplayFilterDrawer(false);
  };
  // Detarmines the feature whether is enabled.
  const { featureCan } = useFeatureCan();

  // Detarmine if the feature is enabled.
  const isBranchesFeatureCan = featureCan(Features.Branches);

  return (
    <GeneralLedgerDrawerHeader
      isOpen={generalLedgerFilterDrawer}
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
              panel={<GeneralLedgerHeaderGeneralPane />}
            />
            {isBranchesFeatureCan && (
              <Tab
                id="dimensions"
                title={<T id={'dimensions'} />}
                panel={<GeneralLedgerHeaderDimensionsPanel />}
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
    </GeneralLedgerDrawerHeader>
  );
}

export const GeneralLedgerHeader = compose(
  withGeneralLedger(({ generalLedgerFilterDrawer }) => ({
    generalLedgerFilterDrawer,
  })),
  withGeneralLedgerActions,
)(GeneralLedgerHeaderInner);

const GeneralLedgerDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 520px;
  }
`;
