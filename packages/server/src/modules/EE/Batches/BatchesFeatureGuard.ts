import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from '@/modules/Features/FeaturesManager';
import { ServiceError } from '@/modules/Items/ServiceError';
import { BATCHES_ERRORS } from './types/Batches.types';

/**
 * Guard that rejects the batch tracking endpoints once the batch tracking
 * feature is not enabled.
 */
@Injectable()
export class BatchesFeatureGuard implements CanActivate {
  constructor(private readonly featuresManager: FeaturesManager) {}

  async canActivate(_context: ExecutionContext): Promise<boolean> {
    const isAccessible = await this.featuresManager.accessible(
      Features.BATCH_TRACKING,
    );
    if (!isAccessible) {
      throw new ServiceError(
        BATCHES_ERRORS.BATCH_FEATURE_NOT_ENABLED,
        'The batch tracking feature is not enabled.',
      );
    }
    return true;
  }
}
