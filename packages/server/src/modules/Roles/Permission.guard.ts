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
import { AbilitySubject } from './Roles.types';

/**
 * Guard that checks if the user has the required permission to access a route.
 * Uses CASL ability instance attached to the request by AuthorizationGuard.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Checks if the user has the required permission to access the route.
   * @param context - The execution context
   * @returns A boolean indicating if the user can access the route
   * @throws ForbiddenException if the user doesn't have the required permission
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredPermission =
      this.reflector.getAllAndOverride<RequiredPermission>(
        REQUIRED_PERMISSION_KEY,
        [context.getHandler(), context.getClass()],
      );

    // If no permission is required, allow access
    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const ability = (request as any).ability;

    // If no ability instance is attached to the request, deny access
    if (!ability) {
      throw new ForbiddenException(
        'Ability instance not found. Ensure AuthorizationGuard is applied.',
      );
    }

    const { ability: action, subject } = requiredPermission;

    // Check if the user has the required permission using CASL ability
    const hasPermission = ability.can(action, subject);

    if (!hasPermission) {
      throw new ForbiddenException(
        `You do not have permission to ${action} ${subject}`,
      );
    }

    return true;
  }

  /**
   * Helper method to check if a subject value is a valid AbilitySubject.
   * @param subject - The subject value to check
   * @returns True if the subject is a valid AbilitySubject enum value
   */
  private isValidSubject(subject: string): subject is AbilitySubject {
    return Object.values(AbilitySubject).includes(subject as AbilitySubject);
  }
}
