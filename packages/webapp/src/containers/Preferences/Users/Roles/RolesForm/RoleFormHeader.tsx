// @ts-nocheck
import React from 'react';
import { FormattedMessage as T, FieldRequiredHint, Card, FFormGroup, FInputGroup, FTextArea } from '@/components';
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
      <FFormGroup
        name={'role_name'}
        label={
          <strong>
            <T id={'roles.label.role_name'} />
          </strong>
        }
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FInputGroup
          name={'role_name'}
          medium={true}
          inputRef={(ref) => (roleNameFieldRef.current = ref)}
          fill
          fastField
        />
      </FFormGroup>

      {/* ---------- Description ----------  */}
      <FFormGroup
        name={'role_description'}
        label={<T id={'description'} />}
        inline
        fastField
      >
        <FTextArea
          name={'role_description'}
          growVertically={true}
          height={280}
          placeholder="Max. 500 characters"
          fill
          fastField
        />
      </FFormGroup>
    </Card>
  );
}
