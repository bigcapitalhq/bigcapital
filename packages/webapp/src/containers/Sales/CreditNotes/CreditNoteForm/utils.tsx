// @ts-nocheck
import React from 'react';
import moment from 'moment';
import * as R from 'ramda';
import { first } from 'lodash';

import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
  formattedAmount,
  orderingLinesIndexes,
  toSafeNumber,
} from '@/utils';
import { useFormikContext } from 'formik';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';

import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';
import { useCurrentOrganization } from '@/hooks/state';
import { getEntriesTotal } from '@/containers/Entries/utils';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';
import { convertBrandingTemplatesToOptions } from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';

export const MIN_LINES_NUMBER = 1;

// Default entry object.
export const defaultCreditNoteEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

// Default credit note object.
export const defaultCreditNote = {
  customer_id: '',
  credit_note_date: moment(new Date()).format('YYYY-MM-DD'),
  credit_note_number: '',
  // Holds the credit note number that entered manually only.
  credit_note_number_manually: false,
  open: '',
  reference_no: '',
  note: '',
  terms_conditions: '',
  branch_id: '',
  warehouse_id: '',
  exchange_rate: 1,
  currency_code: '',
  entries: [...repeatValue(defaultCreditNoteEntry, MIN_LINES_NUMBER)],
  attachments: [],
  pdf_template_id: '',
  discount: '',
  discount_type: 'amount',
  adjustment: '',
};

/**
 * Transform credit note to initial values in edit mode.
 */
export function transformToEditForm(creditNote) {
  const initialEntries = [
    ...creditNote.entries.map((creditNote) => ({
      ...transformToForm(creditNote, defaultCreditNoteEntry),
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

  const attachment = transformAttachmentsToForm(creditNote);

  return {
    ...transformToForm(creditNote, defaultCreditNote),
    entries,
    attachment,
  };
}

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
 * Determines customer name field when should update.
 */
export const customerNameFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.items !== oldProps.shouldUpdateDeps.items ||
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

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useCreditNoteFormContext();

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
  const { warehouses, isWarehousesSuccess } = useCreditNoteFormContext();

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
 * Retrieves the credit note subtotal.
 * @returns {number}
 */
export const useCreditNoteSubtotal = () => {
  const {
    values: { entries },
  } = useFormikContext();

  const total = React.useMemo(() => getEntriesTotal(entries), [entries]);

  return total;
};

/**
 * Retrieves the credit note subtotal formatted.
 * @returns {string}
 */
export const useCreditNoteSubtotalFormatted = () => {
  const subtotal = useCreditNoteSubtotal();
  const {
    values: { currency_code: currencyCode },
  } = useFormikContext();

  return formattedAmount(subtotal, currencyCode, { money: true });
};

/**
 * Retrieves the credit note discount amount.
 * @returns {number}
 */
export const useCreditNoteDiscountAmount = () => {
  const { values } = useFormikContext();
  const subtotal = useCreditNoteSubtotal();
  const discount = toSafeNumber(values.discount);

  return values?.discount_type === 'percentage'
    ? (discount * subtotal) / 100
    : discount;
};

/**
 * Retrieves the credit note discount amount formatted.
 * @returns {string}
 */
export const useCreditNoteDiscountAmountFormatted = () => {
  const discountAmount = useCreditNoteDiscountAmount();
  const {
    values: { currency_code: currencyCode },
  } = useFormikContext();

  return formattedAmount(discountAmount, currencyCode, { money: true });
};

/**
 * Retrieves the credit note adjustment amount.
 * @returns {number}
 */
export const useCreditNoteAdjustmentAmount = () => {
  const { values } = useFormikContext();

  return toSafeNumber(values.adjustment);
};

/**
 * Retrieves the credit note adjustment amount formatted.
 * @returns {string}
 */
export const useCreditNoteAdjustmentFormatted = () => {
  const adjustmentAmount = useCreditNoteAdjustmentAmount();
  const {
    values: { currency_code: currencyCode },
  } = useFormikContext();

  return formattedAmount(adjustmentAmount, currencyCode, { money: true });
};

/**
 * Retrieves the credit note total.
 * @returns {number}
 */
export const useCreditNoteTotal = () => {
  const subtotal = useCreditNoteSubtotal();
  const discountAmount = useCreditNoteDiscountAmount();
  const adjustmentAmount = useCreditNoteAdjustmentAmount();

  return R.compose(
    R.subtract(R.__, discountAmount),
    R.add(R.__, adjustmentAmount),
  )(subtotal);
};

/**
 * Retrieves the credit note total formatted.
 * @returns {string}
 */
export const useCreditNoteTotalFormatted = () => {
  const total = useCreditNoteTotal();
  const {
    values: { currency_code: currencyCode },
  } = useFormikContext();

  return formattedAmount(total, currencyCode, { money: true });
};

/**
 * Detarmines whether the receipt has foreign customer.
 * @returns {boolean}
 */
export const useCreditNoteIsForeignCustomer = () => {
  const { values } = useFormikContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignCustomer = React.useMemo(
    () => values.currency_code !== currentOrganization.base_currency,
    [values.currency_code, currentOrganization.base_currency],
  );
  return isForeignCustomer;
};

export const useCreditNoteFormBrandingTemplatesOptions = () => {
  const { brandingTemplates } = useCreditNoteFormContext();

  return React.useMemo(
    () => convertBrandingTemplatesToOptions(brandingTemplates),
    [brandingTemplates],
  );
};
