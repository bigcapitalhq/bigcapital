import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import * as Yup from 'yup';
import { AuthSubmitButton } from './_components';
import type { AuthSigninResponse } from '@bigcapital/sdk-ts';
import { AppToaster, FFormGroup, FInputGroup } from '@/components';
import { TwoFactorManualKey } from '@/containers/TwoFactor/TwoFactorManualKey';
import { TwoFactorQrCode } from '@/containers/TwoFactor/TwoFactorQrCode';
import { TwoFactorRecoveryCodes } from '@/containers/TwoFactor/TwoFactorRecoveryCodes';
import {
  TWO_FACTOR_ERROR_TYPES,
  getTwoFactorErrorMessage,
  getTwoFactorErrorType,
  normalizeCodeInput,
} from '@/containers/TwoFactor/utils';
import {
  useApplyAuthLogin,
  useAuthLoginTwoFactor,
  useAuthTwoFactorSetupConfirm,
  useAuthTwoFactorSetupStart,
} from '@/hooks/query';

interface LoginTwoFactorStepProps {
  challengeToken: string;
  rememberMe: boolean;
  /** Back to the email and password form. */
  onRestart: () => void;
}

/**
 * Shows the error of a second-step request; an expired sign-in goes back to
 * the password form.
 */
function useHandleStepError(onRestart: () => void) {
  return (error: unknown) => {
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
  };
}

interface VerifyValues {
  code: string;
  recoveryCode: string;
}

/**
 * Second sign-in step: the 6-digit code, or a recovery code.
 */
export function LoginTwoFactorVerify({
  challengeToken,
  rememberMe,
  onRestart,
}: LoginTwoFactorStepProps) {
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const { mutateAsync: verify } = useAuthLoginTwoFactor();
  const applyAuthLogin = useApplyAuthLogin();
  const handleError = useHandleStepError(onRestart);

  const schema = useRecoveryCode
    ? Yup.object().shape({
        recoveryCode: Yup.string()
          .required()
          .label(intl.get('two_factor.recovery_code')),
      })
    : Yup.object().shape({
        code: Yup.string()
          .required()
          .matches(/^\d{6}$/, intl.get('two_factor.code_format'))
          .label(intl.get('two_factor.code')),
      });

  const handleSubmit = (
    values: VerifyValues,
    {
      setSubmitting,
      setFieldValue,
      setFieldTouched,
    }: FormikHelpers<VerifyValues>,
  ) => {
    const body = useRecoveryCode
      ? { challengeToken, recoveryCode: values.recoveryCode.trim() }
      : { challengeToken, code: values.code };

    verify(body as never)
      .then((data: AuthSigninResponse) => applyAuthLogin(data, rememberMe))
      .catch((error) => {
        handleError(error);
        // Empty the field for the next try without a "required" error.
        const field = useRecoveryCode ? 'recoveryCode' : 'code';
        setFieldValue(field, '', false);
        setFieldTouched(field, false, false);
        setSubmitting(false);
      });
  };

  return (
    <Formik<VerifyValues>
      initialValues={{ code: '', recoveryCode: '' }}
      validationSchema={schema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <StepTitle>{intl.get('two_factor.signin_title')}</StepTitle>
          <StepText className={Classes.TEXT_MUTED}>
            {useRecoveryCode
              ? intl.get('two_factor.signin_recovery_hint')
              : intl.get('two_factor.signin_code_hint')}
          </StepText>

          {useRecoveryCode ? (
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
          ) : (
            <FFormGroup name={'code'} label={intl.get('two_factor.code')}>
              <FInputGroup
                name={'code'}
                large={true}
                autoFocus={true}
                inputMode={'numeric'}
                autoComplete={'one-time-code'}
                maxLength={6}
                placeholder={'123456'}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('code', normalizeCodeInput(event.target.value))
                }
                data-testId="two-factor-code-input"
              />
            </FFormGroup>
          )}

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

          <StepLinks>
            <Button
              minimal
              small
              onClick={() => setUseRecoveryCode(!useRecoveryCode)}
            >
              {useRecoveryCode
                ? intl.get('two_factor.use_app_code')
                : intl.get('two_factor.use_recovery_code')}
            </Button>
            <Button minimal small onClick={onRestart}>
              {intl.get('two_factor.back_to_signin')}
            </Button>
          </StepLinks>
        </Form>
      )}
    </Formik>
  );
}

