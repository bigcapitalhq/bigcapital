import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers } from 'formik';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { AuthSubmitButton } from '../../_components';
import { MfaOtpField } from '../MfaOtpField';
import { MfaStepLinks, MfaStepText, MfaStepTitle } from '../MfaStepLayout';
import { useHandleMfaError } from '../useHandleMfaError';
import { useMfaVerify } from '../useMfa';
import type { MfaVerifyStepProps } from '../types';
import type { AuthSigninResponse } from '@bigcapital/sdk-ts';

interface TotpValues {
  code: string;
}

const schema = Yup.object().shape({
  code: Yup.string()
    .required()
    .matches(/^\d{6}$/, intl.get('two_factor.code_format'))
    .label(intl.get('two_factor.code')),
});

/**
 * Authenticator-app code step.
 */
export function TotpVerifyStep({
  challenge,
  onVerified,
  onRestart,
  onUseAnotherMethod,
  onUseRecoveryCode,
}: MfaVerifyStepProps) {
  const { verify } = useMfaVerify();
  const handleError = useHandleMfaError(onRestart);

  const handleSubmit = (
    values: TotpValues,
    {
      setSubmitting,
      setFieldValue,
      setFieldTouched,
    }: FormikHelpers<TotpValues>,
  ) => {
    verify({
      challengeToken: challenge.token,
      method: 'totp',
      code: values.code,
    })
      .then((data) => onVerified(data as AuthSigninResponse))
      .catch((error) => {
        handleError(error);
        // Empty the field for the next try without a "required" error.
        setFieldValue('code', '', false);
        setFieldTouched('code', false, false);
        setSubmitting(false);
      });
  };

  return (
    <Formik<TotpValues>
      initialValues={{ code: '' }}
      validationSchema={schema}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <MfaStepTitle>{intl.get('two_factor.signin_title')}</MfaStepTitle>
          <MfaStepText className={Classes.TEXT_MUTED}>
            {intl.get('two_factor.signin_code_hint')}
          </MfaStepText>

          <MfaOtpField />

          <AuthSubmitButton
            type={'submit'}
            intent={Intent.PRIMARY}
            fill={true}
            large={true}
            loading={isSubmitting}
            data-testId="two-factor-submit"
          >
            {intl.get('two_factor.verify')}
          </AuthSubmitButton>

          <MfaStepLinks>
            <span>
              {onUseRecoveryCode && (
                <Button minimal small onClick={onUseRecoveryCode}>
                  {intl.get('two_factor.use_recovery_code')}
                </Button>
              )}
              {onUseAnotherMethod && (
                <Button minimal small onClick={onUseAnotherMethod}>
                  {intl.get('mfa.use_another_method')}
                </Button>
              )}
            </span>
            <Button minimal small onClick={onRestart}>
              {intl.get('two_factor.back_to_signin')}
            </Button>
          </MfaStepLinks>
        </Form>
      )}
    </Formik>
  );
}
