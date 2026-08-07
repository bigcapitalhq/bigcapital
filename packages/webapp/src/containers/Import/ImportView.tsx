import { ImportViewProps } from './_types';
import { ImportFileProvider } from './ImportFileProvider';
import { ImportStepper } from './ImportStepper';
import styles from './ImportView.module.scss';
import { Box } from '@/components';

export function ImportView({ ...props }: ImportViewProps) {
  return (
    <Box className={styles.root}>
      <ImportFileProvider {...props}>
        <ImportStepper />
      </ImportFileProvider>
    </Box>
  );
}
