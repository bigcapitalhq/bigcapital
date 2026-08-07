// @ts-nocheck
import { Classes } from '@blueprintjs/core';
import { InvoiceCustomizeContent } from './InvoiceCustomizeContent';
import { Box } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { BrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';

export function InvoiceCustomize() {
  const { payload } = useDrawerContext();
  const templateId = payload.templateId;

  return (
    <Box className={Classes.DRAWER_BODY}>
      <BrandingTemplateBoot templateId={templateId}>
        <InvoiceCustomizeContent />
      </BrandingTemplateBoot>
    </Box>
  );
}
