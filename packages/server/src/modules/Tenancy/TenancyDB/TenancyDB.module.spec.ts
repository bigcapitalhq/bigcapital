import { tenancyDatabaseConnectionFactory } from './TenancyDB.module';

describe('tenancyDatabaseConnectionFactory', () => {
  const createConnection = async (
    dbNamePrefix: string,
    organizationId: string,
  ) => {
    const config: Record<string, unknown> = {
      'tenantDatabase.client': 'mysql',
      'tenantDatabase.host': 'localhost',
      'tenantDatabase.port': 3306,
      'tenantDatabase.user': 'user',
      'tenantDatabase.password': 'password',
      'tenantDatabase.dbNamePrefix': dbNamePrefix,
    };
    const configService = { get: (key: string) => config[key] } as any;
    const cls = { get: () => organizationId } as any;

    const getConnection = await tenancyDatabaseConnectionFactory(
      configService,
      cls,
    );
    return getConnection();
  };

  it('connects to the tenant database named with the configured prefix', async () => {
    const connection = await createConnection(
      'bigcapital_integration_tenant_',
      'org-custom-prefix',
    );

    expect(connection.client.config.connection.database).toBe(
      'bigcapital_integration_tenant_org-custom-prefix',
    );
    await connection.destroy();
  });

  it('still uses the default prefix when that is the configured one', async () => {
    const connection = await createConnection(
      'bigcapital_tenant_',
      'org-default-prefix',
    );

    expect(connection.client.config.connection.database).toBe(
      'bigcapital_tenant_org-default-prefix',
    );
    await connection.destroy();
  });
});
