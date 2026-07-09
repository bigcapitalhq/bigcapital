import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/Items/ItemAdjustmentDialog.scss';
import { CreateInventoryAdjustmentFormSchema } from './InventoryAdjustmentForm.schema';
import { InventoryAdjustmentFormContent } from './InventoryAdjustmentFormContent';
import { useInventoryAdjContext } from './InventoryAdjustmentFormProvider';
import { transformFormToRequest } from './utils';
import type { InventoryAdjustmentFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

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
  const { dialogName, item, itemId, submitPayload, createInventoryAdjMutate } =
    useInventoryAdjContext();

  const initialValues: InventoryAdjustmentFormValues = {
    ...defaultInitialValues,
    itemId: itemId ?? '',
    quantityOnHand:
      (item as { quantity_on_hand?: string | number } | undefined)
        ?.quantity_on_hand ?? 0,
  };

  const handleFormSubmit = (
    values: InventoryAdjustmentFormValues,
    { setSubmitting }: FormikHelpers<InventoryAdjustmentFormValues>,
  ) => {
    setSubmitting(true);
    createInventoryAdjMutate(
      transformFormToRequest({
        ...values,
        publish: submitPayload.publish ?? false,
      }),
    )
      .then(() => {
        closeDialog(dialogName);

        AppToaster.show({
          message: intl.get(
            'the_adjustment_transaction_has_been_created_successfully',
          ),
          intent: Intent.SUCCESS,
        });
      })
      .finally(() => {
        setSubmitting(true);
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

export const InventoryAdjustmentForm = compose(withDialogActions)(
  InventoryAdjustmentFormInner,
);
