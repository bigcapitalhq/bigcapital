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
import { useSyncItemImages } from '@/hooks/query';
import { safeInvoke } from '@/utils';

type SubmitSuccessHandler = (
  values: ItemFormValues,
  form: FormikHelpers<ItemFormValues>,
  submitPayload: ItemFormSubmitPayload,
  response?: void,
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
    itemImagesEnabled,
  } = useItemFormContext();

  // Syncs the pending image uploads/deletions after the item is saved.
  const { mutateAsync: syncItemImagesMutate } = useSyncItemImages();

  // Initial values in create and edit mode.
  const initialValues = useItemFormInitialValues(item, initialValuesComponent);

  // Handles the form submit.
  const handleFormSubmit = async (
    values: ItemFormValues,
    form: FormikHelpers<ItemFormValues>,
  ) => {
    const { setSubmitting, resetForm, setErrors } = form;
    const { imageFiles, removedImageIds, ...formValues } = values;

    setSubmitting(true);

    // Syncs the pending item image changes.
    const syncItemImages = async (savedItemId: number) => {
      if (!itemImagesEnabled) {
        return;
      }
      const hasNewImages =
        Boolean(imageFiles.front) ||
        Boolean(imageFiles.rear) ||
        imageFiles.other.length > 0;

      if (!hasNewImages && removedImageIds.length === 0) {
        return;
      }
      try {
        await syncItemImagesMutate({
          itemId: savedItemId,
          front: imageFiles.front,
          rear: imageFiles.rear,
          other: imageFiles.other,
          removedImageIds,
        });
      } catch (error) {
        // The item itself was saved; surface the image failure without
        // discarding the item save.
        AppToaster.show({
          message: intl.get('item_images_upload_failed'),
          intent: Intent.WARNING,
        });
      }
    };

    // Handle response succes.
    const onSuccess = () => {
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

      safeInvoke(onSubmitSuccess, values, form, submitPayload, undefined);
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

    try {
      let savedItemId: number | undefined;

      if (isNewMode) {
        const response = await createItemMutate(
          formValues as unknown as CreateItemBody,
        );
        savedItemId = response?.id;
      } else {
        await editItemMutate([itemId!, formValues as unknown as EditItemBody]);
        savedItemId = itemId;
      }
      if (savedItemId) {
        await syncItemImages(savedItemId);
      }
      onSuccess();
    } catch (error) {
      onError(error);
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
