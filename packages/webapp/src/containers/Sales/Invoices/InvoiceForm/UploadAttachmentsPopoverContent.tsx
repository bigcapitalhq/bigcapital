// @ts-nocheck
import { useState } from 'react';
import { isEmpty } from 'lodash';
import { Button, Intent, Text, Spinner } from '@blueprintjs/core';
import { Box, Group, Icon, Stack } from '@/components';
import { ImportDropzoneField } from '@/containers/Import/ImportDropzoneFile';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import {
  useDeleteAttachment,
  useUploadAttachments,
} from '@/hooks/query/attachments';
import { formatBytes } from './utils';
import styles from './UploadAttachmentPopoverContent.module.scss';

interface AttachmentFileCommon {
  originName: string;
  key: string;
  size: number;
  mimeType: string;
}
interface AttachmentFileLoaded extends AttachmentFileCommon {}
interface AttachmentFileLoading extends AttachmentFileCommon {
  _loading: boolean;
}
type AttachmentFile = AttachmentFileLoaded | AttachmentFileLoading;

interface UploadAttachmentsPopoverContentProps {
  initialValue?: AttachmentFile[];
  value?: AttachmentFile[];
  onChange?: (value: AttachmentFile[]) => void;
}

/**
 * Uploads and list the attachments with ability to delete particular attachment.
 * @param {UploadAttachmentsPopoverContentProps}
 */
export function UploadAttachmentsPopoverContent({
  initialValue,
  value,
  onChange,
}: UploadAttachmentsPopoverContentProps) {
  // Controlled/uncontrolled value state.
  const [localFiles, handleFilesChange] = useUncontrolled<AttachmentFile[]>({
    finalValue: [],
    initialValue,
    value,
    onChange: onChange,
  });
  // Stops loading of the given attachment key and updates it to new key,
  // that came from the server-side after uploading is done.
  const stopLoadingAttachment = (
    localFiles: AttachmentFile[],
    internalKey: string,
    newKey: string,
  ) => {
    return localFiles.map((localFile) => {
      if (localFile.key === internalKey) {
        return {
          ...localFile,
          key: newKey,
          _loading: false,
        };
      }
      return localFile;
    });
  };
  // Uploads the attachments.
  const { mutateAsync: uploadAttachments } = useUploadAttachments({
    onSuccess: (data, variables, context) => {
      const newLocalFiles = stopLoadingAttachment(
        localFiles,
        data.config.data.get('internalKey'),
        data.data.data.key,
      );
      handleFilesChange(newLocalFiles);
    },
  });
  // Deletes the attachment.
  const { mutateAsync: deleteAttachment } = useDeleteAttachment();

  // Deletes the attachment of the given file key.
  const DeleteButton = ({ fileKey }: { fileKey: string }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = () => {
      setLoading(true);
      deleteAttachment(fileKey).then(() => {
        const updatedFiles = localFiles.filter(
          (file, i) => file.key !== fileKey,
        );
        handleFilesChange(updatedFiles);
        setLoading(false);
      });
    };
    return (
      <Button
        small
        minimal
        intent={Intent.DANGER}
        loading={loading}
        disabled={loading}
        onClick={handleClick}
      >
        <Icon icon={'trash-16'} iconSize={16} />
      </Button>
    );
  };
  // Handle change dropzone.
  const handleChangeDropzone = (file: File) => {
    const formData = new FormData();
    const key = Date.now().toString();

    formData.append('file', file);
    formData.append('internalKey', key);

    handleFilesChange([
      {
        originName: file.name,
        size: file.size,
        key,
        _loading: true,
      },
      ...localFiles,
    ]);
    uploadAttachments(formData);
  };

  return (
    <div className={styles.content}>
      <div>
        <Text className={styles.label}>Attach documents</Text>
        <Stack spacing={0}>
          <ImportDropzoneField
            uploadIcon={null}
            value={null}
            title={''}
            classNames={{ root: styles.dropzoneRoot }}
            onChange={handleChangeDropzone}
          />
          <Group className={styles.hintText}>
            <Box>Formats: CSV, XLSX</Box>
            <Box>Maximum: 25MB</Box>
          </Group>
        </Stack>

        {!isEmpty(localFiles) && (
          <Stack spacing={8} className={styles.attachments}>
            {localFiles.map((localFile: AttachmentFile, index: number) => (
              <Group
                position={'space-between'}
                className={styles.attachmentItem}
                key={index}
              >
                <Group spacing={16} className={styles.attachmentContent}>
                  {localFile._loading ? (
                    <Spinner size={20} />
                  ) : (
                    <Icon
                      icon={'media'}
                      iconSize={16}
                      className={styles.attachmentIcon}
                    />
                  )}
                  <Stack spacing={2}>
                    <Text className={styles.attachmentFilenameText}>
                      {localFile.originName}
                    </Text>
                    {localFile._loading ? (
                      <Text>Loading...</Text>
                    ) : (
                      <Text className={styles.attachmentSizeText}>
                        {formatBytes(localFile.size)}
                      </Text>
                    )}
                  </Stack>
                </Group>

                {!localFile._loading && (
                  <Group spacing={0}>
                    <Button small minimal>
                      View
                    </Button>
                    <DeleteButton fileKey={localFile.key} />
                  </Group>
                )}
              </Group>
            ))}
          </Stack>
        )}
      </div>
    </div>
  );
}
