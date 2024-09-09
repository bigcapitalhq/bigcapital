import { Box } from '@/components';
import { useInvoiceCustomizeContext } from './InvoiceCustomizeProvider';

export function InvoiceCustomizePreviewContent() {
  const { PaperTemplate } = useInvoiceCustomizeContext();

  return (
    <Box
      style={{
        padding: '28px 24px 40px',
        backgroundColor: '#F5F5F5',
        overflow: 'auto',
        flex: '1',
      }}
    >
      {PaperTemplate}
    </Box>
  );
}
