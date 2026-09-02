import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from './FeaturesManager';
import { ServiceError } from '@/modules/Items/ServiceError';

/**
 * Guard that rejects the SMS notification endpoints once the SMS notification
 * feature is not enabled.
 */
@Injectable()
export class SmsNotificationFeatureGuard implements CanActivate {
  constructor(private readonly featuresManager: FeaturesManager) {}

  /**
   * Validates the SMS notification feature is accessible.
   * @param {ExecutionContext} _context
   * @returns {Promise<boolean>}
   */
  async canActivate(_context: ExecutionContext): Promise<boolean> {
    const isAccessible = await this.featuresManager.accessible(
      Features.SMS_NOTIFICATION,
    );
    if (!isAccessible) {
      throw new ServiceError(
        'SMS_NOTIFICATION_FEATURE_NOT_ENABLED',
        'The SMS notification feature is not enabled.',
      );
    }
    return true;
  }
}
