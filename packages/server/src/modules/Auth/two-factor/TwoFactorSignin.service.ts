import { Inject, Injectable } from '@nestjs/common';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { TwoFactorService, TwoFactorSetup } from './TwoFactor.service';
import { TwoFactorChallengeService } from './TwoFactorChallenge.service';
import { TwoFactorPolicyService } from './TwoFactorPolicy.service';
import { TwoFactorChallenge } from './models/TwoFactorChallenge.model';
import {
  TwoFactorChallengeInvalidException,
  TwoFactorCodeInvalidException,
  TwoFactorTooManyAttemptsException,
} from './TwoFactor.exceptions';

export interface TwoFactorSigninChallengeResponse {
  twoFactorRequired?: boolean;
  twoFactorSetupRequired?: boolean;
  challengeToken: string;
  challengeExpiresIn: number;
}

export interface TwoFactorSigninResult {
  user: SystemUser;
  rememberMe: boolean;
  recoveryCodes?: string[];
}

/**
 * The second step of the password sign-in.
 */
@Injectable()
export class TwoFactorSigninService {
  constructor(
    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    private readonly twoFactorService: TwoFactorService,
    private readonly challengeService: TwoFactorChallengeService,
    private readonly policyService: TwoFactorPolicyService,
  ) {}

  /**
   * Called after a correct password. Returns a challenge instead of a token
   * when the user has two-factor enabled (enter a code) or when the tenant
   * requires it and the user has none yet (set it up first); null otherwise.
   */
  public async begin(
    user: SystemUser,
    tenant: TenantModel,
    rememberMe = false,
  ): Promise<TwoFactorSigninChallengeResponse | null> {
    if (await this.twoFactorService.isEnabled(user.id)) {
      const { token, expiresIn } = await this.challengeService.issue(
        user.id,
        'verify',
        rememberMe,
      );
      return {
        twoFactorRequired: true,
        challengeToken: token,
        challengeExpiresIn: expiresIn,
      };
    }
    if (await this.policyService.isRequiredForTenant(tenant.id)) {
      const { token, expiresIn } = await this.challengeService.issue(
        user.id,
        'setup',
        rememberMe,
      );
      return {
        twoFactorSetupRequired: true,
        challengeToken: token,
        challengeExpiresIn: expiresIn,
      };
    }
    return null;
  }

  /**
   * Redeems a `verify` challenge with a TOTP code or a recovery code.
   */
  public async complete(
    challengeToken: string,
    code?: string,
    recoveryCode?: string,
  ): Promise<TwoFactorSigninResult> {
    const challenge = await this.openAttempt(challengeToken, 'verify');
    const valid = await this.twoFactorService.verifySecondFactor(
      challenge.userId,
      { code, recoveryCode },
    );
    if (!valid) {
      throw new TwoFactorCodeInvalidException();
    }
    return this.finish(challenge);
  }

  /**
   * Starts the authenticator setup for a `setup` challenge (the organization
   * requires two-factor and the user has none yet).
   */
  public async startSetup(challengeToken: string): Promise<TwoFactorSetup> {
    const challenge = await this.challengeService.find(challengeToken, 'setup');

    if (!challenge) {
      throw new TwoFactorChallengeInvalidException();
    }
    return this.twoFactorService.startSetup(challenge.userId);
  }

  /**
   * Confirms the setup of a `setup` challenge with a code, turns two-factor on
   * and completes the sign-in. Returns the new recovery codes too.
   */
  public async confirmSetup(
    challengeToken: string,
    code: string,
  ): Promise<TwoFactorSigninResult> {
    const challenge = await this.openAttempt(challengeToken, 'setup');
    const recoveryCodes = await this.twoFactorService.tryConfirmSetup(
      challenge.userId,
      code,
    );
    if (!recoveryCodes) {
      throw new TwoFactorCodeInvalidException();
    }
    const result = await this.finish(challenge);

    return { ...result, recoveryCodes };
  }

  /**
   * Finds the challenge and counts the attempt (per challenge and per user).
   */
  private async openAttempt(
    challengeToken: string,
    purpose: 'verify' | 'setup',
  ): Promise<TwoFactorChallenge> {
    const challenge = await this.challengeService.find(challengeToken, purpose);

    if (!challenge) {
      throw new TwoFactorChallengeInvalidException();
    }
    if (await this.challengeService.isUserLocked(challenge.userId)) {
      throw new TwoFactorTooManyAttemptsException();
    }
    if (!(await this.challengeService.registerAttempt(challenge))) {
      throw new TwoFactorChallengeInvalidException();
    }
    return challenge;
  }

  private async finish(
    challenge: TwoFactorChallenge,
  ): Promise<TwoFactorSigninResult> {
    if (!(await this.challengeService.consume(challenge))) {
      throw new TwoFactorChallengeInvalidException();
    }
    const user = await this.systemUserModel.query().findById(challenge.userId);

    if (!user) {
      throw new TwoFactorChallengeInvalidException();
    }
    return { user, rememberMe: !!challenge.rememberMe };
  }
}
