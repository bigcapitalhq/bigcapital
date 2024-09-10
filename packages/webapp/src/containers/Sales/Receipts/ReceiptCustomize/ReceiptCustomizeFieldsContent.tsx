// @ts-nocheck
import { Stack } from '@/components';
import { Classes } from '@blueprintjs/core';

export function ReceiptCustomizeFieldsContent() {
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

      <Stack></Stack>
    </Stack>
  );
}
