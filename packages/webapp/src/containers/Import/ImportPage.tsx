// @ts-nocheck
import { ImportStepper } from './ImportStepper';
import { Box, DashboardInsider } from '@/components';
import styles from './ImportPage.module.scss';
import { ImportFileProvider } from './ImportFileProvider';

export default function ImportPage() {
  return (
    <DashboardInsider>
      <Box className={styles.rootWrap}>
        <Box className={styles.root}>
          <ImportFileProvider resource="account">
            <ImportStepper />
          </ImportFileProvider>
        </Box>
      </Box>
    </DashboardInsider>
  );
}
