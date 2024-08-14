// @ts-nocheck
import { Field } from 'formik';
import { Box, Group, Stack } from '@/components';
import styles from './ImportDropzone.module.css';
import { ImportDropzoneField } from './ImportDropzoneFile';
import { useAlertsManager } from './AlertsManager';

export function ImportDropzone() {
  const { hideAlerts } = useAlertsManager();

  return (
    <Stack spacing={0}>
      <Field id={'file'} name={'file'} type="file">
        {({ form }) => (
          <ImportDropzoneField
            title={'Drag and drop files here or click to select files'}
            subtitle={''}
            value={form.file}
            onChange={(file) => {
              hideAlerts();
              form.setFieldValue('file', file);
            }}
          />
        )}
      </Field>

      <Group className={styles.dropzoneHint}>
        <Box>Supperted Formats: CSV, XLSX</Box>
        <Box>Maximum size: 25MB</Box>
      </Group>
    </Stack>
  );
}
