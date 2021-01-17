import React, { useCallback } from 'react';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { omit } from 'lodash';
import { useQuery, queryCache } from 'react-query';
import { AppToaster, DialogContent } from 'components';

import AccountFormDialogFields from './AccountFormDialogFields';

import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAccountDetail from 'containers/Accounts/withAccountDetail';
import withDialogActions from 'containers/Dialog/withDialogActions';
import {
  EditAccountFormSchema,
  CreateAccountFormSchema,
} from './AccountForm.schema';

import { compose, transformToForm } from 'utils';
import { transformApiErrors, transformAccountToForm } from './utils';

import 'style/pages/Accounts/AccountFormDialog.scss';

const defaultInitialValues = {
  account_type_id: '',
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
  // #withAccountDetail
  account,

  // #withAccountsActions
  requestFetchAccounts,
  requestFetchAccountTypes,
  requestFetchAccount,
  requestSubmitAccount,
  requestEditAccount,

  closeDialog,

  // #ownProp
  dialogName,
  accountId,
  action,
  parentAccountId,
  accountTypeId,
}) {
  const { formatMessage } = useIntl();
  const isNewMode = !accountId;

  // Form validation schema in create and edit mode.
  const validationSchema = isNewMode
    ? CreateAccountFormSchema
    : EditAccountFormSchema;

  // Callbacks handles form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = omit(values, ['subaccount']);
    const toastAccountName = values.code
      ? `${values.code} - ${values.name}`
      : values.name;

    // Handle request success.
    const handleSuccess = () => {
      closeDialog(dialogName);
      queryCache.invalidateQueries('accounts-table');
      queryCache.invalidateQueries('accounts-list');

      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'service_has_been_successful_created'
              : 'service_has_been_successful_edited',
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
      const errorsTransformed = transformApiErrors(errors);
      setErrors({ ...errorsTransformed });
      setSubmitting(false);
    };
    if (accountId) {
      requestEditAccount(accountId, form)
        .then(handleSuccess)
        .catch(handleError);
    } else {
      requestSubmitAccount({ form }).then(handleSuccess).catch(handleError);
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
        accountTypeId,
      }),
      defaultInitialValues,
    ),
  };

  // Handles dialog close.
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  // Fetches accounts list.
  const fetchAccountsList = useQuery('accounts-list', () =>
    requestFetchAccounts(),
  );

  // Fetches accounts types.
  const fetchAccountsTypes = useQuery('accounts-types-list', () =>
    requestFetchAccountTypes(),
  );

  // Fetch the given account id on edit mode.
  const fetchAccount = useQuery(
    ['account', accountId],
    (key, _id) => requestFetchAccount(_id),
    { enabled: accountId },
  );

  const isFetching =
    fetchAccountsList.isFetching ||
    fetchAccountsTypes.isFetching ||
    fetchAccount.isFetching;

  return (
    <DialogContent isLoading={isFetching}>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <AccountFormDialogFields
          dialogName={dialogName}
          isNewMode={isNewMode}
          onClose={handleClose}
        />
      </Formik>
    </DialogContent>
  );
}

export default compose(
  withAccountsActions,
  withAccountDetail,
  withDialogActions,
)(AccountFormDialogContent);
