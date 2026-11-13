import { Injectable } from '@nestjs/common';
import { TwoFactorService } from '../TwoFactor.service';
import type { MfaCredential, MfaMethodProvider } from './MfaMethod.types';

/**
 * Recovery codes are a fallback of the strong methods, not an independent
 * enrollment: they are offered only while unused codes remain.
 */
@Injectable()
export class RecoveryCodeMfaMethod implements MfaMethodProvider {
  readonly id = 'recovery_code' as const;
  readonly kind = 'recovery_code' as const;

  constructor(private readonly twoFactorService: TwoFactorService) {}

  async isEnrolled(userId: number): Promise<boolean> {
    const status = await this.twoFactorService.getStatus(userId);

    return status.enabled && status.recoveryCodesRemaining > 0;
  }

  verify(userId: number, credential: MfaCredential): Promise<boolean> {
    return this.twoFactorService.verifySecondFactor(userId, {
      recoveryCode: credential.recoveryCode,
    });
  }
}
