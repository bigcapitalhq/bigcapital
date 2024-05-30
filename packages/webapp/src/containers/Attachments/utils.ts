// @ts-nocheck
import { transformToForm } from '@/utils';

const attachmentReqSchema = {
  key: '',
  size: '',
  origin_name: '',
  mime_type: '',
};

export const transformAttachmentsToForm = (values) => {
  return values.attachments?.map((attachment) =>
    transformToForm(attachment, attachmentReqSchema),
  );
};

export const transformAttachmentsToRequest = (values) => {
  return values.attachments?.map((attachment) => ({ key: attachment.key }));
};
