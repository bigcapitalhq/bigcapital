import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Formik, Form } from 'formik';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import styled from 'styled-components';

import { FormattedMessage as T } from '@/components';

import FinancialStatementHeader from '@/containers/FinancialStatements/FinancialStatementHeader';
import PurchasesByItemsGeneralPanel from './PurchasesByItemsGeneralPanel';

import withPurchasesByItems from './withPurchasesByItems';
import withPurchasesByItemsActions from './withPurchasesByItemsActions';

import { compose, transformToForm } from '@/utils';

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
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('from_date')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('to_date')),
  });
  // Default form values.
  const defaultValues = {
    ...pageFilter,
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
    itemsIds: [],
  };
  // Initial form values.
  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate).toDate(),
      toDate: moment(pageFilter.toDate).toDate(),
    },
    defaultValues,
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
  .bp3-drawer {
    max-height: 450px;
  }
`;
