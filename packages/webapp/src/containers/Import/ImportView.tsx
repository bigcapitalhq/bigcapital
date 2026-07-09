// @ts-nocheck
import { ImportFileProvider } from './ImportFileProvider';
import { ImportStepper } from './ImportStepper';
import styles from './ImportView.module.scss';
import { Box } from '@/components';

interface ImportViewProps {
  resource: string;
  description?: string;
  params?: Record<string, any>;
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
