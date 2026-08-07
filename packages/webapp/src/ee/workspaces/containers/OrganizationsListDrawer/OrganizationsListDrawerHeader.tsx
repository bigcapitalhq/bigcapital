// @ts-nocheck
import { Button, Switch } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import React from 'react';
import intl from 'react-intl-universal';

import '@/ee/workspaces/style/containers/Workspaces/OrganizationsListDrawer.scss';

const organizationsSwitchLabelBpCss = css`
  .bp4-control.bp4-switch {
    margin: 0;
  }
  .bp4-control.bp4-switch input:checked ~ .bp4-control-indicator {
    background: rgb(0, 82, 204);
    box-shadow: none;
  }
`;

type OrganizationsListDrawerHeaderProps = {
  isCurrentOrgDefault: boolean;
  activeOrganizationId: string | null;
  onSetDefaultWorkspace: (organizationId: string) => void;
  onClose: () => void;
};

export function OrganizationsListDrawerHeader({
  isCurrentOrgDefault,
  activeOrganizationId,
  onSetDefaultWorkspace,
  onClose,
}: OrganizationsListDrawerHeaderProps) {
  const handleChange = (e) => {
    if (
      e.currentTarget.checked &&
      !isCurrentOrgDefault &&
      activeOrganizationId
    ) {
      onSetDefaultWorkspace(activeOrganizationId);
    }
  };

  return (
    <x.div
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px="10px"
      py="10px"
      borderBottom="1px solid rgba(255, 255, 255, 0.08)"
    >
      <x.label
        className={organizationsSwitchLabelBpCss}
        display="inline-flex"
        alignItems="center"
        gap="2px"
        m={0}
        cursor="pointer"
        userSelect="none"
      >
        <Switch checked={isCurrentOrgDefault} onChange={handleChange} />
        <x.span fontSize="14px" color="rgb(255, 255, 255)">
          {intl.get('workspaces.set_default_workspace', {
            fallback: 'Set default workspace',
          })}
        </x.span>
      </x.label>
      <Button
        minimal
        icon="cross"
        className="organizations-list-drawer__close-btn"
        onClick={onClose}
        aria-label={intl.get('close', { fallback: 'Close' })}
      />
    </x.div>
  );
}
