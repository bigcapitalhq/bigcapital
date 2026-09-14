import { Ability } from '@casl/ability';
import { PurgeUserAbilityCacheSubscriber } from './PurgeUserAbilityCache.subscriber';
import {
  cacheAbility,
  getCachedAbility,
  purgeTenantAbilities,
} from '@/modules/Roles/TenantAbilities';

describe('PurgeUserAbilityCacheSubscriber', () => {
  const organizationId = 'org-a';
  const systemUserId = 10;

  let clsStore: Record<string, any>;
  let subscriber: PurgeUserAbilityCacheSubscriber;

  beforeEach(() => {
    purgeTenantAbilities(organizationId);
    purgeTenantAbilities('org-b');
    clsStore = { organizationId };
    subscriber = new PurgeUserAbilityCacheSubscriber({
      get: jest.fn((key: string) => clsStore[key]),
    } as any);
  });

  it('purges the ability of the mutated tenant user only', () => {
    const ability = new Ability([]);
    const otherUserAbility = new Ability([]);
    cacheAbility(organizationId, systemUserId, ability);
    cacheAbility(organizationId, 20, otherUserAbility);

    subscriber.purgeAuthorizedUserAbility({
      tenantUser: { systemUserId },
    } as any);

    expect(getCachedAbility(organizationId, systemUserId)).toBeUndefined();
    expect(getCachedAbility(organizationId, 20)).toBe(otherUserAbility);
  });

  it('keeps the ability of the same user in another tenant', () => {
    const ability = new Ability([]);
    const otherTenantAbility = new Ability([]);
    cacheAbility(organizationId, systemUserId, ability);
    cacheAbility('org-b', systemUserId, otherTenantAbility);

    subscriber.purgeAuthorizedUserAbility({
      tenantUser: { systemUserId },
    } as any);

    expect(getCachedAbility('org-b', systemUserId)).toBe(otherTenantAbility);
  });

  it('does nothing when the organization id is missing', () => {
    const ability = new Ability([]);
    cacheAbility(organizationId, systemUserId, ability);
    clsStore.organizationId = undefined;

    expect(() =>
      subscriber.purgeAuthorizedUserAbility({
        tenantUser: { systemUserId },
      } as any),
    ).not.toThrow();
    expect(getCachedAbility(organizationId, systemUserId)).toBe(ability);
  });
});
