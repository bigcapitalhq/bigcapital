import React from 'react';
import {
  FormGroup,
  InputGroup,
  Intent,
  Classes,
  Button,
} from '@blueprintjs/core';
import { FastField, Form, useFormikContext, ErrorMessage } from 'formik';
import { FormattedMessage as T } from 'components';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import { inputIntent } from 'utils';
import { ListSelect, FieldRequiredHint } from 'components';
import { useUserFormContext } from './UserFormProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';
import { UserFormCalloutAlerts } from './components';

/**
 * User form content.
 */
function UserFormContent({
  calloutCode,
  // #withDialogActions
  closeDialog,
}) {
  const { isSubmitting } = useFormikContext();
  const { dialogName, roles, isAuth } = useUserFormContext();

  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <UserFormCalloutAlerts calloutCodes={calloutCode} />

        {/* ----------- Email ----------- */}
        <FastField name={'email'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'email'} />}
              labelInfo={<FieldRequiredHint />}
              className={classNames('form-group--email', CLASSES.FILL)}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="email" />}
            >
              <InputGroup medium={true} {...field} />
            </FormGroup>
          )}
        </FastField>

        {/* ----------- First name ----------- */}
        <FastField name={'first_name'}>
          {({ form, field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'first_name'} />}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name={'first_name'} />}
            >
              <InputGroup intent={inputIntent({ error, touched })} {...field} />
            </FormGroup>
          )}
        </FastField>

        {/* ----------- Last name ----------- */}
        <FastField name={'last_name'}>
          {({ form, field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'last_name'} />}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name={'last_name'} />}
            >
              <InputGroup intent={inputIntent({ error, touched })} {...field} />
            </FormGroup>
          )}
        </FastField>
        {/* ----------- Phone name ----------- */}
        <FastField name={'phone_number'}>
          {({ form, field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'phone_number'} />}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name={'phone_number'} />}
            >
              <InputGroup intent={inputIntent({ error, touched })} {...field} />
            </FormGroup>
          )}
        </FastField>
        {/* ----------- Role name ----------- */}
        <FastField name={'role_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'roles.label.role_name'} />}
              labelInfo={<FieldRequiredHint />}
              helperText={<ErrorMessage name="role_id" />}
              className={classNames(CLASSES.FILL, 'form-group--role_name')}
              intent={inputIntent({ error, touched })}
            >
              <ListSelect
                items={roles}
                onItemSelect={({ id }) => {
                  form.setFieldValue('role_id', id);
                }}
                selectedItem={value}
                selectedItemProp={'id'}
                textProp={'name'}
                // labelProp={'id '}
                popoverProps={{ minimal: true }}
                intent={inputIntent({ error, touched })}
                disabled={isAuth}
              />
            </FormGroup>
          )}
        </FastField>
      </div>

      <div className={CLASSES.DIALOG_FOOTER}>
        <div className={CLASSES.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleClose}>
            <T id={'cancel'} />
          </Button>

          <Button intent={Intent.PRIMARY} type="submit" disabled={isSubmitting}>
            <T id={'edit'} />
          </Button>
        </div>
      </div>
    </Form>
  );
}
export default compose(withDialogActions)(UserFormContent);
