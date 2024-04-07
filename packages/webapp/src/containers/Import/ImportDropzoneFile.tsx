// @ts-nocheck
import { useRef } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { Box, Icon, Stack } from '@/components';
import { Dropzone, DropzoneProps } from '@/components/Dropzone';
import { MIME_TYPES } from '@/components/Dropzone/mine-types';
import styles from './ImportDropzone.module.css';
import { useUncontrolled } from '@/hooks/useUncontrolled';

interface ImportDropzoneFieldProps {
  initialValue?: File;
  value?: File;
  onChange?: (file: File) => void;
  dropzoneProps?: DropzoneProps;
}

export function ImportDropzoneField({ initialValue, value, onChange, dropzoneProps }: ImportDropzoneFieldProps) {
  const [localValue, handleChange] = useUncontrolled({
    value,
    initialValue,
    finalValue: null,
    onChange,
  });
  const openRef = useRef<() => void>(null);

  const handleRemove = () => {
    handleChange(null);
  };

  return (
    <Dropzone
      onDrop={(files) => handleChange(files[0])}
      onReject={(files) => console.log('rejected files', files)}
      maxSize={5 * 1024 ** 2}
      accept={[MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx]}
      classNames={{ content: styles.dropzoneContent }}
      activateOnClick={false}
      openRef={openRef}
      {...dropzoneProps}
    >
      <Stack spacing={12} align="center" className={styles.content}>
        <Box className={styles.iconWrap}>
          <Icon icon="download" iconSize={26} />
        </Box>
        {localValue ? (
          <Stack spacing={6} justify="center" align="center">
            <h4 className={styles.title}>{localValue.name}</h4>
            <Button small minimal intent={Intent.DANGER} onClick={handleRemove}>
              Remove
            </Button>
          </Stack>
        ) : (
          <Stack spacing={4} align="center">
            <h4 className={styles.title}>Drag images here or click to select files</h4>
            <span className={styles.subtitle}>Drag and Drop file here or Choose file</span>
          </Stack>
        )}

        <Button intent="none" onClick={() => openRef.current?.()} style={{ pointerEvents: 'all' }} minimal outlined>
          {localValue ? 'Replace File' : 'Upload File'}
        </Button>
      </Stack>
    </Dropzone>
  );
}
