import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Ability } from '@casl/ability';
import { Request } from 'express';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '@/modules/FinancialStatements/types/Report.types';

/**
 * Requires at least one financial report read ability.
 *
 * Individual tools are filtered further by the assistant, so a user with only
 * the sales-by-items report can use item tools but not profit or P&L tools.
 */
@Injectable()
export class AiAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const ability = (request as any).ability as Ability | undefined;

    const allowed =
      ability != null &&
      Object.values(ReportsAction).some((action) =>
        ability.can(action, AbilitySubject.Report),
      );

    if (!allowed) {
      throw new ForbiddenException(
        'You do not have access to the AI assistant.',
      );
    }
    return true;
  }
}
