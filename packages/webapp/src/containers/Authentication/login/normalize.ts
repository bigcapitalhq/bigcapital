import type {
  MfaMethodDescriptor,
  MfaMethodId,
  MfaMethodKind,
  SigninOutcome,
} from './types';
import type { AuthSigninResponse } from '@bigcapital/sdk-ts';

const METHOD_KINDS: Record<MfaMethodId, MfaMethodKind> = {
  totp: 'otp',
  recovery_code: 'recovery_code',
  email_otp: 'otp',
  webauthn: 'webauthn',
};

type RawMethod =
  | string
  | {
      id?: string;
      kind?: string;
    };

interface RawMfaChallenge {
  challengeToken?: string;
  challenge_token?: string;
  expiresIn?: number;
  expires_in?: number;
  purpose?: string;
  methods?: RawMethod[];
  defaultMethod?: string;
  default_method?: string;
}

type RawSigninResponse = AuthSigninResponse & {
  mfa?: RawMfaChallenge;
  two_factor_required?: boolean;
  two_factor_setup_required?: boolean;
  challenge_token?: string;
  challenge_expires_in?: number;
};

/**
 * The API wire format is snake_case; accept both spellings so this adapter
 * works whether or not the SDK camel-case middleware is enabled.
 */
function normalizeMethodId(value?: string): MfaMethodId | undefined {
  if (
    value === 'totp' ||
    value === 'recovery_code' ||
    value === 'email_otp' ||
    value === 'webauthn'
  ) {
    return value;
  }
  return undefined;
}

function normalizeMethod(raw: RawMethod): MfaMethodDescriptor | null {
  const id =
    typeof raw === 'string'
      ? normalizeMethodId(raw)
      : normalizeMethodId(raw.id);

  if (!id) {
    return null;
  }
  const kind =
    typeof raw === 'object' &&
    (raw.kind === 'otp' ||
      raw.kind === 'recovery_code' ||
      raw.kind === 'webauthn')
      ? raw.kind
      : METHOD_KINDS[id];

  return { id, kind };
}

/**
 * Turns either the new `mfa` challenge object or the legacy flags into one
 * shape for the login flow. This keeps the UI refactor independent from the
 * server rollout and makes future methods additive.
 */
export function normalizeSigninResponse(
  data: AuthSigninResponse,
): SigninOutcome {
  const raw = data as RawSigninResponse;

  if (raw.mfa) {
    const token = raw.mfa.challengeToken ?? raw.mfa.challenge_token;
    const methods = (raw.mfa.methods ?? [])
      .map(normalizeMethod)
      .filter((method): method is MfaMethodDescriptor => !!method);

    if (token && methods.length > 0) {
      return {
        kind: 'mfa',
        challenge: {
          token,
          purpose: raw.mfa.purpose === 'setup' ? 'setup' : 'verify',
          expiresIn: raw.mfa.expiresIn ?? raw.mfa.expires_in ?? 0,
          methods,
          defaultMethod: normalizeMethodId(
            raw.mfa.defaultMethod ?? raw.mfa.default_method,
          ),
        },
      };
    }
  }

  const token = raw.challengeToken ?? raw.challenge_token;

  if (!token) {
    return { kind: 'complete', auth: data };
  }
  const setupRequired =
    raw.twoFactorSetupRequired ?? raw.two_factor_setup_required;

  return {
    kind: 'mfa',
    challenge: {
      token,
      purpose: setupRequired ? 'setup' : 'verify',
      expiresIn: raw.challengeExpiresIn ?? raw.challenge_expires_in ?? 0,
      methods: setupRequired
        ? [{ id: 'totp', kind: 'otp' }]
        : [
            { id: 'totp', kind: 'otp' },
            { id: 'recovery_code', kind: 'recovery_code' },
          ],
      defaultMethod: 'totp',
    },
  };
}
