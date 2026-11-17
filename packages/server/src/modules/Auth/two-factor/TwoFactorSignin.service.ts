import { Inject, Injectable } from '@nestjs/common';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { TwoFactorChallengeService } from './TwoFactorChallenge.service';
import { TwoFactorPolicyService } from './TwoFactorPolicy.service';
import { TwoFactorChallenge } from './models/TwoFactorChallenge.model';
import {
  TwoFactorChallengeInvalidException,
  TwoFactorCodeInvalidException,
  TwoFactorMethodUnavailableException,
  TwoFactorTooManyAttemptsException,
} from './TwoFactor.exceptions';
import { MfaMethodRegistry } from './methods/MfaMethodRegistry.service';
import type {
  MfaCredential,
  MfaMethodDescriptor,
  MfaMethodId,
  MfaSetupStartResult,
} from './methods/MfaMethod.types';

export interface TwoFactorSigninChallengeResponse {
  twoFactorRequired?: boolean;
  twoFactorSetupRequired?: boolean;
  challengeToken: string;
  challengeExpiresIn: number;
  purpose: 'verify' | 'setup';
  availableMethods: MfaMethodDescriptor[];
  defaultMethod?: MfaMethodId;
  mfa: {
    challengeToken: string;
    expiresIn: number;
    purpose: 'verify' | 'setup';
    methods: MfaMethodDescriptor[];
    defaultMethod?: MfaMethodId;
  };
}

export interface TwoFactorSigninResult {
  user: SystemUser;
  rememberMe: boolean;
  recoveryCodes?: string[];
}

export interface TwoFactorPrepareResult {
  method: MfaMethodId;
  ready: boolean;
  [key: string]: unknown;
}

interface ChallengeFlags {
  twoFactorRequired?: boolean;
  twoFactorSetupRequired?: boolean;
}

/**
 * The second step of the password sign-in.
 */
@Injectable()
export class TwoFactorSigninService {
  constructor(
    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    private readonly challengeService: TwoFactorChallengeService,
    private readonly policyService: TwoFactorPolicyService,
    private readonly methodRegistry: MfaMethodRegistry,
  ) {}

  /**
   * Called after a correct password. Returns a challenge instead of a token
   * when the user has two-factor enabled (choose a method and verify) or when
   * the tenant requires it and the user has none yet (set it up first);
   * null otherwise.
   */
  public async begin(
    user: SystemUser,
    tenant: TenantModel,
    rememberMe = false,
  ): Promise<TwoFactorSigninChallengeResponse | null> {
    const enrolledMethods = await this.methodRegistry.getEnrolledMethods(
      user.id,
    );

    if (enrolledMethods.length > 0) {
      const methods = enrolledMethods;
      const { token, expiresIn } = await this.challengeService.issue(
        user.id,
        'verify',
        rememberMe,
        methods.map((method) => method.id),
      );
      return this.buildChallenge('verify', token, expiresIn, methods, {
        twoFactorRequired: true,
      });
    }
    if (await this.policyService.isRequiredForTenant(tenant.id)) {
      const methods = this.methodRegistry.getEnrollableMethods();
      const { token, expiresIn } = await this.challengeService.issue(
        user.id,
        'setup',
        rememberMe,
        methods.map((method) => method.id),
      );
      return this.buildChallenge('setup', token, expiresIn, methods, {
        twoFactorSetupRequired: true,
      });
    }
    return null;
  }

  /**
   * Legacy completion: a TOTP code or a recovery code, without a method id.
   */
  public complete(
    challengeToken: string,
    code?: string,
    recoveryCode?: string,
  ): Promise<TwoFactorSigninResult> {
    const method: MfaMethodId = recoveryCode ? 'recovery_code' : 'totp';

    return this.completeWithMethod(challengeToken, method, {
      code,
      recoveryCode,
    });
  }

