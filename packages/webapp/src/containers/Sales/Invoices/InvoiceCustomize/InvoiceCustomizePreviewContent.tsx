import { Box } from '@/components';
import { PaperTemplate } from './PaperTemplate';

export function InvoiceCustomizePreviewContent() {
  return (
    <Box style={{ padding: 24, backgroundColor: '#F5F5F5', overflow: 'auto' }}>
      <PaperTemplate />
    </Box>
  );
}
