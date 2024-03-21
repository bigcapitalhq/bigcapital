// @ts-nocheck
import { ImportStepper } from './ImportStepper';
import { Box, DashboardInsider } from '@/components';
import { ImportFileProvider } from './ImportFileProvider';
import styles from './ImportPage.module.scss';


export default function ImportPage() {
  return (
    <DashboardInsider>
      <Box className={styles.root}>
        <ImportFileProvider resource="account">
          <ImportStepper />
        </ImportFileProvider>
      </Box>
    </DashboardInsider>
  );
}
