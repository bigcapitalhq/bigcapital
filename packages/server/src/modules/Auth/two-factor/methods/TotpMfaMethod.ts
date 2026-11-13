import { Injectable } from '@nestjs/common';
import { TwoFactorService } from '../TwoFactor.service';
import type {
  MfaCredential,
  MfaMethodProvider,
  MfaSetupStartResult,
} from './MfaMethod.types';

/**
 * TOTP (authenticator app) provider. The enrollment and secret handling stay
 * in `TwoFactorService`; this class only maps the generic MFA contract to it.
 */
@Injectable()
export class TotpMfaMethod implements MfaMethodProvider {
  readonly id = 'totp' as const;
  readonly kind = 'otp' as const;

  constructor(private readonly twoFactorService: TwoFactorService) {}

  isEnrolled(userId: number): Promise<boolean> {
    return this.twoFactorService.isEnabled(userId);
  }

  verify(userId: number, credential: MfaCredential): Promise<boolean> {
    return this.twoFactorService.verifySecondFactor(userId, {
      code: credential.code,
    });
  }

  async startSetup(userId: number): Promise<MfaSetupStartResult> {
    const setup = await this.twoFactorService.startSetup(userId);

    return { method: this.id, ...setup };
  }

  confirmSetup(userId: number, code: string): Promise<string[] | null> {
    return this.twoFactorService.tryConfirmSetup(userId, code);
  }
}
