// @ts-nocheck
import { useRef } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import clsx from 'classnames';
import { Box, Icon, Stack } from '@/components';
import { Dropzone, DropzoneProps } from '@/components/Dropzone';
import { MIME_TYPES } from '@/components/Dropzone/mine-types';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import styles from './ImportDropzone.module.css';

export interface ImportDropzoneFieldProps {
  initialValue?: File;
  value?: File;
  onChange?: (file: File) => void;
  dropzoneProps?: DropzoneProps;
  uploadIcon?: JSX.Element;
  title?: string;
  subtitle?: string;
  classNames?: Record<string, string>;
}

export function ImportDropzoneField({
  initialValue,
  value,
  onChange,
  dropzoneProps,
  uploadIcon = <Icon icon="download" iconSize={26} />,
  title = 'Drag images here or click to select files',
  subtitle = 'Drag and Drop file here or Choose file',
  classNames,
}: ImportDropzoneFieldProps) {
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
      classNames={{ root: classNames?.root, content: styles.dropzoneContent }}
      activateOnClick={false}
      openRef={openRef}
      {...dropzoneProps}
    >
      <Stack
        spacing={12}
        align="center"
        className={clsx(styles.content, classNames?.content)}
      >
        {uploadIcon && <Box className={styles.iconWrap}>{uploadIcon}</Box>}

        {localValue ? (
          <Stack spacing={6} justify="center" align="center">
            <h4 className={styles.title}>{localValue.name}</h4>
            <Button small minimal intent={Intent.DANGER} onClick={handleRemove}>
              Remove
            </Button>
          </Stack>
        ) : (
          <Stack spacing={4} align="center">
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </Stack>
        )}
        <Button
          intent="none"
          onClick={() => openRef.current?.()}
          style={{ pointerEvents: 'all' }}
          minimal
          outlined
        >
          {localValue ? 'Replace File' : 'Upload File'}
        </Button>
      </Stack>
    </Dropzone>
  );
}
