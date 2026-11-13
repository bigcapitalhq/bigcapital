import type { AuthSigninResponse } from '@bigcapital/sdk-ts';

/**
 * The second-factor methods the login flow can render. Keep these ids in sync
 * with the server's `MFA_METHOD_IDS`; a method without a registered component
 * falls back to the unsupported-method screen.
 */
export type MfaMethodId = 'totp' | 'recovery_code' | 'email_otp' | 'webauthn';

export type MfaMethodKind = 'otp' | 'recovery_code' | 'webauthn';

export type MfaPurpose = 'verify' | 'setup';

export interface MfaMethodDescriptor {
  id: MfaMethodId;
  kind: MfaMethodKind;
}

export interface MfaChallenge {
  token: string;
  purpose: MfaPurpose;
  expiresIn: number;
  methods: MfaMethodDescriptor[];
  defaultMethod?: MfaMethodId;
  /** The remember-me choice of the password step (carried by the challenge). */
  rememberMe: boolean;
}

export type SigninOutcome =
  | { kind: 'complete'; auth: AuthSigninResponse }
  | {
      kind: 'mfa';
      challenge: Omit<MfaChallenge, 'rememberMe'>;
    };

export interface MfaVerifyInput {
  challengeToken: string;
  method: MfaMethodId;
  code?: string;
  recoveryCode?: string;
}

export interface MfaSetupConfirmResult {
  auth: AuthSigninResponse;
  recoveryCodes?: string[];
}

export interface MfaVerifyStepProps {
  challenge: MfaChallenge;
  onVerified: (auth: AuthSigninResponse) => void;
  onRestart: () => void;
  /** Back to the picker, when more than one primary method is available. */
  onUseAnotherMethod?: () => void;
  /** Switch to a recovery code fallback. */
  onUseRecoveryCode?: () => void;
  /** Switch back from a recovery code to a primary method. */
  onUsePrimaryMethod?: () => void;
}

export interface MfaSetupStepProps {
  challenge: MfaChallenge;
  onSetupConfirmed: (result: MfaSetupConfirmResult) => void;
  onRestart: () => void;
}
