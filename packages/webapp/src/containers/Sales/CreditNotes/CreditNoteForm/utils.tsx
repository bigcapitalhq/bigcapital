import { useFormikContext } from 'formik';
import { first } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import type { CreateCreditNoteBody, CreditNote } from '@bigcapital/sdk-ts';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';
import { convertBrandingTemplatesToOptions } from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';
import { getEntriesTotal } from '@/containers/Entries/utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
  formattedAmount,
  orderingLinesIndexes,
  toSafeNumber,
  compose,
} from '@/utils';

export const MIN_LINES_NUMBER = 1;

export type CreditNoteEntry = {
  index: number;
  itemId: string | number;
  rate: string | number;
  discount: string | number;
  quantity: string | number;
  description: string;
  amount: string | number;
};

export type CreditNoteFormValues = {
  customerId: string | number;
  creditNoteDate: string;
  creditNoteNumber: string;
  creditNoteNumberManually: string | boolean;
  open: boolean | '';
  referenceNo: string;
  note: string;
  termsConditions: string;
  branchId: string | number;
  warehouseId: string | number;
  exchangeRate: string | number;
  currencyCode: string;
  pdfTemplateId: string | number;
  discount: string;
  discountType: 'amount' | 'percentage';
  adjustment: string;
  entries: CreditNoteEntry[];
  attachments: unknown[];
};

// Default entry object.
export const defaultCreditNoteEntry: CreditNoteEntry = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

// Default credit note object.
export const defaultCreditNote: CreditNoteFormValues = {
  customerId: '',
  creditNoteDate: moment(new Date()).format('YYYY-MM-DD'),
  creditNoteNumber: '',
  creditNoteNumberManually: false,
  open: '',
  referenceNo: '',
  note: '',
  termsConditions: '',
  branchId: '',
  warehouseId: '',
  exchangeRate: 1,
  currencyCode: '',
  pdfTemplateId: '',
  discount: '',
  discountType: 'amount',
  adjustment: '',
  entries: [...repeatValue(defaultCreditNoteEntry, MIN_LINES_NUMBER)],
  attachments: [],
};

/**
 * Transform credit note to initial values in edit mode.
 *
 * Accepts a partial credit note shape: the provider seeds a new credit note
 * from a picked invoice (`customerId`, `currencyCode`, `entries`) which lacks
 * most CreditNote fields. The transform fills gaps from `defaultCreditNote`.
 */
export function transformToEditForm(
  creditNote: Partial<CreditNote> & { entries: CreditNote['entries'] },
): CreditNoteFormValues {
  const initialEntries = [
    ...creditNote.entries.map((entry) => ({
      ...transformToForm(entry, defaultCreditNoteEntry),
    })),
    ...repeatValue(
      defaultCreditNoteEntry,
      Math.max(MIN_LINES_NUMBER - creditNote.entries.length, 0),
    ),
  ];
  const entries = compose(
    ensureEntriesHaveEmptyLine(defaultCreditNoteEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...defaultCreditNote,
    ...(transformToForm(
      creditNote,
      defaultCreditNote,
    ) as Partial<CreditNoteFormValues>),
    entries,
    attachments: transformAttachmentsToForm(creditNote),
  };
}

// Credit note entry request schema (without computed `amount`).
const defaultReqCreditNoteEntry = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
};

/**
 * Transformes credit note entries to submit request.
 */
const transformEntriesToSubmit = (entries: CreditNoteEntry[]) => {
  return orderingLinesIndexes(
    entries.map((entry) => transformToForm(entry, defaultReqCreditNoteEntry)),
  );
};

/**
 * Filters the given non-zero entries.
 */
const filterNonZeroEntries = (entries: CreditNoteEntry[]) => {
  return entries.filter((item) => item.itemId && item.quantity);
};

/**
 * Transformes form values to request body.
 *
 * NOTE: `as unknown as CreateCreditNoteBody` is required because the SDK request
 * type reuses the response `ItemEntryDto`, which mandates server-computed fields
 * that the client never sends — the backend populates them. Form field values
 * are also string-typed (from inputs) while the DTO types them as numbers.
 * Coercing every field would change the runtime payload, so we assemble the body
 * as-is and assert the type.
 */
