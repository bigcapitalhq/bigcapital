// @ts-nocheck
import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import FinancialStatementHeader from '../FinancialStatementHeader';
import SalesByItemsHeaderGeneralPanel from './SalesByItemsHeaderGeneralPanel';

import withSalesByItems from './withSalesByItems';
import withSalesByItemsActions from './withSalesByItemsActions';

import { compose } from '@/utils';

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
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('from_date')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('to_date')),
  });

  // Initial values.
  const initialValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate(),
    toDate: moment(pageFilter.toDate).toDate(),
  };

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
  .bp3-drawer {
    max-height: 450px;
  }
`;
