import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TenancyContext } from './TenancyContext.service';

@Injectable()
export class EnsureTenantIsSeededGuard implements CanActivate {
  constructor(private readonly tenancyContext: TenancyContext) {}

  /**
   * Validate the tenant of the current request is seeded.
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenant = await this.tenancyContext.getTenant();

    if (!tenant.seededAt) {
      throw new UnauthorizedException({
        message: 'Tenant database is not seeded with initial data yet.',
        errors: [{ type: 'TENANT.DATABASE.NOT.SEED' }],
      });
    }
    return true;
  }
}
