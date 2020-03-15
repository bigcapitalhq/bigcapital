import React from 'react';
import { useIntl } from "react-intl"
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  Button,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
  MenuItem,
  Checkbox,
  Classes,
  HTMLSelect,
} from '@blueprintjs/core';
import UserFormDialogConnect from 'connectors/UserFormDialog.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';
import AppToaster from 'components/AppToaster';
import useAsync from 'hooks/async';
import {objectKeysTransform} from 'utils';
import {pick, snakeCase} from 'lodash';

function UserFormDialog({
  fetchUser,
  submitUser,
  editUser,
  name,
  payload,
  isOpen,
  userDetails,
  closeDialog,
}) {
  const intl = useIntl();
  const fetchHook = useAsync(async () => {
    await Promise.all([
      ...(payload.action === 'edit') ? [
        fetchUser(payload.user.id),  
      ] : [],
    ]);
  }, false);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    email: Yup.string().email().required(),
    phone_number: Yup.string().required(),
    password: Yup.string().min(5).required(),
  });

  const initialValues = {
    status: 1,
    ...payload.action === 'edit' && 
      pick(
        objectKeysTransform(payload.user, snakeCase),
        Object.keys(validationSchema.fields)
      ),
    password: '',
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const form = {
        ...values,
        confirm_password: values.password,
      };
      if (payload.action === 'edit') {
        editUser(payload.user.id, form).then((response) => {
          AppToaster.show({
            message: 'the_user_details_has_been_updated',
          });
          closeDialog(name);
        });
      } else {
        submitUser(form).then((response) => {
          AppToaster.show({
            message: 'the_user_has_been_invited',
          });
          closeDialog(name);
        });
      }
    },
  });

  const statusOptions = [
    {value: 1, label: 'Active'},
    {value: 2, label: 'Inactive'},
  ];

  const onDialogOpening = () => { fetchHook.execute(); };

  const onDialogClosed = () => {
    formik.resetForm();

  };

  const handleClose = () => { closeDialog(name); };

  return (
    <Dialog
      isOpen={isOpen}
      name={name}
      title={payload.action === 'edit' ? 'Edit User' : 'New User'}
      isLoading={fetchHook.pending}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}>

      <form onSubmit={formik.handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={'First Name'}
            className={'form-group--first-name'}
            intent={formik.errors.first_name && Intent.DANGER}
            helperText={formik.errors.first_name && formik.errors.first_name}
            inline={true}>

            <InputGroup
              intent={formik.errors.first_name && Intent.DANGER}
              {...formik.getFieldProps('first_name')} />
          </FormGroup>
          
          <FormGroup
            label={'Last Name'}
            className={'form-group--last-name'}
            intent={formik.errors.last_name && Intent.DANGER}
            helperText={formik.errors.last_name && formik.errors.last_name}
            inline={true}>

            <InputGroup
              intent={formik.errors.last_name && Intent.DANGER}
              {...formik.getFieldProps('last_name')} />
          </FormGroup>

          <FormGroup
            label={'Email'}
            className={'form-group--email'}
            intent={formik.errors.email && Intent.DANGER}
            helperText={formik.errors.email && formik.errors.email}
            inline={true}>

            <InputGroup
              intent={formik.errors.email && Intent.DANGER}
              {...formik.getFieldProps('email')} />
          </FormGroup>

          <FormGroup
            label={'Phone Number'}
            className={'form-group--phone-number'}
            intent={formik.errors.phone_number && Intent.DANGER}
            helperText={formik.errors.phone_number && formik.errors.phone_number}
            inline={true}>

            <InputGroup
              intent={formik.errors.phone_number && Intent.DANGER}
              {...formik.getFieldProps('phone_number')} />
          </FormGroup>

          <FormGroup
            label={'Password'}
            className={'form-group--password'}
            intent={formik.errors.password && Intent.DANGER}
            helperText={formik.errors.password && formik.errors.password}
            inline={true}>

            <InputGroup
              intent={formik.errors.password && Intent.DANGER}
              className={Classes.FILL}
              {...formik.getFieldProps('password')} />
          </FormGroup>

          <FormGroup
            label={'Status'}
            className={'form-group--status'}
            intent={formik.errors.status && Intent.DANGER}
            helperText={formik.errors.status && formik.errors.status}
            inline={true}>

            <HTMLSelect
              options={statusOptions}
              className={Classes.FILL}
              {...formik.getFieldProps(`status`)} />
          </FormGroup>

          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={handleClose}>Close</Button>
              <Button intent={Intent.PRIMARY} type="submit">
                { payload.action === 'edit' ? 'Edit' : 'Submit' }
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default UserFormDialogConnect(DialogReduxConnect(UserFormDialog));