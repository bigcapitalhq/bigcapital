export type IMailAttachment = MailAttachmentPath | MailAttachmentContent;

export interface MailAttachmentPath {
  filename: string;
  path: string;
  cid: string;
}
export interface MailAttachmentContent {
  filename: string;
  content: Buffer;
}
