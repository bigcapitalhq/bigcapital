import { AbilitySchema } from './AbilitySchema';
import { getInvalidPermissions } from './utils';
import { AbilitySubject } from './Roles.types';
import { SaleInvoiceAction } from '../SaleInvoices/SaleInvoice.types';

describe('AbilitySchema', () => {
  it('accepts the invoice write-off ability the controller checks', () => {
    // SaleInvoicesController guards write-off with SaleInvoiceAction.Writeoff.
    const permissions = [
      {
        subject: AbilitySubject.SaleInvoice,
        ability: SaleInvoiceAction.Writeoff,
      },
    ];
    expect(getInvalidPermissions(AbilitySchema, permissions)).toEqual([]);
  });

  it('rejects the legacy `bad-debt` ability name', () => {
    const permissions = [
      { subject: AbilitySubject.SaleInvoice, ability: 'bad-debt' },
    ];
    expect(getInvalidPermissions(AbilitySchema, permissions)).toHaveLength(1);
  });
});
