import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TenancyContext } from './TenancyContext.service';

@Injectable()
export class EnsureTenantIsInitializedGuard implements CanActivate {
  constructor(private readonly tenancyContext: TenancyContext) {}

  /**
   * Validate the tenant of the current request is initialized..
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenant = await this.tenancyContext.getTenant();

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
