import { SystemModel } from '@/modules/System/models/SystemModel';

export type TwoFactorChallengePurpose = 'verify' | 'setup';

/**
 * The second step of a sign-in: issued after a correct password, redeemed
 * once with a code. Only the SHA-256 hash of the token is stored.
 */
export class TwoFactorChallenge extends SystemModel {
  readonly tokenHash!: string;
  readonly userId!: number;
  readonly purpose!: TwoFactorChallengePurpose;
  /** Methods offered when the challenge was issued (JSON column). */
  readonly methods?: unknown;
  /** The method selected for verification or setup. */
  readonly method?: string | null;
  readonly rememberMe!: boolean;
  readonly attempts!: number;
  readonly expiresAt!: Date;
  readonly consumedAt?: Date | null;
  readonly createdAt!: Date;

  static get tableName() {
    return 'auth_two_factor_challenges';
  }

  get timestamps() {
    return ['createdAt'];
  }
}
