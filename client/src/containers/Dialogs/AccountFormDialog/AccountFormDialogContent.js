import React, { useCallback } from 'react';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { useIntl } from 'react-intl';
import { omit } from 'lodash';
import { AppToaster, DialogContent } from 'components';

import AccountFormDialogFields from './AccountFormDialogFields';

import withDialogActions from 'containers/Dialog/withDialogActions';
import {
  EditAccountFormSchema,
  CreateAccountFormSchema,
} from './AccountForm.schema';
import {
  useAccounts,
  useAccountsTypes,
  useCreateAccount,
  useAccount,
  useEditAccount
} from 'hooks/query';
import { compose, transformToForm } from 'utils';
import { transformApiErrors, transformAccountToForm } from './utils';

import 'style/pages/Accounts/AccountFormDialog.scss';


// Default initial form values.
const defaultInitialValues = {
  account_type: '',
  parent_account_id: '',
  name: '',
  code: '',
  description: '',
  subaccount: false,
};

/**
 * Account form dialog content.
 */
function AccountFormDialogContent({
  // #withDialogActions
  closeDialog,

  // #ownProp
  dialogName,
  accountId,
  action,
  parentAccountId,
  accountType,
}) {
  const { formatMessage } = useIntl();
  const isNewMode = !accountId;

  // Form validation schema in create and edit mode.
  const validationSchema = isNewMode
    ? CreateAccountFormSchema
    : EditAccountFormSchema;

  const { mutateAsync: createAccountMutate } = useCreateAccount();
  const { mutateAsync: editAccountMutate } = useEditAccount();
  
  // Fetches accounts list.
  const {
    data: accounts,
    isLoading: isAccountsLoading,
  } = useAccounts();

  // Fetches accounts types.
  const {
    data: accountsTypes,
    isLoading: isAccountsTypesLoading
  } = useAccountsTypes();

  // Fetches the specific account details.
  const {
    data: account,
    isLoading: isAccountLoading,
  } = useAccount(accountId, { enabled: !!accountId });

  // Callbacks handles form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = omit(values, ['subaccount']);
    const toastAccountName = values.code
      ? `${values.code} - ${values.name}`
      : values.name;

    // Handle request success.
    const handleSuccess = () => {
      closeDialog(dialogName);

      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'service_has_been_created_successfully'
              : 'service_has_been_edited_successfully',
          },
          {
            name: toastAccountName,
            service: formatMessage({ id: 'account' }),
          },
        ),
        intent: Intent.SUCCESS,
      });
    };
    // Handle request error.
    const handleError = (errors) => {
      // const errorsTransformed = transformApiErrors(errors);
      // setErrors({ ...errorsTransformed });
      // setSubmitting(false);
    };
    if (accountId) {
      editAccountMutate(accountId, form)
        .then(handleSuccess)
        .catch(handleError);
    } else {
      createAccountMutate({ ...form }).then(handleSuccess).catch(handleError);
    }
  };

  // Form initial values in create and edit mode.
  const initialValues = {
    ...defaultInitialValues,
    /**
     * We only care about the fields in the form. Previously unfilled optional
     * values such as `notes` come back from the API as null, so remove those
     * as well.
     */
    ...transformToForm(
      transformAccountToForm(account, {
        action,
        parentAccountId,
        accountType,
      }),
      defaultInitialValues,
    ),
  };

  // Handles dialog close.
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  const isFetching =
    isAccountsLoading ||
    isAccountsTypesLoading ||
    isAccountLoading;

  return (
    <DialogContent isLoading={isFetching}>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <AccountFormDialogFields
          accounts={accounts}
          accountsTypes={accountsTypes}
          dialogName={dialogName}
          action={action}
          onClose={handleClose}
        />
      </Formik>
    </DialogContent>
  );
}

export default compose(
  withDialogActions,
)(AccountFormDialogContent);
