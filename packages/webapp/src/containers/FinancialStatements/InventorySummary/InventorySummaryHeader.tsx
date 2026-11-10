import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import * as FF from 'fp-ts/function';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { InventorySummaryHeaderDimensionsPanel } from './InventorySummaryHeaderDimensionsPanel';
import { InventorySummaryHeaderGeneralPanel } from './InventorySummaryHeaderGeneralPanel';
import {
  getDefaultInventorySummaryQuery,
  getInventorySummaryQueryShema,
} from './utils';
import { withInventorySummary } from './withInventorySummary';
import {
  withInventorySummaryActions,
  WithInventorySummaryActionsProps,
} from './withInventorySummaryActions';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { transformToForm } from '@/utils';

interface InventorySummaryFormValues {
  fromDate: Date;
  toDate: Date;
  filterByOption: string;
  itemsIds: string[];
  numberFormat?: Record<string, unknown>;
  [key: string]: unknown;
}

interface InventorySummaryHeaderOwnProps {
  pageFilter: Record<string, unknown>;
  onSubmitFilter: (filter: Record<string, unknown>) => void;
}

type InventorySummaryHeaderProps = InventorySummaryHeaderOwnProps & {
  inventorySummaryDrawerFilter: boolean;
} & Pick<
    WithInventorySummaryActionsProps,
    'toggleInventorySummaryFilterDrawer'
  >;

/**
 * Inventory summary header.
 */
function InventorySummaryHeaderInner({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withInventorySummary
  inventorySummaryDrawerFilter,

  // #withInventorySummaryActions
  toggleInventorySummaryFilterDrawer,
}: InventorySummaryHeaderProps) {
  // Form validation schema.
  const validationSchema = getInventorySummaryQueryShema();

  const defaultQuery = getDefaultInventorySummaryQuery();

  // Initial values.
  const initialValues = transformToForm(
    {
      ...defaultQuery,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate as string).toDate(),
      toDate: moment(pageFilter.toDate as string).toDate(),
    },
    defaultQuery,
  ) as InventorySummaryFormValues;

  // Handle the form submitting.
  const handleSubmit = (
    values: InventorySummaryFormValues,
    { setSubmitting }: FormikHelpers<InventorySummaryFormValues>,
  ) => {
    onSubmitFilter(values);
    setSubmitting(false);
    toggleInventorySummaryFilterDrawer(false);
  };

  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleInventorySummaryFilterDrawer(false);
  };

  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleInventorySummaryFilterDrawer(false);
  };

  // Detarmines the given feature whether is enabled.
  const { featureCan } = useFeatureCan();

  // Detarmine if these feature are enabled.
  const isBranchesFeatureCan = featureCan(Features.Branches);
  const isWarehousesFeatureCan = featureCan(Features.Warehouses);

  return (
    <InventorySummaryDrawerHeader
      isOpen={inventorySummaryDrawerFilter}
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
              panel={<InventorySummaryHeaderGeneralPanel />}
            />
            {(isBranchesFeatureCan || isWarehousesFeatureCan) && (
              <Tab
                id="dimensions"
                title={<T id={'dimensions'} />}
                panel={<InventorySummaryHeaderDimensionsPanel />}
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
    </InventorySummaryDrawerHeader>
  );
}

export const InventorySummaryHeader = FF.pipe(
  InventorySummaryHeaderInner,
  withInventorySummaryActions,
  withInventorySummary(({ inventorySummaryDrawerFilter }) => ({
    inventorySummaryDrawerFilter,
  })),
);

const InventorySummaryDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
