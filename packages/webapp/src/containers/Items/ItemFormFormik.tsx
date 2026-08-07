import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { Formik, Form, type FormikHelpers } from 'formik';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import '@/style/pages/Items/Form.scss';
import { CreateItemFormSchema, EditItemFormSchema } from './ItemForm.schema';
import { ItemFormContent } from './ItemFormContent';
import { useItemFormContext } from './ItemFormProvider';
import {
  transformSubmitRequestErrors,
  useItemFormInitialValues,
} from './utils';
import type { ItemFormValues, ItemFormSubmitPayload } from './types';
import type { CreateItemBody, EditItemBody } from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import { CLASSES } from '@/constants/classes';
import { safeInvoke } from '@/utils';

type SubmitSuccessHandler = (
  values: ItemFormValues,
  form: FormikHelpers<ItemFormValues>,
  submitPayload: ItemFormSubmitPayload,
  response: void,
) => void;

type SubmitErrorHandler = (
  errors: unknown,
  values: ItemFormValues,
  form: FormikHelpers<ItemFormValues>,
  submitPayload: ItemFormSubmitPayload,
) => void;

interface ItemFormFormikProps {
  initialValues?: Partial<ItemFormValues>;
  onSubmitSuccess?: SubmitSuccessHandler;
  onSubmitError?: SubmitErrorHandler;
  className?: string;
}

/**
 * Item form.
 */
export function ItemFormFormik({
  initialValues: initialValuesComponent,
  onSubmitSuccess,
  onSubmitError,
  className,
}: ItemFormFormikProps) {
  // Item form context.
  const {
    itemId,
    item,
    createItemMutate,
    editItemMutate,
    submitPayload,
    isNewMode,
  } = useItemFormContext();

  // Initial values in create and edit mode.
  const initialValues = useItemFormInitialValues(item, initialValuesComponent);

  // Handles the form submit.
  const handleFormSubmit = (
    values: ItemFormValues,
    form: FormikHelpers<ItemFormValues>,
  ) => {
    const { setSubmitting, resetForm, setErrors } = form;
    const formValues = { ...values };

    setSubmitting(true);

    // Handle response succes.
    const onSuccess = (response: void) => {
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

      safeInvoke(onSubmitSuccess, values, form, submitPayload, response);
    };
    // Handle response error.
    const onError = (errors: unknown) => {
      setSubmitting(false);

      if (errors) {
        const _errors = transformSubmitRequestErrors(
          errors as { data: { errors: Array<{ type: string }> } },
        );
        setErrors({ ..._errors });
      }
      safeInvoke(onSubmitError, errors, values, form, submitPayload);
    };
    if (isNewMode) {
      createItemMutate(formValues as unknown as CreateItemBody)
        .then(onSuccess)
        .catch(onError);
    } else {
      editItemMutate([itemId!, formValues as unknown as EditItemBody])
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_ITEM,
        className,
      )}
    >
      <Formik<ItemFormValues>
        enableReinitialize={true}
        validationSchema={isNewMode ? CreateItemFormSchema : EditItemFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <ItemFormFields>
            <ItemFormContent />
          </ItemFormFields>
        </Form>
      </Formik>
    </div>
  );
}

const ItemFormFields = styled.div`
  .bp4-form-content,
  .bp6-form-content {
    min-width: 300px;
  }
  .bp4-form-group {
    margin-bottom: 20px;
  }
  .bp4-form-group.bp4-inline label.bp4-label {
    min-width: 140px;
  }
`;
