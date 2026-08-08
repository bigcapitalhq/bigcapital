import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import {
  CreateItemCategoryFormSchema,
  EditItemCategoryFormSchema,
} from './itemCategoryForm.schema';
import { ItemCategoryForm as ItemCategoryFormContent } from './ItemCategoryFormContent';
import { useItemCategoryContext } from './ItemCategoryProvider';
import type { ItemCategoryFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type {
  CreateItemCategoryBody,
  EditItemCategoryBody,
} from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

const defaultInitialValues: ItemCategoryFormValues = {
  name: '',
  description: '',
  costAccountId: '',
  sellAccountId: '',
  inventoryAccountId: '',
  costMethod: '',
};

// Coerce form-friendly string|number fields to the strict SDK body shape.
// Empty strings become `undefined` so the account fields are omitted from the
// request body — sending `0` makes the server insert an account_id of 0, which
// violates the foreign key constraint.
const toAccountId = (v: string | number): number | undefined =>
  typeof v === 'number' ? v || undefined : Number(v) || undefined;

const transformFormToCreateBody = (
  values: ItemCategoryFormValues,
): CreateItemCategoryBody =>
  // The SDK body type requires the account fields though the server DTO makes
  // them optional — `undefined` fields are omitted by `JSON.stringify` at
  // request time, so the cast is purely to satisfy the generated types.
  ({
    name: values.name,
    description: values.description,
    costAccountId: toAccountId(values.costAccountId),
    sellAccountId: toAccountId(values.sellAccountId),
    inventoryAccountId: toAccountId(values.inventoryAccountId),
    costMethod: values.costMethod,
  }) as CreateItemCategoryBody;

const transformFormToEditBody = (
  values: ItemCategoryFormValues,
): EditItemCategoryBody => transformFormToCreateBody(values);

interface ResponseError {
  type: string;
}

interface ItemCategoryFormProps extends WithDialogActionsProps {}

function ItemCategoryFormInner({
  closeDialog,
}: ItemCategoryFormProps): React.ReactElement {
  const {
    isNewMode,
    itemCategory,
    itemCategoryId,
    dialogName,
    createItemCategoryMutate,
    editItemCategoryMutate,
  } = useItemCategoryContext();

  const initialValues = useMemo<ItemCategoryFormValues>(
    () => ({
      ...defaultInitialValues,
      ...transformToForm(itemCategory, defaultInitialValues),
    }),
    [itemCategory],
  );

  const transformErrors = (
    errors: ResponseError[],
    {
      setErrors,
    }: {
      setErrors: (
        errors: Partial<Record<keyof ItemCategoryFormValues, string>>,
      ) => void;
    },
  ) => {
    if (errors.find((error) => error.type === 'CATEGORY_NAME_EXISTS')) {
      setErrors({
        name: intl.get('category_name_exists'),
      });
    }
  };

  const handleFormSubmit = (
    values: ItemCategoryFormValues,
    { setSubmitting, setErrors }: FormikHelpers<ItemCategoryFormValues>,
  ) => {
    setSubmitting(true);
    const form = { ...values };

    const afterSubmit = () => {
      closeDialog(dialogName);
    };
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_item_category_has_been_created_successfully'
            : 'the_item_category_has_been_edited_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      afterSubmit();
    };
    const onError = (error: { data: { errors: ResponseError[] } }) => {
      const {
        data: { errors },
      } = error;

      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };
    if (isNewMode) {
      createItemCategoryMutate(transformFormToCreateBody(form))
        .then(onSuccess)
        .catch(onError);
    } else {
      editItemCategoryMutate([
        itemCategoryId as number,
        transformFormToEditBody(form),
      ])
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={
        isNewMode ? CreateItemCategoryFormSchema : EditItemCategoryFormSchema
      }
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <ItemCategoryFormContent />
    </Formik>
  );
}

export const ItemCategoryForm = compose(withDialogActions)(
  ItemCategoryFormInner,
);
