import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from '../Features/FeaturesManager';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from './constants';

/**
 * Guard that rejects the tracking categories endpoints once the tracking
 * categories feature is not enabled.
 */
@Injectable()
export class TrackingCategoriesFeatureGuard implements CanActivate {
  constructor(private readonly featuresManager: FeaturesManager) {}

  /**
   * Validates the tracking categories feature is accessible.
   * @param {ExecutionContext} _context
   * @returns {Promise<boolean>}
   */
  async canActivate(_context: ExecutionContext): Promise<boolean> {
    const isAccessible = await this.featuresManager.accessible(
      Features.TRACKING_CATEGORIES,
    );
    if (!isAccessible) {
      throw new ServiceError(
        ERRORS.TRACKING_CATEGORIES_FEATURE_NOT_ENABLED,
        'The tracking categories feature is not enabled.',
      );
    }
    return true;
  }
}
