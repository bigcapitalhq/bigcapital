import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { FFormGroup, FInputGroup } from '@/components';
import { normalizeCodeInput } from '@/containers/TwoFactor/utils';

interface MfaOtpFieldProps {
  name?: string;
  autoFocus?: boolean;
  dataTestId?: string;
}

/**
 * The shared 6-digit code field of the OTP methods.
 */
export function MfaOtpField({
  name = 'code',
  autoFocus = true,
  dataTestId = 'two-factor-code-input',
}: MfaOtpFieldProps) {
  const { setFieldValue } = useFormikContext<Record<string, string>>();

  return (
    <FFormGroup name={name} label={intl.get('two_factor.code')}>
      <FInputGroup
        name={name}
        large={true}
        autoFocus={autoFocus}
        inputMode={'numeric'}
        autoComplete={'one-time-code'}
        maxLength={6}
        placeholder={'123456'}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setFieldValue(name, normalizeCodeInput(event.target.value))
        }
        data-testId={dataTestId}
      />
    </FFormGroup>
  );
}
