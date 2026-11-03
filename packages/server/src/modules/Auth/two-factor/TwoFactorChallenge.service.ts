import { Inject, Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import {
  TwoFactorChallenge,
  TwoFactorChallengePurpose,
} from './models/TwoFactorChallenge.model';
import {
  TWO_FACTOR_CHALLENGE_TTL_SECONDS,
  TWO_FACTOR_FAILED_ATTEMPTS_WINDOW_SECONDS,
  TWO_FACTOR_MAX_ATTEMPTS_PER_CHALLENGE,
  TWO_FACTOR_MAX_FAILED_ATTEMPTS_PER_USER,
} from './TwoFactor.constants';

export interface IssuedTwoFactorChallenge {
  token: string;
  expiresIn: number;
}

const hashToken = (token: string): string =>
  createHash('sha256').update(String(token)).digest('hex');

/**
 * Short-lived, single-use sign-in challenges bound to one user.
 */
@Injectable()
export class TwoFactorChallengeService {
  constructor(
    @Inject(TwoFactorChallenge.name)
    private readonly challengeModel: typeof TwoFactorChallenge,
  ) {}

  /**
   * Issues a new challenge for the user. The token is returned once; only
   * its hash is stored.
   */
  public async issue(
    userId: number,
    purpose: TwoFactorChallengePurpose,
    rememberMe = false,
  ): Promise<IssuedTwoFactorChallenge> {
    const token = randomBytes(32).toString('base64url');
    const expiresIn = TWO_FACTOR_CHALLENGE_TTL_SECONDS[purpose];

    await this.removeStale();
    await this.challengeModel.query().insert({
      tokenHash: hashToken(token),
      userId,
      purpose,
      rememberMe: !!rememberMe,
      attempts: 0,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    });
    return { token, expiresIn };
  }

  /**
   * Finds a usable challenge: right purpose, not expired, not used, attempts left.
   */
  public async find(
    token: string,
    purpose: TwoFactorChallengePurpose,
  ): Promise<TwoFactorChallenge | null> {
    if (!token || typeof token !== 'string') {
      return null;
    }
    const challenge = await this.challengeModel
      .query()
      .findOne({ tokenHash: hashToken(token) });

    if (
      !challenge ||
      challenge.purpose !== purpose ||
      challenge.consumedAt ||
      new Date(challenge.expiresAt).getTime() <= Date.now() ||
      challenge.attempts >= TWO_FACTOR_MAX_ATTEMPTS_PER_CHALLENGE
    ) {
      return null;
    }
    return challenge;
  }

  /**
   * Counts one attempt against the challenge, atomically.
   * @returns {boolean} false when the challenge has no attempts left or was used.
   */
  public async registerAttempt(
    challenge: TwoFactorChallenge,
  ): Promise<boolean> {
    const updated = await this.challengeModel
      .query()
      .where('id', challenge.id)
      .whereNull('consumedAt')
      .where('expiresAt', '>', new Date())
      .where('attempts', '<', TWO_FACTOR_MAX_ATTEMPTS_PER_CHALLENGE)
      .increment('attempts', 1);

    return Number(updated) === 1;
  }

  /**
   * Marks the challenge as used, atomically (a token works once).
   */
  public async consume(challenge: TwoFactorChallenge): Promise<boolean> {
    const updated = await this.challengeModel
      .query()
      .patch({ consumedAt: new Date() })
      .where('id', challenge.id)
      .whereNull('consumedAt');

    return updated === 1;
  }

  /**
   * Whether the user had too many failed codes lately, across challenges.
   * Attempts on challenges that ended in a successful sign-in do not count.
   */
  public async isUserLocked(userId: number): Promise<boolean> {
    const since = new Date(
      Date.now() - TWO_FACTOR_FAILED_ATTEMPTS_WINDOW_SECONDS * 1000,
    );
    const result = (await this.challengeModel
      .query()
      .where('userId', userId)
      .whereNull('consumedAt')
      .where('createdAt', '>=', since)
      .sum('attempts as attempts')
      .first()) as unknown as { attempts: number | string | null } | undefined;

    return (
      Number(result?.attempts ?? 0) >= TWO_FACTOR_MAX_FAILED_ATTEMPTS_PER_USER
    );
  }

  /**
   * Removes challenges that expired more than a day ago (kept that long for
   * the failed-attempts window).
   */
  private async removeStale(): Promise<void> {
    await this.challengeModel
      .query()
      .where('expiresAt', '<', new Date(Date.now() - 24 * 60 * 60 * 1000))
      .delete();
  }
}
