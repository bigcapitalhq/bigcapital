import React from 'react';
import { ErrorMessage, FastField, Form } from 'formik';
import { FormGroup, InputGroup, TextArea } from '@blueprintjs/core';

import { inputIntent } from 'utils';
import { FormattedMessage as T, FieldRequiredHint, Card } from 'components';
import { useAutofocus } from 'hooks';
import { RolesPermissionList } from './components';
import { RoleFormFloatingActions } from './RoleFormFloatingActions';

/**
 * Role form header.
 * @returns {React.JSX}
 */
function RoleFormHeader() {
  const roleNameFieldRef = useAutofocus();

  return (
    <Card>
      {/* ----------  name ----------  */}
      <FastField name={'role_name'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<strong><T id={'role_name'} /></strong>}
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
            <TextArea
              growVertically={true}
              height={280}
              {...field}
              placeholder="Max. 500 characters"
            />
          </FormGroup>
        )}
      </FastField>
    </Card>
  );
}

/**
 * Preferences - Roles Form content.
 */
export default function RolesFormContent() {
  return (
    <Form>
      <RoleFormHeader />
      <RolesPermissionList />
      <RoleFormFloatingActions />
    </Form>
  );
}
