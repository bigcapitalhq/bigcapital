// Query key constants
export const SALE_RECEIPTS = 'SALE_RECEIPTS';
export const SALE_RECEIPT = 'SALE_RECEIPT';
export const SALE_RECEIPT_SMS_DETAIL = 'SALE_RECEIPT_SMS_DETAIL';
export const NOTIFY_SALE_RECEIPT_BY_SMS = 'NOTIFY_SALE_RECEIPT_BY_SMS';
export const SALE_RECEIPT_MAIL_OPTIONS = 'SALE_RECEIPT_MAIL_OPTIONS';

// Query key factory
export const receiptsKeys = {
  all: () => [SALE_RECEIPTS] as const,
  list: (query?: Record<string, unknown>) => [SALE_RECEIPTS, query] as const,
  detail: (id: number | null | undefined) => [SALE_RECEIPT, id] as const,
  smsDetail: (id: number | null | undefined) =>
    [SALE_RECEIPT_SMS_DETAIL, id] as const,
  html: (id: number | null | undefined) => ['SALE_RECEIPT_HTML', id] as const,
  state: () => ['SALE_RECEIPT_STATE'] as const,
  mailOptions: (id: number | null | undefined) =>
    [SALE_RECEIPT_MAIL_OPTIONS, id] as const,
  notifyBySms: (id: number | null | undefined) =>
    [NOTIFY_SALE_RECEIPT_BY_SMS, id] as const,
};

// Grouped object for use in components/hooks
export const ReceiptsQueryKeys = {
  SALE_RECEIPTS,
  SALE_RECEIPT,
  SALE_RECEIPT_SMS_DETAIL,
  NOTIFY_SALE_RECEIPT_BY_SMS,
  SALE_RECEIPT_MAIL_OPTIONS,
} as const;
