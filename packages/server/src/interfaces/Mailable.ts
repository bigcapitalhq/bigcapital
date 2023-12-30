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

export interface IMailable {
  constructor(view: string, data?: { [key: string]: string | number });
  send(): Promise<any>;
  build(): void;
  setData(data: { [key: string]: string | number }): IMailable;
  setTo(to: string): IMailable;
  setFrom(from: string): IMailable;
  setSubject(subject: string): IMailable;
  setView(view: string): IMailable;
  render(data?: { [key: string]: string | number }): string;
  getViewContent(): string;
}

export interface AddressItem {
  label: string;
  mail: string;
  primary?: boolean;
}

export interface CommonMailOptions {
  toAddresses: AddressItem[];
  fromAddresses: AddressItem[];
  from: string;
  to: string | string[];
  subject: string;
  body: string;
  data?: Record<string, any>;
}

export interface CommonMailOptionsDTO {
  to?: string | string[];
  from?: string;
  subject?: string;
  body?: string;
}
