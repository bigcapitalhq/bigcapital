import { TwoFactorEnforcementGuard } from './TwoFactorEnforcement.guard';
import { TwoFactorSetupRequiredException } from './TwoFactor.exceptions';
import { IS_PUBLIC_ROUTE } from '../Auth.constants';
import { IS_ALLOWED_WITHOUT_TWO_FACTOR } from './TwoFactor.constants';

describe('TwoFactorEnforcementGuard', () => {
  const setup = (opts: {
    authorization?: string;
    metadata?: Record<string, boolean>;
    userId?: number;
    organizationId?: string;
    required?: boolean;
    enabled?: boolean;
  }) => {
    const reflector = {
      getAllAndOverride: jest.fn((key: string) => opts.metadata?.[key]),
    } as any;
    const cls = {
      get: jest.fn((key: string) =>
        key === 'userId' ? opts.userId : opts.organizationId,
      ),
    } as any;
    const policy = {
      isRequiredForOrganization: jest.fn().mockResolvedValue(!!opts.required),
    };
    const twoFactor = {
      isEnabled: jest.fn().mockResolvedValue(!!opts.enabled),
    };
    const guard = new TwoFactorEnforcementGuard(
      reflector,
      cls,
      policy as any,
      twoFactor as any,
    );
    const context = {
      getType: () => 'http',
      getHandler: () => null,
      getClass: () => null,
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: opts.authorization ?? 'Bearer eyJhbGciOi' },
        }),
      }),
    } as any;
    return { guard, context, policy, twoFactor };
  };

  it('lets users with two-factor through when it is required', async () => {
    const { guard, context } = setup({
      userId: 1,
      organizationId: 'org',
      required: true,
      enabled: true,
    });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('refuses sessions without two-factor when it is required', async () => {
    const { guard, context } = setup({
      userId: 1,
      organizationId: 'org',
      required: true,
      enabled: false,
    });
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      TwoFactorSetupRequiredException,
    );
  });

  it('does nothing when the organization does not require it', async () => {
    const { guard, context, twoFactor } = setup({
      userId: 1,
      organizationId: 'org',
      required: false,
    });
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(twoFactor.isEnabled).not.toHaveBeenCalled();
  });

  it('never applies to API keys', async () => {
    const { guard, context, policy } = setup({
      authorization: 'Bearer bc_0123456789abcdef',
      userId: 1,
      organizationId: 'org',
      required: true,
    });
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(policy.isRequiredForOrganization).not.toHaveBeenCalled();
  });

  it('skips public routes and routes allowed without two-factor', async () => {
    for (const key of [IS_PUBLIC_ROUTE, IS_ALLOWED_WITHOUT_TWO_FACTOR]) {
      const { guard, context, policy } = setup({
        metadata: { [key]: true },
        userId: 1,
        organizationId: 'org',
        required: true,
      });
      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(policy.isRequiredForOrganization).not.toHaveBeenCalled();
    }
  });

  it('skips requests without an organization', async () => {
    const { guard, context } = setup({ userId: 1, required: true });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
