import { useFormikContext } from 'formik';
import { first } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';
import type { CreateVendorCreditBody, VendorCredit } from '@bigcapital/sdk-ts';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
  getEntriesTotal,
} from '@/containers/Entries/utils';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
  transactionNumber,
  formattedAmount,
  orderingLinesIndexes,
  toSafeNumber,
  compose,
} from '@/utils';

export const MIN_LINES_NUMBER = 1;

export type VendorCreditEntry = {
  index: number;
  itemId: string | number;
  rate: string | number;
  discount: string | number;
  quantity: string | number;
  description: string;
  amount: string | number;
};

export type VendorCreditFormValues = {
  vendorId: string | number;
  vendorCreditNumber: string;
  vendorCreditNumberManually: string | boolean;
  vendorCreditDate: string;
  open: boolean | '';
  referenceNo: string;
  note: string;
  branchId: string | number;
  warehouseId: string | number;
  exchangeRate: string | number;
  currencyCode: string;
  discount: string;
  discountType: 'amount' | 'percentage';
  adjustment: string;
  entries: VendorCreditEntry[];
  attachments: unknown[];
};

// Default vendor credit entry.
export const defaultVendorCreditEntry: VendorCreditEntry = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

// Default vendor credit note.
export const defaultVendorCredit: VendorCreditFormValues = {
  vendorId: '',
  vendorCreditNumber: '',
  vendorCreditNumberManually: false,
  open: '',
  vendorCreditDate: moment(new Date()).format('YYYY-MM-DD'),
  referenceNo: '',
  note: '',
  branchId: '',
  warehouseId: '',
  exchangeRate: 1,
  currencyCode: '',
  discount: '',
  discountType: 'amount',
  adjustment: '',
  entries: [...repeatValue(defaultVendorCreditEntry, MIN_LINES_NUMBER)],
  attachments: [],
};

/**
 * Transform the vendor credit to initial values of the edit form.
 *
 * Accepts a partial vendor credit shape: the provider seeds a new vendor credit
 * from a picked bill (`vendorId`, `currencyCode`, `entries`) which lacks most
 * VendorCredit fields. The transform fills gaps from `defaultVendorCredit`.
 */
export function transformToEditForm(
  vendorCredit: Partial<VendorCredit> & { entries: VendorCredit['entries'] },
): VendorCreditFormValues {
  const initialEntries = [
    ...vendorCredit.entries.map((entry) => ({
      ...transformToForm(entry, defaultVendorCreditEntry),
    })),
    ...repeatValue(
      defaultVendorCreditEntry,
      Math.max(MIN_LINES_NUMBER - vendorCredit.entries.length, 0),
    ),
  ];
  const entries = compose(
    ensureEntriesHaveEmptyLine(defaultVendorCreditEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...defaultVendorCredit,
    ...(transformToForm(
      vendorCredit,
      defaultVendorCredit,
    ) as Partial<VendorCreditFormValues>),
    entries,
    attachments: transformAttachmentsToForm(vendorCredit),
  };
}

// Vendor credit entry request schema (without computed `amount`).
const defaultReqVendorCreditEntry = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
};

/**
 * Transforms vendor credit entries to submit request.
 */
const transformEntriesToSubmit = (entries: VendorCreditEntry[]) => {
  return orderingLinesIndexes(
    entries.map((entry) => transformToForm(entry, defaultReqVendorCreditEntry)),
  );
};

/**
 * Filters the given non-zero entries.
 */
export const filterNonZeroEntries = (entries: VendorCreditEntry[]) => {
  return entries.filter((item) => item.itemId && item.quantity);
};

/**
 * Transforms form values to request body.
 *
 * NOTE: `as unknown as CreateVendorCreditBody` is required because the SDK request
 * type reuses the response entry DTO, which mandates server-computed fields that
 * the client never sends — the backend populates them. Form field values are also
 * string-typed (from inputs) while the DTO types them as numbers. Coercing every
 * field would change the runtime payload, so we assemble the body as-is and assert
 * the type.
 */
export function transformFormValuesToRequest(
  values: VendorCreditFormValues,
): CreateVendorCreditBody {
  return {
    ...values,
    entries: transformEntriesToSubmit(filterNonZeroEntries(values.entries)),
    open: false,
    attachments: transformAttachmentsToRequest(values),
  } as unknown as CreateVendorCreditBody;
}

type FastFieldShouldUpdateProps = {
  shouldUpdateDeps?: { items?: unknown[] };
  items?: unknown;
  [key: string]: unknown;
};

