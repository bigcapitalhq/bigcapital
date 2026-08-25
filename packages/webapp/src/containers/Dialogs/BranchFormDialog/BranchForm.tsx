import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateBranchFormSchema } from './BranchForm.schema';
import { BranchFormContent } from './BranchFormContent';
import { useBranchFormContext } from './BranchFormProvider';
import { transformErrors } from './utils';
import type { CreateBranchBody, EditBranchBody } from '@bigcapital/sdk-ts';
import type { BranchFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

const defaultInitialValues: BranchFormValues = {
  name: '',
  code: '',
  address: '',
  phoneNumber: '',
  email: '',
  website: '',
  city: '',
  country: '',
  primary: false,
};

interface BranchFormProps extends WithDialogActionsProps {}

function BranchFormInner({ closeDialog }: BranchFormProps): React.ReactElement {
  const { dialogName, branch, branchId, createBranchMutate, editBranchMutate } =
    useBranchFormContext();

  // Initial form values.
  const initialValues: BranchFormValues = {
    ...defaultInitialValues,
    ...transformToForm(branch, defaultInitialValues),
    // The API returns `primary` as a 0/1 integer which fails the server-side
    // `@IsBoolean()` validation — normalize it back to a boolean.
    primary: branch?.primary ? true : false,
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values: BranchFormValues,
    { setSubmitting, setErrors }: FormikHelpers<BranchFormValues>,
  ) => {
    const form = { ...values };

    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('branch.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
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

    const body = form as CreateBranchBody | EditBranchBody;

    if (branchId) {
      editBranchMutate([branchId, body as EditBranchBody])
        .then(onSuccess)
        .catch(onError);
    } else {
      createBranchMutate(body as CreateBranchBody)
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={CreateBranchFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={BranchFormContent}
    />
  );
}
export const BranchForm = compose(withDialogActions)(BranchFormInner);
