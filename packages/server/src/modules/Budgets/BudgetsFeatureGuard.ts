import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from '../Features/FeaturesManager';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from './types/Budgets.types';

/**
 * Guard that rejects the budgeting endpoints once the budgeting
 * feature is not enabled.
 */
@Injectable()
export class BudgetsFeatureGuard implements CanActivate {
  constructor(private readonly featuresManager: FeaturesManager) {}

  /**
   * Validates the budgeting feature is accessible.
   * @param {ExecutionContext} _context
   * @returns {Promise<boolean>}
   */
  async canActivate(_context: ExecutionContext): Promise<boolean> {
    const isAccessible = await this.featuresManager.accessible(
      Features.BUDGETING,
    );
    if (!isAccessible) {
      throw new ServiceError(
        ERRORS.BUDGETING_FEATURE_NOT_ENABLED,
        'The budgeting feature is not enabled.',
      );
    }
    return true;
  }
}
