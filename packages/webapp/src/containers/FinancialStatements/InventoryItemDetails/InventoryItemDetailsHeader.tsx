// @ts-nocheck
import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { FormattedMessage as T } from '@/components';

import FinancialStatementHeader from '../FinancialStatementHeader';
import InventoryItemDetailsHeaderGeneralPanel from './InventoryItemDetailsHeaderGeneralPanel';
import InventoryItemDetailsHeaderDimensionsPanel from './InventoryItemDetailsHeaderDimensionsPanel';

import withInventoryItemDetails from './withInventoryItemDetails';
import withInventoryItemDetailsActions from './withInventoryItemDetailsActions';

import { getInventoryItemDetailsDefaultQuery } from './utils2';
import { compose, transformToForm } from '@/utils';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';

/**
 * Inventory item details header.
 */
function InventoryItemDetailsHeader({
  // #ownProps
  onSubmitFilter,
  pageFilter,
  // #withInventoryItemDetails
  isFilterDrawerOpen,

  // #withInventoryItemDetailsActions
  toggleInventoryItemDetailsFilterDrawer: toggleFilterDrawer,
}) {
  // Default form values.
  const defaultValues = getInventoryItemDetailsDefaultQuery();

  // Filter form initial values.
  const initialValues = transformToForm(
    {
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
  );
  // Validation schema.
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
  });
  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
    setSubmitting(false);
  };
  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };
  // Determines the given feature whether is enabled.
  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);
  const isWarehousesFeatureCan = featureCan(Features.Warehouses);

  return (
    <InventoryItemDetailsDrawerHeader
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
          <div class="financial-header-drawer__footer">
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

export default compose(
  withInventoryItemDetails(({ inventoryItemDetailDrawerFilter }) => ({
    isFilterDrawerOpen: inventoryItemDetailDrawerFilter,
  })),
  withInventoryItemDetailsActions,
)(InventoryItemDetailsHeader);

const InventoryItemDetailsDrawerHeader = styled(FinancialStatementHeader)`
  .bp3-drawer {
    max-height: 400px;
  }
`;
