import { useFormikContext } from 'formik';
import { omit, first } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useEstimateFormContext } from './EstimateFormProvider';
import type { SaleEstimate, CreateSaleEstimateBody } from '@bigcapital/sdk-ts';
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
  compose,
  defaultFastFieldShouldUpdate,
  repeatValue,
  transformToForm,
  formattedAmount,
  toSafeNumber,
} from '@/utils';

export const MIN_LINES_NUMBER = 1;

export type EstimateEntry = {
  index: number;
  itemId: string | number;
  rate: string | number;
  discount: string | number;
  quantity: string | number;
  description: string;
  amount: string | number;
};

export type EstimateFormValues = {
  customerId: string | number;
  estimateDate: string;
  expirationDate: string;
  estimateNumber: string;
  estimateNumberManually: string;
  delivered: boolean | '';
  reference: string;
  note: string;
  termsConditions: string;
  branchId: string | number;
  warehouseId: string | number;
  projectId: string | number;
  exchangeRate: string;
  currencyCode: string;
  pdfTemplateId: string | number;
  entries: EstimateEntry[];
  attachments: unknown[];
  discount: string;
  discountType: 'amount' | 'percentage';
  adjustment: string;
};

export const defaultEstimateEntry: EstimateEntry = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

const defaultEstimateEntryReq = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
};

export const defaultEstimate: EstimateFormValues = {
  customerId: '',
  estimateDate: moment(new Date()).format('YYYY-MM-DD'),
  expirationDate: moment(new Date()).format('YYYY-MM-DD'),
  estimateNumber: '',
  // Holds the estimate number that entered manually only.
  estimateNumberManually: '',
  delivered: '',
  reference: '',
  note: '',
  termsConditions: '',
  branchId: '',
  warehouseId: '',
  projectId: '',
  exchangeRate: '1',
  currencyCode: '',
  entries: [...repeatValue(defaultEstimateEntry, MIN_LINES_NUMBER)],
  attachments: [],
  pdfTemplateId: '',
  adjustment: '',
  discount: '',
  discountType: 'amount',
};

const ERRORS = {
  ESTIMATE_NUMBER_IS_NOT_UNQIUE: 'ESTIMATE.NUMBER.IS.NOT.UNQIUE',
  SALE_ESTIMATE_NO_IS_REQUIRED: 'SALE_ESTIMATE_NO_IS_REQUIRED',
};

/**
 * Transform estimate to initial values in edit mode.
 */
export function transformToEditForm(
  estimate: SaleEstimate,
): EstimateFormValues {
  const initialEntries = [
    ...estimate.entries.map((entry) => ({
      ...transformToForm(entry, defaultEstimateEntry),
    })),
    ...repeatValue(
      defaultEstimateEntry,
      Math.max(MIN_LINES_NUMBER - estimate.entries.length, 0),
    ),
  ];
  const entries = compose(
    ensureEntriesHaveEmptyLine(defaultEstimateEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  const attachments = transformAttachmentsToForm(estimate);

  return {
    ...defaultEstimate,
    ...(transformToForm(
      estimate,
      defaultEstimate,
    ) as Partial<EstimateFormValues>),
    entries,
    attachments,
  };
}

type FastFieldShouldUpdateProps = {
  shouldUpdateDeps?: { items?: unknown[] };
  items?: unknown;
  [key: string]: unknown;
};

/**
 * Detarmines customers fast field when update.
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

export const ITEMS_FILTER_ROLES = JSON.stringify([
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
 * Transform response errors to fields.
 */
export const handleErrors = (
  errors: Array<{ type: string }>,
  { setErrors }: { setErrors: (errors: Record<string, unknown>) => void },
) => {
  if (errors.some((e) => e.type === ERRORS.ESTIMATE_NUMBER_IS_NOT_UNQIUE)) {
    setErrors({
      estimateNumber: intl.get('estimate_number_is_not_unqiue'),
    });
  }
  if (
    errors.some((error) => error.type === ERRORS.SALE_ESTIMATE_NO_IS_REQUIRED)
  ) {
    setErrors({
      estimateNumber: intl.get('estimate.field.error.estimate_number_required'),
    });
  }
};

/**
 * Transform the form values to request body.
 *
 * NOTE: `as unknown as CreateSaleEstimateBody` is required because the SDK request
 * type reuses the response `ItemEntryDto`, which mandates server-computed fields
 * that the client never sends — the backend populates them. Form field values are
 * also string-typed (from inputs) while the DTO types them as numbers. Coercing
 * every field would change the runtime payload, so we assemble the body as-is
 * and assert the type.
 */
export function transformValueToRequest(
  values: EstimateFormValues,
): CreateSaleEstimateBody {
  const entries = values.entries.filter((item) => item.itemId && item.quantity);
  const attachments = transformAttachmentsToRequest(values);

  return {
    ...omit(values, ['estimateNumberManually', 'estimateNumber']),
    // The `estimateNumberManually` will be presented just if the auto-increment
    // is disable, always both attributes hold the same value in manual mode.
    ...(values.estimateNumberManually && {
      estimateNumber: values.estimateNumber,
    }),
    entries: entries.map((entry) => ({
      ...transformToForm(entry, defaultEstimateEntryReq),
    })),
    attachments,
  } as unknown as CreateSaleEstimateBody;
}

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext<EstimateFormValues>();
  const { warehouses, isWarehousesSuccess, isNewMode } =
    useEstimateFormContext();

  React.useEffect(() => {
    if (isWarehousesSuccess && isNewMode && warehouses) {
      const primaryWarehouse =
        warehouses.find((b) => b.primary) || first(warehouses);

      if (primaryWarehouse) {
        setFieldValue('warehouseId', primaryWarehouse.id);
      }
    }
  }, [isWarehousesSuccess, setFieldValue, warehouses, isNewMode]);
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<EstimateFormValues>();
  const { branches, isBranchesSuccess, isNewMode } = useEstimateFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess && isNewMode && branches) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches, isNewMode]);
};

