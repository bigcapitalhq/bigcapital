// @ts-nocheck
import { Button, Classes, Intent } from '@blueprintjs/core';
import * as R from 'ramda';
import { BrandingTemplateActionsBar } from './BrandingTemplatesActionsBar';
import { BrandingTemplatesBoot } from './BrandingTemplatesBoot';
import { BrandingTemplatesTable } from './BrandingTemplatesTable';
import { Box, Card, DrawerHeaderContent, Group } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

export function BrandingTemplateContent() {
  return (
    <Box>
      <DrawerHeaderContent
        name={DRAWERS.BRANDING_TEMPLATES}
        title={'Branding Templates'}
      />
      <Box className={Classes.DRAWER_BODY}>
        <BrandingTemplatesBoot>
          <BrandingTemplateActionsBar />

          <Card style={{ padding: 0 }}>
            <BrandingTemplatesTable />
          </Card>
        </BrandingTemplatesBoot>
      </Box>
    </Box>
  );
}

const BrandingTemplateHeader = R.compose(withDrawerActions)(({
  openDrawer,
}) => {
  const handleCreateBtnClick = () => {
    openDrawer(DRAWERS.INVOICE_CUSTOMIZE);
  };
  return (
    <Group>
      <Button intent={Intent.PRIMARY} onClick={handleCreateBtnClick}>
        Create Invoice Branding
      </Button>
    </Group>
  );
});

BrandingTemplateHeader.displayName = 'BrandingTemplateHeader';
