import { SystemModel } from '@/modules/System/models/SystemModel';

/**
 * Two-factor authentication state of a system user (one row per user).
 * The secrets are encrypted (TwoFactorCryptoService) and never serialized
 * to API responses.
 */
export class UserTwoFactor extends SystemModel {
  readonly userId!: number;

  /** Encrypted TOTP secret of the confirmed setup. */
  readonly secret?: string | null;

  /** When two-factor authentication was turned on; null while not enabled. */
  readonly enabledAt?: Date | null;

  /** The last TOTP time step accepted, codes of this or earlier steps are refused. */
  readonly lastUsedStep?: number | null;

  /** Encrypted TOTP secret of a setup that is not confirmed yet. */
  readonly pendingSecret?: string | null;
  readonly pendingCreatedAt?: Date | null;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  static get tableName() {
    return 'users_two_factor';
  }

  static get idColumn() {
    return 'userId';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  get isEnabled(): boolean {
    return !!this.enabledAt && !!this.secret;
  }

  static get virtualAttributes() {
    return ['isEnabled'];
  }

  /**
   * Never expose the secrets, whatever serializes this model.
   */
  $formatJson(json: Record<string, any>) {
    const formatted = super.$formatJson(json);

    delete formatted.secret;
    delete formatted.pendingSecret;
    return formatted;
  }
}
