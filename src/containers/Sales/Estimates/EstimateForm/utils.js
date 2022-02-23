import React from 'react';
import { useFormikContext } from 'formik';
import moment from 'moment';
import * as R from 'ramda';
import { omit, first } from 'lodash';
import intl from 'react-intl-universal';
import {
  defaultFastFieldShouldUpdate,
  transactionNumber,
  repeatValue,
  transformToForm,
} from 'utils';
import { useEstimateFormContext } from './EstimateFormProvider';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from 'containers/Entries/utils';

export const MIN_LINES_NUMBER = 4;

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
  delivered: '',
  reference: '',
  note: '',
  terms_conditions: '',
  branch_id: '',
  warehouse_id: '',
  exchange_rate: '',
  entries: [...repeatValue(defaultEstimateEntry, MIN_LINES_NUMBER)],
};

const ERRORS = {
  ESTIMATE_NUMBER_IS_NOT_UNQIUE: 'ESTIMATE.NUMBER.IS.NOT.UNQIUE',
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
 * Syncs estimate number of the settings with the context form.
 */
export const useObserveEstimateNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const estimateNo = transactionNumber(prefix, nextNumber);
    setFieldValue('estimate_number', estimateNo);
  }, [setFieldValue, prefix, nextNumber]);
};

/**
 * Detarmines customers fast field when update.
 */
export const customersFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.customers !== oldProps.customers ||
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
  if (errors.some((e) => e.type === ERRORS.ESTIMATE_NUMBER_IS_NOT_UNQIUE)) {
    setErrors({
      estimate_number: intl.get('estimate_number_is_not_unqiue'),
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
export const transfromsFormValuesToRequest = (values) => {
  const entries = values.entries.filter(
    (item) => item.item_id && item.quantity,
  );
  return {
    ...omit(values, ['estimate_number_manually', 'estimate_number']),
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
