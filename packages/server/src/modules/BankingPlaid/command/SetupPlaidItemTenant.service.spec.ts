import { SetupPlaidItemTenantService } from './SetupPlaidItemTenant.service';

const buildService = ({
  plaidItem = { plaidItemId: 'item-1', tenantId: 5 } as unknown,
  memberships = [{ userId: 9, tenantId: 5 }] as unknown[],
} = {}) => {
  const clsService = { set: jest.fn() };

  const systemPlaidItemModel = {
    query: () => ({ findOne: jest.fn().mockResolvedValue(plaidItem) }),
  };
  const tenantModel = {
    query: () => ({
      findOne: () => ({
        throwIfNotFound: jest
          .fn()
          .mockResolvedValue({ id: 5, organizationId: 'org-5' }),
      }),
    }),
  };
  const userTenantWhere = jest.fn().mockResolvedValue(memberships);
  const userTenantModel = { query: () => ({ where: userTenantWhere }) };

  // Captures the user lookup so its conditions can be inspected.
  const userQuery: any = {};
  userQuery.modify = jest.fn(() => userQuery);
  userQuery.where = jest.fn(() => userQuery);
  userQuery.first = jest.fn(() => userQuery);
  userQuery.throwIfNotFound = jest.fn().mockResolvedValue({ id: 9 });
  const systemUserModel = { query: () => userQuery };

  const service = new SetupPlaidItemTenantService(
    clsService as any,
    systemPlaidItemModel as any,
    tenantModel as any,
    systemUserModel as any,
    userTenantModel as any,
  );
  return { service, clsService, userQuery, userTenantWhere };
};

describe('SetupPlaidItemTenantService', () => {
  it('runs the callback as an active member of the item workspace', async () => {
    const { service, clsService, userQuery, userTenantWhere } = buildService();
    const callback = jest.fn().mockResolvedValue('done');

    await expect(service.setupPlaidTenant('item-1', callback)).resolves.toBe(
      'done',
    );
    expect(userTenantWhere).toHaveBeenCalledWith('tenantId', 5);
    expect(userQuery.modify).toHaveBeenCalledWith('active');

    // The user is found among the workspace members, or by their original tenant.
    const builder = { whereIn: jest.fn(), orWhere: jest.fn() };
    builder.whereIn.mockReturnValue(builder);
    userQuery.where.mock.calls[0][0](builder);
    expect(builder.whereIn).toHaveBeenCalledWith('id', [9]);
    expect(builder.orWhere).toHaveBeenCalledWith('tenantId', 5);

    expect(clsService.set).toHaveBeenCalledWith('organizationId', 'org-5');
    expect(clsService.set).toHaveBeenCalledWith('userId', 9);
    expect(callback).toHaveBeenCalled();
  });

  it('rejects an unknown Plaid item', async () => {
    const { service } = buildService({ plaidItem: null });

    await expect(
      service.setupPlaidTenant('item-unknown', jest.fn()),
    ).rejects.toThrow('Plaid item not found');
  });
});
