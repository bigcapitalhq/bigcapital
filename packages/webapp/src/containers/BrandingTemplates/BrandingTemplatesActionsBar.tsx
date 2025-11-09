// @ts-nocheck
import React, { useMemo } from 'react';
import { Button, NavbarGroup, Intent } from '@blueprintjs/core';
import { DrawerActionsBar, Icon } from '@/components';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import {
  getButtonLabelFromResource,
  getCustomizeDrawerNameFromResource,
} from './_utils';
import { compose } from '@/utils';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

/**
 * Account drawer action bar.
 */
function BrandingTemplateActionsBarRoot({ openDrawer }) {
  const {
    payload: { resource },
  } = useDrawerContext();

  // Handle new child button click.
  const handleCreateBtnClick = () => {
    const drawerResource = getCustomizeDrawerNameFromResource(resource);
    openDrawer(drawerResource);
  };
  const label = useMemo(() => getButtonLabelFromResource(resource), [resource]);

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Button
          intent={Intent.PRIMARY}
          icon={<Icon icon="plus" />}
          onClick={handleCreateBtnClick}
          minimal
        >
          {label}
        </Button>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}
export const BrandingTemplateActionsBar = compose(withDrawerActions)(
  BrandingTemplateActionsBarRoot,
);
