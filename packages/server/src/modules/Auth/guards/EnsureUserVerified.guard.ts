import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE } from '../Auth.constants';

export const IS_IGNORE_USER_VERIFIED = 'IS_IGNORE_USER_VERIFIED';
export const IgnoreUserVerifiedRoute = () =>
  SetMetadata(IS_IGNORE_USER_VERIFIED, true);

@Injectable()
export class EnsureUserVerifiedGuard implements CanActivate {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Validate the authenticated user if verified and throws exception if not.
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isIgnoredUserVerified = this.reflector.getAllAndOverride<boolean>(
      IS_IGNORE_USER_VERIFIED,
      [context.getHandler(), context.getClass()],
    );
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );
    // Skip the guard early if the route marked as public or ignored.
    if (isPublic || isIgnoredUserVerified) {
      return true;
    }
    const systemUser = await this.tenancyContext.getSystemUser();

    if (!systemUser.verified) {
      throw new UnauthorizedException(
        `The user is not verified yet, check out your mail inbox.`,
      );
    }
    return true;
  }
}
