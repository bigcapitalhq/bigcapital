// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { omit, first } from 'lodash';
import {
  compose,
  transformToForm,
  repeatValue,
  transactionNumber,
} from '@/utils';
import { useFormikContext } from 'formik';

import { formattedAmount, defaultFastFieldShouldUpdate } from '@/utils';
import { ERROR } from '@/constants/errors';
import { AppToaster } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import { getEntriesTotal } from '@/containers/Entries/utils';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';

export const MIN_LINES_NUMBER = 1;

// Default invoice entry object.
export const defaultInvoiceEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

// Default invoice object.
export const defaultInvoice = {
  customer_id: '',
  invoice_date: moment(new Date()).format('YYYY-MM-DD'),
  due_date: moment().format('YYYY-MM-DD'),
  delivered: '',
  invoice_no: '',
  // Holds the invoice number that entered manually only.
  invoice_no_manually: '',
  reference_no: '',
  invoice_message: '',
  terms_conditions: '',
  exchange_rate: 1,
  currency_code: '',
  branch_id: '',
  warehouse_id: '',
  project_id: '',
  entries: [...repeatValue(defaultInvoiceEntry, MIN_LINES_NUMBER)],
};

/**
 * Transform invoice to initial values in edit mode.
 */
export function transformToEditForm(invoice) {
  const initialEntries = [
    ...invoice.entries.map((invoice) => ({
      ...transformToForm(invoice, defaultInvoiceEntry),
    })),
    ...repeatValue(
      defaultInvoiceEntry,
      Math.max(MIN_LINES_NUMBER - invoice.entries.length, 0),
    ),
  ];
  const entries = compose(
    ensureEntriesHaveEmptyLine(defaultInvoiceEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...transformToForm(invoice, defaultInvoice),
    entries,
  };
}

/**
 * Transforms the response errors types.
 */
export const transformErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === ERROR.SALE_INVOICE_NUMBER_IS_EXISTS)) {
    setErrors({
      invoice_no: intl.get('sale_invoice_number_is_exists'),
    });
  }
  if (
    errors.some(
      ({ type }) =>
        type === ERROR.SALE_ESTIMATE_IS_ALREADY_CONVERTED_TO_INVOICE,
    )
  ) {
    AppToaster.show({
      message: intl.get('sale_estimate_is_already_converted_to_invoice'),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.some((error) => error.type === ERROR.SALE_INVOICE_NO_IS_REQUIRED)
  ) {
    setErrors({
      invoice_no: intl.get('invoice.field.error.invoice_no_required'),
    });
  }
};

/**
 * Determines customer name field when should update.
 */
export const customerNameFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.items !== oldProps.shouldUpdateDeps.items||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Determines invoice entries field when should update.
 */
export const entriesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const ITEMS_FILTER_ROLES_QUERY = JSON.stringify([
  {
    index: 1,
    fieldKey: 'sellable',
    value: true,
    condition: '&&',
    comparator: 'equals',
  },
  {
    index: 2,
    fieldKey: 'active',
    value: true,
    condition: '&&',
    comparator: 'equals',
  },
]);

/**
 * Transforms the form values to request body values.
 */
export function transformValueToRequest(values) {
  const entries = values.entries.filter(
    (item) => item.item_id && item.quantity,
  );
  return {
    ...omit(values, ['invoice_no', 'invoice_no_manually']),
    // The `invoice_no_manually` will be presented just if the auto-increment
    // is disable, always both attributes hold the same value in manual mode.
    ...(values.invoice_no_manually && {
      invoice_no: values.invoice_no,
    }),
    entries: entries.map((entry) => ({ ...omit(entry, ['amount']) })),
    delivered: false,
  };
}

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { warehouses, isWarehousesSuccess } = useInvoiceFormContext();

  React.useEffect(() => {
    if (isWarehousesSuccess) {
      const primaryWarehouse =
        warehouses.find((b) => b.primary) || first(warehouses);

      if (primaryWarehouse) {
        setFieldValue('warehouse_id', primaryWarehouse.id);
      }
    }
  }, [isWarehousesSuccess, setFieldValue, warehouses]);
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useInvoiceFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export const useInvoiceTotal = () => {
  const {
    values: { entries },
  } = useFormikContext();

  // Calculate the total due amount of invoice entries.
  return React.useMemo(() => getEntriesTotal(entries), [entries]);
};

/**
 * Retrieves the invoice totals.
 */
export const useInvoiceTotals = () => {
  const {
    values: { entries, currency_code: currencyCode },
  } = useFormikContext();

  // Retrieves the invoice entries total.
  const total = React.useMemo(() => getEntriesTotal(entries), [entries]);

  // Retrieves the formatted total money.
  const formattedTotal = React.useMemo(
    () => formattedAmount(total, currencyCode),
    [total, currencyCode],
  );
  // Retrieves the formatted subtotal.
  const formattedSubtotal = React.useMemo(
    () => formattedAmount(total, currencyCode, { money: false }),
    [total, currencyCode],
  );
  // Retrieves the payment total.
  const paymentTotal = React.useMemo(() => 0, []);

  // Retrieves the formatted payment total.
  const formattedPaymentTotal = React.useMemo(
    () => formattedAmount(paymentTotal, currencyCode),
    [paymentTotal, currencyCode],
  );
  // Retrieves the formatted due total.
  const dueTotal = React.useMemo(
    () => total - paymentTotal,
    [total, paymentTotal],
  );
  // Retrieves the formatted due total.
  const formattedDueTotal = React.useMemo(
    () => formattedAmount(dueTotal, currencyCode),
    [dueTotal, currencyCode],
  );

  return {
    total,
    paymentTotal,
    dueTotal,
    formattedTotal,
    formattedSubtotal,
    formattedPaymentTotal,
    formattedDueTotal,
  };
};

/**
 * Determines whether the invoice has foreign customer.
 * @returns {boolean}
 */
export const useInvoiceIsForeignCustomer = () => {
  const { values } = useFormikContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignCustomer = React.useMemo(
    () => values.currency_code !== currentOrganization.base_currency,
    [values.currency_code, currentOrganization.base_currency],
  );
  return isForeignCustomer;
};

export const resetFormState = ({ initialValues, values, resetForm }) => {
  resetForm({
    values: {
      // Reset the all values except the warehouse and brand id.
      ...initialValues,
      warehouse_id: values.warehouse_id,
      brand_id: values.brand_id,
    },
  });
};
