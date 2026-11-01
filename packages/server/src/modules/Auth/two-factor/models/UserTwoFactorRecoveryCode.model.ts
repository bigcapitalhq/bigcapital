import { SystemModel } from '@/modules/System/models/SystemModel';

/**
 * A single-use recovery code (stored as a SHA-256 hash).
 */
export class UserTwoFactorRecoveryCode extends SystemModel {
  readonly userId!: number;
  readonly codeHash!: string;
  readonly usedAt?: Date | null;
  readonly createdAt!: Date;

  static get tableName() {
    return 'users_two_factor_recovery_codes';
  }

  get timestamps() {
    return ['createdAt'];
  }
}
