// @ts-nocheck
import React from 'react';
import { ErrorMessage, FastField } from 'formik';
import { FormGroup, InputGroup, TextArea } from '@blueprintjs/core';

import { inputIntent } from '@/utils';
import { FormattedMessage as T, FieldRequiredHint, Card } from '@/components';
import { useAutofocus } from '@/hooks';

/**
 * Role form header.
 * @returns {React.JSX}
 */
export function RoleFormHeader() {
  const roleNameFieldRef = useAutofocus();

  return (
    <Card>
      {/* ---------- Name ----------  */}
      <FastField name={'role_name'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={
              <strong>
                <T id={'roles.label.role_name'} />
              </strong>
            }
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

      {/* ---------- Description ----------  */}
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
