import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers } from 'formik';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { AuthSubmitButton } from '../../_components';
import { MfaStepLinks, MfaStepText, MfaStepTitle } from '../MfaStepLayout';
import { useHandleMfaError } from '../useHandleMfaError';
import { useMfaVerify } from '../useMfa';
import type { MfaVerifyStepProps } from '../types';
import type { AuthSigninResponse } from '@bigcapital/sdk-ts';
import { FFormGroup, FInputGroup } from '@/components';

interface RecoveryCodeValues {
  recoveryCode: string;
}

const schema = Yup.object().shape({
  recoveryCode: Yup.string()
    .required()
    .label(intl.get('two_factor.recovery_code')),
});

/**
 * Fallback step: one of the single-use recovery codes.
 */
export function RecoveryCodeVerifyStep({
  challenge,
  onVerified,
  onRestart,
  onUseAnotherMethod,
  onUsePrimaryMethod,
}: MfaVerifyStepProps) {
  const { verify } = useMfaVerify();
  const handleError = useHandleMfaError(onRestart);

  const handleSubmit = (
    values: RecoveryCodeValues,
    {
      setSubmitting,
      setFieldValue,
      setFieldTouched,
    }: FormikHelpers<RecoveryCodeValues>,
  ) => {
    verify({
      challengeToken: challenge.token,
      method: 'recovery_code',
      recoveryCode: values.recoveryCode.trim(),
    })
      .then((data) => onVerified(data as AuthSigninResponse))
      .catch((error) => {
        handleError(error);
        setFieldValue('recoveryCode', '', false);
        setFieldTouched('recoveryCode', false, false);
        setSubmitting(false);
      });
  };

  return (
    <Formik<RecoveryCodeValues>
      initialValues={{ recoveryCode: '' }}
      validationSchema={schema}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <MfaStepTitle>{intl.get('two_factor.signin_title')}</MfaStepTitle>
          <MfaStepText className={Classes.TEXT_MUTED}>
            {intl.get('two_factor.signin_recovery_hint')}
          </MfaStepText>

          <FFormGroup
            name={'recoveryCode'}
            label={intl.get('two_factor.recovery_code')}
          >
            <FInputGroup
              name={'recoveryCode'}
              large={true}
              autoFocus={true}
              autoComplete={'off'}
              placeholder={'xxxx-xxxx-xxxx-xxxx'}
              data-testId="two-factor-recovery-code-input"
            />
          </FFormGroup>

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
              {onUsePrimaryMethod && (
                <Button minimal small onClick={onUsePrimaryMethod}>
                  {intl.get('two_factor.use_app_code')}
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
