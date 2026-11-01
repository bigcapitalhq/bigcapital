import { Field } from 'formik';
import { useAlertsManager } from './AlertsManager';
import styles from './ImportDropzone.module.css';
import { ImportDropzoneField } from './ImportDropzoneFile';
import type { ImportFileUploadValues } from './_types';
import type { FieldProps } from 'formik';
import { Box, Group, Stack } from '@/components';

export function ImportDropzone() {
  const { hideAlerts } = useAlertsManager();

  return (
    <Stack spacing={0} className={styles.root}>
      <Field id={'file'} name={'file'} type="file">
        {({ form }: FieldProps<ImportFileUploadValues>) => (
          <ImportDropzoneField
            title={'Drag and drop files here or click to select files'}
            subtitle={''}
            value={form.values.file}
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
