import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { AuthSubmitButton } from '../../_components';
import { MfaOtpField } from '../MfaOtpField';
import {
  MfaQrCenter,
  MfaStepLinks,
  MfaStepText,
  MfaStepTitle,
} from '../MfaStepLayout';
import { useHandleMfaError } from '../useHandleMfaError';
import { useMfaSetupConfirm, useMfaSetupStart } from '../useMfa';
import type { MfaSetupStepProps } from '../types';
import { TwoFactorManualKey } from '@/containers/TwoFactor/TwoFactorManualKey';
import { TwoFactorQrCode } from '@/containers/TwoFactor/TwoFactorQrCode';

interface SetupValues {
  code: string;
}

const schema = Yup.object().shape({
  code: Yup.string()
    .required()
    .matches(/^\d{6}$/, intl.get('two_factor.code_format'))
    .label(intl.get('two_factor.code')),
});

/**
 * Required TOTP setup during sign-in: QR code, a code to confirm, then the
 * recovery codes (rendered by the parent).
 */
export function TotpSetupStep({
  challenge,
  onSetupConfirmed,
  onRestart,
}: MfaSetupStepProps) {
  const [setup, setSetup] = useState<{
    secret: string;
    otpauthUrl: string;
  } | null>(null);
  const { start } = useMfaSetupStart();
  const { confirm } = useMfaSetupConfirm();
  const handleError = useHandleMfaError(onRestart);

  useEffect(() => {
    start(challenge.token, 'totp')
      .then((data) => {
        // The API wire format is snake_case; the SDK types are camelCase.
        const raw = data as typeof data & { otpauth_url?: string };
        setSetup({
          secret: data.secret,
          otpauthUrl: raw.otpauthUrl ?? raw.otpauth_url ?? '',
        });
      })
      .catch(handleError);
  }, [challenge.token, start, handleError]);

  const handleSubmit = (
    values: SetupValues,
    {
      setSubmitting,
      setFieldValue,
      setFieldTouched,
    }: FormikHelpers<SetupValues>,
  ) => {
    confirm(challenge.token, values.code, 'totp')
      .then(onSetupConfirmed)
      .catch((error) => {
        handleError(error);
        setFieldValue('code', '', false);
        setFieldTouched('code', false, false);
        setSubmitting(false);
      });
  };

  return (
    <Formik<SetupValues>
      initialValues={{ code: '' }}
      validationSchema={schema}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <MfaStepTitle>
            {intl.get('two_factor.setup_required_title')}
          </MfaStepTitle>
          <MfaStepText className={Classes.TEXT_MUTED}>
            {intl.get('two_factor.setup_required_hint')}
          </MfaStepText>

          {setup && (
            <>
              <MfaQrCenter>
                <TwoFactorQrCode otpauthUrl={setup.otpauthUrl} />
              </MfaQrCenter>
              <TwoFactorManualKey secret={setup.secret} />
            </>
          )}

          <MfaOtpField />

          <AuthSubmitButton
            type={'submit'}
            intent={Intent.PRIMARY}
            fill={true}
            large={true}
            loading={isSubmitting}
            disabled={!setup}
            data-testId="two-factor-submit"
          >
            {intl.get('two_factor.verify_and_signin')}
          </AuthSubmitButton>

          <MfaStepLinks>
            <Button minimal small onClick={onRestart}>
              {intl.get('two_factor.back_to_signin')}
            </Button>
          </MfaStepLinks>
        </Form>
      )}
    </Formik>
  );
}
