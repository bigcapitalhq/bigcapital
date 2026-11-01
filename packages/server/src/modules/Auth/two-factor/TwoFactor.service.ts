import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { ServiceError } from '@/modules/Items/ServiceError';
import { UserTwoFactor } from './models/UserTwoFactor.model';
import { UserTwoFactorRecoveryCode } from './models/UserTwoFactorRecoveryCode.model';
import { TwoFactorCryptoService } from './TwoFactorCrypto.service';
import { buildOtpauthUri, generateTotpSecret, verifyTotpCode } from './totp';
import {
  generateRecoveryCodes,
  hashRecoveryCode,
  isRecoveryCodeFormat,
} from './recovery-codes';
import {
  TWO_FACTOR_ERRORS,
  TWO_FACTOR_PENDING_SETUP_TTL_SECONDS,
} from './TwoFactor.constants';

export interface TwoFactorSecondFactor {
  /** 6-digit code from the authenticator app. */
  code?: string;
  /** One of the single-use recovery codes. */
  recoveryCode?: string;
}

export interface TwoFactorStatus {
  enabled: boolean;
  enabledAt: Date | null;
  recoveryCodesRemaining: number;
  pendingSetup: boolean;
}

export interface TwoFactorSetup {
  secret: string;
  otpauthUrl: string;
}

/**
 * Per-user TOTP two-factor authentication: setup, verification with replay
 * protection, recovery codes and disabling.
 */
@Injectable()
export class TwoFactorService {
  private readonly logger = new Logger(TwoFactorService.name);

