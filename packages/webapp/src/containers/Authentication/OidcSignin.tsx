// @ts-nocheck
import { T } from '@/components';
import { useAuthMetaBoot } from '@/containers/Authentication/AuthMetaBoot';
import {
  AuthOidcSignInButton,
  AuthOrDivider,
  AuthOrDividerContainer,
  AuthenticationLoadingOverlay,
} from '@/containers/Authentication/_components';
import { useAuthOidcAuthorize, useAuthOidcLogin } from '@/hooks/query';
import { useEffect, useState } from 'react';

const OidcSignin = ({ code }) => {
  const [oidcCode, setOidcCode] = useState<null | string>(null);
  const [authorizing, setAuthorizing] = useState(false);
  const { isLoading: oidcAuthorizing, mutateAsync: OidcAuthorizeMutate } =
    useAuthOidcAuthorize();
  const { mutateAsync: OIdcLoginMutate } = useAuthOidcLogin();
  const { oidcLoginDisabled } = useAuthMetaBoot();

  const handleOidcAuthorize = () => {
    setAuthorizing(true);
    OidcAuthorizeMutate({}).catch((error) => {
      setAuthorizing(false);
    });
  };

  const handleOidcLogin = async (code: string) => {
    setAuthorizing(true);
    OIdcLoginMutate({
      code,
    }).catch((error) => {
      setOidcCode(null);
      setAuthorizing(false);
    });
  };

  useEffect(() => {
    if (code && !oidcCode) {
      setOidcCode(code.toString());
      handleOidcLogin(code.toString());
    }
  }, [code]);

  if (oidcLoginDisabled) return null;

  return (
    <>
      <AuthOrDividerContainer>
        <AuthOrDivider>OR</AuthOrDivider>
      </AuthOrDividerContainer>
      <AuthOidcSignInButton
        onClick={handleOidcAuthorize}
        type={'button'}
        fill
        large
        loading={oidcAuthorizing}
      >
        <T id={'oidc_log_in'} />
      </AuthOidcSignInButton>

      {authorizing && <AuthenticationLoadingOverlay />}
    </>
  );
};

export default OidcSignin;
