import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import InventoryValuationHeaderGeneralPanel from './InventoryValuationHeaderGeneralPanel';
import withInventoryValuation from './withInventoryValuation';
import withInventoryValuationActions from './withInventoryValuationActions';

import { compose } from 'utils';

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
  const { formatMessage } = useIntl();

  // Form validation schema.
  const validationSchema = Yup.object().shape({
    as_date: Yup.date().required().label('asDate'),
  });

  // Initial values.
  const initialValues = {
    as_date: moment(pageFilter.asDate).toDate(),
  };

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
