// @ts-nocheck
import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import FinancialStatementHeader from '../FinancialStatementHeader';
import SalesByItemsHeaderGeneralPanel from './SalesByItemsHeaderGeneralPanel';

import withSalesByItems from './withSalesByItems';
import withSalesByItemsActions from './withSalesByItemsActions';

import { compose, transformToForm } from '@/utils';
import {
  getDefaultSalesByItemsQuery,
  getSalesByItemsQueryShema,
} from './utils';

/**
 * Sales by items header.
 */
function SalesByItemsHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withSalesByItems
  salesByItemsDrawerFilter,

  // #withSalesByItemsActions
  toggleSalesByItemsFilterDrawer,
}) {
  // Form validation schema.
  const validationSchema = getSalesByItemsQueryShema();

  const defaultQuery = getDefaultSalesByItemsQuery();

  // Initial values.
  const initialValues = transformToForm(
    {
      ...defaultQuery,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultQuery,
  );

  // Handle the form submitting.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    setSubmitting(false);
    toggleSalesByItemsFilterDrawer(false);
  };

  // Handle drawer close action.
  const handleDrawerClose = () => {
    toggleSalesByItemsFilterDrawer(false);
  };

  // Handle cancel button click.
  const handleCancelClick = () => {
    toggleSalesByItemsFilterDrawer(false);
  };

  return (
    <SalesByItemsDrawerHeader
      isOpen={salesByItemsDrawerFilter}
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
              panel={<SalesByItemsHeaderGeneralPanel />}
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
    </SalesByItemsDrawerHeader>
  );
}

export default compose(
  withSalesByItems(({ salesByItemsDrawerFilter }) => ({
    salesByItemsDrawerFilter,
  })),
  withSalesByItemsActions,
)(SalesByItemsHeader);

const SalesByItemsDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
