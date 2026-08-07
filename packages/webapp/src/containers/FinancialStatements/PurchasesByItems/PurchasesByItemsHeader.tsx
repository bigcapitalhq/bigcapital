import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { PurchasesByItemsGeneralPanel } from './PurchasesByItemsGeneralPanel';
import {
  getDefaultPurchasesByItemsQuery,
  getPurchasesByItemsQuerySchema,
} from './utils';
import { withPurchasesByItems } from './withPurchasesByItems';
import {
  withPurchasesByItemsActions,
  WithPurchasesByItemsActionsProps,
} from './withPurchasesByItemsActions';
import { FormattedMessage as T } from '@/components';
import { FinancialStatementHeader } from '@/containers/FinancialStatements/FinancialStatementHeader';
import { compose, transformToForm } from '@/utils';

interface PurchasesByItemsFormValues {
  fromDate: Date;
  toDate: Date;
  filterByOption: string;
  itemsIds: string[];
  numberFormat?: Record<string, unknown>;
  [key: string]: unknown;
}

interface PurchasesByItemsHeaderOwnProps {
  pageFilter: Record<string, unknown>;
  onSubmitFilter: (filter: Record<string, unknown>) => void;
}

type PurchasesByItemsHeaderProps = PurchasesByItemsHeaderOwnProps & {
  purchasesByItemsDrawerFilter: boolean;
} & Pick<
    WithPurchasesByItemsActionsProps,
    'togglePurchasesByItemsFilterDrawer'
  >;

/**
 * Purchases by items header.
 */
function PurchasesByItemsHeaderInner({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withPurchasesByItems
  purchasesByItemsDrawerFilter,

  // #withPurchasesByItemsActions
  togglePurchasesByItemsFilterDrawer,
}: PurchasesByItemsHeaderProps) {
  // Form validation schema.
  const validationSchema = getPurchasesByItemsQuerySchema();

  const defaultQuery = getDefaultPurchasesByItemsQuery();

  // Initial form values.
  const initialValues = transformToForm(
    {
      ...defaultQuery,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate as string).toDate(),
      toDate: moment(pageFilter.toDate as string).toDate(),
    },
    defaultQuery,
  ) as PurchasesByItemsFormValues;

  // Handle form submit.
  const handleSubmit = (
    values: PurchasesByItemsFormValues,
    { setSubmitting }: FormikHelpers<PurchasesByItemsFormValues>,
  ) => {
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
    </PurchasesByItemsDrawerHeader>
  );
}

export const PurchasesByItemsHeader = compose(
  withPurchasesByItems(({ purchasesByItemsDrawerFilter }) => ({
    purchasesByItemsDrawerFilter,
  })),
  withPurchasesByItemsActions,
)(PurchasesByItemsHeaderInner);

const PurchasesByItemsDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
