import React from 'react';

import moment from 'moment';
import { Formik, Form } from 'formik';
import type { FormikHelpers } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import styled from 'styled-components';

import { FormattedMessage as T } from '@/components';

import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { InventoryItemDetailsHeaderGeneralPanel } from './InventoryItemDetailsHeaderGeneralPanel';
import { InventoryItemDetailsHeaderDimensionsPanel } from './InventoryItemDetailsHeaderDimensionsPanel';

import {
  withInventoryItemDetails,
  WithInventoryItemDetailsProps,
} from './withInventoryItemDetails';
import {
  withInventoryItemDetailsActions,
  WithInventoryItemDetailsActionsProps,
} from './withInventoryItemDetailsActions';

import {
  getInventoryItemDetailsDefaultQuery,
  getInventoryItemDetailsQuerySchema,
} from './utils2';
import { transformToForm } from '@/utils';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';
import { flow } from 'fp-ts/function';

type InventoryItemDetailsFormValues = Omit<
  ReturnType<typeof getInventoryItemDetailsDefaultQuery>,
  'fromDate' | 'toDate'
> & {
  fromDate: Date;
  toDate: Date;
};

interface InventoryItemDetailsHeaderOwnProps {
  onSubmitFilter: (values: InventoryItemDetailsFormValues) => void;
  pageFilter: ReturnType<typeof getInventoryItemDetailsDefaultQuery>;
}

type InventoryItemDetailsHeaderProps = InventoryItemDetailsHeaderOwnProps &
  Pick<WithInventoryItemDetailsProps, 'inventoryItemDetailDrawerFilter'> &
  Pick<
    WithInventoryItemDetailsActionsProps,
    'toggleInventoryItemDetailsFilterDrawer'
  >;

/**
 * Inventory item details header.
 */
function InventoryItemDetailsHeaderInner({
  // #ownProps
  onSubmitFilter,
  pageFilter,

  // #withInventoryItemDetails
  inventoryItemDetailDrawerFilter,

  // #withInventoryItemDetailsActions
  toggleInventoryItemDetailsFilterDrawer: toggleFilterDrawer,
}: InventoryItemDetailsHeaderProps) {
  // Default form values.
  const defaultValues = getInventoryItemDetailsDefaultQuery();

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
  const validationSchema = getInventoryItemDetailsQuerySchema();

  // Handle form submit.
  const handleSubmit = (
    values: InventoryItemDetailsFormValues,
    actions: FormikHelpers<InventoryItemDetailsFormValues>,
  ) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
    actions.setSubmitting(false);
  };

  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };

  // Detarmines the given feature whether is enabled.
  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);
  const isWarehousesFeatureCan = featureCan(Features.Warehouses);

  return (
    <InventoryItemDetailsDrawerHeader
      isOpen={!!inventoryItemDetailDrawerFilter}
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
              panel={<InventoryItemDetailsHeaderGeneralPanel />}
            />
            {(isBranchesFeatureCan || isWarehousesFeatureCan) && (
              <Tab
                id="dimensions"
                title={<T id={'dimensions'} />}
                panel={<InventoryItemDetailsHeaderDimensionsPanel />}
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
    </InventoryItemDetailsDrawerHeader>
  );
}

export const InventoryItemDetailsHeader = flow(
  withInventoryItemDetailsActions,
  withInventoryItemDetails(({ inventoryItemDetailDrawerFilter }) => ({
    isFilterDrawerOpen: inventoryItemDetailDrawerFilter,
  })),
)(InventoryItemDetailsHeaderInner);

const InventoryItemDetailsDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 400px;
  }
`;
