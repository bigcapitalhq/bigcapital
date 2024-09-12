// @ts-nocheck
import { Stack } from '@/components';
import { Classes } from '@blueprintjs/core';
import { fieldsGroups } from './constants';
import {
  ElementCustomizeFieldsGroup,
  ElementCustomizeContentItemFieldGroup,
} from '@/containers/ElementCustomize/ElementCustomizeFieldsGroup';

export function InvoiceCustomizeContentFields() {
  return (
    <Stack
      spacing={10}
      style={{ padding: 20, paddingBottom: 40, flex: '1 1 auto' }}
    >
      <Stack spacing={10}>
        <h3>General Branding</h3>
        <p className={Classes.TEXT_MUTED}>
          Set your invoice details to be automatically applied every timeyou
          create a new invoice.
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
