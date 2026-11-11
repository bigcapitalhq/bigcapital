import { SyncSystemSendInviteSubscriber } from './SyncSystemSendInvite.subscriber';

describe('SyncSystemSendInviteSubscriber', () => {
  const tenantId = 222;
  const inviterTenantId = 111;

  const buildQueryMock = (overrides: Record<string, jest.Mock> = {}) => ({
    findOne: jest.fn(),
    insert: jest.fn(),
    where: jest.fn(),
    findById: jest.fn(),
    patch: jest.fn(),
    ...overrides,
  });

  const setup = ({
    existingSystemUser = undefined as any,
  }: { existingSystemUser?: any } = {}) => {
    const systemUserQuery = buildQueryMock();
    systemUserQuery.findOne.mockResolvedValue(existingSystemUser);
    systemUserQuery.insert.mockImplementation(async (data) => ({
      id: 999,
      ...data,
    }));

    const inviteQuery = buildQueryMock();
    inviteQuery.where.mockReturnValue({
      delete: jest.fn().mockResolvedValue(1),
    });
    inviteQuery.insert.mockImplementation(async (data) => ({
      id: 1,
      ...data,
    }));

    const tenantUserQuery = buildQueryMock();
    tenantUserQuery.findById.mockReturnValue({
      patch: jest.fn().mockResolvedValue(1),
    });

    const tenantUserModel = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue(tenantUserQuery),
    });

    const systemUserModel = {
      query: jest.fn().mockReturnValue(systemUserQuery),
    };
    const inviteModel = {
      query: jest.fn().mockReturnValue(inviteQuery),
    };
    const eventEmitter = {
      emitAsync: jest.fn().mockResolvedValue(undefined),
    };
    const tenancyContext = {
      getTenant: jest.fn().mockResolvedValue({
        id: tenantId,
        organizationId: 'org-2',
      }),
    };

    const subscriber = new SyncSystemSendInviteSubscriber(
      tenantUserModel as any,
      systemUserModel as any,
      inviteModel as any,
      eventEmitter as any,
      tenancyContext as any,
    );
    return {
      subscriber,
      systemUserQuery,
      inviteQuery,
      tenantUserQuery,
      eventEmitter,
      tenantUserModel,
    };
  };

  const payload = {
    inviteToken: 'token-1',
    user: { id: 50, email: 'john@example.com', active: true },
    invitingUser: { id: 60, firstName: 'Inv', lastName: 'Iter' },
  };

  it('reuses the existing system user with the same email instead of inserting a duplicate', async () => {
    const { subscriber, systemUserQuery, inviteQuery, eventEmitter } = setup({
      existingSystemUser: { id: 999, email: payload.user.email },
    });

    await subscriber.syncSendInviteSystem(payload as any);

    expect(systemUserQuery.insert).not.toHaveBeenCalled();
    expect(inviteQuery.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        email: payload.user.email,
        tenantId,
        userId: 999,
        token: payload.inviteToken,
      }),
    );
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      'onUserSendInviteTenantSynced',
      expect.anything(),
    );
  });

  it('creates a new system user under the current tenant when the email does not exist', async () => {
    const { subscriber, systemUserQuery } = setup({
      existingSystemUser: undefined,
    });

    await subscriber.syncSendInviteSystem(payload as any);

    expect(systemUserQuery.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        email: payload.user.email,
        tenantId,
        verified: true,
      }),
    );
  });

  it('links the tenant user to the system user and clears previous invite tokens', async () => {
    const { subscriber, tenantUserQuery, inviteQuery } = setup({
      existingSystemUser: { id: 999, email: payload.user.email },
    });

    await subscriber.syncSendInviteSystem(payload as any);

    const patch = tenantUserQuery.findById.mock.results[0].value.patch;
    expect(patch).toHaveBeenCalledWith({ systemUserId: 999 });
    expect(inviteQuery.where).toHaveBeenCalledWith({
      userId: 999,
      tenantId,
    });
  });

  it('uses the current tenant id for the invite token row', async () => {
    const { subscriber, inviteQuery } = setup({
      existingSystemUser: { id: 999, email: payload.user.email },
    });

    await subscriber.syncSendInviteSystem(payload as any);

    expect(inviteQuery.insert).toHaveBeenCalledWith(
      expect.objectContaining({ tenantId }),
    );
  });

  it('resend: clears old tokens and stores the new token under the current tenant', async () => {
    const { subscriber, inviteQuery } = setup();

    await subscriber.syncResendInviteSystemUser({
      inviteToken: 'token-2',
      user: { systemUserId: 999, email: payload.user.email },
    } as any);

    expect(inviteQuery.where).toHaveBeenCalledWith({
      userId: 999,
      tenantId,
    });
    expect(inviteQuery.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'token-2',
        tenantId,
        userId: 999,
      }),
    );
  });

  it('never uses the inviter home tenant id for cross-workspace invites', async () => {
    const { subscriber, inviteQuery } = setup({
      existingSystemUser: { id: 999, email: payload.user.email },
    });

    await subscriber.syncSendInviteSystem(payload as any);

    expect(inviteQuery.insert).not.toHaveBeenCalledWith(
      expect.objectContaining({ tenantId: inviterTenantId }),
    );
  });
});
