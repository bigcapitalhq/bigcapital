import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  REQUIRED_PERMISSION_KEY,
  RequiredPermission,
} from './RequirePermission.decorator';

/**
 * Guard that checks CASL `ability` on the request (attached by AuthorizationGuard).
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<RequiredPermission>(
      REQUIRED_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const ability = (request as any).ability;

    if (!ability) {
      throw new ForbiddenException(
        'Ability instance not found. Ensure AuthorizationGuard is applied.',
      );
    }

    const { ability: action, subject } = requiredPermission;

    if (!ability.can(action, subject)) {
      throw new ForbiddenException(
        `You do not have permission to ${action} ${subject}`,
      );
    }

    return true;
  }
}
