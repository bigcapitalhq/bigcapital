// Query key constants
export const SALE_ESTIMATES = 'SALE_ESTIMATES';
export const SALE_ESTIMATE = 'SALE_ESTIMATE';
export const SALE_ESTIMATE_SMS_DETAIL = 'SALE_ESTIMATE_SMS_DETAIL';
export const NOTIFY_SALE_ESTIMATE_BY_SMS = 'NOTIFY_SALE_ESTIMATE_BY_SMS';
export const SALE_ESTIMATE_MAIL_OPTIONS = 'SALE_ESTIMATE_MAIL_OPTIONS';

// Query key factory
export const estimatesKeys = {
  all: () => [SALE_ESTIMATES] as const,
  list: (query?: Record<string, unknown>) => [SALE_ESTIMATES, query] as const,
  detail: (id: number | null | undefined) => [SALE_ESTIMATE, id] as const,
  smsDetail: (id: number | null | undefined) =>
    [SALE_ESTIMATE_SMS_DETAIL, id] as const,
  html: (id: number | null | undefined) => ['SALE_ESTIMATE_HTML', id] as const,
  state: () => ['SALE_ESTIMATE_STATE'] as const,
  mailOptions: (id: number | null | undefined) =>
    [SALE_ESTIMATE_MAIL_OPTIONS, id] as const,
  notifyBySms: (id: number | null | undefined) =>
    [NOTIFY_SALE_ESTIMATE_BY_SMS, id] as const,
};

// Grouped object for use in components/hooks
export const EstimatesQueryKeys = {
  SALE_ESTIMATES,
  SALE_ESTIMATE,
  SALE_ESTIMATE_SMS_DETAIL,
  NOTIFY_SALE_ESTIMATE_BY_SMS,
  SALE_ESTIMATE_MAIL_OPTIONS,
} as const;
