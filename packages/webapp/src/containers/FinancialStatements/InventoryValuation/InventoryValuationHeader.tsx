import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { InventoryValuationHeaderDimensionsPanel } from './InventoryValuationHeaderDimensionsPanel';
import { InventoryValuationHeaderGeneralPanel } from './InventoryValuationHeaderGeneralPanel';
import {
  getInventoryValuationQuery,
  getInventoryValuationQuerySchema,
} from './utils';
import {
  withInventoryValuation,
  WithInventoryValuationProps,
} from './withInventoryValuation';
import {
  withInventoryValuationActions,
  WithInventoryValuationActionsProps,
} from './withInventoryValuationActions';
import type { FormikHelpers } from 'formik';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { FinancialStatementHeader } from '@/containers/FinancialStatements/FinancialStatementHeader';
import { useFeatureCan } from '@/hooks/state';
import { compose, transformToForm } from '@/utils';

type InventoryValuationFormValues = Omit<
  ReturnType<typeof getInventoryValuationQuery>,
  'asDate'
> & {
  asDate: Date;
};

interface InventoryValuationHeaderOwnProps {
  onSubmitFilter: (values: InventoryValuationFormValues) => void;
  pageFilter: ReturnType<typeof getInventoryValuationQuery>;
}

type InventoryValuationHeaderProps = InventoryValuationHeaderOwnProps &
  Pick<WithInventoryValuationProps, 'inventoryValuationDrawerFilter'> &
  Pick<
    WithInventoryValuationActionsProps,
    'toggleInventoryValuationFilterDrawer'
  >;

/**
 * inventory valuation header.
 */
function InventoryValuationHeaderInner({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withInventoryValuation
  inventoryValuationDrawerFilter,

  // #withInventoryValuationActions
  toggleInventoryValuationFilterDrawer,
}: InventoryValuationHeaderProps) {
  // Form validation schema.
  const validationSchema = getInventoryValuationQuerySchema();
  const defaultQuery = getInventoryValuationQuery();

  // Initial values.
  const initialValues = transformToForm(
    {
      ...defaultQuery,
      ...pageFilter,
      asDate: moment(pageFilter.asDate).toDate(),
    },
    defaultQuery,
  ) as InventoryValuationFormValues;

  // Handle the form of header submit.
  const handleSubmit = (
    values: InventoryValuationFormValues,
    actions: FormikHelpers<InventoryValuationFormValues>,
  ) => {
    onSubmitFilter(values);
    toggleInventoryValuationFilterDrawer(false);
    actions.setSubmitting(false);
  };
  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleInventoryValuationFilterDrawer(false);
  };
  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleInventoryValuationFilterDrawer(false);
  };
  // Detarmines the given feature whether is enabled.
  const { featureCan } = useFeatureCan();

  // Detarmine if these feature are enabled.
  const isBranchesFeatureCan = featureCan(Features.Branches);
  const isWarehousesFeatureCan = featureCan(Features.Warehouses);

  return (
    <InventoryValuationDrawerHeader
      isOpen={!!inventoryValuationDrawerFilter}
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
              panel={<InventoryValuationHeaderGeneralPanel />}
            />
            {(isBranchesFeatureCan || isWarehousesFeatureCan) && (
              <Tab
                id="dimensions"
                title={<T id={'dimensions'} />}
                panel={<InventoryValuationHeaderDimensionsPanel />}
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
    </InventoryValuationDrawerHeader>
  );
}

export const InventoryValuationHeader = compose(
  withInventoryValuation(({ inventoryValuationDrawerFilter }) => ({
    inventoryValuationDrawerFilter,
  })),
  withInventoryValuationActions,
)(InventoryValuationHeaderInner);

const InventoryValuationDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
