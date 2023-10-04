// @ts-nocheck
import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import { FormattedMessage as T } from '@/components';
import FinancialStatementHeader from '@/containers/FinancialStatements/FinancialStatementHeader';
import PurchasesByItemsGeneralPanel from './PurchasesByItemsGeneralPanel';

import withPurchasesByItems from './withPurchasesByItems';
import withPurchasesByItemsActions from './withPurchasesByItemsActions';

import { compose, transformToForm } from '@/utils';
import {
  getDefaultPurchasesByItemsQuery,
  getPurchasesByItemsQuerySchema,
} from './utils';

/**
 * Purchases by items header.
 */
function PurchasesByItemsHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withPurchasesByItems
  purchasesByItemsDrawerFilter,

  // #withPurchasesByItems
  togglePurchasesByItemsFilterDrawer,
}) {
  // Form validation schema.
  const validationSchema = getPurchasesByItemsQuerySchema();

  const defaultQuery = getDefaultPurchasesByItemsQuery();

  // Initial form values.
  const initialValues = transformToForm(
    {
      ...defaultQuery,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultQuery,
  );
  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    setSubmitting(false);
    togglePurchasesByItemsFilterDrawer(false);
  };
  // Handle drawer close & cancel action.
  const handleDrawerClose = () => {
    togglePurchasesByItemsFilterDrawer(false);
  };

  return (
    <PurchasesByItemsDrawerHeader
      isOpen={purchasesByItemsDrawerFilter}
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
              panel={<PurchasesByItemsGeneralPanel />}
            />
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
    </PurchasesByItemsDrawerHeader>
  );
}

export default compose(
  withPurchasesByItems(({ purchasesByItemsDrawerFilter }) => ({
    purchasesByItemsDrawerFilter,
  })),
  withPurchasesByItemsActions,
)(PurchasesByItemsHeader);

const PurchasesByItemsDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
