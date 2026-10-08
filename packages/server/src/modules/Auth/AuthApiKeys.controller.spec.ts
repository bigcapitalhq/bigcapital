import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Ability } from '@casl/ability';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AbilitySubject, ApiKeyAction } from '@/modules/Roles/Roles.types';
import { AuthApiKeysController } from './AuthApiKeys.controllers';

describe('Api keys authorization guards', () => {
  const reflector = new Reflector();
  const guard = new PermissionGuard(reflector);

  const ctx = (controller: any, handler: any, ability: Ability) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ ability }) }),
      getHandler: () => handler,
      getClass: () => controller,
    }) as any;

  const cases: Array<[string, string]> = [
    ['generate', ApiKeyAction.Create],
    ['revoke', ApiKeyAction.Revoke],
    ['getApiKeys', ApiKeyAction.View],
  ];

  it.each(cases)(
    'AuthApiKeysController.%s is denied (403) for a role without the ApiKey permission',
    (method) => {
      const deny = new Ability([]);
      expect(() =>
        guard.canActivate(
          ctx(
            AuthApiKeysController,
            AuthApiKeysController.prototype[method],
            deny,
          ),
        ),
      ).toThrow(ForbiddenException);
    },
  );

  it.each(cases)(
    'AuthApiKeysController.%s is allowed for a role that grants the matching ApiKey permission',
    (method, action) => {
      const allow = new Ability([
        { action, subject: AbilitySubject.ApiKey },
      ] as any);
      expect(
        guard.canActivate(
          ctx(
            AuthApiKeysController,
            AuthApiKeysController.prototype[method],
            allow,
          ),
        ),
      ).toBe(true);
    },
  );

  it('denies the Create permission holder from listing or revoking API keys', () => {
    const createOnly = new Ability([
      { action: ApiKeyAction.Create, subject: AbilitySubject.ApiKey },
    ] as any);

    expect(() =>
      guard.canActivate(
        ctx(
          AuthApiKeysController,
          AuthApiKeysController.prototype.getApiKeys,
          createOnly,
        ),
      ),
    ).toThrow(ForbiddenException);

    expect(() =>
      guard.canActivate(
        ctx(
          AuthApiKeysController,
          AuthApiKeysController.prototype.revoke,
          createOnly,
        ),
      ),
    ).toThrow(ForbiddenException);
  });

  it('grants all ApiKey operations to a manage-all (admin) ability', () => {
    const admin = new Ability([{ action: 'manage', subject: 'all' }] as any);

    for (const [method] of cases) {
      expect(
        guard.canActivate(
          ctx(
            AuthApiKeysController,
            AuthApiKeysController.prototype[method],
            admin,
          ),
        ),
      ).toBe(true);
    }
  });
});
