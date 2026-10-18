import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AbilitySubject } from '@/modules/Roles/Roles.types';

/**
 * The report returns the ledger entries of one transaction, so the permission
 * that governs it is the one that governs that transaction — not a report
 * permission. Every caller is a panel inside a transaction drawer (invoice,
 * bill, payment, receipt, credit note, vendor credit, inventory adjustment),
 * opened from a page the user already had to be allowed to see.
 *
 * Every reference type the ledger writes is mapped. They are the values the GL
 * writers put in `transactionType`, which `Ledger`'s storage utils persist as
 * the `reference_type` column this report queries — not always the name of the
 * module that writes them.
 */
export const REFERENCE_TYPE_SUBJECTS: Readonly<Record<string, AbilitySubject>> =
  {
    SaleInvoice: AbilitySubject.SaleInvoice,
    // A write-off is posted against the invoice it writes off.
    InvoiceWriteOff: AbilitySubject.SaleInvoice,
    SaleReceipt: AbilitySubject.SaleReceipt,
    PaymentReceive: AbilitySubject.PaymentReceive,
    CreditNote: AbilitySubject.CreditNote,
    RefundCreditNote: AbilitySubject.CreditNote,
    CustomerOpeningBalance: AbilitySubject.Customer,

    Bill: AbilitySubject.Bill,
    // Landed costs are allocated onto a bill and read from its drawer.
    LandedCost: AbilitySubject.Bill,
    BillPayment: AbilitySubject.PaymentMade,
    VendorCredit: AbilitySubject.VendorCredit,
    RefundVendorCredit: AbilitySubject.VendorCredit,
    VendorOpeningBalance: AbilitySubject.Vendor,

    Expense: AbilitySubject.Expense,
    // `ManualJournalGL` writes its reference type as 'Journal'.
    Journal: AbilitySubject.ManualJournal,
    ManualJournal: AbilitySubject.ManualJournal,
    CashflowTransaction: AbilitySubject.Cashflow,
    InventoryAdjustment: AbilitySubject.InventoryAdjustment,
    WarehouseTransfer: AbilitySubject.Warehouse,
    OpeningBalance: AbilitySubject.Account,
  };

/**
 * Every domain action enum spells its read ability the same way.
 */
const VIEW_ACTION = 'View';

@Injectable()
export class TransactionsByReferencePermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ability = (request as any).ability;

    if (!ability) {
      throw new ForbiddenException(
        'Ability instance not found. Ensure AuthorizationGuard is applied.',
      );
    }
    // A role that may view everything is let through without consulting the
    // map, so that a reference type missing from it falls on the restricted
    // roles this gates rather than on an administrator reading a drawer. Only
    // a `manage all` rule satisfies a check against the subject 'all'.
    if (ability.can(VIEW_ACTION, 'all')) {
      return true;
    }
    // Guards run before the interceptor that camel-cases the query, so accept
    // the spelling the client sent.
    const referenceType =
      request.query?.referenceType ?? request.query?.reference_type;
    const subject = REFERENCE_TYPE_SUBJECTS[referenceType];

    // An unmapped reference type is refused rather than waved through: the
    // ledger holds rows for types no drawer reads, and a permission cannot be
    // inferred for them.
    if (!subject) {
      throw new ForbiddenException(
        `You do not have permission to ${VIEW_ACTION} transactions of the reference type ${referenceType}`,
      );
    }
    if (!ability.can(VIEW_ACTION, subject)) {
      throw new ForbiddenException(
        `You do not have permission to ${VIEW_ACTION} ${subject}`,
      );
    }
    return true;
  }
}
