// Query key constants
export const CREDIT_NOTE = 'CREDIT_NOTE';
export const CREDIT_NOTES = 'CREDIT_NOTES';
export const REFUND_CREDIT_NOTE = 'REFUND_CREDIT_NOTE';
export const REFUND_CREDIT_NOTE_TRANSACTION = 'REFUND_CREDIT_NOTE_TRANSACTION';
export const RECONCILE_CREDIT_NOTE = 'RECONCILE_CREDIT_NOTE';
export const RECONCILE_CREDIT_NOTES = 'RECONCILE_CREDIT_NOTES';
export const CREDIT_NOTE_HTML = 'CREDIT_NOTE_HTML';

// Query key factory
export const creditNotesKeys = {
  all: () => [CREDIT_NOTES] as const,
  list: (query?: Record<string, unknown>) => [CREDIT_NOTES, query] as const,
  detail: (id: number | null | undefined) => [CREDIT_NOTE, id] as const,
  refund: (id: number | null | undefined) => [REFUND_CREDIT_NOTE, id] as const,
  refundTransaction: (id: number | null | undefined) =>
    [REFUND_CREDIT_NOTE_TRANSACTION, id] as const,
  reconcile: (id: number | null | undefined) =>
    [RECONCILE_CREDIT_NOTE, id] as const,
  reconciles: (id: number | null | undefined) =>
    [RECONCILE_CREDIT_NOTES, id] as const,
  state: () => ['CREDIT_NOTE_STATE'] as const,
  mailOptions: (id: number | null | undefined) =>
    ['CREDIT_NOTE_MAIL_OPTIONS', id] as const,
  html: (id: number | null | undefined) => [CREDIT_NOTE_HTML, id] as const,
};

// Grouped object for use in components/hooks
export const CreditNotesQueryKeys = {
  CREDIT_NOTE,
  CREDIT_NOTES,
  REFUND_CREDIT_NOTE,
  REFUND_CREDIT_NOTE_TRANSACTION,
  RECONCILE_CREDIT_NOTE,
  RECONCILE_CREDIT_NOTES,
} as const;
