// @ts-nocheck
import { useRef, useState } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import clsx from 'classnames';
import { Box, Icon, Stack } from '@/components';
import { Dropzone, DropzoneProps } from '@/components/Dropzone';
import { MIME_TYPES } from '@/components/Dropzone/mine-types';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import styles from './CompanyLogoUpload.module.scss';

export interface CompanyLogoUploadProps {
  initialValue?: File;
  value?: File;
  onChange?: (file: File) => void;
  dropzoneProps?: DropzoneProps;
  uploadIcon?: JSX.Element;
  title?: string;
  classNames?: Record<string, string>;
}

export function CompanyLogoUpload({
  initialValue,
  value,
  onChange,
  dropzoneProps,
  uploadIcon = <Icon icon="download" iconSize={26} />,
  title = 'Drag images here or click to select files',
  classNames,
}: CompanyLogoUploadProps) {
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
  const imagePreviewUrl = localValue ? URL.createObjectURL(localValue) : '';

  return (
    <Dropzone
      onDrop={(files) => handleChange(files[0])}
      onReject={(files) => console.log('rejected files', files)}
      maxSize={5 * 1024 ** 2}
      accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
      classNames={{ root: styles?.root, content: styles.dropzoneContent }}
      activateOnClick={false}
      openRef={openRef}
      {...dropzoneProps}
    >
      <Stack
        spacing={12}
        align="center"
        className={clsx(styles.content, classNames?.content)}
      >
        {localValue ? (
          <Stack spacing={10} justify="center" align="center">
            <img src={imagePreviewUrl} alt="" className={styles.previewImage} />
            <Button
              minimal
              intent={Intent.DANGER}
              onClick={handleRemove}
              icon={<Icon icon={'smallCross'} iconSize={16} />}
              className={styles?.removeButton}
            />
          </Stack>
        ) : (
          <Stack spacing={10} align="center">
            {title && <span className={styles.title}>{title}</span>}
            <Button
              intent="none"
              onClick={() => openRef.current?.()}
              style={{ pointerEvents: 'all' }}
              minimal
              outlined
              small
            >
              {'Upload File'}
            </Button>
          </Stack>
        )}
      </Stack>
    </Dropzone>
  );
}
