import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { AccountDialogFormContent } from './AccountDialogFormContent';
import { useAccountDialogContext } from './AccountDialogProvider';
import {
  EditAccountFormSchema,
  CreateAccountFormSchema,
} from './AccountForm.schema';
import {
  transformApiErrors,
  transformAccountToForm,
  transformFormToReq,
} from './utils';
import type { AccountFormValues } from './types';
import type { CreateAccountBody, EditAccountBody } from '@bigcapital/sdk-ts';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';
import '@/style/pages/Accounts/AccountFormDialog.scss';

// Default initial form values.
const defaultInitialValues: AccountFormValues = {
  accountType: '',
  parentAccountId: '',
  name: '',
  code: '',
  description: '',
  currencyCode: '',
  subaccount: false,
};

interface AccountFormDialogContentProps extends WithDialogActionsProps {}

/**
 * Account form dialog content.
 */
function AccountFormDialogContent({
  closeDialog,
}: AccountFormDialogContentProps): React.ReactElement {
  // Account form context.
  const {
    editAccountMutate,
    createAccountMutate,
    account,

    payload,
    isNewMode,
    dialogName,
  } = useAccountDialogContext();

  // Form validation schema in create and edit mode.
  const validationSchema = isNewMode
    ? CreateAccountFormSchema
    : EditAccountFormSchema;

  // Callbacks handles form submit.
  const handleFormSubmit = (
    values: AccountFormValues,
    { setSubmitting, setErrors }: FormikHelpers<AccountFormValues>,
  ) => {
    const form = transformFormToReq(values);
    const toastAccountName = values.code
      ? `${values.code} - ${values.name}`
      : values.name;

    // Handle request success.
    const handleSuccess = () => {
      closeDialog(dialogName);

      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'service_has_been_created_successfully'
            : 'service_has_been_edited_successfully',
          {
            name: toastAccountName,
            service: intl.get('account'),
          },
        ),
        intent: Intent.SUCCESS,
      });
    };
    // Handle request error.
    const handleError = (error: {
      data: { errors: Array<{ type: string }> };
    }) => {
      const {
        data: { errors },
      } = error;

      const errorsTransformed = transformApiErrors(errors);
      setErrors({ ...errorsTransformed });
      setSubmitting(false);
    };
    // `transformFormToReq` returns a loose ramda-inferred type; the runtime
    // shape matches the SDK body after the snake→camel conversion.
    if (payload.accountId) {
      editAccountMutate([payload.accountId as number, form as EditAccountBody])
        .then(handleSuccess)
        .catch(handleError);
    } else {
      createAccountMutate({ ...form } as CreateAccountBody)
        .then(handleSuccess)
        .catch(handleError);
    }
  };
  // Form initial values in create and edit mode.
  const initialValues: AccountFormValues = {
    ...defaultInitialValues,
    /**
     * We only care about the fields in the form. Previously unfilled optional
     * values such as `notes` come back from the API as null, so remove those
     * as well.
     */
    ...(transformToForm(
      transformAccountToForm(account, payload),
      defaultInitialValues,
    ) as Partial<AccountFormValues>),
  };
  // Handles dialog close.
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <AccountDialogFormContent
        dialogName={dialogName}
        action={payload?.action}
        onClose={handleClose}
      />
    </Formik>
  );
}

export const AccountDialogForm = compose(withDialogActions)(
  AccountFormDialogContent,
);
