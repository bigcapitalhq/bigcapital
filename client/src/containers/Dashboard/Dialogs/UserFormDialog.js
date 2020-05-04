import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
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
import UserFormDialogConnect from 'connectors/UserFormDialog.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';
import AppToaster from 'components/AppToaster';
import useAsync from 'hooks/async';
import { objectKeysTransform } from 'utils';
import { pick, snakeCase } from 'lodash';
import ErrorMessage from 'components/ErrorMessage';
import classNames from 'classnames';
import { compose } from 'utils';

function UserFormDialog({
  requestFetchUser,
  requestSubmitInvite,
  requestEditUser,
  name,
  payload,
  isOpen,
  closeDialog,
}) {
  const intl = useIntl();
  const fetchHook = useAsync(async () => {
    await Promise.all([
      ...(payload.action === 'edit' ? [requestFetchUser(payload.user.id)] : []),
    ]);
  }, false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(intl.formatMessage({id:'required'})),
  });

  const initialValues = {
    status: 1,
    ...(payload.action === 'edit' &&
      pick(
        objectKeysTransform(payload.user, snakeCase),
        Object.keys(validationSchema.fields)
      )),
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const form = {
        ...values,
      };
      if (payload.action === 'edit') {
        requestEditUser(payload.user.id, form).then((response) => {
          AppToaster.show({
            message: 'the_user_details_has_been_updated',
          });
          closeDialog(name);
        });
      } else {
        requestSubmitInvite(form).then((response) => {
          AppToaster.show({
            message: 'the_user_has_been_invited',
          });
          closeDialog(name);
        });
      }
    },
  });
  const { values, errors, touched } = useMemo(() => formik, [formik]);

  const onDialogOpening = () => {
    fetchHook.execute();
  };

  const onDialogClosed = () => {
    formik.resetForm();
  };

  const handleClose = () => {
    closeDialog(name);
  };

  return (
    <Dialog
      name={name}
      title={payload.action === 'edit' ? 'Edit invite' : 'invite User'}
      className={classNames({
        'dialog--loading': fetchHook.pending,
        'dialog--invite-form': true,
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
            label={'Email'}
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
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}>Close</Button>
            <Button intent={Intent.PRIMARY} type='submit'>
              {payload.action === 'edit' ? 'Edit' : 'invite'}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default compose(
  UserFormDialogConnect,
  DialogReduxConnect
)(UserFormDialog);
