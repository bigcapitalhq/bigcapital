import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { IS_PUBLIC_ROUTE } from '../Auth.constants';
import { getAuthApiKey } from '../Auth.utils';
import { IS_ALLOWED_WITHOUT_TWO_FACTOR } from './TwoFactor.constants';
import { TwoFactorPolicyService } from './TwoFactorPolicy.service';
import { TwoFactorService } from './TwoFactor.service';
import { TwoFactorSetupRequiredException } from './TwoFactor.exceptions';

/**
 * When the organization requires two-factor authentication, refuses signed-in
 * (JWT) requests of users who have not set it up, e.g. sessions that started
 * before the requirement was turned on. API keys are not affected.
 */
@Injectable()
export class TwoFactorEnforcementGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly clsService: ClsService,
    private readonly policyService: TwoFactorPolicyService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') {
      return true;
    }
    const targets = [context.getHandler(), context.getClass()];
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      targets,
    );
    const isAllowed = this.reflector.getAllAndOverride<boolean>(
      IS_ALLOWED_WITHOUT_TWO_FACTOR,
      targets,
    );
    if (isPublic || isAllowed) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    if (getAuthApiKey(request.headers?.['authorization'] || '')) {
      return true;
    }
    const userId = this.clsService.get<number>('userId');
    const organizationId = this.clsService.get<string>('organizationId');

    if (!userId || !organizationId) {
      return true;
    }
    if (!(await this.policyService.isRequiredForOrganization(organizationId))) {
      return true;
    }
    if (await this.twoFactorService.isEnabled(userId)) {
      return true;
    }
    throw new TwoFactorSetupRequiredException();
  }
}
