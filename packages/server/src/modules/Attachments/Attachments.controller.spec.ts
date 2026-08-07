import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Ability } from '@casl/ability';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AttachmentsController } from './Attachments.controller';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { AttachmentAction } from './Attachments.types';

describe('AttachmentsController authorization', () => {
  const reflector = new Reflector();
  const guard = new PermissionGuard(reflector);

  const ctx = (handler: any, ability: Ability) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ ability }) }),
      getHandler: () => handler,
      getClass: () => AttachmentsController,
    }) as any;

  const cases: Array<[string, string]> = [
    ['uploadAttachment', AttachmentAction.Create],
    ['linkDocument', AttachmentAction.Create],
    ['unlinkDocument', AttachmentAction.Delete],
    ['getAttachment', AttachmentAction.View],
    ['deleteAttachment', AttachmentAction.Delete],
    ['getAttachmentPresignedUrl', AttachmentAction.View],
  ];

  it.each(cases)(
    '%s is denied (403) for a role with no Attachment permission',
    (method) => {
      const deny = new Ability([]);
      expect(() =>
        guard.canActivate(ctx(AttachmentsController.prototype[method], deny)),
      ).toThrow(ForbiddenException);
    },
  );

  it.each(cases)(
    '%s is allowed for a role that grants the matching Attachment permission',
    (method, action) => {
      const allow = new Ability([
        { action, subject: AbilitySubject.Attachment },
      ] as any);
      expect(
        guard.canActivate(ctx(AttachmentsController.prototype[method], allow)),
      ).toBe(true);
    },
  );

  it('grants all attachment operations to a manage-all (admin) ability', () => {
    const admin = new Ability([{ action: 'manage', subject: 'all' }] as any);
    for (const [method] of cases) {
      expect(
        guard.canActivate(ctx(AttachmentsController.prototype[method], admin)),
      ).toBe(true);
    }
  });
});
