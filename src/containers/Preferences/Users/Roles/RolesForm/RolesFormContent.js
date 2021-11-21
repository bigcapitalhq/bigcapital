import React from 'react';
import { useHistory } from 'react-router-dom';
import { ErrorMessage, FastField, Form, useFormikContext } from 'formik';
import {
  Button,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
} from '@blueprintjs/core';
import { inputIntent } from 'utils';
import { FormattedMessage as T, FieldRequiredHint } from 'components';
import { useAutofocus } from 'hooks';
import { RolesPermissionList } from './components';

/**
 * Preferences - Roles Form content.
 */
export default function RolesFormContent() {
  const history = useHistory();

  const { isSubmitting, values } = useFormikContext();
  const roleNameFieldRef = useAutofocus();

  const handleCloseClick = () => {
    history.go(-1);
  };
  console.log(values, 'EE');
  return (
    <Form>
      {/* ----------  name ----------  */}
      <FastField name={'role_name'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'name'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--name'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="role_name" />}
            inline={true}
          >
            <InputGroup
              medium={true}
              inputRef={(ref) => (roleNameFieldRef.current = ref)}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------  description ----------  */}
      <FastField name={'role_description'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'description'} />}
            className={'form-group--description'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'role_description'} />}
            inline={true}
          >
            <TextArea growVertically={true} height={280} {...field} />
          </FormGroup>
        )}
      </FastField>
      <RolesPermissionList />

      <div className={'card__footer'}>
        <Button intent={Intent.PRIMARY} loading={isSubmitting} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick} disabled={isSubmitting}>
          <T id={'cancel'} />
        </Button>
      </div>
    </Form>
  );
}
