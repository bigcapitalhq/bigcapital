import { RecoveryCodeVerifyStep } from './methods/RecoveryCodeVerifyStep';
import { TotpSetupStep } from './methods/TotpSetupStep';
import { TotpVerifyStep } from './methods/TotpVerifyStep';
import type {
  MfaMethodId,
  MfaSetupStepProps,
  MfaVerifyStepProps,
} from './types';
import type { ComponentType } from 'react';

/**
 * Adding a method to the login flow is one server provider plus one entry in
 * each registry below (and its component).
 */
export const VERIFY_STEPS: Partial<
  Record<MfaMethodId, ComponentType<MfaVerifyStepProps>>
> = {
  totp: TotpVerifyStep,
  recovery_code: RecoveryCodeVerifyStep,
};

export const SETUP_STEPS: Partial<
  Record<MfaMethodId, ComponentType<MfaSetupStepProps>>
> = {
  totp: TotpSetupStep,
};
