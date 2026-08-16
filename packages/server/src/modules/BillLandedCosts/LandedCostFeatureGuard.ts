import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from '../Features/FeaturesManager';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from './utils';

/**
 * Guard that rejects the landed cost endpoints once the landed cost feature
 * is not enabled.
 */
@Injectable()
export class LandedCostFeatureGuard implements CanActivate {
  constructor(private readonly featuresManager: FeaturesManager) {}

  /**
   * Validates the landed cost feature is accessible.
   * @param {ExecutionContext} _context
   * @returns {Promise<boolean>}
   */
  async canActivate(_context: ExecutionContext): Promise<boolean> {
    const isAccessible = await this.featuresManager.accessible(
      Features.LANDED_COST,
    );
    if (!isAccessible) {
      throw new ServiceError(
        ERRORS.LANDED_COST_FEATURE_NOT_ENABLED,
        'The landed cost feature is not enabled.',
      );
    }
    return true;
  }
}
