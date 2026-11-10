import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_ROUTE } from '@/modules/Auth/Auth.constants';
import { IS_TENANT_AGNOSTIC } from '@/modules/Tenancy/TenancyGlobal.guard';
import { SubscriptionAccessService } from '../access/SubscriptionAccess.service';

const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
const EXCLUDED_PATHS = [
  '/api/auth',
  '/api/subscription',
  '/api/organization',
  '/api/tenant',
  '/api/invite',
  '/api/webhooks',
  '/api/setup',
];

/**
 * Enforces read-only access on Bigcapital Cloud once an organization's paid
 * subscription or trial is no longer active. Self-hosted installations are
 * always allowed.
 *
 * It is implemented as an interceptor (instead of a guard) so it runs after
 * the JWT and tenancy guards have populated the CLS context.
 */
@Injectable()
export class SubscriptionAccessInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly subscriptionAccess: SubscriptionAccessService,
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    if (this.configService.get<boolean>('cloud.hostedOnCloud') !== true) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    if (!WRITE_METHODS.includes(request.method)) {
      return next.handle();
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );
    const isTenantAgnostic = this.reflector.getAllAndOverride<boolean>(
      IS_TENANT_AGNOSTIC,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic || isTenantAgnostic) {
      return next.handle();
    }

    const path = request.path || request.url || '';
    const originalPath = (request.originalUrl || '').split('?')[0];
    if (
      EXCLUDED_PATHS.some(
        (excluded) =>
          path.startsWith(excluded) || originalPath.startsWith(excluded),
      )
    ) {
      return next.handle();
    }

    await this.subscriptionAccess.assertCanWrite();

    return next.handle();
  }
}
