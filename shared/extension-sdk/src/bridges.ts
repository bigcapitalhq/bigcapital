/**
 * Typed behavioral seams between core and extensions.
 *
 * A provider key is local to the extension. The host namespaces it as
 * `ext:<extensionId>:<key>` when registering it.
 */
export interface BridgeProvider {
  key: string;
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export type ReportCategory = 'financial' | 'sales' | 'purchases' | 'custom';

export interface ReportDefinition {
  /**
   * Local to the extension. The host exposes it as
   * `ext:<extensionId>:<id>`.
   */
  id: string;
  name: string;
  description?: string;
  category: ReportCategory;
  parametersSchema?: Record<string, unknown>;
  permissions?: {
    subject: string;
    action: string;
  };
}

export interface AccountingQueryFacade {
  accounts: {
    list(): Promise<unknown[]>;
  };
  ledger: {
    entries(filter: Record<string, unknown>): Promise<unknown[]>;
  };
  transactions: {
    list(filter: Record<string, unknown>): Promise<unknown[]>;
  };
  contacts: {
    list(): Promise<unknown[]>;
  };
  items: {
    list(): Promise<unknown[]>;
  };
}

export interface ReportContext {
  organizationId: string;
  userId?: number;
  parameters: unknown;
  query: AccountingQueryFacade;
}

export interface ReportColumn {
  key: string;
  label: string;
}

export interface ReportResult {
  columns: ReportColumn[];
  rows: Array<Record<string, unknown>>;
  meta?: Record<string, unknown>;
}

export interface ReportProvider extends BridgeProvider {
  list(): ReportDefinition[];
  /**
   * `reportId` is the provider-local id from `list()`.
   */
  run(reportId: string, context: ReportContext): Promise<ReportResult>;
}

// ---------------------------------------------------------------------------
// Approvals
// ---------------------------------------------------------------------------

export type ApprovalEntity = 'bill' | 'invoice' | 'expense' | 'manual_journal';

export type ApprovalAction = 'publish' | 'approve' | 'void';

export interface ApprovalContext {
  organizationId: string;
  actorId?: number;
  entity: ApprovalEntity;
  action: ApprovalAction;
  payload: unknown;
}

export type ApprovalDecision =
  | { type: 'allow' }
  | { type: 'deny'; reason: string }
  | {
      type: 'require_approval';
      policyId: string;
      metadata?: unknown;
    };

export interface ApprovalPolicy extends BridgeProvider {
  evaluate(context: ApprovalContext): Promise<ApprovalDecision>;
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export interface PaymentLinkInput {
  organizationId: string;
  amount: number;
  currency: string;
  reference: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentLinkResult {
  reference: string;
  url: string;
  providerKey: string;
  metadata?: Record<string, unknown>;
}

export interface WebhookRequest {
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
  rawBody?: string;
}

export interface WebhookResult {
  handled: boolean;
  providerKey: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}

export interface RefundInput {
  organizationId: string;
  reference: string;
  amount?: number;
  reason?: string;
}

export interface RefundResult {
  reference: string;
  status: string;
  metadata?: Record<string, unknown>;
}

export type PaymentStatusValue =
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'unknown';

export interface PaymentStatusResult {
  reference: string;
  status: PaymentStatusValue;
  metadata?: Record<string, unknown>;
}

export interface PaymentProvider extends BridgeProvider {
  createPaymentLink(input: PaymentLinkInput): Promise<PaymentLinkResult>;
  handleWebhook(request: WebhookRequest): Promise<WebhookResult>;
  refund(input: RefundInput): Promise<RefundResult>;
  getStatus(reference: string): Promise<PaymentStatusResult>;
}

// ---------------------------------------------------------------------------
// Tax
// ---------------------------------------------------------------------------

export type TaxDocumentType =
  | 'invoice'
  | 'bill'
  | 'credit_note'
  | 'vendor_credit';

export interface TaxLine {
  id?: string;
  itemId?: number;
  quantity: number;
  rate: number;
  amount: number;
  taxRateId?: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface TaxContext {
  organizationId: string;
  documentType: TaxDocumentType;
  date: string;
  currency: string;
  lines: TaxLine[];
  party?: {
    country?: string;
    taxId?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface TaxCalculationLine {
  lineId?: string;
  taxRateId?: number;
  taxRate?: number;
  taxAmount: number;
  taxInclusive?: boolean;
}

export interface TaxCalculationResult {
  lines: TaxCalculationLine[];
  totalTaxAmount: number;
  metadata?: Record<string, unknown>;
}

export interface TaxProvider extends BridgeProvider {
  calculate(context: TaxContext): Promise<TaxCalculationResult>;
  validateConfiguration(context: TaxContext): Promise<void>;
}

// ---------------------------------------------------------------------------
// Registration API exposed to extensions
// ---------------------------------------------------------------------------

export interface BridgeRegistryApi<T extends BridgeProvider> {
  /**
   * Registers a provider with the host. The host namespaces the provider key
   * with the extension id.
   */
  register(provider: T): void;
}
