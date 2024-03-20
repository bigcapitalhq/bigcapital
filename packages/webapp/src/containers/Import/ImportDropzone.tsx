// @ts-nocheck
import { Field } from 'formik';
import { Box, Group, Stack } from '@/components';
import styles from './ImportDropzone.module.css';
import { ImportDropzoneField } from './ImportDropzoneFile';

export function ImportDropzone() {
  return (
    <Stack spacing={0}>
      <Field id={'file'} name={'file'} type="file">
        {({ form }) => (
          <ImportDropzoneField
            value={form.file}
            onChange={(file) => {
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
