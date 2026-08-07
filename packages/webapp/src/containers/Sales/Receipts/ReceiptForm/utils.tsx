import { useFormikContext } from 'formik';
import { omit, first } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { useReceiptFormContext } from './ReceiptFormProvider';
import type { SaleReceipt, CreateSaleReceiptBody } from '@bigcapital/sdk-ts';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';
import { convertBrandingTemplatesToOptions } from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
  getEntriesTotal,
} from '@/containers/Entries/utils';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import {
  defaultFastFieldShouldUpdate,
  repeatValue,
  transformToForm,
  formattedAmount,
  toSafeNumber,
} from '@/utils';

export const MIN_LINES_NUMBER = 1;

export type ReceiptEntry = {
  index: number;
  itemId: string | number;
  rate: string | number;
  discount: string | number;
  quantity: string | number;
  description: string;
  amount: string | number;
};

export type ReceiptFormValues = {
  customerId: string | number;
  depositAccountId: string | number;
  receiptNumber: string;
  // Holds the receipt number that entered manually only.
  receiptNumberManually: string;
  receiptDate: string;
  referenceNo: string;
  receiptMessage: string;
  termsConditions: string;
  closed: boolean | '';
  branchId: string | number;
  warehouseId: string | number;
  exchangeRate: number;
  currencyCode: string;
  entries: ReceiptEntry[];
  attachments: unknown[];
  pdfTemplateId: string | number;
  discount: string | number;
  discountType: 'amount' | 'percentage';
  adjustment: string | number;
};

export const defaultReceiptEntry: ReceiptEntry = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

const defaultReceiptEntryReq = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
};

export const defaultReceipt: ReceiptFormValues = {
  customerId: '',
  depositAccountId: '',
  receiptNumber: '',
  receiptNumberManually: '',
  receiptDate: moment(new Date()).format('YYYY-MM-DD'),
  referenceNo: '',
  receiptMessage: '',
  termsConditions: '',
  closed: '',
  branchId: '',
  warehouseId: '',
  exchangeRate: 1,
  currencyCode: '',
  entries: [...repeatValue(defaultReceiptEntry, MIN_LINES_NUMBER)],
  attachments: [],
  pdfTemplateId: '',
  discount: '',
  discountType: 'amount',
  adjustment: '',
};

const ERRORS = {
  SALE_RECEIPT_NUMBER_NOT_UNIQUE: 'SALE_RECEIPT_NUMBER_NOT_UNIQUE',
  SALE_RECEIPT_NO_IS_REQUIRED: 'SALE_RECEIPT_NO_IS_REQUIRED',
};

type FastFieldShouldUpdateProps = {
  shouldUpdateDeps?: { items?: unknown[] };
  items?: unknown;
  [key: string]: unknown;
};

type ReceiptFormErrors = { type: string };

type SetErrors = (
  errors: Partial<Record<keyof ReceiptFormValues, string>>,
) => void;

/**
 * Transform to form in edit mode.
 */
export function transformToEditForm(
  receipt: Partial<SaleReceipt> & { entries: SaleReceipt['entries'] },
): ReceiptFormValues {
  const initialEntries = [
    ...receipt.entries.map((entry) => ({
      ...transformToForm(entry, defaultReceiptEntry),
    })),
    ...repeatValue(
      defaultReceiptEntry,
      Math.max(MIN_LINES_NUMBER - receipt.entries.length, 0),
    ),
  ];
  const entries = updateItemsEntriesTotal(
    ensureEntriesHaveEmptyLine(defaultReceiptEntry)(initialEntries),
  );

  const attachments = transformAttachmentsToForm(receipt);

  return {
    ...defaultReceipt,
    ...(transformToForm(receipt, defaultReceipt) as Partial<ReceiptFormValues>),
    entries,
    attachments,
  };
}

/**
 * Detarmines entries fast field should update.
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
 * Detarmines accounts fast field should update.
 */
export const accountsFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines customers fast field should update.
 */
export const customersFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.shouldUpdateDeps?.items !== oldProps.shouldUpdateDeps?.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Transform response error to fields.
 */
export const handleErrors = (
  errors: ReceiptFormErrors[],
  { setErrors }: { setErrors: SetErrors },
) => {
  if (errors.some((e) => e.type === ERRORS.SALE_RECEIPT_NUMBER_NOT_UNIQUE)) {
    setErrors({
      receiptNumber: intl.get('sale_receipt_number_not_unique'),
    });
  }
  if (errors.some((e) => e.type === ERRORS.SALE_RECEIPT_NO_IS_REQUIRED)) {
    setErrors({
      receiptNumber: intl.get('receipt.field.error.receipt_number_required'),
    });
  }
};

/**
 * Transformes the form values to request body.
 *
 * `as unknown as CreateSaleReceiptBody` mirrors `InvoiceForm/utils.tsx`:
 * the SDK request type reuses the response `ItemEntryDto`, which carries
 * server-computed fields the client never sends. Coercing every field would
 * change the runtime payload, so we assemble the body as-is and assert the
 * type.
 */
