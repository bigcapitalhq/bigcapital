import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE } from '@/modules/Auth/Auth.constants';
import { IS_TENANT_AGNOSTIC } from '@/modules/Tenancy/TenancyGlobal.guard';
import { SubscriptionAccessService } from '../access/SubscriptionAccess.service';
import {
  REQUIRED_SUBSCRIPTION_FEATURE_KEY,
  RequiredSubscriptionFeatureMetadata,
} from '../decorators/RequireSubscriptionFeature.decorator';
import { SKIP_SUBSCRIPTION_CHECK_KEY } from '../decorators/SkipSubscriptionCheck.decorator';

const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Enforces subscription access on Cloud installations.
 *
 * - Unannotated routes keep the previous read-only behavior: reads are
 *   allowed and writes are blocked once the trial/subscription is inactive.
 * - Routes annotated with `@RequireSubscriptionFeature()` additionally check
 *   that the current plan includes the requested feature.
 * - The Go plan is allowed to access every feature.
 * - Self-hosted installations are never affected.
 */
@Injectable()
export class SubscriptionAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly subscriptionAccess: SubscriptionAccessService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Subscription access only applies to HTTP routes.
    if (context.getType() !== 'http') {
      return true;
    }
    if (this.isSkipped(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const method = String(request.method || 'GET').toUpperCase();
    const isWrite = WRITE_METHODS.includes(method);

    const metadata =
      this.reflector.getAllAndOverride<RequiredSubscriptionFeatureMetadata>(
        REQUIRED_SUBSCRIPTION_FEATURE_KEY,
        [context.getHandler(), context.getClass()],
      );

    // Preserve the previous global behavior for routes that do not declare a
    // feature. They are still protected against writes on inactive accounts.
    if (!metadata) {
      if (!isWrite) {
        return true;
      }
      await this.subscriptionAccess.assertCanWrite();
      return true;
    }

    const { feature, options } = metadata;
    const allowedMethods = options.methods?.map((item) => item.toUpperCase());

    if (allowedMethods?.length && !allowedMethods.includes(method)) {
      return true;
    }
    if (options.writeOnly && !isWrite) {
      return true;
    }

    await this.subscriptionAccess.assertFeatureAccess(
      feature,
      options,
      isWrite,
    );
    return true;
  }

  /**
   * Routes explicitly marked as exempt, public, or tenant-agnostic are not
   * checked.
   */
  private isSkipped(context: ExecutionContext): boolean {
    const targets = [context.getHandler(), context.getClass()];

    return (
      this.reflector.getAllAndOverride<boolean>(
        SKIP_SUBSCRIPTION_CHECK_KEY,
        targets,
      ) === true ||
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, targets) ===
        true ||
      this.reflector.getAllAndOverride<boolean>(IS_TENANT_AGNOSTIC, targets) ===
        true
    );
  }
}
