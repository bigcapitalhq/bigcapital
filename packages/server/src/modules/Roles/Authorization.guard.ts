import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { ABILITIES_CACHE, getAbilityForRole } from './TenantAbilities';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { TenantUser } from '../Tenancy/TenancyModels/models/TenantUser.model';

/**
 * Authorization guard for checking user abilities
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly clsService: ClsService,

    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
  ) { }

  /**
   * Checks if the user has the required abilities to access the route
   * @param context - The execution context
   * @returns A boolean indicating if the user can access the route
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { user } = request as any;

    if (ABILITIES_CACHE.has(user.id)) {
      (request as any).ability = ABILITIES_CACHE.get(user.id);
    } else {
      const ability = await this.getAbilityForUser();
      (request as any).ability = ability;
      ABILITIES_CACHE.set(user.id, ability);
    }
    return true;
  }

  async getAbilityForUser() {
    const userId = this.clsService.get('userId');
    const tenantUser = await this.tenantUserModel()
      .query()
      .findOne('systemUserId', userId)
      .withGraphFetched('role.permissions');

    return getAbilityForRole(tenantUser.role);
  }
}
