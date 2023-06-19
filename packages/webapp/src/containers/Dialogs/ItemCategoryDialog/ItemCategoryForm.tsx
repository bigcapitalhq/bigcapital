// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';

import { AppToaster } from '@/components';
import { useItemCategoryContext } from './ItemCategoryProvider';
import { compose, transformToForm } from '@/utils';
import {
  CreateItemCategoryFormSchema,
  EditItemCategoryFormSchema,
} from './itemCategoryForm.schema';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import ItemCategoryFormContent from './ItemCategoryFormContent';

const defaultInitialValues = {
  name: '',
  description: '',
  cost_account_id: '',
  sell_account_id: '',
  inventory_account_id: '',
};

/**
 * Item category form.
 */
function ItemCategoryForm({
  // #withDialogActions
  closeDialog,
}) {
  const {
    isNewMode,
    itemCategory,
    itemCategoryId,
    dialogName,
    createItemCategoryMutate,
    editItemCategoryMutate,
  } = useItemCategoryContext();

  // Initial values.
  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      ...transformToForm(itemCategory, defaultInitialValues),
    }),
    [itemCategory],
  );

  // Transforms response errors.
  const transformErrors = (errors, { setErrors }) => {
    if (errors.find((error) => error.type === 'CATEGORY_NAME_EXISTS')) {
      setErrors({
        name: intl.get('category_name_exists'),
      });
    }
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    const form = { ...values };

    // Handle close the dialog after success response.
    const afterSubmit = () => {
      closeDialog(dialogName);
    };
    // Handle the response success.
    const onSuccess = ({ response }) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_item_category_has_been_created_successfully'
            : 'the_item_category_has_been_edited_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      afterSubmit(response);
    };
    // Handle the response error.
    const onError = (error) => {
      const {
        response: {
          data: { errors },
        },
      } = error;

      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };
    if (isNewMode) {
      createItemCategoryMutate(form).then(onSuccess).catch(onError);
    } else {
      editItemCategoryMutate([itemCategoryId, form])
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

export default compose(withDialogActions)(ItemCategoryForm);
