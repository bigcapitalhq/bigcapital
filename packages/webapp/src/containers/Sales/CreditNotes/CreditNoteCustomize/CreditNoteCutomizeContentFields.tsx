// @ts-nocheck
import { Stack } from '@/components';
import {
  ElementCustomizeContentItemFieldGroup,
  ElementCustomizeFieldsGroup,
} from '@/containers/ElementCustomize/ElementCustomizeFieldsGroup';
import { Classes } from '@blueprintjs/core';
import { fieldsGroups } from './constants';

export function CreditNoteCustomizeContentFields() {
  return (
    <Stack
      spacing={10}
      style={{ padding: 20, paddingBottom: 40, flex: '1 1 auto' }}
    >
      <Stack spacing={10}>
        <h3 style={{ fontWeight: 600 }}>General Branding</h3>
        <p className={Classes.TEXT_MUTED}>
          Customize your credit note by editing the items label or hiding some
          items to match your needs.
        </p>
      </Stack>

      <Stack>
        {fieldsGroups.map((group) => (
          <ElementCustomizeFieldsGroup label={group.label}>
            {group.fields.map((item, index) => (
              <ElementCustomizeContentItemFieldGroup
                key={index}
                inputGroupProps={{
                  name: item.enableKey,
                  label: item.label,
                }}
                switchProps={{
                  name: item.labelKey,
                }}
              />
            ))}
          </ElementCustomizeFieldsGroup>
        ))}
      </Stack>
    </Stack>
  );
}
