// @ts-nocheck
import React from 'react';
import { Button, NavbarGroup, Intent } from '@blueprintjs/core';
import { DashboardActionsBar, Icon } from '@/components';
import { DRAWERS } from '@/constants/drawers';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

/**
 * Account drawer action bar.
 */
function BrandingTemplateActionsBarRoot({ openDrawer }) {
  // Handle new child button click.
  const handleCreateBtnClick = () => {
    openDrawer(DRAWERS.INVOICE_CUSTOMIZE);
  };
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          intent={Intent.PRIMARY}
          icon={<Icon icon="plus" />}
          onClick={handleCreateBtnClick}
          minimal
        >
          Create Invoice Branding
        </Button>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}
export const BrandingTemplateActionsBar = compose(withDrawerActions)(
  BrandingTemplateActionsBarRoot,
);
