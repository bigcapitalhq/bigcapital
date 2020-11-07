import React, { useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  FormGroup,
  InputGroup,
  Intent,
  Classes,
} from '@blueprintjs/core';
import { pick, snakeCase } from 'lodash';
import classNames from 'classnames';
import { queryCache, useQuery } from 'react-query';
import { FormattedMessage as T, useIntl } from 'react-intl';
import {
  If,
  ErrorMessage,
  AppToaster,
  FieldRequiredHint,
  DialogContent,
} from 'components';

import UserFormDialogConnect from 'containers/Dialogs/UserFormDialog.connector';
import withUsersActions from 'containers/Users/withUsersActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose, objectKeysTransform } from 'utils';

function UserFormDialogContent({
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

  const fetchHook = useQuery(
    // action === 'edit' && ['user', action.user.id],
    action === 'edit' && ['user', userId],
    (key, id) => requestFetchUser(id),
    { enabled: userId },
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required()
      .label(formatMessage({ id: 'email' })),
  });

  const initialValues = {
    status: 1,
    ...(action === 'edit' &&
      pick(
        objectKeysTransform(userId, snakeCase),
        Object.keys(validationSchema.fields),
      )),
  };

  const {
    errors,
    touched,
    resetForm,
    getFieldProps,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
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
          setSubmitting(false);
        });
    },
  });

  // Handles dialog close.
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  // Handle the dialog opening.
  const onDialogOpening = useCallback(() => {
    fetchHook.refetch();
  }, [fetchHook]);

  const onDialogClosed = useCallback(() => {
    resetForm();
    closeDialog(dialogName);
  }, [resetForm]);

  console.log(action, 'action');

  return (
    <DialogContent isLoading={fetchHook.isFetching}>
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <p className="mb2">
            <T id={'your_access_to_your_team'} />
          </p>

          <FormGroup
            label={<T id={'email'} />}
            className={classNames('form-group--email', Classes.FILL)}
            intent={errors.email && touched.email && Intent.DANGER}
            helperText={<ErrorMessage name="email" {...{ errors, touched }} />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={errors.email && touched.email && Intent.DANGER}
              {...getFieldProps('email')}
            />
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}>
              <T id={'cancel'} />
            </Button>
            <Button
              intent={Intent.PRIMARY}
              type="submit"
              disabled={isSubmitting}
            >
              {action === 'edit' ? <T id={'edit'} /> : <T id={'invite'} />}
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
}

export default compose(
  // UserFormDialogConnect,
  withDialogActions,
  withUsersActions,
)(UserFormDialogContent);
