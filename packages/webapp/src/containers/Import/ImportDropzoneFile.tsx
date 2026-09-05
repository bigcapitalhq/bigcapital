import { Button, Intent } from '@blueprintjs/core';
import clsx from 'classnames';
import { useRef } from 'react';
import { ErrorCode } from 'react-dropzone-esm';
import styles from './ImportDropzone.module.css';
import type { ComponentType, PropsWithChildren, ReactNode } from 'react';
import { AppToaster, Box, Icon, Stack } from '@/components';
import { Dropzone, DropzoneProps } from '@/components/Dropzone';
import { MIME_TYPES } from '@/components/Dropzone/mine-types';
import { useUncontrolled } from '@/hooks/useUncontrolled';

const REJECT_MESSAGES: Record<string, string> = {
  [ErrorCode.FileTooLarge]: 'File is too large.',
  [ErrorCode.FileInvalidType]: 'File type is not supported.',
  [ErrorCode.TooManyFiles]: 'Too many files uploaded.',
};

// `Dropzone` reads `children` and `classNames` from props at runtime but its
// exported type omits them. Cast once at the boundary so call sites stay typed.
const DropzoneWithChildren = Dropzone as unknown as ComponentType<
  PropsWithChildren<DropzoneProps> & {
    classNames?: { root?: string; content?: string };
  }
>;

export interface ImportDropzoneFieldProps {
  initialValue?: File | null;
  value?: File | null;
  onChange?: (file: File | null) => void;
  dropzoneProps?: DropzoneProps;
  uploadIcon?: ReactNode;
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
  const [localValue, handleChange] = useUncontrolled<File | null>({
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
    <DropzoneWithChildren
      onDrop={(files) => handleChange(files[0])}
      onReject={(fileRejections) => {
        fileRejections.forEach(({ errors }) => {
          errors.forEach((error) => {
            AppToaster.show({
              intent: Intent.DANGER,
              message: REJECT_MESSAGES[error.code] || 'File is invalid.',
            });
          });
        });
      }}
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
    </DropzoneWithChildren>
  );
}
