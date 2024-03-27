// @ts-nocheck
import { ImportStepper } from './ImportStepper';
import { Box } from '@/components';
import { ImportFileProvider } from './ImportFileProvider';
import styles from './ImportView.module.scss';

interface ImportViewProps {
  resource: string;
  description?: string;
  params: Record<string, any>;
  onImportSuccess?: () => void;
  onImportFailed?: () => void;
  onCancelClick?: () => void;
  sampleFileName?: string;
  exampleDownload?: boolean;
  exampleTitle?: string;
  exampleDescription?: string;
}

export function ImportView({ ...props }: ImportViewProps) {
  return (
    <Box className={styles.root}>
      <ImportFileProvider {...props}>
        <ImportStepper />
      </ImportFileProvider>
    </Box>
  );
}