/**
 * Retrieves the estimate subtotal.
 * @returns {number}
 */
export const useEstimateSubtotal = () => {
  const {
    values: { entries },
  } = useFormikContext<EstimateFormValues>();

  // Retrieves the estimate entries total.
  const subtotal = useMemo(() => getEntriesTotal(entries), [entries]);

  return subtotal;
};

/**
 * Retrieves the estimate subtotal formatted.
 * @returns {string}
 */
export const useEstimateSubtotalFormatted = () => {
  const subtotal = useEstimateSubtotal();
  const {
    values: { currencyCode },
  } = useFormikContext<EstimateFormValues>();

  return formattedAmount(subtotal, currencyCode);
};

/**
 * Retrieves the estimate discount amount.
 * @returns {number}
 */
export const useEstimateDiscount = () => {
  const { values } = useFormikContext<EstimateFormValues>();
  const subtotal = useEstimateSubtotal();
  const discount = toSafeNumber(values.discount);

  return values?.discountType === 'percentage'
    ? (subtotal * discount) / 100
    : discount;
};

/**
 * Retrieves the estimate discount formatted.
 * @returns {string}
 */
export const useEstimateDiscountFormatted = () => {
  const discount = useEstimateDiscount();
  const {
    values: { currencyCode },
  } = useFormikContext<EstimateFormValues>();

  return formattedAmount(discount, currencyCode);
};

/**
 * Retrieves the estimate adjustment amount.
 * @returns {number}
 */
export const useEstimateAdjustment = () => {
  const { values } = useFormikContext<EstimateFormValues>();
  const adjustmentAmount = toSafeNumber(values.adjustment);

  return adjustmentAmount;
};

/**
 * Retrieves the estimate adjustment formatted.
 * @returns {string}
 */
export const useEstimateAdjustmentFormatted = () => {
  const adjustment = useEstimateAdjustment();
  const {
    values: { currencyCode },
  } = useFormikContext<EstimateFormValues>();

  return formattedAmount(adjustment, currencyCode);
};

/**
 * Retrieves the estimate total.
 * @returns {number}
 */
export const useEstimateTotal = () => {
  const subtotal = useEstimateSubtotal();
  const discount = useEstimateDiscount();
  const adjustment = useEstimateAdjustment();

  return subtotal + adjustment - discount;
};

/**
 * Retrieves the estimate total formatted.
 * @returns {string}
 */
export const useEstimateTotalFormatted = () => {
  const total = useEstimateTotal();
  const {
    values: { currencyCode },
  } = useFormikContext<EstimateFormValues>();

  return formattedAmount(total, currencyCode);
};

/**
 * Detarmines whether the estimate has foreign customer.
 * @returns {boolean}
 */
export const useEstimateIsForeignCustomer = () => {
  const { values } = useFormikContext<EstimateFormValues>();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignCustomer = React.useMemo(
    () => values.currencyCode !== baseCurrency,
    [values.currencyCode, baseCurrency],
  );
  return isForeignCustomer;
};

/**
 * Resets the form values.
 */
export const resetFormState = ({
  initialValues,
  values,
  resetForm,
}: {
  initialValues: EstimateFormValues;
  values: EstimateFormValues;
  resetForm: (next?: { values: EstimateFormValues }) => void;
}) => {
  resetForm({
    values: {
      // Reset the all values except the warehouse id.
      ...initialValues,
      warehouseId: values.warehouseId,
    },
  });
};

export const useEstimateFormBrandingTemplatesOptions = () => {
  const { brandingTemplates } = useEstimateFormContext();

  return React.useMemo(
    () => convertBrandingTemplatesToOptions(brandingTemplates),
    [brandingTemplates],
  );
};
