import { transformToForm } from '@/utils';

export interface AttachmentFormValue {
  key: string;
  size: number;
  originName: string;
  mimeType: string;
}

interface AttachmentsLike {
  attachments?: unknown[];
}

const getAttachments = (values: unknown): unknown[] | undefined =>
  (values as AttachmentsLike | null | undefined)?.attachments;

const attachmentReqSchema = {
  key: '',
  size: 0,
  originName: '',
  mimeType: '',
};

export const transformAttachmentsToForm = (
  values: unknown,
): Array<Record<string, unknown>> => {
  return (
    getAttachments(values)?.map((attachment) =>
      transformToForm(attachment, attachmentReqSchema),
    ) ?? []
  );
};

export const transformAttachmentsToRequest = (
  values: unknown,
): Array<{ key: string }> | undefined => {
  return getAttachments(values)?.map((attachment) => ({
    key: (attachment as AttachmentFormValue).key,
  }));
};
