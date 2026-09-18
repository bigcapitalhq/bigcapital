import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { AccountAction } from '../Accounts/Accounts.types';

export const APPLY_ACCOUNTS_TEMPLATE_ACTIONS = [
  AccountAction.CREATE,
  AccountAction.EDIT,
  AccountAction.DELETE,
];

/**
 * Applying a template creates, edits and deletes accounts, so it takes the
 * permission to do each of those by hand on top of editing preferences, which
 * the permission guard checks. Runs after the authorization guard has attached
 * the user's abilities to the request.
 */
@Injectable()
export class ApplyAccountsTemplateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const ability = (request as any).ability;

    if (!ability) {
      throw new ForbiddenException(
        'Ability instance not found. Ensure AuthorizationGuard is applied.',
      );
    }
    const missing = APPLY_ACCOUNTS_TEMPLATE_ACTIONS.find(
      (action) => !ability.can(action, AbilitySubject.Account),
    );
    if (missing) {
      throw new ForbiddenException(
        `You do not have permission to ${missing} ${AbilitySubject.Account}`,
      );
    }
    return true;
  }
}
