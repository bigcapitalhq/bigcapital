import { Ability } from '@casl/ability';
import {
  cacheAbility,
  getCachedAbility,
  purgeTenantAbilities,
  purgeUserAbility,
} from './TenantAbilities';

describe('TenantAbilities', () => {
  const buildAbility = () => new Ability([]);

  it('caches and retrieves the ability per tenant and user', () => {
    const ability = buildAbility();

    cacheAbility('org-a', 10, ability);

    expect(getCachedAbility('org-a', 10)).toBe(ability);
    expect(getCachedAbility('org-a', 20)).toBeUndefined();
    expect(getCachedAbility('org-b', 10)).toBeUndefined();
  });

  it('purges all cached abilities of the given tenant only', () => {
    const abilityA = buildAbility();
    const abilityB = buildAbility();

    cacheAbility('org-a', 10, abilityA);
    cacheAbility('org-a', 20, abilityA);
    cacheAbility('org-b', 10, abilityB);

    purgeTenantAbilities('org-a');

    expect(getCachedAbility('org-a', 10)).toBeUndefined();
    expect(getCachedAbility('org-a', 20)).toBeUndefined();
    expect(getCachedAbility('org-b', 10)).toBe(abilityB);
  });

  it('purges a single user ability without touching the other tenant users', () => {
    const abilityA = buildAbility();
    const abilityB = buildAbility();

    cacheAbility('org-a', 10, abilityA);
    cacheAbility('org-a', 20, abilityB);

    purgeUserAbility('org-a', 10);

    expect(getCachedAbility('org-a', 10)).toBeUndefined();
    expect(getCachedAbility('org-a', 20)).toBe(abilityB);
  });
});
