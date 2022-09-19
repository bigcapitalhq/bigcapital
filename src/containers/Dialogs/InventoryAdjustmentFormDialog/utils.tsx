// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { useInventoryAdjContext } from './InventoryAdjustmentFormProvider';
import { first } from 'lodash';

export const decrementQuantity = (newQuantity, quantityOnHand) => {
  return quantityOnHand - newQuantity;
};

export const incrementQuantity = (newQuantity, quantityOnHand) => {
  return quantityOnHand + newQuantity;
};

export const diffQuantity = (newQuantity, quantityOnHand, type) => {
  return type === 'decrement'
    ? decrementQuantity(newQuantity, quantityOnHand)
    : incrementQuantity(newQuantity, quantityOnHand);
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { warehouses, isWarehousesSuccess } = useInventoryAdjContext();

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
  const { branches, isBranchesSuccess } = useInventoryAdjContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};
