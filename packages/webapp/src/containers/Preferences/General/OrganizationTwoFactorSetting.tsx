import { Classes, Intent, Switch } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { AppToaster } from '@/components';
import { getTwoFactorErrorMessage } from '@/containers/TwoFactor/utils';
import {
  useOrganizationTwoFactor,
  useUpdateOrganizationTwoFactor,
} from '@/hooks/query';
import { useAbilityContext } from '@/hooks/utils';

/**
 * Organization setting: require two-factor authentication for all users.
 * Shown to administrators only (the API refuses everybody else).
 */
export function OrganizationTwoFactorSetting() {
  const ability = useAbilityContext();
  const isAdmin = ability.can('manage', 'all');
  const { data, isLoading } = useOrganizationTwoFactor({ enabled: isAdmin });
  const { mutateAsync: update, isPending } = useUpdateOrganizationTwoFactor();

  if (!isAdmin) {
    return null;
  }
  const required = !!data?.required;

  const handleChange = () => {
    update({ required: !required })
      .then(() =>
        AppToaster.show({
          message: !required
            ? intl.get('two_factor.org.required_on')
            : intl.get('two_factor.org.required_off'),
          intent: Intent.SUCCESS,
        }),
      )
      .catch((error) =>
        AppToaster.show({
          message: getTwoFactorErrorMessage(error),
          intent: Intent.DANGER,
        }),
      );
  };

  return (
    <Section data-testId="organization-two-factor">
      <h4>{intl.get('two_factor.org.title')}</h4>
      <Switch
        checked={required}
        disabled={isLoading || isPending}
        onChange={handleChange}
        label={intl.get('two_factor.org.require_label')}
        large
      />
      <p className={Classes.TEXT_MUTED}>{intl.get('two_factor.org.hint')}</p>
    </Section>
  );
}

const Section = styled.div`
  --x-color-border: #e0e7ea;

  .bp4-dark & {
    --x-color-border: rgba(255, 255, 255, 0.15);
  }
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--x-color-border);
  max-width: 600px;

  h4 {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 500;
  }
  p {
    line-height: 1.5;
  }
`;
