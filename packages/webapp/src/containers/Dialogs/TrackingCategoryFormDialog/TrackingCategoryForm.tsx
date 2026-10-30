import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import { TrackingCategoryFormSchema } from './TrackingCategoryForm.schema';
import { TrackingCategoryFormContent } from './TrackingCategoryFormContent';
import { useTrackingCategoryFormContext } from './TrackingCategoryFormProvider';
import { handleTrackingCategoryFormErrors } from './utils';
import type {
  TrackingCategoryFormOption,
  TrackingCategoryFormValues,
} from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type {
  CreateTrackingCategoryBody,
  EditTrackingCategoryBody,
} from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

const defaultInitialValues: TrackingCategoryFormValues = {
  name: '',
  description: '',
  mandatory: false,
  options: [{ name: '', active: true }],
};

interface TrackingCategoryFormProps extends WithDialogActionsProps {}

function TrackingCategoryFormInner({
  closeDialog,
}: TrackingCategoryFormProps): React.ReactElement {
  const {
    dialogName,
    category,
    categoryId,
    createTrackingCategoryMutate,
    editTrackingCategoryMutate,
  } = useTrackingCategoryFormContext();

  const initialValues: TrackingCategoryFormValues = category
    ? {
        name: category.name ?? '',
        description: category.description ?? '',
        mandatory: !!category.mandatory,
        options: (category.options ?? []).map((option) => ({
          id: option.id,
          name: option.name,
          active: !!option.active,
        })),
      }
    : defaultInitialValues;

  // Handles the form submit.
  const handleSubmit = (
    values: TrackingCategoryFormValues,
    { setSubmitting, setFieldError }: FormikHelpers<TrackingCategoryFormValues>,
  ) => {
    const options: TrackingCategoryFormOption[] = values.options
      .map((option) => ({
        ...(option.id ? { id: option.id } : {}),
        name: option.name.trim(),
        active: !!option.active,
      }))
      .filter((option) => option.id || option.name);

    const form = {
      name: values.name.trim(),
      description: values.description?.trim() ?? '',
      mandatory: !!values.mandatory,
      options,
    };

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          categoryId
            ? 'tracking_categories.message.updated'
            : 'tracking_categories.message.created',
          { name: form.name },
        ),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      handleTrackingCategoryFormErrors(errors, {
        setFieldError,
        setSubmitting,
      });
    };

    if (categoryId) {
      editTrackingCategoryMutate([categoryId, form as EditTrackingCategoryBody])
        .then(onSuccess)
        .catch(onError);
    } else {
      createTrackingCategoryMutate(form as CreateTrackingCategoryBody)
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={TrackingCategoryFormSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      component={TrackingCategoryFormContent}
    />
  );
}

export const TrackingCategoryForm = FF.pipe(
  TrackingCategoryFormInner,
  withDialogActions,
);