export function transformFormValuesToRequest(
  values: CreditNoteFormValues,
): CreateCreditNoteBody {
  return {
    ...values,
    entries: transformEntriesToSubmit(filterNonZeroEntries(values.entries)),
    open: false,
    attachments: transformAttachmentsToRequest(values),
  } as unknown as CreateCreditNoteBody;
}

type FastFieldShouldUpdateProps = {
  shouldUpdateDeps?: { items?: unknown[] };
  items?: unknown;
  [key: string]: unknown;
};

/**
 * Determines customer name field when should update.
 */
export const customerNameFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.shouldUpdateDeps?.items !== oldProps.shouldUpdateDeps?.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Determines invoice entries field when should update.
 */
export const entriesFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<CreditNoteFormValues>();
  const { branches, isBranchesSuccess, isNewMode } = useCreditNoteFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess && isNewMode) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches, isNewMode]);
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext<CreditNoteFormValues>();
  const { warehouses, isWarehousesSuccess, isNewMode } =
    useCreditNoteFormContext();

  React.useEffect(() => {
    if (isWarehousesSuccess && isNewMode) {
      const primaryWarehouse =
        warehouses.find((b) => b.primary) || first(warehouses);

      if (primaryWarehouse) {
        setFieldValue('warehouseId', primaryWarehouse.id);
      }
    }
  }, [isWarehousesSuccess, setFieldValue, warehouses, isNewMode]);
};

/**
 * Retrieves the credit note subtotal.
 */
export const useCreditNoteSubtotal = () => {
  const {
    values: { entries },
  } = useFormikContext<CreditNoteFormValues>();

  return React.useMemo(() => getEntriesTotal(entries), [entries]);
};

/**
 * Retrieves the credit note subtotal formatted.
 */
export const useCreditNoteSubtotalFormatted = () => {
  const subtotal = useCreditNoteSubtotal();
  const {
    values: { currencyCode },
  } = useFormikContext<CreditNoteFormValues>();

  return formattedAmount(subtotal, currencyCode, { money: true });
};

/**
 * Retrieves the credit note discount amount.
 */
export const useCreditNoteDiscountAmount = () => {
  const { values } = useFormikContext<CreditNoteFormValues>();
  const subtotal = useCreditNoteSubtotal();
  const discount = toSafeNumber(values.discount);

  return values?.discountType === 'percentage'
    ? (discount * subtotal) / 100
    : discount;
};

/**
 * Retrieves the credit note discount amount formatted.
 */
export const useCreditNoteDiscountAmountFormatted = () => {
  const discountAmount = useCreditNoteDiscountAmount();
  const {
    values: { currencyCode },
  } = useFormikContext<CreditNoteFormValues>();

  return formattedAmount(discountAmount, currencyCode, { money: true });
};

/**
 * Retrieves the credit note adjustment amount.
 */
export const useCreditNoteAdjustmentAmount = () => {
  const { values } = useFormikContext<CreditNoteFormValues>();

  return toSafeNumber(values.adjustment);
};

/**
 * Retrieves the credit note adjustment amount formatted.
 */
export const useCreditNoteAdjustmentFormatted = () => {
  const adjustmentAmount = useCreditNoteAdjustmentAmount();
  const {
    values: { currencyCode },
  } = useFormikContext<CreditNoteFormValues>();

  return formattedAmount(adjustmentAmount, currencyCode, { money: true });
};

/**
 * Retrieves the credit note total.
 */
export const useCreditNoteTotal = () => {
  const subtotal = useCreditNoteSubtotal();
  const discountAmount = useCreditNoteDiscountAmount();
  const adjustmentAmount = useCreditNoteAdjustmentAmount();

  return R.compose(
    R.subtract(R.__, discountAmount),
    R.add(adjustmentAmount),
  )(subtotal);
};

/**
 * Retrieves the credit note total formatted.
 */
export const useCreditNoteTotalFormatted = () => {
  const total = useCreditNoteTotal();
  const {
    values: { currencyCode },
  } = useFormikContext<CreditNoteFormValues>();

  return formattedAmount(total, currencyCode, { money: true });
};

/**
 * Detarmines whether the credit note has foreign customer.
 */
export const useCreditNoteIsForeignCustomer = () => {
  const { values } = useFormikContext<CreditNoteFormValues>();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignCustomer = React.useMemo(
    () => values.currencyCode !== baseCurrency,
    [values.currencyCode, baseCurrency],
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