interface SetupValues {
  code: string;
}

type SetupConfirmResponse = AuthSigninResponse & { recovery_codes?: string[] };

/**
 * Required setup during sign-in (the organization requires two-factor and
 * the user has none yet): QR code, a code to confirm, then the recovery codes.
 */
export function LoginTwoFactorSetup({
  challengeToken,
  rememberMe,
  onRestart,
}: LoginTwoFactorStepProps) {
  const [setup, setSetup] = useState<{
    secret: string;
    otpauthUrl: string;
  } | null>(null);
  const [confirmed, setConfirmed] = useState<SetupConfirmResponse | null>(
    null,
  );
  const { mutateAsync: startSetup } = useAuthTwoFactorSetupStart();
  const { mutateAsync: confirmSetup } = useAuthTwoFactorSetupConfirm();
  const applyAuthLogin = useApplyAuthLogin();
  const handleError = useHandleStepError(onRestart);

  useEffect(() => {
    startSetup({ challengeToken } as never)
      .then((data: any) =>
        setSetup({ secret: data.secret, otpauthUrl: data.otpauth_url }),
      )
      .catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeToken]);

  const handleSubmit = (
    values: SetupValues,
    {
      setSubmitting,
      setFieldValue,
      setFieldTouched,
    }: FormikHelpers<SetupValues>,
  ) => {
    confirmSetup({ challengeToken, code: values.code } as never)
      .then((data) => setConfirmed(data as SetupConfirmResponse))
      .catch((error) => {
        handleError(error);
        setFieldValue('code', '', false);
        setFieldTouched('code', false, false);
        setSubmitting(false);
      });
  };

  // Signed in only after the recovery codes were shown.
  if (confirmed) {
    return (
      <div>
        <StepTitle>{intl.get('two_factor.recovery_codes_title')}</StepTitle>
        <TwoFactorRecoveryCodes
          codes={confirmed.recovery_codes ?? []}
          doneLabel={intl.get('two_factor.continue')}
          onDone={() => applyAuthLogin(confirmed, rememberMe)}
        />
      </div>
    );
  }

  return (
    <Formik<SetupValues>
      initialValues={{ code: '' }}
      validationSchema={Yup.object().shape({
        code: Yup.string()
          .required()
          .matches(/^\d{6}$/, intl.get('two_factor.code_format'))
          .label(intl.get('two_factor.code')),
      })}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <StepTitle>{intl.get('two_factor.setup_required_title')}</StepTitle>
          <StepText className={Classes.TEXT_MUTED}>
            {intl.get('two_factor.setup_required_hint')}
          </StepText>

          {setup && (
            <>
              <QrCenter>
                <TwoFactorQrCode otpauthUrl={setup.otpauthUrl} />
              </QrCenter>
              <TwoFactorManualKey secret={setup.secret} />
            </>
          )}

          <FFormGroup name={'code'} label={intl.get('two_factor.code')}>
            <FInputGroup
              name={'code'}
              large={true}
              inputMode={'numeric'}
              autoComplete={'one-time-code'}
              maxLength={6}
              placeholder={'123456'}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('code', normalizeCodeInput(event.target.value))
              }
              data-testId="two-factor-code-input"
            />
          </FFormGroup>

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

          <StepLinks>
            <Button minimal small onClick={onRestart}>
              {intl.get('two_factor.back_to_signin')}
            </Button>
          </StepLinks>
        </Form>
      )}
    </Formik>
  );
}

const StepTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 500;
`;

const StepText = styled.p`
  margin-bottom: 18px;
  line-height: 1.5;
`;

const StepLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
`;

const QrCenter = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;
