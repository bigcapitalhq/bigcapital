// @ts-nocheck
import { Button } from '@blueprintjs/core';
import { Field } from 'formik';
import { Box, Group, Icon, Stack } from '@/components';
import { Dropzone } from '@/components/Dropzone';
import { MIME_TYPES } from '@/components/Dropzone/mine-types';
import styles from './ImportDropzone.module.css';

export function ImportDropzone() {
  return (
    <Stack spacing={0}>
      <Field id={'file'} name={'file'} type="file">
        {({ form: { setFieldValue } }) => (
          <Dropzone
            onDrop={(files) => setFieldValue('file', files[0])}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={5 * 1024 ** 2}
            accept={[MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx]}
            classNames={{ content: styles.dropzoneContent }}
          >
            <Stack spacing={10} className={styles.content}>
              <Box className={styles.iconWrap}>
                <Icon icon="download" iconSize={26} />
              </Box>
              <Stack spacing={4}>
                <h4 className={styles.title}>
                  Drag images here or click to select files
                </h4>
                <span className={styles.subtitle}>
                  Drag and Drop file here or Choose file
                </span>
              </Stack>
              <Box>
                <Button intent="none" minimal outlined>
                  Upload File
                </Button>
              </Box>
            </Stack>
          </Dropzone>
        )}
      </Field>

      <Group className={styles.dropzoneHint}>
        <Box>Supperted Formats: CSV, XLSX</Box>
        <Box>Maximum size: 25MB</Box>
      </Group>
    </Stack>
  );
}
