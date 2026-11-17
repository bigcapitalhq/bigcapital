import knex, { Knex } from 'knex';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { Bill } from '@/modules/Bills/models/Bill';

describe('Aging summary query modifiers', () => {
  let db: Knex;

  beforeAll(() => {
    db = knex({ client: 'mysql2' });
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('A/R aging summary', () => {
    it.each(['dueInvoicesFromDate', 'overdueInvoicesFromDate'])(
      'excludes draft (not delivered) invoices in %s',
      (modifier) => {
        const { sql } = SaleInvoice.query(db)
          .modify(modifier, '2026-01-01')
          .toKnexQuery()
          .toSQL();

        expect(sql).toContain('`delivered_at` is not null');
      },
    );
  });

  describe('A/P aging summary', () => {
    it.each(['dueBillsFromDate', 'overdueBillsFromDate'])(
      'excludes draft (not opened) bills in %s',
      (modifier) => {
        const { sql } = Bill.query(db)
          .modify(modifier, '2026-01-01')
          .toKnexQuery()
          .toSQL();

        expect(sql).toContain('`opened_at` is not null');
      },
    );
  });
});
