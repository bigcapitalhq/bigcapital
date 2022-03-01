import React from 'react';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { omit, first } from 'lodash';
import {
  compose,
  transformToForm,
  repeatValue,
  transactionNumber,
} from 'utils';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { defaultFastFieldShouldUpdate } from 'utils';
import { ERROR } from 'common/errors';
import { AppToaster } from 'components';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from 'containers/Entries/utils';

export const MIN_LINES_NUMBER = 4;

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
  invoice_no_manually: false,
  reference_no: '',
  invoice_message: '',
  terms_conditions: '',
  exchange_rate: 1,
  currency_code: '',
  branch_id: '',
  warehouse_id: '',
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
 * Transformes the response errors types.
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
 * Syncs invoice no. settings with form.
 */
export const useObserveInvoiceNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const invoiceNo = transactionNumber(prefix, nextNumber);
    setFieldValue('invoice_no', invoiceNo);
  }, [setFieldValue, prefix, nextNumber]);
};

/**
 * Detarmines customer name field when should update.
 */
export const customerNameFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.customers !== oldProps.customers ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines invoice entries field when should update.
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
 * Transformes the form values to request body values.
 */
export function transformValueToRequest(values) {
  const entries = values.entries.filter(
    (item) => item.item_id && item.quantity,
  );
  return {
    ...omit(values, ['invoice_no', 'invoice_no_manually']),
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

export const useSetForeignCurrencyToEditForm = () => {
  const { values } = useFormikContext();
  const { isNewMode, setSelectCustomer } = useInvoiceFormContext();

  React.useEffect(() => {
    if (!isNewMode) {
      setSelectCustomer({ currency_code: values.currency_code });
    }
  }, [isNewMode, setSelectCustomer, values]);
};
