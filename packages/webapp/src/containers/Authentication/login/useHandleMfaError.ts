import { Intent } from '@blueprintjs/core';
import { useCallback } from 'react';
import { AppToaster } from '@/components';
import {
  TWO_FACTOR_ERROR_TYPES,
  getTwoFactorErrorType,
  getTwoFactorErrorMessage,
} from '@/containers/TwoFactor/utils';

/**
 * Shows the error of an MFA request; an expired sign-in or setup goes back to
 * the password form (or the setup start) through `onRestart`.
 */
export function useHandleMfaError(onRestart: () => void) {
  return useCallback(
    (error: unknown) => {
      AppToaster.show({
        message: getTwoFactorErrorMessage(error),
        intent: Intent.DANGER,
      });
      const type = getTwoFactorErrorType(error);

      if (
        type === TWO_FACTOR_ERROR_TYPES.CHALLENGE_INVALID ||
        type === TWO_FACTOR_ERROR_TYPES.SETUP_NOT_STARTED
      ) {
        onRestart();
      }
    },
    [onRestart],
  );
}
