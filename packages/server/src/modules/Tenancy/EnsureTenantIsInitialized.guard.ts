import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { TenancyContext } from './TenancyContext.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE } from '../Auth/Auth.constants';

export const IS_IGNORE_TENANT_INITIALIZED = 'IS_IGNORE_TENANT_INITIALIZED';
export const IgnoreTenantInitializedRoute = () =>
  SetMetadata(IS_IGNORE_TENANT_INITIALIZED, true);

@Injectable()
export class EnsureTenantIsInitializedGuard implements CanActivate {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private reflector: Reflector,
  ) { }

  /**
   * Validate the tenant of the current request is initialized..
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isIgnoreEnsureTenantInitialized =
      this.reflector.getAllAndOverride<boolean>(IS_IGNORE_TENANT_INITIALIZED, [
        context.getHandler(),
        context.getClass(),
      ]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );
    // Skip the guard early if the route marked as public or ignored.
    if (isPublic || isIgnoreEnsureTenantInitialized) {
      return true;
    }
    const tenant = await this.tenancyContext.getTenant();

    if (!tenant) {
      throw new UnauthorizedException({
        message: 'Tenant not found.',
        errors: [{ type: 'TENANT.NOT.FOUND' }],
      });
    }
    if (!tenant?.initializedAt) {
      throw new UnauthorizedException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Tenant database is not migrated with application schema yet.',
        errors: [{ type: 'TENANT.DATABASE.NOT.INITALIZED' }],
      });
    }
    return true;
  }
}
