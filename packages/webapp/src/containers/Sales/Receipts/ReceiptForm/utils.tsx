// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import * as R from 'ramda';
import { omit, first } from 'lodash';
import { useFormikContext } from 'formik';
import {
  defaultFastFieldShouldUpdate,
  transactionNumber,
  repeatValue,
  transformToForm,
  formattedAmount,
} from '@/utils';
import { useReceiptFormContext } from './ReceiptFormProvider';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';
import { useCurrentOrganization } from '@/hooks/state';
import { getEntriesTotal } from '@/containers/Entries/utils';

export const MIN_LINES_NUMBER = 1;

export const defaultReceiptEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

export const defaultReceipt = {
  customer_id: '',
  deposit_account_id: '',
  receipt_number: '',
  // Holds the receipt number that entered manually only.
  receipt_number_manually: '',
  receipt_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  receipt_message: '',
  statement: '',
  closed: '',
  branch_id: '',
  warehouse_id: '',
  exchange_rate: 1,
  currency_code: '',
  entries: [...repeatValue(defaultReceiptEntry, MIN_LINES_NUMBER)],
};

const ERRORS = {
  SALE_RECEIPT_NUMBER_NOT_UNIQUE: 'SALE_RECEIPT_NUMBER_NOT_UNIQUE',
  SALE_RECEIPT_NO_IS_REQUIRED: 'SALE_RECEIPT_NO_IS_REQUIRED',
};

/**
 * Transform to form in edit mode.
 */
export const transformToEditForm = (receipt) => {
  const initialEntries = [
    ...receipt.entries.map((entry) => ({
      ...transformToForm(entry, defaultReceiptEntry),
    })),
    ...repeatValue(
      defaultReceiptEntry,
      Math.max(MIN_LINES_NUMBER - receipt.entries.length, 0),
    ),
  ];
  const entries = R.compose(
    ensureEntriesHaveEmptyLine(defaultReceiptEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...transformToForm(receipt, defaultReceipt),
    entries,
  };
};

/**
 * Determines entries fast field should update.
 */
export const entriesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Determines accounts fast field should update.
 */
export const accountsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Determines customers fast field should update.
 */
export const customersFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.items !== oldProps.shouldUpdateDeps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Transform response error to fields.
 */
export const handleErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === ERRORS.SALE_RECEIPT_NUMBER_NOT_UNIQUE)) {
    setErrors({
      receipt_number: intl.get('sale_receipt_number_not_unique'),
    });
  }
  if (errors.some((e) => e.type === ERRORS.SALE_RECEIPT_NO_IS_REQUIRED)) {
    setErrors({
      receipt_number: intl.get('receipt.field.error.receipt_number_required'),
    });
  }
};

/**
 * Transforms the form values to request body.
 * @param {*} values
 * @returns
 */
export const transformFormValuesToRequest = (values) => {
  const entries = values.entries.filter(
    (item) => item.item_id && item.quantity,
  );

  return {
    ...omit(values, ['receipt_number_manually', 'receipt_number']),
    ...(values.receipt_number_manually && {
      receipt_number: values.receipt_number,
    }),
    entries: entries.map((entry) => ({ ...omit(entry, ['amount']) })),
    closed: false,
  };
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { warehouses, isWarehousesSuccess } = useReceiptFormContext();

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
  const { branches, isBranchesSuccess } = useReceiptFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

/**
 * Retrieves the Receipt totals.
 */
export const useReceiptTotals = () => {
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
 * Determines whether the receipt has foreign customer.
 * @returns {boolean}
 */
export const useReceiptIsForeignCustomer = () => {
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
