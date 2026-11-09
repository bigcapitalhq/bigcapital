import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import * as FF from 'fp-ts/function';
import moment from 'moment';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/Items/ItemAdjustmentDialog.scss';
import { CreateInventoryAdjustmentFormSchema } from './InventoryAdjustmentForm.schema';
import { InventoryAdjustmentFormContent } from './InventoryAdjustmentFormContent';
import { useInventoryAdjContext } from './InventoryAdjustmentFormProvider';
import { diffQuantity, transformFormToRequest } from './utils';
import type { InventoryAdjustmentFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { toSafeNumber } from '@/utils';

const defaultInitialValues: InventoryAdjustmentFormValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  type: 'decrement',
  adjustmentAccountId: '',
  itemId: '',
  reason: '',
  cost: '',
  quantity: '',
  referenceNo: '',
  quantityOnHand: '',
  publish: false,
  branchId: '',
  warehouseId: '',
};

interface InventoryAdjustmentFormProps extends WithDialogActionsProps {}

function InventoryAdjustmentFormInner({
  closeDialog,
}: InventoryAdjustmentFormProps): React.ReactElement {
  const {
    dialogName,
    item,
    itemId,
    inventoryId,
    inventoryAdjustment,
    isEditMode,
    submitPayload,
    createInventoryAdjMutate,
    editInventoryAdjMutate,
  } = useInventoryAdjContext();

  const quantityOnHand = toSafeNumber(item?.quantityOnHand ?? 0);

  const initialValues: InventoryAdjustmentFormValues = useMemo(() => {
    if (isEditMode && inventoryAdjustment) {
      const entry = inventoryAdjustment.entries?.[0];
      const type = inventoryAdjustment.type;
      const entryQuantity = entry?.quantity;

      return {
        ...defaultInitialValues,
        date: moment(inventoryAdjustment.date).format('YYYY-MM-DD'),
        type,
        adjustmentAccountId: inventoryAdjustment.adjustmentAccountId ?? '',
        itemId: entry?.itemId ?? itemId ?? '',
        reason: inventoryAdjustment.reason ?? '',
        cost: entry?.cost ?? '',
        quantity: entryQuantity ?? '',
        referenceNo: inventoryAdjustment.referenceNo ?? '',
        quantityOnHand,
        newQuantity:
          entryQuantity != null
            ? diffQuantity(entryQuantity, quantityOnHand, type)
            : '',
        publish: !!inventoryAdjustment.isPublished,
        branchId: inventoryAdjustment.branchId ?? '',
        warehouseId: inventoryAdjustment.warehouseId ?? '',
      };
    }
    return {
      ...defaultInitialValues,
      itemId: itemId ?? '',
      quantityOnHand,
    };
  }, [isEditMode, inventoryAdjustment, itemId, quantityOnHand]);

  const handleFormSubmit = (
    values: InventoryAdjustmentFormValues,
    { setSubmitting }: FormikHelpers<InventoryAdjustmentFormValues>,
  ) => {
    setSubmitting(true);

    // Publishing is a one-way action; keep the published state on edit.
    const publish =
      submitPayload.publish ??
      (isEditMode ? !!inventoryAdjustment?.isPublished : false);

    const request = transformFormToRequest({ ...values, publish });

    const mutationPromise =
      isEditMode && inventoryId
        ? editInventoryAdjMutate([inventoryId, request])
        : createInventoryAdjMutate(request);

    mutationPromise
      .then(() => {
        closeDialog(dialogName);

        AppToaster.show({
          message: intl.get(
            isEditMode
              ? 'the_adjustment_transaction_has_been_edited_successfully'
              : 'the_adjustment_transaction_has_been_created_successfully',
          ),
          intent: Intent.SUCCESS,
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik
      validationSchema={CreateInventoryAdjustmentFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <InventoryAdjustmentFormContent />
    </Formik>
  );
}

export const InventoryAdjustmentForm = FF.pipe(
  InventoryAdjustmentFormInner,
  withDialogActions,
);
