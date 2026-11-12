import { Ability } from '@casl/ability';
import { validateAbilityCanAssignRole } from './Users.utils';
import { ERRORS } from './Users.constants';

const buildAbility = (rules: Array<{ action: string; subject: string }>) =>
  new Ability(rules as any);

const buildRole = (slug: string, permissions: any[] = []) =>
  ({ slug, permissions }) as any;

describe('validateAbilityCanAssignRole', () => {
  it('allows the admin to assign any role, including the admin role', () => {
    const adminAbility = buildAbility([{ action: 'manage', subject: 'all' }]);

    expect(() =>
      validateAbilityCanAssignRole(adminAbility, buildRole('admin')),
    ).not.toThrow();

    expect(() =>
      validateAbilityCanAssignRole(
        adminAbility,
        buildRole('custom', [
          { ability: 'Delete', subject: 'SaleInvoice', value: true },
        ]),
      ),
    ).not.toThrow();
  });

  it('denies assigning the admin role to a non-admin user', () => {
    const ability = buildAbility([
      { action: 'View', subject: 'User' },
      { action: 'Create', subject: 'User' },
    ]);

    expect(() =>
      validateAbilityCanAssignRole(ability, buildRole('admin')),
    ).toThrow(
      expect.objectContaining({
        errorType: ERRORS.CANNOT_ASSIGN_ROLE_WITH_HIGHER_PRIVILEGES,
      }),
    );
  });

  it('denies assigning a role that carries a permission the user does not hold', () => {
    const ability = buildAbility([{ action: 'View', subject: 'Customer' }]);
    const role = buildRole('custom', [
      { ability: 'View', subject: 'Customer', value: true },
      { ability: 'Delete', subject: 'Customer', value: true },
    ]);

    expect(() => validateAbilityCanAssignRole(ability, role)).toThrow();
  });

  it('allows assigning a role that is a subset of the user permissions', () => {
    const ability = buildAbility([
      { action: 'View', subject: 'Customer' },
      { action: 'Edit', subject: 'Customer' },
    ]);
    const role = buildRole('custom', [
      { ability: 'View', subject: 'Customer', value: true },
    ]);

    expect(() => validateAbilityCanAssignRole(ability, role)).not.toThrow();
  });

  it('ignores the disabled role permissions', () => {
    const ability = buildAbility([{ action: 'View', subject: 'Customer' }]);
    const role = buildRole('custom', [
      { ability: 'Delete', subject: 'Customer', value: false },
    ]);

    expect(() => validateAbilityCanAssignRole(ability, role)).not.toThrow();
  });
});
