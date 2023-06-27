// @ts-nocheck
import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import { FormattedMessage as T } from '@/components';

import FinancialStatementHeader from '@/containers/FinancialStatements/FinancialStatementHeader';
import InventoryValuationHeaderGeneralPanel from './InventoryValuationHeaderGeneralPanel';
import InventoryValuationHeaderDimensionsPanel from './InventoryValuationHeaderDimensionsPanel';
import withInventoryValuation from './withInventoryValuation';
import withInventoryValuationActions from './withInventoryValuationActions';

import { compose, transformToForm } from '@/utils';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';

/**
 * inventory valuation header.
 */
function InventoryValuationHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withInventoryValuation
  isFilterDrawerOpen,

  // #withInventoryValuationActions
  toggleInventoryValuationFilterDrawer,
}) {
  // Form validation schema.
  const validationSchema = Yup.object().shape({
    asDate: Yup.date().required().label('asDate'),
  });

  // Default values.
  const defaultValues = {
    ...pageFilter,
    asDate: moment().toDate(),
    itemsIds: [],
    warehousesIds: [],
  };
  // Initial values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      asDate: moment(pageFilter.asDate).toDate(),
    },
    defaultValues,
  );

  // Handle the form of header submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    toggleInventoryValuationFilterDrawer(false);
    setSubmitting(false);
  };
  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleInventoryValuationFilterDrawer(false);
  };
  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleInventoryValuationFilterDrawer(false);
  };
  // Determines the given feature whether is enabled.
  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);
  const isWarehousesFeatureCan = featureCan(Features.Warehouses);

  return (
    <InventoryValuationDrawerHeader
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
          <div class="financial-header-drawer__footer">
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

export default compose(
  withInventoryValuation(({ inventoryValuationDrawerFilter }) => ({
    isFilterDrawerOpen: inventoryValuationDrawerFilter,
  })),
  withInventoryValuationActions,
)(InventoryValuationHeader);

const InventoryValuationDrawerHeader = styled(FinancialStatementHeader)`
  .bp3-drawer {
    max-height: 450px;
  }
`;
