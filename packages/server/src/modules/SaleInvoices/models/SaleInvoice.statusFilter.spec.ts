import knex, { Knex } from 'knex';
import { SaleInvoice } from './SaleInvoice';

describe('SaleInvoice status filter', () => {
  let db: Knex;

  beforeAll(() => {
    db = knex({ client: 'mysql2' });
  });

  afterAll(async () => {
    await db.destroy();
  });

  const buildSql = (status: string): string => {
    return SaleInvoice.query(db)
      .modify('statusFilter', status)
      .toKnexQuery()
      .toSQL().sql;
  };

  it('filters draft invoices by the delivery state', () => {
    expect(buildSql('draft')).toContain('`delivered_at` is null');
  });

  it('filters delivered invoices by the delivery state', () => {
    expect(buildSql('delivered')).toContain('`delivered_at` is not null');
  });

  it('keeps the unpaid filter based on the paid amount', () => {
    expect(buildSql('unpaid')).toContain('PAYMENT_AMOUNT = 0');
  });

  it('filters paid invoices by the delivery state and the due amount', () => {
    const sql = buildSql('paid');

    expect(sql).toContain('`delivered_at` is not null');
    expect(sql).toContain('GREATEST(');
    expect(sql).toContain('COALESCE(BALANCE, 0)');
    expect(sql).toContain('COALESCE(DISCOUNT, 0)');
    expect(sql).toContain('COALESCE(TAX_AMOUNT_WITHHELD, 0)');
    expect(sql).toContain('COALESCE(WRITTENOFF_AMOUNT, 0)');
    expect(sql).toContain('COALESCE(CREDITED_AMOUNT, 0)');
    expect(sql).toContain('= 0');
    expect(sql).not.toContain('PAYMENT_AMOUNT = BALANCE');
  });

  it('filters overdue invoices by the delivery state, due date and due amount', () => {
    const sql = buildSql('overdue');

    expect(sql).toContain('`delivered_at` is not null');
    expect(sql).toContain('`due_date` < ?');
    expect(sql).toContain('GREATEST(');
    expect(sql).toContain('> 0');
  });

  it('filters partially paid invoices by the due and total amounts', () => {
    const sql = buildSql('partially-paid');

    expect(sql).toContain('GREATEST(');
    expect(sql).toContain('> 0');
    expect(sql).toContain('COALESCE(DISCOUNT, 0)');
    expect(sql).toContain('COALESCE(WRITTENOFF_AMOUNT, 0)');
    expect(sql).toContain('COALESCE(CREDITED_AMOUNT, 0)');
    expect(sql).not.toContain('PAYMENT_AMOUNT = BALANCE');
  });
});
