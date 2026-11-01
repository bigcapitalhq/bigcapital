import { TenantConnectionFactory } from './TenantConnectionFactory';
import { LedgerAnalyticsSyncService } from './LedgerAnalyticsSync.service';
import { ClickHouseSchemaService } from './ClickHouseSchema.service';

const configValues = {
  'tenantDatabase.client': 'mysql2',
  'tenantDatabase.host': 'localhost',
  'tenantDatabase.port': 3306,
  'tenantDatabase.user': 'test',
  'tenantDatabase.password': 'test',
  'tenantDatabase.dbNamePrefix': 'bigcapital_tenant_',
};

const buildSyncService = () => {
  const configService = {
    get: jest.fn((key: string) => configValues[key]),
  } as any;

  const tenantConnectionFactory = new TenantConnectionFactory(configService);

  const syncService = new LedgerAnalyticsSyncService(
    {} as any,
    {} as ClickHouseSchemaService,
    tenantConnectionFactory,
  );

  return { syncService, tenantConnectionFactory };
};

describe('LedgerAnalyticsSyncService', () => {
  describe('buildTenantBalanceRowsQuery', () => {
    it('generates mapped identifiers without raw lowercase aliases', () => {
      const { syncService, tenantConnectionFactory } = buildSyncService();
      const knex = tenantConnectionFactory.createTenantKnex('org-1');

      try {
        const sql = syncService.buildTenantBalanceRowsQuery(knex).toSQL().sql;

        // The tenant databases use upper-case identifiers, and MySQL table
        // aliases are case-sensitive. The query must not contain raw
        // lowercase alias fragments (e.g. `t.credit`).
        expect(sql).toContain('sum(`CREDIT`) as `CREDIT`');
        expect(sql).toContain('sum(`DEBIT`) as `DEBIT`');
        expect(sql).toContain('`A`.`ACCOUNT_TYPE` as `ACCOUNT_TYPE`');
        expect(sql).not.toMatch(/`[a-z]\.`\w+`/);
        expect(sql).not.toContain('t.credit');
        expect(sql).not.toContain('t.debit');
      } finally {
        knex.destroy();
      }
    });
  });
});
