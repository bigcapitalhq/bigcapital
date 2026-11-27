import { samlLoginPath } from '@bigcapital/sdk-ts';
import { Button, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { useState } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import {
  AuthFooterLinks,
  AuthInsiderCard,
} from '@/containers/Authentication/_components';
import { AuthInsider } from '@/containers/Authentication/AuthInsider';

export function SamlLogin() {
  const [organizationId, setOrganizationId] = useState('');

  return (
    <AuthInsider>
      <AuthInsiderCard>
        <h3>{intl.get('saml.sign_in')}</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            window.location.assign(samlLoginPath(organizationId.trim()));
          }}
        >
          <FormGroup
            label={intl.get('organization_id')}
            labelFor="saml-organization-id"
            helperText={intl.get('saml.organization_hint')}
          >
            <InputGroup
              id="saml-organization-id"
              value={organizationId}
              onChange={(event) => setOrganizationId(event.target.value)}
              required
              autoCapitalize="none"
              spellCheck={false}
              large
            />
          </FormGroup>
          <Button
            intent={Intent.PRIMARY}
            type="submit"
            disabled={!organizationId.trim()}
            fill
            large
          >
            {intl.get('saml.continue')}
          </Button>
        </form>
      </AuthInsiderCard>
      <AuthFooterLinks>
        <Link to="/auth/login">{intl.get('saml.back_to_login')}</Link>
      </AuthFooterLinks>
    </AuthInsider>
  );
}
