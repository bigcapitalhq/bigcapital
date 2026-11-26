import { exchangeSamlCode } from '@bigcapital/sdk-ts';
import { Callout, Intent, Spinner } from '@blueprintjs/core';
import { useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { Link, useHistory } from 'react-router-dom';
import type { MfaChallenge } from '@/containers/Authentication/login/types';
import type { AuthSigninResponse } from '@bigcapital/sdk-ts';
import {
  AuthFooterLinks,
  AuthInsiderCard,
} from '@/containers/Authentication/_components';
import { AuthInsider } from '@/containers/Authentication/AuthInsider';
import { MfaFlow } from '@/containers/Authentication/login/MfaFlow';
import { normalizeSigninResponse } from '@/containers/Authentication/login/normalize';
import { isAuthSigninComplete, useApplyAuthLogin } from '@/hooks/query';
import { useAuthApiFetcher } from '@/hooks/useRequest';

export function SamlCallback() {
  const fetcher = useAuthApiFetcher();
  const history = useHistory();
  const applyAuthLogin = useApplyAuthLogin();
  const [challenge, setChallenge] = useState<MfaChallenge>();
  const [failure, setFailure] = useState('');
  const exchange = useRef<Promise<AuthSigninResponse>>();

  useEffect(() => {
    // Exchange once even when React re-runs the effect. Remove the single-use
    // code from browser history before continuing with the sign-in response.
    if (!exchange.current) {
      const code = new URLSearchParams(window.location.hash.slice(1)).get(
        'code',
      );
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname,
      );
      if (!code) {
        setFailure('saml.sign_in_failed');
        return;
      }
      exchange.current = exchangeSamlCode(fetcher, code);
    }

    let active = true;
    exchange.current.then(
      (data) => {
        if (!active) return;
        const outcome = normalizeSigninResponse(data);
        if (outcome.kind === 'mfa') {
          setChallenge({ ...outcome.challenge, rememberMe: false });
        } else if (isAuthSigninComplete(data)) {
          applyAuthLogin(data);
        } else {
          setFailure('saml.sign_in_failed');
        }
      },
      (error) => {
        if (!active) return;
        setFailure(
          error?.data?.code === 'SAML_MFA_ENROLLMENT_REQUIRED'
            ? 'saml.enrollment_required'
            : 'saml.sign_in_failed',
        );
      },
    );
    return () => {
      active = false;
    };
  }, [applyAuthLogin, fetcher]);

  return (
    <AuthInsider>
      <AuthInsiderCard>
        {failure ? (
          <Callout intent={Intent.DANGER} role="alert">
            {intl.get(failure)}
          </Callout>
        ) : challenge ? (
          <MfaFlow
            challenge={challenge}
            onComplete={applyAuthLogin}
            onRestart={() => history.replace('/auth/saml/login')}
          />
        ) : (
          <Spinner size={30} aria-label={intl.get('saml.sign_in')} />
        )}
      </AuthInsiderCard>
      {failure && (
        <AuthFooterLinks>
          <Link to="/auth/saml/login">{intl.get('saml.try_again')}</Link>
          <Link to="/auth/login">{intl.get('saml.back_to_login')}</Link>
        </AuthFooterLinks>
      )}
    </AuthInsider>
  );
}
