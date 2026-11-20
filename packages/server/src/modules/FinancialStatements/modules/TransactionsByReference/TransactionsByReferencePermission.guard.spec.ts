import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import {
  REFERENCE_TYPE_SUBJECTS,
  TransactionsByReferencePermissionGuard,
} from './TransactionsByReferencePermission.guard';

const contextOf = (query: any, ability?: any): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ query, ability }) }),
  }) as unknown as ExecutionContext;

/** The predefined `admin` role resolves to `manage all`, which answers true
 * for every subject including the wildcard 'all'. */
const adminAbility = { can: () => true };

/** A restricted role carries per-subject rules, so 'all' answers false —
 * checked against @casl/ability itself. */
const abilityFor = (subject: AbilitySubject) => ({
  can: (_action: string, subjectUnderTest: AbilitySubject | 'all') =>
    subjectUnderTest === subject,
});

describe('TransactionsByReferencePermissionGuard', () => {
  const guard = new TransactionsByReferencePermissionGuard();

  it('lets an administrator through', () => {
    expect(
      guard.canActivate(
        contextOf({ referenceType: 'SaleInvoice' }, adminAbility),
      ),
    ).toBe(true);
  });

  it.each(Object.entries(REFERENCE_TYPE_SUBJECTS))(
    'allows %s to whoever may view %s',
    (referenceType, subject) => {
      expect(
        guard.canActivate(contextOf({ referenceType }, abilityFor(subject))),
      ).toBe(true);
    },
  );

  it('refuses a reference type the user may not view', () => {
    expect(() =>
      guard.canActivate(
        contextOf(
          { referenceType: 'SaleInvoice' },
          abilityFor(AbilitySubject.Bill),
        ),
      ),
    ).toThrow(ForbiddenException);
  });

  it('refuses a reference type it cannot map to a permission', () => {
    expect(() =>
      guard.canActivate(
        contextOf(
          { referenceType: 'NotAReferenceType' },
          abilityFor(AbilitySubject.Bill),
        ),
      ),
    ).toThrow(ForbiddenException);
  });

  it('does not hold an administrator up on an unmapped reference type', () => {
    // A gap in the map must fall on the restricted roles this gates, not on
    // whoever may view everything anyway.
    expect(
      guard.canActivate(
        contextOf({ referenceType: 'NotAReferenceType' }, adminAbility),
      ),
    ).toBe(true);
  });

  it('reads the reference type in either spelling', () => {
    // Guards run before the interceptor that camel-cases the query.
    expect(
      guard.canActivate(
        contextOf({ reference_type: 'Bill' }, abilityFor(AbilitySubject.Bill)),
      ),
    ).toBe(true);
  });

  it('refuses when no ability was attached to the request', () => {
    expect(() =>
      guard.canActivate(contextOf({ referenceType: 'SaleInvoice' })),
    ).toThrow(ForbiddenException);
  });

  it('covers every reference type the ledger writes', () => {
    // The `transactionType` each GL writer sets, which is persisted as the
    // `reference_type` this report queries. An unmapped one is refused, so a
    // new writer has to be added here as well:
    //   grep -rhoE "transactionType: '[A-Za-z]+'" packages/server/src/modules
    const writtenToTheLedger = [
      'SaleInvoice',
      'InvoiceWriteOff',
      'SaleReceipt',
      'PaymentReceive',
      'CreditNote',
      'RefundCreditNote',
      'CustomerOpeningBalance',
      'Bill',
      'LandedCost',
      'BillPayment',
      'VendorCredit',
      'RefundVendorCredit',
      'VendorOpeningBalance',
      'Expense',
      'Journal',
      'ManualJournal',
      'CashflowTransaction',
      'InventoryAdjustment',
      'WarehouseTransfer',
      'OpeningBalance',
    ];
    writtenToTheLedger.forEach((referenceType) => {
      expect(REFERENCE_TYPE_SUBJECTS[referenceType]).toBeDefined();
    });
  });

  it('admits the reference types the e2e suite reads', () => {
    // test/_utils/gl.ts `fetchLegs` — these run as an administrator.
    ['LandedCost', 'InvoiceWriteOff'].forEach((referenceType) => {
      expect(
        guard.canActivate(contextOf({ referenceType }, adminAbility)),
      ).toBe(true);
    });
  });
});
