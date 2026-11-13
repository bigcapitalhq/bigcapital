export const MFA_METHOD_IDS = [
  'totp',
  'recovery_code',
  'email_otp',
  'webauthn',
] as const;

export type MfaMethodId = (typeof MFA_METHOD_IDS)[number];

export type MfaMethodKind = 'otp' | 'recovery_code' | 'webauthn';

export interface MfaMethodDescriptor {
  id: MfaMethodId;
  kind: MfaMethodKind;
}

/**
 * The credential a client sends for a second-factor method. Each provider
 * reads only the fields of its own method.
 */
export interface MfaCredential {
  /** 6-digit code from an authenticator app, email, or SMS. */
  code?: string;
  /** One of the single-use recovery codes. */
  recoveryCode?: string;
  /** WebAuthn assertion, when that method is implemented. */
  credential?: Record<string, unknown>;
}

/**
 * A second-factor method. The registry is the only place that knows which
 * methods exist; the sign-in flow asks it what the user has enrolled.
 */
export interface MfaMethodProvider {
  readonly id: MfaMethodId;
  readonly kind: MfaMethodKind;

  /** Whether the user can use this method to sign in. */
  isEnrolled(userId: number): Promise<boolean>;

  /** Checks the credential of this method. */
  verify(userId: number, credential: MfaCredential): Promise<boolean>;

  /**
   * Optional server-side preparation before the user enters a credential,
   * e.g. sending an email code or returning WebAuthn request options.
   */
  prepare?(
    userId: number,
    challengeToken: string,
  ): Promise<Record<string, unknown> | null>;

  /** Setup hooks, only for methods that can be enrolled during sign-in. */
  startSetup?(userId: number): Promise<MfaSetupStartResult>;
  confirmSetup?(userId: number, code: string): Promise<string[] | null>;
}

/**
 * A method-specific setup payload. TOTP returns a secret and its otpauth URI;
 * other methods will return their own fields.
 */
export interface MfaSetupStartResult {
  method: MfaMethodId;
  /** TOTP setup fields; other methods will add their own. */
  secret?: string;
  otpauthUrl?: string;
  [key: string]: unknown;
}
