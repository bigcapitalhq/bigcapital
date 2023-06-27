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
} from '@/utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';
import { useFormikContext } from 'formik';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';
import { useCurrentOrganization } from '@/hooks/state';
import { getEntriesTotal } from '@/containers/Entries/utils';

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
};

/**
 * Transforms the credit note to initial values of edit form.
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

  return {
    ...transformToForm(creditNote, defaultVendorsCreditNote),
    entries,
  };
};

/**
 * Transforms credit note entries to submit request.
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
 * Filters the given non-zero entries.
 */
export const filterNonZeroEntries = (entries) => {
  return entries.filter((item) => item.item_id && item.quantity);
};

/**
 * Transforms form values to request body.
 */
export const transformFormValuesToRequest = (values) => {
  const entries = filterNonZeroEntries(values.entries);

  return {
    ...values,
    entries: transformEntriesToSubmit(entries),
    open: false,
  };
};

/**
 * Determines vendors fast field should update
 */
export const vendorsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.items !== oldProps.shouldUpdateDeps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
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

export const useVendorCreditNoteTotals = () => {
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

  return {
    total,
    formattedTotal,
    formattedSubtotal,
  };
};

/**
 * Determines whether the vendor note has foreign customer.
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
