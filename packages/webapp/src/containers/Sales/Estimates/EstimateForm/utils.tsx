// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import moment from 'moment';
import { useFormikContext } from 'formik';
import { omit, first } from 'lodash';
import {
  defaultFastFieldShouldUpdate,
  repeatValue,
  transformToForm,
  formattedAmount,
} from '@/utils';
import { useEstimateFormContext } from './EstimateFormProvider';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';
import { useCurrentOrganization } from '@/hooks/state';
import { getEntriesTotal } from '@/containers/Entries/utils';

export const MIN_LINES_NUMBER = 1;

export const defaultEstimateEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

export const defaultEstimate = {
  customer_id: '',
  estimate_date: moment(new Date()).format('YYYY-MM-DD'),
  expiration_date: moment(new Date()).format('YYYY-MM-DD'),
  estimate_number: '',
  // Holds the estimate number that entered manually only.
  estimate_number_manually: '',
  delivered: '',
  reference: '',
  note: '',
  terms_conditions: '',
  branch_id: '',
  warehouse_id: '',
  exchange_rate: 1,
  currency_code: '',
  entries: [...repeatValue(defaultEstimateEntry, MIN_LINES_NUMBER)],
};

const ERRORS = {
  ESTIMATE_NUMBER_IS_NOT_UNIQUE: 'ESTIMATE.NUMBER.IS.NOT.UNIQUE',
  SALE_ESTIMATE_NO_IS_REQUIRED: 'SALE_ESTIMATE_NO_IS_REQUIRED',
};

export const transformToEditForm = (estimate) => {
  const initialEntries = [
    ...estimate.entries.map((estimate) => ({
      ...transformToForm(estimate, defaultEstimateEntry),
    })),
    ...repeatValue(
      defaultEstimateEntry,
      Math.max(MIN_LINES_NUMBER - estimate.entries.length, 0),
    ),
  ];
  const entries = R.compose(
    ensureEntriesHaveEmptyLine(defaultEstimateEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...transformToForm(estimate, defaultEstimate),
    entries,
  };
};

/**
 * Determines customers fast field when update.
 */
export const customersFieldShouldUpdate = (newProps, oldProps) => {
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
 * @param {*} errors
 * @param {*} param1
 */
export const handleErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === ERRORS.ESTIMATE_NUMBER_IS_NOT_UNIQUE)) {
    setErrors({
      estimate_number: intl.get('estimate_number_is_not_unique'),
    });
  }
  if (
    errors.some((error) => error.type === ERRORS.SALE_ESTIMATE_NO_IS_REQUIRED)
  ) {
    setErrors({
      estimate_number: intl.get(
        'estimate.field.error.estimate_number_required',
      ),
    });
  }
};

/**
 * Transform the form values to request body.
 */
export const transformsFormValuesToRequest = (values) => {
  const entries = values.entries.filter(
    (item) => item.item_id && item.quantity,
  );
  return {
    ...omit(values, ['estimate_number_manually', 'estimate_number']),
    // The `estimate_number_manually` will be presented just if the auto-increment
    // is disable, always both attributes hold the same value in manual mode.
    ...(values.estimate_number_manually && {
      estimate_number: values.estimate_number,
    }),
    entries: entries.map((entry) => ({ ...omit(entry, ['amount']) })),
  };
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { warehouses, isWarehousesSuccess } = useEstimateFormContext();

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
  const { branches, isBranchesSuccess } = useEstimateFormContext();

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
 * Retrieves the estimate totals.
 */
export const useEstimateTotals = () => {
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
 * Determines whether the estimate has foreign customer.
 * @returns {boolean}
 */
export const useEstimateIsForeignCustomer = () => {
  const { values } = useFormikContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignCustomer = React.useMemo(
    () => values.currency_code !== currentOrganization.base_currency,
    [values.currency_code, currentOrganization.base_currency],
  );
  return isForeignCustomer;
};

/**
 * Resets the form values.
 */
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
