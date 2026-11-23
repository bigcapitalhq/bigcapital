import { useCallback } from 'react';
import type {
  MfaMethodId,
  MfaSetupConfirmResult,
  MfaVerifyInput,
} from './types';
import type { AuthSigninResponse } from '@bigcapital/sdk-ts';
import {
  useAuthMfaSetupConfirm,
  useAuthMfaSetupStart,
  useAuthMfaVerify,
} from '@/hooks/query';

/**
 * Generic MFA mutations. Method components pass their method id and credential;
 * adding a method does not add another hook.
 */
export function useMfaVerify() {
  const { mutateAsync, ...mutation } = useAuthMfaVerify();

  const verify = useCallback(
    (input: MfaVerifyInput): Promise<AuthSigninResponse> => {
      return mutateAsync({
        challengeToken: input.challengeToken,
        method: input.method,
        code: input.code,
        recoveryCode: input.recoveryCode,
      }) as Promise<AuthSigninResponse>;
    },
    [mutateAsync],
  );

  return { ...mutation, verify };
}

export function useMfaSetupStart() {
  const { mutateAsync, ...mutation } = useAuthMfaSetupStart();

  const start = useCallback(
    (challengeToken: string, method: MfaMethodId = 'totp') =>
      mutateAsync({ challengeToken, method }),
    [mutateAsync],
  );

  return { ...mutation, start };
}

export function useMfaSetupConfirm() {
  const { mutateAsync, ...mutation } = useAuthMfaSetupConfirm();

  const confirm = useCallback(
    async (
      challengeToken: string,
      code: string,
      method: MfaMethodId = 'totp',
    ): Promise<MfaSetupConfirmResult> => {
      const data = await mutateAsync({ challengeToken, method, code });

      return {
        auth: data as AuthSigninResponse,
        recoveryCodes:
          data.recoveryCodes ??
          (data as unknown as { recovery_codes?: string[] }).recovery_codes,
      };
    },
    [mutateAsync],
  );

  return { ...mutation, confirm };
}
