import { Button, Intent, Text, Spinner } from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import styles from './UploadAttachmentPopoverContent.module.scss';
import { Box, Group, Icon, Stack } from '@/components';
import { MIME_TYPES } from '@/components/Dropzone/mine-types';
import {
  ImportDropzoneField,
  ImportDropzoneFieldProps,
} from '@/containers/Import/ImportDropzoneFile';
import {
  useGetPresignedUrlAttachment,
  useUploadAttachments,
} from '@/hooks/query/attachments';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import { formatBytes } from '@/utils/format-bytes';

export interface AttachmentFile {
  originName: string;
  key: string;
  size: number;
  mimeType: string;
  loading?: boolean;
}
export type AttachmentFileCommon = AttachmentFile;
export type AttachmentFileLoaded = AttachmentFile;
export type AttachmentFileLoading = AttachmentFile & { loading: boolean };

interface UploadAttachmentsPopoverContentProps {
  initialValue?: AttachmentFile[];
  value?: AttachmentFile[];
  onChange?: (value: AttachmentFile[]) => void;
  onUploadedChange?: (value: AttachmentFile[]) => void;
  dropzoneFieldProps?: ImportDropzoneFieldProps;
}

/**
 * Uploads and list the attachments with ability to delete particular attachment.
 * @param {UploadAttachmentsPopoverContentProps}
 */
export function UploadAttachmentsPopoverContent({
  initialValue,
  value,
  onChange,
  onUploadedChange,
  dropzoneFieldProps,
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
    files: AttachmentFile[],
    internalKey: string,
    newKey: string,
  ) => {
    return files.map((localFile) => {
      if (localFile.key === internalKey) {
        return {
          ...localFile,
          key: newKey,
          loading: false,
        };
      }
      return localFile;
    });
  };
  // Uploads the attachments.
  const { mutateAsync: uploadAttachments } = useUploadAttachments({
    onSuccess: (data, variables) => {
      const internalKey =
        variables instanceof FormData
          ? String(variables.get('internalKey') ?? '')
          : '';
      const newLocalFiles = stopLoadingAttachment(
        localFiles,
        internalKey,
        data.key,
      );
      handleFilesChange(newLocalFiles);
      onUploadedChange?.(newLocalFiles);
    },
  });
  // Deletes the attachment of the given file key.
  const handleClick = (key: string) => () => {
    const updatedFiles = localFiles.filter((file) => file.key !== key);
    handleFilesChange(updatedFiles);
    onUploadedChange?.(updatedFiles);
  };

  // Handle change dropzone.
  const handleChangeDropzone = (file: File | null) => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    const key = Date.now().toString();

    formData.append('file', file);
    formData.append('internalKey', key);

    handleFilesChange([
      {
        originName: file.name,
        size: file.size,
        mimeType: file.type,
        key,
        loading: true,
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
            subtitle={'Drag and drop file here or choose file'}
            classNames={{ root: styles.dropzoneRoot }}
            onChange={handleChangeDropzone}
            dropzoneProps={{
              accept: [
                MIME_TYPES.doc,
                MIME_TYPES.docx,
                MIME_TYPES.pdf,
                MIME_TYPES.png,
                MIME_TYPES.jpeg,
              ],
            }}
            {...dropzoneFieldProps}
          />
          <Group className={styles.hintText}>
            <Box>Maximum: 25MB</Box>
          </Group>
        </Stack>

        {!isEmpty(localFiles) && (
          <Stack spacing={0} className={styles.attachments}>
            {localFiles.map((localFile: AttachmentFile, index: number) => (
              <Group
                position={'apart'}
                className={styles.attachmentItem}
                key={index}
              >
                <Group spacing={14} className={styles.attachmentContent}>
                  <div className={styles.attachmentIconWrap}>
                    {localFile.loading ? (
                      <Spinner size={20} />
                    ) : (
                      <Icon
                        icon={'media'}
                        iconSize={16}
                        className={styles.attachmentIcon}
                      />
                    )}
                  </div>
                  <Stack spacing={2}>
                    <Text className={styles.attachmentFilenameText}>
                      {localFile.originName}
                    </Text>
                    {localFile.loading ? (
                      <Text className={styles.attachmentLoadingText}>
                        Loading...
                      </Text>
                    ) : (
                      <Text className={styles.attachmentSizeText}>
                        {formatBytes(localFile.size)}
                      </Text>
                    )}
                  </Stack>
                </Group>

                {!localFile.loading && (
                  <Group spacing={2}>
                    <ViewButton fileKey={localFile.key} />
                    <Button
                      small
                      minimal
                      intent={Intent.DANGER}
                      onClick={handleClick(localFile.key)}
                    >
                      <Icon icon={'trash-16'} iconSize={16} />
                    </Button>
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

const ViewButton = ({ fileKey }: { fileKey: string }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { mutateAsync: getAttachmentPresignedUrl } =
    useGetPresignedUrlAttachment();

  const handleViewBtnClick = (key: string) => () => {
    setLoading(true);

    getAttachmentPresignedUrl(key).then((data) => {
      window.open(data.presignedUrl);
      setLoading(false);
    });
  };

  return (
    <Button
      small
      minimal
      onClick={handleViewBtnClick(fileKey)}
      disabled={isLoading}
      intent={Intent.PRIMARY}
    >
      View
    </Button>
  );
};
