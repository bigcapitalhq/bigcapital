import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { TenancyContext } from './TenancyContext.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE } from '../Auth/Auth.constants';

export const IS_IGNORE_TENANT_SEEDED = 'IS_IGNORE_TENANT_SEEDED';
export const IgnoreTenantSeededRoute = () =>
  SetMetadata(IS_IGNORE_TENANT_SEEDED, true);

@Injectable()
export class EnsureTenantIsSeededGuard implements CanActivate {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private reflector: Reflector,
  ) { }

  /**
   * Validate the tenant of the current request is seeded.
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );
    const isIgnoreEnsureTenantSeeded =
      this.reflector.getAllAndOverride<boolean>(IS_IGNORE_TENANT_SEEDED, [
        context.getHandler(),
        context.getClass(),
      ]);
    if (isPublic || isIgnoreEnsureTenantSeeded) {
      return true;
    }
    const tenant = await this.tenancyContext.getTenant();

    if (!tenant) {
      throw new UnauthorizedException({
        message: 'Tenant not found.',
        errors: [{ type: 'TENANT.NOT.FOUND' }],
      });
    }
    if (!tenant.seededAt) {
      throw new UnauthorizedException({
        message: 'Tenant database is not seeded with initial data yet.',
        errors: [{ type: 'TENANT.DATABASE.NOT.SEED' }],
      });
    }
    return true;
  }
}
