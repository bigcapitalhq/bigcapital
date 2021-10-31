import React from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import intl from 'react-intl-universal';
import classNames from 'classnames';

import 'style/pages/Items/PageForm.scss';

import { CLASSES } from 'common/classes';
import AppToaster from 'components/AppToaster';
import ItemFormPrimarySection from './ItemFormPrimarySection';
import ItemFormBody from './ItemFormBody';
import ItemFormFloatingActions from './ItemFormFloatingActions';
import ItemFormInventorySection from './ItemFormInventorySection';

import {
  transformSubmitRequestErrors,
  useItemFormInitialValues,
} from './utils';
import { EditItemFormSchema, CreateItemFormSchema } from './ItemForm.schema';

import { useItemFormContext } from './ItemFormProvider';

/**
 * Item form.
 */
export default function ItemForm() {
  // Item form context.
  const {
    itemId,
    item,
    accounts,
    createItemMutate,
    editItemMutate,
    submitPayload,
    isNewMode,
  } = useItemFormContext();

  // History context.
  const history = useHistory();

  // Initial values in create and edit mode.
  const initialValues = useItemFormInitialValues(item);

  // Handles the form submit.
  const handleFormSubmit = (
    values,
    { setSubmitting, resetForm, setErrors },
  ) => {
    setSubmitting(true);
    const form = { ...values };

    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_item_has_been_created_successfully'
            : 'the_item_has_been_edited_successfully',
          {
            number: itemId,
          },
        ),
        intent: Intent.SUCCESS,
      });
      resetForm();
      setSubmitting(false);

      // Submit payload.
      if (submitPayload.redirect) {
        history.push('/items');
      }
    };

    // Handle response error.
    const onError = (errors) => {
      setSubmitting(false);
      if (errors) {
        const _errors = transformSubmitRequestErrors(errors);
        setErrors({ ..._errors });
      }
    };
    if (isNewMode) {
      createItemMutate(form).then(onSuccess).catch(onError);
    } else {
      editItemMutate([itemId, form]).then(onSuccess).catch(onError);
    }
  };

  return (
    <div class={classNames(CLASSES.PAGE_FORM_ITEM)}>
      <Formik
        enableReinitialize={true}
        validationSchema={isNewMode ? CreateItemFormSchema : EditItemFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <div class={classNames(CLASSES.PAGE_FORM_BODY)}>
            <ItemFormPrimarySection />
            <ItemFormBody accounts={accounts} />
            <ItemFormInventorySection accounts={accounts} />
          </div>

          <ItemFormFloatingActions />
        </Form>
      </Formik>
    </div>
  );
}
