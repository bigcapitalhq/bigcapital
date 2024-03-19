// @ts-nocheck
import { Box, Group } from '@/components';
import { Button } from '@blueprintjs/core';
import styles from './ImportSampleDownload.module.scss';

export function ImportSampleDownload() {
  return (
    <Group className={styles.root} noWrap>
      <Box>
        <h3 className={styles.title}>Table Example</h3>
        <p className={styles.description}>
          Download a sample file and compare it to your import file to ensure
          you have the file perfect for the import.
        </p>
      </Box>

      <Box className={styles.buttonWrap}>
        <Button minimal outlined>
          Download File
        </Button>
      </Box>
    </Group>
  );
}
