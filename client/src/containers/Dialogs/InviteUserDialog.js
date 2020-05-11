import React, { useMemo, useCallback } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  Button,
  FormGroup,
  InputGroup,
  Intent,
  Classes,
} from '@blueprintjs/core';
import UserListDialogConnect from 'connectors/UsersList.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';
import useAsync from 'hooks/async';
import { objectKeysTransform } from 'utils';
import { pick, snakeCase } from 'lodash';
import ErrorMessage from 'components/ErrorMessage';
import classNames from 'classnames';
import AppToaster from 'components/AppToaster';
import { compose } from 'utils';

function InviteUserDialog({
  name,
  payload,
  isOpen,
  closeDialog,
  requestFetchUser,
  requestEditUser,
}) {
  const { formatMessage } = useIntl();

  const fetchHook = useAsync(async () => {
    await Promise.all([
      ...(payload.action === 'edit' ? [requestFetchUser(payload.user.id)] : []),
    ]);
  }, false);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required(formatMessage({ id: 'required' })),
    last_name: Yup.string().required(formatMessage({ id: 'required' })),
    email: Yup.string()
      .email()
      .required(formatMessage({ id: 'required' })),
    phone_number: Yup.number().required(formatMessage({ id: 'required' })),
  });

  const initialValues = useMemo(
    () => ({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
    }),
    []
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(payload.action === 'edit' &&
        pick(
          objectKeysTransform(payload.user, snakeCase),
          Object.keys(initialValues)
        )),
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const form = {
        ...values,
      };
      if (payload.action === 'edit') {
        requestEditUser(payload.user.id, form)
          .then((response) => {
            closeDialog(name);
            AppToaster.show({
              message: 'the_user_details_has_been_updated',
            });
            setSubmitting(false);
          })
          .catch((error) => {
            setSubmitting(false);
          });
      }
    },
  });
  const { values, errors, touched } = useMemo(() => formik, [formik]);

  const onDialogOpening = () => {
    fetchHook.execute();
  };

  const onDialogClosed = useCallback(() => {
    formik.resetForm();
  }, [formik.resetForm]);

  const handleClose = () => {
    closeDialog(name);
  };

  return (
    <Dialog
      name={name}
      title={payload.action === 'edit' ? <T id={'edit_invite'} /> : ''}
      className={classNames({
        'dialog--loading': fetchHook.pending,
        'dialog--invite-user': true,
      })}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      isLoading={fetchHook.pending}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'first_name'} />}
            className={'form-group--first-name'}
            intent={errors.first_name && touched.first_name && Intent.DANGER}
            helperText={<ErrorMessage name='first_name' {...formik} />}
            inline={true}
          >
            <InputGroup
              intent={errors.first_name && touched.first_name && Intent.DANGER}
              {...formik.getFieldProps('first_name')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'last_name'} />}
            className={'form-group--last-name'}
            intent={errors.last_name && touched.last_name && Intent.DANGER}
            helperText={<ErrorMessage name='last_name' {...formik} />}
            inline={true}
          >
            <InputGroup
              intent={errors.last_name && touched.last_name && Intent.DANGER}
              {...formik.getFieldProps('last_name')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'email'} />}
            className={'form-group--email'}
            intent={errors.email && touched.email && Intent.DANGER}
            helperText={<ErrorMessage name='email' {...formik} />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={errors.email && touched.email && Intent.DANGER}
              {...formik.getFieldProps('email')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'phone_number'} />}
            className={'form-group--phone-number'}
            intent={
              errors.phone_number && touched.phone_number && Intent.DANGER
            }
            helperText={<ErrorMessage name='phone_number' {...formik} />}
            inline={true}
          >
            <InputGroup
              intent={
                errors.phone_number && touched.phone_number && Intent.DANGER
              }
              {...formik.getFieldProps('phone_number')}
            />
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}><T id={'close'}/></Button>
            <Button intent={Intent.PRIMARY} type='submit'>
              {payload.action === 'edit' ? <T id={'edit'}/> : ''}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default compose(
  UserListDialogConnect,
  DialogReduxConnect
)(InviteUserDialog);
