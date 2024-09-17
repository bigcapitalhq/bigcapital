import { Box } from '@/components';
import { useElementCustomizeContext } from './ElementCustomizeProvider';

export function ElementCustomizePreviewContent() {
  const { PaperTemplate } = useElementCustomizeContext();

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