  /**
   * Redeems a `verify` challenge with the credential of the given method.
   */
  public async completeWithMethod(
    challengeToken: string,
    method: MfaMethodId,
    credential: MfaCredential,
  ): Promise<TwoFactorSigninResult> {
    const challenge = await this.openAttempt(challengeToken, 'verify');
    this.assertMethodOffered(challenge, method);

    const provider = this.methodRegistry.require(method);

    if (!(await provider.isEnrolled(challenge.userId))) {
      throw new TwoFactorMethodUnavailableException();
    }
    const valid = await provider.verify(challenge.userId, credential);

    if (!valid) {
      throw new TwoFactorCodeInvalidException();
    }
    await this.challengeService.markMethod(challenge, method);
    return this.finish(challenge);
  }

  /**
   * Prepares a method before the user enters a credential, e.g. sends an
   * email code. TOTP and recovery codes do not need preparation.
   */
  public async prepare(
    challengeToken: string,
    method: MfaMethodId,
  ): Promise<TwoFactorPrepareResult> {
    const challenge = await this.challengeService.find(
      challengeToken,
      'verify',
    );

    if (!challenge) {
      throw new TwoFactorChallengeInvalidException();
    }
    if (await this.challengeService.isUserLocked(challenge.userId)) {
      throw new TwoFactorTooManyAttemptsException();
    }
    this.assertMethodOffered(challenge, method);

    const provider = this.methodRegistry.require(method);

    if (!(await provider.isEnrolled(challenge.userId))) {
      throw new TwoFactorMethodUnavailableException();
    }
    const payload = await provider.prepare?.(challenge.userId, challengeToken);

    return { method, ready: true, ...(payload ?? {}) };
  }

  /**
   * Starts the setup of a `setup` challenge (the organization requires
   * two-factor and the user has none yet).
   */
  public async startSetup(
    challengeToken: string,
    method: MfaMethodId = 'totp',
  ): Promise<MfaSetupStartResult> {
    const challenge = await this.challengeService.find(challengeToken, 'setup');

    if (!challenge) {
      throw new TwoFactorChallengeInvalidException();
    }
    this.assertMethodOffered(challenge, method);

    const provider = this.methodRegistry.require(method);

    if (!provider.startSetup) {
      throw new TwoFactorMethodUnavailableException();
    }
    const setup = await provider.startSetup(challenge.userId);

    await this.challengeService.markMethod(challenge, method);
    return setup;
  }

  /**
   * Confirms the setup of a `setup` challenge, turns the method on and
   * completes the sign-in. Returns the new recovery codes too.
   */
  public async confirmSetup(
    challengeToken: string,
    code: string,
    method: MfaMethodId = 'totp',
  ): Promise<TwoFactorSigninResult> {
    const challenge = await this.openAttempt(challengeToken, 'setup');
    this.assertMethodOffered(challenge, method);

    const provider = this.methodRegistry.require(method);

    if (!provider.confirmSetup) {
      throw new TwoFactorMethodUnavailableException();
    }
    const recoveryCodes = await provider.confirmSetup(challenge.userId, code);

    if (!recoveryCodes) {
      throw new TwoFactorCodeInvalidException();
    }
    await this.challengeService.markMethod(challenge, method);
    const result = await this.finish(challenge);

    return { ...result, recoveryCodes };
  }

  private buildChallenge(
    purpose: 'verify' | 'setup',
    challengeToken: string,
    expiresIn: number,
    methods: MfaMethodDescriptor[],
    flags: ChallengeFlags,
  ): TwoFactorSigninChallengeResponse {
    const defaultMethod = methods[0]?.id;

    return {
      ...flags,
      challengeToken,
      challengeExpiresIn: expiresIn,
      purpose,
      availableMethods: methods,
      defaultMethod,
      mfa: {
        challengeToken,
        expiresIn,
        purpose,
        methods,
        defaultMethod,
      },
    };
  }

  /**
   * Refuses a method that the challenge did not offer. Old challenges without
   * a method list are allowed through; the provider still checks enrollment.
   */
  private assertMethodOffered(
    challenge: TwoFactorChallenge,
    method: MfaMethodId,
  ): void {
    const methods = this.challengeService.getMethods(challenge);

    if (methods.length > 0 && !methods.includes(method)) {
      throw new TwoFactorMethodUnavailableException();
    }
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
