import { useFormikContext } from 'formik';
import { first } from 'lodash';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useInventoryAdjContext } from './InventoryAdjustmentFormProvider';
import type { InventoryAdjustmentFormValues } from './types';
import type { CreateQuickInventoryAdjustmentBody } from '@bigcapital/sdk-ts';

export const decrementQuantity = (
  newQuantity: number,
  quantityOnHand: number,
): number => quantityOnHand - newQuantity;

export const incrementQuantity = (
  newQuantity: number,
  quantityOnHand: number,
): number => quantityOnHand + newQuantity;

export const diffQuantity = (
  newQuantity: number,
  quantityOnHand: number,
  type: 'increment' | 'decrement',
): number =>
  type === 'decrement'
    ? decrementQuantity(newQuantity, quantityOnHand)
    : incrementQuantity(newQuantity, quantityOnHand);

interface PrimarySelectable {
  id: number | string;
  primary?: boolean;
}

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext<InventoryAdjustmentFormValues>();
  const { warehouses, isWarehousesSuccess } = useInventoryAdjContext();

  React.useEffect(() => {
    if (isWarehousesSuccess) {
      const primaryWarehouse =
        warehouses.find((w) => w.primary) || first(warehouses);

      if (primaryWarehouse) {
        setFieldValue('warehouseId', primaryWarehouse.id);
      }
    }
  }, [isWarehousesSuccess, setFieldValue, warehouses]);
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<InventoryAdjustmentFormValues>();
  const { branches, isBranchesSuccess } = useInventoryAdjContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export const getAdjustmentTypeOptions = () => [
  { name: intl.get('decrement'), value: 'decrement' as const },
  { name: intl.get('increment'), value: 'increment' as const },
];

export const useGetAdjustmentTypeOptions = () => {
  return useMemo(() => getAdjustmentTypeOptions(), []);
};

type InventoryAdjustmentSubmitValues = Omit<
  InventoryAdjustmentFormValues,
  'quantityOnHand' | 'newQuantity'
> & { action?: string };

const toNumber = (v: string | number): number =>
  typeof v === 'number' ? v : Number(v) || 0;

// Coerce form-friendly string|number fields to the strict SDK body shape.
export const transformFormToRequest = (
  values: InventoryAdjustmentSubmitValues,
): CreateQuickInventoryAdjustmentBody => ({
  date: values.date,
  type: values.type,
  adjustmentAccountId: toNumber(values.adjustmentAccountId),
  itemId: toNumber(values.itemId),
  reason: values.reason,
  // SDK requires `description`; form has no field for it. Empty string
  // preserves the original behavior (server-side validation).
  description: '',
  cost: toNumber(values.cost),
  quantity: toNumber(values.quantity),
  referenceNo: values.referenceNo,
  publish: values.publish,
  branchId: toNumber(values.branchId),
  warehouseId: toNumber(values.warehouseId),
});
