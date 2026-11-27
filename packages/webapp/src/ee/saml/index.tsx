import { lazy } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import type { SamlIntegration } from '@/routes/optionalSaml';
import { AuthFooterLink } from '@/containers/Authentication/_components';

const saml: SamlIntegration = {
  authenticationRoutes: [
    {
      path: '/auth/saml/login',
      component: lazy(() =>
        import('./containers/SamlLogin').then((m) => ({
          default: m.SamlLogin,
        })),
      ),
    },
    {
      path: '/auth/saml/callback',
      component: lazy(() =>
        import('./containers/SamlCallback').then((m) => ({
          default: m.SamlCallback,
        })),
      ),
    },
  ],
  LoginLink: () => (
    <AuthFooterLink>
      <Link to="/auth/saml/login">{intl.get('saml.sign_in')}</Link>
    </AuthFooterLink>
  ),
  OrganizationPreferences: lazy(() =>
    import('./containers/OrganizationSamlSettings').then((m) => ({
      default: m.OrganizationSamlSettings,
    })),
  ),
};

export default saml;
