// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import moment from 'moment';
import { first } from 'lodash';

import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
  transactionNumber,
  orderingLinesIndexes,
  formattedAmount,
  toSafeNumber,
} from '@/utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';
import { useFormikContext } from 'formik';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';
import { useCurrentOrganization } from '@/hooks/state';
import { getEntriesTotal } from '@/containers/Entries/utils';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';

export const MIN_LINES_NUMBER = 1;

// Default Vendors Credit Note entry.
export const defaultCreditNoteEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

// Default Vendors Credit Note.
export const defaultVendorsCreditNote = {
  vendor_id: '',
  vendor_credit_number: '',
  vendor_credit_no_manually: false,
  open: '',
  vendor_credit_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  note: '',
  branch_id: '',
  warehouse_id: '',
  exchange_rate: 1,
  currency_code: '',
  entries: [...repeatValue(defaultCreditNoteEntry, MIN_LINES_NUMBER)],
  attachments: [],
  discount: '',
  discount_type: 'amount',
  adjustment: '',
};

/**
 * Transformes the credit note to initial values of edit form.
 */
export const transformToEditForm = (creditNote) => {
  const initialEntries = [
    ...creditNote.entries.map((entry) => ({
      ...transformToForm(entry, defaultCreditNoteEntry),
    })),
    ...repeatValue(
      defaultCreditNoteEntry,
      Math.max(MIN_LINES_NUMBER - creditNote.entries.length, 0),
    ),
  ];
  const entries = R.compose(
    ensureEntriesHaveEmptyLine(defaultCreditNoteEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  const attachments = transformAttachmentsToForm(creditNote);

  return {
    ...transformToForm(creditNote, defaultVendorsCreditNote),
    entries,
    attachments,
  };
};

/**
 * Transformes credit note entries to submit request.
 */
export const transformEntriesToSubmit = (entries) => {
  const transformCreditNoteEntry = R.compose(
    R.omit(['amount']),
    R.curry(transformToForm)(R.__, defaultCreditNoteEntry),
  );
  return R.compose(
    orderingLinesIndexes,
    R.map(transformCreditNoteEntry),
  )(entries);
};

/**
 * Filters the givne non-zero entries.
 */
export const filterNonZeroEntries = (entries) => {
  return entries.filter((item) => item.item_id && item.quantity);
};

/**
 * Transformes form values to request body.
 */
export const transformFormValuesToRequest = (values) => {
  const entries = filterNonZeroEntries(values.entries);
  const attachments = transformAttachmentsToRequest(values);

  return {
    ...values,
    entries: transformEntriesToSubmit(entries),
    open: false,
    attachments,
  };
};

/**
 * Detarmines vendors fast field should update
 */
export const vendorsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.items !== oldProps.shouldUpdateDeps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines entries fast field should update.
 */
export const entriesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Syncs invoice no. settings with form.
 */
export const useObserveVendorCreditNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const creditNo = transactionNumber(prefix, nextNumber);
    setFieldValue('vendor_credit_number', creditNo);
  }, [setFieldValue, prefix, nextNumber]);
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useVendorCreditNoteFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { warehouses, isWarehousesSuccess } = useVendorCreditNoteFormContext();

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

/**
 * Retrieves the vendor credit subtotal.
 * @returns {number}
 */
export const useVendorCreditSubtotal = () => {
  const {
    values: { entries },
  } = useFormikContext();

  // Retrieves the invoice entries total.
  const total = React.useMemo(() => getEntriesTotal(entries), [entries]);

  return total;
};

/**
 * Retrieves the vendor credit discount amount.
 * @returns {number}
 */
export const useVendorCreditDiscountAmount = () => {
  const { values } = useFormikContext();
  const subtotal = useVendorCreditSubtotal();
  const discount = toSafeNumber(values.discount);

  return values.discount_type === 'percentage'
    ? (subtotal * discount) / 100
    : discount;
};

/**
 * Retrieves the vendor credit discount amount formatted.
 * @returns {string}
 */
export const useVendorCreditDiscountAmountFormatted = () => {
  const discountAmount = useVendorCreditDiscountAmount();
  const {
    values: { currency_code: currencyCode },
  } = useFormikContext();

  return formattedAmount(discountAmount, currencyCode);
};

/**
 * Retrieves the vendor credit adjustment amount.
 * @returns {number}
 */
export const useVendorCreditAdjustment = () => {
  const { values } = useFormikContext();

  return toSafeNumber(values.adjustment);
};

/**
 * Retrieves the vendor credit adjustment amount formatted.
 * @returns {string}
 */
export const useVendorCreditAdjustmentAmountFormatted = () => {
  const adjustmentAmount = useVendorCreditAdjustment();
  const {
    values: { currency_code: currencyCode },
  } = useFormikContext();

  return formattedAmount(adjustmentAmount, currencyCode);
};

/**
 * Retrieves the vendor credit total.
 * @returns {number}
 */
export const useVendorCreditTotal = () => {
  const subtotal = useVendorCreditSubtotal();
  const discountAmount = useVendorCreditDiscountAmount();
  const adjustment = useVendorCreditAdjustment();

  return R.compose(
    R.subtract(R.__, discountAmount),
    R.add(R.__, adjustment),
  )(subtotal);
};

/**
 * Retrieves the vendor credit total formatted.
 * @returns {string}
 */
export const useVendorCreditTotalFormatted = () => {
  const total = useVendorCreditTotal();
  const {
    values: { currency_code: currencyCode },
  } = useFormikContext();

  return formattedAmount(total, currencyCode);
};

/**
 * Retrieves the vendor credit formatted subtotal.
 * @returns {string}
 */
export const useVendorCreditFormattedSubtotal = () => {
  const subtotal = useVendorCreditSubtotal();
  const currencyCode = useCurrentOrganizationCurrencyCode();

  return formattedAmount(subtotal, currencyCode);
};

/**
 * Retrieves the vendor credit formatted subtotal.
 * @returns {string}
 */
export const useVendorCreditSubtotalFormatted = () => {
  const subtotal = useVendorCreditSubtotal();
  const {
    values: { currency_code: currencyCode },
  } = useFormikContext();

  return formattedAmount(subtotal, currencyCode);
};

/**
 * Detarmines whether the vendor note has foreign customer.
 * @returns {boolean}
 */
export const useVendorNoteIsForeignCustomer = () => {
  const { values } = useFormikContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignCustomer = React.useMemo(
    () => values.currency_code !== currentOrganization.base_currency,
    [values.currency_code, currentOrganization.base_currency],
  );
  return isForeignCustomer;
};
