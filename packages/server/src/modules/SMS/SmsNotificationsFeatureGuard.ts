import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from '../Features/FeaturesManager';
import { ServiceError } from '@/modules/Items/ServiceError';

export const SMS_NOTIFICATIONS_ERRORS = {
  SMS_NOTIFICATIONS_FEATURE_NOT_ENABLED:
    'SMS_NOTIFICATIONS_FEATURE_NOT_ENABLED',
};

@Injectable()
export class SmsNotificationsFeatureGuard implements CanActivate {
  constructor(private readonly featuresManager: FeaturesManager) {}

  async canActivate(_context: ExecutionContext): Promise<boolean> {
    const isAccessible = await this.featuresManager.accessible(
      Features.SMS_NOTIFICATIONS,
    );
    if (!isAccessible) {
      throw new ServiceError(
        SMS_NOTIFICATIONS_ERRORS.SMS_NOTIFICATIONS_FEATURE_NOT_ENABLED,
        'The SMS notifications feature is not enabled.',
      );
    }
    return true;
  }
}
