import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from '../Features/FeaturesManager';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from './constants';

/**
 * Guard that rejects the sales tax endpoints once the sales tax feature
 * is not enabled.
 */
@Injectable()
export class SalesTaxFeatureGuard implements CanActivate {
  constructor(private readonly featuresManager: FeaturesManager) {}

  /**
   * Validates the sales tax feature is accessible.
   * @param {ExecutionContext} _context
   * @returns {Promise<boolean>}
   */
  async canActivate(_context: ExecutionContext): Promise<boolean> {
    const isAccessible = await this.featuresManager.accessible(
      Features.SALES_TAX,
    );
    if (!isAccessible) {
      throw new ServiceError(
        ERRORS.SALES_TAX_FEATURE_NOT_ENABLED,
        'The sales tax feature is not enabled.',
      );
    }
    return true;
  }
}
