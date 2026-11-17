import { Intent } from '@blueprintjs/core';
import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { AppToaster } from '@/components';
import { setCookie } from '@/utils';

/**
 * Google OAuth callback page.
 *
 * The server redirects here with the issued JWT and account identifiers in the
 * query string. Cookies are written before a full page reload so the store
 * rehydrates from them exactly like the email/password sign-in flow.
 */
export function GoogleAuthCallback() {
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const token = params.get('token');

    if (error || !token) {
      AppToaster.show({
        message: intl.get('google_auth_failed'),
        intent: Intent.DANGER,
      });
      history.replace('/auth/login');
      return;
    }

    setCookie('token', token, 1);
    setCookie('authenticated_user_id', params.get('user_id') ?? '', 1);
    setCookie('organization_id', params.get('organization_id') ?? '', 1);
    setCookie('tenant_id', params.get('tenant_id') ?? '', 1);

    window.location.replace('/');
  }, [history]);

  return null;
}
