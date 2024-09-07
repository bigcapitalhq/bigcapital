import { Stack } from '@/components';
import { InvoiceCustomizeHeader } from './InvoiceCustomizeHeader';
import { InvoiceCustomizePreviewContent } from './InvoiceCustomizePreviewContent';

export function InvoiceCustomizePreview() {
  return (
    <Stack spacing={0} style={{ borderLeft: '1px solid #D9D9D9' }}>
      <InvoiceCustomizeHeader label={'Preview'} closeButton />
      <InvoiceCustomizePreviewContent />
    </Stack>
  );
}
