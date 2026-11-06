import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeaturesManager } from '../modules/Features/FeaturesManager';
import { REQUIRE_FEATURE_KEY } from './extension.decorators';

/**
 * Generic feature gate for extension endpoints.
 *
 * Core modules use their own feature guards; this guard is available to
 * extension controllers and can also replace per-feature guards over time.
 */
@Injectable()
export class ExtensionFeatureGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly featuresManager: FeaturesManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const feature = this.reflector.getAllAndOverride<string>(
      REQUIRE_FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!feature) {
      return true;
    }

    const accessible = await this.featuresManager.accessible(feature);

    if (!accessible) {
      throw new ForbiddenException(`The "${feature}" feature is not enabled.`);
    }

    return true;
  }
}
