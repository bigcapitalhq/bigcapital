import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { InventoryItemDetailsHeaderDimensionsPanel } from './InventoryItemDetailsHeaderDimensionsPanel';
import { InventoryItemDetailsHeaderGeneralPanel } from './InventoryItemDetailsHeaderGeneralPanel';
import {
  getInventoryItemDetailsDefaultQuery,
  getInventoryItemDetailsQuerySchema,
} from './utils2';
import {
  withInventoryItemDetails,
  WithInventoryItemDetailsProps,
} from './withInventoryItemDetails';
import {
  withInventoryItemDetailsActions,
  WithInventoryItemDetailsActionsProps,
} from './withInventoryItemDetailsActions';
import type { FormikHelpers } from 'formik';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { compose, transformToForm } from '@/utils';

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
  ) as InventoryItemDetailsFormValues;

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

export const InventoryItemDetailsHeader = compose(
  withInventoryItemDetails(({ inventoryItemDetailDrawerFilter }) => ({
    isFilterDrawerOpen: inventoryItemDetailDrawerFilter,
  })),
  withInventoryItemDetailsActions,
)(InventoryItemDetailsHeaderInner);

const InventoryItemDetailsDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 400px;
  }
`;
