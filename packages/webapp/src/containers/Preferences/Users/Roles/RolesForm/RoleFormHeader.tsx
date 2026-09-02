// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  FormattedMessage as T,
  FieldRequiredHint,
  Card,
  FFormGroup,
  FInputGroup,
  FTextArea,
} from '@/components';
import { useAutofocus } from '@/hooks';

/**
 * Role form header.
 */
export function RoleFormHeader() {
  const roleNameFieldRef = useAutofocus<HTMLInputElement>();

  return (
    <Card>
      {/* ---------- Name ----------  */}
      <FFormGroup
        name={'roleName'}
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
          name={'roleName'}
          medium={true}
          inputRef={(ref: HTMLInputElement | null) => {
            roleNameFieldRef.current = ref;
          }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ---------- Description ----------  */}
      <FFormGroup
        name={'roleDescription'}
        label={intl.get('description')}
        inline
        fastField
      >
        <FTextArea
          name={'roleDescription'}
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
