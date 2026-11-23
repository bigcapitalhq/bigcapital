import intl from 'react-intl-universal';
import { MfaStepTitle } from './MfaStepLayout';
import { TwoFactorRecoveryCodes } from '@/containers/TwoFactor/TwoFactorRecoveryCodes';

interface MfaRecoveryCodesStepProps {
  codes: string[];
  onDone: () => void;
}

/**
 * The recovery codes are shown once, after the required setup, before the
 * sign-in is completed.
 */
export function MfaRecoveryCodesStep({
  codes,
  onDone,
}: MfaRecoveryCodesStepProps) {
  return (
    <div>
      <MfaStepTitle>{intl.get('two_factor.recovery_codes_title')}</MfaStepTitle>
      <TwoFactorRecoveryCodes
        codes={codes}
        doneLabel={intl.get('two_factor.continue')}
        onDone={onDone}
      />
    </div>
  );
}
