import { Button, Intent, Tab, Tabs } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import * as FF from 'fp-ts/function';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { InventoryTurnoverByAmountHeaderDimensionsPanel } from './InventoryTurnoverByAmountHeaderDimensionsPanel';
import { InventoryTurnoverByAmountHeaderGeneralPanel } from './InventoryTurnoverByAmountHeaderGeneralPanel';
import {
  getInventoryTurnoverByAmountQuery,
  getInventoryTurnoverByAmountQuerySchema,
} from './utils';
import {
  withInventoryTurnoverByAmount,
  WithInventoryTurnoverByAmountProps,
} from './withInventoryTurnoverByAmount';
import {
  withInventoryTurnoverByAmountActions,
  WithInventoryTurnoverByAmountActionsProps,
} from './withInventoryTurnoverByAmountActions';
import type { FormikHelpers } from 'formik';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { transformToForm } from '@/utils';

type InventoryTurnoverByAmountFormValues = Omit<
  ReturnType<typeof getInventoryTurnoverByAmountQuery>,
  'fromDate' | 'toDate'
> & {
  fromDate: Date;
  toDate: Date;
};

interface InventoryTurnoverByAmountHeaderOwnProps {
  onSubmitFilter: (values: InventoryTurnoverByAmountFormValues) => void;
  pageFilter: ReturnType<typeof getInventoryTurnoverByAmountQuery>;
}

type InventoryTurnoverByAmountHeaderProps =
  InventoryTurnoverByAmountHeaderOwnProps &
    Pick<
      WithInventoryTurnoverByAmountProps,
      'inventoryTurnoverByAmountDrawerFilter'
    > &
    Pick<
      WithInventoryTurnoverByAmountActionsProps,
      'toggleInventoryTurnoverByAmountFilterDrawer'
    >;

/**
 * Inventory turnover by amount header.
 */
function InventoryTurnoverByAmountHeaderInner({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withInventoryTurnoverByAmount
  inventoryTurnoverByAmountDrawerFilter,

  // #withInventoryTurnoverByAmountActions
  toggleInventoryTurnoverByAmountFilterDrawer: toggleFilterDrawer,
}: InventoryTurnoverByAmountHeaderProps) {
  const defaultValues = getInventoryTurnoverByAmountQuery();

  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
  ) as InventoryTurnoverByAmountFormValues;

  const validationSchema = getInventoryTurnoverByAmountQuerySchema();

  const handleSubmit = (
    values: InventoryTurnoverByAmountFormValues,
    actions: FormikHelpers<InventoryTurnoverByAmountFormValues>,
  ) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
    actions.setSubmitting(false);
  };

  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };

  const { featureCan } = useFeatureCan();
  const isBranchesFeatureCan = featureCan(Features.Branches);
  const isWarehousesFeatureCan = featureCan(Features.Warehouses);

  return (
    <InventoryTurnoverByAmountDrawerHeader
      isOpen={!!inventoryTurnoverByAmountDrawerFilter}
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
              panel={<InventoryTurnoverByAmountHeaderGeneralPanel />}
            />
            {(isBranchesFeatureCan || isWarehousesFeatureCan) && (
              <Tab
                id="dimensions"
                title={<T id={'dimensions'} />}
                panel={<InventoryTurnoverByAmountHeaderDimensionsPanel />}
              />
            )}
          </Tabs>
          <div className="financial-header-drawer__footer">
            <Button className={'mr1'} intent={Intent.PRIMARY} type={'submit'}>
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={handleDrawerClose} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </InventoryTurnoverByAmountDrawerHeader>
  );
}

export const InventoryTurnoverByAmountHeader = FF.pipe(
  InventoryTurnoverByAmountHeaderInner,
  withInventoryTurnoverByAmountActions,
  withInventoryTurnoverByAmount(
    ({ inventoryTurnoverByAmountDrawerFilter }) => ({
      inventoryTurnoverByAmountDrawerFilter,
    }),
  ),
);

const InventoryTurnoverByAmountDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 400px;
  }
`;
