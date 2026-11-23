import { useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import { MfaMethodPicker } from './MfaMethodPicker';
import { MfaRecoveryCodesStep } from './MfaRecoveryCodesStep';
import { MfaUnsupportedMethod } from './MfaUnsupportedMethod';
import { SETUP_STEPS, VERIFY_STEPS } from './registry';
import type { MfaChallenge, MfaMethodId } from './types';
import type { AuthSigninResponse } from '@bigcapital/sdk-ts';

interface MfaFlowProps {
  challenge: MfaChallenge;
  onComplete: (auth: AuthSigninResponse) => void;
  onRestart: () => void;
}

/**
 * Routes a challenge to a method picker or to the selected method's component.
 * A single method skips the picker; recovery codes are a fallback link.
 */
export function MfaFlow({ challenge, onComplete, onRestart }: MfaFlowProps) {
  const [methodId, setMethodId] = useState<MfaMethodId | undefined>();
  const [recoveryCodes, setRecoveryCodes] = useState<{
    auth: AuthSigninResponse;
    codes: string[];
  } | null>(null);

  const primaryMethods = useMemo(
    () => challenge.methods.filter((method) => method.id !== 'recovery_code'),
    [challenge.methods],
  );
  const hasRecoveryCode = challenge.methods.some(
    (method) => method.id === 'recovery_code',
  );

  if (recoveryCodes) {
    return (
      <MfaRecoveryCodesStep
        codes={recoveryCodes.codes}
        onDone={() => onComplete(recoveryCodes.auth)}
      />
    );
  }

  if (challenge.purpose === 'setup') {
    const setupMethods = challenge.methods.filter(
      (method) => !!SETUP_STEPS[method.id],
    );
    const activeMethodId =
      methodId ?? (setupMethods.length === 1 ? setupMethods[0].id : undefined);

    if (!activeMethodId) {
      if (setupMethods.length === 0) {
        return <MfaUnsupportedMethod onRestart={onRestart} />;
      }
      return (
        <MfaMethodPicker
          title={intl.get('two_factor.setup_required_title')}
          hint={intl.get('mfa.setup_choose_method')}
          methods={setupMethods}
          onSelect={setMethodId}
          onRestart={onRestart}
        />
      );
    }
    const SetupStep = SETUP_STEPS[activeMethodId];

    if (!SetupStep) {
      return (
        <MfaUnsupportedMethod
          onRestart={onRestart}
          onBackToMethods={
            challenge.methods.length > 1
              ? () => setMethodId(undefined)
              : undefined
          }
        />
      );
    }
    return (
      <SetupStep
        challenge={challenge}
        onSetupConfirmed={(result) => {
          if (result.recoveryCodes?.length) {
            setRecoveryCodes({
              auth: result.auth,
              codes: result.recoveryCodes,
            });
          } else {
            onComplete(result.auth);
          }
        }}
        onRestart={onRestart}
      />
    );
  }

  const activeMethodId =
    methodId ??
    (primaryMethods.length === 1
      ? primaryMethods[0].id
      : primaryMethods.length === 0 && hasRecoveryCode
        ? 'recovery_code'
        : undefined);

  if (!activeMethodId) {
    if (challenge.methods.length > 0) {
      return (
        <MfaMethodPicker
          title={intl.get('two_factor.signin_title')}
          hint={intl.get('mfa.choose_method')}
          methods={challenge.methods}
          onSelect={setMethodId}
          onRestart={onRestart}
        />
      );
    }
    return <MfaUnsupportedMethod onRestart={onRestart} />;
  }

  const VerifyStep = VERIFY_STEPS[activeMethodId];

  if (!VerifyStep) {
    return (
      <MfaUnsupportedMethod
        onRestart={onRestart}
        onBackToMethods={
          challenge.methods.length > 1
            ? () => setMethodId(undefined)
            : undefined
        }
      />
    );
  }
  return (
    <VerifyStep
      challenge={challenge}
      onVerified={onComplete}
      onRestart={onRestart}
      onUseAnotherMethod={
        primaryMethods.length > 1 ? () => setMethodId(undefined) : undefined
      }
      onUseRecoveryCode={
        hasRecoveryCode && activeMethodId !== 'recovery_code'
          ? () => setMethodId('recovery_code')
          : undefined
      }
      onUsePrimaryMethod={
        activeMethodId === 'recovery_code' && primaryMethods.length > 0
          ? () => setMethodId(primaryMethods[0].id)
          : undefined
      }
    />
  );
}
