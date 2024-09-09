import { Classes } from '@blueprintjs/core';
import { FInputGroup, FSwitch, Group, Stack } from '@/components';

const items = [
  { key: 'dueAmount', label: 'Due Amount' },
  { key: 'billedTo', label: 'Billed To' },
  { key: 'balanceDue', label: 'Balance Due' },
  { key: 'termsConditions', label: 'Terms & Conditions' },
];

export function InvoiceCustomizeContentFields() {
  return (
    <Stack style={{ padding: 20, flex: '1 1 auto' }}>
      <Stack>
        <h2>General Branding</h2>
        <p className={Classes.TEXT_MUTED}>
          Set your invoice details to be automatically applied every time you
          create a new invoice.
        </p>
      </Stack>

      <h1>Header</h1>

      <Stack>
        {items.map((item, index) => (
          <Group position={'apart'} key={index}>
            <FSwitch name={`item.${item.key}.enabled`} label={item.label} />
            <FInputGroup
              name={'item.dueAmount.text'}
              placeholder={item.label}
            />
          </Group>
        ))}
      </Stack>
    </Stack>
  );
}