export const transformFormValuesToRequest = (
  values: ReceiptFormValues,
): CreateSaleReceiptBody => {
  const entries = values.entries.filter((item) => item.itemId && item.quantity);
  const attachments = transformAttachmentsToRequest(values);

  return {
    ...omit(values, ['receiptNumberManually', 'receiptNumber']),
    ...(values.receiptNumberManually && {
      receiptNumber: values.receiptNumber,
    }),
    entries: entries.map((entry) => ({
      ...transformToForm(entry, defaultReceiptEntryReq),
    })),
    closed: false,
    attachments,
  } as unknown as CreateSaleReceiptBody;
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext<ReceiptFormValues>();
  const { warehouses, isWarehousesSuccess, isNewMode } =
    useReceiptFormContext();

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

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<ReceiptFormValues>();
  const { branches, isBranchesSuccess, isNewMode } = useReceiptFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess && isNewMode) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches, isNewMode]);
};

/**
 * Retrieves the receipt subtotal.
 * @returns {number}
 */
export const useReceiptSubtotal = () => {
  const {
    values: { entries },
  } = useFormikContext<ReceiptFormValues>();

  // Retrieves the invoice entries total.
  const subtotal = React.useMemo(() => getEntriesTotal(entries), [entries]);

  return subtotal;
};

/**
 * Retrieves the formatted subtotal.
 * @returns {string}
 */
export const useReceiptSubtotalFormatted = () => {
  const subtotal = useReceiptSubtotal();
  const { values } = useFormikContext<ReceiptFormValues>();

  return formattedAmount(subtotal, values.currencyCode, { money: true });
};

/**
 * Retrieves the receipt discount amount.
 * @returns {number}
 */
export const useReceiptDiscountAmount = () => {
  const { values } = useFormikContext<ReceiptFormValues>();
  const subtotal = useReceiptSubtotal();
  const discount = toSafeNumber(values.discount);

  return values?.discountType === 'percentage'
    ? (subtotal * discount) / 100
    : discount;
};

/**
 * Retrieves the formatted discount amount.
 * @returns {string}
 */
export const useReceiptDiscountAmountFormatted = () => {
  const { values } = useFormikContext<ReceiptFormValues>();
  const discount = useReceiptDiscountAmount();

  return formattedAmount(discount, values.currencyCode);
};

/**
 * Retrieves the receipt adjustment amount.
 * @returns {number}
 */
export const useReceiptAdjustmentAmount = () => {
  const { values } = useFormikContext<ReceiptFormValues>();
  const adjustment = toSafeNumber(values.adjustment);

  return adjustment;
};

/**
 * Retrieves the formatted adjustment amount.
 * @returns {string}
 */
export const useReceiptAdjustmentFormatted = () => {
  const { values } = useFormikContext<ReceiptFormValues>();
  const adjustment = useReceiptAdjustmentAmount();

  return formattedAmount(adjustment, values.currencyCode);
};

/**
 * Retrieves the receipt total.
 * @returns {number}
 */
export const useReceiptTotal = () => {
  const subtotal = useReceiptSubtotal();
  const adjustmentAmount = useReceiptAdjustmentAmount();
  const discountAmount = useReceiptDiscountAmount();

  return subtotal - discountAmount + adjustmentAmount;
};

/**
 * Retrieves the formatted receipt total.
 * @returns {string}
 */
export const useReceiptTotalFormatted = () => {
  const total = useReceiptTotal();
  const { values } = useFormikContext<ReceiptFormValues>();

  return formattedAmount(total, values.currencyCode);
};

/**
 * Retrieves the receipt paid amount.
 * @returns {number}
 */
export const useReceiptPaidAmount = () => {
  return toSafeNumber(0);
};

/**
 * Retrieves the formatted receipt paid amount.
 * @returns {string}
 */
export const useReceiptPaidAmountFormatted = () => {
  const paidAmount = useReceiptPaidAmount();
  const { values } = useFormikContext<ReceiptFormValues>();

  return formattedAmount(paidAmount, values.currencyCode);
};

/**
 * Retrieves the receipt due amount.
 * @returns {number}
 */
export const useReceiptDueAmount = () => {
  const total = useReceiptTotal();
  const paidAmount = useReceiptPaidAmount();

  return total - paidAmount;
};

/**
 * Retrieves the formatted receipt due amount.
 * @returns {string}
 */
export const useReceiptDueAmountFormatted = () => {
  const dueAmount = useReceiptDueAmount();
  const { values } = useFormikContext<ReceiptFormValues>();

  return formattedAmount(dueAmount, values.currencyCode);
};

/**
 * Detarmines whether the receipt has foreign customer.
 * @returns {boolean}
 */
export const useReceiptIsForeignCustomer = () => {
  const { values } = useFormikContext<ReceiptFormValues>();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignCustomer = React.useMemo(
    () => values.currencyCode !== baseCurrency,
    [values.currencyCode, baseCurrency],
  );
  return isForeignCustomer;
};

export const resetFormState = ({
  initialValues,
  values,
  resetForm,
}: {
  initialValues: ReceiptFormValues;
  values: ReceiptFormValues;
  resetForm: (next?: { values: ReceiptFormValues }) => void;
}) => {
  resetForm({
    values: {
      // Reset the all values except the warehouse and branch id.
      ...initialValues,
      warehouseId: values.warehouseId,
      branchId: values.branchId,
    },
  });
};

export const useReceiptFormBrandingTemplatesOptions = () => {
  const { brandingTemplates } = useReceiptFormContext();

  return React.useMemo(
    () => convertBrandingTemplatesToOptions(brandingTemplates ?? []),
    [brandingTemplates],
  );
};
