import { ApprovalRegistry } from './approvals/approval.registry';
import { PaymentRegistry } from './payments/payment.registry';
import { ReportRegistry } from './reports/report.registry';
import { TaxRegistry } from './tax/tax.registry';

export * from './bridge.registry';
export * from './approvals/approval.registry';
export * from './payments/payment.registry';
export * from './reports/report.registry';
export * from './tax/tax.registry';

/**
 * The bridge registry set shared by the static and runtime extension contexts.
 */
export class ExtensionBridgeRegistries {
  readonly reports = new ReportRegistry();
  readonly approvals = new ApprovalRegistry();
  readonly payments = new PaymentRegistry();
  readonly tax = new TaxRegistry();
}
