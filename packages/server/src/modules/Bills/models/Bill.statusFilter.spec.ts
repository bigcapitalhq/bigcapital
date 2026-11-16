import knex, { Knex } from 'knex';
import { Bill } from './Bill';

describe('Bill status filter', () => {
  let db: Knex;

  beforeAll(() => {
    db = knex({ client: 'mysql2' });
  });

  afterAll(async () => {
    await db.destroy();
  });

  const buildSql = (status: string): string => {
    return Bill.query(db).modify('statusFilter', status).toKnexQuery().toSQL()
      .sql;
  };

  it('filters draft bills by the opened state', () => {
    expect(buildSql('draft')).toContain('`opened_at` is null');
  });

  it('filters opened bills by the opened state', () => {
    expect(buildSql('opened')).toContain('`opened_at` is not null');
  });

  it('maps the legacy delivered status to opened bills', () => {
    expect(buildSql('delivered')).toContain('`opened_at` is not null');
  });

  it('keeps the unpaid filter based on the paid amount', () => {
    expect(buildSql('unpaid')).toContain('`payment_amount` = ?');
  });

  it('filters paid bills by the opened state and the due amount', () => {
    const sql = buildSql('paid');

    expect(sql).toContain('`opened_at` is not null');
    expect(sql).toContain('GREATEST(');
    expect(sql).toContain('COALESCE(AMOUNT, 0)');
    expect(sql).toContain('COALESCE(DISCOUNT, 0)');
    expect(sql).toContain('COALESCE(TAX_AMOUNT_WITHHELD, 0)');
    expect(sql).toContain('COALESCE(CREDITED_AMOUNT, 0)');
    expect(sql).toContain('= 0');
    expect(sql).not.toContain('PAYMENT_AMOUNT = AMOUNT');
  });

  it('filters overdue bills by the opened state, due date and due amount', () => {
    const sql = buildSql('overdue');

    expect(sql).toContain('`opened_at` is not null');
    expect(sql).toContain('`due_date` < ?');
    expect(sql).toContain('GREATEST(');
    expect(sql).toContain('> 0');
  });

  it('filters partially paid bills by the due and total amounts', () => {
    const sql = buildSql('partially-paid');

    expect(sql).toContain('GREATEST(');
    expect(sql).toContain('> 0');
    expect(sql).toContain('COALESCE(DISCOUNT, 0)');
    expect(sql).toContain('COALESCE(CREDITED_AMOUNT, 0)');
    expect(sql).not.toContain('PAYMENT_AMOUNT = AMOUNT');
  });
});
