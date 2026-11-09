// Query key constants
export const PAYMENT_RECEIVES = 'PAYMENT_RECEIVES';
export const PAYMENT_RECEIVE = 'PAYMENT_RECEIVE';
export const PAYMENT_RECEIVE_NEW_ENTRIES = 'PAYMENT_RECEIVE_NEW_ENTRIES';
export const PAYMENT_RECEIVE_EDIT_PAGE = 'PAYMENT_RECEIVE_EDIT_PAGE';
export const PAYMENT_RECEIVE_SMS_DETAIL = 'PAYMENT_RECEIVE_SMS_DETAIL';
export const NOTIFY_PAYMENT_RECEIVE_BY_SMS = 'NOTIFY_PAYMENT_RECEIVE_BY_SMS';
export const PAYMENT_RECEIVE_MAIL_OPTIONS = 'PAYMENT_RECEIVE_MAIL_OPTIONS';

// Query key factory
export const paymentReceivesKeys = {
  all: () => [PAYMENT_RECEIVES] as const,
  list: (query?: Record<string, unknown>) => [PAYMENT_RECEIVES, query] as const,
  detail: (id: number | null | undefined) => [PAYMENT_RECEIVE, id] as const,
  editPage: (id: number | null | undefined) =>
    [PAYMENT_RECEIVE_EDIT_PAGE, id] as const,
  smsDetail: (id: number | null | undefined) =>
    [PAYMENT_RECEIVE_SMS_DETAIL, id] as const,
  html: (id: number | null | undefined) =>
    ['PAYMENT_RECEIVED_HTML', id] as const,
  state: () => ['PAYMENT_RECEIVED_STATE'] as const,
  mailOptions: (id: number | null | undefined) =>
    [PAYMENT_RECEIVE_MAIL_OPTIONS, id] as const,
  notifyBySms: (id: number | null | undefined) =>
    [NOTIFY_PAYMENT_RECEIVE_BY_SMS, id] as const,
};

// Grouped object for use in components/hooks
export const PaymentReceivesQueryKeys = {
  PAYMENT_RECEIVES,
  PAYMENT_RECEIVE,
  PAYMENT_RECEIVE_NEW_ENTRIES,
  PAYMENT_RECEIVE_EDIT_PAGE,
  PAYMENT_RECEIVE_SMS_DETAIL,
  NOTIFY_PAYMENT_RECEIVE_BY_SMS,
  PAYMENT_RECEIVE_MAIL_OPTIONS,
} as const;