  constructor(
    @Inject(UserTwoFactor.name)
    private readonly userTwoFactorModel: typeof UserTwoFactor,

    @Inject(UserTwoFactorRecoveryCode.name)
    private readonly recoveryCodeModel: typeof UserTwoFactorRecoveryCode,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    private readonly cryptoService: TwoFactorCryptoService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Whether the given user has two-factor authentication turned on.
   */
  public async isEnabled(userId: number): Promise<boolean> {
    const state = await this.getState(userId);
    return !!state?.isEnabled;
  }

  /**
   * Retrieves the two-factor status of the given user (no secrets).
   */
  public async getStatus(userId: number): Promise<TwoFactorStatus> {
    const state = await this.getState(userId);
    const enabled = !!state?.isEnabled;
    const recoveryCodesRemaining = enabled
      ? await this.countRemainingRecoveryCodes(userId)
      : 0;

    return {
      enabled,
      enabledAt: enabled ? state.enabledAt : null,
      recoveryCodesRemaining,
      pendingSetup: !enabled && this.hasActivePendingSetup(state),
    };
  }

  /**
   * Starts a setup: generates a new secret and keeps it pending until a code
   * from the authenticator app confirms it. Starting again replaces it.
   */
  public async startSetup(userId: number): Promise<TwoFactorSetup> {
    const user = await this.systemUserModel.query().findById(userId);
    const state = await this.getState(userId);

    if (state?.isEnabled) {
      throw new ServiceError(
        TWO_FACTOR_ERRORS.ALREADY_ENABLED,
        'Two-factor authentication is already enabled.',
      );
    }
    const secret = generateTotpSecret();
    const pending = {
      pendingSecret: this.cryptoService.encrypt(secret),
      pendingCreatedAt: new Date(),
    };
    if (state) {
      await this.userTwoFactorModel
        .query()
        .patch(pending)
        .where('userId', userId);
    } else {
      await this.userTwoFactorModel.query().insert({ userId, ...pending });
    }
    const issuer = this.configService.get<string>('twoFactor.issuer');

    return {
      secret,
      otpauthUrl: buildOtpauthUri(secret, user.email, issuer),
    };
  }

  /**
   * Confirms a pending setup with a code from the authenticator app, turns
   * two-factor authentication on and returns the new recovery codes.
   * @throws {ServiceError} TWO_FACTOR_CODE_INVALID on a wrong code.
   */
  public async confirmSetup(userId: number, code: string): Promise<string[]> {
    const recoveryCodes = await this.tryConfirmSetup(userId, code);

    if (!recoveryCodes) {
      throw new ServiceError(
        TWO_FACTOR_ERRORS.CODE_INVALID,
        'The authentication code is not correct.',
      );
    }
    return recoveryCodes;
  }

  /**
   * Like `confirmSetup`, but returns null on a wrong code instead of throwing.
   */
  public async tryConfirmSetup(
    userId: number,
    code: string,
  ): Promise<string[] | null> {
    const state = await this.getState(userId);

    if (state?.isEnabled) {
      throw new ServiceError(
        TWO_FACTOR_ERRORS.ALREADY_ENABLED,
        'Two-factor authentication is already enabled.',
      );
    }
    if (!this.hasActivePendingSetup(state)) {
      throw new ServiceError(
        TWO_FACTOR_ERRORS.SETUP_NOT_STARTED,
        'Start the two-factor setup first, or start it again: it has expired.',
      );
    }
    const secret = this.cryptoService.decrypt(state.pendingSecret);
    const step = verifyTotpCode(secret, code);

    if (step === null) {
      return null;
    }
    // Only the pending secret that was checked becomes active, once.
    const updated = await this.userTwoFactorModel
      .query()
      .patch({
        secret: state.pendingSecret,
        enabledAt: new Date(),
        lastUsedStep: step,
        pendingSecret: null,
        pendingCreatedAt: null,
      })
      .where('userId', userId)
      .whereNull('enabledAt')
      .where('pendingSecret', state.pendingSecret);

    if (updated !== 1) {
      throw new ServiceError(
        TWO_FACTOR_ERRORS.SETUP_NOT_STARTED,
        'Start the two-factor setup first, or start it again: it has expired.',
      );
    }
    return this.replaceRecoveryCodes(userId);
  }

  /**
   * Verifies a second factor of a user with two-factor enabled: a TOTP code
   * (each time step is accepted once) or an unused recovery code (used up).
   */
  public async verifySecondFactor(
    userId: number,
    factor: TwoFactorSecondFactor,
  ): Promise<boolean> {
    const state = await this.getState(userId);

    if (!state?.isEnabled) {
      return false;
    }
    if (factor.code) {
      return this.verifyTotp(state, factor.code);
    }
    if (factor.recoveryCode) {
      return this.useRecoveryCode(userId, factor.recoveryCode);
    }
    return false;
  }

  /**
   * Replaces the recovery codes, after checking the password and a second factor.
   */
  public async regenerateRecoveryCodes(
    userId: number,
    password: string,
    factor: TwoFactorSecondFactor,
  ): Promise<string[]> {
    await this.assertPasswordAndSecondFactor(userId, password, factor);
    return this.replaceRecoveryCodes(userId);
  }

  /**
   * Turns two-factor authentication off, after checking the password and a
   * second factor. Removes the secret and the recovery codes.
   */
  public async disable(
    userId: number,
    password: string,
    factor: TwoFactorSecondFactor,
  ): Promise<void> {
    await this.assertPasswordAndSecondFactor(userId, password, factor);
    await this.removeAll(userId);
  }

  /**
   * Removes every two-factor record of the user (no checks).
   */
  public async removeAll(userId: number): Promise<void> {
    await this.userTwoFactorModel.transaction(async (trx) => {
      await this.recoveryCodeModel.query(trx).where('userId', userId).delete();
      await this.userTwoFactorModel.query(trx).where('userId', userId).delete();
    });
  }

  private async getState(userId: number): Promise<UserTwoFactor | undefined> {
    return this.userTwoFactorModel.query().findById(userId);
  }

  private hasActivePendingSetup(state?: UserTwoFactor): boolean {
    if (!state?.pendingSecret || !state.pendingCreatedAt) {
      return false;
    }
    const age = Date.now() - new Date(state.pendingCreatedAt).getTime();
    return age <= TWO_FACTOR_PENDING_SETUP_TTL_SECONDS * 1000;
  }

  private async verifyTotp(
    state: UserTwoFactor,
    code: string,
  ): Promise<boolean> {
    let secret: string;
    try {
      secret = this.cryptoService.decrypt(state.secret);
    } catch (error) {
      // A changed or missing TWO_FACTOR_ENCRYPTION_KEY: recovery codes still work.
      this.logger.error(
        `Cannot read the two-factor secret of user ${state.userId}: ${error?.message}`,
      );
      return false;
    }
    const step = verifyTotpCode(secret, code);

    if (step === null) {
      return false;
    }
    // Accept each time step once (replay protection), atomically.
    const updated = await this.userTwoFactorModel
      .query()
      .patch({ lastUsedStep: step })
      .where('userId', state.userId)
      .whereNotNull('enabledAt')
      .where((query) => {
        query.whereNull('lastUsedStep').orWhere('lastUsedStep', '<', step);
      });

    return updated === 1;
  }

  private async useRecoveryCode(
    userId: number,
    recoveryCode: string,
  ): Promise<boolean> {
    if (!isRecoveryCodeFormat(recoveryCode)) {
      return false;
    }
    const updated = await this.recoveryCodeModel
      .query()
      .patch({ usedAt: new Date() })
      .where({ userId, codeHash: hashRecoveryCode(recoveryCode) })
      .whereNull('usedAt');

    return updated === 1;
  }

  private async countRemainingRecoveryCodes(userId: number): Promise<number> {
    const result = (await this.recoveryCodeModel
      .query()
      .where('userId', userId)
      .whereNull('usedAt')
      .count('id as count')
      .first()) as unknown as { count: number | string } | undefined;

    return Number(result?.count ?? 0);
  }

  private async replaceRecoveryCodes(userId: number): Promise<string[]> {
    const codes = generateRecoveryCodes();

    await this.recoveryCodeModel.transaction(async (trx) => {
      await this.recoveryCodeModel.query(trx).where('userId', userId).delete();

      for (const code of codes) {
        await this.recoveryCodeModel
          .query(trx)
          .insert({ userId, codeHash: hashRecoveryCode(code) });
      }
    });
    return codes;
  }

  private async assertPasswordAndSecondFactor(
    userId: number,
    password: string,
    factor: TwoFactorSecondFactor,
  ): Promise<void> {
    if (!(await this.isEnabled(userId))) {
      throw new ServiceError(
        TWO_FACTOR_ERRORS.NOT_ENABLED,
        'Two-factor authentication is not enabled.',
      );
    }
    const user = await this.systemUserModel.query().findById(userId);
    const passwordValid = !!password && (await user.checkPassword(password));

    // The second factor is only checked (and a code used up) after the password.
    const factorValid =
      passwordValid && (await this.verifySecondFactor(userId, factor));

    if (!factorValid) {
      throw new ServiceError(
        TWO_FACTOR_ERRORS.VERIFICATION_FAILED,
        'The password or the authentication code is not correct.',
        null,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
