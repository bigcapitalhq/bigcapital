import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from '@/modules/Features/FeaturesManager';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from './RecurringJournal.types';

/**
 * Guard that rejects the recurring journals endpoints once the recurring
 * journals feature is not enabled.
 */
@Injectable()
export class RecurringJournalsFeatureGuard implements CanActivate {
  constructor(private readonly featuresManager: FeaturesManager) {}

  async canActivate(_context: ExecutionContext): Promise<boolean> {
    const isAccessible = await this.featuresManager.accessible(
      Features.RECURRING_JOURNALS,
    );
    if (!isAccessible) {
      throw new ServiceError(
        ERRORS.RECURRING_JOURNAL_FEATURE_NOT_ENABLED,
        'The recurring journals feature is not enabled.',
      );
    }
    return true;
  }
}
