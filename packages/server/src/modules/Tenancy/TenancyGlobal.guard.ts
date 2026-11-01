import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { IS_PUBLIC_ROUTE } from '../Auth/Auth.constants';
import { getAuthApiKey } from '../Auth/Auth.utils';
import { UserTenant } from '../System/models/UserTenant.model';
import { TenantModel } from '../System/models/TenantModel';

export const IS_TENANT_AGNOSTIC = 'IS_TENANT_AGNOSTIC';

export const TenantAgnosticRoute = () => SetMetadata(IS_TENANT_AGNOSTIC, true);

@Injectable()
export class TenancyGlobalGuard implements CanActivate {
  constructor(
    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,

    private readonly reflector: Reflector,
    private readonly clsService: ClsService,
  ) {}

  /**
   * Validates the organization ID in the request headers and enforces
   * that the authenticated user is a member of the requested organization.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
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
    // Validate that the authenticated user is a member of the requested organization.
    const userId = this.clsService.get<number>('userId');

    const tenant = await this.tenantModel.query().findOne({ organizationId });
    if (!tenant) {
      throw new UnauthorizedException('Organization not found.');
    }

    const membership = await this.userTenantModel
      .query()
      .findOne({ userId, tenantId: tenant.id });

    if (!membership) {
      throw new UnauthorizedException(
        'You do not have access to this organization.',
      );
    }
    return true;
  }
}
