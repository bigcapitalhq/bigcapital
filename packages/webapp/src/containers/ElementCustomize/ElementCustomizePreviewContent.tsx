import { Box, Stack } from '@/components';
import { useElementCustomizeContext } from './ElementCustomizeProvider';

export function ElementCustomizePreviewContent() {
  const { PaperTemplate } = useElementCustomizeContext();

  return (
    <Stack
      backgroundColor="var(--color-element-customize-preview-background)"
      overflow="auto"
      flex="1 1 0%"
      spacing={0}
    >
      {PaperTemplate}
    </Stack>
  );
}
