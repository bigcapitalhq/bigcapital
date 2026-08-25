import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { transformErrors } from './utils';
import { CreateWarehouseFormSchema } from './WarehouseForm.schema';
import { WarehouseFormContent } from './WarehouseFormContent';
import { useWarehouseFormContext } from './WarehouseFormProvider';
import type { WarehouseFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

const defaultInitialValues: WarehouseFormValues = {
  name: '',
  code: '',
  address: '',
  city: '',
  country: '',
  phoneNumber: '',
  website: '',
  email: '',
  primary: false,
};

interface WarehouseFormProps extends WithDialogActionsProps {}

function WarehouseFormInner({
  closeDialog,
}: WarehouseFormProps): React.ReactElement {
  const {
    dialogName,
    warehouse,
    warehouseId,
    createWarehouseMutate,
    editWarehouseMutate,
  } = useWarehouseFormContext();

  const initialValues: WarehouseFormValues = {
    ...defaultInitialValues,
    ...transformToForm(warehouse, defaultInitialValues),
    // The API returns `primary` as a 0/1 integer which fails the server-side
    // `@IsBoolean()` validation — normalize it back to a boolean.
    primary: warehouse?.primary ? true : false,
  };

  const handleFormSubmit = (
    values: WarehouseFormValues,
    { setSubmitting, setErrors }: FormikHelpers<WarehouseFormValues>,
  ) => {
    const form = { ...values };

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('warehouse.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      if (errors) {
        // no-op (preserved from @ts-nocheck original).
      }
      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };

    if (warehouseId) {
      editWarehouseMutate([warehouseId, form]).then(onSuccess).catch(onError);
    } else {
      createWarehouseMutate(form).then(onSuccess).catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={CreateWarehouseFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={WarehouseFormContent}
    />
  );
}

export const WarehouseForm = compose(withDialogActions)(WarehouseFormInner);
