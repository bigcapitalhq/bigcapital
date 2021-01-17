import React from 'react';
import { Intent } from '@blueprintjs/core';
import { pick, snakeCase } from 'lodash';
import { queryCache, useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import { AppToaster, DialogContent } from 'components';

import withUsersActions from 'containers/Users/withUsersActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose, objectKeysTransform } from 'utils';
import { InviteUserFormSchema } from './InviteUserDialog.schema';
import UserFormDialogForm from './InviteUserDialogForm';

import { transformApiErrors } from './utils';

import 'style/pages/Users/InviteFormDialog.scss'

/**
 * Invite user dialog content.
 */
function InviteUserDialogContent({
  // #wihtCurrenciesActions
  requestFetchUser,
  requestSubmitInvite,

  // #withDialogActions
  closeDialog,

  // #ownProp
  action,
  userId,
  dialogName,
}) {
  const { formatMessage } = useIntl();

  // Fetch user details.
  const fetchHook = useQuery(
    ['user', userId],
    (key, id) => requestFetchUser(id),
    { enabled: userId },
  );

  const initialValues = {
    status: 1,
    ...(action === 'edit' &&
      pick(
        objectKeysTransform(userId, snakeCase),
        Object.keys(InviteUserFormSchema.fields),
      )),
  };

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    const form = { ...values };

    requestSubmitInvite(form)
      .then((response) => {
        closeDialog(dialogName);
        AppToaster.show({
          message: formatMessage({
            id: 'teammate_invited_to_organization_account',
          }),
          intent: Intent.SUCCESS,
        });
        setSubmitting(false);
        queryCache.invalidateQueries('users-table');
      })
      .catch((errors) => {
        const errorsTransformed = transformApiErrors(errors);

        setErrors({ ...errorsTransformed });
        setSubmitting(false);
      });
  };

  const handleCancelBtnClick = () => {
    closeDialog('invite-user');
  };

  return (
    <DialogContent isLoading={fetchHook.isFetching}>
      <Formik
        validationSchema={InviteUserFormSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <UserFormDialogForm
          action={action}
          onCancelClick={handleCancelBtnClick}
        />
      </Formik>
    </DialogContent>
  );
}

export default compose(
  // UserFormDialogConnect,
  withDialogActions,
  withUsersActions,
)(InviteUserDialogContent);
