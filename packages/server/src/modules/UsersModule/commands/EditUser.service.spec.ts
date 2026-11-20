import { EditUserService } from './EditUser.service';
import { ERRORS } from '../Users.constants';

const createService = () =>
  new EditUserService(
    null as any,
    null as any,
    null as any,
    null as any,
    null as any,
  );

describe('EditUserService', () => {
  describe('validateMutateEmailNotAuthorizedUser', () => {
    it('throws when a user mutates another user login email', () => {
      const service = createService();

      expect(() =>
        service.validateMutateEmailNotAuthorizedUser(
          { systemUserId: 10, email: 'owner@example.com' } as any,
          { email: 'attacker@example.com' } as any,
          { id: 20 } as any,
        ),
      ).toThrow(
        expect.objectContaining({
          errorType: ERRORS.CANNOT_MUTATE_OTHER_USER_EMAIL,
        }),
      );
    });

    it('allows the user to mutate their own email', () => {
      const service = createService();

      expect(() =>
        service.validateMutateEmailNotAuthorizedUser(
          { systemUserId: 10, email: 'old@example.com' } as any,
          { email: 'new@example.com' } as any,
          { id: 10 } as any,
        ),
      ).not.toThrow();
    });

    it('does not consider a case-only difference as an email mutation', () => {
      const service = createService();

      expect(() =>
        service.validateMutateEmailNotAuthorizedUser(
          { systemUserId: 10, email: 'owner@example.com' } as any,
          { email: 'Owner@Example.com' } as any,
          { id: 20 } as any,
        ),
      ).not.toThrow();
    });
  });

  describe('validateMutateRoleNotAuthorizedUser', () => {
    it('throws when the authorized user mutates their own role', () => {
      const service = createService();

      expect(() =>
        service.validateMutateRoleNotAuthorizedUser(
          { systemUserId: 10, roleId: 2 } as any,
          { roleId: 1 } as any,
          { id: 10 } as any,
        ),
      ).toThrow(
        expect.objectContaining({
          errorType: ERRORS.CANNOT_AUTHORIZED_USER_MUTATE_ROLE,
        }),
      );
    });
  });
});
