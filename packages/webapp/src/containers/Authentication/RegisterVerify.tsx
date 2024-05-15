// @ts-nocheck
import { Button, Intent } from '@blueprintjs/core';
import AuthInsider from './AuthInsider';
import { AuthInsiderCard } from './_components';
import styles from './RegisterVerify.module.scss';
import { AppToaster, Stack } from '@/components';
import { useAuthActions, useAuthUserVerifyEmail } from '@/hooks/state';
import { useAuthSignUpVerifyResendMail } from '@/hooks/query';
import { AuthContainer } from './AuthContainer';

export default function RegisterVerify() {
  const { setLogout } = useAuthActions();
  const { mutateAsync: resendSignUpVerifyMail, isLoading } =
    useAuthSignUpVerifyResendMail();

  const emailAddress = useAuthUserVerifyEmail();

  const handleResendMailBtnClick = () => {
    resendSignUpVerifyMail()
      .then(() => {
        AppToaster.show({
          intent: Intent.SUCCESS,
          message: 'The verification mail has sent successfully.',
        });
      })
      .catch(() => {
        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong.',
        });
      });
  };
  const handleSignOutBtnClick = () => {
    setLogout();
  };

  return (
    <AuthContainer>
      <AuthInsider>
        <AuthInsiderCard className={styles.root}>
          <h2 className={styles.title}>Please verify your email</h2>
          <p className={styles.description}>
            We sent an email to <strong>{emailAddress}</strong> Click the link
            inside to get started.
          </p>

          <Stack spacing={4}>
            <Button
              large
              fill
              loading={isLoading}
              intent={Intent.NONE}
              onClick={handleResendMailBtnClick}
            >
              Resend email
            </Button>

            <Button
              large
              fill
              minimal
              intent={Intent.DANGER}
              onClick={handleSignOutBtnClick}
            >
              Not my email
            </Button>
          </Stack>
        </AuthInsiderCard>
      </AuthInsider>
    </AuthContainer>
  );
}
