import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { SalesByItemsHeaderGeneralPanel } from './SalesByItemsHeaderGeneralPanel';
import {
  getDefaultSalesByItemsQuery,
  getSalesByItemsQueryShema,
} from './utils';
import { withSalesByItems } from './withSalesByItems';
import {
  withSalesByItemsActions,
  WithSalesByItemsActionsProps,
} from './withSalesByItemsActions';
import { FormattedMessage as T } from '@/components';
import { compose, transformToForm } from '@/utils';

interface SalesByItemsFormValues {
  fromDate: Date;
  toDate: Date;
  filterByOption: string;
  itemsIds: string[];
  numberFormat?: Record<string, unknown>;
  [key: string]: unknown;
}

interface SalesByItemsHeaderOwnProps {
  pageFilter: Record<string, unknown>;
  onSubmitFilter: (filter: Record<string, unknown>) => void;
}

type SalesByItemsHeaderProps = SalesByItemsHeaderOwnProps & {
  salesByItemsDrawerFilter: boolean;
} & Pick<WithSalesByItemsActionsProps, 'toggleSalesByItemsFilterDrawer'>;

/**
 * Sales by items header.
 */
function SalesByItemsHeaderInner({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withSalesByItems
  salesByItemsDrawerFilter,

  // #withSalesByItemsActions
  toggleSalesByItemsFilterDrawer,
}: SalesByItemsHeaderProps) {
  // Form validation schema.
  const validationSchema = getSalesByItemsQueryShema();

  const defaultQuery = getDefaultSalesByItemsQuery();

  // Initial values.
  const initialValues = transformToForm(
    {
      ...defaultQuery,
      ...pageFilter,
      fromDate: moment(pageFilter.fromDate as string).toDate(),
      toDate: moment(pageFilter.toDate as string).toDate(),
    },
    defaultQuery,
  ) as SalesByItemsFormValues;

  // Handle the form submitting.
  const handleSubmit = (
    values: SalesByItemsFormValues,
    { setSubmitting }: FormikHelpers<SalesByItemsFormValues>,
  ) => {
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
    </SalesByItemsDrawerHeader>
  );
}

export const SalesByItemsHeader = compose(
  withSalesByItems(({ salesByItemsDrawerFilter }) => ({
    salesByItemsDrawerFilter,
  })),
  withSalesByItemsActions,
)(SalesByItemsHeaderInner);

const SalesByItemsDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
