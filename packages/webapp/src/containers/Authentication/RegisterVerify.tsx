import { Button, Intent } from '@blueprintjs/core';
import { x } from '@xstyled/emotion';
import { AuthInsiderCard } from './_components';
import { AuthContainer } from './AuthContainer';
import { AuthInsider } from './AuthInsider';
import { AppToaster, Stack } from '@/components';
import { useAuthSignUpVerifyResendMail } from '@/hooks/query';
import { useAuthActions, useAuthUserVerifyEmail } from '@/hooks/state';
import { useIsDarkMode } from '@/hooks/useDarkMode';

export function RegisterVerify() {
  const { setLogout } = useAuthActions();
  const { mutateAsync: resendSignUpVerifyMail, isPending } =
    useAuthSignUpVerifyResendMail();

  const emailAddress = useAuthUserVerifyEmail();
  const isDarkMode = useIsDarkMode();

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
        <AuthInsiderCard textAlign="center">
          <x.h2
            fontSize="18px"
            fontWeight={600}
            mb="0.5rem"
            color={isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#252A31'}
          >
            Please verify your email
          </x.h2>
          <x.p
            mb="1rem"
            fontSize="15px"
            lineHeight="1.45"
            color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#404854'}
          >
            We sent an email to <strong>{emailAddress}</strong> Click the link
            inside to get started.
          </x.p>

          <Stack spacing={4}>
            <Button
              large
              fill
              loading={isPending}
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
