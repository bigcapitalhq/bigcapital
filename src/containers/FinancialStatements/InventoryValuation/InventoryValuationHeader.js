import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { FormattedMessage as T } from 'components';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import InventoryValuationHeaderGeneralPanel from './InventoryValuationHeaderGeneralPanel';
import InventoryValuationHeaderDimensionsPanel from './InventoryValuationHeaderDimensionsPanel';
import withInventoryValuation from './withInventoryValuation';
import withInventoryValuationActions from './withInventoryValuationActions';

import { compose, transformToForm } from 'utils';

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
      ...pageFilter,
      ...defaultValues,
      asDate: moment(pageFilter.asDate).toDate(),
      warehousesIds: [],
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

  return (
    <FinancialStatementHeader
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
            <Tab
              id="dimensions"
              title={<T id={'dimensions'} />}
              panel={<InventoryValuationHeaderDimensionsPanel />}
            />
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
    </FinancialStatementHeader>
  );
}

export default compose(
  withInventoryValuation(({ inventoryValuationDrawerFilter }) => ({
    isFilterDrawerOpen: inventoryValuationDrawerFilter,
  })),
  withInventoryValuationActions,
)(InventoryValuationHeader);