/**
 * Determines vendors fast field should update.
 */
export const vendorsFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.shouldUpdateDeps?.items !== oldProps.shouldUpdateDeps?.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Determines entries fast field should update.
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

/**
 * Syncs vendor credit no. settings with form.
 */
export const useObserveVendorCreditNoSettings = (
  prefix?: string,
  nextNumber?: number,
) => {
  const { setFieldValue } = useFormikContext<VendorCreditFormValues>();

  React.useEffect(() => {
    const creditNo = transactionNumber(prefix, nextNumber);
    setFieldValue('vendorCreditNumber', creditNo);
  }, [setFieldValue, prefix, nextNumber]);
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<VendorCreditFormValues>();
  const { branches, isBranchesSuccess, isNewMode } =
    useVendorCreditNoteFormContext();

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
  const { setFieldValue } = useFormikContext<VendorCreditFormValues>();
  const { warehouses, isWarehousesSuccess, isNewMode } =
    useVendorCreditNoteFormContext();

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
 * Retrieves the vendor credit subtotal.
 */
export const useVendorCreditSubtotal = () => {
  const {
    values: { entries },
  } = useFormikContext<VendorCreditFormValues>();

  return React.useMemo(() => getEntriesTotal(entries), [entries]);
};

/**
 * Retrieves the vendor credit subtotal formatted.
 */
export const useVendorCreditSubtotalFormatted = () => {
  const subtotal = useVendorCreditSubtotal();
  const {
    values: { currencyCode },
  } = useFormikContext<VendorCreditFormValues>();

  return formattedAmount(subtotal, currencyCode, { money: true });
};

/**
 * Retrieves the vendor credit discount amount.
 */
export const useVendorCreditDiscountAmount = () => {
  const { values } = useFormikContext<VendorCreditFormValues>();
  const subtotal = useVendorCreditSubtotal();
  const discount = toSafeNumber(values.discount);

  return values?.discountType === 'percentage'
    ? (discount * subtotal) / 100
    : discount;
};

/**
 * Retrieves the vendor credit discount amount formatted.
 */
export const useVendorCreditDiscountAmountFormatted = () => {
  const discountAmount = useVendorCreditDiscountAmount();
  const {
    values: { currencyCode },
  } = useFormikContext<VendorCreditFormValues>();

  return formattedAmount(discountAmount, currencyCode, { money: true });
};

/**
 * Retrieves the vendor credit adjustment amount.
 */
export const useVendorCreditAdjustmentAmount = () => {
  const { values } = useFormikContext<VendorCreditFormValues>();

  return toSafeNumber(values.adjustment);
};

/**
 * Retrieves the vendor credit adjustment amount formatted.
 */
export const useVendorCreditAdjustmentAmountFormatted = () => {
  const adjustmentAmount = useVendorCreditAdjustmentAmount();
  const {
    values: { currencyCode },
  } = useFormikContext<VendorCreditFormValues>();

  return formattedAmount(adjustmentAmount, currencyCode, { money: true });
};

/**
 * Retrieves the vendor credit total.
 */
export const useVendorCreditTotal = () => {
  const subtotal = useVendorCreditSubtotal();
  const discountAmount = useVendorCreditDiscountAmount();
  const adjustmentAmount = useVendorCreditAdjustmentAmount();

  return R.compose(
    R.subtract(R.__, discountAmount),
    R.add(adjustmentAmount),
  )(subtotal);
};

/**
 * Retrieves the vendor credit total formatted.
 */
export const useVendorCreditTotalFormatted = () => {
  const total = useVendorCreditTotal();
  const {
    values: { currencyCode },
  } = useFormikContext<VendorCreditFormValues>();

  return formattedAmount(total, currencyCode, { money: true });
};

/**
 * Retrieves the vendor credit formatted subtotal in the base currency.
 */
export const useVendorCreditFormattedSubtotal = () => {
  const subtotal = useVendorCreditSubtotal();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  return formattedAmount(subtotal, baseCurrency, { money: true });
};

/**
 * Determines whether the vendor note has a foreign vendor.
 */
export const useVendorNoteIsForeignCustomer = () => {
  const { values } = useFormikContext<VendorCreditFormValues>();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignCustomer = React.useMemo(
    () => values.currencyCode !== baseCurrency,
    [values.currencyCode, baseCurrency],
  );
  return isForeignCustomer;
};
