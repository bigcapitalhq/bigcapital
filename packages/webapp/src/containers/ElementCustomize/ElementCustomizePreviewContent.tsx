import { Box, Stack } from '@/components';
import { useElementCustomizeContext } from './ElementCustomizeProvider';

export function ElementCustomizePreviewContent() {
  const { PaperTemplate } = useElementCustomizeContext();

  return (
    <Stack backgroundColor="#F5F5F5" overflow="auto" flex="1 1 0%" spacing={0}>
      {PaperTemplate}
    </Stack>
  );
}
