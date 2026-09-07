import { transformToForm } from '@/utils';

const attachmentReqSchema = {
  key: '',
  size: '',
  originName: '',
  mimeType: '',
};

export const transformAttachmentsToForm = (values: {
  attachments?: any[];
  [key: string]: any;
}): Record<string, any>[] => {
  return (values.attachments || []).map((attachment) =>
    transformToForm(attachment, attachmentReqSchema),
  );
};

export const transformAttachmentsToRequest = (values: {
  attachments?: any[];
  [key: string]: any;
}): { key: any }[] => {
  return (values.attachments || []).map((attachment) => ({
    key: attachment.key,
  }));
};
