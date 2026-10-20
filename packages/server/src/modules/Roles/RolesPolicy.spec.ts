import { Role } from './models/Role.model';
import { canRoleGrantRole, isAdminRole } from './utils';

describe('RolesPolicy utils', () => {
  const role = (
    slug: string,
    permissions: Array<{
      subject: string;
      ability: string;
      value: boolean;
    }> = [],
  ) =>
    ({
      slug,
      permissions: permissions.map((permission, index) => ({
        id: index + 1,
        ...permission,
      })),
    }) as unknown as Role;

  describe('isAdminRole', () => {
    it('detects the predefined admin role', () => {
      expect(isAdminRole(role('admin'))).toBe(true);
      expect(isAdminRole(role('staff'))).toBe(false);
      expect(isAdminRole(undefined)).toBe(false);
    });
  });

  describe('canRoleGrantRole', () => {
    it('allows the admin role to grant any role', () => {
      expect(canRoleGrantRole(role('admin'), role('admin'))).toBe(true);
      expect(
        canRoleGrantRole(
          role('admin'),
          role('staff', [{ subject: 'Item', ability: 'View', value: true }]),
        ),
      ).toBe(true);
    });

    it('denies a non-admin role from granting the admin role', () => {
      expect(
        canRoleGrantRole(
          role('staff', [{ subject: 'Item', ability: 'View', value: true }]),
          role('admin'),
        ),
      ).toBe(false);
    });

    it('allows granting a role whose permissions are a subset of the actor role', () => {
      const actor = role('custom', [
        { subject: 'Item', ability: 'View', value: true },
        { subject: 'Item', ability: 'Create', value: true },
      ]);
      const target = role('custom2', [
        { subject: 'Item', ability: 'View', value: true },
      ]);

      expect(canRoleGrantRole(actor, target)).toBe(true);
    });

    it('denies granting a role with permissions outside of the actor role', () => {
      const actor = role('custom', [
        { subject: 'Item', ability: 'View', value: true },
      ]);
      const target = role('custom2', [
        { subject: 'Item', ability: 'View', value: true },
        { subject: 'Item', ability: 'Delete', value: true },
      ]);

      expect(canRoleGrantRole(actor, target)).toBe(false);
    });

    it('ignores disabled permissions of the target role', () => {
      const actor = role('custom', [
        { subject: 'Item', ability: 'View', value: true },
      ]);
      const target = role('custom2', [
        { subject: 'Item', ability: 'Delete', value: false },
      ]);

      expect(canRoleGrantRole(actor, target)).toBe(true);
    });

    it('allows granting a role without permissions', () => {
      expect(canRoleGrantRole(role('custom'), role('custom2'))).toBe(true);
    });
  });
});
