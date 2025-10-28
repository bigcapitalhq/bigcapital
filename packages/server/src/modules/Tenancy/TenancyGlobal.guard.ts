import { isEmpty } from 'lodash';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE } from '../Auth/Auth.constants';
import { getAuthApiKey } from '../Auth/Auth.utils';

export const IS_TENANT_AGNOSTIC = 'IS_TENANT_AGNOSTIC';

export const TenantAgnosticRoute = () => SetMetadata(IS_TENANT_AGNOSTIC, true);

@Injectable()
export class TenancyGlobalGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Validates the organization ID in the request headers.
   * @param {ExecutionContext} context
   * @returns {boolean}
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.headers['organization-id'];
    const authorization = request.headers['authorization']?.trim();
    const isAuthApiKey = !!getAuthApiKey(authorization || '');

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );
    const isTenantAgnostic = this.reflector.getAllAndOverride<boolean>(
      IS_TENANT_AGNOSTIC,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic || isTenantAgnostic || isAuthApiKey) {
      return true;
    }
    if (!organizationId) {
      throw new UnauthorizedException('Organization ID is required.');
    }
    return true;
  }
}
